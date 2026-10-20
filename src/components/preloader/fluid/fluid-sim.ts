/*
 * WebGL 流体模拟（首屏开场效果）
 *
 * 算法与着色器改编自 Pavel Dobryakov 的 WebGL-Fluid-Simulation（MIT License,
 * Copyright (c) 2017 Pavel Dobryakov）。本文件为 TypeScript 精简移植：
 * - 移除 bloom / sunrays（视觉不需要，代码量减半）
 * - 增加生命周期控制 start / stop / destroy，便于作为可卸载的 React 组件
 * - 指针交互绑定在传入的 canvas 上，而不是全局 document
 */

"use client";

type RGB = { r: number; g: number; b: number };

export type FluidSimOptions = {
  /** 是否自动周期性喷发彩色染料（默认 true） */
  autoSplats?: boolean;
  /** 背景色，0-1 区间（默认近黑） */
  backColor?: RGB;
};

type Pointer = {
  id: number;
  texcoordX: number;
  texelSizeX?: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: RGB;
};

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap(): void;
};

type TexFormat = { internalFormat: number; format: number };

type GLExt = {
  formatRGBA: TexFormat;
  formatRG: TexFormat;
  formatR: TexFormat;
  halfFloatTexType: number;
  supportLinearFiltering: boolean;
};

const CONFIG = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  DENSITY_DISSIPATION: 1.0,
  VELOCITY_DISSIPATION: 0.25,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 28,
  SPLAT_RADIUS: 0.22,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLORFUL: true,
  COLOR_UPDATE_SPEED: 8,
};

export function createFluidSim(canvas: HTMLCanvasElement, options: FluidSimOptions = {}) {
  const backColor = options.backColor ?? { r: 0.04, g: 0.04, b: 0.06 };
  const autoSplats = options.autoSplats !== false;

  const params = { alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
  const gl = (canvas.getContext("webgl2", params) ||
    canvas.getContext("webgl", params)) as WebGL2RenderingContext | null;
  if (!gl) return null;

  const isWebGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
  let halfFloatExt: { HALF_FLOAT_OES: number } | null = null;
  let supportLinearFiltering = false;
  if (isWebGL2) {
    gl.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
  } else {
    halfFloatExt = gl.getExtension("OES_texture_half_float") as { HALF_FLOAT_OES: number } | null;
    supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
  }
  const halfFloatTexType = isWebGL2
    ? gl.HALF_FLOAT
    : halfFloatExt
      ? halfFloatExt.HALF_FLOAT_OES
      : gl.UNSIGNED_BYTE;

  function supportRenderTextureFormat(internalFormat: number, format: number, type: number) {
    const texture = gl!.createTexture();
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fbo = gl!.createFramebuffer();
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
    return gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE;
  }

  function getSupportedFormat(internalFormat: number, format: number, type: number): TexFormat | null {
    if (supportRenderTextureFormat(internalFormat, format, type)) {
      return { internalFormat, format };
    }
    if (!isWebGL2) return null;
    const g = gl as WebGL2RenderingContext;
    switch (internalFormat) {
      case g.R16F:
        return getSupportedFormat(g.RG16F, g.RG, type);
      case g.RG16F:
        return getSupportedFormat(g.RGBA16F, g.RGBA, type);
      default:
        return null;
    }
  }

  let ext: GLExt | null = null;
  if (isWebGL2) {
    const g = gl as WebGL2RenderingContext;
    const rgba = getSupportedFormat(g.RGBA16F, g.RGBA, halfFloatTexType);
    const rg = getSupportedFormat(g.RG16F, g.RG, halfFloatTexType);
    const r = getSupportedFormat(g.R16F, g.RED, halfFloatTexType);
    if (!rgba || !rg || !r) return null;
    ext = { formatRGBA: rgba, formatRG: rg, formatR: r, halfFloatTexType, supportLinearFiltering };
  } else {
    const rgba = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
    if (!rgba) return null;
    ext = { formatRGBA: rgba, formatRG: rgba, formatR: rgba, halfFloatTexType, supportLinearFiltering };
  }

  const dyeResTarget = supportLinearFiltering ? CONFIG.DYE_RESOLUTION : 512;
  const simResTarget = supportLinearFiltering ? CONFIG.SIM_RESOLUTION : 128;

  // ---------- 着色器 ----------

  function compileShader(type: number, source: string, keywords?: string[]) {
    let src = source;
    if (keywords && keywords.length) {
      src = keywords.map((k) => `#define ${k}\n`).join("") + source;
    }
    const shader = gl!.createShader(type)!;
    gl!.shaderSource(shader, src);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.warn("[fluid] shader error:", gl!.getShaderInfoLog(shader));
    }
    return shader;
  }

  function createProgram(vs: WebGLShader, fs: WebGLShader) {
    const program = gl!.createProgram()!;
    gl!.attachShader(program, vs);
    gl!.attachShader(program, fs);
    gl!.bindAttribLocation(program, 0, "aPosition");
    gl!.linkProgram(program);
    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
      console.warn("[fluid] program link error:", gl!.getProgramInfoLog(program));
    }
    return program;
  }

  function getUniforms(program: WebGLProgram) {
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl!.getActiveUniform(program, i);
      if (!info) continue;
      const loc = gl!.getUniformLocation(program, info.name);
      if (loc) uniforms[info.name] = loc;
    }
    return uniforms;
  }

  class Program {
    program: WebGLProgram;
    uniforms: Record<string, WebGLUniformLocation>;
    constructor(fragmentSource: string, keywords?: string[]) {
      this.program = createProgram(baseVertex, compileShader(gl!.FRAGMENT_SHADER, fragmentSource, keywords));
      this.uniforms = getUniforms(this.program);
    }
    bind() {
      gl!.useProgram(this.program);
    }
  }

  const baseVertex = compileShader(
    gl.VERTEX_SHADER,
    `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(texelSize.x, 0.0);
      vR = vUv + vec2(texelSize.x, 0.0);
      vT = vUv + vec2(0.0, texelSize.y);
      vB = vUv - vec2(0.0, texelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `,
  );

  const displayShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform vec2 texelSize;
    void main () {
      vec3 c = texture2D(uTexture, vUv).rgb;
      #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
      #endif
      gl_FragColor = vec4(c, 1.0);
    }
  `;

  const splatShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main () {
      vec2 p = vUv - point.xy;
      p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.0);
    }
  `;

  const advectionShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;
    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5;
      vec2 iuv = floor(st);
      vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }
    void main () {
      #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
      #endif
      float decay = 1.0 + dissipation * dt;
      gl_FragColor = result / decay;
    }
  `;

  const divergenceShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).x;
      float R = texture2D(uVelocity, vR).x;
      float T = texture2D(uVelocity, vT).y;
      float B = texture2D(uVelocity, vB).y;
      vec2 C = texture2D(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; }
      if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; }
      if (vB.y < 0.0) { B = -C.y; }
      float div = 0.5 * (R - L + T - B);
      gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `;

  const curlShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uVelocity, vL).y;
      float R = texture2D(uVelocity, vR).y;
      float T = texture2D(uVelocity, vT).x;
      float B = texture2D(uVelocity, vB).x;
      float vorticity = R - L - T + B;
      gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `;

  const vorticityShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
      float L = texture2D(uCurl, vL).x;
      float R = texture2D(uCurl, vR).x;
      float T = texture2D(uCurl, vT).x;
      float B = texture2D(uCurl, vB).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C;
      force.y *= -1.0;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity += force * dt;
      velocity = min(max(velocity, -1000.0), 1000.0);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `;

  const pressureShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      float divergence = texture2D(uDivergence, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `;

  const gradientSubtractShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
      float L = texture2D(uPressure, vL).x;
      float R = texture2D(uPressure, vR).x;
      float T = texture2D(uPressure, vT).x;
      float B = texture2D(uPressure, vB).x;
      vec2 velocity = texture2D(uVelocity, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `;

  const clearShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
      gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `;

  const shadeKeywords = CONFIG.SHADING ? ["SHADING"] : undefined;
  const displayProgram = new Program(displayShader, shadeKeywords);
  const splatProgram = new Program(splatShader);
  const advectionProgram = new Program(
    advectionShader,
    supportLinearFiltering ? undefined : ["MANUAL_FILTERING"],
  );
  const divergenceProgram = new Program(divergenceShader);
  const curlProgram = new Program(curlShader);
  const vorticityProgram = new Program(vorticityShader);
  const pressureProgram = new Program(pressureShader);
  const gradientSubtractProgram = new Program(gradientSubtractShader);
  const clearProgram = new Program(clearShader);

  // ---------- 全屏四边形 ----------

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function blit(target: FBO | null) {
    if (target == null) {
      gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    } else {
      gl!.viewport(0, 0, target.width, target.height);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
    }
    gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
  }

  // ---------- 帧缓冲 ----------

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): FBO {
    gl!.activeTexture(gl!.TEXTURE0);
    const texture = gl!.createTexture()!;
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl!.createFramebuffer()!;
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
    gl!.viewport(0, 0, w, h);
    gl!.clearColor(backColor.r, backColor.g, backColor.b, 1);
    gl!.clear(gl!.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1 / w,
      texelSizeY: 1 / h,
      attach(id: number) {
        gl!.activeTexture(gl!.TEXTURE0 + id);
        gl!.bindTexture(gl!.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): DoubleFBO {
    const fbo1 = createFBO(w, h, internalFormat, format, type, filter);
    const fbo2 = createFBO(w, h, internalFormat, format, type, filter);
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      read: fbo1,
      write: fbo2,
      swap() {
        const t = this.read;
        this.read = this.write;
        this.write = t;
      },
    };
  }

  function deleteFBO(f: FBO) {
    gl!.deleteTexture(f.texture);
    gl!.deleteFramebuffer(f.fbo);
  }

  function deleteDoubleFBO(f: DoubleFBO) {
    deleteFBO(f.read);
    deleteFBO(f.write);
  }

  function getResolution(resolution: number) {
    let aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    if (gl!.drawingBufferWidth > gl!.drawingBufferHeight) {
      return { width: max, height: min };
    }
    return { width: min, height: max };
  }

  let dye: DoubleFBO;
  let velocity: DoubleFBO;
  let divergenceFBO: FBO;
  let curlFBO: FBO;
  let pressure: DoubleFBO;

  function initFramebuffers() {
    // 重建前释放旧的，避免窗口 resize 时泄漏显存
    if (dye) deleteDoubleFBO(dye);
    if (velocity) deleteDoubleFBO(velocity);
    if (divergenceFBO) deleteFBO(divergenceFBO);
    if (curlFBO) deleteFBO(curlFBO);
    if (pressure) deleteDoubleFBO(pressure);

    const simRes = getResolution(simResTarget);
    const dyeRes = getResolution(dyeResTarget);
    dye = createDoubleFBO(dyeRes.width, dyeRes.height, ext!.formatRGBA.internalFormat, ext!.formatRGBA.format, ext!.halfFloatTexType, dyeFilter);
    velocity = createDoubleFBO(simRes.width, simRes.height, ext!.formatRG.internalFormat, ext!.formatRG.format, ext!.halfFloatTexType, dyeFilter);
    divergenceFBO = createFBO(simRes.width, simRes.height, ext!.formatR.internalFormat, ext!.formatR.format, ext!.halfFloatTexType, gl!.NEAREST);
    curlFBO = createFBO(simRes.width, simRes.height, ext!.formatR.internalFormat, ext!.formatR.format, ext!.halfFloatTexType, gl!.NEAREST);
    pressure = createDoubleFBO(simRes.width, simRes.height, ext!.formatR.internalFormat, ext!.formatR.format, ext!.halfFloatTexType, gl!.NEAREST);
  }

  const dyeFilter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

  // ---------- 指针与染料 ----------

  function pointerPrototype(): Pointer {
    return {
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: { r: 0.15, g: 0, b: 0.3 },
    };
  }

  const pointers: Pointer[] = [pointerPrototype()];
  const splatStack: number[] = [];
  let colorUpdateTimer = 0;

  function HSVtoRGB(h: number, s: number, v: number): RGB {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return { r, g, b };
  }

  function generateColor(): RGB {
    const c = HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
  }

  function updateColors(dt: number) {
    if (!CONFIG.COLORFUL) return;
    colorUpdateTimer += dt * CONFIG.COLOR_UPDATE_SPEED;
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer %= 1;
      pointers.forEach((p) => {
        p.color = generateColor();
      });
    }
  }

  function splatPointer(pointer: Pointer) {
    const dx = pointer.deltaX * CONFIG.SPLAT_FORCE;
    const dy = pointer.deltaY * CONFIG.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      splat(x, y, dx, dy, color);
    }
  }

  function correctDeltaX(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }

  function correctDeltaY(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) radius *= aspectRatio;
    return radius;
  }

  function splat(x: number, y: number, dx: number, dy: number, color: RGB) {
    splatProgram.bind();
    gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl!.uniform2f(splatProgram.uniforms.point, x, y);
    gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl!.uniform1f(splatProgram.uniforms.radius, correctRadius(CONFIG.SPLAT_RADIUS / 100.0));
    blit(velocity.write);
    velocity.swap();

    gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl!.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
  }

  function step(dt: number) {
    gl!.disable(gl!.BLEND);

    curlProgram.bind();
    gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curlFBO);

    vorticityProgram.bind();
    gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl!.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
    gl!.uniform1f(vorticityProgram.uniforms.curl, CONFIG.CURL);
    gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergenceFBO);

    clearProgram.bind();
    gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl!.uniform1f(clearProgram.uniforms.value, CONFIG.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergenceFBO.attach(0));
    for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
      gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradientSubtractProgram.bind();
    gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
    gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!supportLinearFiltering) {
      gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    }
    const velocityId = velocity.read.attach(0);
    gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl!.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl!.uniform1f(advectionProgram.uniforms.dt, dt);
    gl!.uniform1f(advectionProgram.uniforms.dissipation, CONFIG.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    if (!supportLinearFiltering) {
      gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    }
    gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl!.uniform1f(advectionProgram.uniforms.dissipation, CONFIG.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();
  }

  function render() {
    displayProgram.bind();
    gl!.uniform2f(displayProgram.uniforms.texelSize, dye.texelSizeX, dye.texelSizeY);
    gl!.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
    blit(null);
  }

  // ---------- 主循环 ----------

  let lastUpdateTime = performance.now();
  let rafId = 0;
  let running = false;
  let autoSplatTimer = 0;

  function updateFrame(now: number) {
    if (!running) return;
    const dt = Math.min((now - lastUpdateTime) / 1000, 0.066);
    lastUpdateTime = now;

    if (resizeCanvas()) initFramebuffers();
    updateColors(dt);

    if (autoSplats) {
      autoSplatTimer += dt;
      if (autoSplatTimer > 1.6) {
        autoSplatTimer = 0;
        multipleSplats(1 + Math.floor(Math.random() * 2));
      }
    }

    applyInputs();
    step(dt);
    render();
    rafId = requestAnimationFrame(updateFrame);
  }

  function applyInputs() {
    if (splatStack.length > 0) multipleSplats(splatStack.pop()!);
    pointers.forEach((p) => {
      if (p.moved) {
        p.moved = false;
        splatPointer(p);
      }
    });
  }

  function scaleByPixelRatio(input: number) {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    return Math.floor(input * pixelRatio);
  }

  function resizeCanvas() {
    const width = scaleByPixelRatio(canvas.clientWidth);
    const height = scaleByPixelRatio(canvas.clientHeight);
    if (width === 0 || height === 0) return false;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  // ---------- 交互（绑定在 canvas 上，随 destroy 一并移除） ----------

  function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1 - posY / canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = generateColor();
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1 - posY / canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  }

  function onPointerDown(e: PointerEvent) {
    updatePointerDownData(pointers[0], -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY));
  }

  function onPointerMove(e: PointerEvent) {
    const pointer = pointers[0];
    const posX = scaleByPixelRatio(e.clientX);
    const posY = scaleByPixelRatio(e.clientY);
    if (!pointer.down) {
      // 未按下也跟随，让画面保持"活"的状态（类似 SimonAKing 首页的观感）
      updatePointerDownData(pointer, -1, posX, posY);
      return;
    }
    updatePointerMoveData(pointer, posX, posY);
  }

  function onPointerUp() {
    pointers[0].down = false;
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerUp);

  // ---------- 启动 / 销毁 ----------

  function start() {
    if (running) return;
    running = true;
    lastUpdateTime = performance.now();
    resizeCanvas();
    initFramebuffers();
    multipleSplats(Math.floor(Math.random() * 12) + 6);
    rafId = requestAnimationFrame(updateFrame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function destroy() {
    stop();
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointerleave", onPointerUp);
    const lose = gl!.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
  }

  start();

  return { destroy, pushSplats: (n: number) => splatStack.push(n) };
}

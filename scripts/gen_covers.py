"""生成项目封面图：暗色渐变 + 网格 + 噪点 + 大标题，风格与站点一致。"""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = "public/assets/projects-screenshots"
W, H = 1600, 1000

def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def gradient(c1, c2, c3=None, angle=135):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    a = math.radians(angle)
    dx, dy = math.cos(a), math.sin(a)
    # 投影到对角线方向
    maxp = abs(dx) * W + abs(dy) * H
    for y in range(H):
        for x in range(0, W, 4):
            p = (x * dx + y * dy) / maxp
            p = max(0.0, min(1.0, p))
            if c3 is None:
                col = lerp(c1, c2, p)
            elif p < 0.55:
                col = lerp(c1, c2, p / 0.55)
            else:
                col = lerp(c2, c3, (p - 0.55) / 0.45)
            d.rectangle([x, y, x + 4, y + 1], fill=col)
    return img

def add_glow(img, cx, cy, radius, color, strength=0.55):
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(radius * 0.45))
    return Image.blend(img, Image.composite(glow, img, glow.convert("L").point(lambda v: int(v * strength))), 0.85)

def add_grid(img, color=(255, 255, 255), step=64, alpha=18):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=color + (alpha,), width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=color + (alpha,), width=1)
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")

def add_noise(img, amount=8):
    px = img.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            n = random.randint(-amount, amount)
            r, g, b = px[x, y]
            px[x, y] = (max(0, min(255, r+n)), max(0, min(255, g+n)), max(0, min(255, b+n)))
    return img

def load_font(size, bold=True):
    cands = [
        r"C:/Windows/Fonts/msyhbd.ttc" if bold else r"C:/Windows/Fonts/msyh.ttc",
        r"C:/Windows/Fonts/segoeuib.ttf" if bold else r"C:/Windows/Fonts/segoeui.ttf",
        r"C:/Windows/Fonts/arialbd.ttf",
    ]
    for c in cands:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()

def build(slug, c1, c2, c3, accent, kicker, title, subtitle, tags):
    random.seed(hash(slug) & 0xffff)
    img = gradient(hex2rgb(c1), hex2rgb(c2), hex2rgb(c3))
    img = add_glow(img, int(W*0.78), int(H*0.22), 420, hex2rgb(accent), 0.5)
    img = add_glow(img, int(W*0.12), int(H*0.88), 380, hex2rgb(accent), 0.28)
    img = add_grid(img)
    img = add_noise(img, 7)

    d = ImageDraw.Draw(img)
    # 左侧竖线装饰
    d.rectangle([96, 250, 104, 250 + 210], fill=hex2rgb(accent))

    f_kick = load_font(30)
    f_title = load_font(92)
    f_sub = load_font(36)
    f_tag = load_font(28)

    x = 152
    d.text((x, 246), kicker, font=f_kick, fill=hex2rgb(accent))
    d.text((x, 292), title, font=f_title, fill=(255, 255, 255))
    d.text((x, 452), subtitle, font=f_sub, fill=(190, 200, 215))

    # tags
    ty = 572
    tx = x
    for t in tags:
        tw = d.textlength(t, font=f_tag)
        pad = 22
        if tx + tw + pad * 2 > W - 120:
            tx = x
            ty += 62
        d.rounded_rectangle([tx, ty, tx + tw + pad*2, ty + 52], radius=26,
                            outline=hex2rgb(accent) + ()) if False else None
        d.rounded_rectangle([tx, ty, tx + tw + pad*2, ty + 52], radius=26,
                            outline=hex2rgb(accent), width=2)
        d.text((tx + pad, ty + 10), t, font=f_tag, fill=(225, 232, 242))
        tx += tw + pad * 2 + 16

    os.makedirs(f"{OUT}/{slug}", exist_ok=True)
    img.save(f"{OUT}/{slug}/cover.jpg", quality=90, optimize=True)
    print(f"{slug}/cover.jpg  {os.path.getsize(f'{OUT}/{slug}/cover.jpg')//1024}KB")


build("hotel-management", "#0a1310", "#16302a", "#07100c", "#d9b779",
      "SPRING BOOT  /  VUE 3  /  HOTEL PMS",
      "来财酒店 PMS",
      "33 张表 · 27 个后端模块 · 前台到财务全流程",
      ["Spring Boot 3.5", "Vue 3", "MyBatis-Plus", "多租户", "uni-app"])

build("huana-mall", "#160a1e", "#3a1240", "#1a0a22", "#ff5fa2",
      "TARO  /  WECHAT MINI PROGRAM",
      "电商小程序",
      "27 个页面 · 从浏览到售后的完整链路",
      ["Taro 4", "React", "TypeScript", "Tailwind", "微信小程序"])

build("portfolio-site", "#050a0c", "#0d2226", "#061114", "#8ef0a4",
      "NEXT.JS  /  WEBGL",
      "本站 · 作品集",
      "流体模拟 + 3D 键盘 + 终端交互",
      ["Next.js 16", "WebGL", "GLSL", "GSAP", "静态导出"])

build("knowledge-hub", "#06101c", "#122b52", "#071426", "#6aa8ff",
      "SELF-HOSTED RAG  /  AGENT WORKFLOW",
      "知识库与 Agent 工作流",
      "文档入库 · 向量检索 · Agent 编排 · 工作流可视化",
      ["Next.js", "TypeScript", "PostgreSQL", "Docker", "Python"])

build("yudao-designer", "#0a1016", "#143036", "#071214", "#4fd6c2",
      "SPRING BOOT  /  YUDAO  /  HOME DESIGN",
      "设计师家装服务平台",
      "芋道二次开发 · 设计师 + 家装案例两个自研模块 · 300 个类",
      ["Spring Boot 2.x", "Java", "MyBatis", "多租户", "Vue"])

build("asean-risk", "#0d0a18", "#2c1640", "#12081f", "#ff7a59",
      "CROSS-BORDER RISK WARNING  /  2nd PRIZE",
      "东盟跨境风控预警平台",
      "中小商户智能评分 · 可解释评分卡 · 竞赛二等奖",
      ["Spring Boot 3.3", "Java 21", "Vue 2", "ECharts", "微信小程序"])

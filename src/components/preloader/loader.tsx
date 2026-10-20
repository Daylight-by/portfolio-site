"use client";

import styles from "./style.module.scss";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

import { hintIn, nameIn, slideUp } from "./anim";
import { usePreloader } from ".";
import { config } from "@/data/config";

type FluidSim = {
  destroy: () => void;
  pushSplats: (n: number) => void;
};

/**
 * 首屏开屏：全屏 WebGL 流体动画 + "向下滚动进入"提示。
 *
 * 与旧版百分比加载页的区别：
 * - 没有进度数字，流体本身就是"我在加载 / 我已经准备好了"的表达
 * - 不会自己消失，必须由用户滚动 / 滑动 / 回车 / 点击提示才会退场
 * - 减弱动效或 WebGL 不可用时退化为静态渐变背景，提示保持不变
 */
export default function Index() {
  const { enter, reduceMotion, perfReady } = usePreloader();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<FluidSim | null>(null);

  useEffect(() => {
    // 等设备画像就绪，避免首帧 reducedMotion 默认 true 造成误判
    if (!perfReady || reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let burstTimer = 0;

    // 动态引入：把着色器与模拟循环拆成独立 chunk，不进首屏主包
    import("./fluid/fluid-sim")
      .then(({ createFluidSim }) => {
        if (cancelled) return;
        const sim = createFluidSim(canvas, { autoSplats: true });
        if (!sim) return; // WebGL 不可用 —— 直接用 CSS 兜底背景
        simRef.current = sim;
        // 稍后再补一次爆发，形成"从中间扩散开"的观感
        burstTimer = window.setTimeout(() => simRef.current?.pushSplats(7), 850);
      })
      .catch((err) => {
        console.warn("[splash] 流体动画加载失败，已降级为静态背景", err);
      });

    return () => {
      cancelled = true;
      window.clearTimeout(burstTimer);
      simRef.current?.destroy();
      simRef.current = null;
    };
  }, [perfReady, reduceMotion]);

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className={styles.introduction}
    >
      <canvas ref={canvasRef} className={styles.fluid} aria-hidden="true" />
      <div className={styles.veil} aria-hidden="true" />

      <motion.div
        variants={nameIn}
        initial="initial"
        animate="enter"
        exit="exit"
        className={styles.name}
      >
        <h1>{config.name}</h1>
        <span>作品集 · Portfolio</span>
      </motion.div>

      <motion.div
        variants={hintIn}
        initial="initial"
        animate="enter"
        exit="exit"
        className={styles.hintWrap}
      >
        <button type="button" className={styles.hint} onClick={enter}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>向下滚动进入</span>
        </button>
      </motion.div>
    </motion.div>
  );
}

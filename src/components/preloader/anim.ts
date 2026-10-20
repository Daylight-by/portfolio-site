/**
 * 开屏（Splash）动画变体。
 *
 * 与旧版"百分比加载页"的区别：
 * - 不再有数字进度条与 SVG 曲线（曲线会整块盖住流体画布）
 * - 整个开屏面板整体上滑退出，露出下方的主界面
 * - 文案与"向下滚动进入"提示单独做淡入 / 淡出，退出时先走，上滑随后跟上
 */

export const opacity = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 0.75,
    transition: { duration: 1, delay: 0.2 },
  },
};

/** 开屏面板整体上滑退出。注意：元素必须用 top/left/width/height 定位，
 *  不能用 inset:0 —— 否则动画 top 时元素会被拉长。 */
export const slideUp = {
  initial: {
    top: 0,
  },
  exit: {
    top: "-100dvh",
    transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const },
  },
};

/** 居中的名字 / 标题 */
export const nameIn = {
  initial: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(10px)",
    transition: { duration: 0.32, ease: "easeOut" as const },
  },
};

/** 底部"向下滚动进入"提示 */
export const hintIn = {
  initial: {
    opacity: 0,
    y: 14,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

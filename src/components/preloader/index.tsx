"use client";
import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useCallback,
  useRef,
} from "react";
import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

import Loader from "./loader";
import { usePerfProfile } from "@/hooks/use-perf-profile";

type PreloaderContextType = {
  /** 开屏是否还在展示中 */
  isLoading: boolean;
  /** 兼容旧调用方（ElasticCursor 的加载条）。开屏改为流体后恒为 0。 */
  loadingPercent: number;
  /** 设备画像是否已就绪（避免首帧 reducedMotion 默认 true 造成误判） */
  perfReady: boolean;
  /** 用户偏好 / 系统偏好为"减弱动效" */
  reduceMotion: boolean;
  /** 用户主动进入主界面：滚动 / 滑动 / 键盘 / 点击提示 */
  enter: () => void;
  /** 兼容旧调用方：过去表示"内容已就绪，可以关掉开屏了"。
   *  现在开屏只由用户手势关闭，因此这里仅作空实现，不再抢跑。 */
  bypassLoading: () => void;
};
const INITIAL: PreloaderContextType = {
  isLoading: true,
  loadingPercent: 0,
  perfReady: false,
  reduceMotion: false,
  enter: () => {},
  bypassLoading: () => {},
};
export const preloaderContext = createContext<PreloaderContextType>(INITIAL);

type PreloaderProps = {
  children: ReactNode;
  disabled?: boolean;
};

export const usePreloader = () => {
  const context = useContext(preloaderContext);
  if (!context) {
    throw new Error("usePreloader must be used within a PreloaderProvider");
  }
  return context;
};

/** 触发进入所需的滚动距离（触摸）/ 滚轮阈值 */
const TOUCH_THRESHOLD = 56;
const WHEEL_THRESHOLD = 4;

function Preloader({ children, disabled = false }: PreloaderProps) {
  const pathname = usePathname();
  // 开屏只属于首页 —— 内页（/blogs、/resume）直接进，否则会被手势拦住出不去。
  const isHome = pathname === "/";
  const skip = disabled || !isHome;

  const [isLoading, setIsLoading] = useState(!skip);
  const enteredRef = useRef(false);

  const { reducedMotion, ready: perfReady } = usePerfProfile();

  const enter = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    // 兜底：确保主界面从顶部开始（浏览器/ Lenis 可能带着旧滚动位置）
    window.scrollTo(0, 0);
    setIsLoading(false);
  }, []);

  const bypassLoading = useCallback(() => {
    /* 开屏由用户手势驱动，不再自动关闭 */
  }, []);

  // 关掉浏览器的滚动位置恢复，避免刷新后开屏还没退，主界面已经滚到中间
  useEffect(() => {
    if (skip) return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, [skip]);

  // 开屏期间锁死页面滚动（同时挡住 Lenis 的原生滚动通路）
  useEffect(() => {
    if (!isLoading) return;
    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevOverscroll = documentElement.style.overscrollBehavior;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
      documentElement.style.overscrollBehavior = prevOverscroll;
    };
  }, [isLoading]);

  // 进入手势：滚轮 / 触摸滑动 / 键盘。
  // wheel 与 touchmove 必须 passive:false 并 preventDefault —— 否则第一次滚动
  // 会"一边进入开屏一边把主界面滚走"。
  useEffect(() => {
    if (!isLoading) return;

    let touchStartY = 0;
    let touchTracking = false;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (
        Math.abs(e.deltaY) < WHEEL_THRESHOLD &&
        Math.abs(e.deltaX) < WHEEL_THRESHOLD
      ) {
        return;
      }
      enter();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches.length) return;
      touchStartY = e.touches[0].clientY;
      touchTracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchTracking || !e.touches.length) return;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dy) > TOUCH_THRESHOLD) {
        touchTracking = false;
        enter();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " " ||
        e.key === "Spacebar" ||
        e.key === "Enter"
      ) {
        enter();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLoading, enter]);

  return (
    <preloaderContext.Provider
      value={{
        isLoading,
        loadingPercent: 0,
        perfReady,
        reduceMotion: reducedMotion,
        enter,
        bypassLoading,
      }}
    >
      <AnimatePresence mode="wait">{isLoading && <Loader />}</AnimatePresence>
      {children}
    </preloaderContext.Provider>
  );
}

export default Preloader;

"use client";

import { useEffect, useState } from "react";

/**
 * Shared desktop gate. Returns true only once, on the client, for viewports
 * of 768px and up. Scroll-linked / ambient FX mount themselves only when this
 * is true, so touch devices never run useScroll listeners, springs, or rAF.
 *
 * Kept separate from `useReducedMotion()` (from motion/react) on purpose:
 * reduced motion is a *preference* that also disables non-scroll FX; this
 * hook is purely about viewport width.
 */
export function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}
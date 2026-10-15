"use client";

import { useEffect, useState } from "react";

export function useScrollAnimation() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    // Only enable scroll-linked animations on non-touch, desktop devices
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const noReduce = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(isDesktop && noReduce);
  }, []);
  return enabled;
}
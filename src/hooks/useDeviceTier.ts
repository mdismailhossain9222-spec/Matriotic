"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "medium" | "low";

function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("medium");

  useEffect(() => {
    const check = () => {
      // Feature detection - old browsers missing these = low tier
      const hasIntersectionObserver = "IntersectionObserver" in window;
      const hasResizeObserver = "ResizeObserver" in window;
      const hasMatchMedia = "matchMedia" in window;
      const CSS: any = window.CSS;
      const hasCSS = CSS && CSS.supports;

      // CSS feature support
      const supportsSvh = hasCSS && CSS.supports("height", "100svh");
      const supportsGrid = hasCSS && CSS.supports("display", "grid");
      const supportsBackdrop = hasCSS && CSS.supports("backdrop-filter", "blur(1px)");

      // Hardware signals (not perfect but useful)
      const cores = navigator.hardwareConcurrency || 2;
      const memory = (navigator as any).deviceMemory || 2; // GB
      const connection = (navigator as any).connection;
      const saveData = connection?.saveData === true;
      const slowNet = connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g";

      // Reduced motion preference
      const prefersReduced = hasMatchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Score calculation
      let score = 0;
      if (hasIntersectionObserver) score += 1;
      if (hasResizeObserver) score += 1;
      if (supportsGrid) score += 1;
      if (supportsBackdrop) score += 1;
      if (supportsSvh) score += 1;
      if (cores >= 4) score += 2;
      if (cores >= 6) score += 1;
      if (memory >= 4) score += 2;
      if (memory >= 6) score += 1;

      // Penalties
      if (saveData) score -= 3;
      if (slowNet) score -= 3;
      if (prefersReduced) score -= 5;

      if (score >= 8) setTier("high");
      else if (score >= 4) setTier("medium");
      else setTier("low");
    };

    check();

    // Re-check on network change
    const connection = (navigator as any).connection;
    if (connection?.addEventListener) {
      connection.addEventListener("change", check);
      return () => connection.removeEventListener("change", check);
    }
  }, []);

  return tier;
}

export { useDeviceTier };
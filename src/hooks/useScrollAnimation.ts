"use client";

import { useEffect, useState } from "react";
import { useDeviceTier } from "./useDeviceTier";

export function useScrollAnimation() {
  const tier = useDeviceTier();
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Only high tier + no reduced motion gets scroll animations
  return tier === "high" && !reduce;
}

export function shouldAnimate() {
  const tier = useDeviceTier();
  return tier === "high";
}
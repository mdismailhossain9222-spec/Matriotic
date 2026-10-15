"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";

type Phase = "playing" | "exiting" | "gone";

function lockScroll() {
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  window.__msLenis?.stop?.();
}

function unlockScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  window.__msLenis?.start?.();
}

export default function Preloader() {
  // SSR must always render the preloader so the intro works pre-hydration.
  const [phase, setPhase] = useState<Phase>("playing");
  const seenRef = useRef(false);
  const dispatchedRef = useRef(false);
  const timers = useRef<number[]>([]);

  const announceDone = useCallback(() => {
    if (dispatchedRef.current) return;
    dispatchedRef.current = true;
    window.__msPreloaderDone = true;
    window.dispatchEvent(new Event("ms:preloader-done"));
  }, []);

  useEffect(() => {
    // The inline script already decided: window.__msPlShouldPlay === false means skip.
    const shouldPlay = window.__msPlShouldPlay !== false;
    seenRef.current = !shouldPlay;
    if (!shouldPlay) {
      if (!window.__msPreloaderDone) announceDone();
      setPhase("gone");
      return;
    }

    lockScroll();
    window.__msPreloaderClear?.(); // React is alive — component now owns the lifecycle

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitAt = reduced ? 780 : 2950;
    const goneAt = reduced ? 1050 : 3650;

    timers.current.push(
      window.setTimeout(() => {
        try {
          announceDone();
        } finally {
          setPhase("exiting");
        }
      }, exitAt),
      window.setTimeout(() => {
        try {
          unlockScroll();
        } finally {
          setPhase("gone");
        }
      }, goneAt),
      // failsafe: always leave in under 4s, even if timers misbehave
      window.setTimeout(() => {
        try {
          announceDone();
        } finally {
          setPhase("gone");
        }
        unlockScroll();
      }, 3900),
    );

    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
      try {
        unlockScroll();
      } finally {
        // no-op: component unmount cleanup
      }
    };
  }, [announceDone]);

  const skip = useCallback(() => {
    if (phase === "gone") return;
    announceDone();
    setPhase("exiting");
    window.setTimeout(() => {
      unlockScroll();
      setPhase("gone");
    }, 480);
  }, [phase, announceDone]);

  if (phase === "gone") return null;

  return (
    <div
      className={`preloader gpu ${phase === "exiting" ? "pl-exit" : ""}`}
      role="status"
      aria-label="Welcome to Matriotic Studios"
    >
      <div className="preloader-inner">
        <BrandLogo />
        <span className="preloader-shimmer" aria-hidden />
      </div>
      <button type="button" onClick={skip} className="preloader-skip">
        Skip
      </button>
    </div>
  );
}

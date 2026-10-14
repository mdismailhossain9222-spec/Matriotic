"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion, type MotionValue } from "motion/react";

const GOLD = "#D4AF37";

/** Desktop gate: scroll-linked / ambient FX are never mounted on mobile. */
function useDesktopFx() {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop && !reduce;
}

/**
 * Scroll-reactive orbit rings.
 * On touch/mobile the animated child is NOT mounted at all — a static SVG is
 * rendered instead, so there are zero scroll listeners, zero springs, zero rAF.
 */
export function OrbitRings({ className = "" }: { className?: string }) {
  const active = useDesktopFx();
  return (
    <div className={className} aria-hidden>
      {active ? <OrbitRingsAnimated /> : <RingsSvg rotate={undefined} scale={undefined} />}
    </div>
  );
}

function OrbitRingsAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 140]), {
    stiffness: 60,
    damping: 24,
    mass: 0.6,
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.05, 0.92]);
  return (
    <div ref={ref} className="h-full w-full">
      <RingsSvg rotate={rotate} scale={scale} />
    </div>
  );
}

function RingsSvg({
  rotate,
  scale,
}: {
  rotate?: MotionValue<number>;
  scale?: MotionValue<number>;
}) {
  return (
    <motion.svg viewBox="0 0 400 400" className="h-full w-full" style={rotate ? { rotate, scale } : undefined}>
      <defs>
        <linearGradient id="or-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.05" />
          <stop offset="50%" stopColor={GOLD} stopOpacity="0.85" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="196" stroke="url(#or-g)" strokeWidth="0.8" fill="none" />
      <circle cx="200" cy="200" r="150" stroke="url(#or-g)" strokeWidth="0.8" fill="none" />
      <circle cx="200" cy="200" r="104" stroke={GOLD} strokeOpacity="0.14" strokeWidth="0.8" fill="none" />
      <circle cx="200" cy="200" r="58" stroke="url(#or-g)" strokeWidth="0.8" fill="none" />
      {rotate ? (
        <>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            style={{ originX: "200px", originY: "200px" }}
          >
            <circle cx="200" cy="44" r="3.4" fill={GOLD} />
            <circle cx="350" cy="200" r="2" fill={GOLD} fillOpacity="0.6" />
          </motion.g>
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
            style={{ originX: "200px", originY: "200px" }}
          >
            <rect x="170" y="170" width="60" height="60" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.9" fill="none" />
          </motion.g>
        </>
      ) : (
        <>
          <g>
            <circle cx="200" cy="44" r="3.4" fill={GOLD} />
            <circle cx="350" cy="200" r="2" fill={GOLD} fillOpacity="0.6" />
          </g>
          <g>
            <rect x="170" y="170" width="60" height="60" stroke={GOLD} strokeOpacity="0.35" strokeWidth="0.9" fill="none" />
          </g>
        </>
      )}
    </motion.svg>
  );
}

/** Wireframe prism — desktop-only, hidden below lg by its className anyway. */
export function WirePrism({ className = "" }: { className?: string }) {
  const active = useDesktopFx();
  return (
    <div className={className} aria-hidden>
      {active ? <PrismAnimated /> : <PrismSvg y={undefined} rotate={undefined} />}
    </div>
  );
}

function PrismAnimated() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [60, -60]), {
    stiffness: 70,
    damping: 22,
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-18, 22]);
  return (
    <div ref={ref} className="h-full w-full">
      <PrismSvg y={y} rotate={rotate} />
    </div>
  );
}

function PrismSvg({
  y,
  rotate,
}: {
  y?: MotionValue<number>;
  rotate?: MotionValue<number>;
}) {
  return (
    <motion.svg viewBox="0 0 240 280" className="h-full w-full" style={y ? { y, rotate } : undefined}>
      <g stroke={GOLD} fill="none" strokeWidth="0.9" strokeLinejoin="round">
        <path d="M120 10 L228 72 L228 198 L120 262 L12 198 L12 72 Z" strokeOpacity="0.55" />
        <path d="M120 10 L120 136 M120 136 L228 72 M120 136 L12 72 M120 136 L120 262" strokeOpacity="0.28" />
        <path d="M12 198 L228 72 M228 198 L12 72" strokeOpacity="0.14" />
      </g>
      <circle cx="120" cy="136" r="2.6" fill={GOLD} />
    </motion.svg>
  );
}

/** Morphing dashed arcs — ambient rotation is desktop-only. */
export function ArcCluster({ className = "" }: { className?: string }) {
  const active = useDesktopFx();
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 320 320" className="h-full w-full">
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx="160"
            cy="160"
            r={40 + i * 36}
            fill="none"
            stroke={GOLD}
            strokeOpacity={0.3 - i * 0.055}
            strokeWidth="0.9"
            strokeDasharray="4 10"
            animate={active ? { rotate: i % 2 === 0 ? 360 : -360 } : undefined}
            transition={{ duration: 40 + i * 14, repeat: Infinity, ease: "linear" }}
            style={{ originX: "160px", originY: "160px" }}
          />
        ))}
      </svg>
    </div>
  );
}

/** Thin vertical guide lines that draw in on scroll (IO-driven, cheap). */
export function GuideLines({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`pointer-events-none grid ${className}`} style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="block h-full w-px justify-self-end bg-gradient-to-b from-transparent via-white/[0.07] to-transparent"
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ originY: 0 }}
        />
      ))}
    </div>
  );
}

/** Parallax wrapper — desktop: scroll-linked y; mobile: plain wrapper, no hooks. */
export function Parallax({
  children,
  distance = 70,
  className = "",
}: {
  children: React.ReactNode;
  distance?: number;
  className?: string;
}) {
  const active = useDesktopFx();
  if (!active) {
    return <div className={className}>{children}</div>;
  }
  return (
    <ParallaxY distance={distance} className={className}>
      {children}
    </ParallaxY>
  );
}

function ParallaxY({
  children,
  distance,
  className,
}: {
  children: React.ReactNode;
  distance: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), {
    stiffness: 80,
    damping: 26,
  });
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

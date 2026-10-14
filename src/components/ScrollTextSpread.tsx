"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { useDesktop } from "@/hooks/useViewport";

/**
 * Scroll-driven character spread.
 *
 * Each character of `text` starts spread away from the centre (horizontal
 * offset + rotateX) and converges into place as the user scrolls through the
 * section. Pure transform + opacity — no filter, shadow, width or height
 * animations — and fully disabled when prefers-reduced-motion is set.
 */

function joinClass(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
  reduceMotion: boolean;
  spread: number;
};

function Character({
  char,
  index,
  centerIndex,
  scrollYProgress,
  reduceMotion,
  spread,
}: CharacterProps) {
  const isSpace = char === " ";

  // Reduced motion: render the text statically, no transforms.
  if (reduceMotion) {
    return (
      <span className={joinClass("inline-block", isSpace && "w-4")}>{char}</span>
    );
  }

  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * spread, 0]);
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5],
    [distanceFromCenter * (spread * 0.8), 0]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);

  return (
    <motion.span
      className={joinClass("inline-block text-gold-soft", isSpace && "w-4")}
      style={{ x, rotateX, opacity, transformOrigin: "center" }}
    >
      {char}
    </motion.span>
  );
}

type Props = {
  text: string;
  subtitle?: string;
  className?: string;
};

export function ScrollTextSpread({ text, subtitle, className }: Props) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const desktop = useDesktop();
  const reduceMotion = useReducedMotion() ?? false;
  // Touch devices spread characters less — keeps the effect legible without
  // pushing content off-screen on narrow viewports.
  const spread = desktop ? 50 : 30;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <section
      ref={targetRef}
      className={joinClass(
        "relative box-border flex h-[140vh] sm:h-[160vh] items-center justify-center overflow-hidden bg-transparent px-4",
        className
      )}
    >
      <div className="w-full max-w-5xl text-center">
        {subtitle && (
          <p className="mb-6 text-xs sm:text-sm uppercase tracking-[0.2em] text-gold-soft/70">
            {subtitle}
          </p>
        )}
        <div
          className="u-display uppercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
          style={{ perspective: "500px" }}
        >
          {characters.map((char, index) => (
            <Character
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
              reduceMotion={reduceMotion}
              spread={spread}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
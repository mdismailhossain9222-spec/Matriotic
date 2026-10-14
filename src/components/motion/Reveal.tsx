"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as "div"] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

export function Stagger({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.075, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export { containerVariants, itemVariants, EASE };

/** Word-by-word stagger reveal for headlines. */
export function SplitHeading({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  accentFrom,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  /** index of the word where the gold italic accent begins */
  accentFrom?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-12% 0px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.055, delayChildren: delay } },
        }}
        className="inline"
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className={
                accentFrom !== undefined && i >= accentFrom
                  ? "inline-block italic u-gold-text pr-[0.26em]"
                  : "inline-block pr-[0.26em]"
              }
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: "110%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 0.95, ease: EASE },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

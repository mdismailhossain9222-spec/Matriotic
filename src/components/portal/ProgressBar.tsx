"use client";

import { motion } from "motion/react";

export default function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="mt-7 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.08]"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.span
        className="block h-full w-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: clamped / 100 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

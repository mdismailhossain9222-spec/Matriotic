"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "motion/react";

type CounterProps = {
  value: number;
  duration?: number;
  description: string;
  className?: string;
};

export default function Counter({ value, duration = 1.5, description, className }: CounterProps) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // EaseOutExpo
      const eased = progress === 1
        ? 1
        : 1 - Math.pow(2, -10 * progress);

      setDisplayed(Math.round(value * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <div ref={ref} className={className}>
      <span className="u-display text-4xl u-gold-text counter-value">{displayed}</span>
      <p className="mt-2 text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-mist">
        {description}
      </p>
    </div>
  );
}
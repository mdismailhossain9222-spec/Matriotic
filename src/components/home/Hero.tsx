"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { OrbitRings } from "../decor/GoldAssets";

const EASE = [0.22, 1, 0.36, 1] as const;

const WORDS = ["Digital", "experiences", "with"];

function useDesktop() {
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

/**
 * Scroll-driven hero shell — mounted ONLY on desktop so phones never run
 * useScroll listeners, springs, or per-frame style writes. The component
 * swap happens once right after hydration (usually beneath the preloader)
 * with identical geometry, so it is not visible.
 */
function HeroBackdrop({ animated, children }: { animated: boolean; children: React.ReactNode }) {
  return <div className="absolute inset-0 -z-10">{animated ? <BackdropDrift>{children}</BackdropDrift> : children}</div>;
}

function BackdropDrift({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 160]), { stiffness: 80, damping: 28 });
  return (
    <motion.div ref={ref} style={{ y }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

function HeroContent({ animated, children }: { animated: boolean; children: React.ReactNode }) {
  if (!animated) return <div className="u-container relative">{children}</div>;
  return <ContentDrift>{children}</ContentDrift>;
}

function ContentDrift({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  return (
    <motion.div ref={ref} className="u-container relative" style={{ y: contentY, opacity: fade }}>
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const desktop = useDesktop();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.__msPreloaderDone) {
      setReady(true);
      return;
    }
    const on = () => setReady(true);
    window.addEventListener("ms:preloader-done", on, { once: true });
    return () => window.removeEventListener("ms:preloader-done", on);
  }, []);

  const animated = desktop && !reduce;
  const hiddenWord = reduce ? { opacity: 0 } : { y: "110%" as const };
  const hiddenBlock = reduce ? { opacity: 0 } : { opacity: 0, y: 24 };

  return (
    <section className="min-h-svh relative flex items-center overflow-hidden pt-32 pb-20 md:pt-36">
      {/* backdrop image */}
      <HeroBackdrop animated={animated}>
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-img object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
      </HeroBackdrop>

      <OrbitRings className="pointer-events-none absolute -right-24 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 opacity-60 md:-right-10 md:opacity-90" />

      <HeroContent animated={animated}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          <p className="u-eyebrow">Accepting three partnerships for Q2 2026</p>
        </motion.div>

        <h1 className="u-display mt-8 max-w-[18ch] text-[clamp(3rem,9.5vw,8.5rem)] leading-[0.95] text-white">
          <span className="sr-only">Digital experiences with unreasonable attention to detail.</span>
          <span aria-hidden className="block">
            {WORDS.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block pr-[0.22em]"
                  initial={hiddenWord}
                  animate={ready ? { y: "0%", opacity: 1 } : undefined}
                  transition={{ duration: reduce ? 0.5 : 1.15, delay: 0.42 + i * 0.09, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="u-gold-text inline-block pr-[0.1em] italic"
                initial={hiddenWord}
                animate={ready ? { y: "0%", opacity: 1 } : undefined}
                transition={{ duration: reduce ? 0.5 : 1.15, delay: 0.72, ease: EASE }}
              >
                unreasonable
              </motion.span>
            </span>
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={hiddenWord}
                animate={ready ? { y: "0%", opacity: 1 } : undefined}
                transition={{ duration: reduce ? 0.5 : 1.15, delay: 0.82, ease: EASE }}
              >
                attention to detail.
              </motion.span>
            </span>
          </span>
        </h1>

        <motion.div
          initial={hiddenBlock}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: reduce ? 0.5 : 1, delay: 1.05, ease: EASE }}
          className="mt-10 flex max-w-xl flex-col gap-9"
        >
          <p className="text-[1.0625rem] leading-relaxed text-white/60 md:text-lg">
            Matriotic Studios LLC is a boutique web development agency. We design and
            engineer flagship websites and digital products for brands where
            &ldquo;good enough&rdquo; was never on the table.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact">Start a project</ButtonLink>
            <ButtonLink href="/portfolio" variant="outline">
              View our work
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 hidden items-center gap-3 text-[0.6875rem] uppercase tracking-[0.26em] text-mist md:flex"
        >
          <motion.span
            animate={reduce ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-gold" strokeWidth={1.4} />
          </motion.span>
          Scroll to explore
        </motion.div>
      </HeroContent>
    </section>
  );
}

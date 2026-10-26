"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useScrollAnimation, shouldAnimate } from "@/hooks/useScrollAnimation";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { OrbitRings } from "../decor/GoldAssets";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useTheme } from "@/hooks/useTheme";
import HalftoneBloom from "@/components/HalftoneBloom";

const EASE = [0.22, 1, 0.36, 1] as const;

const WORDS = ["Digital", "experiences", "with"];

function HeroBackdrop({ animated, children }: { animated: boolean; children: React.ReactNode }) {
  return <div className="absolute inset-0 -z-10 gpu">{animated ? <BackdropDrift animated={animated}>{children}</BackdropDrift> : children}</div>;
}

function BackdropDrift({ animated, children }: { animated: boolean; children: React.ReactNode }) {
  if (!animated) {
    return <div className="absolute inset-0">{children}</div>;
  }
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
  if (!animated) return <div className="u-container relative z-10">{children}</div>;
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
  const shouldAnim = shouldAnimate();
  const tier = useDeviceTier();
  const isHigh = tier === "high";
  const [ready, setReady] = useState(false);
  const theme = useTheme();
  const isDark = theme === "dark";

  // FAST FALLBACK: if preloader event doesn't fire within 2s, render content anyway
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const hiddenWord = reduce ? { opacity: 0 } : { y: "110%" as const };
  const hiddenBlock = reduce ? { opacity: 0 } : { opacity: 0, y: 24 };

  // Static fallback for non-high tier — identical visual layout, no motion

  if (!isHigh) {
    return (
      <section className="relative min-h-svh overflow-hidden pt-32 pb-20 md:pt-36">
        <div className="absolute inset-0 z-0">
          {isDark ? (
            <HalftoneBloom
              background="#000000"
              color1="#D4A24C"
              color2="#5A3A14"
              speed={38}
              size={115}
              angle={180}
              dotSize={5}
              hover={140}
              reach={520}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
              <Image
                src="/images/hero.jpg"
                alt=""
                fill
                sizes="100vw"
                className="hero-img object-cover"
                loading="lazy"
              />
            </>
          )}
          {isDark && (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(100deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
              }}
            />
          )}
        </div>
        <OrbitRings
          className={`pointer-events-none absolute -right-24 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 md:-right-10 ${
            isDark ? "opacity-55 md:opacity-55" : "opacity-60 md:opacity-90"
          }`}
        />

        <HeroContent animated={false}>
          <div className="flex items-center gap-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full bg-gold opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <p className="u-eyebrow">Accepting three partnerships for Q2 2026</p>
          </div>

          <h1 className="u-display mt-8 max-w-[18ch] text-[clamp(3rem,9.5vw,8.5rem)] leading-[0.95] text-white">
            <span className="sr-only">Digital experiences with unreasonable attention to detail.</span>
            <span aria-hidden className="block">
              {WORDS.map((word, i) => (
                <span key={word} className="inline-block overflow-hidden align-bottom">
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <div className="mt-10 flex max-w-xl flex-col gap-9">
            <p className="text-[1.0625rem] leading-relaxed text-white/60 md:text-lg">
              Matriotic Studios LLC is a boutique web development agency. We design and
              engineer flagship websites and digital products for brands where
              "good enough" was never on the table.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ButtonLink href="/portfolio" variant="outline">
                View our work
              </ButtonLink>
            </div>
          </div>

          <div className="mt-20 hidden items-center gap-3 text-[0.6875rem] uppercase tracking-[0.26em] text-mist md:flex">
            <span className="block h-5 w-px bg-white/10" />
            <span className="h-4 w-4 text-gold strokeWidth={1.4}">↓</span>
            Scroll to explore
          </div>
        </HeroContent>
      </section>
    );
  }

  // High tier: original animated version
  return (
    <section className="relative min-h-svh overflow-hidden pt-32 pb-20 md:pt-36">
      {/* backdrop layer */}
      <div className="absolute inset-0 z-0">
        {isDark ? (
          <HalftoneBloom
            background="#000000"
            color1="#D4A24C"
            color2="#5A3A14"
            speed={38}
            size={115}
            angle={180}
            dotSize={5}
            hover={140}
            reach={520}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <HeroBackdrop animated={shouldAnim}>
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
        )}
        {isDark && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
            }}
          />
        )}
      </div>

      <OrbitRings
          className={`pointer-events-none absolute -right-24 top-1/2 h-[38rem] w-[38rem] -translate-y-1/2 md:-right-10 ${
            isDark ? "opacity-55 md:opacity-55" : "opacity-60 md:opacity-90"
          }`}
        />

      {/* Static version for mobile/reduced motion - no useScroll */}
      {!shouldAnim && (
        <HeroContent animated={false}>
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
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
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
      )}

      {/* Scroll-driven version for desktop with fine pointer */}
      {shouldAnim && (
        <HeroContent animated={true}>
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
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
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
      )}
    </section>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

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

/** Scroll-linked image drift - mounted only on desktop. */
function DriftImage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useSpring(useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]), {
    stiffness: 80,
    damping: 28,
  });
  return (
    <motion.div ref={ref} className="absolute inset-0" style={{ y: imgY, scale: 1.14 }}>
      {children}
    </motion.div>
  );
}

type Props = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  thumbnail: string;
  alt: string;
  description: string;
  highlights: string[];
  tech: string[];
  url: string;
  index: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CaseStudy(props: Props) {
  const { id, name, tagline, category, year, thumbnail, alt, description, highlights, tech, url, index } = props;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = typeof window !== "undefined" && window.innerWidth >= 768;
  // parallax is desktop-only: iOS Safari breaks background-attachment-style
  // scroll-linked transforms and they cost frames on Android
  const parallaxActive = !reduce && desktop;
  const ImgLayer: React.ElementType = parallaxActive ? DriftImage : "div";

  return (
    <article
      ref={ref}
      className="scroll-mt-28 border-b border-white/[0.07] py-20 md:py-28"
    >
      <div className="u-container flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Image with curtain reveal - now clickable to open live URL */}
        <div className={`flex-0-0 flex-[0_0_55%] lg:order-2`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/image relative overflow-hidden"
            aria-label={`Open ${name} live site in new tab`}
          >
            <div className="group relative aspect-[3/2] overflow-hidden rounded-sm bg-ink">
              <ImgLayer className="absolute inset-0">
                <Image
                  src={thumbnail}
                  alt={alt}
                  width={1200}
                  height={800}
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover/image:scale-[1.03]"
                />
              </ImgLayer>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
              {/* curtain */}
              <motion.span
                aria-hidden
                className="absolute inset-0 z-10 bg-obsidian"
                initial={{ scaleY: 1 }}
                whileInView={{ scaleY: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 1.25, ease: EASE }}
                style={{ originY: 1 }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-0 z-20 h-px bg-gold"
                initial={{ scaleX: 1, opacity: 1 }}
                whileInView={{ scaleX: 0, opacity: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
              />
              {/* Arrow icon overlay */}
              <ArrowUpRight
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#B8893B] text-white flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"
                strokeWidth={1.6}
              />
            </div>
          </a>
        </div>

        {/* Copy */}
        <div className={`flex-1 lg:order-1`}>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-12% 0px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            {[
              <div key="meta" className="flex items-center gap-4">
                <span className="text-[0.625rem] uppercase tracking-[0.24em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px w-10 bg-gold/40" />
                <span className="text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                  {category} · {year}
                </span>
              </div>,
              <h2 key="client" className="u-display mt-6 text-3xl lg:text-4xl font-playfair text-white">
                {name}
              </h2>,
              <p key="title" className="u-display mt-3 text-xl italic text-gold/90">
                {tagline}
              </p>,
              <p key="summary" className="mt-6 line-clamp-4 leading-relaxed text-mist md:line-clamp-3">{description}</p>,
              <div key="results" className="mt-9 flex flex-wrap gap-2">
                {highlights.map((h, idx) => (
                  <div key={h} className="flex items-center gap-2 bg-obsidian px-4 py-3">
                    <span className="block h-2 w-2 bg-gold rounded-full" />
                    <p className="u-display text-2xl text-white">{h}</p>
                  </div>
                ))}
              </div>,
              <div key="stack" className="mt-7 flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-3.5 py-1.5 text-[0.6875rem] tracking-[0.06em] text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>,
              <div key="cta" className="mt-8">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2.5 bg-gold text-obsidian font-medium rounded-md hover:bg-gold/90 transition-colors duration-300"
                >
                  View Live ↗
                </a>
              </div>
            ].map((node, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.85, ease: EASE },
                  },
                }}
              >
                {node}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </article>
  );
}

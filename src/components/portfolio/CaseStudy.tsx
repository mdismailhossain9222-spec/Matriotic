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
  liveUrl?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CaseStudy(props: Props) {
  const { id, name, tagline, category, year, thumbnail, alt, description, highlights, tech, url, index, liveUrl } = props;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = typeof window !== "undefined" && window.innerWidth >= 768;
  const parallaxActive = !reduce && desktop;
  const ImgLayer: React.ElementType = parallaxActive ? DriftImage : "div";

  return (
    <article
      ref={ref}
      className="relative scroll-mt-32 border-b border-white/[0.07] py-20 md:py-28"
    >
      {/* Hero Banner Section */}
      <div className="u-container mb-16 md:mb-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-12% 0px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } }
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[0.625rem] uppercase tracking-[0.24em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-10 bg-gold/40" />
              <span className="text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                {category} · {year}
              </span>
            </div>
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.1 } }
            }}
            className="u-display text-3xl lg:text-4xl xl:text-5xl font-playfair text-white leading-[1.1]"
          >
            {name}
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE, delay: 0.2 } }
            }}
            className="u-display mt-4 text-xl lg:text-2xl italic text-gold/90 leading-[1.3] max-w-3xl"
          >
            {tagline}
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content: 2-Column Grid */}
      <div className="u-container">
        <div className="flex flex-col lg:flex-row lg:gap-16 items-start">
          {/* Left Column: Hero Image (55%) */}
          <div className="flex-0-0 flex-[0_0_55%] w-full lg:order-2">
            <a
              href={liveUrl || url}
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
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover/image:scale-[1.03]"
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

          {/* Right Column: Content (45%) */}
          <div className="flex-1 lg:order-1 w-full pt-8 lg:pt-0">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-12% 0px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.div
                key="summary"
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } }
                }}
                className="leading-relaxed text-mist mb-10"
              >
                <p className="text-base lg:text-lg">{description}</p>
              </motion.div>

              {/* Highlights */}
              <motion.div
                key="highlights"
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: 0.1 } }
                }}
                className="mb-10"
              >
                <h3 className="u-display text-lg font-semibold text-white mb-6 tracking-tight">Key Highlights</h3>
                <div className="space-y-3">
                  {highlights.map((h, idx) => (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, ease: EASE, delay: idx * 0.08 }}
                      className="flex items-start gap-4 bg-obsidian/50 px-5 py-4 rounded-lg border border-white/[0.05] hover:border-gold/30 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 mt-1.5">
                        <span className="block h-2 w-2 bg-gold rounded-full" />
                      </div>
                      <p className="u-display text-white text-base leading-relaxed">{h}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tech Stack Badges */}
              <motion.div
                key="stack"
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: 0.2 } }
                }}
                className="mb-10"
              >
                <h3 className="u-display text-lg font-semibold text-white mb-6 tracking-tight">Tech Stack</h3>
                <div className="flex flex-wrap gap-2.5">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-obsidian/50 px-4 py-2 text-[0.75rem] tracking-[0.04em] text-white/70 hover:text-white hover:border-gold/40 transition-all duration-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Premium CTA Buttons */}
              <motion.div
                key="cta"
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE, delay: 0.3 } }
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href={liveUrl || url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold text-obsidian font-medium rounded-lg hover:bg-gold/90 transition-all duration-300 text-base"
                >
                  View Live Site
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </a>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/10 bg-obsidian/50 text-white font-medium rounded-lg hover:bg-white/5 hover:border-white/20 transition-all duration-300 text-base"
                >
                  View Source
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  );
}
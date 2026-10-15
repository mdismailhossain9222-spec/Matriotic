import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";

import Hero from "@/components/home/Hero";
import Marquee from "@/components/Marquee";
import { Reveal, Stagger, StaggerItem, SplitHeading } from "@/components/motion/Reveal";
import { WirePrism, Parallax, GuideLines } from "@/components/decor/GoldAssets";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollTextSpread } from "@/components/ScrollTextSpread";
import { SERVICES, TESTIMONIALS } from "@/lib/content";
import { projects } from "@/lib/projects";

const STATS = [
  { value: "6", label: "Years of studio craft" },
  { value: "84", label: "Flagship launches" },
  { value: "98", label: "Avg. Lighthouse score" },
  { value: "100%", label: "Client retention, 2025" },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee
        items={[
          "Custom Web Development",
          "UI/UX Design",
          "Search Optimisation",
          "Website Maintenance",
          "Design Systems",
          "Brand Experience",
        ]}
      />

      {/* ── Manifesto ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 md:py-40">
        <GuideLines className="absolute inset-0 -z-10 opacity-60" count={6} />
        <div className="u-container">
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="u-eyebrow">The Studio</p>
              </Reveal>
              <SplitHeading
                text="We build the version of your brand you keep describing in meetings."
                accentFrom={11}
                className="u-display mt-6 text-[clamp(2rem,4.4vw,3.5rem)] text-white"
              />
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Stagger className="space-y-7">
                <StaggerItem>
                  <p className="text-lg leading-relaxed text-white/65">
                    Matriotic Studios is deliberately small. No account layers, no
                    hand-offs to a junior team, no templates dressed up as strategy. The
                    people who design your product are the people who build it.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <p className="leading-relaxed text-mist">
                    We work with a handful of clients each quarter so that every detail
                    receives the time it deserves - the kerning of a headline, the easing
                    curve of a hover, the 40 kilobytes we refused to ship. It is a slower
                    way to work. It is also the only way we know how to produce something
                    genuinely rare.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <Link
                    href="/about"
                    className="u-link inline-flex items-center gap-2 pt-2 text-sm font-medium uppercase tracking-[0.12em] text-gold"
                  >
                    Read our story <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                  </Link>
                </StaggerItem>
              </Stagger>

              <Stagger className="mt-16 grid grid-cols-2 gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
                {STATS.map((s) => (
                  <StaggerItem key={s.label} className="bg-obsidian p-6">
                    <p className="u-display text-4xl u-gold-text">{s.value}</p>
                    <p className="mt-2 text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-mist">
                      {s.label}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scroll spread ─────────────────────────────────────── */}
      <ScrollTextSpread subtitle="What we stand for" text="PROOF NOT PROMISES" />

      {/* ── Services ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.07] py-28 md:py-40">
        <WirePrism className="pointer-events-none absolute -left-24 top-24 hidden h-[30rem] w-[26rem] opacity-50 lg:block" />
        <div className="u-container relative">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Reveal>
                <p className="u-eyebrow">What we do</p>
              </Reveal>
              <SplitHeading
                text="Four disciplines. One standard."
                accentFrom={3}
                className="u-display mt-6 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] text-white"
              />
            </div>
            <Reveal delay={0.2}>
              <ButtonLink href="/services" variant="outline">
                All services
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-20 border-t border-white/[0.07]">
            {SERVICES.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.05}>
                <Link
                  href={`/services#${service.id}`}
                  className="group relative grid grid-cols-1 items-start gap-6 border-b border-white/[0.07] py-10 transition-colors duration-500 md:grid-cols-12 md:items-center md:gap-8 md:py-12"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                  />
                  <span className="text-[0.6875rem] tracking-[0.24em] text-gold/70 md:col-span-1">
                    {service.index}
                  </span>
                  <h3 className="u-display text-[1.75rem] text-white transition-colors duration-500 group-hover:text-gold md:col-span-4 md:text-[2.25rem]">
                    {service.title}
                  </h3>
                  <p className="leading-relaxed text-mist md:col-span-5">{service.description}</p>
                  <span className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-white/50 md:col-span-2 md:justify-end">
                    Explore
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-on-gold">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured work ─────────────────────────────────────── */}
      <section className="relative border-t border-white/[0.07] py-28 md:py-40">
        <div className="u-container">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Reveal>
                <p className="u-eyebrow">Selected work</p>
              </Reveal>
              <SplitHeading
                text="Proof, not promises."
                accentFrom={1}
                className="u-display mt-6 text-[clamp(2.2rem,5vw,4rem)] text-white"
              />
            </div>
            <Reveal delay={0.2}>
              <ButtonLink href="/portfolio" variant="outline">
                Full portfolio
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2 md:gap-10">
            {projects.slice(0, 3).map((project, i) => (
              <Reveal key={project.id} delay={(i % 2) * 0.1} className={i % 2 === 1 ? "md:mt-20" : ""}>
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink">
                    <Image
                      src={project.thumbnail}
                      alt={project.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 46vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-60" />
                    <span className="absolute right-5 top-5 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-gold text-on-gold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[0.625rem] uppercase tracking-[0.22em] text-gold">
                        {project.category}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-6">
                    <h3 className="u-display text-xl text-white transition-colors duration-500 group-hover:text-gold md:text-2xl">
                      {project.name}
                    </h3>
                    <span className="text-xs tracking-[0.2em] text-mist">{project.year}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{project.tagline}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.07] py-28 md:py-40">
        <div
          aria-hidden
          className="deco-glow pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.045] blur-[140px]"
        />
        <div className="u-container relative">
          <Reveal className="text-center">
            <p className="u-eyebrow">In their words</p>
          </Reveal>
          <SplitHeading
            text="Partners, not vendors."
            accentFrom={1}
            className="u-display mx-auto mt-6 max-w-3xl text-center text-[clamp(2.2rem,5vw,4rem)] text-white"
          />

          <div className="mt-20 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1} className="bg-obsidian">
                <figure className="flex h-full flex-col justify-between gap-8 p-9 md:p-11">
                  <Quote className="h-7 w-7 text-gold/40" strokeWidth={1.2} />
                  <blockquote className="u-display text-[1.25rem] italic leading-[1.5] text-white/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption>
                    <div className="u-hairline mb-5" />
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="mt-1 text-xs tracking-[0.1em] text-mist">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/[0.07]">
        <Parallax distance={50} className="media-dim absolute inset-0 -z-10">
          <div className="relative h-[130%] w-full">
            <Image
              src="/images/studio.jpg"
              alt=""
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-obsidian via-obsidian/80 to-obsidian" />

        <div className="u-container py-32 text-center md:py-44">
          <Reveal>
            <p className="u-eyebrow">Let&apos;s begin</p>
          </Reveal>
          <SplitHeading
            text="Your next site should be the last one you need for years."
            accentFrom={8}
            className="u-display mx-auto mt-7 max-w-4xl text-[clamp(2.3rem,6vw,5rem)] text-white"
          />
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-xl leading-relaxed text-white/60">
              Tell us what you are building. We reply within one business day with honest
              thoughts, a rough shape and a straight answer on fit.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/contact">Start the conversation</ButtonLink>
              <ButtonLink href="/pricing" variant="outline">
                See pricing
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

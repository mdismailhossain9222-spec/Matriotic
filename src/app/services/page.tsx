import type { Metadata } from "next";
import { Check } from "lucide-react";

import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem, SplitHeading } from "@/components/motion/Reveal";
import { ArcCluster, GuideLines } from "@/components/decor/GoldAssets";
import { ButtonLink } from "@/components/ui/Button";
import { SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom web development, UI/UX design, search optimisation and website maintenance — delivered by a senior-only studio.",
};

const ENGAGEMENT = [
  {
    title: "Project",
    body: "A defined scope with a fixed price and timeline. Best for launches, rebuilds and flagship campaigns.",
  },
  {
    title: "Retainer",
    body: "A recurring block of senior hours each month for iteration, growth experiments and care.",
  },
  {
    title: "Partnership",
    body: "Embedded, long-term collaboration — we act as your product and web team, quarter after quarter.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="Capabilities"
        title="Everything required to launch something exceptional."
        accentFrom={4}
        lede="Four tightly connected disciplines. We rarely sell them in isolation — the work is strongest when strategy, design, engineering and growth are decided in the same room."
      />

      <div className="relative">
        <GuideLines className="absolute inset-0 -z-10 opacity-50" count={4} />

        {SERVICES.map((service, i) => (
          <section
            key={service.id}
            id={service.id}
            className="relative scroll-mt-28 border-b border-white/[0.07] py-24 md:py-32"
          >
            {i % 2 === 1 && (
              <ArcCluster className="pointer-events-none absolute -left-32 top-1/4 hidden h-[26rem] w-[26rem] opacity-40 lg:block" />
            )}
            <div className="u-container relative grid gap-14 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="u-display text-5xl u-gold-text">{service.index}</span>
                    <span className="h-px w-16 bg-gold/40" />
                  </div>
                </Reveal>
                <SplitHeading
                  text={service.title}
                  className="u-display mt-7 text-[clamp(2rem,4.4vw,3.25rem)] text-white"
                />
                <Reveal delay={0.15}>
                  <p className="u-display mt-5 text-xl italic text-gold/90">{service.tagline}</p>
                </Reveal>
                <Reveal delay={0.22}>
                  <p className="mt-7 max-w-lg leading-relaxed text-mist">{service.description}</p>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="mt-10 inline-flex items-baseline gap-4 border border-white/[0.07] px-7 py-5">
                    <span className="u-display text-3xl text-white">{service.metric}</span>
                    <span className="max-w-[12rem] text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-mist">
                      {service.metricLabel}
                    </span>
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <Reveal>
                  <h3 className="u-eyebrow">What&apos;s included</h3>
                </Reveal>
                <Stagger className="mt-8 grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
                  {service.deliverables.map((d) => (
                    <StaggerItem key={d} className="bg-obsidian">
                      <div className="group flex items-start gap-3.5 p-6 transition-colors duration-500 hover:bg-ink/70">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-gold/70 transition-colors duration-500 group-hover:text-gold"
                          strokeWidth={2}
                        />
                        <span className="text-sm leading-relaxed text-white/80">{d}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Engagement models */}
      <section className="py-24 md:py-36">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow">Engagement models</p>
          </Reveal>
          <SplitHeading
            text="Three ways to work together."
            accentFrom={2}
            className="u-display mt-6 max-w-2xl text-[clamp(2rem,4.6vw,3.25rem)] text-white"
          />

          <Stagger className="mt-16 grid gap-8 md:grid-cols-3">
            {ENGAGEMENT.map((e, i) => (
              <StaggerItem key={e.title}>
                <div className="group relative h-full overflow-hidden border border-white/[0.07] p-9 transition-colors duration-500 hover:border-gold/30">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                  />
                  <span className="text-[0.625rem] tracking-[0.26em] text-gold/70">
                    0{i + 1}
                  </span>
                  <h3 className="u-display mt-6 text-2xl text-white">{e.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-mist">{e.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-wrap items-center gap-4">
              <ButtonLink href="/pricing">View pricing</ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Discuss a custom scope
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

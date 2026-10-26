import type { Metadata } from "next";

import PageHero from "@/components/PageHero";
import CaseStudy from "@/components/portfolio/CaseStudy";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import Marquee from "@/components/Marquee";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected case studies from Matriotic Studios LLC — e-commerce, hospitality, SaaS, architecture, cafés and fitness brands.",
};

const SECTORS = [
  "E-Commerce",
  "Hospitality",
  "SaaS",
  "Architecture",
  "Food & Beverage",
  "Fitness",
];

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        breadcrumb="Portfolio"
        eyebrow="Selected work · 2026"
        title="Work that earns its keep."
        accentFrom={2}
        lede="Six projects, six problems, six outcomes. Each one was built to commercial standards — not award standards."
      />

      <Marquee items={SECTORS} speed={44} reverse />

      <div>
        {projects.map((project, i) => (
          <CaseStudy
            key={project.id}
            index={i}
            id={project.id}
            name={project.name}
            tagline={project.tagline}
            category={project.category}
            year={project.year}
            thumbnail={project.thumbnail}
            alt={project.alt}
            description={project.description}
            highlights={project.highlights}
            tech={project.tech}
            url={project.url}
            liveUrl={project.liveUrl}
          />
        ))}
      </div>

      <section className="py-28 text-center md:py-40">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow">Next</p>
          </Reveal>
          <SplitHeading
            text="There is room for one more this quarter."
            accentFrom={4}
            className="u-display mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,5.4vw,4rem)] text-white"
          />
          <Reveal delay={0.25}>
            <p className="mx-auto mt-7 max-w-xl leading-relaxed text-mist">
              If your project deserves the same level of attention, we would like to hear
              about it.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/contact">Enquire about availability</ButtonLink>
              <ButtonLink href="/services" variant="outline">
                Our services
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

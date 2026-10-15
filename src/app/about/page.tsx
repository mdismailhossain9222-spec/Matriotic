import type { Metadata } from "next";
import Image from "next/image";

import PageHero from "@/components/PageHero";
import { Reveal, Stagger, StaggerItem, SplitHeading } from "@/components/motion/Reveal";
import { Parallax, WirePrism } from "@/components/decor/GoldAssets";
import { ButtonLink } from "@/components/ui/Button";
import { PROCESS } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story of Matriotic Studios LLC - a deliberately small studio obsessed with craft, performance and the details nobody asks for.",
};

const VALUES = [
  {
    title: "Craft over volume",
    body: "We cap our client list. Fewer projects, more attention, work we are willing to put our name on.",
  },
  {
    title: "Performance is design",
    body: "A beautiful site that loads in four seconds is not a beautiful site. Speed is a feature we never trade away.",
  },
  {
    title: "Radical clarity",
    body: "Clear scopes, clear pricing, clear timelines. You will never wonder what we are doing or what it costs.",
  },
  {
    title: "Built to outlast",
    body: "Semantic, documented, standards-based code. If you ever leave us, you leave with something maintainable.",
  },
];

const TEAM = [
  {
    name: "Ismail Hossain",
    role: "CO-FOUNDER & FULL STACK DEVELOPER",
    image: "/images/team-ismail.jpg",
    initials: "IH",
    alt: "Ismail Hossain, Co-Founder and Full Stack Developer at Matriotic Studios",
    linkedin: "https://www.linkedin.com/in/ismailhossain9222",
    bio: "Six years deep in the programming line, building fast and accessible products end to end. Writes the frontend, ships the backend, and refuses to hand off anything he wouldn't stake his name on. Believes a website should feel inevitable, not designed.",
  },
  {
    name: "Mehedi Rudra",
    role: "CEO",
    image: "/images/Rudro.jpg",
    initials: "MR",
    alt: "Mehedi Rudra, CEO at Matriotic Studios",
    linkedin: "https://www.linkedin.com/in/kazi-hasan-mehedi-rudra-0234373bb",
    bio: "The engine behind every deal. Lead generation, cold outreach, closing conversations, and the documentation that keeps projects accountable. Runs the studio's social presence with the same discipline he brings to a pipeline. Turns interest into signed work, quietly.",
  },
  {
    name: "Mubashira Rahman",
    role: "SALES & BUSINESS DEVELOPMENT MANAGER",
    image: "/images/Mubasshira.jpg",
    initials: "MB",
    alt: "Mubashira Rahman, Sales and Business Development Manager at Matriotic Studios",
    linkedin: "https://www.linkedin.com/in/mubashira-rahman-8200921ba",
    bio: "The bridge between the studio and the clients it serves. Maps new markets, shapes proposals, and turns first conversations into long-term partnerships. Reads a room quickly, follows up relentlessly, and keeps the pipeline warm with the same care the studio gives its code.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow="Est. 2020 · Wilmington, Delaware"
        title="A small studio with a long memory for detail."
        accentFrom={6}
        lede="Matriotic Studios LLC began as a reaction to an industry that had learned to ship quickly and forgotten how to ship well. We are the alternative to the template."
      />

      {/* Story */}
      <section className="relative py-24 md:py-36">
        <div className="u-container grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Parallax distance={40}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src="/images/about-story.jpg"
                  alt="The Matriotic Studios team at work, crafting digital experiences"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
              </div>
            </Parallax>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="u-eyebrow">Our story</p>
            </Reveal>
            <SplitHeading
              text="We started because the good work kept getting value-engineered away."
              accentFrom={8}
              className="u-display mt-6 text-[clamp(1.9rem,3.6vw,2.9rem)] text-white"
            />
            <Stagger className="mt-9 space-y-6 text-mist" delay={0.1}>
              <StaggerItem>
                <p className="leading-relaxed">
                  Matriotic was founded on a stubborn premise. Six years and eighty-four launches later, the premise has held.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="leading-relaxed">
                  We write our own code. We draw our own type scales. We argue about easing
                  curves. And we measure everything, because taste without evidence is just
                  opinion.
                </p>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </section>

      {/* Mission + values */}
      <section className="relative overflow-hidden border-y border-white/[0.07] bg-ink/40 py-24 md:py-36">
        <WirePrism className="pointer-events-none absolute -right-20 top-10 hidden h-[28rem] w-[24rem] opacity-40 lg:block" />
        <div className="u-container relative">
          <div className="max-w-3xl">
            <Reveal>
              <p className="u-eyebrow">Mission</p>
            </Reveal>
            <SplitHeading
              text="To make the open web feel expensive again."
              accentFrom={5}
              className="u-display mt-6 text-[clamp(2rem,4.6vw,3.5rem)] text-white"
            />
            <Reveal delay={0.2}>
              <p className="mt-7 text-lg leading-relaxed text-white/60">
                Every brand deserves a digital presence that matches the care it puts into
                its product. Our mission is to close that gap - with engineering rigour,
                editorial design sensibility, and an allergy to anything generic.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-36">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow">The team</p>
          </Reveal>
          <SplitHeading
            text="Three senior people. No layers in between."
            accentFrom={3}
            className="u-display mt-6 max-w-3xl text-[clamp(2rem,4.6vw,3.5rem)] text-white"
          />

          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08}>
                <article className="group">
                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm border border-white/[0.07] bg-gradient-to-br from-ink via-obsidian to-ink">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.14), transparent 65%)",
                      }}
                    />
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.alt}
                        className="absolute inset-0 w-full h-full object-cover object-top rounded-sm"
                        width={800}
                        height={1000}
                        loading="lazy"
                      />
                    ) : (
                      <span className="u-display u-gold-text relative text-6xl">
                        {member.initials}
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:w-full" />
                  </div>
                  <h3 className="u-display mt-6 text-xl text-white">{member.name}</h3>
                  <p className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-gold/80">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-mist">{member.bio}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center gap-2 mt-4 text-sm text-[#B8893B] hover:text-[#D4A24C] transition-colors min-h-11"
                >
                  Connect on LinkedIn
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                  </svg>
                </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-white/[0.07] py-24 md:py-36">
        <div className="u-container">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="u-eyebrow">How we work</p>
              </Reveal>
              <SplitHeading
                text="Six phases. Zero surprises."
                accentFrom={2}
                className="u-display mt-6 text-[clamp(2rem,4vw,3rem)] text-white"
              />
              <Reveal delay={0.2}>
                <p className="mt-6 leading-relaxed text-mist">
                  Our process is deliberately transparent. You always know what phase we
                  are in, what is next, and what we need from you.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-10">
                  <ButtonLink href="/contact">Book a discovery call</ButtonLink>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Stagger className="space-y-px overflow-hidden border border-white/[0.07] bg-white/[0.07]">
                {PROCESS.map((p) => (
                  <StaggerItem key={p.step} className="bg-obsidian">
                    <div className="group flex gap-7 p-7 transition-colors duration-500 hover:bg-ink/60 md:p-9">
                      <span className="u-display text-lg text-gold/60 transition-colors duration-500 group-hover:text-gold">
                        {p.step}
                      </span>
                      <div>
                        <h3 className="u-display text-xl text-white">{p.title}</h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-mist">{p.body}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
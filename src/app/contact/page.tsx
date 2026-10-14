import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";

import PageHero from "@/components/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SOCIAL_LINKS, SOCIAL_PROPS } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Matriotic Studios LLC. Email, studio address and a direct enquiry form.",
};

const DETAILS = [
  {
    Icon: Mail,
    label: "Email",
    value: "matrioticstudiollc@gmail.com",
    href: "mailto:matrioticstudiollc@gmail.com",
  },
  {
    Icon: MapPin,
    label: "Studio",
    value: "Mirpur DOHS, Dhaka",
    href: null,
  },
  { Icon: Clock, label: "Hours", value: "Mon – Fri, 9:00 – 18:00 BST", href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Let's talk"
        title="Tell us what you are building."
        accentFrom={4}
        lede="One form, one reply, no sales sequence. A senior member of the studio reads every enquiry and responds within one business day."
      />

      <section className="py-20 md:py-28">
        <div className="u-container grid gap-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Stagger className="space-y-px overflow-hidden border border-white/[0.07] bg-white/[0.07]">
              {DETAILS.map(({ Icon, label, value, href }) => (
                <StaggerItem key={label} className="bg-obsidian">
                  <div className="flex items-start gap-5 p-7">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-gold">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-[0.625rem] uppercase tracking-[0.22em] text-mist">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="u-link mt-2 inline-block whitespace-pre-line text-[0.9375rem] leading-relaxed text-white transition-colors hover:text-gold"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-2 whitespace-pre-line text-[0.9375rem] leading-relaxed text-white">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <div className="mt-10">
                <p className="u-eyebrow">Elsewhere</p>
                <div className="mt-5 flex items-center gap-3">
                  {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      {...SOCIAL_PROPS}
                      aria-label={`Matriotic Studios on ${label}`}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/55 transition-all duration-500 hover:border-gold/50 hover:text-gold"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 overflow-hidden rounded-sm border border-white/[0.07]">
                <iframe
                  title="Matriotic Studios LLC location map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.355%2C23.820%2C90.375%2C23.840&layer=mapnik&marker=23.8302%2C90.3656"
                  width="100%"
                  height="300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="contact-map block w-full"
                />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h2 className="u-display text-[clamp(1.8rem,3.4vw,2.5rem)] text-white">
                Project enquiry
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Fields marked with care. The more context you give us, the more useful our
                first reply will be.
              </p>
            </Reveal>
            <div className="mt-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

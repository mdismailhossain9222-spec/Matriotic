"use client";

import { useState } from "react";
import { RotateCcw, Check } from "lucide-react";
import { Reveal } from "../motion/Reveal";

const COOKIES = [
  {
    name: "ms_session",
    category: "Strictly necessary",
    purpose: "Authenticates your client portal session.",
    duration: "14 days",
    party: "First party",
  },
  {
    name: "ms_consent_v1",
    category: "Strictly necessary",
    purpose: "Stores your cookie preferences so we do not ask again.",
    duration: "12 months",
    party: "First party",
  },
  {
    name: "ms_consent_sig",
    category: "Strictly necessary",
    purpose: "HMAC signature verifying your consent record has not been altered.",
    duration: "12 months",
    party: "First party",
  },
  {
    name: "_ms_analytics",
    category: "Analytics",
    purpose: "Aggregate, anonymised page-view and performance measurement.",
    duration: "13 months",
    party: "First party",
  },
  {
    name: "_ms_attr",
    category: "Marketing",
    purpose: "Measures which campaign introduced you to the studio. Off by default.",
    duration: "90 days",
    party: "First party",
  },
];

export default function CookieTable() {
  const [cleared, setCleared] = useState(false);

  function reset() {
    const expiry = "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.cookie = `ms_consent_v1=; ${expiry}`;
    document.cookie = `ms_consent_sig=; ${expiry}`;
    setCleared(true);
    window.setTimeout(() => window.location.reload(), 900);
  }

  return (
    <section className="pb-24 md:pb-36">
      <div className="u-container">
        <div className="lg:ml-[33.333%] lg:w-[66.666%]">
          <Reveal>
            <div className="overflow-hidden rounded-sm border border-white/[0.09]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[42rem] border-collapse text-left">
                  <caption className="sr-only">
                    Inventory of cookies used by Matriotic Studios
                  </caption>
                  <thead>
                    <tr className="border-b border-white/[0.09] bg-ink/60">
                      {["Cookie", "Category", "Purpose", "Duration", "Party"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="px-5 py-4 text-[0.625rem] uppercase tracking-[0.2em] text-gold"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIES.map((c) => (
                      <tr
                        key={c.name}
                        className="border-b border-white/[0.06] transition-colors duration-300 last:border-0 hover:bg-ink/40"
                      >
                        <td className="px-5 py-5 font-mono text-[0.8125rem] text-white">
                          {c.name}
                        </td>
                        <td className="px-5 py-5 text-[0.8125rem] text-white/70">
                          {c.category}
                        </td>
                        <td className="px-5 py-5 text-[0.8125rem] leading-relaxed text-mist">
                          {c.purpose}
                        </td>
                        <td className="whitespace-nowrap px-5 py-5 text-[0.8125rem] text-white/70">
                          {c.duration}
                        </td>
                        <td className="whitespace-nowrap px-5 py-5 text-[0.8125rem] text-mist">
                          {c.party}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-5 rounded-sm border border-gold/20 bg-gold/[0.04] p-7">
              <div className="flex-1">
                <h3 className="u-display text-lg text-white">Change your preferences</h3>
                <p className="mt-1.5 text-sm text-mist">
                  Clears your stored consent and reopens the preference panel.
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2.5 rounded-full border border-gold/50 px-6 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold transition-colors duration-500 hover:bg-gold hover:text-on-gold"
              >
                {cleared ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Cleared
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" /> Reset consent
                  </>
                )}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

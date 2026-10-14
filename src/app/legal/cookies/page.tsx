import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "@/components/legal/LegalShell";
import CookieTable from "@/components/legal/CookieTable";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "A full inventory of the cookies used by Matriotic Studios LLC, their purpose, duration and how to change your consent.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "what",
    heading: "What cookies are",
    body: [
      "Cookies are small text files placed on your device by a website. They let a site remember your actions and preferences across pages and visits. Similar technologies \u2014 local storage, session storage and pixels \u2014 serve comparable purposes and are covered by this policy.",
      "We use very few of them. This site ships no third-party advertising cookies, no social tracking pixels and no cross-site identifiers.",
    ],
  },
  {
    id: "categories",
    heading: "Categories we use",
    body: [
      "Strictly necessary cookies are required for the site to function \u2014 maintaining your authenticated portal session and recording your consent choice. These cannot be switched off.",
      "Analytics cookies help us understand aggregate usage so we can improve performance and navigation. They are only set after you opt in.",
      "Marketing cookies would measure the effectiveness of campaigns. They are disabled by default and are only activated if you explicitly enable them.",
    ],
  },
  {
    id: "inventory",
    heading: "Cookie inventory",
    body: [
      "The table below lists every cookie this site may set, with its purpose and lifetime.",
    ],
  },
  {
    id: "consent",
    heading: "How consent works",
    body: [
      "On your first visit you are shown a non-intrusive consent panel. Nothing beyond strictly necessary cookies is set until you make a choice. Your decision is recorded in a cookie named ms_consent_v1, accompanied by an HMAC-signed, HTTP-only verification cookie (ms_consent_sig) so that the record cannot be tampered with client-side.",
      "We log the preference, a random token and your approximate region \u2014 not your identity \u2014 as evidence of compliance under GDPR Article 7(1) and the CPRA. Consent is valid for 12 months, after which you will be asked again.",
    ],
  },
  {
    id: "manage",
    heading: "Managing your choices",
    body: [
      "You can change your mind at any time. Use the control below to clear your stored preference, which will bring the consent panel back on your next page view.",
      "You can also manage or delete cookies directly in your browser settings. Blocking strictly necessary cookies will sign you out of the client portal and may prevent some pages from working correctly.",
    ],
  },
  {
    id: "dnt",
    heading: "Do Not Track and Global Privacy Control",
    body: [
      "We honour the Global Privacy Control (GPC) signal. Where your browser transmits GPC, we treat it as an opt-out of analytics and marketing categories without requiring any further action from you.",
    ],
  },
  {
    id: "updates",
    heading: "Updates",
    body: [
      "If we add, remove or change the purpose of any cookie, this page and the inventory above will be updated and, where the change is material, you will be asked to confirm your preferences again.",
    ],
  },
];

export default function CookiesPage() {
  return (
    <>
      <LegalShell
        current="/legal/cookies"
        breadcrumb="Cookies"
        eyebrow="Legal"
        title="Cookie Policy"
        updated="12 January 2026"
        lede="A complete, honest inventory of every cookie this site can set — and a one-click way to change your mind."
        sections={SECTIONS}
      />
      <CookieTable />
    </>
  );
}

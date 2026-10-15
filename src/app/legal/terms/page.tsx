import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of the Matriotic Studios LLC website, client portal and professional services.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    heading: "Agreement to terms",
    body: [
      "These Terms of Service govern your access to matrioticstudios.com, the Matriotic client portal and any services provided by Matriotic Studios LLC. By using the site or the portal you agree to these terms. If you do not agree, please do not use them.",
      "Where a signed statement of work or master services agreement exists between us, that document governs the engagement and prevails over these terms in the event of conflict.",
    ],
  },
  {
    id: "services",
    heading: "Services",
    body: [
      "We provide web design, development, search optimisation and maintenance services. Scope, deliverables, timelines and fees are defined in a written proposal or statement of work accepted by both parties.",
      "Indicative pricing published on this site is provided in good faith for planning purposes and does not constitute a binding offer.",
    ],
  },
  {
    id: "accounts",
    heading: "Client portal accounts",
    body: [
      "Portal accounts are for the named client organisation and its authorised personnel. You are responsible for keeping credentials confidential and for all activity under your account.",
    ],
    list: [
      "Use a unique password of at least 10 characters that you do not use elsewhere.",
      "Notify us immediately at legal@matrioticstudios.com of any suspected unauthorised access.",
      "Do not attempt to probe, scan, or circumvent the authentication or authorisation layers of the portal.",
      "Do not use automated systems to extract data from the portal.",
    ],
  },
  {
    id: "payment",
    heading: "Fees and payment",
    body: [
      "Unless otherwise agreed in writing, projects are invoiced in two instalments: 50% to begin work (which reserves your production slot) and 50% on delivery, prior to go-live. Monthly maintenance retainers are invoiced monthly in advance.",
      "Invoices are payable within 14 days. Late amounts may accrue interest at 1.5% per month or the maximum permitted by law, whichever is lower. We may pause work on overdue accounts after written notice.",
      "Deposits reserve a production slot and are non-refundable. Hosting, domain and other third-party costs (licences, fonts, stock media) are not included in our quotes and are billed by the provider.",
    ],
  },
  {
    id: "ip",
    heading: "Intellectual property",
    body: [
      "On receipt of final payment, all custom design files, source code and documentation produced specifically for your project transfer to you, together with a perpetual, worldwide licence to use them.",
      "Matriotic retains ownership of pre-existing tools, libraries, internal frameworks and know-how used in the course of the work, and grants you a perpetual, non-exclusive licence to use them as embedded in the deliverables. Third-party components remain subject to their own licences.",
      "Unless you ask us in writing not to, we may display non-confidential work in our portfolio and marketing materials.",
    ],
  },
  {
    id: "client",
    heading: "Client responsibilities",
    body: [
      "Timely delivery depends on timely input. You agree to supply content, brand assets, access credentials and feedback within the windows agreed in the project plan, and to ensure you hold the rights to any materials you provide. Delays in client input may shift the schedule and, where significant, the fee.",
    ],
  },
  {
    id: "acceptable",
    heading: "Acceptable use",
    body: ["You agree not to use this site or the portal to:"],
    list: [
      "Violate any applicable law or regulation.",
      "Transmit malware, conduct denial-of-service activity, or interfere with site operation.",
      "Reverse engineer, scrape or copy the site for competitive purposes.",
      "Impersonate another person or misrepresent your affiliation.",
    ],
  },
  {
    id: "warranty",
    heading: "Warranties and disclaimers",
    body: [
      "We warrant that services will be performed with reasonable skill and care, consistent with professional standards. We will correct defects in our deliverables reported within the agreed post-launch support window at no charge.",
      "Except as expressly stated, the site and services are provided \u201cas is\u201d without warranties of any kind. We do not warrant uninterrupted availability, specific search rankings, or particular commercial outcomes.",
    ],
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, neither party is liable for indirect, incidental, special, consequential or punitive damages, or for loss of profits, revenue, data or goodwill. Our total aggregate liability arising out of or relating to an engagement is limited to the fees paid by you to Matriotic in the twelve months preceding the claim.",
      "Nothing in these terms limits liability for fraud, wilful misconduct, or any liability that cannot lawfully be excluded.",
    ],
  },
  {
    id: "termination",
    heading: "Termination",
    body: [
      "Either party may terminate an engagement on 14 days' written notice. On termination you will pay for all work completed and non-cancellable commitments incurred up to the termination date, and we will deliver work in progress in its then-current state.",
      "We may suspend or terminate portal access immediately for breach of these terms or non-payment.",
    ],
  },
  {
    id: "law",
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the State of Delaware, United States, without regard to conflict-of-law rules. The parties submit to the exclusive jurisdiction of the state and federal courts located in New Castle County, Delaware. Before filing, the parties agree to attempt good-faith resolution for 30 days.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    body: [
      "Questions about these terms can be sent to legal@matrioticstudios.com or by post to Matriotic Studios LLC, 1201 Orange St, Wilmington, DE 19801, United States.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      current="/legal/terms"
      breadcrumb="Terms"
      eyebrow="Legal"
      title="Terms of Service"
      updated="12 January 2026"
      lede="The commercial and legal framework for working with Matriotic Studios - written to be read, not skimmed past."
      sections={SECTIONS}
    />
  );
}

import type { Metadata } from "next";
import LegalShell, { type LegalSection } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Matriotic Studios LLC collects, uses, stores and protects personal information, including GDPR and CCPA rights.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    heading: "Overview",
    body: [
      "Matriotic Studios LLC (\u201cMatriotic\u201d, \u201cwe\u201d, \u201cus\u201d) is a Delaware limited liability company providing web design, development, search optimisation and maintenance services. This policy explains what personal information we collect, why we collect it, and the choices available to you.",
      "We collect the minimum data required to operate our business. We do not sell personal information, and we have never done so.",
    ],
  },
  {
    id: "controller",
    heading: "Data controller",
    body: [
      "For the purposes of the EU/UK General Data Protection Regulation, Matriotic Studios LLC is the data controller for information collected through matrioticstudios.com and the client portal. You can reach our privacy team at legal@matrioticstudios.com.",
    ],
  },
  {
    id: "collect",
    heading: "Information we collect",
    body: ["We collect information in three ways:"],
    list: [
      "Information you provide: name, email address, company, budget range and project details submitted through our enquiry form, newsletter sign-up or client portal registration.",
      "Account information: for portal users we store your name, email, optional company name and a salted scrypt hash of your password. We never store passwords in plain text.",
      "Technical information: IP-derived region, browser type, device category, referring URL and pages visited \u2014 collected only where you have consented to analytics cookies.",
    ],
  },
  {
    id: "use",
    heading: "How we use information",
    body: ["We process personal information to:"],
    list: [
      "Respond to enquiries and provide proposals.",
      "Deliver and administer contracted services.",
      "Authenticate client portal sessions and keep your account secure.",
      "Understand aggregate site performance and improve the experience.",
      "Send occasional studio updates where you have opted in (you may unsubscribe at any time).",
      "Meet legal, accounting and tax obligations.",
    ],
  },
  {
    id: "basis",
    heading: "Lawful bases",
    body: [
      "Where GDPR applies we rely on: performance of a contract (service delivery and portal access); legitimate interests (responding to business enquiries, securing our systems, aggregate analytics where permitted); consent (marketing communications and non-essential cookies); and legal obligation (financial record keeping).",
    ],
  },
  {
    id: "sharing",
    heading: "Sharing and processors",
    body: [
      "We share personal information only with vetted service providers acting on our instructions under written data-processing agreements. These include our cloud hosting provider, managed database provider, transactional email provider and accounting software. All are bound by confidentiality obligations and appropriate transfer mechanisms (including Standard Contractual Clauses where relevant).",
      "We may disclose information where required by law, to enforce our agreements, or to protect the rights and safety of our clients and staff.",
    ],
  },
  {
    id: "retention",
    heading: "Retention",
    body: [
      "Enquiry records are retained for 24 months from last contact. Client project records and related correspondence are retained for 7 years to satisfy contractual and tax obligations. Portal accounts are retained while active and deleted within 30 days of a verified deletion request. Consent records are retained for 12 months as evidence of compliance.",
    ],
  },
  {
    id: "security",
    heading: "Security",
    body: [
      "All traffic is served over TLS. Passwords are hashed using scrypt with a unique per-user salt. Portal sessions use signed, HTTP-only, SameSite cookies with a 14-day maximum lifetime and are revoked immediately on sign-out. Database access is restricted to least-privilege credentials, and backups are encrypted at rest.",
      "No system is perfectly secure. If a breach affecting your personal data occurs, we will notify affected individuals and the relevant supervisory authority without undue delay and within 72 hours where required.",
    ],
  },
  {
    id: "rights",
    heading: "Your rights",
    body: [
      "Depending on where you live, you may have the right to access, correct, delete, restrict or port your personal information, to object to certain processing, and to withdraw consent at any time.",
      "California residents (CCPA/CPRA) additionally have the right to know what categories of personal information we collect, to request deletion, to correct inaccurate information, and to opt out of \u201csale\u201d or \u201csharing\u201d \u2014 neither of which we conduct. We will never discriminate against you for exercising these rights.",
      "To exercise any right, email legal@matrioticstudios.com. We respond within 30 days and may need to verify your identity first.",
    ],
  },
  {
    id: "children",
    heading: "Children",
    body: [
      "Our services are directed at businesses. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us with data, contact us and we will delete it promptly.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: [
      "We may update this policy to reflect changes in our practices or the law. Material changes will be announced on this page with a revised effective date, and where required we will seek fresh consent.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      current="/legal/privacy"
      breadcrumb="Privacy"
      eyebrow="Legal"
      title="Privacy Policy"
      updated="12 January 2026"
      lede="Plain-language detail on what we collect, why we collect it and how you stay in control. No dark patterns, no buried clauses."
      sections={SECTIONS}
    />
  );
}

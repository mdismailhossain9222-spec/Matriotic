export const SERVICES = [
  {
    id: "development",
    index: "01",
    title: "Custom Web Development",
    tagline: "Engineering that disappears behind the experience.",
    description:
      "Hand-written Next.js and TypeScript architectures built for speed, resilience and longevity — no page builders, no bloat, no shortcuts.",
    deliverables: [
      "Next.js / React architecture",
      "Headless CMS integration",
      "E-commerce & payments",
      "API & third-party integrations",
      "Accessibility (WCAG 2.2 AA)",
      "Core Web Vitals budgeting",
    ],
    metric: "98+",
    metricLabel: "Average Lighthouse score",
  },
  {
    id: "design",
    index: "02",
    title: "UI/UX Design",
    tagline: "Taste, applied with discipline.",
    description:
      "Interfaces shaped by research and refined to the pixel. We design systems, not screens - typography, motion and spacing that hold up everywhere.",
    deliverables: [
      "Discovery & user research",
      "Information architecture",
      "High-fidelity UI design",
      "Design systems in Figma",
      "Motion & interaction specs",
      "Prototyping & usability tests",
    ],
    metric: "2.4×",
    metricLabel: "Average lift in engagement",
  },
  {
    id: "seo",
    index: "03",
    title: "Search Optimisation",
    tagline: "Be found by the people who matter.",
    description:
      "Technical SEO baked into the build, paired with content strategy and structured data that compounds your organic visibility month over month.",
    deliverables: [
      "Technical SEO audit",
      "Schema & structured data",
      "Content & keyword strategy",
      "Internal linking architecture",
      "Local & international SEO",
      "Monthly performance reporting",
    ],
    metric: "+184%",
    metricLabel: "Median organic growth, 12 mo",
  },
  {
    id: "care",
    index: "04",
    title: "Website Maintenance",
    tagline: "Quiet, continuous care.",
    description:
      "Proactive monitoring, security patching and iterative improvement. Your site stays fast, safe and current — long after launch day.",
    deliverables: [
      "24/7 uptime monitoring",
      "Security patching & hardening",
      "Daily encrypted backups",
      "Performance tuning",
      "Content updates",
      "Quarterly strategy reviews",
    ],
    metric: "99.98%",
    metricLabel: "Managed uptime in 2025",
  },
] as const;

export const WORK = [
  {
    slug: "aurelia-maison",
    client: "Aurelia Maison",
    title: "A couture house, translated to the screen",
    category: "E-commerce · Design & Build",
    year: "2025",
    image: "/images/work-1.jpg",
    summary:
      "A Parisian atelier needed an online flagship with the restraint of its boutique. We built a headless commerce experience with editorial pacing and sub-second navigation.",
    results: [
      { value: "+212%", label: "Online revenue" },
      { value: "0.9s", label: "Largest contentful paint" },
      { value: "+68%", label: "Return visitors" },
    ],
    stack: ["Next.js", "Shopify Headless", "Sanity", "Vercel"],
  },
  {
    slug: "northbridge-capital",
    client: "Northbridge Capital",
    title: "Institutional trust, rendered in dark mode",
    category: "Fintech · Product & Web",
    year: "2025",
    image: "/images/work-2.jpg",
    summary:
      "A private credit firm required a client portal and marketing site that felt as considered as its investment thesis. Security-first, data-dense, and quietly beautiful.",
    results: [
      { value: "$1.2B", label: "Assets onboarded" },
      { value: "-47%", label: "Support tickets" },
      { value: "AA", label: "WCAG conformance" },
    ],
    stack: ["Next.js", "PostgreSQL", "Drizzle", "AWS"],
  },
  {
    slug: "casa-solene",
    client: "Casa Solène",
    title: "Hospitality that books itself",
    category: "Hospitality · Brand & Web",
    year: "2024",
    image: "/images/work-3.jpg",
    summary:
      "A boutique hotel group in Lisbon. We rebuilt the booking journey around three taps, reduced abandonment and gave the brand a cinematic digital voice.",
    results: [
      { value: "+96%", label: "Direct bookings" },
      { value: "-38%", label: "Checkout abandonment" },
      { value: "4.9★", label: "Guest satisfaction" },
    ],
    stack: ["Next.js", "Stripe", "Framer Motion", "Cloudflare"],
  },
  {
    slug: "obsidian-type",
    client: "Obsidian Type Foundry",
    title: "An identity with weight and whisper",
    category: "Branding · Identity & Web",
    year: "2024",
    image: "/images/work-4.jpg",
    summary:
      "An independent type foundry wanted a storefront that showcased craft above conversion — and still tripled licences sold in the first quarter.",
    results: [
      { value: "3.1×", label: "Licences sold" },
      { value: "+140%", label: "Session duration" },
      { value: "12", label: "Design awards" },
    ],
    stack: ["Next.js", "WebGL", "Stripe", "Contentful"],
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Matriotic did not hand us a website. They handed us an argument for why our brand deserves attention — and then made it load in under a second.",
    name: "Camille Rousseau",
    role: "Creative Director, Aurelia Maison",
  },
  {
    quote:
      "The most rigorous engineering partner we have worked with. Every decision was defended with data, and every deadline was met without drama.",
    name: "Daniel Okafor",
    role: "Managing Partner, Northbridge Capital",
  },
  {
    quote:
      "They obsess over the details nobody asks for — and those details are exactly what our guests notice. Direct bookings nearly doubled.",
    name: "Inês Marques",
    role: "Founder, Casa Solène",
  },
] as const;

export const TEAM = [
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
] as const;

export const PRICING = [
  {
    name: "Starter",
    price: "499",
    range: "$499 – $900",
    cadence: "one-time",
    summary: "For startups, freelancers and local businesses that need a real presence, fast.",
    features: [
      "Up to 5 custom-coded pages",
      "Custom design — brand colours, logo, fonts",
      "Mobile responsive",
      "Basic SEO — meta tags, sitemap, speed optimisation",
      "Contact form, Google Maps & social links",
      "1 round of revisions",
      "14 days post-launch support",
    ],
    cta: "Get an estimate",
    featured: false,
    timeline: "1–2 weeks",
  },
  {
    name: "Professional",
    price: "999",
    range: "$999 – $3,000",
    cadence: "one-time",
    summary: "For growing businesses, e-commerce and service companies. Our most chosen plan.",
    features: [
      "Up to 12 pages, fully custom UI/UX design",
      "Custom animations and interactions",
      "Headless CMS for easy content editing",
      "E-commerce (up to 30 products) or blog/booking system",
      "On-page + technical SEO",
      "Analytics (GA4) and conversion tracking",
      "Integrations — email marketing, payment gateway",
      "2 rounds of revisions",
      "30 days post-launch support",
    ],
    cta: "Get an estimate",
    featured: true,
    timeline: "3–5 weeks",
  },
  {
    name: "Enterprise",
    price: "1,599",
    range: "$1,599 – $5,000+",
    cadence: "custom quote",
    summary: "For large businesses and web platforms with serious ambitions.",
    features: [
      "Unlimited pages, custom web application",
      "User portals, authentication, dashboards",
      "Custom backend, APIs, database",
      "Security and performance audit",
      "Multi-language support",
      "Dedicated project manager and QA testing",
      "Documentation and training",
      "Optional monthly maintenance retainer",
    ],
    cta: "Request a quote",
    featured: false,
    timeline: "6–10 weeks",
  },
] as const;

export const ADDONS = [
  { name: "Logo & brand identity", price: "$100 – $500" },
  { name: "Extra pages", price: "$30 – $80 per page" },
  { name: "Copywriting", price: "$20 – $60 per page" },
  { name: "Maintenance & hosting care", price: "$30 – $150 / month" },
  { name: "Monthly SEO", price: "$200 – $800 / month" },
  { name: "Speed optimisation", price: "$80 – $250" },
  { name: "Redesign / migration", price: "from $250" },
  { name: "Additional language", price: "$150 – $400" },
] as const;

export const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    body: "We interrogate the brief. Stakeholder interviews, competitive teardown, analytics forensics — until the real problem surfaces.",
  },
  {
    step: "02",
    title: "Definition",
    body: "Architecture, narrative and success metrics. You approve a map before a single pixel is drawn.",
  },
  {
    step: "03",
    title: "Design",
    body: "Typography, grid, colour and motion — composed as a system, reviewed in the open, refined until it is inevitable.",
  },
  {
    step: "04",
    title: "Build",
    body: "Hand-written code, component by component, with performance budgets enforced on every commit.",
  },
  {
    step: "05",
    title: "Launch",
    body: "Staged rollout, QA across devices, analytics instrumented, and a calm, documented handover.",
  },
  {
    step: "06",
    title: "Evolve",
    body: "Measure, learn, iterate. The best sites are never finished — they are continuously sharpened.",
  },
] as const;

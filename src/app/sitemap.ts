import type { MetadataRoute } from "next";

const BASE = "https://matrioticstudios.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/services", priority: 0.9 },
    { path: "/portfolio", priority: 0.9 },
    { path: "/pricing", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/legal/privacy", priority: 0.3 },
    { path: "/legal/terms", priority: 0.3 },
    { path: "/legal/cookies", priority: 0.3 },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r.priority,
  }));
}

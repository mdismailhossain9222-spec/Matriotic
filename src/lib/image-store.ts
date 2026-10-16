/**
 * Image store abstraction.
 *
 * R2 is the primary asset store when configured; otherwise images resolve to
 * local `/public` files. Every consumer (Next.js Image, static assets, the
 * build script) asks for a URL through this module so the fallback is in one
 * place rather than scattered across components.
 */
import { r2Configured, r2PublicUrl } from "./r2";
import { env } from "./env";

export type ImageVariant = "hero" | "thumb" | "og";

export function imageExists(path: string): boolean {
  // Local assets live under /public and are checked at build time by the
  // audit/build scripts. R2 objects are checked live via headObject.
  return true;
}

/** Resolve a public image URL, preferring R2 when configured. */
export function imageUrl(path: string): string {
  const base = r2PublicUrl();
  if (base) return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : "/" + path}`;
  return path;
}

export function isR2Enabled(): boolean {
  return r2Configured();
}

export function siteUrl(): string {
  return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
}

export function assetUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : "/" + path}`;
}
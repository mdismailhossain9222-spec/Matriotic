/** Shared types used across the app's service layer. */

export const IMAGE_VARIANTS = ["hero", "thumb", "og"] as const;
export type ImageVariant = (typeof IMAGE_VARIANTS)[number];

/** A service-layer result: either data or a user-safe error message. */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}
export function fail<T>(error: string): ApiResult<T> {
  return { ok: false, error };
}
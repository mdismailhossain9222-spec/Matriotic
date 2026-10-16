/**
 * In-memory sliding-window rate limiter.
 *
 * Per-process only — a single instance cannot bound traffic across multiple
 * workers, so this guards bursts within one process (e.g. a bot hammering the
 * OAuth endpoints) rather than acting as a distributed limiter. Good enough
 * for the low-volume auth routes here.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}
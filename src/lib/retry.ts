/**
 * Retry + fetch helpers for flaky external services (Neon cold start, R2, Resend).
 *
 * - `withRetry` wraps an async fn with exponential backoff + jitter.
 * - `fetchWithRetry` retries on 429 and 5xx only — 4xx (other than 429) are
 *   treated as definitive so validation errors don't burn retries.
 * - `isRetryable` decides whether a thrown error is worth retrying.
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  shouldRetry?: (error: unknown) => boolean;
}

const DEFAULTS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelayMs: 200,
  maxDelayMs: 5_000,
  jitter: true,
  shouldRetry: () => true,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class RetryableHttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = "RetryableHttpError";
    this.status = status;
  }
}

export function isRetryable(error: unknown): boolean {
  if (error instanceof RetryableHttpError) return true;
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    // Network-ish failures from pg / fetch / R2
    if (/econnrefused|econnreset|etimedout|enotfound|eai_again|socket|timeout|temporarily|unavailable|server closed|connection terminated|idle in timeout/.test(msg)) {
      return true;
    }
  }
  return false;
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxAttempts, baseDelayMs, maxDelayMs, jitter, shouldRetry } = { ...DEFAULTS, ...options };
  const retry = options.shouldRetry ? (e: unknown) => options.shouldRetry!(e) && isRetryable(e) : isRetryable;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      if (attempt >= maxAttempts || !retry(err)) break;
      const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
      const delay = jitter ? Math.random() * exp : exp;
      await sleep(delay);
    }
  }
  throw lastError;
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: RetryOptions = {},
): Promise<Response> {
  return withRetry(async () => {
    const res = await fetch(input, init);
    if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
      throw new RetryableHttpError(res.status);
    }
    return res;
  }, options);
}
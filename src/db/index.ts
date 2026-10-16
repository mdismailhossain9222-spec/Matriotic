import { Pool, type PoolConfig, type PoolClient } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";
import { withRetry, isRetryable } from "@/lib/retry";

/**
 * A pg Pool that retries `query`/`connect` on transient failures.
 *
 * Neon (and most serverless Postgres) returns a brand-new backend per
 * connection, so the first query after a cold start can fail with
 * "server closed the connection" or a timeout. Wrapping the pool means
 * every Drizzle operation — health checks, inserts, selects — gets the
 * retry behaviour instead of only the places we remember to wrap.
 *
 * It is a structural superset of `pg.Pool` (same `query`/`connect` shape),
 * so it satisfies Drizzle's `NodePgClient` contract.
 */
class RetryingPool {
  private readonly pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);
  }

  query(...args: Parameters<Pool["query"]>): ReturnType<Pool["query"]> {
    return withRetry(
      async () => this.pool.query(...args),
      { shouldRetry: isRetryable },
    ) as unknown as ReturnType<Pool["query"]>;
  }

  connect(): Promise<PoolClient> {
    return withRetry(
      async () => this.pool.connect(),
      { shouldRetry: isRetryable },
    ) as unknown as Promise<PoolClient>;
  }

  /** Expose the underlying pool so callers can drain/end it. */
  get raw(): Pool {
    return this.pool;
  }
}

const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: true,
  // Neon / serverless Postgres is flaky; a bad connection shouldn't hang forever.
  query_timeout: 15_000,
  statement_timeout: 15_000,
};

export const pool = new RetryingPool(poolConfig);
export const db = drizzle(pool as unknown as Pool, { schema });

/**
 * Run a single statement against the raw pool with retry. Useful for the
 * health check, which must not depend on Drizzle's query builder.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await withRetry(async () => pool.raw.query("select 1"), { shouldRetry: isRetryable });
    return true;
  } catch {
    return false;
  }
}

export { schema };
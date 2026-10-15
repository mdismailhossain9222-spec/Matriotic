import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;

const _db = pool ? drizzle(pool, { schema }) : null;

export function getDb() {
  if (!_db) {
    throw new Error("DATABASE_URL is not set. Database unavailable.");
  }
  return _db;
}

export { pool, schema };
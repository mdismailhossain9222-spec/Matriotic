import type { Config } from "drizzle-kit";
import { config } from "dotenv";
import path from "path";

// Load .env.local BEFORE .env so the real DATABASE_URL wins over the
// local-dev placeholder in .env. (dotenv loads files in order; later files
// override earlier ones, so .env would otherwise clobber the Supabase URL.)
config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

// Migrations run against the SESSION pooler (port 5432), which supports
// prepared statements. Runtime uses the TRANSACTION pooler (port 6543) via
// src/db/index.ts, which has prepared statements disabled.
export default {
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
} satisfies Config;
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "better-sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "sqlite.db",
  },
  verbose: true,
  strict: true,
} satisfies Config;

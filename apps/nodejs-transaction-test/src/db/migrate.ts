import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  const sqlite = new Database(process.env.DATABASE_URL);
  const db = drizzle(sqlite);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  console.log("Migrations applied successfully!");
  sqlite.close();
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

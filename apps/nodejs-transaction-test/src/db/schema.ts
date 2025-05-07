import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  balance: integer("balance").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const transactions = sqliteTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: ["deposit", "withdrawal"] }).notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  deleted: integer("deleted", { mode: "boolean" }).default(false).notNull(),
});

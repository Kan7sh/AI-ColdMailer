import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const EmailTable = pgTable("email", {
  id: serial().primaryKey(),
  userId: serial()
    .notNull()
    .references(() => UserTable.id),
  email: varchar().notNull(),
  passKey: varchar().notNull(),
  customPrompt: varchar(),
    createdAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
});

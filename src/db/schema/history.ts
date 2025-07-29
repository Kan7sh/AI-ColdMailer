import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { EmailTable } from "./email";
import { RecipientTable } from "./recipient";

export const HistoryTable = pgTable("history", {
  id: serial().notNull(),
  userId: serial()
    .notNull()
    .references(() => UserTable.id),
  senderEmailId: serial()
    .notNull()
    .references(() => EmailTable.id),
  recipientId: serial()
    .notNull()
    .references(() => RecipientTable.id),
  body:varchar().notNull(),
  subject:varchar().notNull(),
  createdAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
});

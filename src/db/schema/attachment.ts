import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { RecipientTable } from "./recipient";

export const AttachmentTable = pgTable("attachment", {
  id: serial().notNull(),
  recipientId: serial()
    .notNull()
    .references(() => RecipientTable.id),
  fileName: varchar().notNull(),
  fileLocation: varchar().notNull(),
    createdAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
});

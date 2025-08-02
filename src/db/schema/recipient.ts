import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { EmailTable } from "./email";

export const RecipientTable = pgTable("recipient", {
  id: serial().primaryKey(),
  senderEmailId: serial()
    .notNull()
    .references(() => EmailTable.id),
  name: varchar(),
  email: varchar().notNull(),
  companyName: varchar(),
  position: varchar(),
  areaOfInterest: varchar(),
  jobId: varchar(),
  includeProjects: boolean().notNull(),
  includePortfolio: boolean().notNull(),
  includeEducation: boolean().notNull(),
  includePastExperience: boolean().notNull(),
  customPrompt: varchar(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

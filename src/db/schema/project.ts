import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const ProjectsTable = pgTable("project", {
  id: serial().notNull(),
  userId: serial()
    .notNull()
    .references(() => UserTable.id),
  projectName: varchar().notNull(),
  techUsed: varchar().notNull(),
  description: varchar().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

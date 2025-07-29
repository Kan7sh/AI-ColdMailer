import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: serial().primaryKey(),
  name: varchar().notNull(),
  phoneNumber: varchar().notNull(),
  about: varchar(),
  portfolioLink: varchar(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

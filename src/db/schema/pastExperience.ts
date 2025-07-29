import { pgTable,serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const PastExperienceTable = pgTable('pastExperience',{
    id:serial().primaryKey(),
      userId: serial().notNull().references(() => UserTable.id),
    companyName:varchar().notNull(),
    workContributed: varchar().notNull(),
    duration:varchar().notNull(),
    role:varchar().notNull(),
      createdAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
      updatedAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
})
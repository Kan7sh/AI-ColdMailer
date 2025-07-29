import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const EducationTable = pgTable('education',{
    id:serial().primaryKey(),
      userId: serial().notNull().references(() => UserTable.id),
    university:varchar().notNull(),
    grade:varchar(),
    fieldOfStudy: varchar(),
      createdAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
      updatedAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
})
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";

export const SkillTable = pgTable('skill',{
    id:serial().notNull(),
      userId: serial().notNull().references(() => UserTable.id),
    skillName: varchar().notNull(),
      createdAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
      updatedAt:timestamp({ withTimezone: true }).notNull().defaultNow(),
})
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  title: text("title").notNull(),
  completed: integer("completed").notNull().default(0),
  createdAt: integer("created_at").notNull(),
})

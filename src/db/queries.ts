import { db } from "."
import { notes } from "./schema"
import { eq, desc } from "drizzle-orm"

export function listNotes() {
  return db.select().from(notes).orderBy(desc(notes.id)).all()
}

export function createNote(text: string, title: string) {
  const createdAt = Math.floor(Date.now() / 1000)

  const res = db.insert(notes).values({
    text,
    title,
    createdAt,
  }).run()

  return { id: Number(res.lastInsertRowid) }
}

export function completeNote(id: number) {
  const res = db.update(notes)
    .set({ completed: 1 })
    .where(eq(notes.id, id))
    .run()

  return { changes: res.changes }
}

export function deleteNote(id: number) {
  const res = db.delete(notes).where(eq(notes.id, id)).run()
  return { changes: res.changes }
}

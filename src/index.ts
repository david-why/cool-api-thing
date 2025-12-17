import { Hono } from "hono"
import { completeNote, createNote, deleteNote, listNotes } from "./db/queries"

const app = new Hono()

app.get("/", (c) => {
  return c.text("Hello Hono!")
})

app.get("/api/notes", (c) => c.json(listNotes()))

app.post("/api/notes", async (c) => {
  const body = await c.req.json().catch(() => null)
  const text = (body?.text ?? "").toString().trim()
  if (!text) return c.json({ error: "text is required" }, 400)
  const title = (body?.title ?? "").toString().trim()
  if (!title) return c.json({ error: "title is required" }, 400)

  return c.json(createNote(text, title), 201)
})

app.post("/api/notes/:id/complete", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad note id" }, 400)

  const res = completeNote(id)
  if (!res.changes) return c.json({ error: "note not found" }, 404)

  return c.json({ ok: true })
})

app.delete("/api/notes/:id", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad note id" }, 400)

  const res = deleteNote(id)
  if (res.changes === 0) return c.json({ error: "note not found" }, 404)

  return c.json({ ok: true })
})

// i believe port is read by default by bun
// i was wrong

export default {
  port: process.env.PORT || '3000',
  fetch: app.fetch
}

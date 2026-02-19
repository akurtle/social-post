import { Router } from "express";
import { z } from "zod";
import { db } from "../db.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export function postRoutes() {
  const r = Router();

  r.use(requireAuth);

  // Upload queued posts from device -> server
  r.post("/sync", (req: AuthedRequest, res) => {
    const body = z.object({
      posts: z.array(
        z.object({
          localId: z.string(),
          content: z.string().min(1),
          platform: z.enum(["twitter", "instagram", "tiktok", "linkedin", "other"]),
          scheduledAt: z.string()
        })
      )
    }).parse(req.body);

    const now = new Date().toISOString();
    const insert = db.prepare(`
      INSERT INTO posts (user_id, content, platform, scheduled_at, status, created_at)
      VALUES (?, ?, ?, ?, 'queued', ?)
    `);

    const created: Array<{ localId: string; serverId: number }> = [];
    const tx = db.transaction(() => {
      for (const p of body.posts) {
        const info = insert.run(req.userId!, p.content, p.platform, p.scheduledAt, now);
        created.push({ localId: p.localId, serverId: Number(info.lastInsertRowid) });
      }
    });

    tx();
    res.json({ created });
  });

  // List server posts
  r.get("/", (req: AuthedRequest, res) => {
    const rows = db.prepare(
      "SELECT id, content, platform, scheduled_at as scheduledAt, status, published_at as publishedAt FROM posts WHERE user_id = ? ORDER BY scheduled_at ASC"
    ).all(req.userId!);
    res.json({ posts: rows });
  });

  // "Publish" due posts (simulation)
  r.post("/publishDue", (req: AuthedRequest, res) => {
    const now = new Date().toISOString();

    const due = db.prepare(
      "SELECT id FROM posts WHERE user_id = ? AND status = 'queued' AND scheduled_at <= ? ORDER BY scheduled_at ASC LIMIT 25"
    ).all(req.userId!, now) as Array<{ id: number }>;

    const update = db.prepare(
      "UPDATE posts SET status='published', published_at=?, external_id=? WHERE id=? AND user_id=?"
    );

    const publishedIds: number[] = [];
    const tx = db.transaction(() => {
      for (const p of due) {
        const external = `demo_${p.id}_${Math.random().toString(16).slice(2)}`;
        update.run(now, external, p.id, req.userId!);
        publishedIds.push(p.id);
      }
    });
    tx();

    res.json({ published: publishedIds });
  });

  return r;
}

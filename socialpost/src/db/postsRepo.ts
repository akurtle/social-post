import { getDb } from "./sqlite";

export type Platform = "twitter" | "instagram" | "tiktok" | "linkedin" | "other";
export type LocalStatus = "draft" | "queued" | "synced" | "published" | "failed";

export type LocalPost = {
  id: string;
  content: string;
  platform: Platform;
  scheduledAt: string;
  status: LocalStatus;
  serverId?: number | null;
  createdAt: string;
};

export async function addLocalPost(p: Omit<LocalPost, "createdAt">) {
  const db = getDb();
  const createdAt = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO local_posts (id, content, platform, scheduled_at, status, server_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    p.id,
    p.content,
    p.platform,
    p.scheduledAt,
    p.status,
    p.serverId ?? null,
    createdAt
  );
}

export async function listLocalPosts(): Promise<LocalPost[]> {
  const db = getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT id, content, platform, scheduled_at as scheduledAt, status, server_id as serverId, created_at as createdAt
     FROM local_posts
     ORDER BY scheduled_at ASC`
  );
  return rows;
}

export async function markSynced(localId: string, serverId: number) {
  const db = getDb();
  await db.runAsync(`UPDATE local_posts SET status='synced', server_id=? WHERE id=?`, serverId, localId);
}

export async function markPublishedByServerId(serverId: number) {
  const db = getDb();
  await db.runAsync(`UPDATE local_posts SET status='published' WHERE server_id=?`, serverId);
}

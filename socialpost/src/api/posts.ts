import { apiFetch } from "./clients";
import type { Platform } from "../db/postsRepo";

export async function syncPosts(posts: Array<{ localId: string; content: string; platform: Platform; scheduledAt: string }>) {
  return apiFetch("/posts/sync", {
    method: "POST",
    body: JSON.stringify({ posts })
  }) as Promise<{ created: Array<{ localId: string; serverId: number }> }>;
}

export async function publishDue() {
  return apiFetch("/posts/publishDue", { method: "POST", body: JSON.stringify({}) }) as Promise<{ published: number[] }>;
}

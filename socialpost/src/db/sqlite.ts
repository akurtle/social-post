import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

export async function initDb() {
  db = await SQLite.openDatabaseAsync("social_scheduler.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS local_posts (
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      platform TEXT NOT NULL,
      scheduled_at TEXT NOT NULL,
      status TEXT NOT NULL, -- draft | queued | synced | published | failed
      server_id INTEGER,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_local_posts_sched ON local_posts(scheduled_at);
  `);
}

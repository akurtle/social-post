import request from "supertest";
import { describe, it, expect } from "vitest";
import { createServer } from "../app.js";

async function registerAndToken(app: any) {
  const reg = await request(app).post("/auth/register").send({
    email: `u${Date.now()}@test.com`,
    password: "password123"
  });
  return reg.body.token as string;
}

describe("posts", () => {
  it("syncs and publishes due posts", async () => {
    const app = createServer();
    const token = await registerAndToken(app);

    const now = new Date(Date.now() - 60_000).toISOString();
    const sync = await request(app)
      .post("/posts/sync")
      .set("Authorization", `Bearer ${token}`)
      .send({
        posts: [{ localId: "loc1", content: "Hello", platform: "twitter", scheduledAt: now }]
      });

    expect(sync.status).toBe(200);
    expect(sync.body.created.length).toBe(1);

    const pub = await request(app)
      .post("/posts/publishDue")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(pub.status).toBe(200);
    expect(pub.body.published.length).toBe(1);
  });
});

import request from "supertest";
import { describe, it, expect } from "vitest";
import { createServer } from "../app.js";

describe("auth", () => {
  it("registers and logs in", async () => {
    const app = createServer();

    const reg = await request(app).post("/auth/register").send({
      email: "a@test.com",
      password: "password123"
    });
    expect(reg.status).toBe(200);
    expect(reg.body.token).toBeTruthy();

    const login = await request(app).post("/auth/login").send({
      email: "a@test.com",
      password: "password123"
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});

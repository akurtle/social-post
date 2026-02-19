import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

export function authRoutes() {
  const r = Router();

  r.post("/register", (req, res) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(6) }).parse(req.body);

    const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(body.email);
    if (exists) return res.status(409).json({ error: "email_taken" });

    const hash = bcrypt.hashSync(body.password, 10);
    const now = new Date().toISOString();
    const info = db
      .prepare("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)")
      .run(body.email, hash, now);

    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign({ userId: Number(info.lastInsertRowid) }, secret, { expiresIn: "7d" });

    res.json({ token });
  });

  r.post("/login", (req, res) => {
    const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);

    const user = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(body.email) as
      | { id: number; password_hash: string }
      | undefined;

    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const ok = bcrypt.compareSync(body.password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const secret = process.env.JWT_SECRET || "dev_secret";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });
    res.json({ token });
  });

  return r;
}

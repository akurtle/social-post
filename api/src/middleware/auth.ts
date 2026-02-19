import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthedRequest = Request & { userId?: number };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "missing_token" });

  const token = header.slice("Bearer ".length);
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const payload = jwt.verify(token, secret) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

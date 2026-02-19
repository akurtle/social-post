import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit() {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
  const max = Number(process.env.RATE_LIMIT_MAX || 60);

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || "unknown";
    const now = Date.now();

    const b = buckets.get(key);
    if (!b || now > b.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader("X-RateLimit-Limit", String(max));
      return next();
    }

    if (b.count >= max) {
      const retry = Math.max(0, b.resetAt - now);
      res.setHeader("Retry-After", String(Math.ceil(retry / 1000)));
      return res.status(429).json({ error: "rate_limited" });
    }

    b.count += 1;
    res.setHeader("X-RateLimit-Limit", String(max));
    next();
  };
}

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { rateLimit } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/error";
import { authRoutes } from "./routes/auth";
import { postRoutes } from "./routes/posts";

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(rateLimit());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes());
  app.use("/posts", postRoutes());

  app.use(errorHandler);
  return app;
}

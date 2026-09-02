import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { createApp } from '../src/app';
import { database } from '../src/config/database';
import { logger } from '../src/shared/utils/logger.util';

// Serverless entry point for Vercel. Unlike src/server.ts (a long-lived
// process that connects once and calls app.listen), each invocation here
// may run in a fresh execution context — so the connection is established
// lazily and reused across "warm" invocations via mongoose's own connection
// state, rather than reconnecting on every request.
const app = createApp();
let connecting: Promise<void> | null = null;

async function ensureDbConnected(): Promise<void> {
  if (mongoose.connection.readyState === 1) return; // already connected
  if (!connecting) {
    connecting = database.connect().catch((err) => {
      connecting = null; // allow retry on the next invocation
      throw err;
    });
  }
  await connecting;
}

export default async function handler(req: Request, res: Response): Promise<void> {
  // Health checks should reflect whether the function itself is up, not
  // whether Mongo happens to be reachable at this instant.
  if (req.url === '/health') {
    app(req, res);
    return;
  }

  try {
    await ensureDbConnected();
  } catch (err) {
    logger.error('Database connection failed', err);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable — database connection failed',
      error: { code: 'DB_UNAVAILABLE' },
    });
    return;
  }
  app(req, res);
}

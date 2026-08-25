/* eslint-disable no-console */
import { env } from '../../config/env';

class Logger {
  info(message: string, meta?: unknown): void {
    console.log(`[INFO] ${message}`, meta ?? '');
  }

  warn(message: string, meta?: unknown): void {
    console.warn(`[WARN] ${message}`, meta ?? '');
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error ?? '');
  }

  debug(message: string, meta?: unknown): void {
    if (!env.isProduction) {
      console.debug(`[DEBUG] ${message}`, meta ?? '');
    }
  }
}

export const logger = new Logger();

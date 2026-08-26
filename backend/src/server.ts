import http from 'http';
import { createApp } from './app';
import { database } from './config/database';
import { env } from './config/env';
import { logger } from './shared/utils/logger.util';

async function bootstrap(): Promise<void> {
  await database.connect();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port} [${env.nodeEnv}]`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    server.close(async () => {
      await database.disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});

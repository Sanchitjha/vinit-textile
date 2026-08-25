import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { requestLogger } from './middleware/requestLogger.middleware';
import { paymentWebhookRouter } from './modules/payment/payment.webhook.routes';
import { router as apiRouter } from './routes';

export function createApp(): Application {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          // swagger-ui-express renders with inline <script>/<style> tags.
          'script-src': ["'self'", "'unsafe-inline'"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(requestLogger);

  // Razorpay webhook needs the raw request body for signature verification,
  // so it is mounted before the global JSON body parser.
  app.use(`/api/${env.apiVersion}/payments/webhook`, paymentWebhookRouter);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(`/api/${env.apiVersion}`, apiLimiter, apiRouter);

  app.get('/api-docs.json', (_req, res) => {
    res.status(200).json(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'OK', data: { uptime: process.uptime() } });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

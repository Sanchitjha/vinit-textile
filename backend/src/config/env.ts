import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_VERSION: z.string().default('v1'),

  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  RAZORPAY_KEY_ID: z.string().optional().default(''),
  RAZORPAY_KEY_SECRET: z.string().optional().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(''),

  LOW_STOCK_THRESHOLD: z.coerce.number().int().nonnegative().default(5),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().nonnegative().default(2000),
  STANDARD_SHIPPING_FEE: z.coerce.number().nonnegative().default(99),

  AWS_REGION: z.string().optional().default(''),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  AWS_S3_BUCKET_NAME: z.string().optional().default(''),

  RESEND_API_KEY: z.string().optional().default(''),
  RESEND_FROM_EMAIL: z.string().optional().default('Vinit Textiles <onboarding@resend.dev>'),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

const parsedEnv = loadEnv();

export const env = {
  nodeEnv: parsedEnv.NODE_ENV,
  isProduction: parsedEnv.NODE_ENV === 'production',
  isTest: parsedEnv.NODE_ENV === 'test',
  port: parsedEnv.PORT,
  apiVersion: parsedEnv.API_VERSION,

  mongoUri: parsedEnv.MONGO_URI,

  jwt: {
    accessSecret: parsedEnv.JWT_ACCESS_SECRET,
    refreshSecret: parsedEnv.JWT_REFRESH_SECRET,
    accessExpiry: parsedEnv.JWT_ACCESS_EXPIRY,
    refreshExpiry: parsedEnv.JWT_REFRESH_EXPIRY,
  },

  corsOrigins: parsedEnv.CORS_ORIGIN.split(',').map((origin) => origin.trim()),

  razorpay: {
    keyId: parsedEnv.RAZORPAY_KEY_ID,
    keySecret: parsedEnv.RAZORPAY_KEY_SECRET,
    webhookSecret: parsedEnv.RAZORPAY_WEBHOOK_SECRET,
    isConfigured: Boolean(parsedEnv.RAZORPAY_KEY_ID && parsedEnv.RAZORPAY_KEY_SECRET),
  },

  business: {
    lowStockThreshold: parsedEnv.LOW_STOCK_THRESHOLD,
    freeShippingThreshold: parsedEnv.FREE_SHIPPING_THRESHOLD,
    standardShippingFee: parsedEnv.STANDARD_SHIPPING_FEE,
  },

  aws: {
    region: parsedEnv.AWS_REGION,
    accessKeyId: parsedEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: parsedEnv.AWS_SECRET_ACCESS_KEY,
    s3BucketName: parsedEnv.AWS_S3_BUCKET_NAME,
    isConfigured: Boolean(parsedEnv.AWS_REGION && parsedEnv.AWS_ACCESS_KEY_ID && parsedEnv.AWS_SECRET_ACCESS_KEY && parsedEnv.AWS_S3_BUCKET_NAME),
  },

  resend: {
    apiKey: parsedEnv.RESEND_API_KEY,
    fromEmail: parsedEnv.RESEND_FROM_EMAIL,
    // Without a key we fall back to logging the OTP server-side (see mailer.service.ts)
    // so email-OTP login still works end-to-end in development.
    isConfigured: Boolean(parsedEnv.RESEND_API_KEY),
  },
} as const;

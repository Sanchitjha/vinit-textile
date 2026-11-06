import 'dotenv/config';
import { z } from 'zod';

// Development-only fallbacks. They are public (they live in the repo), so a deployed server must never use them.
const DEV_JWT_ACCESS_SECRET = 'vinit-textiles-access-secret-2026';
const DEV_JWT_REFRESH_SECRET = 'vinit-textiles-refresh-secret-2026';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_VERSION: z.string().default('v1'),

  // Number of reverse proxies in front of the app (Render's load balancer = 1). Without it every client
  // appears to have the proxy's IP, so the rate limiters count all users together.
  TRUST_PROXY_HOPS: z.coerce.number().int().nonnegative().default(1),
  // Deployed servers set this to "true": the app refuses to start on the development fallbacks below.
  STRICT_ENV: z.enum(['true', 'false']).default('false'),

  // First-run admin account (only used when the database has no admin yet). On a deployed server (STRICT_ENV=true)
  // no admin is created unless ADMIN_PASSWORD is set; the public dev default is never used there.
  ADMIN_EMAIL: z.string().optional().default('admin@vinittextiles.com'),
  ADMIN_PASSWORD: z.string().optional().default(''),

  MONGO_URI: z.string().default('in-memory'),

  JWT_ACCESS_SECRET: z.string().default(DEV_JWT_ACCESS_SECRET),
  JWT_REFRESH_SECRET: z.string().default(DEV_JWT_REFRESH_SECRET),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),

  RAZORPAY_KEY_ID: z.string().optional().default(''),
  RAZORPAY_KEY_SECRET: z.string().optional().default(''),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(''),
  // Local development only: lets checkout use the stub gateway, which accepts ANY payment as genuine.
  // Must never be set on a deployed server (independent of NODE_ENV, which is not always set correctly).
  ALLOW_STUB_PAYMENTS: z.enum(['true', 'false']).optional().default('false'),

  LOW_STOCK_THRESHOLD: z.coerce.number().int().nonnegative().default(5),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().nonnegative().default(2000),
  STANDARD_SHIPPING_FEE: z.coerce.number().nonnegative().default(99),

  AWS_REGION: z.string().optional().default(''),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  AWS_S3_BUCKET_NAME: z.string().optional().default(''),

  DELHIVERY_API_TOKEN: z.string().optional().default(''),
  DELHIVERY_BASE_URL: z.string().optional().default('https://track.delhivery.com'),

  // Clerk (customer sign-in). The secret key is used to look up the verified email of a Clerk session.
  CLERK_SECRET_KEY: z.string().optional().default(''),
  CLERK_ISSUER: z.string().optional().default('https://clerk.vinittextiles.com'),

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

  if (parsed.data.STRICT_ENV === 'true') {
    const missing: string[] = [];
    if (parsed.data.MONGO_URI === 'in-memory') missing.push('MONGO_URI');
    if (parsed.data.JWT_ACCESS_SECRET === DEV_JWT_ACCESS_SECRET) missing.push('JWT_ACCESS_SECRET');
    if (parsed.data.JWT_REFRESH_SECRET === DEV_JWT_REFRESH_SECRET) missing.push('JWT_REFRESH_SECRET');
    if (missing.length > 0) {
      // eslint-disable-next-line no-console
      console.error(`STRICT_ENV is on but these are not set (or still use the public dev defaults): ${missing.join(', ')}`);
      process.exit(1);
    }
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
  trustProxyHops: parsedEnv.TRUST_PROXY_HOPS,
  strictEnv: parsedEnv.STRICT_ENV === 'true',
  admin: {
    email: parsedEnv.ADMIN_EMAIL.trim().toLowerCase(),
    password: parsedEnv.ADMIN_PASSWORD,
  },

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
    allowStub: parsedEnv.ALLOW_STUB_PAYMENTS === 'true',
    // Online payment is only offered with real credentials (or the explicit local-dev stub flag).
    // No keys means Cash on Delivery only.
    isEnabled:
      Boolean(parsedEnv.RAZORPAY_KEY_ID && parsedEnv.RAZORPAY_KEY_SECRET) || parsedEnv.ALLOW_STUB_PAYMENTS === 'true',
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

  delhivery: {
    apiToken: parsedEnv.DELHIVERY_API_TOKEN,
    baseUrl: parsedEnv.DELHIVERY_BASE_URL.replace(/\/$/, ''),
    isConfigured: Boolean(parsedEnv.DELHIVERY_API_TOKEN),
  },

  clerk: {
    secretKey: parsedEnv.CLERK_SECRET_KEY,
    issuer: parsedEnv.CLERK_ISSUER.replace(/\/$/, ''),
    isConfigured: Boolean(parsedEnv.CLERK_SECRET_KEY),
  },

  resend: {
    apiKey: parsedEnv.RESEND_API_KEY,
    fromEmail: parsedEnv.RESEND_FROM_EMAIL,
    // Without a key we fall back to logging the OTP server-side (see mailer.service.ts)
    // so email-OTP login still works end-to-end in development.
    isConfigured: Boolean(parsedEnv.RESEND_API_KEY),
  },
} as const;

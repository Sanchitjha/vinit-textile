import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.isProduction ? 1500 : 100000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    error: { code: 'RATE_LIMITED' },
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    error: { code: 'RATE_LIMITED' },
  },
});

// Public shipping lookups (pincode check / tracking) each spend Delhivery API quota.
export const shippingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many shipping lookups, please try again later',
    error: { code: 'RATE_LIMITED' },
  },
});

// Tighter than authLimiter — each request sends a real email (cost + abuse
// surface), so OTP requests get their own stricter window.
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many code requests, please try again later',
    error: { code: 'RATE_LIMITED' },
  },
});

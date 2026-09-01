import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { AuthController } from './auth.controller';
import { LoginDto, RegisterDto, SendOtpDto, VerifyOtpDto } from './auth.dto';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new customer account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registered successfully — sets a refreshToken httpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResult'
 *       409:
 *         description: Email or phone already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/register', authLimiter, validate(RegisterDto), asyncHandler(controller.register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Logged in successfully — sets a refreshToken httpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResult'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/login', authLimiter, validate(LoginDto), asyncHandler(controller.login));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rotate the access/refresh token pair using the refreshToken cookie
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Refresh token missing, invalid, or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/refresh', authLimiter, asyncHandler(controller.refresh));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the current authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/me', authenticate, asyncHandler(controller.me));

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoke the current refresh token and clear the cookie
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.post('/logout', authenticate, asyncHandler(controller.logout));

/**
 * @swagger
 * /auth/otp/send:
 *   post:
 *     tags: [Auth]
 *     summary: Email a one-time verification code (via Resend) to log in or sign up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Code sent (always returns success even for unknown emails, to avoid leaking account existence)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.post('/otp/send', otpLimiter, validate(SendOtpDto), asyncHandler(controller.sendOtp));

/**
 * @swagger
 * /auth/otp/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify an emailed code — logs in, or creates the account on first use
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *               name:
 *                 type: string
 *                 description: Used only when this email has no existing account
 *     responses:
 *       200:
 *         description: Logged in successfully — sets a refreshToken httpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResult'
 *       401:
 *         description: Code missing, expired, already used, or incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/otp/verify', otpLimiter, validate(VerifyOtpDto), asyncHandler(controller.verifyOtp));

export { router as authRouter };

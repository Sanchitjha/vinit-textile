import express, { Request, Response, Router } from 'express';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { PaymentService } from './payment.service';

// Mounted in app.ts ahead of the global express.json() parser: Razorpay
// signature verification requires the exact raw request bytes.
const router = Router();
const paymentService = new PaymentService();

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     tags: [Payments]
 *     summary: Razorpay webhook receiver (no auth — verified via HMAC signature header instead)
 *     description: >
 *       Mounted ahead of the global JSON body parser so the exact raw request
 *       bytes are available for `x-razorpay-signature` HMAC verification.
 *       Not intended to be called by API clients directly.
 *     parameters:
 *       - in: header
 *         name: x-razorpay-signature
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200:
 *         description: Webhook processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Invalid webhook signature
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/',
  express.raw({ type: '*/*' }),
  asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    await paymentService.handleWebhook(req.body as Buffer, signature ?? '');
    ApiResponse.success(res, 'Webhook processed');
  }),
);

export { router as paymentWebhookRouter };

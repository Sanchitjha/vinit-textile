import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { PaymentController } from './payment.controller';
import { InitiatePaymentParamsDto, RefundParamsDto, VerifyPaymentDto } from './payment.dto';

const router = Router();
const controller = new PaymentController();

router.use(authenticate);

/**
 * @swagger
 * /payments/{orderId}/initiate:
 *   post:
 *     tags: [Payments]
 *     summary: Create a provider payment order for an existing order (Razorpay, or the stub provider in dev)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/InitiatePaymentResult'
 *       400:
 *         description: Order does not use online payment, or is already paid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/:orderId/initiate',
  validate(InitiatePaymentParamsDto, 'params'),
  asyncHandler(controller.initiate),
);

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     tags: [Payments]
 *     summary: Verify a completed payment signature; marks the order PAID/CONFIRMED
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPaymentInput'
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Signature verification failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/verify', validate(VerifyPaymentDto), asyncHandler(controller.verify));

/**
 * @swagger
 * /payments/{orderId}/refund:
 *   post:
 *     tags: [Payments]
 *     summary: Refund the successful payment for an order (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Payment refunded successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Payment'
 *       400:
 *         description: No successful payment found for this order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post(
  '/:orderId/refund',
  authorize(Role.ADMIN),
  validate(RefundParamsDto, 'params'),
  asyncHandler(controller.refund),
);

export { router as paymentRouter };

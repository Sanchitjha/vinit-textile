import { Router } from 'express';
import { shippingLimiter } from '../../middleware/rateLimiter.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { ShippingController } from './shipping.controller';
import { AwbParamsDto, PincodeParamsDto } from './shipping.dto';

const router = Router();
const controller = new ShippingController();

// Public, but rate-limited: every call spends the store's Delhivery API quota.
router.use(shippingLimiter);

/**
 * @swagger
 * /shipping/serviceability/{pincode}:
 *   get:
 *     tags: [Shipping]
 *     summary: Check Delhivery delivery / COD availability for a pincode
 *     parameters:
 *       - in: path
 *         name: pincode
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Serviceability (serviceable is null when Delhivery is not configured or unreachable)
 */
router.get('/serviceability/:pincode', validate(PincodeParamsDto, 'params'), asyncHandler(controller.serviceability));

/**
 * @swagger
 * /shipping/track/{awb}:
 *   get:
 *     tags: [Shipping]
 *     summary: Live Delhivery tracking by AWB / waybill number
 *     parameters:
 *       - in: path
 *         name: awb
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tracking status and scan history (found is false when the AWB is unknown)
 */
router.get('/track/:awb', validate(AwbParamsDto, 'params'), asyncHandler(controller.track));

export { router as shippingRouter };

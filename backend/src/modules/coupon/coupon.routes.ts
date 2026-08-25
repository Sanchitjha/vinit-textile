import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { CouponController } from './coupon.controller';
import { CouponParamsDto, CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './coupon.dto';

const router = Router();
const controller = new CouponController();

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     tags: [Coupons]
 *     summary: Validate a coupon code against an order value and get the computed discount
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateCouponInput'
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Coupon expired, below minimum order value, or usage limit reached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Coupon not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/validate', authenticate, validate(ValidateCouponDto), asyncHandler(controller.validate));

router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: List coupons (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupons fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Coupon'
 *   post:
 *     tags: [Coupons]
 *     summary: Create a coupon (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponInput'
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       409:
 *         description: Coupon code already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', asyncHandler(controller.list));
router.post('/', validate(CreateCouponDto), asyncHandler(controller.create));

/**
 * @swagger
 * /coupons/{id}:
 *   patch:
 *     tags: [Coupons]
 *     summary: Update a coupon (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CouponInput'
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *   delete:
 *     tags: [Coupons]
 *     summary: Delete a coupon (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.patch(
  '/:id',
  validate(CouponParamsDto, 'params'),
  validate(UpdateCouponDto),
  asyncHandler(controller.update),
);
router.delete('/:id', validate(CouponParamsDto, 'params'), asyncHandler(controller.remove));

export { router as couponRouter };

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { AdminOrderController } from './order.admin.controller';
import { OrderParamsDto, OrderQueryDto, UpdateOrderStatusDto } from './order.dto';

const router = Router();
const controller = new AdminOrderController();

router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: [Admin Orders]
 *     summary: List all orders (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/OrderPaginated'
 */
router.get('/', validate(OrderQueryDto, 'query'), asyncHandler(controller.list));

/**
 * @swagger
 * /admin/orders/{id}/status:
 *   patch:
 *     tags: [Admin Orders]
 *     summary: Update an order's status (admin only)
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
 *             $ref: '#/components/schemas/UpdateOrderStatusInput'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 */
router.patch(
  '/:id/status',
  validate(OrderParamsDto, 'params'),
  validate(UpdateOrderStatusDto),
  asyncHandler(controller.updateStatus),
);

export { router as adminOrderRouter };

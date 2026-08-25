import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { AdminController } from './admin.controller';
import { AdminUserParamsDto, AdminUserQueryDto, UpdateUserStatusDto } from './admin.dto';

const router = Router();
const controller = new AdminController();

router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Dashboard stats — total orders, total revenue, low-stock count (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/DashboardStats'
 */
router.get('/dashboard', asyncHandler(controller.dashboard));

/**
 * @swagger
 * /admin/dashboard/low-stock:
 *   get:
 *     tags: [Admin]
 *     summary: List sarees at or below the low-stock threshold (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock sarees fetched successfully
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
 *                         $ref: '#/components/schemas/Saree'
 */
router.get('/dashboard/low-stock', asyncHandler(controller.lowStock));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List customers (admin only)
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
 *         name: isActive
 *         schema: { type: string, enum: ['true', 'false'] }
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/UserPaginated'
 */
router.get('/users', validate(AdminUserQueryDto, 'query'), asyncHandler(controller.listUsers));

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     tags: [Admin]
 *     summary: Activate or deactivate a customer (admin only)
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
 *             $ref: '#/components/schemas/UpdateUserStatusInput'
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 */
router.patch(
  '/users/:id/status',
  validate(AdminUserParamsDto, 'params'),
  validate(UpdateUserStatusDto),
  asyncHandler(controller.updateUserStatus),
);

export { router as adminRouter };

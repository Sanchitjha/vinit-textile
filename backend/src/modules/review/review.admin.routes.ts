import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { AdminReviewController } from './review.admin.controller';
import { ReviewParamsDto, ReviewQueryDto } from './review.dto';

const router = Router();
const controller = new AdminReviewController();

router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: List reviews for moderation (admin only)
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
 *         name: isApproved
 *         schema: { type: string, enum: ['true', 'false'] }
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ReviewPaginated'
 */
router.get('/', validate(ReviewQueryDto, 'query'), asyncHandler(controller.list));

/**
 * @swagger
 * /admin/reviews/{id}/approve:
 *   patch:
 *     tags: [Admin]
 *     summary: Approve a review (admin only) — recomputes the saree's rating average
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 */
router.patch('/:id/approve', validate(ReviewParamsDto, 'params'), asyncHandler(controller.approve));

export { router as adminReviewRouter };

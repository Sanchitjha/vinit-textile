import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { ReviewController } from './review.controller';
import { CreateReviewDto, ReviewQueryDto, SareeIdParamsDto } from './review.dto';

// Mounted at /api/v1/sarees/:sareeId/reviews (mergeParams to read sareeId).
const router = Router({ mergeParams: true });
const controller = new ReviewController();

/**
 * @swagger
 * /sarees/{sareeId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: List approved reviews for a saree
 *     parameters:
 *       - in: path
 *         name: sareeId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
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
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review — only allowed for a delivered order that contains this saree
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sareeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewInput'
 *     responses:
 *       201:
 *         description: Review submitted successfully, pending moderation
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: The order does not include this saree
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Order has not been delivered yet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       409:
 *         description: You have already reviewed this saree
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get(
  '/',
  validate(SareeIdParamsDto, 'params'),
  validate(ReviewQueryDto, 'query'),
  asyncHandler(controller.list),
);
router.post(
  '/',
  authenticate,
  validate(SareeIdParamsDto, 'params'),
  validate(CreateReviewDto),
  asyncHandler(controller.create),
);

export { router as reviewRouter };

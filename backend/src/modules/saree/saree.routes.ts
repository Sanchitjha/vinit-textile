import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { reviewRouter } from '../review/review.routes';
import { SareeController } from './saree.controller';
import {
  AdjustStockDto,
  CreateSareeDto,
  SareeParamsDto,
  SareeQueryDto,
  SareeSlugParamsDto,
  UpdateSareeDto,
} from './saree.dto';

const router = Router();
const controller = new SareeController();

/**
 * @swagger
 * /sarees:
 *   get:
 *     tags: [Sarees]
 *     summary: Search, filter, sort, and paginate sarees
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search across name/description/tags
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Category id
 *       - in: query
 *         name: subCategory
 *         schema: { type: string }
 *       - in: query
 *         name: fabric
 *         schema: { type: string }
 *       - in: query
 *         name: sareeType
 *         schema: { type: string }
 *       - in: query
 *         name: color
 *         schema: { type: string }
 *       - in: query
 *         name: occasion
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: featured
 *         schema: { type: string, enum: ['true', 'false'] }
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest, oldest, rating_desc, name_asc]
 *           default: newest
 *     responses:
 *       200:
 *         description: Sarees fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SareePaginated'
 *   post:
 *     tags: [Sarees]
 *     summary: Create a saree (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SareeInput'
 *     responses:
 *       201:
 *         description: Saree created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Saree'
 *       409:
 *         description: SKU already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', validate(SareeQueryDto, 'query'), asyncHandler(controller.list));

/**
 * @swagger
 * /sarees/slug/{slug}:
 *   get:
 *     tags: [Sarees]
 *     summary: Get a saree by its slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Saree fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Saree'
 *       404:
 *         description: Saree not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/slug/:slug', validate(SareeSlugParamsDto, 'params'), asyncHandler(controller.getBySlug));

/**
 * @swagger
 * /sarees/{id}:
 *   get:
 *     tags: [Sarees]
 *     summary: Get a saree by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Saree fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Saree'
 *       404:
 *         description: Saree not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   patch:
 *     tags: [Sarees]
 *     summary: Update a saree (admin only)
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
 *             $ref: '#/components/schemas/SareeInput'
 *     responses:
 *       200:
 *         description: Saree updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *   delete:
 *     tags: [Sarees]
 *     summary: Delete a saree (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Saree deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.get('/:id', validate(SareeParamsDto, 'params'), asyncHandler(controller.getById));

router.use('/:sareeId/reviews', reviewRouter);

router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(CreateSareeDto),
  asyncHandler(controller.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(SareeParamsDto, 'params'),
  validate(UpdateSareeDto),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(SareeParamsDto, 'params'),
  asyncHandler(controller.remove),
);

/**
 * @swagger
 * /sarees/{id}/stock:
 *   patch:
 *     tags: [Sarees]
 *     summary: Adjust stock by a signed delta (admin only)
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
 *             $ref: '#/components/schemas/AdjustStockInput'
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Saree'
 *       400:
 *         description: Stock cannot go below zero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch(
  '/:id/stock',
  authenticate,
  authorize(Role.ADMIN),
  validate(SareeParamsDto, 'params'),
  validate(AdjustStockDto),
  asyncHandler(controller.adjustStock),
);

export { router as sareeRouter };

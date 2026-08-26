import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { CategoryController } from './category.controller';
import { CategoryParamsDto, CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from './category.dto';

const router = Router();
const controller = new CategoryController();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List categories
 *     parameters:
 *       - in: query
 *         name: parentCategory
 *         schema: { type: string }
 *         description: Filter to subcategories of this parent category id
 *       - in: query
 *         name: isActive
 *         schema: { type: string, enum: ['true', 'false'] }
 *     responses:
 *       200:
 *         description: Categories fetched successfully
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
 *                         $ref: '#/components/schemas/Category'
 *   post:
 *     tags: [Categories]
 *     summary: Create a category (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       409:
 *         description: Category name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/', validate(CategoryQueryDto, 'query'), asyncHandler(controller.list));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get a category by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   patch:
 *     tags: [Categories]
 *     summary: Update a category (admin only)
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
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category (admin only) — blocked if it has subcategories or sarees
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       409:
 *         description: Category has subcategories or is assigned to sarees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get('/:id', validate(CategoryParamsDto, 'params'), asyncHandler(controller.getById));

router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(CreateCategoryDto),
  asyncHandler(controller.create),
);
router.patch(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(CategoryParamsDto, 'params'),
  validate(UpdateCategoryDto),
  asyncHandler(controller.update),
);
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(CategoryParamsDto, 'params'),
  asyncHandler(controller.remove),
);

export { router as categoryRouter };

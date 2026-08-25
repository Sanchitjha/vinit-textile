import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { WishlistController } from './wishlist.controller';
import { WishlistParamsDto } from './wishlist.dto';

const router = Router();
const controller = new WishlistController();

router.use(authenticate);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get the current user's wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
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
router.get('/', asyncHandler(controller.getWishlist));

/**
 * @swagger
 * /wishlist/{sareeId}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add a saree to the wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sareeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Saree added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove a saree from the wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sareeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Saree removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.post('/:sareeId', validate(WishlistParamsDto, 'params'), asyncHandler(controller.addSaree));
router.delete('/:sareeId', validate(WishlistParamsDto, 'params'), asyncHandler(controller.removeSaree));

export { router as wishlistRouter };

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { CartController } from './cart.controller';
import { AddCartItemDto, CartItemParamsDto, UpdateCartItemDto } from './cart.dto';

const router = Router();
const controller = new CartController();

router.use(authenticate);

/**
 * @swagger
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get the current user's cart, enriched with live saree price/stock
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cart'
 *   delete:
 *     tags: [Cart]
 *     summary: Clear the cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.get('/', asyncHandler(controller.getCart));

/**
 * @swagger
 * /cart/items:
 *   post:
 *     tags: [Cart]
 *     summary: Add an item to the cart (price is always re-read from the Saree collection)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCartItemInput'
 *     responses:
 *       201:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Insufficient stock or saree is out of stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/items', validate(AddCartItemDto), asyncHandler(controller.addItem));

/**
 * @swagger
 * /cart/items/{sareeId}:
 *   patch:
 *     tags: [Cart]
 *     summary: Set the quantity of a cart item
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
 *             $ref: '#/components/schemas/UpdateCartItemInput'
 *     responses:
 *       200:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *   delete:
 *     tags: [Cart]
 *     summary: Remove an item from the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sareeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.patch(
  '/items/:sareeId',
  validate(CartItemParamsDto, 'params'),
  validate(UpdateCartItemDto),
  asyncHandler(controller.updateItem),
);
router.delete(
  '/items/:sareeId',
  validate(CartItemParamsDto, 'params'),
  asyncHandler(controller.removeItem),
);
router.delete('/', asyncHandler(controller.clearCart));

export { router as cartRouter };

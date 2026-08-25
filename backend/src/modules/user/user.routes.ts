import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { validate } from '../../middleware/validate.middleware';
import { AddressDto, AddressParamsDto, UpdateAddressDto, UpdateProfileDto } from './user.dto';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.use(authenticate);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     tags: [Users]
 *     summary: Update the current user's name/phone/avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
// Profile read is exposed at GET /api/v1/auth/me (spec); this module exposes
// the mutation side plus address management.
router.patch('/me', validate(UpdateProfileDto), asyncHandler(controller.updateMe));

/**
 * @swagger
 * /users/addresses:
 *   get:
 *     tags: [Users]
 *     summary: List the current user's saved addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
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
 *                         $ref: '#/components/schemas/Address'
 *   post:
 *     tags: [Users]
 *     summary: Add a new address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.get('/addresses', asyncHandler(controller.listAddresses));
router.post('/addresses', validate(AddressDto), asyncHandler(controller.addAddress));

/**
 * @swagger
 * /users/addresses/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update an address
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
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   delete:
 *     tags: [Users]
 *     summary: Remove an address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Address removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 */
router.patch(
  '/addresses/:id',
  validate(AddressParamsDto, 'params'),
  validate(UpdateAddressDto),
  asyncHandler(controller.updateAddress),
);
router.delete(
  '/addresses/:id',
  validate(AddressParamsDto, 'params'),
  asyncHandler(controller.removeAddress),
);

export { router as userRouter };

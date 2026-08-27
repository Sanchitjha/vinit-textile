import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorize.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '../../shared/constants/roles.constant';
import { asyncHandler } from '../../shared/utils/asyncHandler.util';
import { UploadController } from './upload.controller';
import {
  AbortUploadDto,
  CompleteUploadDto,
  DeleteFileDto,
  GetPresignedUrlsDto,
  StartUploadDto,
} from './upload.dto';

const router = Router();
const controller = new UploadController();

// Only ADMIN can upload or delete files to prevent bucket abuse
router.use(authenticate, authorize(Role.ADMIN));

/**
 * @swagger
 * /upload/start:
 *   post:
 *     tags: [Upload]
 *     summary: Start a multipart upload to S3 (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *               contentType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload started
 */
router.post('/start', validate(StartUploadDto), asyncHandler(controller.start));

/**
 * @swagger
 * /upload/multipart:
 *   post:
 *     tags: [Upload]
 *     summary: Get presigned URLs for each part (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               uploadId:
 *                 type: string
 *               parts:
 *                 type: integer
 *     responses:
 *       200:
 *         description: URLs generated
 */
router.post('/multipart', validate(GetPresignedUrlsDto), asyncHandler(controller.multipart));

/**
 * @swagger
 * /upload/end:
 *   post:
 *     tags: [Upload]
 *     summary: Complete the multipart upload (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               uploadId:
 *                 type: string
 *               parts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ETag:
 *                       type: string
 *                     PartNumber:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Upload completed
 */
router.post('/end', validate(CompleteUploadDto), asyncHandler(controller.end));

/**
 * @swagger
 * /upload/abort:
 *   post:
 *     tags: [Upload]
 *     summary: Abort an in-progress multipart upload (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               uploadId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload aborted
 */
router.post('/abort', validate(AbortUploadDto), asyncHandler(controller.abort));

/**
 * @swagger
 * /upload:
 *   delete:
 *     tags: [Upload]
 *     summary: Delete a file from S3 (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *     responses:
 *       200:
 *         description: File deleted
 */
router.delete('/', validate(DeleteFileDto), asyncHandler(controller.delete));

export { router as uploadRouter };

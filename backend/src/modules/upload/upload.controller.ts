import { Request, Response } from 'express';
import { UploadService } from './upload.service';
import {
  AbortUploadDtoType,
  CompleteUploadDtoType,
  DeleteFileDtoType,
  GetPresignedUrlsDtoType,
  StartUploadDtoType,
} from './upload.dto';

export class UploadController {
  private readonly uploadService: UploadService = new UploadService();

  start = async (req: Request, res: Response) => {
    const dto = req.body as StartUploadDtoType;
    try {
      const result = await this.uploadService.startMultipartUpload(dto.fileName, dto.contentType);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === 'AWS S3 is not configured.') {
        res.status(503).json({ success: false, message: 'Upload service unavailable' });
      } else {
        throw error;
      }
    }
  };

  multipart = async (req: Request, res: Response) => {
    const dto = req.body as GetPresignedUrlsDtoType;
    const urls = await this.uploadService.getMultipartPreSignedUrls(dto.key, dto.uploadId, dto.parts);
    res.status(200).json({ success: true, data: { urls } });
  };

  end = async (req: Request, res: Response) => {
    const dto = req.body as CompleteUploadDtoType;
    const result = await this.uploadService.completeMultipartUpload(dto.key, dto.uploadId, dto.parts);
    res.status(200).json({ success: true, data: result });
  };

  abort = async (req: Request, res: Response) => {
    const dto = req.body as AbortUploadDtoType;
    const result = await this.uploadService.abortMultipartUpload(dto.key, dto.uploadId);
    res.status(200).json({ success: true, data: result });
  };

  delete = async (req: Request, res: Response) => {
    const dto = req.body as DeleteFileDtoType;
    const result = await this.uploadService.deleteFile(dto.key);
    res.status(200).json({ success: true, data: result });
  };
}

import { z } from 'zod';

export const StartUploadDto = z.object({
  fileName: z.string().min(1, 'fileName is required'),
  contentType: z.string().min(1, 'contentType is required'),
});
export type StartUploadDtoType = z.infer<typeof StartUploadDto>;

export const GetPresignedUrlsDto = z.object({
  key: z.string().min(1, 'key is required'),
  uploadId: z.string().min(1, 'uploadId is required'),
  parts: z.number().int().min(1, 'At least 1 part is required'),
});
export type GetPresignedUrlsDtoType = z.infer<typeof GetPresignedUrlsDto>;

export const CompleteUploadDto = z.object({
  key: z.string().min(1, 'key is required'),
  uploadId: z.string().min(1, 'uploadId is required'),
  parts: z.array(
    z.object({
      ETag: z.string(),
      PartNumber: z.number().int(),
    })
  ).min(1, 'At least 1 part must be provided'),
});
export type CompleteUploadDtoType = z.infer<typeof CompleteUploadDto>;

export const AbortUploadDto = z.object({
  key: z.string().min(1, 'key is required'),
  uploadId: z.string().min(1, 'uploadId is required'),
});
export type AbortUploadDtoType = z.infer<typeof AbortUploadDto>;

export const DeleteFileDto = z.object({
  key: z.string().min(1, 'key is required'),
});
export type DeleteFileDtoType = z.infer<typeof DeleteFileDto>;

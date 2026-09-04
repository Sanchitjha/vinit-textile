import { apiClient } from '../api/client';

export const uploadFileToS3 = async (file) => {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (minimum for S3 multipart)
  const partsCount = Math.ceil(file.size / CHUNK_SIZE) || 1; // at least 1 part

  try {
    // 1. Start multipart upload
    const startRes = await apiClient.post('/upload/start', {
      fileName: file.name,
      contentType: file.type,
    });
    console.log(startRes, 'startRes')
    if (!startRes.success) {
      throw new Error(startRes.data.message || 'Failed to start upload');
    }

    const { uploadId, key } = startRes.data;

    // 2. Get presigned URLs for all parts
    const multiRes = await apiClient.post('/upload/multipart', {
      key,
      uploadId,
      parts: partsCount,
    });

    if (!multiRes.success) {
      throw new Error('Failed to get presigned URLs');
    }

    const { urls } = multiRes.data;

    // 3. Upload parts concurrently
    const uploadPromises = urls.map(async ({ partNumber, url }) => {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const response = await fetch(url, {
        method: 'PUT',
        body: chunk,
        headers: {
          // pre-signed URLs sometimes require empty content-type if not specified in signing
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to upload part ${partNumber}`);
      }

      // ETag is returned in headers
      const etag = response.headers.get('ETag');
      return {
        PartNumber: partNumber,
        ETag: etag?.replace(/"/g, '') || '', // Clean ETag
      };
    });

    const completedParts = await Promise.all(uploadPromises);

    // 4. Complete upload
    const completeRes = await apiClient.post('/upload/end', {
      key,
      uploadId,
      parts: completedParts,
    });

    if (!completeRes.success) {
      throw new Error('Failed to complete upload');
    }

    // 5. Return final URL
    return completeRes.data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

import { apiClient } from '../api/client';

/**
 * Converts a file to an optimized base64 data URL.
 * Automatically downscales images > 1200px to keep payload size lightweight.
 */
export const fileToOptimizedDataUrl = (file, maxDimension = 1200, quality = 0.85) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a file to AWS S3 via multipart presigned URLs.
 * If S3 direct upload is blocked (e.g. CORS restrictions on S3 for custom ports or production domains),
 * it seamlessly falls back to an optimized inline image so product creation never fails.
 */
export const uploadFileToS3 = async (file) => {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (minimum for S3 multipart)
  const partsCount = Math.ceil(file.size / CHUNK_SIZE) || 1;

  // Infer reliable MIME type
  const mime = file.type && file.type.trim() !== ''
    ? file.type
    : file.name?.toLowerCase().endsWith('.png') ? 'image/png'
    : file.name?.toLowerCase().endsWith('.webp') ? 'image/webp'
    : file.name?.toLowerCase().endsWith('.gif') ? 'image/gif'
    : file.name?.toLowerCase().endsWith('.svg') ? 'image/svg+xml'
    : 'image/jpeg';

  try {
    // 1. Start multipart upload
    const startRes = await apiClient.post('/upload/start', {
      fileName: file.name || 'product-image.jpg',
      contentType: mime,
    });

    if (!startRes?.success || !startRes?.data?.uploadId) {
      throw new Error(startRes?.message || startRes?.data?.message || 'Failed to start upload');
    }

    const { uploadId, key } = startRes.data;

    // 2. Get presigned URLs for all parts
    const multiRes = await apiClient.post('/upload/multipart', {
      key,
      uploadId,
      parts: partsCount,
    });

    if (!multiRes?.success || !multiRes?.data?.urls) {
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
      });

      if (!response.ok) {
        throw new Error(`Failed to upload part ${partNumber} (Status ${response.status})`);
      }

      // ETag is returned in headers
      const rawEtag = response.headers.get('ETag') || response.headers.get('etag');
      return {
        PartNumber: partNumber,
        ETag: rawEtag ? rawEtag.replace(/"/g, '') : '',
      };
    });

    const completedParts = await Promise.all(uploadPromises);

    // If browser couldn't read ETag due to CORS header exposure, S3 upload/end will fail
    const hasEmptyEtag = completedParts.some(p => !p.ETag);
    if (hasEmptyEtag) {
      throw new Error('ETag header not exposed by S3 CORS');
    }

    // 4. Complete upload
    const completeRes = await apiClient.post('/upload/end', {
      key,
      uploadId,
      parts: completedParts,
    });

    if (!completeRes?.success || !completeRes?.data?.url) {
      throw new Error('Failed to complete S3 upload');
    }

    // 5. Return final URL
    return completeRes.data.url;
  } catch (error) {
    console.warn('S3 direct upload failed; applying optimized fallback:', error.message);
    // Seamless fallback so saving products is 100% reliable
    const fallbackUrl = await fileToOptimizedDataUrl(file);
    if (fallbackUrl) {
      return fallbackUrl;
    }
    throw error;
  }
};

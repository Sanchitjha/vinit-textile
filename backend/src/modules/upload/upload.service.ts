import { 
  S3Client, 
  CreateMultipartUploadCommand, 
  UploadPartCommand, 
  CompleteMultipartUploadCommand, 
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../config/env';
import crypto from 'crypto';

export class UploadService {
  private s3Client: S3Client | null = null;
  private bucketName: string = '';

  constructor() {
    if (env.aws.isConfigured) {
      this.s3Client = new S3Client({
        region: env.aws.region,
        credentials: {
          accessKeyId: env.aws.accessKeyId,
          secretAccessKey: env.aws.secretAccessKey,
        },
      });
      this.bucketName = env.aws.s3BucketName;
    }
  }

  private ensureConfigured() {
    if (!this.s3Client) {
      throw new Error('AWS S3 is not configured.');
    }
  }

  async startMultipartUpload(fileName: string, contentType: string) {
    this.ensureConfigured();
    
    // Generate a unique key for the file
    const uniqueFileName = `${crypto.randomUUID()}-${fileName}`;
    const key = `uploads/${uniqueFileName}`;

    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const response = await this.s3Client!.send(command);
    return {
      uploadId: response.UploadId,
      key: response.Key,
    };
  }

  async getMultipartPreSignedUrls(key: string, uploadId: string, parts: number) {
    this.ensureConfigured();

    const urls = [];
    for (let i = 1; i <= parts; i++) {
      const command = new UploadPartCommand({
        Bucket: this.bucketName,
        Key: key,
        UploadId: uploadId,
        PartNumber: i,
      });

      const url = await getSignedUrl(this.s3Client!, command, { expiresIn: 3600 });
      urls.push({ partNumber: i, url });
    }

    return urls;
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: Array<{ ETag: string; PartNumber: number }>) {
    this.ensureConfigured();

    const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: sortedParts,
      },
    });

    await this.s3Client!.send(command);
    
    // explicitly construct the URL to avoid %2F encoding returned by response.Location
    return {
      url: `https://${this.bucketName}.s3.${env.aws.region}.amazonaws.com/${key}`,
      key,
    };
  }

  async abortMultipartUpload(key: string, uploadId: string) {
    this.ensureConfigured();

    const command = new AbortMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: key,
      UploadId: uploadId,
    });

    await this.s3Client!.send(command);
    return { success: true };
  }

  async deleteFile(key: string) {
    this.ensureConfigured();

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client!.send(command);
    return { success: true };
  }

  async presignImageUrls(urls: string[]): Promise<string[]> {
    if (!env.aws.isConfigured || !this.s3Client) return urls;

    return Promise.all(
      urls.map(async (url) => {
        try {
          if (!url.includes(this.bucketName)) return url;
          const urlObj = new URL(url);
          // decode %2F, %20, and convert '+' to spaces
          const key = decodeURIComponent(urlObj.pathname.substring(1).replace(/\+/g, '%20'));
          
          const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          });
          return await getSignedUrl(this.s3Client!, command, { expiresIn: 3600 });
        } catch (err) {
          return url; // fallback to original if anything fails
        }
      })
    );
  }
}

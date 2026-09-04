import { S3Client, PutBucketPolicyCommand, PutPublicAccessBlockCommand } from '@aws-sdk/client-s3';
import { env } from './src/config/env';

const client = new S3Client({
  region: env.aws.region,
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
});

async function makePublic() {
  const bucketName = env.aws.s3BucketName;
  
  console.log(`Disabling BlockPublicAccess for bucket: ${bucketName}...`);
  try {
    await client.send(new PutPublicAccessBlockCommand({
      Bucket: bucketName,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      }
    }));
    console.log('Successfully disabled BlockPublicAccess');
  } catch (error) {
    console.error('Failed to disable BlockPublicAccess', error);
  }

  console.log(`Setting Bucket Policy for: ${bucketName}...`);
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };

  try {
    await client.send(new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy),
    }));
    console.log('Successfully set bucket policy to public');
  } catch (error) {
    console.error('Failed to set bucket policy', error);
  }
}

makePublic();

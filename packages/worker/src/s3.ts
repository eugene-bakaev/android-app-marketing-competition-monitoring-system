import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { config } from './config';

const s3 = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
});

export async function uploadScreenshot(key: string, buffer: Buffer): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    })
  );

  return `https://${config.s3.bucket}.s3.${config.s3.region}.amazonaws.com/${key}`;
}

export async function deleteAppScreenshots(packageId: string): Promise<void> {
  const prefix = `screenshots/${packageId}/`;

  const listResult = await s3.send(
    new ListObjectsV2Command({
      Bucket: config.s3.bucket,
      Prefix: prefix,
    })
  );

  if (!listResult.Contents || listResult.Contents.length === 0) return;

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: config.s3.bucket,
      Delete: {
        Objects: listResult.Contents.map((obj) => ({ Key: obj.Key })),
      },
    })
  );
}

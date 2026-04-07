import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import { config } from './config';

const LOCAL_SCREENSHOTS_DIR = path.resolve(__dirname, '../../../local-screenshots');

function isS3Configured(): boolean {
  return !!(config.s3.bucket && config.s3.accessKeyId && config.s3.secretAccessKey);
}

const s3 = isS3Configured()
  ? new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    })
  : null;

export async function uploadScreenshot(key: string, buffer: Buffer): Promise<string> {
  if (!s3) {
    const filePath = path.join(LOCAL_SCREENSHOTS_DIR, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);
    const apiBase = process.env.API_URL || 'http://localhost:3000';
    return `${apiBase}/screenshots/${key}`;
  }

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
  if (!s3) {
    const dir = path.join(LOCAL_SCREENSHOTS_DIR, 'screenshots', packageId);
    await fs.rm(dir, { recursive: true, force: true });
    return;
  }

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

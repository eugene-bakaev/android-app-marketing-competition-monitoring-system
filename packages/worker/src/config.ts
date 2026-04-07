import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL!,
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET!,
  },
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2', 10),
  scraper: {
    pageTimeoutMs: parseInt(process.env.SCRAPER_PAGE_TIMEOUT_MS || '30000', 10),
    selectorTimeoutMs: parseInt(process.env.SCRAPER_SELECTOR_TIMEOUT_MS || '10000', 10),
  },
};

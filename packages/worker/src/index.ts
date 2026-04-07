import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from './config';
import { prisma } from './prisma';
import { processScreenshotJob } from './processor';

async function main() {
  await prisma.$connect();
  console.log('Worker connected to database');

  const connection = new IORedis(config.redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker('screenshots', processScreenshotJob, {
    connection,
    concurrency: config.concurrency,
  });

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  console.log('Worker started, waiting for jobs...');

  const shutdown = async () => {
    console.log('Shutting down worker...');
    await worker.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Failed to start worker:', err);
  process.exit(1);
});

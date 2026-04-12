import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from './config';
import { prisma } from './prisma';
import { processScreenshotJob } from './processor';
import { closeBrowser } from './scraper';

async function main() {
  await prisma.$connect();
  console.log('Worker connected to database');

  const connection = new IORedis(config.redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker('screenshots', processScreenshotJob, {
    connection,
    concurrency: config.concurrency,
    stalledInterval: 5 * 60 * 1000,  // check for stalled jobs every 5 min (default: 30s)
    drainDelay: 30,                   // wait 30s before re-polling an empty queue (default: 5ms)
    removeOnComplete: { count: 0 },   // don't keep completed jobs in Redis
    removeOnFail: { count: 50 },      // keep only last 50 failed jobs for debugging
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
    await closeBrowser();
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

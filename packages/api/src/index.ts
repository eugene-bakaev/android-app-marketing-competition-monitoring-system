import { app } from './app';
import { config } from './config';
import { prisma } from './prisma';
import { screenshotQueue, addScreenshotJob } from './queue';
import type { IntervalUnit } from '@app-monitor/shared';

async function syncSchedulers() {
  // Clean orphaned repeat keys, then re-register only active apps
  const existing = await screenshotQueue.getRepeatableJobs();
  for (const job of existing) {
    await screenshotQueue.removeRepeatableByKey(job.key);
  }
  console.log(`Cleared ${existing.length} existing repeatable jobs`);

  const activeApps = await prisma.app.findMany({ where: { isActive: true } });
  for (const a of activeApps) {
    await addScreenshotJob(a.id, a.intervalValue, a.intervalUnit as IntervalUnit);
  }
  console.log(`Registered schedulers for ${activeApps.length} active apps`);
}

async function main() {
  await prisma.$connect();
  console.log('Connected to database');

  await syncSchedulers();

  const server = app.listen(config.port, () => {
    console.log(`API server running on port ${config.port}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await screenshotQueue.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});

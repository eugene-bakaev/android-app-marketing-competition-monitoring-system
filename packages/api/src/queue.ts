import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { config } from './config';
import { intervalToMs, IntervalUnit } from '@app-monitor/shared';

const connection = new IORedis(config.redisUrl, { maxRetriesPerRequest: null });

export const screenshotQueue = new Queue('screenshots', { connection });

export async function addScreenshotJob(
  appId: string,
  intervalValue: number,
  intervalUnit: IntervalUnit
): Promise<void> {
  const repeatMs = intervalToMs(intervalValue, intervalUnit);

  await screenshotQueue.upsertJobScheduler(
    `screenshot-${appId}`,
    { every: repeatMs },
    {
      name: 'take-screenshot',
      data: { appId },
    }
  );
}

export async function removeScreenshotJob(appId: string): Promise<void> {
  await screenshotQueue.removeJobScheduler(`screenshot-${appId}`);
}

import { Job } from 'bullmq';
import { prisma } from './prisma';
import { scrapePlayStorePage } from './scraper';
import { uploadScreenshot } from './s3';

interface ScreenshotJobData {
  appId: string;
}

export async function processScreenshotJob(job: Job<ScreenshotJobData>): Promise<void> {
  const { appId } = job.data;

  const app = await prisma.app.findUnique({ where: { id: appId } });
  if (!app) {
    console.log(`App ${appId} no longer exists, skipping job`);
    return;
  }

  if (!app.isActive) {
    console.log(`App ${appId} is paused, skipping job`);
    return;
  }

  const takenAt = new Date();
  const timestamp = takenAt.toISOString().replace(/[:.]/g, '-');
  const s3Key = `screenshots/${app.packageId}/${timestamp}.png`;

  try {
    console.log(`Taking screenshot of ${app.playStoreUrl}`);
    const { screenshot, iconUrl } = await scrapePlayStorePage(app.playStoreUrl);

    const s3Url = await uploadScreenshot(s3Key, screenshot);

    await prisma.screenshot.create({
      data: {
        appId: app.id,
        s3Key,
        s3Url,
        takenAt,
        status: 'SUCCESS',
      },
    });

    await prisma.app.update({
      where: { id: app.id },
      data: {
        lastStatus: 'SUCCESS',
        ...(iconUrl ? { iconUrl } : {}),
      },
    });

    console.log(`Screenshot saved for ${app.packageId}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Screenshot failed for ${app.packageId}:`, errorMessage);

    await prisma.screenshot.create({
      data: {
        appId: app.id,
        s3Key: '',
        s3Url: '',
        takenAt,
        status: 'FAILED',
        error: errorMessage,
      },
    });

    await prisma.app.update({
      where: { id: app.id },
      data: { lastStatus: 'FAILED' },
    });

    throw error;
  }
}

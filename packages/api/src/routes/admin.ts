import { Router } from 'express';
import { prisma } from '../prisma';
import { addScreenshotJob, removeScreenshotJob, screenshotQueue } from '../queue';
import type { IntervalUnit } from '@app-monitor/shared';

export const adminRouter = Router();

adminRouter.post('/sync-schedulers', async (_req, res, next) => {
  try {
    const activeApps = await prisma.app.findMany({ where: { isActive: true } });
    const activeKeys = new Set(activeApps.map((a) => `screenshot-${a.id}`));

    // Re-register schedulers for all active apps
    for (const a of activeApps) {
      await addScreenshotJob(a.id, a.intervalValue, a.intervalUnit as IntervalUnit);
    }

    // Remove orphaned schedulers
    const existing = await screenshotQueue.getJobSchedulers();
    const orphans = existing.filter((s) => !activeKeys.has(s.key));
    for (const s of orphans) {
      await screenshotQueue.removeJobScheduler(s.key);
    }

    res.json({
      registered: activeApps.length,
      orphansRemoved: orphans.length,
    });
  } catch (err) {
    next(err);
  }
});

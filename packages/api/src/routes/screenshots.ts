import { Router } from 'express';
import { prisma } from '../prisma';

export const screenshotsRouter = Router();

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

screenshotsRouter.get('/:id/screenshots', async (req, res, next) => {
  try {
    const id = String(req.params['id']);
    const limitParam = parseInt(req.query['limit'] as string);
    const limit = Math.min(Number.isFinite(limitParam) ? limitParam : DEFAULT_LIMIT, MAX_LIMIT);
    const cursor = req.query['cursor'] ? String(req.query['cursor']) : undefined;

    const app = await prisma.app.findUnique({ where: { id } });
    if (!app) {
      res.status(404).json({ error: 'App not found' });
      return;
    }

    const screenshots = await prisma.screenshot.findMany({
      where: { appId: id },
      orderBy: { takenAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = screenshots.length > limit;
    const data = hasMore ? screenshots.slice(0, limit) : screenshots;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    res.json({ data, nextCursor, hasMore });
  } catch (err) {
    next(err);
  }
});

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { addScreenshotJob, removeScreenshotJob } from '../queue';
import { extractPackageId, validatePlayStoreUrl, IntervalUnit } from '@app-monitor/shared';

export const appsRouter = Router();

const createAppSchema = z.object({
  name: z.string().min(1),
  playStoreUrl: z.string().url(),
  intervalValue: z.number().int().positive(),
  intervalUnit: z.enum(['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH']),
});

const updateAppSchema = z.object({
  name: z.string().min(1).optional(),
  intervalValue: z.number().int().positive().optional(),
  intervalUnit: z.enum(['MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH']).optional(),
  isActive: z.boolean().optional(),
});

appsRouter.post('/', async (req, res) => {
  const parsed = createAppSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, playStoreUrl, intervalValue, intervalUnit } = parsed.data;

  if (!validatePlayStoreUrl(playStoreUrl)) {
    res.status(400).json({ error: 'Invalid Google Play Store URL' });
    return;
  }

  const packageId = extractPackageId(playStoreUrl)!;

  const existing = await prisma.app.findUnique({ where: { packageId } });
  if (existing) {
    res.status(409).json({ error: 'App with this package ID already exists' });
    return;
  }

  const app = await prisma.app.create({
    data: { name, playStoreUrl, packageId, intervalValue, intervalUnit },
  });

  try {
    await addScreenshotJob(app.id, intervalValue, intervalUnit as IntervalUnit);
  } catch (err) {
    console.error('Failed to enqueue screenshot job:', err);
  }

  res.status(201).json(app);
});

appsRouter.get('/', async (_req, res) => {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(apps);
});

appsRouter.get('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const app = await prisma.app.findUnique({ where: { id } });
  if (!app) {
    res.status(404).json({ error: 'App not found' });
    return;
  }
  res.json(app);
});

appsRouter.put('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const parsed = updateAppSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const existing = await prisma.app.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'App not found' });
    return;
  }

  const updated = await prisma.app.update({
    where: { id },
    data: parsed.data,
  });

  const intervalChanged =
    parsed.data.intervalValue !== undefined || parsed.data.intervalUnit !== undefined;

  if (intervalChanged) {
    try {
      await removeScreenshotJob(updated.id);
      await addScreenshotJob(
        updated.id,
        updated.intervalValue,
        updated.intervalUnit as unknown as IntervalUnit
      );
    } catch (err) {
      console.error('Failed to update screenshot job:', err);
    }
  }

  res.json(updated);
});

appsRouter.delete('/:id', async (req, res) => {
  const id = String(req.params['id']);
  const existing = await prisma.app.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: 'App not found' });
    return;
  }

  try {
    await removeScreenshotJob(existing.id);
  } catch (err) {
    console.error('Failed to remove screenshot job:', err);
  }

  await prisma.app.delete({ where: { id } });

  res.status(204).send();
});

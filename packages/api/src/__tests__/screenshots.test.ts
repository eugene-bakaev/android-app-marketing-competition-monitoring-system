import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../prisma';

vi.mock('../queue', () => ({
  addScreenshotJob: vi.fn().mockResolvedValue(undefined),
  removeScreenshotJob: vi.fn().mockResolvedValue(undefined),
  screenshotQueue: {},
}));

let testAppId: string;

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.screenshot.deleteMany();
  await prisma.app.deleteMany();

  const testApp = await prisma.app.create({
    data: {
      name: 'Test App',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.app',
      packageId: 'com.test.app',
      intervalValue: 1,
      intervalUnit: 'HOUR',
    },
  });
  testAppId = testApp.id;
});

describe('GET /api/apps/:id/screenshots', () => {
  it('returns screenshots for an app ordered by takenAt desc', async () => {
    await prisma.screenshot.createMany({
      data: [
        {
          appId: testAppId,
          s3Key: 'screenshots/com.test.app/1.png',
          s3Url: 'https://s3.amazonaws.com/bucket/screenshots/com.test.app/1.png',
          takenAt: new Date('2026-01-01T10:00:00Z'),
          status: 'SUCCESS',
        },
        {
          appId: testAppId,
          s3Key: 'screenshots/com.test.app/2.png',
          s3Url: 'https://s3.amazonaws.com/bucket/screenshots/com.test.app/2.png',
          takenAt: new Date('2026-01-02T10:00:00Z'),
          status: 'SUCCESS',
        },
      ],
    });

    const res = await request(app).get(`/api/apps/${testAppId}/screenshots`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(new Date(res.body.data[0].takenAt).getTime()).toBeGreaterThan(
      new Date(res.body.data[1].takenAt).getTime()
    );
  });

  it('supports cursor-based pagination', async () => {
    const screenshots = Array.from({ length: 25 }, (_, i) => ({
      appId: testAppId,
      s3Key: `screenshots/com.test.app/${i}.png`,
      s3Url: `https://s3.amazonaws.com/bucket/screenshots/com.test.app/${i}.png`,
      takenAt: new Date(Date.now() - i * 3600000),
      status: 'SUCCESS' as const,
    }));
    await prisma.screenshot.createMany({ data: screenshots });

    const res = await request(app).get(`/api/apps/${testAppId}/screenshots?limit=10`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(10);
    expect(res.body.hasMore).toBe(true);
    expect(res.body.nextCursor).toBeDefined();

    const res2 = await request(app).get(
      `/api/apps/${testAppId}/screenshots?limit=10&cursor=${res.body.nextCursor}`
    );
    expect(res2.body.data).toHaveLength(10);
  });

  it('shows FAILED screenshots with error message', async () => {
    await prisma.screenshot.create({
      data: {
        appId: testAppId,
        s3Key: '',
        s3Url: '',
        takenAt: new Date(),
        status: 'FAILED',
        error: 'Page timeout after 30s',
      },
    });

    const res = await request(app).get(`/api/apps/${testAppId}/screenshots`);

    expect(res.body.data[0].status).toBe('FAILED');
    expect(res.body.data[0].error).toBe('Page timeout after 30s');
  });

  it('returns 404 for non-existent app', async () => {
    const res = await request(app).get('/api/apps/non-existent/screenshots');
    expect(res.status).toBe(404);
  });
});

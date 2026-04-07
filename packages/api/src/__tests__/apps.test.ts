import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../prisma';

// Mock queue so tests don't need Redis
vi.mock('../queue', () => ({
  addScreenshotJob: vi.fn().mockResolvedValue(undefined),
  removeScreenshotJob: vi.fn().mockResolvedValue(undefined),
  screenshotQueue: {},
}));

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.screenshot.deleteMany();
  await prisma.app.deleteMany();
});

describe('POST /api/apps', () => {
  it('creates a new app', async () => {
    const res = await request(app)
      .post('/api/apps')
      .send({
        name: 'Test App',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.app',
        intervalValue: 1,
        intervalUnit: 'HOUR',
      });

    expect(res.status).toBe(201);
    expect(res.body.packageId).toBe('com.test.app');
    expect(res.body.name).toBe('Test App');
  });

  it('rejects invalid Play Store URL', async () => {
    const res = await request(app)
      .post('/api/apps')
      .send({
        name: 'Bad App',
        playStoreUrl: 'https://example.com',
        intervalValue: 1,
        intervalUnit: 'HOUR',
      });

    expect(res.status).toBe(400);
  });

  it('rejects duplicate packageId', async () => {
    const payload = {
      name: 'Test App',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.app',
      intervalValue: 1,
      intervalUnit: 'HOUR',
    };

    await request(app).post('/api/apps').send(payload);
    const res = await request(app).post('/api/apps').send(payload);

    expect(res.status).toBe(409);
  });
});

describe('GET /api/apps', () => {
  it('returns all apps', async () => {
    await prisma.app.create({
      data: {
        name: 'App 1',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.one',
        packageId: 'com.test.one',
        intervalValue: 1,
        intervalUnit: 'HOUR',
      },
    });

    const res = await request(app).get('/api/apps');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].packageId).toBe('com.test.one');
  });
});

describe('GET /api/apps/:id', () => {
  it('returns a single app', async () => {
    const created = await prisma.app.create({
      data: {
        name: 'App 1',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.one',
        packageId: 'com.test.one',
        intervalValue: 1,
        intervalUnit: 'HOUR',
      },
    });

    const res = await request(app).get(`/api/apps/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.id);
  });

  it('returns 404 for non-existent app', async () => {
    const res = await request(app).get('/api/apps/non-existent-id');
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/apps/:id', () => {
  it('updates an app', async () => {
    const created = await prisma.app.create({
      data: {
        name: 'App 1',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.one',
        packageId: 'com.test.one',
        intervalValue: 1,
        intervalUnit: 'HOUR',
      },
    });

    const res = await request(app)
      .put(`/api/apps/${created.id}`)
      .send({ intervalValue: 30, intervalUnit: 'MINUTE' });

    expect(res.status).toBe(200);
    expect(res.body.intervalValue).toBe(30);
    expect(res.body.intervalUnit).toBe('MINUTE');
  });
});

describe('DELETE /api/apps/:id', () => {
  it('deletes an app', async () => {
    const created = await prisma.app.create({
      data: {
        name: 'App 1',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.test.one',
        packageId: 'com.test.one',
        intervalValue: 1,
        intervalUnit: 'HOUR',
      },
    });

    const res = await request(app).delete(`/api/apps/${created.id}`);
    expect(res.status).toBe(204);

    const found = await prisma.app.findUnique({ where: { id: created.id } });
    expect(found).toBeNull();
  });
});

# App Monitor — Marketing Competition Monitoring System

Track Android apps on Google Play by periodically taking screenshots of their listing pages and displaying them in a timeline.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Worker:** BullMQ, Puppeteer
- **Frontend:** React, Vite, TypeScript
- **Database:** PostgreSQL (Neon)
- **Queue:** BullMQ + Redis (Upstash)
- **Storage:** AWS S3

## Local Development

### Prerequisites

- Docker & Docker Compose
- AWS S3 bucket + credentials

### Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your AWS credentials and S3 bucket name:

```bash
cp .env.example .env
```

3. Start all services:

```bash
docker compose up
```

4. Run database migrations (first time only):

```bash
docker compose run migrate
```

5. Open http://localhost:8080

### Development without Docker

1. Install dependencies: `npm install`
2. Start PostgreSQL and Redis locally
3. Copy `.env.example` to `.env` and update connection strings
4. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

5. In separate terminals:

```bash
npm run dev:api
npm run dev:worker
npm run dev:web
```

## Deployment (Railway)

Three services deployed from the same repository:

| Service | Dockerfile target | Start command |
|---|---|---|
| API | `api` | `node packages/api/dist/index.js` |
| Worker | `worker` | `node packages/worker/dist/index.js` |
| Frontend | `Dockerfile.web` | nginx (built-in) |

### Environment variables required on Railway

| Variable | Services |
|---|---|
| `DATABASE_URL` | API, Worker |
| `REDIS_URL` | API, Worker |
| `AWS_ACCESS_KEY_ID` | API, Worker |
| `AWS_SECRET_ACCESS_KEY` | API, Worker |
| `AWS_REGION` | API, Worker |
| `S3_BUCKET` | API, Worker |
| `API_PORT` | API |
| `WORKER_CONCURRENCY` | Worker |

Railway auto-deploys from the `main` branch on push.

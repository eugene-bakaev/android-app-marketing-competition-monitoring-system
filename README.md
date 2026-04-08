# App Monitor

Track Android apps on Google Play by periodically taking full-page screenshots of their store listings and displaying them in a timeline.

**Live demo:** https://app-monitoring-web-production.up.railway.app/

## Quick Start (Docker)

The only prerequisite is **Docker Desktop** — [download it here](https://www.docker.com/products/docker-desktop). Install it, launch it, and wait until it shows "Docker Desktop is running" before continuing.

```bash
git clone https://github.com/eugene-bakaev/android-app-marketing-competition-monitoring-system.git && cd android-app-marketing-competition-monitoring-system
docker compose up --build
```

Open **http://localhost:8080** once all services are running.

No `.env` file, no AWS credentials, no Node.js installation required. Screenshots are stored on the local filesystem automatically when S3 is not configured.

## Architecture

| Service | Description | Port |
|---|---|---|
| **web** | React SPA served by nginx | 8080 |
| **api** | Express REST API | 3001 |
| **worker** | BullMQ job processor + Puppeteer | - |
| **postgres** | PostgreSQL 16 | 5432 |
| **redis** | Redis 7 (job queue) | 6379 |

```
Browser → nginx (:8080) → /api/* → Express API (:3001) → PostgreSQL
                         → /screenshots/* → static files
                                           Worker → Puppeteer → screenshots
                                                  → BullMQ ← Redis
```

### Tech Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS v4, shadcn/ui, TanStack Query
- **API:** Express, Zod, Prisma ORM
- **Worker:** BullMQ, Puppeteer (headless Chromium)
- **Database:** PostgreSQL
- **Queue:** Redis

## Native Development Setup

For active development with hot-reload, run infrastructure in Docker and app services natively.

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL and Redis)

### Steps

1. Start infrastructure:

```bash
docker compose up postgres redis -d
```

2. Install dependencies and set up the database:

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
```

3. Start all services (in separate terminals):

```bash
npm run dev:api
npm run dev:worker
npm run dev:web
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` and `/screenshots` to the API.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | Yes | - | Redis connection string |
| `API_PORT` | No | `3001` | API server port |
| `AWS_ACCESS_KEY_ID` | No | - | S3 access key (if not set, local storage is used) |
| `AWS_SECRET_ACCESS_KEY` | No | - | S3 secret key |
| `AWS_REGION` | No | `us-east-1` | S3 region |
| `S3_BUCKET` | No | - | S3 bucket name |
| `WORKER_CONCURRENCY` | No | `2` | Parallel screenshot jobs |
| `SCRAPER_PAGE_TIMEOUT_MS` | No | `30000` | Puppeteer page load timeout |
| `SCRAPER_SELECTOR_TIMEOUT_MS` | No | `10000` | Puppeteer selector timeout |

## Deployment (Railway)

Three services deployed from the same repository:

| Service | Config | Dockerfile |
|---|---|---|
| API | `railway.toml` | `Dockerfile` (target: api) |
| Worker | `railway.worker.toml` | `Dockerfile` (target: worker) |
| Frontend | `railway.web.toml` | `Dockerfile.web` |

Database migrations run automatically on API startup via `prisma migrate deploy`.

Railway auto-deploys from the `main` branch on push.

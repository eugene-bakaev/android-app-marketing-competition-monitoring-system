FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/
COPY packages/worker/package.json packages/worker/
COPY prisma/ prisma/

RUN npm ci
RUN ./packages/api/node_modules/.bin/prisma generate 2>/dev/null || npx prisma generate

COPY packages/shared/ packages/shared/
RUN npm run build -w packages/shared

COPY packages/api/ packages/api/
COPY packages/worker/ packages/worker/

RUN npm run build -w packages/api
RUN npm run build -w packages/worker

FROM base AS api
CMD ["node", "packages/api/dist/index.js"]

FROM base AS worker
CMD ["node", "packages/worker/dist/index.js"]

-- CreateEnum
CREATE TYPE "IntervalUnit" AS ENUM ('MINUTE', 'HOUR', 'DAY', 'WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "ScreenshotStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playStoreUrl" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "iconUrl" TEXT,
    "intervalValue" INTEGER NOT NULL,
    "intervalUnit" "IntervalUnit" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastStatus" "ScreenshotStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screenshots" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "status" "ScreenshotStatus" NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apps_packageId_key" ON "apps"("packageId");

-- CreateIndex
CREATE INDEX "screenshots_appId_takenAt_idx" ON "screenshots"("appId", "takenAt" DESC);

-- AddForeignKey
ALTER TABLE "screenshots" ADD CONSTRAINT "screenshots_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

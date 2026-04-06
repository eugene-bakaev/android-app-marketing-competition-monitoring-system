import { IntervalUnit, ScreenshotStatus } from './enums';

export interface App {
  id: string;
  name: string;
  playStoreUrl: string;
  packageId: string;
  iconUrl: string | null;
  intervalValue: number;
  intervalUnit: IntervalUnit;
  isActive: boolean;
  lastStatus: ScreenshotStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface Screenshot {
  id: string;
  appId: string;
  s3Key: string;
  s3Url: string;
  takenAt: string;
  status: ScreenshotStatus;
  error: string | null;
  createdAt: string;
}

export interface CreateAppRequest {
  name: string;
  playStoreUrl: string;
  intervalValue: number;
  intervalUnit: IntervalUnit;
}

export interface UpdateAppRequest {
  name?: string;
  intervalValue?: number;
  intervalUnit?: IntervalUnit;
  isActive?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

import { IntervalUnit } from './enums';

const PLAY_STORE_URL_REGEX = /^https:\/\/play\.google\.com\/store\/apps\/details\?id=([a-zA-Z0-9._]+)/;

export function extractPackageId(playStoreUrl: string): string | null {
  const match = playStoreUrl.match(PLAY_STORE_URL_REGEX);
  return match ? match[1] : null;
}

export function validatePlayStoreUrl(url: string): boolean {
  return PLAY_STORE_URL_REGEX.test(url);
}

export function intervalToMs(value: number, unit: IntervalUnit): number {
  const multipliers: Record<IntervalUnit, number> = {
    [IntervalUnit.MINUTE]: 60 * 1000,
    [IntervalUnit.HOUR]: 60 * 60 * 1000,
    [IntervalUnit.DAY]: 24 * 60 * 60 * 1000,
    [IntervalUnit.WEEK]: 7 * 24 * 60 * 60 * 1000,
    [IntervalUnit.MONTH]: 30 * 24 * 60 * 60 * 1000,
  };
  return value * multipliers[unit];
}

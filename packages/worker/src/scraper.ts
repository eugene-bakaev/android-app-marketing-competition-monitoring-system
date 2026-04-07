import puppeteer from 'puppeteer';
import { config } from './config';

export interface ScrapeResult {
  screenshot: Buffer;
  iconUrl: string | null;
}

export async function scrapePlayStorePage(url: string): Promise<ScrapeResult> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: config.scraper.pageTimeoutMs,
    });

    await page.waitForSelector('h1', { timeout: config.scraper.selectorTimeoutMs });

    const screenshot = await page.screenshot({ fullPage: true, type: 'png' });

    const iconUrl = await page.evaluate(() => {
      const img = document.querySelector('img[itemprop="image"]') as HTMLImageElement | null;
      if (img) return img.src;
      const imgs = Array.from(document.querySelectorAll('img'));
      for (const i of imgs) {
        if (i.width >= 48 && i.height >= 48 && i.src.includes('googleusercontent')) {
          return i.src;
        }
      }
      return null;
    });

    return { screenshot: Buffer.from(screenshot), iconUrl };
  } finally {
    await page.close();
    await browser.close();
  }
}

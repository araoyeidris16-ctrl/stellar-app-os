import { test, expect } from '@playwright/test';
import { pages } from './pages';

const viewports = [
  { width: 320, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 720 },
];

for (const path of pages) {
  test.describe(`Page ${path}`, () => {
    for (const viewport of viewports) {
      test(`renders without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        const response = await page.goto(path, { waitUntil: 'networkidle' });
        expect(response?.ok()).to beTruthy();

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));

        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

        const bodyText = await page.locator('body').innerText();
        expect(bodyText.trim().length).toBeGreaterThan(0);
      });
    }
  });
}

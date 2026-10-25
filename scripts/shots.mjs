/** Render the style gallery to docs screenshots with Playwright. */

import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pageUrl = pathToFileURL(path.join(root, 'docs', 'gallery.html'));
const quality = 92;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1320, height: 1020 },
  deviceScaleFactor: 2,
});

const shot = async (target, file) => {
  await target.screenshot({
    path: path.join(root, 'docs', file),
    type: 'jpeg',
    quality,
  });
  console.log(`wrote docs/${file}`);
};

for (const theme of ['dark', 'light']) {
  if (theme === 'dark') {
    await page.goto(`${pageUrl.href}?theme=dark&static=1`);
    await page.waitForSelector('.gal-card');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
    await shot(page, 'classic-dark.jpg');
  }

  await page.goto(`${pageUrl.href}?theme=${theme}&view=settings&static=1`);
  await page.waitForSelector('.rg-settings-page');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await shot(page, `settings-${theme}.jpg`);
}

await browser.close();

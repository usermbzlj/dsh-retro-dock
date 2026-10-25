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
  await page.goto(`${pageUrl.href}?theme=${theme}&static=1`);
  await page.waitForSelector('.gal-card');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  await shot(page, `styles-${theme}.jpg`);

  await page.goto(`${pageUrl.href}?theme=${theme}&view=settings&static=1`);
  await page.waitForSelector('.rg-settings-page');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await shot(page, `settings-${theme}.jpg`);

  await page.goto(`${pageUrl.href}?theme=${theme}&view=popover&static=1`);
  await page.waitForSelector('.rg-settings-popover');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await shot(page.locator('.rg-settings-popover'), `popover-${theme}.jpg`);
}

await page.goto(`${pageUrl.href}?theme=dark&static=1`);
await page.waitForSelector('.gal-card');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(250);

const cards = page.locator('.gal-card');
const count = await cards.count();
for (let index = 0; index < count; index += 1) {
  const style = await cards.nth(index).getAttribute('data-style');
  await shot(cards.nth(index), `style-${style}-dark.jpg`);
}

await browser.close();

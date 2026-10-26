/** Render the README specimen sheets and settings pages with Playwright. */

import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pageUrl = pathToFileURL(path.join(root, 'docs', 'gallery.html'));
const quality = 92;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1320, height: 900 },
  deviceScaleFactor: 2,
});

const shot = async (target, file) => {
  const contentHeight = await target.evaluate(() => {
    const sheet = document.querySelector('.sheet');
    return sheet ? Math.ceil(sheet.getBoundingClientRect().bottom + 20) : document.body.scrollHeight;
  });
  await target.setViewportSize({ width: 1320, height: Math.max(contentHeight, 420) });
  await target.waitForTimeout(60);
  await target.screenshot({
    path: path.join(root, 'docs', file),
    type: 'jpeg',
    quality,
    fullPage: true,
  });
  console.log(`wrote docs/${file} (${contentHeight}px)`);
};

const languages = ['zh', 'en'];
const themes = ['dark', 'light'];

for (const lang of languages) {
  for (const theme of themes) {
    const suffix = lang === 'en' ? '-en' : '';

    await page.goto(`${pageUrl.href}?theme=${theme}&lang=${lang}&static=1`);
    await page.waitForSelector('.composer');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(220);
    await shot(page, `classic-${theme}${suffix}.jpg`);

    await page.goto(`${pageUrl.href}?theme=${theme}&lang=${lang}&view=settings&static=1`);
    await page.waitForSelector('.rg-settings-page');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(220);
    await shot(page, `settings-${theme}${suffix}.jpg`);
  }
}

await browser.close();

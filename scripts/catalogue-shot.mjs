import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
await page.goto(pathToFileURL(path.join(root, 'docs/catalogue.html')).href);
await page.waitForTimeout(500);

const metrics = await page.evaluate(() => ({
  width: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  height: document.documentElement.scrollHeight,
  gauges: document.querySelectorAll('.rg-gauge').length,
}));

await page.screenshot({
  path: path.join(root, 'docs/seven-languages.jpg'),
  fullPage: true,
  type: 'jpeg',
  quality: 90,
});

await page.screenshot({
  path: path.join(root, 'review/catalogue-hero.png'),
  clip: { x: 0, y: 0, width: 1440, height: 1560 },
});

await page.screenshot({
  path: path.join(root, 'docs/seven-languages-hero.jpg'),
  type: 'jpeg',
  quality: 92,
  clip: { x: 0, y: 0, width: 1440, height: 1200 },
});

const spreads = page.locator('.spread');
await spreads.nth(0).screenshot({ path: path.join(root, 'review/catalogue-bench.png') });
await spreads.nth(1).screenshot({ path: path.join(root, 'review/catalogue-vu.png') });
await spreads.nth(4).screenshot({ path: path.join(root, 'review/catalogue-chart.png') });
await spreads.nth(2).screenshot({ path: path.join(root, 'review/catalogue-altimeter.png') });
await spreads.nth(3).screenshot({ path: path.join(root, 'review/catalogue-signal.png') });
await spreads.nth(5).screenshot({ path: path.join(root, 'review/catalogue-swiss.png') });
await spreads.nth(6).screenshot({ path: path.join(root, 'review/catalogue-compass.png') });
await page.locator('.closing').screenshot({ path: path.join(root, 'review/catalogue-closing.png') });

console.log(JSON.stringify({ metrics, errors }, null, 2));
await browser.close();

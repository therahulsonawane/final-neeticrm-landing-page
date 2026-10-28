/**
 * Renders scripts/og.html to og-image.png (1200x630), the picture shown when the link is shared.
 * Run from marketing/website:  npm run og
 * Uses the installed Chrome; set CHROME_PATH if it lives somewhere else.
 */
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

(async () => {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; set CHROME_PATH`);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto('file:///' + path.join(__dirname, 'og.html').replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, 'og-image.png') });
  await browser.close();
  console.log('og-image.png written');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { chromium } from 'playwright';

const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
});
const page = await browser.newPage();
await page.goto('http://localhost:5173');
await page.waitForTimeout(2000);
console.log('Title:', await page.title());
console.log('URL:', page.url());
await browser.close();

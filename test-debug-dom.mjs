import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'http://localhost:5173';
const pageErrors = [];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', err => pageErrors.push(err.message));

// Login
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#email', 'arum200909@gmail.com');
await page.fill('#password', '4cCyU6D***');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);

// Go to first page
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const editLinks = await page.$$eval('a[href*="/admin/pages/"]', els => els.map(e => e.href).filter(h => h.match(/\/admin\/pages\/[a-f0-9-]+$/)));
const uniquePages = [...new Set(editLinks)];
console.log(`Pages: ${uniquePages.length}`);

// Go to the first page
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Screenshot the full page
await page.screenshot({ path: 'test-screenshot-pagebuilder.png', fullPage: true });
console.log('Screenshot saved: test-screenshot-pagebuilder.png');

// Dump page text to understand structure
const bodyText = await page.textContent('body');
writeFileSync('test-page-text.txt', bodyText, 'utf8');
console.log('Page text saved to test-page-text.txt');

// Dump interactive elements
const buttons = await page.$$eval('button', els => els.map(e => ({ text: e.textContent?.trim().substring(0, 50), class: e.className?.substring(0, 80) })));
console.log(`\nButtons on page (${buttons.length}):`);
buttons.forEach((b, i) => console.log(`  ${i}: "${b.text}" class="${b.class}"`));

// Check for Add Section
const addSection = await page.$('button:has-text("Add Section")');
console.log(`\nAdd Section button found: ${!!addSection}`);

// Check for Save
const saveBtn = await page.$('button:has-text("Save")');
console.log(`Save button found: ${!!saveBtn}`);

// Check for Preview
const previewBtn = await page.$('button:has-text("Preview")');
console.log(`Preview button found: ${!!previewBtn}`);

// Find all clickable sections on canvas
const sectionElements = await page.$$eval('[data-section-id]', els => els.map(e => e.getAttribute('data-section-id')));
console.log(`\nSections with data-section-id: ${sectionElements.length}`);
sectionElements.forEach(s => console.log(`  section: ${s}`));

// Check for blocks
const blockElements = await page.$$eval('[data-block-id]', els => els.map(e => ({ id: e.getAttribute('data-block-id'), type: e.getAttribute('data-block-type') })));
console.log(`\nBlocks with data-block-id: ${blockElements.length}`);
blockElements.forEach(b => console.log(`  block: ${b.id} type=${b.type}`));

// Check canvas content
const canvasArea = await page.$('[class*="canvas" i], [class*="Canvas"]');
console.log(`\nCanvas area found: ${!!canvasArea}`);

// Check error boundary
const hasErrorBoundary = bodyText.includes('Something went wrong') || bodyText.includes('ErrorBoundary');
console.log(`Error boundary: ${hasErrorBoundary}`);

console.log(`\nPage errors: ${pageErrors.length}`);
pageErrors.forEach(e => console.log(`  ERR: ${e.substring(0, 200)}`));

await browser.close();

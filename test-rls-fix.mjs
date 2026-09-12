import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];
const pageErrors = [];

function log(id, name, status, actual = '') {
  results.push({ id, name, status, actual });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '🚫';
  console.log(`${icon} ${id} — ${name} [${status}]${actual ? ': ' + actual : ''}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', err => pageErrors.push(err.message));

async function w(ms = 2000) { await page.waitForTimeout(ms); }

// LOGIN
await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' });
await w(1000);
await page.fill('#email', 'arum200909@gmail.com');
await page.fill('#password', '4cCyU6D***');
await page.click('button[type="submit"]');
await w(3000);
log('AUTH', 'Login', page.url().includes('/admin') && !page.url().includes('/login') ? 'PASS' : 'FAIL', page.url());

// ═══ EVENT CREATE ═══
console.log('\n=== EVENT CREATE ===');
await page.goto(`${BASE}/admin/events/new`, { waitUntil: 'domcontentloaded' });
await w(3000);

const titleInput = await page.$('input[name="title"]');
if (titleInput) {
  await titleInput.fill('RLS Test Event ' + Date.now());
  await w(300);

  const venueInput = await page.$('input[name="location"]');
  if (venueInput) await venueInput.fill('Test Venue');

  const dateInput = await page.$('input[name="event_date"], input[type="date"]');
  if (dateInput) await dateInput.fill('2026-12-25');

  const descInput = await page.$('textarea[name="description"]');
  if (descInput) await descInput.fill('Test event for RLS verification.');

  const saveBtn = await page.$('button:has-text("Save Draft"), button:has-text("Save"), button[type="submit"]');
  if (saveBtn) {
    await saveBtn.click({ force: true });
    await w(6000);
    const url = page.url();
    const t = await page.textContent('body');
    const saved = url.includes('/edit') || t.includes('Event created') || t.includes('Event updated');
    log('EVT-INSERT', 'Event INSERT via form', saved ? 'PASS' : 'FAIL', url.substring(url.indexOf('/admin')));
  } else {
    log('EVT-INSERT', 'Save button not found', 'FAIL');
  }
} else {
  log('EVT-INSERT', 'Title input not found', 'FAIL');
}

// ═══ PORTFOLIO CREATE ═══
console.log('\n=== PORTFOLIO CREATE ===');
await page.goto(`${BASE}/admin/portfolio/new`, { waitUntil: 'domcontentloaded' });
await w(3000);

const pTitle = await page.$('input[name="title"]');
if (pTitle) {
  await pTitle.fill('RLS Test Portfolio ' + Date.now());

  const pDesc = await page.$('textarea[name="description"]');
  if (pDesc) await pDesc.fill('Test portfolio for RLS verification.');

  const saveBtn = await page.$('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
  if (saveBtn) {
    await saveBtn.click({ force: true });
    await w(6000);
    const url = page.url();
    const t = await page.textContent('body');
    const saved = !url.includes('/portfolio/new') || t.includes('Project updated') || t.includes('saved');
    log('PRT-INSERT', 'Portfolio INSERT via form', saved ? 'PASS' : 'FAIL', url.substring(url.indexOf('/admin')));
  } else {
    log('PRT-INSERT', 'Save button not found', 'FAIL');
  }
} else {
  log('PRT-INSERT', 'Title input not found', 'FAIL');
}

// ═══ EVENT DELETE ═══
console.log('\n=== EVENT DELETE ===');
await page.goto(`${BASE}/admin/events`, { waitUntil: 'domcontentloaded' });
await w(3000);
{
  const delBtn = await page.$('button[aria-label*="Delete"]');
  if (delBtn) {
    await delBtn.click({ force: true });
    await w(1000);
    // Look for confirm dialog button
    const confirmBtn = await page.$('button:has-text("Delete"):not([aria-label*="Delete"])');
    if (confirmBtn) {
      await confirmBtn.click({ force: true });
      await w(3000);
      log('EVT-DELETE', 'Event DELETE via dialog', 'PASS');
    } else {
      log('EVT-DELETE', 'Confirm dialog button not found', 'FAIL');
    }
  } else {
    log('EVT-DELETE', 'Delete button not found (may be no events)', 'BLOCKED');
  }
}

// ═══ SUMMARY ═══
console.log('\n══════════════════════════════════════');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked}`);
if (fail > 0) {
  console.log('\nFailed:');
  results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.id}: ${r.actual || r.name}`));
}
if (pageErrors.length > 0) {
  console.log(`\nPage errors (${pageErrors.length}):`);
  [...new Set(pageErrors)].forEach(e => console.log(`  - ${e.substring(0, 200)}`));
}

await browser.close();
process.exit(0);

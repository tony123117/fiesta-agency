import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];

function log(id, name, status, action, expected, actual, evidence = '', severity = '') {
  const r = { id, name, status, action, expected, actual, evidence, severity };
  results.push(r);
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'BLOCKED' ? '🚫' : '⚠️';
  console.log(`${icon} TEST ${id} — ${name} [${status}]`);
  if (status === 'FAIL') console.log(`   ACTION: ${action} | EXPECTED: ${expected} | ACTUAL: ${actual} | SEV: ${severity}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const pageErrors = [];
page.on('pageerror', err => pageErrors.push(err.message));
const consoleErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

// ═══ TEST 1 — LOGIN ═══
console.log('\n=== TEST 1 — ADMIN LOGIN ===');

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
const hasEmail = !!(await page.$('#email'));
const hasPw = !!(await page.$('#password'));
const hasSubmit = !!(await page.$('button[type="submit"]'));
log('1a', 'Login page renders', (hasEmail && hasPw && hasSubmit) ? 'PASS' : 'FAIL', 'Navigate /admin/login', 'Form with email/password/submit', `email=${hasEmail} pw=${hasPw} submit=${hasSubmit}`, '', 'P0');

// 1b: Invalid creds
await page.fill('#email', 'wrong@example.com');
await page.fill('#password', 'wrongpassword');
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);
const errEl = await page.$('.text-red-400');
log('1b', 'Invalid credentials error', (errEl && page.url().includes('/login')) ? 'PASS' : 'FAIL', 'Submit wrong creds', 'Error + stay on login', `err=${!!errEl} url=${page.url()}`, '', 'P1');

// 1c: Valid creds
await page.fill('#email', 'arum200909@gmail.com');
await page.fill('#password', '4cCyU6D***');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
log('1c', 'Valid credentials authenticate', page.url().includes('/admin') && !page.url().includes('/login') ? 'PASS' : 'FAIL', 'Submit valid creds', 'Redirect to /admin', `URL: ${page.url()}`, '', 'P0');

// 1d: Session persistence
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
log('1d', 'Session persists after refresh', page.url().includes('/admin') && !page.url().includes('/login') ? 'PASS' : 'FAIL', 'Reload page', 'Stay authenticated', `URL: ${page.url()}`, '', 'P1');

// ═══ TEST 2 — DASHBOARD ═══
console.log('\n=== TEST 2 — ADMIN DASHBOARD ===');

await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const body = await page.textContent('body');
const hasStats = body.includes('UPCOMING') || body.includes('BOOKING') || body.includes('PORTFOLIO');
log('2a', 'Dashboard renders with stats', hasStats ? 'PASS' : 'FAIL', 'Navigate /admin', 'Stats render', `body has UPCOMING=${body.includes('UPCOMING')}`, '', 'P1');

const navLinks = await page.$$eval('a[href*="/admin/"]', els => els.map(e => e.href).filter(h => h.match(/\/admin\/[a-z]/)));
const uniqueNavs = [...new Set(navLinks)];
log('2b', 'Dashboard navigation links', uniqueNavs.length > 3 ? 'PASS' : 'FAIL', 'Check nav links', 'Multiple admin nav links', `Found ${uniqueNavs.length}: ${uniqueNavs.join(', ')}`);

// ═══ TEST 3 — PAGES LIST ═══
console.log('\n=== TEST 3 — PAGES LIST ===');

await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const pagesBody = await page.textContent('body');
const knownPages = ['About', 'Home', 'Services', 'How We Work'];
const found = knownPages.filter(p => pagesBody.includes(p));
log('3a', 'Page list loads with known pages', found.length >= 3 ? 'PASS' : 'FAIL', 'Navigate /admin/pages', `Pages: ${knownPages.join(', ')}`, `Found: ${found.join(', ')}`, '', 'P1');

const editLinks = await page.$$eval('a[href*="/admin/pages/"]', els => els.map(e => e.href).filter(h => h.match(/\/admin\/pages\/[a-f0-9-]+$/)));
const uniquePages = [...new Set(editLinks)];
log('3b', 'Edit controls present', uniquePages.length > 0 ? 'PASS' : 'FAIL', 'Check edit links', 'Edit links exist', `Found ${uniquePages.length} page edit links`);

const hasStatus = pagesBody.includes('LIVE') || pagesBody.includes('DRAFT');
log('3c', 'Status indicators visible', hasStatus ? 'PASS' : 'FAIL', 'Check status', 'LIVE/DRAFT badges', `LIVE=${pagesBody.includes('LIVE')} DRAFT=${pagesBody.includes('DRAFT')}`);

// ═══ TEST 4 — PAGE BUILDER LOAD ═══
console.log('\n=== TEST 4 — PAGE BUILDER LOAD (all pages) ===');

pageErrors.length = 0;
for (const link of uniquePages) {
  const pid = link.split('/').pop().substring(0, 8);
  await page.goto(link, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const pb = await page.textContent('body');
  const hasError = pb.includes('Something went wrong') || pb.includes('ErrorBoundary');
  const hasContent = pb.includes('Section') || pb.includes('Preview') || pb.includes('Save');
  log(`4-${pid}`, `PageBuilder: ${pid}`, (!hasError && hasContent) ? 'PASS' : 'FAIL', `Load page builder for ${pid}`, 'Renders without error', `error=${hasError} content=${hasContent}`, '', 'P0');
}

const criticalErrors = pageErrors.filter(e => !e.includes('favicon') && !e.includes('404'));
if (criticalErrors.length > 0) {
  console.log(`\n⚠️ Page errors during TEST 4:`);
  criticalErrors.forEach(e => console.log(`  - ${e.substring(0, 300)}`));
}

// ═══ SUMMARY ═══
console.log('\n\n=== TESTS 1-4 SUMMARY ===');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked} | TOTAL: ${results.length}`);
console.log(`Page errors: ${criticalErrors.length}`);
console.log(`Console errors: ${consoleErrors.length}`);

if (fail > 0) {
  console.log('\nFailed tests:');
  results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.id} ${r.name}: ${r.actual}`));
}

await browser.close();

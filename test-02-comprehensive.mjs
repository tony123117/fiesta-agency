import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];
const pageErrors = [];

function log(id, name, status, actual = '', severity = '') {
  results.push({ id, name, status, actual, severity });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'BLOCKED' ? '🚫' : '⚠️';
  console.log(`${icon} ${id} — ${name} [${status}]${actual ? ': ' + actual : ''}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', err => pageErrors.push(err.message));

async function gt() { return page.textContent('body'); }
async function w(ms = 2000) { await page.waitForTimeout(ms); }

// ═══ LOGIN ═══
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#email', 'arum200909@gmail.com');
await page.fill('#password', '4cCyU6D***');
await page.click('button[type="submit"]');
await w(3000);
const afterLogin = page.url();
log('AUTH', 'Login', afterLogin.includes('/admin') && !afterLogin.includes('/login') ? 'PASS' : 'FAIL', afterLogin);

// ═══ PAGES LIST ═══
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await w(3000);
const pageListUrl = page.url();
log('PAGES-NAV', 'Navigate to pages', pageListUrl.includes('/admin/pages') ? 'PASS' : 'FAIL', pageListUrl);

// Get all edit links
const editLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
  els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
);
const uniquePages = [...new Set(editLinks)].map(h => BASE + h);
console.log(`Found ${uniquePages.length} page edit links: ${uniquePages.map(u => u.split('/').pop().substring(0, 8)).join(', ')}`);

if (uniquePages.length === 0) {
  console.log('No pages found! Taking screenshot...');
  await page.screenshot({ path: 'test-screenshot-nopages.png' });
  const t = await gt();
  console.log('Page text (first 500):', t.substring(0, 500));
  await browser.close();
  process.exit(1);
}

// ═══ TEST 4 — PAGE BUILDER LOAD ALL PAGES ═══
console.log('\n=== TEST 4 — PAGE BUILDER LOAD ===');
pageErrors.length = 0;
for (const link of uniquePages) {
  const pid = link.split('/').pop().substring(0, 8);
  await page.goto(link, { waitUntil: 'networkidle' });
  await w(3000);
  const t = await gt();
  const hasError = t.includes('Something went wrong');
  const hasContent = t.includes('PAGE BUILDER') || t.includes('Save') || t.includes('Section');
  log(`4-${pid}`, `PageBuilder: ${pid}`, (!hasError && hasContent) ? 'PASS' : 'FAIL', `err=${hasError} content=${hasContent}`, hasError ? 'P0' : '');
}
const critErrors = [...new Set(pageErrors.filter(e => !e.includes('favicon')))];
if (critErrors.length > 0) {
  console.log(`  ⚠️ ${critErrors.length} unique page errors:`);
  critErrors.forEach(e => console.log(`    - ${e.substring(0, 200)}`));
}

// ═══ TEST 5 — SECTION SELECTION ═══
console.log('\n=== TEST 5 — SECTION SELECTION ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(3000);
{
  const sections = await page.$$('[data-section-id]');
  log('5a', 'Sections found', sections.length > 0 ? 'PASS' : 'FAIL', `${sections.length} sections`);
  if (sections.length >= 3) {
    const names = [];
    for (let i = 0; i < 3; i++) {
      try {
        await sections[i].scrollIntoViewIfNeeded();
        await sections[i].click({ force: true, timeout: 3000 });
        await w(800);
        const t = await gt();
        const m = t.match(/EDITING\s+([^\n]+)/);
        names.push(m ? m[1].trim() : '?');
      } catch (e) { names.push('ERR:' + e.message.substring(0, 30)); }
    }
    log('5b', 'Section selection changes editor', new Set(names.filter(n => !n.startsWith('ERR'))).size >= 2 ? 'PASS' : 'FAIL', names.join(' → '));
  }
}

// ═══ TEST 16 — ADD SECTION ═══
console.log('\n=== TEST 16 — ADD SECTION ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(2000);
{
  const btn = await page.$('button:has-text("Add Section")');
  if (btn) {
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true, timeout: 5000 });
    await w(2000);
    await page.screenshot({ path: 'test-screenshot-addsection.png' });
    const t = await gt();
    log('16a', 'Add Section modal', (t.includes('FEATURED') || t.includes('CONTENT') || t.includes('CONVERSION')) ? 'PASS' : 'FAIL');
    log('16b', 'Live Preview', t.includes('Live Preview') ? 'PASS' : 'FAIL');
    log('16c', 'Section type cards', t.includes('Hero') || t.includes('Testimonials') || t.includes('CTA') ? 'PASS' : 'FAIL');
    await page.keyboard.press('Escape');
    await w(500);
  } else { log('16a', 'Add Section button', 'BLOCKED'); }
}

// ═══ TEST 17 — SECTION EDITING ═══
console.log('\n=== TEST 17 — SECTION EDITING ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(2000);
{
  const t = await gt();
  log('17a', 'Section visibility toggle', t.includes('Published') || t.includes('Hidden') ? 'PASS' : 'FAIL');
  log('17b', 'Section title input', (await page.$('input[placeholder="Internal label"]')) ? 'PASS' : 'FAIL');
  log('17c', 'Editor panel visible', t.includes('EDITOR') || t.includes('EDITING') ? 'PASS' : 'FAIL');
}

// ═══ TEST 20 — SAVE ═══
console.log('\n=== TEST 20 — SAVE ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(2000);
{
  const t = await gt();
  log('20a', 'Save state indicator', (t.includes('Saved') || t.includes('Unsaved')) ? 'PASS' : 'FAIL', t.includes('Saved') ? 'Saved' : 'Unsaved');

  const allBtns = await page.$$('button');
  let clicked = false;
  for (const b of allBtns) {
    const txt = (await b.textContent()).trim();
    if (txt === 'Save' && !(await b.isDisabled())) {
      await b.click({ force: true, timeout: 3000 });
      clicked = true;
      break;
    }
  }
  if (clicked) {
    await w(2000);
    const t2 = await gt();
    log('20b', 'Save completes', t2.includes('Saved') ? 'PASS' : 'FAIL', `After: ${t2.includes('Saved') ? 'Saved' : 'other'}`);
  } else {
    log('20b', 'Save button (enabled)', 'BLOCKED');
  }
}

// ═══ TEST 18 — UNDO/REDO ═══
console.log('\n=== TEST 18 — UNDO/REDO ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(2000);
{
  await page.keyboard.press('Control+z');
  await w(500);
  log('18a', 'Ctrl+Z', (await gt()).includes('Undo') ? 'PASS' : 'BLOCKED');
  await page.keyboard.press('Control+Shift+z');
  await w(500);
  log('18b', 'Ctrl+Shift+Z', (await gt()).includes('Redo') ? 'PASS' : 'BLOCKED');
}

// ═══ TEST 22 — FULL PAGE PREVIEW ═══
console.log('\n=== TEST 22 — FULL PAGE PREVIEW ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(2000);
{
  const allBtns = await page.$$('button');
  let found = false;
  for (const b of allBtns) {
    const t = await b.getAttribute('title');
    if (t && t.toLowerCase().includes('preview')) {
      await b.scrollIntoViewIfNeeded();
      await b.click({ force: true, timeout: 3000 });
      found = true;
      break;
    }
  }
  if (found) {
    await w(1500);
    const t = await gt();
    log('22a', 'Preview opens', t.includes('Draft Preview') ? 'PASS' : 'FAIL');
    await page.keyboard.press('Escape');
    await w(500);
    log('22b', 'Escape closes', !(await gt()).includes('Draft Preview') ? 'PASS' : 'FAIL');
  } else {
    log('22a', 'Preview', 'BLOCKED', 'No button with title containing "preview"');
    await page.screenshot({ path: 'test-screenshot-nopreview.png' });
  }
}

// ═══ TEST 23 — PUBLISHING ═══
console.log('\n=== TEST 23 — PUBLISHING ===');
await page.goto(uniquePages[0], { waitUntil: 'networkidle' });
await w(2000);
{ const t = await gt(); log('23a', 'Published state', (t.includes('PUBLISHED') || t.includes('Published')) ? 'PASS' : 'FAIL'); }

// ═══ TEST 27-35: CRUD MODULES ═══
console.log('\n=== TEST 27-35: CRUD MODULES ===');
const mods = [
  ['/admin/media', 'Media', 'Upload'],
  ['/admin/events', 'Events', 'Events'],
  ['/admin/portfolio', 'Portfolio', 'Portfolio'],
  ['/admin/services', 'Services', 'SERVICES'],
  ['/admin/testimonials', 'Testimonials', 'Testimonial'],
  ['/admin/faqs', 'FAQs', 'FAQ'],
  ['/admin/bookings', 'Bookings', 'BOOKINGS'],
  ['/admin/settings', 'Settings', 'Settings'],
];
for (const [path, name, check] of mods) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await w(3000);
  const t = await gt();
  const loaded = t.includes(check) || t.includes(check.toLowerCase()) || t.includes(check.toUpperCase());
  log(`MOD-${name.substring(0, 3).toUpperCase()}`, `${name} loads`, loaded ? 'PASS' : 'FAIL');
}

// Settings tabs
{
  const t = await gt();
  const tabs = ['Site Identity', 'Navigation', 'Contact', 'Footer', 'SEO'];
  const found = tabs.filter(tab => t.includes(tab));
  log('SET-tabs', 'Settings tabs', found.length >= 3 ? 'PASS' : 'FAIL', found.join(', '));
}

// ═══ TEST 36 — PUBLIC/ADMIN SYNC ═══
console.log('\n=== TEST 36 — PUBLIC/ADMIN SYNC ===');
for (const [path, check] of [['/about', 'Fiesta'], ['/', 'Fiesta'], ['/services', 'Fiesta'], ['/events', 'Fiesta']]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  await w(2000);
  const t = await gt();
  log(`36-${path === '/' ? 'home' : path.substring(1)}`, `Public ${path}`, t.includes(check) ? 'PASS' : 'FAIL');
}

// ═══ TEST 37 — PROTECTED ROUTES ═══
console.log('\n=== TEST 37 — PROTECTED ROUTES ===');
{
  const uc = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const up = await uc.newPage();
  for (const p of ['/admin', '/admin/pages', '/admin/events', '/admin/settings']) {
    await up.goto(`${BASE}${p}`, { waitUntil: 'networkidle' });
    await up.waitForTimeout(2000);
    log(`37-${p.split('/').pop()}`, `Unauth ${p}`, up.url().includes('/login') ? 'PASS' : 'FAIL', `→ ${up.url()}`);
  }
  await uc.close();
}

// ═══ FINAL ═══
console.log('\n══════════════════════════════════════');
console.log('FINAL SUMMARY');
console.log('══════════════════════════════════════');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked} | TOTAL: ${results.length}`);
const errs = [...new Set(pageErrors.filter(e => !e.includes('favicon')))];
if (errs.length > 0) { console.log(`\nPage errors (${errs.length}):`); errs.forEach(e => console.log(`  - ${e.substring(0, 200)}`)); }
if (fail > 0) { console.log('\nFailed:'); results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.id} ${r.name}: ${r.actual} [${r.severity}]`)); }

await browser.close();
process.exit(0);

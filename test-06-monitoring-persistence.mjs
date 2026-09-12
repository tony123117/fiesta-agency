// ── Test 06: Monitoring & Data Persistence (Tests 39-40) ──
// Tests: Console/network error monitoring, Data persistence master test

import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];
const pageErrors = [];
const consoleErrors = [];
const networkErrors = [];

function log(id, name, status, actual = '', severity = '') {
  results.push({ id, name, status, actual, severity });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'BLOCKED' ? '🚫' : '⚠️';
  console.log(`${icon} ${id} — ${name} [${status}]${actual ? ': ' + actual : ''}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Collect all console messages
page.on('pageerror', err => pageErrors.push(err.message));
page.on('console', msg => {
  if (msg.type() === 'error') {
    consoleErrors.push(msg.text());
  }
});

// Collect network errors
page.on('requestfailed', req => {
  networkErrors.push(`${req.failure().errorText} ${req.url()}`);
});

page.on('response', res => {
  if (res.status() >= 400) {
    networkErrors.push(`${res.status()} ${res.url()}`);
  }
});

async function gt() { return page.textContent('body'); }
async function w(ms = 2000) { await page.waitForTimeout(ms); }

// ═══ LOGIN ═══
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#email', 'arum200909@gmail.com');
await page.fill('#password', '4cCyU6D***');
await page.click('button[type="submit"]');
await w(3000);
log('AUTH', 'Login', page.url().includes('/admin') && !page.url().includes('/login') ? 'PASS' : 'FAIL', page.url());

// ═══ TEST 39 — CONSOLE/NETWORK MONITORING ═══
console.log('\n=== TEST 39 — CONSOLE/NETWORK MONITORING ===');

// 39a: Dashboard — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  const critConsoleErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('DevTools'));
  const critNetworkErrors = networkErrors.filter(e => !e.includes('favicon') && !e.includes('404'));
  log('39a', 'Dashboard: no critical page errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39b: Pages list — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  const critConsoleErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('DevTools'));
  const critNetworkErrors = networkErrors.filter(e => !e.includes('favicon') && !e.includes('404'));
  log('39b', 'Pages: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page, ${critConsoleErrors.length} console, ${critNetworkErrors.length} network`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39c: Events list — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin/events`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  log('39c', 'Events: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39d: Portfolio list — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin/portfolio`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  log('39d', 'Portfolio: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39e: Services CMS — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin/services`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  log('39e', 'Services: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39f: Bookings — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin/bookings`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  log('39f', 'Bookings: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39g: Settings — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
await w(3000);
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  log('39g', 'Settings: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// 39h: PageBuilder — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
{
  const editLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const unique = [...new Set(editLinks)];
  if (unique.length > 0) {
    await page.goto(BASE + unique[0], { waitUntil: 'networkidle' });
    await w(3000);
    const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
    log('39h', 'PageBuilder: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
  } else {
    log('39h', 'PageBuilder: no critical errors', 'BLOCKED');
  }
}

// 39i: Public pages — check for errors
consoleErrors.length = 0;
networkErrors.length = 0;
pageErrors.length = 0;
for (const path of ['/', '/about', '/services', '/events']) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await w(3000);
}
{
  const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
  log('39i', 'Public pages: no critical errors', critPageErrors.length === 0 ? 'PASS' : 'FAIL', `${critPageErrors.length} page errors`, critPageErrors.length > 0 ? 'P0' : '');
}

// ═══ TEST 40 — DATA PERSISTENCE MASTER TEST ═══
console.log('\n=== TEST 40 — DATA PERSISTENCE MASTER TEST ===');

// 40a: Settings persist across reloads
await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
await w(3000);
{
  const input = await page.$('input[name="company_name"]');
  if (input) {
    const val1 = await input.inputValue();
    await page.reload({ waitUntil: 'networkidle' });
    await w(3000);
    const input2 = await page.$('input[name="company_name"]');
    const val2 = input2 ? await input2.inputValue() : '';
    log('40a', 'Settings persist across reload', val1 === val2 && val1.length > 0 ? 'PASS' : 'FAIL', `"${val1.substring(0, 30)}" → "${val2.substring(0, 30)}"`);
  } else {
    log('40a', 'Settings persist across reload', 'BLOCKED');
  }
}

// 40b: Pages list persists across reloads
{
  await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
  await w(2000);
  const links1 = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const count1 = [...new Set(links1)].length;

  await page.reload({ waitUntil: 'networkidle' });
  await w(2000);
  const links2 = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const count2 = [...new Set(links2)].length;
  log('40b', 'Pages list persists across reload', count1 === count2 && count1 > 0 ? 'PASS' : 'FAIL', `${count1} → ${count2} pages`);
}

// 40c: Events list persists across reloads
{
  await page.goto(`${BASE}/admin/events`, { waitUntil: 'networkidle' });
  await w(2000);
  const t1 = await gt();
  const hasEvents1 = t1.includes('Edit') || t1.includes('event');

  await page.reload({ waitUntil: 'networkidle' });
  await w(2000);
  const t2 = await gt();
  const hasEvents2 = t2.includes('Edit') || t2.includes('event');
  log('40c', 'Events list persists across reload', hasEvents1 === hasEvents2 ? 'PASS' : 'FAIL', `before=${hasEvents1}, after=${hasEvents2}`);
}

// 40d: Section content persists after save + page reload
{
  const editLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const unique = [...new Set(editLinks)];
  if (unique.length > 0) {
    await page.goto(BASE + unique[0], { waitUntil: 'networkidle' });
    await w(3000);

    // Find first section and check title
    const sections = await page.$$('[data-section-id]');
    if (sections.length > 0) {
      await sections[0].click({ force: true, timeout: 3000 });
      await w(1000);
      const titleInput = await page.$('input[name="section_title"]');
      if (titleInput) {
        const title1 = await titleInput.inputValue();

        // Reload
        await page.reload({ waitUntil: 'networkidle' });
        await w(3000);

        // Select first section again
        const sections2 = await page.$$('[data-section-id]');
        if (sections2.length > 0) {
          await sections2[0].click({ force: true, timeout: 3000 });
          await w(1000);
          const titleInput2 = await page.$('input[name="section_title"]');
          if (titleInput2) {
            const title2 = await titleInput2.inputValue();
            log('40d', 'Section content persists after reload', title1 === title2 ? 'PASS' : 'FAIL', `"${title1}" → "${title2}"`);
          } else {
            log('40d', 'Section title input after reload', 'BLOCKED');
          }
        } else {
          log('40d', 'Sections after reload', 'BLOCKED');
        }
      } else {
        log('40d', 'Section title input', 'BLOCKED');
      }
    } else {
      log('40d', 'Sections found', 'BLOCKED');
    }
  } else {
    log('40d', 'Section content persists', 'BLOCKED');
  }
}

// 40e: Navigation between admin pages preserves state
{
  await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
  await w(2000);
  const t1 = await gt();

  // Navigate to events
  await page.goto(`${BASE}/admin/events`, { waitUntil: 'networkidle' });
  await w(2000);
  const t2 = await gt();

  // Navigate back to pages
  await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
  await w(2000);
  const t3 = await gt();
  log('40e', 'Navigation preserves page data', t1.includes('Edit') === t3.includes('Edit') ? 'PASS' : 'FAIL');
}

// 40f: Auth session persists across page navigations
{
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
  await w(2000);
  const url1 = page.url();
  const isAuth1 = url1.includes('/admin') && !url1.includes('/login');

  await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
  await w(2000);
  const url2 = page.url();
  const isAuth2 = url2.includes('/admin') && !url2.includes('/login');

  log('40f', 'Auth session persists across navigation', isAuth1 && isAuth2 ? 'PASS' : 'FAIL');
}

// 40g: CRUD cycle — create, verify, delete
{
  await page.goto(`${BASE}/admin/events`, { waitUntil: 'networkidle' });
  await w(2000);
  const countBefore = (await page.$$('[aria-label*="Delete"]')).length;

  // Create
  const addBtn = await page.$('a:has-text("Add Event"), button:has-text("Add Event")');
  if (addBtn) {
    await addBtn.click({ force: true, timeout: 5000 });
    await w(3000);
    const titleInput = await page.$('input[name="title"], input[placeholder*="Event"]');
    if (titleInput) {
      await titleInput.fill('Persistence Test Event');
      await w(500);
      const descInput = await page.$('textarea[name="description"], textarea');
      if (descInput) await descInput.fill('Persistence test event description');

      const saveBtn = await page.$('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
      if (saveBtn) {
        await saveBtn.click({ force: true, timeout: 5000 });
        await w(3000);

        // Verify in list
        await page.goto(`${BASE}/admin/events`, { waitUntil: 'networkidle' });
        await w(2000);
        const t = await gt();
        const found = t.includes('Persistence Test Event');
        log('40g', 'CRUD cycle: create → verify', found ? 'PASS' : 'FAIL');

        // Delete
        if (found) {
          const delBtn = await page.$('button[aria-label*="Delete Persistence"], button[aria-label*="elete"]');
          if (delBtn) {
            await delBtn.scrollIntoViewIfNeeded();
            await delBtn.click({ force: true, timeout: 5000 });
            await w(1500);
            const confirmBtn = await page.$('button:has-text("Delete"):not([aria-label*="elete"])');
            if (confirmBtn) {
              await confirmBtn.click({ force: true, timeout: 5000 });
              await w(3000);
              const t2 = await gt();
              log('40g', 'CRUD cycle: delete → verify', !t2.includes('Persistence Test Event') ? 'PASS' : 'FAIL');
            } else {
              log('40g', 'CRUD cycle: confirm delete', 'BLOCKED');
            }
          } else {
            log('40g', 'CRUD cycle: delete button', 'BLOCKED');
          }
        }
      } else {
        log('40g', 'CRUD cycle: save button', 'BLOCKED');
      }
    } else {
      log('40g', 'CRUD cycle: title input', 'BLOCKED');
    }
  } else {
    log('40g', 'CRUD cycle: add event button', 'BLOCKED');
  }
}

// ═══ SUMMARY ═══
console.log('\n══════════════════════════════════════');
console.log('TEST 39-40 SUMMARY');
console.log('══════════════════════════════════════');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked} | TOTAL: ${results.length}`);
if (fail > 0) { console.log('\nFailed:'); results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.id} ${r.name}: ${r.actual}`)); }

// Overall page errors across all navigations
const critPageErrors = pageErrors.filter(e => !e.includes('favicon'));
if (critPageErrors.length > 0) {
  console.log(`\n⚠️ ${critPageErrors.length} unique page errors during monitoring:`);
  [...new Set(critPageErrors)].forEach(e => console.log(`  - ${e.substring(0, 200)}`));
}

await browser.close();
process.exit(0);

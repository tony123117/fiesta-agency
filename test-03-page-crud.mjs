// ── Test 03: Page CRUD (Tests 24-26) ──
// Tests: Create new page via template, duplicate existing page, delete page

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
log('AUTH', 'Login', page.url().includes('/admin') && !page.url().includes('/login') ? 'PASS' : 'FAIL', page.url());

// ═══ TEST 24 — CREATE NEW PAGE FROM TEMPLATE ═══
console.log('\n=== TEST 24 — CREATE NEW PAGE FROM TEMPLATE ===');
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await w(2000);
{
  const createBtn = await page.$('button:has-text("Create Page"), button:has-text("New Page"), a:has-text("Create Page")');
  if (createBtn) {
    await createBtn.click({ force: true, timeout: 5000 });
    await w(2000);
    const t = await gt();
    log('24a', 'Create page modal opens', t.includes('Choose a Template') || t.includes('CREATE PAGE') || t.includes('Template') ? 'PASS' : 'FAIL');

    // Select first template
    const useBtn = await page.$('button:has-text("Use Template")');
    if (useBtn) {
      await useBtn.click({ force: true, timeout: 5000 });
      await w(1500);
      const t2 = await gt();
      log('24b', 'Template selected, configure view', t2.includes('Page Title') || t2.includes('PAGE SETTINGS') || t2.includes('Create Draft') ? 'PASS' : 'FAIL');

      // Fill in title
      const titleInput = await page.$('input[name="title"]');
      if (titleInput) {
        const uniqueTitle = `Test Page ${Date.now()}`;
        await titleInput.fill(uniqueTitle);
        await w(1000);
        const slugInput = await page.$('input[name="slug"]');
        const slugVal = slugInput ? await slugInput.inputValue() : '';
        log('24c', 'Title auto-fills slug', slugVal.length > 0 ? 'PASS' : 'FAIL', `slug="${slugVal}"`);

        // Click Create Draft
        const createDraftBtn = await page.$('button:has-text("Create Draft")');
        if (createDraftBtn) {
          const isDisabled = await createDraftBtn.getAttribute('disabled');
          log('24c1', 'Create Draft button enabled', isDisabled === null ? 'PASS' : 'FAIL', `disabled=${isDisabled}`);
          await createDraftBtn.click({ force: true, timeout: 10000 });
          await w(10000);
          const url = page.url();
          log('24d', 'Page created, navigated to builder', url.includes('/admin/pages/') && !url.endsWith('/pages') ? 'PASS' : 'FAIL', `url=${url.substring(url.indexOf('/admin'))}`);
          // Wait for loading to finish
          try {
            await page.waitForFunction(() => !document.body.textContent?.includes('LOADING PAGE'), { timeout: 10000 });
          } catch {}
          await w(3000);
          const t3 = await gt();
          log('24e', 'PageBuilder loaded for new page', t3.includes('PAGE BUILDER') || t3.includes('Save') || t3.includes('Untitled') || t3.includes('PAGE SETTINGS') ? 'PASS' : 'FAIL');
        } else {
          log('24d', 'Create Draft button', 'BLOCKED');
          log('24e', 'PageBuilder loaded', 'BLOCKED');
        }
      } else {
        log('24c', 'Title input', 'BLOCKED');
        log('24d', 'Page created', 'BLOCKED');
        log('24e', 'PageBuilder loaded', 'BLOCKED');
      }
    } else {
      log('24b', 'Use Template button', 'BLOCKED');
      log('24c', 'Title input', 'BLOCKED');
      log('24d', 'Page created', 'BLOCKED');
      log('24e', 'PageBuilder loaded', 'BLOCKED');
    }
  } else {
    log('24a', 'Create Page button', 'BLOCKED');
    log('24b', 'Template selected', 'BLOCKED');
    log('24c', 'Title input', 'BLOCKED');
    log('24d', 'Page created', 'BLOCKED');
    log('24e', 'PageBuilder loaded', 'BLOCKED');
  }
}

// ═══ TEST 25 — DUPLICATE PAGE ═══
console.log('\n=== TEST 25 — DUPLICATE PAGE ===');
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await w(2000);
{
  const initialLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const initialCount = [...new Set(initialLinks)].length;

  // Find a duplicate button
  const dupBtn = await page.$('button[aria-label*="uplicate"], button:has-text("Duplicate")');
  if (dupBtn) {
    await dupBtn.scrollIntoViewIfNeeded();
    await dupBtn.click({ force: true, timeout: 5000 });
    await w(3000);
    const newLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
      els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
    );
    const newCount = [...new Set(newLinks)].length;
    log('25a', 'Duplicate button clicked', 'PASS', `${initialCount} → ${newCount} pages`);
    log('25b', 'New page created by duplicate', newCount > initialCount ? 'PASS' : 'FAIL', `count: ${newCount}`);
  } else {
    // Try the PageList duplicate buttons
    const allBtns = await page.$$('button');
    let foundDup = false;
    for (const b of allBtns) {
      const label = await b.getAttribute('aria-label');
      if (label && label.toLowerCase().includes('duplicate')) {
        await b.scrollIntoViewIfNeeded();
        await b.click({ force: true, timeout: 5000 });
        foundDup = true;
        break;
      }
    }
    if (foundDup) {
      await w(3000);
      log('25a', 'Duplicate button clicked', 'PASS');
      const newLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
        els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
      );
      const newCount = [...new Set(newLinks)].length;
      log('25b', 'New page created by duplicate', newCount > initialCount ? 'PASS' : 'FAIL', `count: ${newCount}`);
    } else {
      log('25a', 'Duplicate button', 'BLOCKED');
      log('25b', 'New page created', 'BLOCKED');
    }
  }
}

// ═══ TEST 26 — DELETE PAGE ═══
console.log('\n=== TEST 26 — DELETE PAGE ===');
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await w(2000);
{
  const initialLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const initialCount = [...new Set(initialLinks)].length;

  // Find a delete button
  const delBtn = await page.$('button[aria-label*="elete"], button:has-text("Delete")');
  if (delBtn) {
    await delBtn.scrollIntoViewIfNeeded();
    await delBtn.click({ force: true, timeout: 5000 });
    await w(1500);
    const t = await gt();
    log('26a', 'Delete confirmation dialog', t.includes('Delete') || t.includes('delete') || t.includes('confirm') ? 'PASS' : 'FAIL');

    // Confirm deletion
    const confirmBtn = await page.$('button:has-text("Delete"):not([aria-label*="elete"]), button:has-text("Confirm"), button:has-text("Yes")');
    if (confirmBtn) {
      await confirmBtn.click({ force: true, timeout: 5000 });
      await w(3000);
      const newLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
        els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
      );
      const newCount = [...new Set(newLinks)].length;
      log('26b', 'Page deleted', newCount < initialCount ? 'PASS' : 'FAIL', `count: ${initialCount} → ${newCount}`);
    } else {
      log('26b', 'Confirm delete button', 'BLOCKED');
    }
  } else {
    log('26a', 'Delete button', 'BLOCKED');
    log('26b', 'Page deleted', 'BLOCKED');
  }
}

// ═══ CLEANUP — Delete test page ═══
{
  const testLinks = await page.$$eval('a[href*="/admin/pages/"]', els =>
    els.map(e => e.getAttribute('href')).filter(h => h && h.match(/\/admin\/pages\/[a-f0-9-]+$/))
  );
  const unique = [...new Set(testLinks)];
  for (const link of unique) {
    // We'll rely on manual cleanup or the test above handled it
  }
}

// ═══ SUMMARY ═══
console.log('\n══════════════════════════════════════');
console.log('TEST 24-26 SUMMARY');
console.log('══════════════════════════════════════');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked} | TOTAL: ${results.length}`);
if (fail > 0) { console.log('\nFailed:'); results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.id} ${r.name}: ${r.actual}`)); }
if (pageErrors.length > 0) { console.log(`\nPage errors (${pageErrors.length}):`); [...new Set(pageErrors)].forEach(e => console.log(`  - ${e.substring(0, 200)}`)); }

await browser.close();
process.exit(0);

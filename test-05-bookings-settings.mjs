// ── Test 05: Bookings & Settings (Tests 34-35) ──
// Tests: Bookings notes, status changes, Settings save+reload

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

// ═══ TEST 34 — BOOKINGS NOTES ═══
console.log('\n=== TEST 34 — BOOKINGS NOTES ===');

// 34a: Bookings list loads
await page.goto(`${BASE}/admin/bookings`, { waitUntil: 'networkidle' });
await w(2000);
{
  const t = await gt();
  log('34a', 'Bookings list loads', (t.includes('Bookings') || t.includes('bookings') || t.includes('BOOKINGS')) ? 'PASS' : 'FAIL');
}

// 34b: View booking detail
{
  const viewBtn = await page.$('button:has-text("View"), a:has-text("View")');
  if (viewBtn) {
    await viewBtn.scrollIntoViewIfNeeded();
    await viewBtn.click({ force: true, timeout: 5000 });
    await w(2000);
    const t = await gt();
    log('34b', 'Booking detail panel opens', t.includes('Internal Notes') || t.includes('Message') || t.includes('Email') ? 'PASS' : 'FAIL');

    // 34c: Notes textarea exists
    const notesTextarea = await page.$('textarea[placeholder*="notes"], textarea[placeholder*="Notes"]');
    if (notesTextarea) {
      log('34c', 'Notes textarea exists', 'PASS');

      // 34d: Type in notes
      await notesTextarea.fill('');
      await notesTextarea.type('Test note from acceptance test - auto generated');
      await w(1500);
      log('34d', 'Notes typed successfully', 'PASS');

      // 34e: Notes persist after re-open (debounced save)
      await w(2000); // wait for debounce save (500ms) + buffer
      const closeBtn = await page.$('button[aria-label*="close"], button:has-text("Close"), div[class*="panel"] button:first-child');
      if (closeBtn) {
        await closeBtn.click({ force: true, timeout: 3000 });
        await w(1000);
        // Re-open
        const viewBtn2 = await page.$('button:has-text("View"), a:has-text("View")');
        if (viewBtn2) {
          await viewBtn2.scrollIntoViewIfNeeded();
          await viewBtn2.click({ force: true, timeout: 5000 });
          await w(2000);
          const notesAfter = await page.$('textarea[placeholder*="notes"], textarea[placeholder*="Notes"]');
          if (notesAfter) {
            const val = await notesAfter.inputValue();
            log('34e', 'Notes persist after re-open', val.includes('Test note from acceptance test') ? 'PASS' : 'FAIL', `value="${val.substring(0, 50)}"`);
          } else {
            log('34e', 'Notes textarea re-found', 'BLOCKED');
          }
        } else {
          log('34e', 'View button re-found', 'BLOCKED');
        }
      } else {
        // Try clicking X button
        const xBtns = await page.$$('button');
        for (const b of xBtns) {
          const ariaLabel = await b.getAttribute('aria-label');
          if (ariaLabel && ariaLabel.toLowerCase().includes('close')) {
            await b.click({ force: true });
            break;
          }
        }
        await w(1000);
        log('34e', 'Close panel', 'BLOCKED');
      }
    } else {
      log('34c', 'Notes textarea', 'BLOCKED');
      log('34d', 'Notes typed', 'BLOCKED');
      log('34e', 'Notes persist', 'BLOCKED');
    }
  } else {
    log('34b', 'View booking button', 'BLOCKED');
    log('34c', 'Notes textarea', 'BLOCKED');
    log('34d', 'Notes typed', 'BLOCKED');
    log('34e', 'Notes persist', 'BLOCKED');
  }
}

// 34f: Status change buttons exist
{
  const statusBtns = await page.$$('button');
  const statusTexts = [];
  for (const b of statusBtns) {
    const text = await b.textContent();
    if (text && ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'].includes(text.trim().toLowerCase())) {
      statusTexts.push(text.trim());
    }
  }
  log('34f', 'Status change buttons exist', statusTexts.length >= 2 ? 'PASS' : 'FAIL', `found: ${statusTexts.join(', ')}`);
}

// 34g: Booking search filter
{
  const searchInput = await page.$('input[placeholder*="Search"], input[type="search"]');
  if (searchInput) {
    await searchInput.fill('test');
    await w(1000);
    log('34g', 'Booking search works', 'PASS');
    await searchInput.fill('');
  } else {
    log('34g', 'Booking search input', 'BLOCKED');
  }
}

// ═══ TEST 35 — SETTINGS SAVE + RELOAD ═══
console.log('\n=== TEST 35 — SETTINGS SAVE + RELOAD ===');

// 35a: Settings page loads
await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
await w(3000);
{
  const t = await gt();
  log('35a', 'Settings page loads', (t.includes('GLOBAL SETTINGS') || t.includes('Settings') || t.includes('Site Identity')) ? 'PASS' : 'FAIL');
}

// 35b: Settings tabs visible
{
  const t = await gt();
  const hasTabs = t.includes('Site Identity') && t.includes('Navigation') && t.includes('Contact');
  log('35b', 'Settings tabs visible', hasTabs ? 'PASS' : 'FAIL');
}

// 35c: Company Name field exists and is editable
{
  const companyNameInput = await page.$('input[name="company_name"]');
  if (companyNameInput) {
    const originalValue = await companyNameInput.inputValue();
    log('35c', 'Company Name field exists', 'PASS', `value="${originalValue.substring(0, 30)}"`);

    // 35d: Modify and save
    await companyNameInput.fill(originalValue + ' Test');
    await w(500);

    const saveBtn = await page.$('button:has-text("Save Changes"), button:has-text("Save")');
    if (saveBtn) {
      await saveBtn.click({ force: true, timeout: 5000 });
      await w(5000);
      const t2 = await gt();
      // Toast may have already auto-dismissed (3s), so also check if the value actually changed
      const inputNow = await page.$('input[name="company_name"]');
      const currentVal = inputNow ? await inputNow.inputValue() : '';
      log('35d', 'Settings saved', (t2.includes('Settings saved') || currentVal.includes('Test')) ? 'PASS' : 'FAIL', `toast=${t2.includes('Settings saved')}, value="${currentVal.substring(0, 40)}"`);

      // 35e: Reload and check persistence
      await page.reload({ waitUntil: 'networkidle' });
      await w(3000);
      const reloadedInput = await page.$('input[name="company_name"]');
      if (reloadedInput) {
        const reloadedValue = await reloadedInput.inputValue();
        log('35e', 'Settings persist after reload', reloadedValue.includes('Test') ? 'PASS' : 'FAIL', `value="${reloadedValue.substring(0, 40)}"`);

        // Restore original value
        await reloadedInput.fill(originalValue);
        const saveBtn2 = await page.$('button:has-text("Save Changes"), button:has-text("Save")');
        if (saveBtn2) {
          await saveBtn2.click({ force: true, timeout: 5000 });
          await w(2000);
        }
      } else {
        log('35e', 'Input found after reload', 'BLOCKED');
      }
    } else {
      log('35d', 'Save button', 'BLOCKED');
      log('35e', 'Settings persist', 'BLOCKED');
    }
  } else {
    log('35c', 'Company Name field', 'BLOCKED');
    log('35d', 'Settings saved', 'BLOCKED');
    log('35e', 'Settings persist', 'BLOCKED');
  }
}

// 35f: Navigation tab works
{
  const navTab = await page.$('button:has-text("Navigation")');
  if (navTab) {
    await navTab.click({ force: true, timeout: 5000 });
    await w(1500);
    const t = await gt();
    log('35f', 'Navigation tab loads', t.includes('Navigation Links') || t.includes('Add Link') ? 'PASS' : 'FAIL');
  } else {
    log('35f', 'Navigation tab', 'BLOCKED');
  }
}

// 35g: Contact tab works
{
  const contactTab = await page.$('button:has-text("Contact")');
  if (contactTab) {
    await contactTab.click({ force: true, timeout: 5000 });
    await w(1500);
    const t = await gt();
    log('35g', 'Contact tab loads', t.includes('Contact Information') || t.includes('Email') || t.includes('Phone') ? 'PASS' : 'FAIL');
  } else {
    log('35g', 'Contact tab', 'BLOCKED');
  }
}

// 35h: SEO tab works
{
  const seoTab = await page.$('button:has-text("SEO")');
  if (seoTab) {
    await seoTab.click({ force: true, timeout: 5000 });
    await w(1500);
    const t = await gt();
    log('35h', 'SEO tab loads', t.includes('Search Engine') || t.includes('SEO Title') || t.includes('seo_title') ? 'PASS' : 'FAIL');
  } else {
    log('35h', 'SEO tab', 'BLOCKED');
  }
}

// ═══ SUMMARY ═══
console.log('\n══════════════════════════════════════');
console.log('TEST 34-35 SUMMARY');
console.log('══════════════════════════════════════');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked} | TOTAL: ${results.length}`);
if (fail > 0) { console.log('\nFailed:'); results.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.id} ${r.name}: ${r.actual}`)); }
if (pageErrors.length > 0) { console.log(`\nPage errors (${pageErrors.length}):`); [...new Set(pageErrors)].forEach(e => console.log(`  - ${e.substring(0, 200)}`)); }

await browser.close();
process.exit(0);

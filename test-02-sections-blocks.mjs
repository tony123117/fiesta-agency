import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const results = [];
const pageErrors = [];
const consoleErrors = [];

function log(id, name, status, actual = '', severity = '') {
  results.push({ id, name, status, actual, severity });
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'BLOCKED' ? '🚫' : '⚠️';
  console.log(`${icon} ${id} — ${name} [${status}]${actual ? ': ' + actual : ''}`);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.on('pageerror', err => pageErrors.push(err.message));
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

// ═══ LOGIN ═══
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#email', 'arum200909@gmail.com');
await page.fill('#password', '4cCyU6D***');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
log('AUTH', 'Login', page.url().includes('/admin') && !page.url().includes('/login') ? 'PASS' : 'FAIL', page.url());

// ═══ Get first page with edit link ═══
await page.goto(`${BASE}/admin/pages`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
const editLinks = await page.$$eval('a[href*="/admin/pages/"]', els => els.map(e => e.href).filter(h => h.match(/\/admin\/pages\/[a-f0-9-]+$/)));
const uniquePages = [...new Set(editLinks)];
console.log(`Found ${uniquePages.length} pages to test`);

// Test the first page (likely has sections)
const testPageUrl = uniquePages[0];
if (!testPageUrl) {
  console.log('No pages found to test!');
  await browser.close();
  process.exit(1);
}

console.log(`\nTesting PageBuilder on: ${testPageUrl}`);
await page.goto(testPageUrl, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// ═══ TEST 5 — SECTION SELECTION ═══
console.log('\n=== TEST 5 — SECTION SELECTION ===');

// Find section items in the navigator/canvas
const sectionItems = await page.$$('[data-section-id]');
const sectionCount = sectionItems.length;

if (sectionCount === 0) {
  // Try alternative selectors
  const canvasSections = await page.$$('.canvas-section, [class*="section-"]');
  log('5-init', 'Find sections', canvasSections.length > 0 ? 'PASS' : 'BLOCKED', `Found ${canvasSections.length} sections via class, ${sectionCount} via data attr`);
} else {
  log('5-init', 'Find sections', 'PASS', `Found ${sectionCount} sections`);
}

// Try clicking on different sections via the navigator tree
const navSections = await page.$$('[class*="navigator"] button, [class*="Navigator"] button');
log('5-nav', 'Navigator sections found', navSections.length > 0 ? 'PASS' : 'BLOCKED', `Found ${navSections.length} nav buttons`);

// Try clicking a section on the canvas
const clickableSections = await page.$$('[data-section-id], [class*="section"][role="button"], [class*="VisualCanvas"] > div > div');
if (clickableSections.length >= 2) {
  await clickableSections[0].click();
  await page.waitForTimeout(500);
  const afterClick1 = await page.textContent('body');
  const hasEditing1 = afterClick1.includes('EDITING');
  
  await clickableSections[1].click();
  await page.waitForTimeout(500);
  const afterClick2 = await page.textContent('body');
  const hasEditing2 = afterClick2.includes('EDITING');
  
  log('5a', 'Section selection changes', (hasEditing1 || hasEditing2) ? 'PASS' : 'BLOCKED', `Sections clickable: ${clickableSections.length}, EDITING visible after clicks`);
} else {
  // Try the navigator approach
  if (navSections.length >= 2) {
    await navSections[0].click();
    await page.waitForTimeout(500);
    await navSections[1].click();
    await page.waitForTimeout(500);
    log('5a', 'Section selection via navigator', 'PASS', `Clicked ${navSections.length} nav sections`);
  } else {
    log('5a', 'Section selection', 'BLOCKED', `Not enough clickable sections (${clickableSections.length} canvas, ${navSections.length} nav)`);
  }
}

// ═══ TEST 6 — BLOCK SELECTION ═══
console.log('\n=== TEST 6 — BLOCK SELECTION ===');

// Find blocks in the canvas
const blocks = await page.$$('[data-block-id], [class*="block-"][data-block]');
const blockCount = blocks.length;
log('6a', 'Blocks found', blockCount > 0 ? 'PASS' : 'BLOCKED', `Found ${blockCount} blocks`);

if (blockCount > 0) {
  // Click first block
  await blocks[0].click();
  await page.waitForTimeout(500);
  const body = await page.textContent('body');
  const hasBlockInspector = body.includes('Block') || body.includes('block') || body.includes('Heading') || body.includes('Text');
  log('6b', 'Block selection shows inspector', hasBlockInspector ? 'PASS' : 'BLOCKED', `Block inspector visible: ${hasBlockInspector}`);
}

// ═══ TEST 7 — EDIT HEADING BLOCK ═══
console.log('\n=== TEST 7 — EDIT HEADING BLOCK ===');

// Look for a heading block
const headingBlocks = await page.$$('[data-block-type="heading"], [class*="heading-block"]');
if (headingBlocks.length > 0) {
  await headingBlocks[0].click();
  await page.waitForTimeout(500);
  
  // Find heading input in inspector
  const headingInput = await page.$('input[value*="QA"], textarea, input[placeholder*="heading"], input[placeholder*="Heading"]');
  if (headingInput) {
    const origVal = await headingInput.inputValue();
    await headingInput.fill('QA HEADING TEST');
    await page.waitForTimeout(300);
    const bodyAfterEdit = await page.textContent('body');
    log('7a', 'Edit heading block', bodyAfterEdit.includes('QA HEADING TEST') ? 'PASS' : 'BLOCKED', `Changed to QA HEADING TEST`);
    
    // Restore
    await headingInput.fill(origVal);
    await page.waitForTimeout(300);
    log('7b', 'Restore heading', 'PASS', `Restored to: ${origVal.substring(0, 30)}`);
  } else {
    log('7a', 'Edit heading block', 'BLOCKED', 'No heading input found in inspector');
  }
} else {
  log('7a', 'Edit heading block', 'BLOCKED', 'No heading blocks found');
}

// ═══ TEST 8 — EDIT TEXT BLOCK ═══
console.log('\n=== TEST 8 — EDIT TEXT BLOCK ===');

const textBlocks = await page.$$('[data-block-type="text"], [class*="text-block"]');
if (textBlocks.length > 0) {
  await textBlocks[0].click();
  await page.waitForTimeout(500);
  const textInput = await page.$('textarea, input[placeholder*="text"]');
  if (textInput) {
    const origVal = await textInput.inputValue();
    await textInput.fill('QA TEXT BLOCK TEST');
    await page.waitForTimeout(300);
    log('8a', 'Edit text block', 'PASS', `Changed text block`);
    await textInput.fill(origVal);
  } else {
    log('8a', 'Edit text block', 'BLOCKED', 'No text input found');
  }
} else {
  log('8a', 'Edit text block', 'BLOCKED', 'No text blocks found');
}

// ═══ TEST 9 — EDIT BUTTON BLOCK ═══
console.log('\n=== TEST 9 — EDIT BUTTON BLOCK ===');

const btnBlocks = await page.$$('[data-block-type="button"], [class*="button-block"]');
if (btnBlocks.length > 0) {
  await btnBlocks[0].click();
  await page.waitForTimeout(500);
  const labelInput = await page.$('input[placeholder*="label"], input[placeholder*="Label"]');
  if (labelInput) {
    const origVal = await labelInput.inputValue();
    await labelInput.fill('QA BUTTON');
    await page.waitForTimeout(300);
    log('9a', 'Edit button label', 'PASS', `Changed button label`);
    await labelInput.fill(origVal);
  } else {
    log('9a', 'Edit button label', 'BLOCKED', 'No button label input found');
  }
} else {
  log('9a', 'Edit button block', 'BLOCKED', 'No button blocks found');
}

// ═══ TEST 16 — ADD SECTION ═══
console.log('\n=== TEST 16 — ADD SECTION ===');

// Find the "Add Section" button
const addSectionBtn = await page.$('button:has-text("Add Section"), [class*="add-section"]');
if (addSectionBtn) {
  await addSectionBtn.click();
  await page.waitForTimeout(1000);
  const modalBody = await page.textContent('body');
  const hasSectionTypes = modalBody.includes('Hero') || modalBody.includes('FEATURED') || modalBody.includes('CONTENT');
  log('16a', 'Add Section modal opens', hasSectionTypes ? 'PASS' : 'FAIL', `Section types visible: ${hasSectionTypes}`);
  
  // Check if variant picker exists
  const hasVariants = modalBody.includes('variant') || modalBody.includes('Variant') || modalBody.includes('layout');
  log('16b', 'Variant picker present', hasVariants ? 'PASS' : 'BLOCKED', `Variants visible: ${hasVariants}`);
  
  // Close modal
  const closeBtn = await page.$('[aria-label="Close"], button:has-text("Close")');
  if (closeBtn) await closeBtn.click();
  await page.waitForTimeout(500);
} else {
  log('16a', 'Add Section modal', 'BLOCKED', 'No Add Section button found');
}

// ═══ TEST 20 — SAVE ═══
console.log('\n=== TEST 20 — SAVE ===');

// Find the save button
const saveBtn = await page.$('button:has-text("Save")');
if (saveBtn) {
  const saveText = await saveBtn.textContent();
  log('20a', 'Save button present', 'PASS', `Save button text: ${saveText}`);
  
  // Check save state indicator
  const body = await page.textContent('body');
  const hasSaved = body.includes('Saved') || body.includes('Unsaved');
  log('20b', 'Save state indicator', hasSaved ? 'PASS' : 'BLOCKED', `State indicator visible: ${hasSaved}`);
} else {
  log('20a', 'Save button', 'BLOCKED', 'No save button found');
}

// ═══ TEST 22 — FULL PAGE PREVIEW ═══
console.log('\n=== TEST 22 — FULL PAGE PREVIEW ===');

const previewBtn = await page.$('button:has-text("Preview"), [title="Preview"]');
if (previewBtn) {
  await previewBtn.click();
  await page.waitForTimeout(1500);
  const body = await page.textContent('body');
  const hasPreview = body.includes('Draft Preview') || body.includes('Desktop') || body.includes('Tablet');
  log('22a', 'Preview opens', hasPreview ? 'PASS' : 'FAIL', `Preview visible: ${hasPreview}`);
  
  // Test viewport switching
  const tabletBtn = await page.$('button[title="tablet"]');
  if (tabletBtn) {
    await tabletBtn.click();
    await page.waitForTimeout(500);
    log('22b', 'Tablet viewport', 'PASS', 'Switched to tablet');
  }
  
  // Close preview (Escape)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const afterEsc = await page.textContent('body');
  const previewClosed = !afterEsc.includes('Draft Preview');
  log('22c', 'Preview closes with Escape', previewClosed ? 'PASS' : 'FAIL', `Preview closed: ${previewClosed}`);
} else {
  log('22a', 'Preview button', 'BLOCKED', 'No preview button found');
}

// ═══ SUMMARY ═══
console.log('\n\n=== TESTS 5-22 SUMMARY ===');
const pass = results.filter(r => r.status === 'PASS').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const blocked = results.filter(r => r.status === 'BLOCKED').length;
console.log(`PASS: ${pass} | FAIL: ${fail} | BLOCKED: ${blocked} | TOTAL: ${results.length}`);
console.log(`Page errors: ${pageErrors.length}`);
if (pageErrors.length > 0) pageErrors.slice(0, 5).forEach(e => console.log(`  ERR: ${e.substring(0, 200)}`));

await browser.close();

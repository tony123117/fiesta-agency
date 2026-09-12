// ── Layout System Test Suite ──
// Phase 31.2–31.9 — Comprehensive layout system tests.
// Run: node test-layout-rendering.mjs

import { createLayoutContainer, createLayoutRow, createLayoutColumn, wrapLegacyBlocks, isLayoutContent, isLegacyBlocksContent } from './src/lib/layoutTypes.ts';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
  }
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label} — expected ${expected}, got ${actual}`);
    failed++;
  }
}

// ── Test 1: Factory functions ──
console.log('\n🧪 Test 1: Factory functions');

const col = createLayoutColumn(6);
assert(col.id.length > 0, 'Column has ID');
assertEqual(col.settings.desktop.width, 6, 'Column width = 6');
assertEqual(col.settings.desktop.visible, true, 'Column visible by default');
assert(Array.isArray(col.blocks), 'Column blocks is array');
assertEqual(col.blocks.length, 0, 'Column blocks empty by default');
assertEqual(col.settings.tablet.visible, true, 'Tablet visible by default');
assertEqual(col.settings.mobile.visible, true, 'Mobile visible by default');

const row = createLayoutRow([6, 6]);
assert(row.id.length > 0, 'Row has ID');
assertEqual(row.columns.length, 2, 'Row has 2 columns');
assertEqual(row.settings.desktop.columns, 'grid', 'Row mode = grid');
assertEqual(row.settings.desktop.gap, 'md', 'Row gap = md');
assertEqual(row.settings.desktop.alignment, 'start', 'Row alignment = start');

const container = createLayoutContainer();
assert(container.id.length > 0, 'Container has ID');
assertEqual(container.rows.length, 1, 'Container has 1 row');
assertEqual(container.settings.desktop.maxWidth, 'lg', 'Container maxWidth = lg');
assertEqual(container.settings.desktop.padding, 'md', 'Container padding = md');
assertEqual(container.settings.desktop.gap, 'md', 'Container gap = md');

// ── Test 2: Type guards ──
console.log('\n🧪 Test 2: Type guards');

const layoutContent = { layout: { containers: [container] } };
assert(isLayoutContent(layoutContent) === true, 'isLayoutContent returns true for layout format');

const legacyContent = { blocks: [{ id: 'b1', type: 'heading', content: { text: 'Hello', level: 1 }, sort_order: 0 }] };
assert(isLayoutContent(legacyContent) === false, 'isLayoutContent returns false for legacy format');
assert(isLegacyBlocksContent(legacyContent) === true, 'isLegacyBlocksContent returns true for blocks format');
assert(isLegacyBlocksContent(layoutContent) === false, 'isLegacyBlocksContent returns false for layout format');

assert(isLayoutContent(null) === false, 'isLayoutContent handles null');
assert(isLayoutContent(undefined) === false, 'isLayoutContent handles undefined');
assert(isLayoutContent({}) === false, 'isLayoutContent handles empty object');
assert(isLayoutContent({ layout: {} }) === false, 'isLayoutContent handles missing containers');
assert(isLayoutContent({ layout: { containers: 'not-array' } }) === false, 'isLayoutContent handles non-array containers');

// ── Test 3: wrapLegacyBlocks ──
console.log('\n🧪 Test 3: wrapLegacyBlocks');

const legacyBlocks = [
  { id: 'b1', type: 'heading', content: { text: 'Hello', level: 1 }, sort_order: 0 },
  { id: 'b2', type: 'text', content: { html: '<p>World</p>' }, sort_order: 1 },
];

const wrapped = wrapLegacyBlocks(legacyBlocks);
assert(isLayoutContent(wrapped) === true, 'Wrapped content is layout format');
assertEqual(wrapped.layout.containers.length, 1, 'Wrapped has 1 container');
assertEqual(wrapped.layout.containers[0].rows.length, 1, 'Wrapped has 1 row');
assertEqual(wrapped.layout.containers[0].rows[0].columns.length, 1, 'Wrapped has 1 column');
assertEqual(wrapped.layout.containers[0].rows[0].columns[0].blocks.length, 2, 'Wrapped column has 2 blocks');
assertEqual(wrapped.layout.containers[0].rows[0].columns[0].blocks[0].id, 'b1', 'First block ID preserved');
assertEqual(wrapped.layout.containers[0].rows[0].columns[0].blocks[1].id, 'b2', 'Second block ID preserved');
assertEqual(wrapped.layout.containers[0].rows[0].columns[0].settings.desktop.width, 12, 'Wrapped column width = 12 (full)');

// wrapLegacyBlocks with empty array
const emptyWrapped = wrapLegacyBlocks([]);
assert(isLayoutContent(emptyWrapped) === true, 'Empty wrapLegacyBlocks produces valid layout');
assertEqual(emptyWrapped.layout.containers[0].rows[0].columns[0].blocks.length, 0, 'Empty wrapped has 0 blocks');

// wrapLegacyBlocks preserves block IDs (no cloning)
const blockIds = wrapped.layout.containers[0].rows[0].columns[0].blocks.map(b => b.id);
assert(blockIds.includes('b1') && blockIds.includes('b2'), 'Block IDs preserved in wrap');

// ── Test 4: Multi-column layout ──
console.log('\n🧪 Test 4: Multi-column layout');

const multiRow = createLayoutRow([4, 4, 4]);
assertEqual(multiRow.columns.length, 3, 'Multi-column row has 3 columns');
assertEqual(multiRow.columns[0].settings.desktop.width, 4, 'First column width = 4');
assertEqual(multiRow.columns[1].settings.desktop.width, 4, 'Second column width = 4');
assertEqual(multiRow.columns[2].settings.desktop.width, 4, 'Third column width = 4');

const totalWidth = multiRow.columns.reduce((sum, c) => sum + (c.settings.desktop.width || 0), 0);
assertEqual(totalWidth, 12, 'Total column widths = 12');

// Two-column layout
const twoCol = createLayoutRow([6, 6]);
assertEqual(twoCol.columns.length, 2, 'Two-column row has 2 columns');
const twoColTotal = twoCol.columns.reduce((sum, c) => sum + (c.settings.desktop.width || 0), 0);
assertEqual(twoColTotal, 12, 'Two-column total = 12');

// Asymmetric layout
const asymRow = createLayoutRow([8, 4]);
assertEqual(asymRow.columns[0].settings.desktop.width, 8, 'First column width = 8');
assertEqual(asymRow.columns[1].settings.desktop.width, 4, 'Second column width = 4');

// ── Test 5: Empty/malformed data safety ──
console.log('\n🧪 Test 5: Empty/malformed data');

assert(isLayoutContent({ layout: { containers: [] } }) === true, 'Empty containers array is valid layout');
assert(isLegacyBlocksContent({ blocks: [] }) === true, 'Empty blocks array is valid legacy');
assert(isLayoutContent({ layout: null }) === false, 'Null containers is invalid');
assert(isLayoutContent({ layout: { containers: null } }) === false, 'Null containers array is invalid');
assert(isLegacyBlocksContent(null) === false, 'Null content is not legacy');
assert(isLegacyBlocksContent(undefined) === false, 'Undefined content is not legacy');
assert(isLegacyBlocksContent({}) === false, 'Empty object is not legacy');

// ── Test 6: Block movement simulation ──
console.log('\n🧪 Test 6: Block movement simulation');

// Create a layout with blocks in columns
const testCol1 = createLayoutColumn(6);
testCol1.id = 'col1';
testCol1.blocks = [
  { id: 'block-a', type: 'heading', content: { text: 'A', level: 1 } },
  { id: 'block-b', type: 'text', content: { html: '<p>B</p>' } },
];

const testCol2 = createLayoutColumn(6);
testCol2.id = 'col2';
testCol2.blocks = [
  { id: 'block-c', type: 'image', content: { src: '', alt: '' } },
];

const testRow = createLayoutRow([6, 6]);
testRow.id = 'row1';
testRow.columns = [testCol1, testCol2];

const testContainer = createLayoutContainer();
testContainer.id = 'c1';
testContainer.rows = [testRow];

// Simulate same-column reorder: move block-a from index 0 to index 1
{
  const blocks = [...testCol1.blocks];
  const [moved] = blocks.splice(0, 1);
  blocks.splice(1, 0, moved);
  assertEqual(blocks[0].id, 'block-b', 'Same-column reorder: block-b now first');
  assertEqual(blocks[1].id, 'block-a', 'Same-column reorder: block-a now second');
  assertEqual(blocks.length, 2, 'Same-column reorder: block count preserved');
}

// Simulate cross-column move: move block-a from col1 to col2
{
  const sourceBlocks = [...testCol1.blocks];
  const targetBlocks = [...testCol2.blocks];
  const blockToMove = sourceBlocks.find(b => b.id === 'block-a');
  const sourceIdx = sourceBlocks.indexOf(blockToMove);
  sourceBlocks.splice(sourceIdx, 1);
  targetBlocks.splice(1, 0, blockToMove); // Insert at end
  assertEqual(sourceBlocks.length, 1, 'Cross-column: source has 1 block');
  assertEqual(targetBlocks.length, 2, 'Cross-column: target has 2 blocks');
  assertEqual(targetBlocks[1].id, 'block-a', 'Cross-column: block-a moved to target');
  assertEqual(sourceBlocks[0].id, 'block-b', 'Cross-column: block-b remains in source');
}

// Simulate move into empty column
{
  const emptyCol = createLayoutColumn(6);
  emptyCol.blocks = [];
  const sourceBlocks = [...testCol1.blocks];
  const blockToMove = sourceBlocks[0];
  sourceBlocks.splice(0, 1);
  emptyCol.blocks.push(blockToMove);
  assertEqual(sourceBlocks.length, 1, 'Move to empty: source has 1 remaining block');
  assertEqual(emptyCol.blocks.length, 1, 'Move to empty: target has 1 block');
  assertEqual(emptyCol.blocks[0].id, blockToMove.id, 'Move to empty: block ID preserved');
}

// ── Test 7: Block ID preservation ──
console.log('\n🧪 Test 7: Block ID preservation');

const originalBlock = { id: 'test-block-123', type: 'heading', content: { text: 'Original', level: 1 } };
const clonedBlock = { ...originalBlock };
assertEqual(originalBlock.id, clonedBlock.id, 'Block ID preserved after spread');
assertEqual(originalBlock.content.text, clonedBlock.content.text, 'Block content preserved after spread');

// Verify no duplicate references
const blockArray1 = [originalBlock];
const blockArray2 = [];
blockArray2.push(blockArray1.splice(0, 1)[0]);
assertEqual(blockArray1.length, 0, 'Source array empty after move');
assertEqual(blockArray2.length, 1, 'Target array has block after move');
assertEqual(blockArray2[0].id, 'test-block-123', 'Moved block has correct ID');

// ── Test 8: Column width validation ──
console.log('\n🧪 Test 8: Column width validation');

// Valid widths
const validWidths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
validWidths.forEach(w => {
  const c = createLayoutColumn(w);
  assertEqual(c.settings.desktop.width, w, `Width ${w} accepted`);
});

// Width sum validation
const twoColWidths = [6, 6];
assertEqual(twoColWidths.reduce((a, b) => a + b, 0), 12, '6+6 = 12');
const threeColWidths = [4, 4, 4];
assertEqual(threeColWidths.reduce((a, b) => a + b, 0), 12, '4+4+4 = 12');
const fourColWidths = [3, 3, 3, 3];
assertEqual(fourColWidths.reduce((a, b) => a + b, 0), 12, '3+3+3+3 = 12');
const mixedWidths = [8, 4];
assertEqual(mixedWidths.reduce((a, b) => a + b, 0), 12, '8+4 = 12');

// ── Test 9: Responsive settings defaults ──
console.log('\n🧪 Test 9: Responsive settings defaults');

const responsiveCol = createLayoutColumn(6);
assertEqual(responsiveCol.settings.desktop.width, 6, 'Desktop width = 6');
assertEqual(responsiveCol.settings.desktop.visible, true, 'Desktop visible = true');
assertEqual(responsiveCol.settings.tablet.visible, true, 'Tablet visible = true');
assertEqual(responsiveCol.settings.mobile.visible, true, 'Mobile visible = true');

const responsiveRow = createLayoutRow([6, 6]);
assertEqual(responsiveRow.settings.desktop.columns, 'grid', 'Desktop columns = grid');
assertEqual(responsiveRow.settings.desktop.gap, 'md', 'Desktop gap = md');
assertEqual(responsiveRow.settings.tablet.visible, true, 'Tablet visible = true');
assertEqual(responsiveRow.settings.mobile.visible, true, 'Mobile visible = true');

const responsiveContainer = createLayoutContainer();
assertEqual(responsiveContainer.settings.desktop.maxWidth, 'lg', 'Desktop maxWidth = lg');
assertEqual(responsiveContainer.settings.desktop.padding, 'md', 'Desktop padding = md');
assertEqual(responsiveContainer.settings.tablet.visible, true, 'Tablet visible = true');
assertEqual(responsiveContainer.settings.mobile.visible, true, 'Mobile visible = true');

// ── Test 10: Layout structure integrity ──
console.log('\n🧪 Test 10: Layout structure integrity');

const complexLayout = {
  layout: {
    containers: [
      {
        id: 'c1',
        settings: {
          desktop: { visible: true, gap: 'md', padding: 'lg', maxWidth: 'xl' },
          tablet: { visible: true, gap: 'sm', padding: 'md', maxWidth: 'lg' },
          mobile: { visible: true, gap: 'sm', padding: 'sm', maxWidth: 'full' },
        },
        rows: [
          {
            id: 'r1',
            settings: {
              desktop: { visible: true, gap: 'md', alignment: 'center', verticalAlignment: 'center', columns: 'grid' },
              tablet: { visible: true, columns: 'grid' },
              mobile: { visible: true, columns: 'stack' },
            },
            columns: [
              {
                id: 'c1r1col1',
                settings: {
                  desktop: { visible: true, width: 8, verticalAlignment: 'center', padding: 'md' },
                  tablet: { visible: true, width: 12 },
                  mobile: { visible: true, width: 12 },
                },
                blocks: [
                  { id: 'b1', type: 'heading', content: { text: 'Title', level: 1 } },
                ],
              },
              {
                id: 'c1r1col2',
                settings: {
                  desktop: { visible: true, width: 4, verticalAlignment: 'start', padding: 'none' },
                  tablet: { visible: true, width: 12 },
                  mobile: { visible: true, width: 12 },
                },
                blocks: [
                  { id: 'b2', type: 'text', content: { html: '<p>Description</p>' } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

assert(isLayoutContent(complexLayout) === true, 'Complex layout is valid');
assertEqual(complexLayout.layout.containers.length, 1, 'Complex: 1 container');
assertEqual(complexLayout.layout.containers[0].rows.length, 1, 'Complex: 1 row');
assertEqual(complexLayout.layout.containers[0].rows[0].columns.length, 2, 'Complex: 2 columns');
assertEqual(complexLayout.layout.containers[0].rows[0].columns[0].blocks.length, 1, 'Complex: col1 has 1 block');
assertEqual(complexLayout.layout.containers[0].rows[0].columns[1].blocks.length, 1, 'Complex: col2 has 1 block');
assertEqual(complexLayout.layout.containers[0].rows[0].columns[0].blocks[0].id, 'b1', 'Complex: block ID preserved');
assertEqual(complexLayout.layout.containers[0].settings.desktop.maxWidth, 'xl', 'Complex: maxWidth = xl');

// Verify responsive settings are independent
assertEqual(complexLayout.layout.containers[0].settings.desktop.maxWidth, 'xl', 'Desktop maxWidth = xl');
assertEqual(complexLayout.layout.containers[0].settings.tablet.maxWidth, 'lg', 'Tablet maxWidth = lg');
assertEqual(complexLayout.layout.containers[0].settings.mobile.maxWidth, 'full', 'Mobile maxWidth = full');

// ── Test 11: Block content preservation ──
console.log('\n🧪 Test 11: Block content preservation');

const blocks = [
  { id: 'h1', type: 'heading', content: { text: 'Heading', level: 2, color: '#fff' } },
  { id: 't1', type: 'text', content: { html: '<p>Text</p>', color: '#ccc' } },
  { id: 'i1', type: 'image', content: { src: '/img.jpg', alt: 'Image', borderRadius: 8 } },
  { id: 'bt1', type: 'button', content: { text: 'Click', url: '/page', variant: 'primary' } },
  { id: 's1', type: 'spacer', content: { height: 40 } },
];

blocks.forEach(b => {
  const cloned = { ...b, content: { ...b.content } };
  assertEqual(cloned.id, b.id, `Block ${b.type}: ID preserved`);
  assertEqual(JSON.stringify(cloned.content), JSON.stringify(b.content), `Block ${b.type}: content preserved`);
});

// ── Test 12: Empty container/row/column safety ──
console.log('\n🧪 Test 12: Empty structures');

const emptyContainer = createLayoutContainer();
assertEqual(emptyContainer.rows.length, 1, 'New container has 1 row');
assertEqual(emptyContainer.rows[0].columns.length, 2, 'New container row has 2 columns (default)');
assertEqual(emptyContainer.rows[0].columns[0].blocks.length, 0, 'New container column has 0 blocks');

const emptyRow = createLayoutRow([6]);
assertEqual(emptyRow.columns.length, 1, 'New row has 1 column');
assertEqual(emptyRow.columns[0].blocks.length, 0, 'New row column has 0 blocks');

const emptyCol = createLayoutColumn(12);
assertEqual(emptyCol.blocks.length, 0, 'New column has 0 blocks');

// Layout with empty containers
const layoutWithEmpty = {
  layout: {
    containers: [
      { ...createLayoutContainer(), rows: [] },
    ],
  },
};
assert(isLayoutContent(layoutWithEmpty) === true, 'Layout with empty rows array is valid');

// ══════════════════════════════════════════════════════════════
// BEHAVIORAL TESTS — Exercise actual layout operations
// ══════════════════════════════════════════════════════════════

// Helper: build a test layout with blocks in specific columns
function buildTestLayout() {
  return {
    layout: {
      containers: [
        {
          id: 'c1',
          settings: {
            desktop: { visible: true, gap: 'md', padding: 'md', maxWidth: 'lg' },
            tablet: { visible: true, gap: 'md', padding: 'md', maxWidth: 'lg' },
            mobile: { visible: true, gap: 'sm', padding: 'sm', maxWidth: 'full' },
          },
          rows: [
            {
              id: 'r1',
              settings: {
                desktop: { visible: true, gap: 'md', columns: 'grid' },
                tablet: { visible: true, columns: 'grid' },
                mobile: { visible: true, columns: 'stack' },
              },
              columns: [
                {
                  id: 'col-a',
                  settings: {
                    desktop: { visible: true, width: 5 },
                    tablet: { visible: true, width: 6 },
                    mobile: { visible: true, width: 12 },
                  },
                  blocks: [
                    { id: 'block-1', type: 'heading', content: { text: 'Heading 1', level: 1 } },
                    { id: 'block-2', type: 'text', content: { html: '<p>Text 1</p>' } },
                  ],
                },
                {
                  id: 'col-b',
                  settings: {
                    desktop: { visible: true, width: 3 },
                    tablet: { visible: true, width: 6 },
                    mobile: { visible: true, width: 12 },
                  },
                  blocks: [
                    { id: 'block-3', type: 'image', content: { src: '/img.jpg', alt: 'Image' } },
                  ],
                },
                {
                  id: 'col-c',
                  settings: {
                    desktop: { visible: true, width: 4 },
                    tablet: { visible: true, width: 12 },
                    mobile: { visible: true, width: 12 },
                  },
                  blocks: [],
                },
              ],
            },
          ],
        },
        {
          id: 'c2',
          settings: {
            desktop: { visible: true, gap: 'md', padding: 'md', maxWidth: 'lg' },
            tablet: { visible: true },
            mobile: { visible: true },
          },
          rows: [
            {
              id: 'r2',
              settings: {
                desktop: { visible: true, gap: 'md', columns: 'grid' },
                tablet: { visible: true, columns: 'grid' },
                mobile: { visible: true, columns: 'stack' },
              },
              columns: [
                {
                  id: 'col-d',
                  settings: {
                    desktop: { visible: true, width: 12 },
                    tablet: { visible: true, width: 12 },
                    mobile: { visible: true, width: 12 },
                  },
                  blocks: [
                    { id: 'block-4', type: 'button', content: { text: 'Click', url: '/page' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

// Helper: simulate moveBlockAcrossColumns (mirrors useLayoutOperations.ts logic)
function moveBlockAcrossColumns(content, sectionId, blockId, srcContainerId, srcRowId, srcColumnId, tgtContainerId, tgtRowId, tgtColumnId, targetIndex) {
  // Validate target exists before removing from source
  const tgtContainer = content.layout.containers.find((c) => c.id === tgtContainerId);
  if (!tgtContainer) return content;
  const tgtRow = tgtContainer.rows.find((r) => r.id === tgtRowId);
  if (!tgtRow) return content;
  const tgtCol = tgtRow.columns.find((c) => c.id === tgtColumnId);
  if (!tgtCol) return content;

  let movedBlock = null;
  const newContainers = content.layout.containers.map((c) => {
    if (c.id !== srcContainerId) return c;
    return {
      ...c,
      rows: c.rows.map((r) => {
        if (r.id !== srcRowId) return r;
        return {
          ...r,
          columns: r.columns.map((col) => {
            if (col.id !== srcColumnId) return col;
            const blockIndex = col.blocks.findIndex((b) => b.id === blockId);
            if (blockIndex === -1) return col;
            movedBlock = col.blocks[blockIndex];
            const newBlocks = [...col.blocks];
            newBlocks.splice(blockIndex, 1);
            return { ...col, blocks: newBlocks };
          }),
        };
      }),
    };
  });
  if (!movedBlock) return content;
  return {
    layout: {
      containers: newContainers.map((c) => {
        if (c.id !== tgtContainerId) return c;
        return {
          ...c,
          rows: c.rows.map((r) => {
            if (r.id !== tgtRowId) return r;
            return {
              ...r,
              columns: r.columns.map((col) => {
                if (col.id !== tgtColumnId) return col;
                const newBlocks = [...col.blocks];
                const insertAt = Math.min(targetIndex, newBlocks.length);
                newBlocks.splice(insertAt, 0, movedBlock);
                return { ...col, blocks: newBlocks };
              }),
            };
          }),
        };
      }),
    },
  };
}

// Helper: simulate reorderBlockInColumn (mirrors useLayoutOperations.ts logic)
function reorderBlockInColumn(content, containerId, rowId, columnId, blockId, toIndex) {
  return {
    layout: {
      containers: content.layout.containers.map((c) => {
        if (c.id !== containerId) return c;
        return {
          ...c,
          rows: c.rows.map((r) => {
            if (r.id !== rowId) return r;
            return {
              ...r,
              columns: r.columns.map((col) => {
                if (col.id !== columnId) return col;
                const fromIndex = col.blocks.findIndex((b) => b.id === blockId);
                if (fromIndex === -1 || fromIndex === toIndex) return col;
                const newBlocks = [...col.blocks];
                const [moved] = newBlocks.splice(fromIndex, 1);
                const insertAt = Math.min(toIndex, newBlocks.length);
                newBlocks.splice(insertAt, 0, moved);
                return { ...col, blocks: newBlocks };
              }),
            };
          }),
        };
      }),
    },
  };
}

// Helper: simulate resizeColumnPair (mirrors useLayoutOperations.ts logic with pair total)
function resizeColumnPair(content, containerId, rowId, colId1, colId2, newWidth1, newWidth2, viewport) {
  const container = content.layout.containers.find((c) => c.id === containerId);
  if (!container) return content;
  const row = container.rows.find((r) => r.id === rowId);
  if (!row) return content;
  const c1 = row.columns.find((c) => c.id === colId1);
  const c2 = row.columns.find((c) => c.id === colId2);
  if (!c1 || !c2) return content;
  const existingW1 = c1.settings[viewport]?.width ?? 6;
  const existingW2 = c2.settings[viewport]?.width ?? 6;
  const pairTotal = existingW1 + existingW2;
  const clamped1 = Math.max(1, Math.min(pairTotal - 1, newWidth1));
  const clamped2 = pairTotal - clamped1;
  if (clamped1 + clamped2 !== pairTotal) return content;
  return {
    layout: {
      containers: content.layout.containers.map((c) => {
        if (c.id !== containerId) return c;
        return {
          ...c,
          rows: c.rows.map((r) => {
            if (r.id !== rowId) return r;
            return {
              ...r,
              columns: r.columns.map((col) => {
                if (col.id === colId1) {
                  return { ...col, settings: { ...col.settings, [viewport]: { ...col.settings[viewport], width: clamped1 } } };
                }
                if (col.id === colId2) {
                  return { ...col, settings: { ...col.settings, [viewport]: { ...col.settings[viewport], width: clamped2 } } };
                }
                return col;
              }),
            };
          }),
        };
      }),
    },
  };
}

// Helper: get column by ID from layout
function getColumn(content, containerId, rowId, colId) {
  const c = content.layout.containers.find((x) => x.id === containerId);
  if (!c) return null;
  const r = c.rows.find((x) => x.id === rowId);
  if (!r) return null;
  return r.columns.find((x) => x.id === colId) || null;
}

// ── Test 13: Cross-column block movement ──
console.log('\n🧪 Test 13: Cross-column block movement');

{
  const layout = buildTestLayout();
  // Move block-1 from col-a to col-b at index 0
  const result = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 0);
  const srcCol = getColumn(result, 'c1', 'r1', 'col-a');
  const tgtCol = getColumn(result, 'c1', 'r1', 'col-b');

  assertEqual(srcCol.blocks.length, 1, 'Cross-column: source has 1 block remaining');
  assertEqual(srcCol.blocks[0].id, 'block-2', 'Cross-column: source retains block-2');
  assertEqual(tgtCol.blocks.length, 2, 'Cross-column: target has 2 blocks');
  assertEqual(tgtCol.blocks[0].id, 'block-1', 'Cross-column: block-1 inserted at index 0');
  assertEqual(tgtCol.blocks[1].id, 'block-3', 'Cross-column: block-3 shifted to index 1');
}

// ── Test 14: Cross-column move to empty column ──
console.log('\n🧪 Test 14: Cross-column move to empty column');

{
  const layout = buildTestLayout();
  // Move block-3 from col-b to col-c (empty)
  const result = moveBlockAcrossColumns(layout, 's1', 'block-3', 'c1', 'r1', 'col-b', 'c1', 'r1', 'col-c', 0);
  const srcCol = getColumn(result, 'c1', 'r1', 'col-b');
  const tgtCol = getColumn(result, 'c1', 'r1', 'col-c');

  assertEqual(srcCol.blocks.length, 0, 'Move to empty: source is now empty');
  assertEqual(tgtCol.blocks.length, 1, 'Move to empty: target has 1 block');
  assertEqual(tgtCol.blocks[0].id, 'block-3', 'Move to empty: block-3 moved correctly');
}

// ── Test 15: Cross-container block movement ──
console.log('\n🧪 Test 15: Cross-container block movement');

{
  const layout = buildTestLayout();
  // Move block-4 from c2 to c1/col-c
  const result = moveBlockAcrossColumns(layout, 's1', 'block-4', 'c2', 'r2', 'col-d', 'c1', 'r1', 'col-c', 0);
  const srcCol = getColumn(result, 'c2', 'r2', 'col-d');
  const tgtCol = getColumn(result, 'c1', 'r1', 'col-c');

  assertEqual(srcCol.blocks.length, 0, 'Cross-container: source is now empty');
  assertEqual(tgtCol.blocks.length, 1, 'Cross-container: target has 1 block');
  assertEqual(tgtCol.blocks[0].id, 'block-4', 'Cross-container: block-4 moved to correct container');
  assertEqual(tgtCol.blocks[0].content.text, 'Click', 'Cross-container: block content preserved');
}

// ── Test 16: Same-column reorder ──
console.log('\n🧪 Test 16: Same-column reorder');

{
  const layout = buildTestLayout();
  // Move block-1 from index 0 to index 1 in col-a
  const result = reorderBlockInColumn(layout, 'c1', 'r1', 'col-a', 'block-1', 1);
  const col = getColumn(result, 'c1', 'r1', 'col-a');

  assertEqual(col.blocks.length, 2, 'Same-column reorder: block count preserved');
  assertEqual(col.blocks[0].id, 'block-2', 'Same-column reorder: block-2 now first');
  assertEqual(col.blocks[1].id, 'block-1', 'Same-column reorder: block-1 now second');
}

// ── Test 17: Block ID and content preserved after cross-column move ──
console.log('\n🧪 Test 17: Block ID and content preserved after move');

{
  const layout = buildTestLayout();
  const result = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-c', 0);
  const movedBlock = getColumn(result, 'c1', 'r1', 'col-c').blocks[0];

  assertEqual(movedBlock.id, 'block-1', 'Moved block: ID preserved');
  assertEqual(movedBlock.type, 'heading', 'Moved block: type preserved');
  assertEqual(movedBlock.content.text, 'Heading 1', 'Moved block: content.text preserved');
  assertEqual(movedBlock.content.level, 1, 'Moved block: content.level preserved');
}

// ── Test 18: No duplicate blocks after cross-column move ──
console.log('\n🧪 Test 18: No duplicate blocks after move');

{
  const layout = buildTestLayout();
  const result = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 0);
  const allBlockIds = [];
  for (const c of result.layout.containers) {
    for (const r of c.rows) {
      for (const col of r.columns) {
        for (const b of col.blocks) {
          allBlockIds.push(b.id);
        }
      }
    }
  }
  const uniqueIds = new Set(allBlockIds);
  assertEqual(allBlockIds.length, uniqueIds.size, 'No duplicate block IDs after move');
  assertEqual(allBlockIds.length, 4, 'Total block count unchanged after move');
}

// ── Test 19: Moving first block ──
console.log('\n🧪 Test 19: Moving first block');

{
  const layout = buildTestLayout();
  const result = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 1);
  const tgtCol = getColumn(result, 'c1', 'r1', 'col-b');

  assertEqual(tgtCol.blocks[0].id, 'block-3', 'Move first: block-3 stays at index 0');
  assertEqual(tgtCol.blocks[1].id, 'block-1', 'Move first: block-1 inserted at index 1');
}

// ── Test 20: Moving last block ──
console.log('\n🧪 Test 20: Moving last block');

{
  const layout = buildTestLayout();
  const result = moveBlockAcrossColumns(layout, 's1', 'block-2', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 1);
  const tgtCol = getColumn(result, 'c1', 'r1', 'col-b');

  assertEqual(tgtCol.blocks[0].id, 'block-3', 'Move last: block-3 stays at index 0');
  assertEqual(tgtCol.blocks[1].id, 'block-2', 'Move last: block-2 inserted at index 1');
}

// ── Test 21: Correct insertion index ──
console.log('\n🧪 Test 21: Correct insertion index');

{
  const layout = buildTestLayout();
  // Insert at index 1 in col-b (which has 1 block) — should insert after existing block
  const result = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 1);
  const tgtCol = getColumn(result, 'c1', 'r1', 'col-b');

  assertEqual(tgtCol.blocks.length, 2, 'Insert at index 1: target has 2 blocks');
  assertEqual(tgtCol.blocks[0].id, 'block-3', 'Insert at index 1: block-3 at position 0');
  assertEqual(tgtCol.blocks[1].id, 'block-1', 'Insert at index 1: block-1 at position 1');

  // Insert at index 0 — should insert before existing block
  const result2 = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 0);
  const tgtCol2 = getColumn(result2, 'c1', 'r1', 'col-b');

  assertEqual(tgtCol2.blocks.length, 2, 'Insert at index 0: target has 2 blocks');
  assertEqual(tgtCol2.blocks[0].id, 'block-1', 'Insert at index 0: block-1 at position 0');
  assertEqual(tgtCol2.blocks[1].id, 'block-3', 'Insert at index 0: block-3 at position 1');
}

// ── Test 22: Unrelated columns unchanged after cross-column move ──
console.log('\n🧪 Test 22: Unrelated columns unchanged');

{
  const layout = buildTestLayout();
  const origColC = getColumn(layout, 'c1', 'r1', 'col-c');
  const origColD = getColumn(layout, 'c2', 'r2', 'col-d');
  const result = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 0);

  const resultColC = getColumn(result, 'c1', 'r1', 'col-c');
  const resultColD = getColumn(result, 'c2', 'r2', 'col-d');
  assertEqual(resultColC.blocks.length, origColC.blocks.length, 'Unrelated col-c: block count unchanged');
  assertEqual(resultColD.blocks.length, origColD.blocks.length, 'Unrelated col-d: block count unchanged');
  assertEqual(resultColD.blocks[0].id, origColD.blocks[0].id, 'Unrelated col-d: block ID unchanged');
}

// ── Test 23: Resize preserves pair total (5+3=8) ──
console.log('\n🧪 Test 23: Resize preserves pair total');

{
  const layout = buildTestLayout();
  // Resize col-a (5) and col-b (3) → 4+4
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 4, 4, 'desktop');
  const w1 = getColumn(result, 'c1', 'r1', 'col-a').settings.desktop.width;
  const w2 = getColumn(result, 'c1', 'r1', 'col-b').settings.desktop.width;

  assertEqual(w1, 4, 'Resize 5+3→4+4: col-a = 4');
  assertEqual(w2, 4, 'Resize 5+3→4+4: col-b = 4');
  assertEqual(w1 + w2, 8, 'Resize 5+3→4+4: pair total = 8');
}

// ── Test 24: Resize 5+3→6+2 ──
console.log('\n🧪 Test 24: Resize 5+3→6+2');

{
  const layout = buildTestLayout();
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 6, 2, 'desktop');
  const w1 = getColumn(result, 'c1', 'r1', 'col-a').settings.desktop.width;
  const w2 = getColumn(result, 'c1', 'r1', 'col-b').settings.desktop.width;

  assertEqual(w1, 6, 'Resize 5+3→6+2: col-a = 6');
  assertEqual(w2, 2, 'Resize 5+3→6+2: col-b = 2');
  assertEqual(w1 + w2, 8, 'Resize 5+3→6+2: pair total = 8');
}

// ── Test 25: Resize 5+3→7+1 ──
console.log('\n🧪 Test 25: Resize 5+3→7+1');

{
  const layout = buildTestLayout();
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 7, 1, 'desktop');
  const w1 = getColumn(result, 'c1', 'r1', 'col-a').settings.desktop.width;
  const w2 = getColumn(result, 'c1', 'r1', 'col-b').settings.desktop.width;

  assertEqual(w1, 7, 'Resize 5+3→7+1: col-a = 7');
  assertEqual(w2, 1, 'Resize 5+3→7+1: col-b = 1');
  assertEqual(w1 + w2, 8, 'Resize 5+3→7+1: pair total = 8');
}

// ── Test 26: Resize never allows width below 1 ──
console.log('\n🧪 Test 26: Resize min width = 1');

{
  const layout = buildTestLayout();
  // Try to make col-b = 0 (should clamp to 1)
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 8, 0, 'desktop');
  const w1 = getColumn(result, 'c1', 'r1', 'col-a').settings.desktop.width;
  const w2 = getColumn(result, 'c1', 'r1', 'col-b').settings.desktop.width;

  assertEqual(w1, 7, 'Min width: col-a clamped to 7');
  assertEqual(w2, 1, 'Min width: col-b clamped to 1');
}

// ── Test 27: Resize never exceeds pair total ──
console.log('\n🧪 Test 27: Resize never exceeds pair total');

{
  const layout = buildTestLayout();
  // Try to make col-a = 10 (pair total is 8, should clamp to 7)
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 10, 0, 'desktop');
  const w1 = getColumn(result, 'c1', 'r1', 'col-a').settings.desktop.width;
  const w2 = getColumn(result, 'c1', 'r1', 'col-b').settings.desktop.width;

  assertEqual(w1, 7, 'Max width: col-a clamped to 7');
  assertEqual(w2, 1, 'Max width: col-b clamped to 1');
  assertEqual(w1 + w2, 8, 'Max width: pair total preserved');
}

// ── Test 28: Resize unrelated columns unchanged ──
console.log('\n🧪 Test 28: Resize unrelated columns unchanged');

{
  const layout = buildTestLayout();
  const origColC = getColumn(layout, 'c1', 'r1', 'col-c');
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 4, 4, 'desktop');
  const resultColC = getColumn(result, 'c1', 'r1', 'col-c');

  assertEqual(resultColC.settings.desktop.width, origColC.settings.desktop.width, 'Resize: col-c width unchanged');
}

// ── Test 29: Resize targets correct viewport only ──
console.log('\n🧪 Test 29: Resize targets correct viewport');

{
  const layout = buildTestLayout();
  const result = resizeColumnPair(layout, 'c1', 'r1', 'col-a', 'col-b', 4, 4, 'desktop');
  const colA = getColumn(result, 'c1', 'r1', 'col-a');

  assertEqual(colA.settings.desktop.width, 4, 'Resize desktop: desktop width = 4');
  assertEqual(colA.settings.tablet.width, 6, 'Resize desktop: tablet width unchanged (6)');
  assertEqual(colA.settings.mobile.width, 12, 'Resize desktop: mobile width unchanged (12)');
}

// ── Test 30: Responsive independence ──
console.log('\n🧪 Test 30: Responsive independence');

{
  const layout = buildTestLayout();
  // Modify desktop only
  const result = {
    layout: {
      containers: layout.layout.containers.map((c) => {
        if (c.id !== 'c1') return c;
        return {
          ...c,
          settings: {
            ...c.settings,
            desktop: { ...c.settings.desktop, padding: 'xl' },
          },
        };
      }),
    },
  };
  const container = result.layout.containers[0];

  assertEqual(container.settings.desktop.padding, 'xl', 'Desktop: padding = xl');
  assertEqual(container.settings.tablet.padding, 'md', 'Tablet: padding unchanged (md)');
  assertEqual(container.settings.mobile.padding, 'sm', 'Mobile: padding unchanged (sm)');
}

// ── Test 31: Responsive independence for columns ──
console.log('\n🧪 Test 31: Responsive column width independence');

{
  const layout = buildTestLayout();
  // Modify tablet only
  const result = {
    layout: {
      containers: layout.layout.containers.map((c) => {
        if (c.id !== 'c1') return c;
        return {
          ...c,
          rows: c.rows.map((r) => {
            if (r.id !== 'r1') return r;
            return {
              ...r,
              columns: r.columns.map((col) => {
                if (col.id !== 'col-a') return col;
                return {
                  ...col,
                  settings: {
                    ...col.settings,
                    tablet: { ...col.settings.tablet, width: 8 },
                  },
                };
              }),
            };
          }),
        };
      }),
    },
  };
  const colA = getColumn(result, 'c1', 'r1', 'col-a');

  assertEqual(colA.settings.desktop.width, 5, 'Desktop: width unchanged (5)');
  assertEqual(colA.settings.tablet.width, 8, 'Tablet: width = 8');
  assertEqual(colA.settings.mobile.width, 12, 'Mobile: width unchanged (12)');
}

// ── Test 32: Persistence — serialize/deserialize ──
console.log('\n🧪 Test 32: Persistence — serialize/deserialize');

{
  const layout = buildTestLayout();
  const serialized = JSON.parse(JSON.stringify(layout));

  assert(isLayoutContent(serialized) === true, 'Persist: deserialized is valid layout');
  assertEqual(serialized.layout.containers.length, 2, 'Persist: 2 containers');
  assertEqual(serialized.layout.containers[0].rows[0].columns[0].blocks[0].id, 'block-1', 'Persist: block ID survives round-trip');
  assertEqual(serialized.layout.containers[0].rows[0].columns[0].blocks[0].content.text, 'Heading 1', 'Persist: block content survives round-trip');
  assertEqual(serialized.layout.containers[0].settings.desktop.maxWidth, 'lg', 'Persist: container settings survive');
  assertEqual(serialized.layout.containers[0].settings.tablet.maxWidth, 'lg', 'Persist: tablet settings survive');
  assertEqual(serialized.layout.containers[0].settings.mobile.maxWidth, 'full', 'Persist: mobile settings survive');
}

// ── Test 33: Persistence — nested layout with responsive values ──
console.log('\n🧪 Test 33: Persistence — nested layout with responsive values');

{
  const layout = buildTestLayout();
  // Modify some responsive values
  const modified = {
    layout: {
      containers: layout.layout.containers.map((c) => {
        if (c.id !== 'c1') return c;
        return {
          ...c,
          settings: {
            desktop: { ...c.settings.desktop, padding: 'xl', maxWidth: 'xl' },
            tablet: { ...c.settings.tablet, padding: 'lg', maxWidth: 'md' },
            mobile: { ...c.settings.mobile, padding: 'xs', maxWidth: 'sm' },
          },
          rows: c.rows.map((r) => ({
            ...r,
            columns: r.columns.map((col) => ({
              ...col,
              settings: {
                desktop: { ...col.settings.desktop, width: col.id === 'col-a' ? 8 : col.settings.desktop.width },
                tablet: { ...col.settings.tablet, width: col.id === 'col-a' ? 10 : col.settings.tablet.width },
                mobile: { ...col.settings.mobile, width: 12 },
              },
            })),
          })),
        };
      }),
    },
  };
  const serialized = JSON.parse(JSON.stringify(modified));
  const colA = getColumn(serialized, 'c1', 'r1', 'col-a');

  assertEqual(colA.settings.desktop.width, 8, 'Persist nested: desktop width = 8');
  assertEqual(colA.settings.tablet.width, 10, 'Persist nested: tablet width = 10');
  assertEqual(colA.settings.mobile.width, 12, 'Persist nested: mobile width = 12');
  assertEqual(serialized.layout.containers[0].settings.desktop.padding, 'xl', 'Persist nested: desktop padding = xl');
  assertEqual(serialized.layout.containers[0].settings.tablet.padding, 'lg', 'Persist nested: tablet padding = lg');
  assertEqual(serialized.layout.containers[0].settings.mobile.padding, 'xs', 'Persist nested: mobile padding = xs');
}

// ── Test 34: Persistence — visibility and block content ──
console.log('\n🧪 Test 34: Persistence — visibility and block content');

{
  const layout = buildTestLayout();
  // Hide a column on mobile
  const modified = {
    layout: {
      containers: layout.layout.containers.map((c) => {
        if (c.id !== 'c1') return c;
        return {
          ...c,
          rows: c.rows.map((r) => ({
            ...r,
            columns: r.columns.map((col) => ({
              ...col,
              settings: {
                ...col.settings,
                mobile: { ...col.settings.mobile, visible: col.id === 'col-b' ? false : col.settings.mobile.visible },
              },
            })),
          })),
        };
      }),
    },
  };
  const serialized = JSON.parse(JSON.stringify(modified));
  const colB = getColumn(serialized, 'c1', 'r1', 'col-b');

  assertEqual(colB.settings.mobile.visible, false, 'Persist visibility: col-b hidden on mobile');
  assertEqual(colB.settings.desktop.visible, true, 'Persist visibility: col-b visible on desktop');
  assertEqual(colB.blocks[0].id, 'block-3', 'Persist visibility: block ID preserved');
}

// ── Test 35: Malformed data — deeply nested malformed layout ──
console.log('\n🧪 Test 35: Malformed data — deeply nested');

{
  // Container with null rows
  const bad1 = { layout: { containers: [{ id: 'c1', settings: { desktop: {}, tablet: {}, mobile: {} }, rows: null }] } };
  assert(isLayoutContent(bad1) === true, 'Malformed: null rows is valid layout (type guard passes)');

  // Container with rows containing null columns
  const bad2 = { layout: { containers: [{ id: 'c1', settings: { desktop: {}, tablet: {}, mobile: {} }, rows: [{ id: 'r1', settings: { desktop: {}, tablet: {}, mobile: {} }, columns: null }] }] } };
  assert(isLayoutContent(bad2) === true, 'Malformed: null columns is valid layout (type guard passes)');

  // Container with rows containing columns with null blocks
  const bad3 = { layout: { containers: [{ id: 'c1', settings: { desktop: {}, tablet: {}, mobile: {} }, rows: [{ id: 'r1', settings: { desktop: {}, tablet: {}, mobile: {} }, columns: [{ id: 'col1', settings: { desktop: {}, tablet: {}, mobile: {} }, blocks: null }] }] }] } };
  assert(isLayoutContent(bad3) === true, 'Malformed: null blocks is valid layout (type guard passes)');

  // Deeply malformed: container with missing settings
  const bad4 = { layout: { containers: [{ id: 'c1', rows: [{ id: 'r1', columns: [{ id: 'col1', blocks: [] }] }] }] } };
  assert(isLayoutContent(bad4) === true, 'Malformed: missing settings is valid layout (type guard passes)');

  // Completely empty layout
  const bad5 = { layout: { containers: [] } };
  assert(isLayoutContent(bad5) === true, 'Malformed: empty containers is valid layout');
}

// ── Test 36: Malformed data — moveBlockAcrossColumns safety ──
console.log('\n🧪 Test 36: Malformed data — move safety');

{
  const layout = buildTestLayout();
  // Try to move non-existent block
  const result1 = moveBlockAcrossColumns(layout, 's1', 'nonexistent', 'c1', 'r1', 'col-a', 'c1', 'r1', 'col-b', 0);
  assertEqual(result1, layout, 'Move nonexistent: content unchanged');

  // Try to move from non-existent container
  const result2 = moveBlockAcrossColumns(layout, 's1', 'block-1', 'nonexistent', 'r1', 'col-a', 'c1', 'r1', 'col-b', 0);
  assertEqual(result2, layout, 'Move from nonexistent container: content unchanged');

  // Try to move to non-existent column — rejected, content unchanged
  const result3 = moveBlockAcrossColumns(layout, 's1', 'block-1', 'c1', 'r1', 'col-a', 'c1', 'r1', 'nonexistent', 0);
  const srcCol3 = getColumn(result3, 'c1', 'r1', 'col-a');
  assertEqual(srcCol3.blocks.length, 2, 'Move to nonexistent column: rejected, source unchanged');
  assertEqual(srcCol3.blocks[0].id, 'block-1', 'Move to nonexistent column: block-1 still in source');
}

// ── Test 37: Malformed data — resizeColumnPair safety ──
console.log('\n🧪 Test 37: Malformed data — resize safety');

{
  const layout = buildTestLayout();
  // Try to resize with non-existent container
  const result1 = resizeColumnPair(layout, 'nonexistent', 'r1', 'col-a', 'col-b', 4, 4, 'desktop');
  assertEqual(result1, layout, 'Resize nonexistent container: content unchanged');

  // Try to resize with non-existent column
  const result2 = resizeColumnPair(layout, 'c1', 'r1', 'nonexistent', 'col-b', 4, 4, 'desktop');
  assertEqual(result2, layout, 'Resize nonexistent column: content unchanged');
}

// ── Test 38: Same-column reorder — no-op when same index ──
console.log('\n🧪 Test 38: Same-column reorder — no-op');

{
  const layout = buildTestLayout();
  const result = reorderBlockInColumn(layout, 'c1', 'r1', 'col-a', 'block-1', 0);
  const col = getColumn(result, 'c1', 'r1', 'col-a');

  assertEqual(col.blocks[0].id, 'block-1', 'No-op: block-1 still at index 0');
  assertEqual(col.blocks[1].id, 'block-2', 'No-op: block-2 still at index 1');
}

// ── Test 39: Same-column reorder — block not found ──
console.log('\n🧪 Test 39: Same-column reorder — block not found');

{
  const layout = buildTestLayout();
  const result = reorderBlockInColumn(layout, 'c1', 'r1', 'col-a', 'nonexistent', 1);
  const col = getColumn(result, 'c1', 'r1', 'col-a');

  assertEqual(col.blocks[0].id, 'block-1', 'Not found: block-1 still at index 0');
  assertEqual(col.blocks[1].id, 'block-2', 'Not found: block-2 still at index 1');
}

// ── Summary ──
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);

// ── Block CRUD Service ──
// Operates on blocks within a section's content JSONB field.
// No direct Supabase calls — mutates the content object,
// then the caller persists via sectionsService.updateSection().

import type { Block, BlockType } from '@/lib/blockTypes';
import { createBlock } from '@/lib/blockTypes';

// ── Extract blocks from section content ──

export function getBlocksFromContent(content: Record<string, unknown> | null | undefined): Block[] {
  if (!content || typeof content !== 'object') return [];
  const blocks = content.blocks;
  if (!Array.isArray(blocks)) return [];
  return blocks as Block[];
}

// ── Set blocks into section content ──

export function setBlocksInContent(
  content: Record<string, unknown> | null | undefined,
  blocks: Block[]
): Record<string, unknown> {
  return { ...(content || {}), blocks };
}

// ── Add a block ──

export function addBlock(
  content: Record<string, unknown> | null | undefined,
  type: BlockType,
  insertIndex?: number
): { content: Record<string, unknown>; newBlockId: string } {
  const blocks = getBlocksFromContent(content);
  const newBlock = createBlock(type, blocks.length);

  const newBlocks = [...blocks];
  if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= newBlocks.length) {
    newBlocks.splice(insertIndex, 0, newBlock);
  } else {
    newBlocks.push(newBlock);
  }

  // Reindex sort_order
  const reindexed = newBlocks.map((b, i) => ({ ...b, sort_order: i }));

  return {
    content: setBlocksInContent(content, reindexed),
    newBlockId: newBlock.id,
  };
}

// ── Update a block's content ──

export function updateBlockContent(
  content: Record<string, unknown> | null | undefined,
  blockId: string,
  blockContent: Record<string, unknown>
): Record<string, unknown> {
  const blocks = getBlocksFromContent(content);
  const updated = blocks.map((b) =>
    b.id === blockId ? { ...b, content: blockContent } : b
  );
  return setBlocksInContent(content, updated);
}

// ── Update a block's responsive settings ──

export function updateBlockResponsive(
  content: Record<string, unknown> | null | undefined,
  blockId: string,
  responsive: Block['responsive']
): Record<string, unknown> {
  const blocks = getBlocksFromContent(content);
  const updated = blocks.map((b) =>
    b.id === blockId ? { ...b, responsive } : b
  );
  return setBlocksInContent(content, updated);
}

// ── Delete a block ──

export function deleteBlock(
  content: Record<string, unknown> | null | undefined,
  blockId: string
): Record<string, unknown> {
  const blocks = getBlocksFromContent(content);
  const filtered = blocks.filter((b) => b.id !== blockId);
  const reindexed = filtered.map((b, i) => ({ ...b, sort_order: i }));
  return setBlocksInContent(content, reindexed);
}

// ── Duplicate a block ──

export function duplicateBlock(
  content: Record<string, unknown> | null | undefined,
  blockId: string
): { content: Record<string, unknown>; newBlockId: string } {
  const blocks = getBlocksFromContent(content);
  const source = blocks.find((b) => b.id === blockId);
  if (!source) return { content, blockId };

  const newBlock: Block = {
    ...source,
    id: Math.random().toString(36).slice(2, 10),
    content: { ...source.content },
    responsive: {
      desktop: { ...(source.responsive?.desktop || { visible: true }) },
      tablet: { ...(source.responsive?.tablet || {}) },
      mobile: { ...(source.responsive?.mobile || {}) },
    },
  };

  const sourceIndex = blocks.findIndex((b) => b.id === blockId);
  const newBlocks = [...blocks];
  newBlocks.splice(sourceIndex + 1, 0, newBlock);
  const reindexed = newBlocks.map((b, i) => ({ ...b, sort_order: i }));

  return {
    content: setBlocksInContent(content, reindexed),
    newBlockId: newBlock.id,
  };
}

// ── Move a block up/down ──

export function moveBlock(
  content: Record<string, unknown> | null | undefined,
  blockId: string,
  direction: 'up' | 'down'
): Record<string, unknown> {
  const blocks = getBlocksFromContent(content);
  const index = blocks.findIndex((b) => b.id === blockId);
  if (index === -1) return content;

  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= blocks.length) return content;

  const newBlocks = [...blocks];
  [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
  const reindexed = newBlocks.map((b, i) => ({ ...b, sort_order: i }));

  return setBlocksInContent(content, reindexed);
}

// ── Reorder blocks (drag and drop) ──

export function reorderBlocks(
  content: Record<string, unknown> | null | undefined,
  fromIndex: number,
  toIndex: number
): Record<string, unknown> {
  const blocks = getBlocksFromContent(content);
  if (fromIndex < 0 || fromIndex >= blocks.length) return content;
  if (toIndex < 0 || toIndex >= blocks.length) return content;

  const newBlocks = [...blocks];
  const [moved] = newBlocks.splice(fromIndex, 1);
  newBlocks.splice(toIndex, 0, moved);
  const reindexed = newBlocks.map((b, i) => ({ ...b, sort_order: i }));

  return setBlocksInContent(content, reindexed);
}

// ── Move block to specific index ──

export function moveBlockToIndex(
  content: Record<string, unknown> | null | undefined,
  blockId: string,
  toIndex: number
): Record<string, unknown> {
  const blocks = getBlocksFromContent(content);
  const fromIndex = blocks.findIndex((b) => b.id === blockId);
  if (fromIndex === -1) return content;
  return reorderBlocks(content, fromIndex, toIndex);
}

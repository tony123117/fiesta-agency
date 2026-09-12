import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ChevronRight, ChevronDown, ChevronUp, GripVertical, Eye, EyeOff, Maximize2,
  Plus, Type, AlignLeft, Image, MousePointerClick, ArrowUpDown,
  LayoutGrid, Box, Rows, Columns,
} from 'lucide-react';
import { getSectionLabel, SECTION_TYPES } from '@/lib/sectionTypes';
import { getBlocksFromContent } from '@/lib/blocksService';
import { getBlockTypeConfig } from '@/lib/blockTypes';
import { isLayoutContent } from '@/lib/layoutTypes';
import type { LayoutContent, LayoutContainer, LayoutRow, LayoutColumn } from '@/lib/layoutTypes';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { Section } from '@/lib/types';
import type { Block, BlockType } from '@/lib/blockTypes';
import type { SectionType } from '@/lib/types';

// ── Block type → icon mapping ──
const BLOCK_ICONS: Record<BlockType, typeof Type> = {
  heading: Type,
  text: AlignLeft,
  image: Image,
  button: MousePointerClick,
  spacer: ArrowUpDown,
};

// ── Block label extraction ──
function getBlockNavigatorLabel(block: Block): string {
  const config = getBlockTypeConfig(block.type);
  const content = block.content;

  // Show meaningful preview text based on block type
  if (block.type === 'heading' && 'text' in content) {
    const text = String(content.text || '').trim();
    return text ? `${config.label}: ${text.slice(0, 30)}` : config.label;
  }
  if (block.type === 'text' && 'html' in content) {
    const html = String(content.html || '');
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text ? `${config.label}: ${text.slice(0, 30)}` : config.label;
  }
  if (block.type === 'button' && 'text' in content) {
    const text = String(content.text || '').trim();
    return text ? `${config.label}: ${text}` : config.label;
  }
  if (block.type === 'image') {
    const src = String(content.src || '');
    return src ? `${config.label} (set)` : `${config.label} (empty)`;
  }
  if (block.type === 'spacer' && 'height' in content) {
    return `${config.label}: ${content.height}px`;
  }
  return config.label;
}

// ── Context menu action button ──
function MenuAction({
  children,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-3 py-1.5 text-[0.7rem] transition-colors ${
        disabled
          ? 'text-white/15 cursor-not-allowed'
          : danger
          ? 'text-red-400/70 hover:bg-red-500/10'
          : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
      }`}
    >
      {children}
    </button>
  );
}

// ── Tree node types ──
interface SectionNode {
  kind: 'section';
  section: Section;
  index: number;
  blockCount: number;
}

interface BlockNode {
  kind: 'block';
  block: Block;
  sectionId: string;
  sectionIndex: number;
  blockIndex: number;
  /** Layout context (only present for blocks inside layout sections) */
  containerId?: string;
  rowId?: string;
  columnId?: string;
}

interface ContainerNode {
  kind: 'container';
  container: LayoutContainer;
  sectionId: string;
  sectionIndex: number;
  rowIndex: number;
}

interface RowNode {
  kind: 'row';
  row: LayoutRow;
  container: LayoutContainer;
  sectionId: string;
  sectionIndex: number;
  rowIndex: number;
}

interface ColumnNode {
  kind: 'column';
  column: LayoutColumn;
  row: LayoutRow;
  container: LayoutContainer;
  sectionId: string;
  sectionIndex: number;
  rowIndex: number;
  columnIndex: number;
}

type TreeNode = SectionNode | BlockNode | ContainerNode | RowNode | ColumnNode;

// ── Props ──
interface PageNavigatorProps {
  sections: Section[];
  selectedSectionId: string | null;
  selectedBlockId: string | null;
  onSelectSection: (id: string) => void;
  onSelectBlock: (sectionId: string, blockId: string) => void;
  onDeleteSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onPreviewSection: (section: Section) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onAddSection: () => void;
  onInsertPattern: () => void;
  // Section drag-and-drop
  sectionDragIndex: number | null;
  sectionDragOverIndex: number | null;
  onSectionDragStart: (index: number) => void;
  onSectionDragOver: (e: React.DragEvent, index: number) => void;
  onSectionDrop: (index: number) => void;
  onSectionDragEnd: () => void;
  // Block drag-and-drop (within a section)
  onBlockReorder: (sectionId: string, fromIndex: number, toIndex: number) => void;
  // Layout-aware block reorder (same column)
  onLayoutBlockReorder?: (sectionId: string, containerId: string, rowId: string, columnId: string, blockId: string, toIndex: number) => void;
  // Layout-aware cross-column block move
  onLayoutBlockMoveCrossColumn?: (sectionId: string, blockId: string, sourceContainerId: string, sourceRowId: string, sourceColumnId: string, targetContainerId: string, targetRowId: string, targetColumnId: string, targetIndex: number) => void;
  // Layout selection
  layoutSelection: LayoutSelection | null;
  onSelectLayout: (selection: LayoutSelection | null) => void;
}

export default function PageNavigator({
  sections,
  selectedSectionId,
  selectedBlockId,
  onSelectSection,
  onSelectBlock,
  onDeleteSection,
  onDuplicateSection,
  onToggleVisibility,
  onPreviewSection,
  onMoveSection,
  onAddSection,
  onInsertPattern,
  sectionDragOverIndex,
  onSectionDragStart,
  onSectionDragOver,
  onSectionDrop,
  onSectionDragEnd,
  onBlockReorder,
  onLayoutBlockReorder,
  onLayoutBlockMoveCrossColumn,
  layoutSelection,
  onSelectLayout,
}: PageNavigatorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Block drag state
  const blockDragRef = useRef<{ sectionId: string; fromIndex: number; blockId?: string; layoutContext?: { containerId: string; rowId: string; columnId: string } } | null>(null);
  const [blockDragOver, setBlockDragOver] = useState<{ sectionId: string; index: number } | null>(null);

  const toggleExpand = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  // Expand all sections
  const expandAll = useCallback(() => {
    setExpandedSections(new Set(sections.map((s) => s.id)));
  }, [sections]);

  // Collapse all sections
  const collapseAll = useCallback(() => {
    setExpandedSections(new Set());
  }, []);

  // Build flat tree for rendering
  const tree = useMemo(() => {
    const nodes: TreeNode[] = [];
    sections.forEach((section, sIdx) => {
      const content = section.content as Record<string, unknown> | null;
      const hasLayout = content && isLayoutContent(content);

      if (hasLayout) {
        const layout = content as unknown as LayoutContent;
        nodes.push({
          kind: 'section',
          section,
          index: sIdx,
          blockCount: layout.layout.containers.reduce(
            (sum, c) => sum + c.rows.reduce(
              (rSum, r) => rSum + r.columns.reduce(
                (cSum, col) => cSum + (col.blocks?.length || 0), 0
              ), 0
            ), 0
          ),
        });

        if (expandedSections.has(section.id)) {
          layout.layout.containers.forEach((container, cIdx) => {
            nodes.push({
              kind: 'container',
              container,
              sectionId: section.id,
              sectionIndex: sIdx,
              rowIndex: cIdx,
            });

            container.rows.forEach((row, rIdx) => {
              nodes.push({
                kind: 'row',
                row,
                container,
                sectionId: section.id,
                sectionIndex: sIdx,
                rowIndex: rIdx,
              });

              row.columns.forEach((col, colIdx) => {
                nodes.push({
                  kind: 'column',
                  column: col,
                  row,
                  container,
                  sectionId: section.id,
                  sectionIndex: sIdx,
                  rowIndex: rIdx,
                  columnIndex: colIdx,
                });

                // Blocks inside columns
                if (col.blocks) {
                  col.blocks.forEach((block, bIdx) => {
                    nodes.push({
                      kind: 'block',
                      block,
                      sectionId: section.id,
                      sectionIndex: sIdx,
                      blockIndex: bIdx,
                      containerId: container.id,
                      rowId: row.id,
                      columnId: col.id,
                    });
                  });
                }
              });
            });
          });
        }
      } else {
        // Legacy flat blocks
        const blocks = getBlocksFromContent(section.content);
        nodes.push({
          kind: 'section',
          section,
          index: sIdx,
          blockCount: blocks.length,
        });
        if (expandedSections.has(section.id)) {
          blocks.forEach((block, bIdx) => {
            nodes.push({
              kind: 'block',
              block,
              sectionId: section.id,
              sectionIndex: sIdx,
              blockIndex: bIdx,
            });
          });
        }
      }
    });
    return nodes;
  }, [sections, expandedSections]);

  // Block drag handlers
  const handleBlockDragStart = useCallback((sectionId: string, fromIndex: number, e: React.DragEvent, node?: BlockNode) => {
    blockDragRef.current = {
      sectionId,
      fromIndex,
      blockId: node?.block?.id,
      layoutContext: node?.containerId ? { containerId: node.containerId, rowId: node.rowId!, columnId: node.columnId! } : undefined,
    };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `block:${sectionId}:${fromIndex}`);
    // Ghost image
    const el = e.currentTarget as HTMLElement;
    if (el) e.dataTransfer.setDragImage(el, 0, 0);
  }, []);

  const handleBlockDragOver = useCallback((sectionId: string, toIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setBlockDragOver({ sectionId, index: toIndex });
  }, []);

  const handleBlockDrop = useCallback((sectionId: string, toIndex: number, node?: BlockNode) => {
    const source = blockDragRef.current;
    blockDragRef.current = null;
    setBlockDragOver(null);
    if (!source || source.sectionId !== sectionId || source.fromIndex === toIndex) return;

    // If both source and target have layout context, use layout-aware operations
    if (node?.containerId && node?.rowId && node?.columnId && source.layoutContext && source.blockId) {
      const src = source.layoutContext;
      // Cross-column move (different column, row, or container)
      if (onLayoutBlockMoveCrossColumn
        && (src.containerId !== node.containerId || src.rowId !== node.rowId || src.columnId !== node.columnId)) {
        onLayoutBlockMoveCrossColumn(
          sectionId, source.blockId,
          src.containerId, src.rowId, src.columnId,
          node.containerId, node.rowId, node.columnId,
          toIndex
        );
        return;
      }
      // Same-column reorder
      if (onLayoutBlockReorder) {
        onLayoutBlockReorder(sectionId, src.containerId, src.rowId, src.columnId, source.blockId, toIndex);
        return;
      }
    }

    onBlockReorder(sectionId, source.fromIndex, toIndex);
  }, [onBlockReorder, onLayoutBlockReorder, onLayoutBlockMoveCrossColumn]);

  const handleBlockDragEnd = useCallback(() => {
    blockDragRef.current = null;
    setBlockDragOver(null);
  }, []);

  // Close menu on outside click
  const closeMenu = useCallback(() => setMenuOpenId(null), []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">
          Page Structure
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={expandAll}
            className="text-[0.5rem] text-white/20 hover:text-white/50 transition-colors"
            title="Expand all"
          >
            <ChevronDown size={10} />
          </button>
          <button
            onClick={collapseAll}
            className="text-[0.5rem] text-white/20 hover:text-white/50 transition-colors"
            title="Collapse all"
          >
            <ChevronRight size={10} />
          </button>
          <span className="text-[0.5rem] text-white/15 ml-1">{sections.length}</span>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {sections.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[0.7rem] text-white/30 mb-3">No sections yet</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onAddSection}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-gold/70 border border-gold/20 rounded hover:bg-gold/[0.06] transition-colors"
              >
                <Plus size={10} strokeWidth={1.5} /> Add Section
              </button>
              <button
                onClick={onInsertPattern}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white/40 border border-white/[0.1] rounded hover:bg-white/[0.04] hover:text-white/60 transition-colors"
              >
                <LayoutGrid size={10} strokeWidth={1.5} /> Insert Pattern
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-px">
            {tree.map((node) => {
              if (node.kind === 'section') {
                return (
                  <SectionNodeRow
                    key={node.section.id}
                    section={node.section}
                    index={node.index}
                    total={sections.length}
                    blockCount={node.blockCount}
                    isExpanded={expandedSections.has(node.section.id)}
                    isSelected={node.section.id === selectedSectionId && !selectedBlockId && !layoutSelection}
                    isDragOver={sectionDragOverIndex === node.index}
                    menuOpen={menuOpenId === node.section.id}
                    onToggleExpand={() => toggleExpand(node.section.id)}
                    onSelect={() => onSelectSection(node.section.id)}
                    onDelete={() => { onDeleteSection(node.section.id); setMenuOpenId(null); }}
                    onDuplicate={() => { onDuplicateSection(node.section.id); setMenuOpenId(null); }}
                    onToggleVisibility={() => onToggleVisibility(node.section.id)}
                    onPreview={() => onPreviewSection(node.section)}
                    onMoveUp={() => onMoveSection(node.index, 'up')}
                    onMoveDown={() => onMoveSection(node.index, 'down')}
                    onMenuToggle={() => setMenuOpenId(menuOpenId === node.section.id ? null : node.section.id)}
                    onMenuClose={closeMenu}
                    onDragStart={() => onSectionDragStart(node.index)}
                    onDragOver={(e) => onSectionDragOver(e, node.index)}
                    onDrop={() => onSectionDrop(node.index)}
                    onDragEnd={onSectionDragEnd}
                  />
                );
              }

              // ── Layout nodes ──
              if (node.kind === 'container') {
                const isLayoutSelected = layoutSelection?.level === 'container' && layoutSelection.containerId === node.container.id;
                return (
                  <div
                    key={`container-${node.container.id}`}
                    onClick={() => onSelectLayout({ level: 'container', containerId: node.container.id })}
                    className={`flex items-center gap-1.5 pl-4 pr-2 py-1.5 rounded cursor-pointer transition-all duration-150 ${
                      isLayoutSelected
                        ? 'bg-gold/[0.08] border border-gold/20'
                        : 'border border-transparent hover:bg-white/[0.02]'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <Box size={9} className="text-gold/40 shrink-0" strokeWidth={1.5} />
                    <span className={`text-[0.65rem] truncate flex-1 ${isLayoutSelected ? 'text-ivory font-medium' : 'text-white/45'}`}>
                      Container
                    </span>
                    <span className="text-[0.5rem] text-white/15 shrink-0">
                      {node.container.rows.length} row{node.container.rows.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              }

              if (node.kind === 'row') {
                const isLayoutSelected = layoutSelection?.level === 'row' && layoutSelection.rowId === node.row.id;
                return (
                  <div
                    key={`row-${node.row.id}`}
                    onClick={() => onSelectLayout({ level: 'row', containerId: node.container.id, rowId: node.row.id })}
                    className={`flex items-center gap-1.5 pl-8 pr-2 py-1.5 rounded cursor-pointer transition-all duration-150 ${
                      isLayoutSelected
                        ? 'bg-gold/[0.08] border border-gold/20'
                        : 'border border-transparent hover:bg-white/[0.02]'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <Rows size={9} className="text-blue-400/40 shrink-0" strokeWidth={1.5} />
                    <span className={`text-[0.65rem] truncate flex-1 ${isLayoutSelected ? 'text-ivory font-medium' : 'text-white/45'}`}>
                      Row
                    </span>
                    <span className="text-[0.5rem] text-white/15 shrink-0">
                      {node.row.columns.length} col{node.row.columns.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              }

              if (node.kind === 'column') {
                const isLayoutSelected = layoutSelection?.level === 'column' && layoutSelection.columnId === node.column.id;
                const width = node.column.settings.desktop?.width || 6;
                const blockCount = node.column.blocks?.length || 0;
                return (
                  <div
                    key={`column-${node.column.id}`}
                    onClick={() => onSelectLayout({ level: 'column', containerId: node.container.id, rowId: node.row.id, columnId: node.column.id })}
                    className={`flex items-center gap-1.5 pl-12 pr-2 py-1.5 rounded cursor-pointer transition-all duration-150 ${
                      isLayoutSelected
                        ? 'bg-gold/[0.08] border border-gold/20'
                        : 'border border-transparent hover:bg-white/[0.02]'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <Columns size={9} className="text-green-400/40 shrink-0" strokeWidth={1.5} />
                    <span className={`text-[0.65rem] truncate flex-1 ${isLayoutSelected ? 'text-ivory font-medium' : 'text-white/45'}`}>
                      Column {width}/12
                    </span>
                    <span className="text-[0.5rem] text-white/15 shrink-0">
                      {blockCount} block{blockCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              }

              // Block node (inside column or legacy flat)
              const blockConfig = getBlockTypeConfig(node.block.type);
              const BlockIcon = BLOCK_ICONS[node.block.type] || Type;
              const isBlockSelected = node.block.id === selectedBlockId;
              const isBlockDragOver = blockDragOver?.sectionId === node.sectionId && blockDragOver?.index === node.blockIndex;

              return (
                <div key={node.block.id}>
                  {/* Insertion indicator */}
                  {isBlockDragOver && (
                    <div className="ml-16 mr-2 h-0.5 bg-gold rounded-full shadow-[0_0_6px_rgba(214,166,79,0.4)] -mt-0.5 mb-0.5" />
                  )}
                  <div
                    draggable
                    onDragStart={(e) => handleBlockDragStart(node.sectionId, node.blockIndex, e, node)}
                    onDragOver={(e) => handleBlockDragOver(node.sectionId, node.blockIndex, e)}
                    onDrop={() => handleBlockDrop(node.sectionId, node.blockIndex, node)}
                    onDragEnd={handleBlockDragEnd}
                    onClick={() => onSelectBlock(node.sectionId, node.block.id)}
                    className={`group flex items-center gap-1.5 pl-16 pr-2 py-1.5 rounded cursor-pointer transition-all duration-150 ${
                      isBlockSelected
                        ? 'bg-gold/[0.08] border border-gold/20'
                        : isBlockDragOver
                        ? 'border border-gold/30 bg-gold/[0.04]'
                        : 'border border-transparent hover:bg-white/[0.02]'
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-selected={isBlockSelected}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectBlock(node.sectionId, node.block.id);
                      }
                    }}
                  >
                  <GripVertical size={9} className="text-white/10 shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                  <BlockIcon size={10} className="text-white/20 shrink-0" strokeWidth={1.5} />
                  <span className={`text-[0.65rem] truncate flex-1 ${
                    isBlockSelected ? 'text-ivory font-medium' : 'text-white/45'
                  }`}>
                    {getBlockNavigatorLabel(node.block)}
                  </span>
                  <span className="text-[0.5rem] text-white/15 shrink-0">
                    {blockConfig.label}
                  </span>
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2 mt-2">
              <button
                onClick={onAddSection}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dashed border-white/[0.08] rounded text-[0.65rem] text-white/25 hover:text-gold hover:border-gold/30 transition-colors"
              >
                <Plus size={11} strokeWidth={1.5} /> Add Section
              </button>
              <button
                onClick={onInsertPattern}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dashed border-white/[0.08] rounded text-[0.65rem] text-white/25 hover:text-white/50 hover:border-white/[0.15] transition-colors"
              >
                <LayoutGrid size={11} strokeWidth={1.5} /> Pattern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section tree node ──
function SectionNodeRow({
  section,
  index,
  total,
  blockCount,
  isExpanded,
  isSelected,
  isDragOver,
  menuOpen,
  onToggleExpand,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onPreview,
  onMoveUp,
  onMoveDown,
  onMenuToggle,
  onMenuClose,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  section: Section;
  index: number;
  total: number;
  blockCount: number;
  isExpanded: boolean;
  isSelected: boolean;
  isDragOver: boolean;
  menuOpen: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onPreview: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const label = getSectionLabel(section.section_type as SectionType);
  const config = SECTION_TYPES[section.section_type as SectionType];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group rounded transition-all duration-200 ${
        isSelected
          ? 'bg-gold/[0.08] border border-gold/20'
          : isDragOver
          ? 'border border-gold/30 bg-gold/[0.04]'
          : 'border border-transparent hover:bg-white/[0.02] hover:border-white/[0.06]'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); }
      }}
    >
      {/* Section row */}
      <div className="flex items-center gap-1 px-2 py-2">
        <GripVertical size={11} className="text-white/10 shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Expand/collapse toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
          className="shrink-0 text-white/20 hover:text-white/50 transition-colors"
          aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
        >
          {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>

        <span className="text-[0.5rem] font-semibold text-white/20 w-4 shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="flex-1 min-w-0">
          <p className={`text-[0.7rem] font-medium truncate ${isSelected ? 'text-ivory' : 'text-white/60'}`}>
            {label}
          </p>
          {config && (
            <p className="text-[0.55rem] text-white/20 truncate">
              {config.icon} {blockCount > 0 ? `${blockCount} block${blockCount !== 1 ? 's' : ''}` : config.description}
            </p>
          )}
        </div>

        {/* Quick actions — visible on hover */}
        <div className="flex flex-col -space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            disabled={index === 0}
            className="text-white/15 hover:text-gold disabled:text-white/5 disabled:cursor-not-allowed transition-colors"
            aria-label="Move up"
          >
            <ChevronUp size={9} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            disabled={index === total - 1}
            className="text-white/15 hover:text-gold disabled:text-white/5 disabled:cursor-not-allowed transition-colors"
            aria-label="Move down"
          >
            <ChevronDown size={9} />
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
          className="shrink-0 text-white/15 hover:text-gold transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Preview section"
          title="Preview section"
        >
          <Maximize2 size={11} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          className="shrink-0 opacity-0 group-hover:opacity-100"
          aria-label={section.published ? 'Hide section' : 'Show section'}
        >
          {section.published ? (
            <Eye size={11} className="text-green-400/50" />
          ) : (
            <EyeOff size={11} className="text-white/15" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
            className="text-[0.55rem] text-white/20 hover:text-white/50 px-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Section actions"
            aria-expanded={menuOpen}
          >
            ···
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onMenuClose} />
              <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-charcoal border border-white/[0.08] rounded-lg shadow-xl py-1">
                <MenuAction onClick={() => { onDuplicate(); onMenuClose(); }}>Duplicate</MenuAction>
                <div className="border-t border-white/[0.06] my-0.5" />
                <MenuAction danger onClick={() => { onDelete(); onMenuClose(); }}>Delete</MenuAction>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { Plus, GripVertical, ChevronUp, ChevronDown, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { AdminButton } from '@/components/admin/AdminUI';
import { blockEditorRegistry } from './blocks/blockEditorRegistry';
import {
  getBlocksFromContent,
  addBlock,
  updateBlockContent,
  updateBlockResponsive,
  deleteBlock,
  duplicateBlock,
  moveBlock,
  reorderBlocks,
} from '@/lib/blocksService';
import { BLOCK_TYPES, getBlockLabel } from '@/lib/blockTypes';
import type { Block, BlockType, BlockResponsive } from '@/lib/blockTypes';
import type { SectionEditorProps } from './SectionEditorRegistry';

export function BlocksSectionEditor({ content, onChange }: SectionEditorProps) {
  const blocks = getBlocksFromContent(content);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const handleAddBlock = useCallback((type: BlockType) => {
    const { content: newContent, blockId } = addBlock(content, type);
    onChange(newContent);
    setSelectedBlockId(blockId);
    setShowAddBlock(false);
  }, [content, onChange]);

  const handleUpdateBlock = useCallback((blockId: string, blockContent: Record<string, unknown>) => {
    onChange(updateBlockContent(content, blockId, blockContent));
  }, [content, onChange]);

  const handleResponsiveUpdate = useCallback((blockId: string, responsive: import('@/lib/blockTypes').Block['responsive']) => {
    onChange(updateBlockResponsive(content, blockId, responsive));
  }, [content, onChange]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    onChange(deleteBlock(content, blockId));
    if (selectedBlockId === blockId) setSelectedBlockId(null);
  }, [content, onChange, selectedBlockId]);

  const handleDuplicateBlock = useCallback((blockId: string) => {
    const { content: newContent, newBlockId } = duplicateBlock(content, blockId);
    onChange(newContent);
    setSelectedBlockId(newBlockId);
  }, [content, onChange]);

  const handleMoveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
    onChange(moveBlock(content, blockId, direction));
  }, [content, onChange]);

  const handleToggleVisibility = useCallback((blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    const newResponsive: BlockResponsive = {
      ...block.responsive,
      desktop: { visible: !(block.responsive?.desktop?.visible) },
    };
    onChange(updateBlockResponsive(content, blockId, newResponsive));
  }, [content, onChange, blocks]);

  // Drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragIndex;
    setDragIndex(null);
    setOverIndex(null);
    if (fromIndex === null || fromIndex === toIndex) return;
    onChange(reorderBlocks(content, fromIndex, toIndex));
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Block list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {blocks.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[0.7rem] text-white/30 mb-3">No blocks yet</p>
            <AdminButton size="sm" onClick={() => setShowAddBlock(true)} className="gap-1.5">
              <Plus size={10} strokeWidth={1.5} /> Add Block
            </AdminButton>
          </div>
        ) : (
          <>
            {blocks.map((block, i) => {
              const isSelected = block.id === selectedBlockId;
              const isDragOver = overIndex === i;
              const label = getBlockLabel(block.type);

              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gold/[0.08] border border-gold/20'
                      : isDragOver
                      ? 'border border-gold/30 bg-gold/[0.04]'
                      : 'border border-transparent hover:bg-white/[0.02] hover:border-white/[0.06]'
                  }`}
                >
                  <GripVertical size={10} className="text-white/10 shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />

                  <span className="text-[0.45rem] font-semibold text-white/20 w-3 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[0.65rem] font-medium truncate ${isSelected ? 'text-ivory' : 'text-white/60'}`}>
                      {label}
                    </p>
                    <p className="text-[0.5rem] text-white/20 truncate">
                      {getBlockPreviewText(block)}
                    </p>
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'up'); }}
                      disabled={i === 0}
                      className="text-white/15 hover:text-gold disabled:text-white/5 disabled:cursor-not-allowed transition-colors p-0.5"
                      aria-label="Move up"
                    >
                      <ChevronUp size={9} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'down'); }}
                      disabled={i === blocks.length - 1}
                      className="text-white/15 hover:text-gold disabled:text-white/5 disabled:cursor-not-allowed transition-colors p-0.5"
                      aria-label="Move down"
                    >
                      <ChevronDown size={9} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleVisibility(block.id); }}
                      className="text-white/15 hover:text-gold transition-colors p-0.5"
                      aria-label={block.responsive?.desktop?.visible ? 'Hide' : 'Show'}
                    >
                      {block.responsive?.desktop?.visible ? <Eye size={9} className="text-green-400/50" /> : <EyeOff size={9} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDuplicateBlock(block.id); }}
                      className="text-white/15 hover:text-gold transition-colors p-0.5"
                      aria-label="Duplicate"
                    >
                      <Copy size={9} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                      className="text-white/15 hover:text-red-400/60 transition-colors p-0.5"
                      aria-label="Delete"
                    >
                      <Trash2 size={9} />
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => setShowAddBlock(true)}
              className="w-full flex items-center justify-center gap-2 py-2 mt-2 border border-dashed border-white/[0.08] rounded text-[0.65rem] text-white/25 hover:text-gold hover:border-gold/30 transition-colors"
            >
              <Plus size={11} strokeWidth={1.5} /> Add Block
            </button>
          </>
        )}
      </div>

      {/* Block editor panel */}
      {selectedBlock && (
        <div className="border-t border-white/[0.06] max-h-[40%] overflow-y-auto">
          <div className="px-3 py-2 border-b border-white/[0.04] flex items-center justify-between">
            <h4 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">
              Edit {getBlockLabel(selectedBlock.type)}
            </h4>
            <button
              onClick={() => setSelectedBlockId(null)}
              className="text-[0.55rem] text-white/30 hover:text-white/50"
            >
              Close
            </button>
          </div>
          <div className="p-3">
            <BlockEditorForType block={selectedBlock} onChange={(c) => handleUpdateBlock(selectedBlock.id, c)} onResponsiveChange={(r) => handleResponsiveUpdate(selectedBlock.id, r)} />
          </div>
        </div>
      )}

      {/* Add block modal */}
      {showAddBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-charcoal border border-white/[0.08] rounded-xl shadow-2xl w-[420px] max-h-[80vh] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/40">Add Block</h3>
              <button onClick={() => setShowAddBlock(false)} className="text-white/30 hover:text-white/60 text-lg">&times;</button>
            </div>
            <div className="p-3 space-y-1 overflow-y-auto max-h-[60vh]">
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => handleAddBlock(bt.type)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-white/[0.06] hover:border-gold/30 hover:bg-gold/[0.03] transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded bg-white/[0.04] flex items-center justify-center text-white/30 group-hover:text-gold transition-colors text-[0.7rem]">
                    {bt.icon}
                  </div>
                  <div>
                    <p className="text-[0.75rem] font-medium text-white/70 group-hover:text-ivory transition-colors">{bt.label}</p>
                    <p className="text-[0.6rem] text-white/25">{bt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockEditorForType({ block, onChange, onResponsiveChange }: { block: Block; onChange: (c: Record<string, unknown>) => void; onResponsiveChange?: (r: import('@/lib/blockTypes').Block['responsive']) => void }) {
  const Editor = blockEditorRegistry[block.type];
  if (!Editor) return <p className="text-[0.7rem] text-white/30">No editor for {block.type}</p>;
  return <Editor content={block.content} onChange={onChange} responsive={block.responsive} onResponsiveChange={onResponsiveChange} />;
}

function getBlockPreviewText(block: Block): string {
  const c = block.content;
  switch (block.type) {
    case 'heading':
      return (c.text as string) || 'Empty heading';
    case 'text':
      return (c.html as string)?.replace(/<[^>]+>/g, '').slice(0, 50) || 'Empty text';
    case 'image':
      return (c.alt as string) || (c.src ? 'Image set' : 'No image');
    case 'button':
      return `${c.text || 'Button'} → ${c.url || '/'}`;
    case 'spacer':
      return `${c.height || 48}px`;
    default:
      return '';
  }
}

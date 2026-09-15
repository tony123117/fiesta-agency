import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Globe, Eye as EyeIcon, Loader2, AlertTriangle,
  Settings, Maximize2, ExternalLink, Undo2, Redo2, X,
} from 'lucide-react';
import { AdminLoading, Toast } from '@/components/admin/AdminUI';
import { getPage, updatePage, publishPage, unpublishPage } from '@/lib/pagesService';
import { getSections, createSection, updateSection, deleteSection, duplicateSection, reorderSections, toggleSectionVisibility } from '@/lib/sectionsService';
import { getSectionLabel } from '@/lib/sectionTypes';
import { VisualCanvas } from './VisualCanvas';
import { SectionEditor } from './SectionEditor';
import { LayoutInspector } from './LayoutInspector';
import { AddSectionModal } from './AddSectionModal';
import FullPagePreview from './FullPagePreview';
import PublishConfirmDialog from './PublishConfirmDialog';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import { SectionPreviewModal } from './SectionPreviewModal';
import { hasLayoutContent, canDeleteColumn, addContainer, updateContainer, updateContainerResponsive, deleteContainer, addRow, updateRow, updateRowResponsive, deleteRow, addColumn, updateColumn, updateColumnResponsive, deleteColumn, moveBlockAcrossColumns, reorderBlockInColumn, resizeColumnPair, duplicateBlockInLayout, deleteBlockInLayout, updateBlockContentInLayout, duplicateBlockInContent, deleteBlockInContent, updateBlockContentInContent, moveBlockInContent } from '@/hooks/useLayoutOperations';
import type { Page, Section, SectionType } from '@/lib/types';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';
import type { BlockResponsiveBreakpoint, BlockType } from '@/lib/blockTypes';

type SaveState = 'saved' | 'saving' | 'unsaved' | 'failed' | 'publishing';

export function PageBuilder() {
  const { pageId } = useParams<{ pageId: string }>();

  // ── Core state (single source of truth) ──
  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // ── UI state ──
  const [showAddSection, setShowAddSection] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [previewSection, setPreviewSection] = useState<Section | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // ── Layout editing state ──
  const [layoutSelection, setLayoutSelection] = useState<LayoutSelection | null>(null);
  const [activeViewport, setActiveViewport] = useState<BlockResponsiveBreakpoint>('desktop');

  // ── Phase 32: Cross-column drag + column resize ──
  const [layoutDragState, setLayoutDragState] = useState<LayoutBlockDragState | null>(null);
  const [columnResizeState, setColumnResizeState] = useState<{
    sectionId: string; containerId: string; rowId: string;
    colId1: string; colId2: string;
    initialWidth1: number; initialWidth2: number;
    currentWidth1: number; currentWidth2: number;
    viewport: 'desktop' | 'tablet' | 'mobile';
  } | null>(null);

  // ── Phase 33: Block-level editing ──
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // ── Saved state for dirty detection ──
  const savedPageRef = useRef<Page | null>(null);
  const savedSectionsRef = useRef<Section[]>([]);

  // ── Undo/Redo (simple snapshots) ──
  const [history, setHistory] = useState<{ past: { page: Page; sections: Section[] }[]; future: { page: Page; sections: Section[] }[] }>({ past: [], future: [] });
  const historyRef = useRef(history);
  historyRef.current = history;

  // ── Load page ──
  const loadPage = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const p = await getPage(pageId);
      if (!p) {
        setLoadError('Page not found.');
        return;
      }
      const s = await getSections(pageId);
      setPage(p);
      setSections(s);
      savedPageRef.current = p;
      savedSectionsRef.current = s.map((sec) => ({ ...sec }));
      setHistory({ past: [], future: [] });
      if (s.length > 0) setSelectedSectionId(s[0].id);
    } catch (err) {
      console.error('Failed to load page:', err);
      setLoadError('Failed to load page. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => { loadPage(); }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dirty detection ──
  const dirty = useMemo(() => {
    if (!page || !savedPageRef.current) return false;
    const pageChanged = page.title !== savedPageRef.current.title ||
      page.slug !== savedPageRef.current.slug ||
      (page.description || '') !== (savedPageRef.current.description || '');
    if (pageChanged) return true;
    if (sections.length !== savedSectionsRef.current.length) return true;
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const saved = savedSectionsRef.current.find((x) => x.id === s.id);
      if (!saved) return true;
      if (s.sort_order !== saved.sort_order) return true;
      if (s.published !== saved.published) return true;
      if (s.title !== saved.title) return true;
      if (s.layout !== saved.layout) return true;
      if (JSON.stringify(s.content) !== JSON.stringify(saved.content)) return true;
    }
    return false;
  }, [page, sections]);

  // ── Push history snapshot before mutation ──
  const pushHistory = useCallback(() => {
    if (!page) return;
    setHistory((h) => ({
      past: [...h.past.slice(-29), { page: { ...page }, sections: sections.map((s) => ({ ...s })) }],
      future: [],
    }));
  }, [page, sections]);

  // ── Undo / Redo ──
  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const prev = h.past[h.past.length - 1];
      setPage(prev.page);
      setSections(prev.sections);
      return { past: h.past.slice(0, -1), future: [{ page: { ...page! }, sections: sections.map((s) => ({ ...s })) }, ...h.future.slice(0, 29)] };
    });
  }, [page, sections]);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[0];
      setPage(next.page);
      setSections(next.sections);
      return { past: [...h.past, { page: { ...page! }, sections: sections.map((s) => ({ ...s })) }].slice(-30), future: h.future.slice(1) };
    });
  }, [page, sections]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (mod && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) { e.preventDefault(); redo(); }
      else if (mod && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }); // no deps — always current

  // ── Save ──
  const showToast = (message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!pageId || !page) return;
    setSaveState('saving');
    try {
      await updatePage(pageId, {
        title: page.title,
        slug: page.slug,
        description: page.description || null,
        seo_title: page.seo_title || null,
        seo_description: page.seo_description || null,
      });
      await Promise.all(sections.map((s, idx) =>
        updateSection(s.id, {
          sort_order: idx,
          published: s.published,
          title: s.title,
          content: s.content,
          layout: s.layout,
        })
      ));
      savedPageRef.current = { ...page };
      savedSectionsRef.current = sections.map((s) => ({ ...s }));
      setSaveState('saved');
      showToast('Changes saved', 'success');
    } catch (err) {
      console.error('Save failed:', err);
      setSaveState('failed');
      showToast('Save failed', 'error');
    }
  };

  // ── Publish ──
  const handlePublishConfirm = async () => {
    if (!pageId) return;
    setShowPublishDialog(false);
    setSaveState('publishing');
    try {
      if (dirty) await handleSave();
      await publishPage(pageId);
      setPage((p) => p ? { ...p, published: true } : p);
      setSaveState('saved');
      showToast('Page published', 'success');
    } catch (err) {
      console.error('Publish failed:', err);
      setSaveState('failed');
      showToast('Publish failed', 'error');
    }
  };

  const handleUnpublish = async () => {
    if (!pageId) return;
    setShowPublishDialog(false);
    setSaveState('publishing');
    try {
      await unpublishPage(pageId);
      setPage((p) => p ? { ...p, published: false } : p);
      setSaveState('saved');
      showToast('Page unpublished', 'success');
    } catch (err) {
      console.error('Unpublish failed:', err);
      setSaveState('failed');
      showToast('Unpublish failed', 'error');
    }
  };

  // ── Section CRUD ──
  const handleAddSection = async (type: SectionType, variant?: string) => {
    if (!pageId) return;
    try {
      pushHistory();
      const newSection = await createSection(pageId, type);
      if (variant && variant !== 'default') {
        await updateSection(newSection.id, { layout: variant });
        newSection.layout = variant;
      }
      setSections((prev) => [...prev, newSection]);
      setSelectedSectionId(newSection.id);
      setShowAddSection(false);
      setSaveState('unsaved');
      showToast('Section added', 'success');
    } catch (err) {
      console.error('Failed to add section:', err);
      showToast('Failed to add section', 'error');
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      pushHistory();
      await deleteSection(id);
      setSections((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (selectedSectionId === id) {
          setSelectedSectionId(next.length > 0 ? next[Math.min(prev.findIndex((s) => s.id === id), next.length - 1)]?.id || null : null);
        }
        return next;
      });
      setSaveState('unsaved');
      showToast('Section deleted', 'success');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Delete failed', 'error');
    }
  };

  const handleDuplicateSection = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      pushHistory();
      const dup = await duplicateSection(section);
      setSections((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        const next = [...prev];
        next.splice(idx + 1, 0, dup);
        return next;
      });
      setSelectedSectionId(dup.id);
      setSaveState('unsaved');
      showToast('Section duplicated', 'success');
    } catch (err) {
      console.error('Duplicate failed:', err);
      showToast('Duplicate failed', 'error');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      pushHistory();
      const updated = await toggleSectionVisibility(id, !section.published);
      setSections((prev) => prev.map((s) => s.id === id ? updated : s));
      setSaveState('unsaved');
    } catch (err) {
      console.error('Toggle failed:', err);
      showToast('Update failed', 'error');
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    pushHistory();
    const next = [...sections];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setSections(next);
    setSaveState('unsaved');
    try {
      await reorderSections(next);
    } catch (err) {
      console.error('Reorder failed:', err);
      showToast('Reorder failed', 'error');
    }
  };

  // ── Section content update (from SectionEditor) ──
  const handleUpdateSection = async (id: string, content: Record<string, unknown>) => {
    try {
      pushHistory();
      const updated = await updateSection(id, { content });
      setSections((prev) => prev.map((s) => s.id === id ? updated : s));
      setSaveState('unsaved');
    } catch (err) {
      console.error('Failed to save section:', err);
      showToast('Failed to save section', 'error');
    }
  };

  const handleUpdateSectionTitle = async (id: string, title: string) => {
    try {
      const updated = await updateSection(id, { title });
      setSections((prev) => prev.map((s) => s.id === id ? updated : s));
    } catch (err) {
      console.error('Failed to update title:', err);
    }
  };

  // ── Layout operations ──
  const applyLayoutUpdate = useCallback((fn: (sections: Section[]) => Section[]) => {
    pushHistory();
    setSections((prev) => {
      const next = fn(prev);
      setSaveState('unsaved');
      return next;
    });
  }, [pushHistory]);

  const layoutOps = useMemo(() => ({
    addContainer: (sectionId: string) => {
      applyLayoutUpdate((s) => addContainer(s, sectionId));
    },
    updateContainer: (sectionId: string, containerId: string, patch: Record<string, unknown>) => {
      applyLayoutUpdate((s) => updateContainer(s, sectionId, containerId, patch));
    },
    updateContainerResponsive: (sectionId: string, containerId: string, bp: BlockResponsiveBreakpoint, patch: Record<string, unknown>) => {
      applyLayoutUpdate((s) => updateContainerResponsive(s, sectionId, containerId, bp, patch));
    },
    deleteContainer: (sectionId: string, containerId: string) => {
      applyLayoutUpdate((s) => deleteContainer(s, sectionId, containerId));
    },
    addRow: (sectionId: string, containerId: string) => {
      applyLayoutUpdate((s) => addRow(s, sectionId, containerId));
    },
    updateRow: (sectionId: string, containerId: string, rowId: string, patch: Record<string, unknown>) => {
      applyLayoutUpdate((s) => updateRow(s, sectionId, containerId, rowId, patch));
    },
    updateRowResponsive: (sectionId: string, containerId: string, rowId: string, bp: BlockResponsiveBreakpoint, patch: Record<string, unknown>) => {
      applyLayoutUpdate((s) => updateRowResponsive(s, sectionId, containerId, rowId, bp, patch));
    },
    deleteRow: (sectionId: string, containerId: string, rowId: string) => {
      applyLayoutUpdate((s) => deleteRow(s, sectionId, containerId, rowId));
    },
    addColumn: (sectionId: string, containerId: string, rowId: string) => {
      applyLayoutUpdate((s) => addColumn(s, sectionId, containerId, rowId));
    },
    updateColumn: (sectionId: string, containerId: string, rowId: string, columnId: string, patch: Record<string, unknown>) => {
      applyLayoutUpdate((s) => updateColumn(s, sectionId, containerId, rowId, columnId, patch));
    },
    updateColumnResponsive: (sectionId: string, containerId: string, rowId: string, columnId: string, bp: BlockResponsiveBreakpoint, patch: Record<string, unknown>) => {
      applyLayoutUpdate((s) => updateColumnResponsive(s, sectionId, containerId, rowId, columnId, bp, patch));
    },
    deleteColumn: (sectionId: string, containerId: string, rowId: string, columnId: string) => {
      applyLayoutUpdate((s) => deleteColumn(s, sectionId, containerId, rowId, columnId));
    },
  }), [applyLayoutUpdate]);

  // ── Phase 32: Cross-column block drag ──
  const handleLayoutBlockDragStart = useCallback((
    sectionId: string, blockId: string, containerId: string, rowId: string, columnId: string, index: number
  ) => {
    setLayoutDragState({
      blockId, sourceSectionId: sectionId, sourceContainerId: containerId,
      sourceRowId: rowId, sourceColumnId: columnId, sourceIndex: index,
      targetContainerId: null, targetRowId: null, targetColumnId: null, targetIndex: 0,
    });
  }, []);

  const handleLayoutBlockDragOver = useCallback((containerId: string, rowId: string, columnId: string, index: number) => {
    setLayoutDragState((prev) => prev ? {
      ...prev, targetContainerId: containerId, targetRowId: rowId, targetColumnId: columnId, targetIndex: index,
    } : null);
  }, []);

  const handleLayoutBlockDrop = useCallback(() => {
    if (!layoutDragState) return;
    applyLayoutUpdate((s) => moveBlockAcrossColumns(
      s, layoutDragState.sourceSectionId, layoutDragState.blockId,
      layoutDragState.sourceContainerId, layoutDragState.sourceRowId, layoutDragState.sourceColumnId,
      layoutDragState.targetContainerId!, layoutDragState.targetRowId!, layoutDragState.targetColumnId!,
      layoutDragState.targetIndex,
    ));
    setLayoutDragState(null);
  }, [layoutDragState, applyLayoutUpdate]);

  const handleLayoutBlockDragEnd = useCallback(() => { setLayoutDragState(null); }, []);

  // ── Phase 32: Column resize ──
  const handleColumnResizeStart = useCallback((
    sectionId: string, containerId: string, rowId: string,
    colId1: string, colId2: string, width1: number, width2: number,
    viewport: 'desktop' | 'tablet' | 'mobile'
  ) => {
    setColumnResizeState({
      sectionId, containerId, rowId, colId1, colId2,
      initialWidth1: width1, initialWidth2: width2,
      currentWidth1: width1, currentWidth2: width2, viewport,
    });
  }, []);

  const handleColumnResizeMove = useCallback((width1: number, width2: number) => {
    setColumnResizeState((prev) => prev ? { ...prev, currentWidth1: width1, currentWidth2: width2 } : null);
  }, []);

  const handleColumnResizeCommit = useCallback(() => {
    if (!columnResizeState) return;
    applyLayoutUpdate((s) => resizeColumnPair(
      s, columnResizeState.sectionId, columnResizeState.containerId, columnResizeState.rowId,
      columnResizeState.colId1, columnResizeState.colId2,
      columnResizeState.currentWidth1, columnResizeState.currentWidth2, columnResizeState.viewport,
    ));
    setColumnResizeState(null);
  }, [columnResizeState, applyLayoutUpdate]);

  const handleColumnResizeCancel = useCallback(() => { setColumnResizeState(null); }, []);

  // ── Phase 33: Block toolbar operations ──
  const isLayoutSection = useCallback((sectionId: string) => {
    return hasLayoutContent(sections, sectionId);
  }, [sections]);

  const handleBlockMoveUp = useCallback((sectionId: string, blockId: string) => {
    if (isLayoutSection(sectionId)) {
      applyLayoutUpdate((s) => reorderBlockInColumn(s, sectionId, blockId, -1));
    } else {
      applyLayoutUpdate((s) => moveBlockInContent(s, sectionId, blockId, -1));
    }
  }, [applyLayoutUpdate, isLayoutSection]);

  const handleBlockMoveDown = useCallback((sectionId: string, blockId: string) => {
    if (isLayoutSection(sectionId)) {
      applyLayoutUpdate((s) => reorderBlockInColumn(s, sectionId, blockId, 1));
    } else {
      applyLayoutUpdate((s) => moveBlockInContent(s, sectionId, blockId, 1));
    }
  }, [applyLayoutUpdate, isLayoutSection]);

  const handleBlockDuplicate = useCallback((sectionId: string, blockId: string) => {
    if (isLayoutSection(sectionId)) {
      applyLayoutUpdate((s) => duplicateBlockInLayout(s, sectionId, blockId));
    } else {
      applyLayoutUpdate((s) => duplicateBlockInContent(s, sectionId, blockId));
    }
  }, [applyLayoutUpdate, isLayoutSection]);

  const handleBlockDelete = useCallback((sectionId: string, blockId: string) => {
    if (isLayoutSection(sectionId)) {
      applyLayoutUpdate((s) => deleteBlockInLayout(s, sectionId, blockId));
    } else {
      applyLayoutUpdate((s) => deleteBlockInContent(s, sectionId, blockId));
    }
    setSelectedBlockId(null);
  }, [applyLayoutUpdate, isLayoutSection]);

  const handleBlockUpdateContent = useCallback((sectionId: string, blockId: string, content: Record<string, unknown>) => {
    if (isLayoutSection(sectionId)) {
      applyLayoutUpdate((s) => updateBlockContentInLayout(s, sectionId, blockId, content));
    } else {
      applyLayoutUpdate((s) => updateBlockContentInContent(s, sectionId, blockId, content));
    }
  }, [applyLayoutUpdate, isLayoutSection]);

  // ── Page settings ──
  const handleSavePageSettings = (updates: Partial<Page>) => {
    if (!page) return;
    pushHistory();
    setPage({ ...page, ...updates });
    setSaveState('unsaved');
    setShowPageSettings(false);
    showToast('Page settings updated — save to persist', 'info');
  };

  // ── Derived state ──
  const selectedSection = sections.find((s) => s.id === selectedSectionId) || null;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  if (loading) return <AdminLoading text="Loading page..." />;
  if (loadError || !page) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={20} className="text-red-400/60" />
            </div>
            <h2 className="font-serif font-medium text-lg text-ivory mb-2">Unable to load page</h2>
            <p className="text-[0.8rem] text-white/40 mb-6">{loadError || 'Page not found.'}</p>
            <div className="flex gap-3 justify-center">
              <Link to="/admin/pages" className="inline-flex items-center gap-1 px-4 py-2 text-[0.7rem] font-medium text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:border-white/[0.15] hover:text-white/80 transition-colors">
                <ArrowLeft size={12} strokeWidth={1.5} /> Back to Pages
              </Link>
              <button onClick={() => loadPage()} className="inline-flex items-center gap-1 px-4 py-2 text-[0.7rem] font-medium text-obsidian bg-gold rounded-lg hover:bg-gold/90 transition-colors">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
      {/* ── Header ── */}
      <div className="border-b border-white/[0.06] bg-charcoal flex-shrink-0">
        {dirty && (
          <div className="px-4 py-1.5 border-b border-gold/10 bg-gold/[0.03] flex items-center gap-2">
            <AlertTriangle size={12} className="text-gold/60 shrink-0" />
            <p className="text-[0.6rem] text-gold/70 flex-1">Unsaved changes</p>
            <button onClick={() => setShowUnsavedDialog(true)} className="text-[0.55rem] text-white/30 hover:text-white/50 transition-colors">Discard</button>
          </div>
        )}
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin/pages" className="flex items-center justify-center w-7 h-7 rounded text-white/30 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] transition-colors shrink-0" aria-label="Back to pages">
              <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
            <div className="min-w-0">
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-gold/60 truncate">PAGE BUILDER</p>
              <h1 className="font-serif font-medium text-sm tracking-tight text-ivory truncate">{page.title || 'Untitled'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <SaveStateBadge state={saveState} />
            <button onClick={handleSave} disabled={saveState === 'saving' || saveState === 'saved'} className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.1em] rounded transition-all ${saveState === 'unsaved' || saveState === 'failed' ? 'bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25' : 'text-white/20 border border-white/[0.06] cursor-not-allowed'}`} title="Save (Ctrl+S)">
              <Save size={10} strokeWidth={1.5} /> Save
            </button>
            <div className="w-px h-4 bg-white/[0.06] mx-1" />
            <button onClick={undo} disabled={!canUndo} className="p-1.5 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors" title="Undo (Ctrl+Z)"><Undo2 size={13} /></button>
            <button onClick={redo} disabled={!canRedo} className="p-1.5 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors" title="Redo (Ctrl+Shift+Z)"><Redo2 size={13} /></button>
            <div className="w-px h-4 bg-white/[0.06] mx-1" />
            <button onClick={() => setShowPageSettings(!showPageSettings)} className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors" title="Page Settings"><Settings size={13} /></button>
            <button onClick={() => setShowFullPreview(true)} className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors" title="Full Preview"><Maximize2 size={13} /></button>
            <Link to={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors" title="View Live"><ExternalLink size={13} /></Link>
            <div className="w-px h-4 bg-white/[0.06] mx-1" />
            <button onClick={() => setShowPublishDialog(true)} className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.1em] rounded transition-all ${page.published ? 'bg-green-600/10 text-green-400 border border-green-600/20 hover:bg-green-600/20' : 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20'}`}>
              {page.published ? <><Globe size={10} strokeWidth={1.5} /> Published</> : <><EyeIcon size={10} strokeWidth={1.5} /> Publish</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Page Settings Panel ── */}
      {showPageSettings && (
        <PageSettingsPanel page={page} onSave={handleSavePageSettings} onClose={() => setShowPageSettings(false)} />
      )}

      {/* ── 3-Panel Layout ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Section List */}
        <SectionNavigator
          sections={sections}
          selectedSectionId={selectedSectionId}
          onSelect={setSelectedSectionId}
          onAdd={() => setShowAddSection(true)}
          onDelete={handleDeleteSection}
          onDuplicate={handleDuplicateSection}
          onToggleVisibility={handleToggleVisibility}
          onMoveUp={(id) => handleMoveSection(sections.findIndex((s) => s.id === id), 'up')}
          onMoveDown={(id) => handleMoveSection(sections.findIndex((s) => s.id === id), 'down')}
          onPreview={(section) => setPreviewSection(section)}
        />

        {/* Center: Canvas */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <VisualCanvas
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={(id) => { setSelectedSectionId(id); setLayoutSelection(null); setSelectedBlockId(null); }}
            isPreview={false}
            layoutSelection={layoutSelection}
            onSelectLayout={setLayoutSelection}
            activeViewport={activeViewport}
            onViewportChange={setActiveViewport}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            hoveredBlockId={hoveredBlockId}
            onHoverBlock={setHoveredBlockId}
            layoutDragState={layoutDragState}
            onLayoutBlockDragStart={handleLayoutBlockDragStart}
            onLayoutBlockDragOver={handleLayoutBlockDragOver}
            onLayoutBlockDrop={handleLayoutBlockDrop}
            onLayoutBlockDragEnd={handleLayoutBlockDragEnd}
            columnResizeState={columnResizeState}
            onColumnResizeStart={handleColumnResizeStart}
            onColumnResizeMove={handleColumnResizeMove}
            onColumnResizeCommit={handleColumnResizeCommit}
            onColumnResizeCancel={handleColumnResizeCancel}
            blockToolbar={selectedBlockId && selectedSectionId ? {
              sectionId: selectedSectionId,
              onBlockMoveUp: handleBlockMoveUp,
              onBlockMoveDown: handleBlockMoveDown,
              onBlockDuplicate: handleBlockDuplicate,
              onBlockDelete: handleBlockDelete,
              onBlockUpdateContent: handleBlockUpdateContent,
            } : undefined}
          />
        </div>

        {/* Right: Editor */}
        <div className="w-[420px] border-l border-white/[0.06] bg-charcoal flex flex-col flex-shrink-0">
          <div className="px-3 py-2.5 border-b border-white/[0.06]">
            <h2 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">Editor</h2>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            {selectedSection ? (
              layoutSelection ? (
                <LayoutInspector
                  section={selectedSection}
                  selection={layoutSelection}
                  onClearSelection={() => setLayoutSelection(null)}
                  onUpdateContainerResponsive={(containerId, bp, patch) => layoutOps.updateContainerResponsive(selectedSection.id, containerId, bp, patch)}
                  onDeleteContainer={(containerId) => layoutOps.deleteContainer(selectedSection.id, containerId)}
                  onUpdateRowResponsive={(containerId, rowId, bp, patch) => layoutOps.updateRowResponsive(selectedSection.id, containerId, rowId, bp, patch)}
                  onDeleteRow={(containerId, rowId) => layoutOps.deleteRow(selectedSection.id, containerId, rowId)}
                  onAddRow={(containerId) => layoutOps.addRow(selectedSection.id, containerId)}
                  onUpdateColumnResponsive={(containerId, rowId, columnId, bp, patch) => layoutOps.updateColumnResponsive(selectedSection.id, containerId, rowId, columnId, bp, patch)}
                  onDeleteColumn={(containerId, rowId, columnId) => layoutOps.deleteColumn(selectedSection.id, containerId, rowId, columnId)}
                  onAddColumn={(containerId, rowId) => layoutOps.addColumn(selectedSection.id, containerId, rowId)}
                  canDeleteColumn={(containerId, rowId, columnId) => canDeleteColumn(sections, selectedSection.id, containerId, rowId, columnId)}
                  onAddContainer={(sectionId) => layoutOps.addContainer(sectionId)}
                  viewport={activeViewport}
                />
              ) : (
                <SectionEditor
                  key={selectedSection.id}
                  section={selectedSection}
                  onUpdate={(content) => handleUpdateSection(selectedSection.id, content)}
                  onUpdateTitle={(title) => handleUpdateSectionTitle(selectedSection.id, title)}
                  onDirty={() => setSaveState('unsaved')}
                  onTogglePublish={() => handleToggleVisibility(selectedSection.id)}
                />
              )
            ) : (
              <div className="p-6 text-center">
                <p className="text-[0.75rem] text-white/30 mb-1">Select a section to edit</p>
                <p className="text-[0.65rem] text-white/20">Click any section in the list or on the canvas.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AddSectionModal open={showAddSection} onClose={() => setShowAddSection(false)} onSelect={handleAddSection} />
      <FullPagePreview open={showFullPreview} page={page} sections={sections} onClose={() => setShowFullPreview(false)} />
      <PublishConfirmDialog open={showPublishDialog} action={page.published ? 'unpublish' : 'publish'} pageTitle={page.title} sections={sections} onConfirm={page.published ? handleUnpublish : handlePublishConfirm} onCancel={() => setShowPublishDialog(false)} />
      <UnsavedChangesDialog open={showUnsavedDialog} onConfirm={() => { setShowUnsavedDialog(false); if (pendingNavigation) { pendingNavigation(); setPendingNavigation(null); } }} onCancel={() => { setShowUnsavedDialog(false); setPendingNavigation(null); }} />
      {previewSection && <SectionPreviewModal open={!!previewSection} onClose={() => setPreviewSection(null)} section={previewSection} title={getSectionLabel(previewSection.section_type as SectionType)} />}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Save State Badge ──
function SaveStateBadge({ state }: { state: SaveState }) {
  const config = {
    saved: { label: 'Saved', color: 'text-green-400/60' },
    saving: { label: 'Saving...', color: 'text-gold/60' },
    unsaved: { label: 'Unsaved', color: 'text-gold/60' },
    failed: { label: 'Failed', color: 'text-red-400/60' },
    publishing: { label: 'Publishing...', color: 'text-gold/60' },
  }[state];
  return (
    <span className={`text-[0.5rem] font-medium ${config.color} flex items-center gap-1`}>
      {state === 'saving' || state === 'publishing' ? <Loader2 size={10} className="animate-spin" /> : null}
      {config.label}
    </span>
  );
}

// ── Section Navigator (left panel) ──
function SectionNavigator({
  sections, selectedSectionId, onSelect, onAdd, onDelete, onDuplicate, onToggleVisibility, onMoveUp, onMoveDown, onPreview,
}: {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onPreview: (section: Section) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="w-72 border-r border-white/[0.06] bg-charcoal flex flex-col flex-shrink-0">
      <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <h2 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">Sections</h2>
        <button onClick={onAdd} className="text-[0.55rem] text-gold/60 hover:text-gold transition-colors">+ Add</button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 py-1">
        {sections.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-[0.7rem] text-white/30 mb-2">No sections yet</p>
            <button onClick={onAdd} className="text-[0.65rem] text-gold/60 hover:text-gold transition-colors">Add your first section</button>
          </div>
        ) : (
          sections.map((section, index) => {
            const isActive = section.id === selectedSectionId;
            const config = SECTION_TYPES_MAP[section.section_type];
            return (
              <div
                key={section.id}
                onClick={() => onSelect(section.id)}
                className={`mx-1 mb-0.5 px-2 py-2 rounded cursor-pointer transition-colors group ${isActive ? 'bg-gold/10 border border-gold/20' : 'hover:bg-white/[0.03] border border-transparent'}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[0.55rem] font-mono text-white/20 w-4 text-right">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[0.7rem] font-medium truncate ${isActive ? 'text-gold' : 'text-white/70'}`}>
                      {section.title || config?.label || section.section_type}
                    </p>
                    <p className="text-[0.55rem] text-white/25 truncate">{config?.label || section.section_type}</p>
                  </div>
                  {!section.published && (
                    <span className="text-[0.5rem] bg-white/[0.06] text-white/30 px-1 py-0.5 rounded shrink-0">Hidden</span>
                  )}
                </div>
                {isActive && (
                  <div className="flex items-center gap-0.5 mt-1.5 pt-1.5 border-t border-white/[0.04]">
                    <button onClick={(e) => { e.stopPropagation(); onMoveUp(section.id); }} disabled={index === 0} className="text-[0.5rem] text-white/20 hover:text-white/50 disabled:text-white/10 disabled:cursor-not-allowed px-1 py-0.5 rounded transition-colors">↑</button>
                    <button onClick={(e) => { e.stopPropagation(); onMoveDown(section.id); }} disabled={index === sections.length - 1} className="text-[0.5rem] text-white/20 hover:text-white/50 disabled:text-white/10 disabled:cursor-not-allowed px-1 py-0.5 rounded transition-colors">↓</button>
                    <button onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }} className="text-[0.5rem] text-white/20 hover:text-white/50 px-1 py-0.5 rounded transition-colors">Duplicate</button>
                    <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(section.id); }} className="text-[0.5rem] text-white/20 hover:text-white/50 px-1 py-0.5 rounded transition-colors">{section.published ? 'Hide' : 'Show'}</button>
                    <button onClick={(e) => { e.stopPropagation(); onPreview(section); }} className="text-[0.5rem] text-white/20 hover:text-white/50 px-1 py-0.5 rounded transition-colors">Preview</button>
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(section.id); }} className="text-[0.5rem] text-red-400/40 hover:text-red-400/70 px-1 py-0.5 rounded transition-colors ml-auto">Delete</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-charcoal/95 z-10 flex flex-col p-3">
          <p className="text-[0.7rem] text-white/60 mb-3">Delete this section?</p>
          <div className="flex gap-2">
            <button onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }} className="flex-1 px-3 py-1.5 text-[0.6rem] font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors">Delete</button>
            <button onClick={() => setConfirmDelete(null)} className="flex-1 px-3 py-1.5 text-[0.6rem] font-medium text-white/40 border border-white/[0.08] rounded hover:text-white/60 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page Settings Panel ──
function PageSettingsPanel({ page, onSave, onClose }: { page: Page; onSave: (updates: Partial<Page>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [description, setDescription] = useState(page.description || '');
  const [seoTitle, setSeoTitle] = useState(page.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(page.seo_description || '');

  return (
    <div className="border-b border-white/[0.06] bg-charcoal p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/30">Page Settings</h3>
        <button onClick={onClose} className="text-white/20 hover:text-white/50"><X size={14} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[0.55rem] text-white/30 mb-1 block">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-2 py-1.5 text-[0.7rem] text-ivory bg-white/[0.04] border border-white/[0.08] rounded" />
        </div>
        <div>
          <label className="text-[0.55rem] text-white/30 mb-1 block">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-2 py-1.5 text-[0.7rem] text-ivory bg-white/[0.04] border border-white/[0.08] rounded" />
        </div>
        <div className="col-span-2">
          <label className="text-[0.55rem] text-white/30 mb-1 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-2 py-1.5 text-[0.7rem] text-ivory bg-white/[0.04] border border-white/[0.08] rounded resize-none" />
        </div>
        <div>
          <label className="text-[0.55rem] text-white/30 mb-1 block">SEO Title</label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full px-2 py-1.5 text-[0.7rem] text-ivory bg-white/[0.04] border border-white/[0.08] rounded" />
        </div>
        <div>
          <label className="text-[0.55rem] text-white/30 mb-1 block">SEO Description</label>
          <input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full px-2 py-1.5 text-[0.7rem] text-ivory bg-white/[0.04] border border-white/[0.08] rounded" />
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <button onClick={() => onSave({ title, slug, description, seo_title: seoTitle, seo_description: seoDescription })} className="px-3 py-1.5 text-[0.6rem] font-medium bg-gold/15 text-gold border border-gold/30 rounded hover:bg-gold/25 transition-colors">Save Settings</button>
      </div>
    </div>
  );
}

// ── Section type label lookup ──
import { SECTION_TYPES } from '@/lib/sectionTypes';
const SECTION_TYPES_MAP = Object.fromEntries(SECTION_TYPES.map((st) => [st.type, st]));

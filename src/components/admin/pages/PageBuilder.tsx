import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Check, ExternalLink, Settings, AlertTriangle, Maximize2,
  Undo2, Redo2, Save, Globe, Eye as EyeIcon, Loader2, X,
  PanelRightOpen, PanelRightClose,
} from 'lucide-react';
import { AdminLoading, AdminButton, AdminInput, Toast, ConfirmDialog } from '@/components/admin/AdminUI';
import { MediaPicker } from '@/components/admin/media';
import { getPage, updatePage, publishPage, unpublishPage } from '@/lib/pagesService';
import {
  getSections, createSection, updateSection, deleteSection,
  duplicateSection, reorderSections, toggleSectionVisibility,
} from '@/lib/sectionsService';
import { getSectionLabel } from '@/lib/sectionTypes';
import { VisualCanvas } from './VisualCanvas';
import { SectionEditor } from './SectionEditor';
import { AddSectionModal } from './AddSectionModal';
import { PatternPicker } from './PatternPicker';
import { instantiatePattern } from '@/lib/blockPatterns';
import type { BlockPattern } from '@/lib/blockPatterns';
import { SectionPreviewModal } from './SectionPreviewModal';
import PageNavigator from './PageNavigator';
import FullPagePreview from './FullPagePreview';
import PublishConfirmDialog from './PublishConfirmDialog';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import { usePageHistory } from '@/hooks/usePageHistory';
import { useLayoutOperations } from '@/hooks/useLayoutOperations';
import type { LayoutSelection } from '@/hooks/useLayoutOperations';
import type { LayoutBlockDragState } from '@/lib/layoutTypes';
import { blockEditorRegistry } from './blocks/blockEditorRegistry';
import { getBlocksFromContent, updateBlockContent, updateBlockResponsive, deleteBlock, duplicateBlock, moveBlock, reorderBlocks } from '@/lib/blocksService';
import { getBlockLabel } from '@/lib/blockTypes';
import { type ColumnWidth } from '@/lib/layoutTypes';
import type { Block } from '@/lib/blockTypes';
import type { Page, Section, SectionType } from '@/lib/types';
import { LayoutInspector } from './LayoutInspector';

type SaveState = 'saved' | 'saving' | 'unsaved' | 'failed' | 'publishing';

export function PageBuilder() {
  const { pageId } = useParams<{ pageId: string }>();

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showPatternPicker, setShowPatternPicker] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewSection, setPreviewSection] = useState<Section | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const [liveContentMap, setLiveContentMap] = useState<Record<string, Record<string, unknown>>>({});
  const savedSectionsRef = useRef<Section[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [activeViewport, setActiveViewport] = useState<import('@/lib/blockTypes').BlockResponsiveBreakpoint>('desktop');
  const [blockDeleteConfirm, setBlockDeleteConfirm] = useState<{ open: boolean; sectionId: string; blockId: string }>({ open: false, sectionId: '', blockId: '' });
  const [imageReplaceState, setImageReplaceState] = useState<{ sectionId: string; blockId: string } | null>(null);
  const [sectionSelectConfirm, setSectionSelectConfirm] = useState<{ open: boolean; pendingId: string | null }>({ open: false, pendingId: null });
  const [sectionDeleteConfirm, setSectionDeleteConfirm] = useState<{ open: boolean; sectionId: string }>({ open: false, sectionId: '' });
  const [layoutSelection, setLayoutSelection] = useState<LayoutSelection | null>(null);
  const [layoutDragState, setLayoutDragState] = useState<LayoutBlockDragState | null>(null);
  const [columnResizeState, setColumnResizeState] = useState<{
    sectionId: string;
    containerId: string;
    rowId: string;
    colId1: string;
    colId2: string;
    initialWidth1: number;
    initialWidth2: number;
    currentWidth1: number;
    currentWidth2: number;
    viewport: 'desktop' | 'tablet' | 'mobile';
  } | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const loadPage = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const p = await getPage(pageId);
      if (!p) {
        setLoadError('Page not found. It may have been deleted or you may not have permission to access it.');
        return;
      }
      setPage(p);
      const s = await getSections(pageId);
      history.resetHistory({
        sections: s,
        pageFields: {
          title: p.title,
          slug: p.slug,
          description: p.description || '',
          published: p.published,
        },
      });
      savedSectionsRef.current = s.map((sec) => ({ ...sec }));
      if (s.length > 0 && !selectedSectionId) {
        setSelectedSectionId(s[0].id);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to load page:', err);
      setLoadError('Failed to load page. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadPage(); }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 3000);
  };

  const undoRedoCallback = useCallback((action: 'undo' | 'redo') => {
    setToast({ message: action === 'undo' ? 'Undo' : 'Redo', variant: 'info' });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const history = usePageHistory({
    sections: [],
    pageFields: { title: '', slug: '', description: '', published: false },
  }, undoRedoCallback);

  const { sections } = history.present;
  const hasLiveContent = Object.keys(liveContentMap).length > 0;
  const dirty = history.canUndo || hasLiveContent;

  // ── Layout operations (routes through history for undo/redo) ──
  const layoutOps = useLayoutOperations({
    sections,
    selectedSectionId,
    onSectionsUpdate: (updated) => {
      history.updateSections(updated);
      setSaveState('unsaved');
    },
  });

  // Beforeunload protection
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Live content tracking — updates canvas in real-time as user types
  const handleLiveContentChange = useCallback((sectionId: string, content: Record<string, unknown>) => {
    setLiveContentMap((prev) => ({ ...prev, [sectionId]: content }));
  }, []);

  // Merge sections with live content for canvas display
  const canvasSections = useMemo(() => {
    const liveKeys = Object.keys(liveContentMap);
    if (liveKeys.length === 0) return sections;
    return sections.map((s) => {
      const live = liveContentMap[s.id];
      return live ? { ...s, content: live } : s;
    });
  }, [sections, liveContentMap]);

  // Clear live content for a section after saving
  const clearLiveContent = useCallback((sectionId: string) => {
    setLiveContentMap((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  }, []);

  // Save page settings (local draft)
  const handleSavePageSettings = async (updates: Partial<Page>) => {
    if (!pageId || !page) return;
    history.updatePageFields({
      title: updates.title ?? history.present.pageFields.title,
      slug: updates.slug ?? history.present.pageFields.slug,
      description: updates.description ?? history.present.pageFields.description,
      published: updates.published ?? history.present.pageFields.published,
    });
    setSaveState('unsaved');
      showToast('Page settings updated — save to persist', 'info');
    setShowPageSettings(false);
  };

  // Persist all changes to server
  const handleSave = async () => {
    if (!pageId || !page) return;
    setSaveState('saving');
    try {
      await updatePage(pageId, {
        title: history.present.pageFields.title,
        slug: history.present.pageFields.slug,
        description: history.present.pageFields.description || null,
        seo_title: page?.seo_title || null,
        seo_description: page?.seo_description || null,
      });

      const saved = savedSectionsRef.current;
      const updates = history.present.sections.map((section, idx) => {
        const contentToSave = liveContentMap[section.id] || section.content;
        const prev = saved.find((s) => s.id === section.id);
        const sortChanged = !prev || history.present.sections.indexOf(section) !== idx;
        const metaChanged = prev && (prev.published !== section.published || prev.title !== section.title || prev.layout !== section.layout);
        const contentChanged = !!liveContentMap[section.id];

        if (!prev || sortChanged || metaChanged || contentChanged) {
          return updateSection(section.id, {
            sort_order: idx,
            published: section.published,
            title: section.title,
            content: contentToSave,
            layout: section.layout,
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(updates);
      savedSectionsRef.current = history.present.sections.map((s) => ({ ...s }));

      // Clear all live content after successful save
      setLiveContentMap({});
      const updated = await getPage(pageId);
      if (updated) setPage(updated);
      setSaveState('saved');
      showToast('Changes saved', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Save failed:', err);
      setSaveState('failed');
      showToast('Save failed', 'error');
    }
  };

  // Publish workflow — auto-save unsaved changes first, then publish
  const handlePublishConfirm = async () => {
    if (!pageId) return;
    setShowPublishDialog(false);
    setSaveState('publishing');
    try {
      // Auto-save any unsaved changes before publishing
      const hasUnsavedContent = Object.keys(liveContentMap).length > 0;
      const hasUnsavedPageFields = history.present.pageFields.title !== (page?.title ?? '') ||
        history.present.pageFields.slug !== (page?.slug ?? '') ||
        (history.present.pageFields.description || null) !== (page?.description ?? null);
      if (hasUnsavedContent || hasUnsavedPageFields || history.canUndo) {
        await updatePage(pageId, {
          title: history.present.pageFields.title,
          slug: history.present.pageFields.slug,
          description: history.present.pageFields.description || null,
        });
        for (const section of history.present.sections) {
          const contentToSave = liveContentMap[section.id] || section.content;
          await updateSection(section.id, {
            sort_order: history.present.sections.indexOf(section),
            published: section.published,
            title: section.title,
            content: contentToSave,
            layout: section.layout,
          });
        }
        setLiveContentMap({});
      }
      await publishPage(pageId);
      history.updatePageFields({ published: true });
      const updated = await getPage(pageId);
      if (updated) setPage(updated);
      setSaveState('saved');
      showToast('Page published', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Publish failed:', err);
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
      history.updatePageFields({ published: false });
      const updated = await getPage(pageId);
      if (updated) setPage(updated);
      setSaveState('saved');
      showToast('Page unpublished', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Unpublish failed:', err);
      setSaveState('failed');
      showToast('Unpublish failed', 'error');
    }
  };

  // Section CRUD
  const handleAddSection = async (type: SectionType, variant?: string) => {
    if (!pageId) return;
    try {
      const newSection = await createSection(pageId, type);
      if (variant && variant !== 'default') {
        await updateSection(newSection.id, { layout: variant });
        newSection.layout = variant;
      }
      history.updateSections([...history.present.sections, newSection]);
      setSelectedSectionId(newSection.id);
      setShowAddSection(false);
      setSaveState('unsaved');
      showToast('Section added', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to add section:', err);
      showToast('Failed to add section', 'error');
    }
  };

  const handleInsertPattern = async (pattern: BlockPattern) => {
    if (!pageId) return;
    try {
      const blocks = instantiatePattern(pattern);
      const content = { blocks };
      const newSection = await createSection(pageId, 'blocks', pattern.name);
      const updated = { ...newSection, content };
      await updateSection(newSection.id, { content });
      history.updateSections([...history.present.sections, updated]);
      setSelectedSectionId(updated.id);
      setSaveState('unsaved');
      showToast(`"${pattern.name}" pattern added`, 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to insert pattern:', err);
      showToast('Failed to insert pattern', 'error');
    }
  };

  const handleUpdateSection = async (id: string, content: Record<string, unknown>) => {
    try {
      const updated = await updateSection(id, { content });
      history.updateSections(history.present.sections.map((s) => s.id === id ? updated : s));
      clearLiveContent(id);
      setSaveState('unsaved');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to save section:', err);
      showToast('Failed to save section', 'error');
    }
  };

  const handleUpdateSectionTitle = async (id: string, title: string) => {
    try {
      const updated = await updateSection(id, { title });
      history.updateSections(history.present.sections.map((s) => s.id === id ? updated : s));
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to update section title:', err);
      showToast('Failed to update', 'error');
    }
  };

  const handleDeleteSection = (id: string) => {
    setSectionDeleteConfirm({ open: true, sectionId: id });
  };

  const confirmSectionDelete = async () => {
    const id = sectionDeleteConfirm.sectionId;
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    setSectionDeleteConfirm({ open: false, sectionId: '' });
    try {
      await deleteSection(id);
      const next = history.present.sections.filter((s) => s.id !== id);
      history.updateSections(next);
      if (selectedSectionId === id) {
        setSelectedSectionId(next.find((s) => s.id !== id)?.id || null);
      }
      clearLiveContent(id);
      setSaveState('unsaved');
      showToast('Section deleted', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to delete section:', err);
      showToast('Delete failed', 'error');
    }
  };

  const handleDuplicateSection = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      const dup = await duplicateSection(section);
      history.updateSections([...history.present.sections, dup]);
      setSelectedSectionId(dup.id);
      setSaveState('unsaved');
      showToast('Section duplicated', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to duplicate section:', err);
      showToast('Duplicate failed', 'error');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      const updated = await toggleSectionVisibility(id, !section.published);
      history.updateSections(history.present.sections.map((s) => s.id === id ? updated : s));
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to toggle visibility:', err);
      showToast('Update failed');
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...history.present.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    history.updateSections(newSections);
    setSaveState('unsaved');
    try {
      await reorderSections(newSections);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to reorder sections:', err);
      showToast('Reorder failed', 'error');
    }
  };

  // Drag and drop (left panel)
  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = async (targetIndex: number) => {
    const sourceIndex = dragIndexRef.current;
    dragIndexRef.current = null;
    setDragOverIndex(null);
    if (sourceIndex === null || sourceIndex === targetIndex) return;

    const reordered = [...history.present.sections];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    history.updateSections(reordered);
    setSaveState('unsaved');
    try {
      await reorderSections(reordered);
      showToast('Sections reordered', 'success');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Failed to reorder sections:', err);
      showToast('Reorder failed', 'error');
    }
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  // Canvas drag reorder
  const handleCanvasReorder = async (reordered: Section[]) => {
    history.updateSections(reordered);
    setSaveState('unsaved');
    try {
      await reorderSections(reordered);
      showToast('Sections reordered', 'success');
    } catch {
      showToast('Reorder failed', 'error');
    }
  };

  // Focal point direct manipulation from canvas
  const handleFocalPointChange = useCallback((sectionId: string, slideIndex: number, focalX: number, focalY: number) => {
    setLiveContentMap((prev) => {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) return prev;
      const base = prev[sectionId] || section.content;
      const data = base as Record<string, unknown>;
      const slides = [...(data.slides as Array<Record<string, unknown>>)];
      slides[slideIndex] = { ...slides[slideIndex], focal_x: focalX, focal_y: focalY };
      return { ...prev, [sectionId]: { ...data, slides } };
    });
    setSaveState('unsaved');
  }, [sections]);

  // Canvas block reorder — route through history for undo/redo
  const handleCanvasBlockReorder = useCallback((sectionId: string, content: Record<string, unknown>) => {
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setSaveState('unsaved');
  }, [sections, history]);

  // Navigator block reorder — triggered from PageNavigator drag-and-drop
  const handleNavigatorBlockReorder = useCallback((sectionId: string, fromIndex: number, toIndex: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const newContent = reorderBlocks(base, fromIndex, toIndex);
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content: newContent } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setSaveState('unsaved');
  }, [sections, liveContentMap, history]);

  const handleSelectSection = (id: string | null) => {
    if (id && dirty) {
      setSectionSelectConfirm({ open: true, pendingId: id });
      return;
    }
    setSelectedSectionId(id);
    setSelectedBlockId(null);
    setLayoutSelection(null);
  };

  const handleImageReplace = useCallback((sectionId: string, blockId: string) => {
    setImageReplaceState({ sectionId, blockId });
  }, []);

  const handleImageReplaceSelect = useCallback((items: { public_url: string }[]) => {
    if (!imageReplaceState || !items[0]) return;
    const { sectionId, blockId } = imageReplaceState;
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const blocks = getBlocksFromContent(base);
    const updatedBlocks = blocks.map((b) =>
      b.id === blockId ? { ...b, content: { ...b.content, src: items[0].public_url } } : b
    );
    const newContent = { ...base, blocks: updatedBlocks };
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content: newContent } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
    setSaveState('unsaved');
    setImageReplaceState(null);
  }, [imageReplaceState, sections, liveContentMap, history]);

  const selectedSection = canvasSections.find((s) => s.id === selectedSectionId) || null;

  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id);
    if (id) setLayoutSelection(null);
  };

  const handleLayoutSelect = (selection: LayoutSelection | null) => {
    setLayoutSelection(selection);
    if (selection) setSelectedBlockId(null);
  };

  const handleLayoutClearSelection = () => {
    setLayoutSelection(null);
  };

  // ── Cross-column block drag handlers ──
  const handleLayoutBlockDragStart = useCallback((
    sectionId: string,
    blockId: string,
    containerId: string,
    rowId: string,
    columnId: string,
    index: number
  ) => {
    setLayoutDragState({
      blockId,
      sourceSectionId: sectionId,
      sourceContainerId: containerId,
      sourceRowId: rowId,
      sourceColumnId: columnId,
      sourceIndex: index,
      targetContainerId: null,
      targetRowId: null,
      targetColumnId: null,
      targetIndex: 0,
    });
    setSelectedBlockId(null);
    setLayoutSelection(null);
  }, []);

  const handleLayoutBlockDragOver = useCallback((
    containerId: string,
    rowId: string,
    columnId: string,
    index: number
  ) => {
    setLayoutDragState((prev) => prev ? {
      ...prev,
      targetContainerId: containerId,
      targetRowId: rowId,
      targetColumnId: columnId,
      targetIndex: index,
    } : null);
  }, []);

  const handleLayoutBlockDrop = useCallback(() => {
    if (!layoutDragState) return;
    const { sourceSectionId, blockId, sourceContainerId, sourceRowId, sourceColumnId, sourceIndex, targetContainerId, targetRowId, targetColumnId, targetIndex } = layoutDragState;

    if (!targetContainerId || !targetRowId || !targetColumnId) {
      setLayoutDragState(null);
      return;
    }

    // Same column reorder
    if (sourceContainerId === targetContainerId && sourceRowId === targetRowId && sourceColumnId === targetColumnId) {
      let adjustedIndex = targetIndex;
      if (targetIndex > sourceIndex) adjustedIndex = targetIndex - 1;
      if (adjustedIndex !== sourceIndex) {
        layoutOps.reorderBlockInColumn(sourceSectionId, sourceContainerId, sourceRowId, sourceColumnId, blockId, adjustedIndex);
        setSaveState('unsaved');
      }
    } else {
      // Cross-column move
      layoutOps.moveBlockAcrossColumns(
        sourceSectionId, blockId,
        sourceContainerId, sourceRowId, sourceColumnId,
        targetContainerId, targetRowId, targetColumnId,
        targetIndex
      );
      setSaveState('unsaved');
    }

    // Select the dropped block
    setSelectedBlockId(blockId);
    setLayoutDragState(null);
  }, [layoutDragState, layoutOps]);

  const handleLayoutBlockDragEnd = useCallback(() => {
    setLayoutDragState(null);
  }, []);

  // ── Column resize handlers ──
  const handleColumnResizeStart = useCallback((
    sectionId: string,
    containerId: string,
    rowId: string,
    colId1: string,
    colId2: string,
    initialWidth1: number,
    initialWidth2: number,
    viewport: 'desktop' | 'tablet' | 'mobile'
  ) => {
    setColumnResizeState({
      sectionId,
      containerId,
      rowId,
      colId1,
      colId2,
      initialWidth1,
      initialWidth2,
      currentWidth1: initialWidth1,
      currentWidth2: initialWidth2,
      viewport,
    });
  }, []);

  const handleColumnResizeMove = useCallback((width1: number, width2: number) => {
    setColumnResizeState((prev) => prev ? { ...prev, currentWidth1: width1, currentWidth2: width2 } : null);
  }, []);

  const handleColumnResizeCommit = useCallback(() => {
    if (!columnResizeState) return;
    const { sectionId, containerId, rowId, colId1, colId2, currentWidth1, currentWidth2, viewport } = columnResizeState;
    layoutOps.resizeColumnPair(sectionId, containerId, rowId, colId1, colId2, currentWidth1 as ColumnWidth, currentWidth2 as ColumnWidth, viewport);
    setSaveState('unsaved');
    setColumnResizeState(null);
  }, [columnResizeState, layoutOps]);

  const handleColumnResizeCancel = useCallback(() => {
    setColumnResizeState(null);
  }, []);

  // Live block content update — updates canvas immediately, persists on save
  const handleLiveBlockUpdate = useCallback((blockContent: Record<string, unknown>) => {
    if (!selectedSection || !selectedBlockId) return;
    const newContent = updateBlockContent(selectedSection.content, selectedBlockId, blockContent);
    setLiveContentMap((prev) => ({ ...prev, [selectedSection.id]: newContent }));
    setSaveState('unsaved');
  }, [selectedSection, selectedBlockId]);

  // Live block responsive update — updates canvas immediately
  const handleBlockResponsiveUpdate = useCallback((responsive: import('@/lib/blockTypes').Block['responsive']) => {
    if (!selectedSection || !selectedBlockId) return;
    const newContent = updateBlockResponsive(selectedSection.content, selectedBlockId, responsive);
    setLiveContentMap((prev) => ({ ...prev, [selectedSection.id]: newContent }));
    setSaveState('unsaved');
  }, [selectedSection, selectedBlockId]);

  // Block toolbar actions — route through history for undo/redo support
  const handleBlockMoveUp = useCallback((sectionId: string, blockId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const newContent = moveBlock(base, blockId, 'up');
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content: newContent } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setSaveState('unsaved');
  }, [sections, liveContentMap, history]);

  const handleBlockMoveDown = useCallback((sectionId: string, blockId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const newContent = moveBlock(base, blockId, 'down');
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content: newContent } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setSaveState('unsaved');
  }, [sections, liveContentMap, history]);

  const handleBlockDuplicate = useCallback((sectionId: string, blockId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const { content: newContent, newBlockId } = duplicateBlock(base, blockId);
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content: newContent } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setSelectedBlockId(newBlockId);
    setSaveState('unsaved');
  }, [sections, liveContentMap, history]);

  const handleBlockDelete = useCallback((sectionId: string, blockId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const blocks = getBlocksFromContent(base);
    if (blocks.length <= 1) return;
    setBlockDeleteConfirm({ open: true, sectionId, blockId });
  }, [sections, liveContentMap]);

  const confirmBlockDelete = useCallback(() => {
    const { sectionId, blockId } = blockDeleteConfirm;
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const base = liveContentMap[sectionId] || section.content;
    const newContent = deleteBlock(base, blockId);
    const updated = sections.map((s) => s.id === sectionId ? { ...s, content: newContent } : s);
    history.updateSections(updated);
    setLiveContentMap((prev) => { const next = { ...prev }; delete next[sectionId]; return next; });
    setSelectedBlockId(null);
    setSaveState('unsaved');
    setBlockDeleteConfirm({ open: false, sectionId: '', blockId: '' });
  }, [blockDeleteConfirm, sections, liveContentMap, history]);

  const handleBlockToolbarUpdate = useCallback((sectionId: string, blockId: string, content: Record<string, unknown>) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const newContent = updateBlockContent(section.content, blockId, content);
    setLiveContentMap((prev) => ({ ...prev, [sectionId]: newContent }));
    setSaveState('unsaved');
  }, [sections]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Escape cancels active resize
      if (e.key === 'Escape' && columnResizeState) {
        handleColumnResizeCancel();
        return;
      }
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }); // no deps - always current

  if (loading) return <AdminLoading text="Loading page..." />;
  if (loadError || !page) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-12 h-12 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={20} className="text-red-400/60" />
            </div>
            <h2 className="font-serif font-medium text-lg text-ivory mb-2">
              Unable to load page
            </h2>
            <p className="text-[0.8rem] text-white/40 mb-6">
              {loadError || 'The page could not be loaded. It may have been deleted or you may not have permission to access it.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/admin/pages"
                className="inline-flex items-center gap-1 px-4 py-2 text-[0.7rem] font-medium text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:border-white/[0.15] hover:text-white/80 transition-colors"
              >
                <ArrowLeft size={12} strokeWidth={1.5} />
                Back to Pages
              </Link>
              <button
                onClick={() => loadPage()}
                className="inline-flex items-center gap-1 px-4 py-2 text-[0.7rem] font-medium text-obsidian bg-gold rounded-lg hover:bg-gold/90 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6">
      {/* ── Top Bar ── */}
      <div className="border-b border-white/[0.06] bg-charcoal flex-shrink-0">
        {/* Unsaved changes banner */}
        {dirty && (
          <div className="px-4 py-1.5 border-b border-gold/10 bg-gold/[0.03] flex items-center gap-2">
            <AlertTriangle size={12} className="text-gold/60 shrink-0" />
            <p className="text-[0.6rem] text-gold/70 flex-1">Unsaved changes</p>
            <button
              onClick={() => setShowUnsavedDialog(true)}
              className="text-[0.55rem] text-white/30 hover:text-white/50 transition-colors"
            >
              Discard
            </button>
          </div>
        )}

        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin/pages"
              className="flex items-center justify-center w-7 h-7 rounded text-white/30 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] transition-colors shrink-0"
              aria-label="Back to pages"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
            </Link>
            <div className="min-w-0">
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-gold/60 truncate">
                PAGE BUILDER
              </p>
              <h1 className="font-serif font-medium text-sm tracking-tight text-ivory truncate">
                {history.present.pageFields.title || 'Untitled'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <SaveStateIndicator state={saveState} />

            <button
              onClick={handleSave}
              disabled={saveState === 'saving' || saveState === 'saved'}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.1em] rounded transition-all ${
                saveState === 'unsaved' || saveState === 'failed'
                  ? 'bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25'
                  : 'text-white/20 border border-white/[0.06] cursor-not-allowed'
              }`}
              title="Save (Ctrl+S)"
            >
              <Save size={10} strokeWidth={1.5} />
              Save
            </button>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <button
              onClick={history.undo}
              disabled={!history.canUndo}
              className="p-1.5 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} />
            </button>
            <button
              onClick={history.redo}
              disabled={!history.canRedo}
              className="p-1.5 text-white/30 hover:text-white/60 disabled:text-white/10 disabled:cursor-not-allowed rounded transition-colors"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={13} />
            </button>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <button
              onClick={() => setShowPageSettings(!showPageSettings)}
              className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors"
              title="Page Settings"
            >
              <Settings size={13} />
            </button>
            <button
              onClick={() => setShowFullPreview(true)}
              className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors"
              title="Full Preview"
            >
              <Maximize2 size={13} />
            </button>
            <Link
              to={`/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors"
              title="View Live"
            >
              <ExternalLink size={13} />
            </Link>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <button
              onClick={() => setShowPublishDialog(true)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.1em] rounded transition-all ${
                history.present.pageFields.published
                  ? 'bg-green-600/10 text-green-400 border border-green-600/20 hover:bg-green-600/20'
                  : 'bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20'
              }`}
            >
              {history.present.pageFields.published ? (
                <><Globe size={10} strokeWidth={1.5} /> Published</>
              ) : (
                <><EyeIcon size={10} strokeWidth={1.5} /> Publish</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Page Settings Panel (collapsible) */}
      {showPageSettings && (
        <div className="border-b border-white/[0.06] bg-charcoal flex-shrink-0">
          <PageSettingsPanel
            page={page}
            pageFields={history.present.pageFields}
            onSave={handleSavePageSettings}
            onClose={() => setShowPageSettings(false)}
          />
        </div>
      )}

      {/* ── Main Content: 3-panel layout ── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* ── Left Panel: Hierarchical Page Navigator ── */}
        <div className="w-72 border-r border-white/[0.06] bg-charcoal flex flex-col flex-shrink-0">
          <PageNavigator
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelectSection={setSelectedSectionId}
            onSelectBlock={(sectionId, blockId) => {
              setSelectedSectionId(sectionId);
              setSelectedBlockId(blockId);
              setLayoutSelection(null);
            }}
            onDeleteSection={handleDeleteSection}
            onDuplicateSection={handleDuplicateSection}
            onToggleVisibility={handleToggleVisibility}
            onPreviewSection={(section) => setPreviewSection(section)}
            onMoveSection={handleMoveSection}
            onAddSection={() => setShowAddSection(true)}
            onInsertPattern={() => setShowPatternPicker(true)}
            sectionDragIndex={null}
            sectionDragOverIndex={dragOverIndex}
            onSectionDragStart={handleDragStart}
            onSectionDragOver={handleDragOver}
            onSectionDrop={handleDrop}
            onSectionDragEnd={handleDragEnd}
            onBlockReorder={handleNavigatorBlockReorder}
            onLayoutBlockReorder={(sectionId, containerId, rowId, columnId, blockId, toIndex) => {
              layoutOps.reorderBlockInColumn(sectionId, containerId, rowId, columnId, blockId, toIndex);
              setSaveState('unsaved');
            }}
            onLayoutBlockMoveCrossColumn={(sectionId, blockId, srcContainerId, srcRowId, srcColumnId, tgtContainerId, tgtRowId, tgtColumnId, targetIndex) => {
              layoutOps.moveBlockAcrossColumns(sectionId, blockId, srcContainerId, srcRowId, srcColumnId, tgtContainerId, tgtRowId, tgtColumnId, targetIndex);
              setSaveState('unsaved');
            }}
            layoutSelection={layoutSelection}
            onSelectLayout={handleLayoutSelect}
          />
        </div>

        {/* ── Center: Visual Canvas ── */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <VisualCanvas
            sections={canvasSections}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSelectSection}
            onReorder={handleCanvasReorder}
            onSectionUpdate={handleCanvasBlockReorder}
            onFocalPointChange={handleFocalPointChange}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            blockToolbar={{
              sectionId: selectedSectionId || undefined,
              onBlockMoveUp: handleBlockMoveUp,
              onBlockMoveDown: handleBlockMoveDown,
              onBlockDuplicate: handleBlockDuplicate,
              onBlockDelete: handleBlockDelete,
              onBlockUpdateContent: handleBlockToolbarUpdate,
              onOpenBlockInspector: selectedBlockId ? () => setShowEditor(true) : undefined,
              onImageReplace: handleImageReplace,
              onFocalPoint: selectedBlockId ? () => setShowEditor(true) : undefined,
            }}
            activeViewport={activeViewport}
            onViewportChange={setActiveViewport}
            layoutSelection={layoutSelection}
            onSelectLayout={handleLayoutSelect}
            layoutDragState={layoutDragState}
            onLayoutBlockDragStart={handleLayoutBlockDragStart}
            onLayoutBlockDragOver={handleLayoutBlockDragOver}
            onLayoutBlockDrop={handleLayoutBlockDrop}
            onLayoutBlockDragEnd={handleLayoutBlockDragEnd}
            hoveredBlockId={hoveredBlockId}
            onHoverBlock={setHoveredBlockId}
            columnResizeState={columnResizeState}
            onColumnResizeStart={handleColumnResizeStart}
            onColumnResizeMove={handleColumnResizeMove}
            onColumnResizeCommit={handleColumnResizeCommit}
            onColumnResizeCancel={handleColumnResizeCancel}
          />
        </div>

        {/* ── Right Panel: Section Editor (collapsible) ── */}
        <div
          className={`border-l border-white/[0.06] bg-charcoal flex flex-col flex-shrink-0 transition-all duration-200 ${
            showEditor ? 'w-[420px]' : 'w-10'
          }`}
        >
          {showEditor ? (
            <>
              <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Editor
                </h2>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-1 text-white/20 hover:text-white/50 rounded transition-colors"
                  title="Collapse editor"
                >
                  <PanelRightClose size={13} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                {selectedBlockId && selectedSection ? (
                  <BlockInspector
                    section={selectedSection}
                    blockId={selectedBlockId}
                    onClearSelection={() => setSelectedBlockId(null)}
                    onUpdateBlock={(blockContent) => {
                      if (!selectedSection) return;
                      const newContent = updateBlockContent(selectedSection.content, selectedBlockId, blockContent);
                      handleUpdateSection(selectedSection.id, newContent);
                    }}
                    onLiveUpdate={handleLiveBlockUpdate}
                    onResponsiveUpdate={handleBlockResponsiveUpdate}
                  />
                ) : layoutSelection && selectedSection ? (
                  <LayoutInspector
                    section={selectedSection}
                    selection={layoutSelection}
                    onClearSelection={handleLayoutClearSelection}
                    onUpdateContainer={(containerId, patch) => layoutOps.updateContainer(selectedSection.id, containerId, patch)}
                    onUpdateContainerResponsive={(containerId, bp, patch) => layoutOps.updateContainerResponsive(selectedSection.id, containerId, bp, patch)}
                    onDeleteContainer={(containerId) => layoutOps.deleteContainer(selectedSection.id, containerId)}
                    onUpdateRow={(containerId, rowId, patch) => layoutOps.updateRow(selectedSection.id, containerId, rowId, patch)}
                    onUpdateRowResponsive={(containerId, rowId, bp, patch) => layoutOps.updateRowResponsive(selectedSection.id, containerId, rowId, bp, patch)}
                    onDeleteRow={(containerId, rowId) => layoutOps.deleteRow(selectedSection.id, containerId, rowId)}
                    onAddRow={(containerId) => layoutOps.addRow(selectedSection.id, containerId)}
                    onUpdateColumn={(containerId, rowId, columnId, patch) => layoutOps.updateColumn(selectedSection.id, containerId, rowId, columnId, patch)}
                    onUpdateColumnResponsive={(containerId, rowId, columnId, bp, patch) => layoutOps.updateColumnResponsive(selectedSection.id, containerId, rowId, columnId, bp, patch)}
                    onDeleteColumn={(containerId, rowId, columnId) => layoutOps.deleteColumn(selectedSection.id, containerId, rowId, columnId)}
                    onAddColumn={(containerId, rowId) => layoutOps.addColumn(selectedSection.id, containerId, rowId)}
                    canDeleteColumn={(containerId, rowId, columnId) => layoutOps.canDeleteColumn(selectedSection.id, containerId, rowId, columnId)}
                    viewport={activeViewport}
                  />
                ) : selectedSection ? (
                  <SectionEditor
                    key={selectedSection.id}
                    section={selectedSection}
                    onUpdate={(content) => handleUpdateSection(selectedSection.id, content)}
                    onUpdateTitle={(title) => handleUpdateSectionTitle(selectedSection.id, title)}
                    onDirty={() => setSaveState('unsaved')}
                    onPreview={(content) => handleLiveContentChange(selectedSection.id, content)}
                    onTogglePublish={() => handleToggleVisibility(selectedSection.id)}
                  />
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-[0.75rem] text-white/30 mb-1">Select a section to edit</p>
                    <p className="text-[0.65rem] text-white/20">Click any section on the canvas or in the list.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center justify-center h-full text-white/20 hover:text-white/50 transition-colors"
              title="Open editor"
            >
              <PanelRightOpen size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <AddSectionModal
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        onSelect={handleAddSection}
      />

      <PatternPicker
        open={showPatternPicker}
        onClose={() => setShowPatternPicker(false)}
        onSelect={handleInsertPattern}
      />

      {previewSection && (
        <SectionPreviewModal
          open={!!previewSection}
          onClose={() => setPreviewSection(null)}
          section={previewSection}
          title={getSectionLabel(previewSection.section_type as SectionType)}
        />
      )}

      <FullPagePreview
        open={showFullPreview}
        page={page}
        sections={canvasSections}
        onClose={() => setShowFullPreview(false)}
      />

      <PublishConfirmDialog
        open={showPublishDialog}
        action={history.present.pageFields.published ? 'unpublish' : 'publish'}
        pageTitle={history.present.pageFields.title}
        sections={sections}
        onConfirm={history.present.pageFields.published ? handleUnpublish : handlePublishConfirm}
        onCancel={() => setShowPublishDialog(false)}
      />

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onConfirm={() => {
          setShowUnsavedDialog(false);
          if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
          }
        }}
        onCancel={() => {
          setShowUnsavedDialog(false);
          setPendingNavigation(null);
        }}
      />

      <ConfirmDialog
        open={blockDeleteConfirm.open}
        title="Delete block"
        message="Are you sure you want to delete this block? This action can be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmBlockDelete}
        onCancel={() => setBlockDeleteConfirm({ open: false, sectionId: '', blockId: '' })}
      />

      <ConfirmDialog
        open={sectionSelectConfirm.open}
        title="Unsaved changes"
        message="You have unsaved changes. Switching sections will discard them."
        confirmLabel="Discard"
        variant="warning"
        onConfirm={() => {
          if (selectedSectionId) {
            clearLiveContent(selectedSectionId);
          }
          setSelectedSectionId(sectionSelectConfirm.pendingId);
          setSelectedBlockId(null);
          setLayoutSelection(null);
          setSectionSelectConfirm({ open: false, pendingId: null });
        }}
        onCancel={() => setSectionSelectConfirm({ open: false, pendingId: null })}
      />

      <ConfirmDialog
        open={sectionDeleteConfirm.open}
        title="Delete section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmSectionDelete}
        onCancel={() => setSectionDeleteConfirm({ open: false, sectionId: '' })}
      />

      <MediaPicker
        open={!!imageReplaceState}
        onClose={() => setImageReplaceState(null)}
        onSelect={handleImageReplaceSelect}
        mode="single"
      />

        {toast && <Toast message={toast.message} variant={toast.variant} />}
    </div>
  );
}

/* ── Save State Indicator ── */
function SaveStateIndicator({ state }: { state: SaveState }) {
  const config = {
    saved: { icon: Check, label: 'Saved', className: 'text-green-400', bg: 'bg-green-400/10' },
    saving: { icon: Loader2, label: 'Saving...', className: 'text-stone animate-spin', bg: 'bg-white/[0.04]' },
    unsaved: { icon: AlertTriangle, label: 'Unsaved', className: 'text-gold', bg: 'bg-gold/10' },
    failed: { icon: X, label: 'Failed', className: 'text-red-400', bg: 'bg-red-400/10' },
    publishing: { icon: Loader2, label: 'Publishing...', className: 'text-gold animate-spin', bg: 'bg-gold/10' },
  }[state];

  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[0.6rem] font-medium ${config.className} ${config.bg} transition-all duration-300`}>
      <Icon size={11} strokeWidth={1.5} />
      <span>{config.label}</span>
    </div>
  );
}

/* ── Page Settings Panel ── */
function PageSettingsPanel({
  page,
  pageFields,
  onSave,
  onClose,
}: {
  page: Page;
  pageFields: { title: string; slug: string; description: string; published: boolean };
  onSave: (updates: Partial<Page>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(pageFields.title);
  const [slug, setSlug] = useState(pageFields.slug);
  const [description, setDescription] = useState(pageFields.description);
  const [seoTitle, setSeoTitle] = useState(page.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(page.seo_description || '');

  useEffect(() => {
    setTitle(pageFields.title);
    setSlug(pageFields.slug);
    setDescription(pageFields.description);
  }, [pageFields.title, pageFields.slug, pageFields.description]);

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/30">Page Settings</h3>
        <button onClick={onClose} className="text-[0.6rem] text-white/30 hover:text-white/50 transition-colors">
          Close
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AdminInput label="Page Title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <AdminInput label="Slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <AdminInput label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <h4 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-2.5">
          SEO
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AdminInput
            label="SEO Title"
            name="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder={title || 'Page title'}
          />
          <AdminInput
            label="SEO Description"
            name="seoDescription"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Brief description for search engines"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <AdminButton
          onClick={() => onSave({ title, slug, description, seo_title: seoTitle, seo_description: seoDescription })}
          size="sm"
        >
          Save Settings
        </AdminButton>
      </div>
    </div>
  );
}

/* ── Block Inspector (right panel when a block is selected) ── */
function BlockInspector({
  section,
  blockId,
  onClearSelection,
  onLiveUpdate,
  onResponsiveUpdate,
}: {
  section: Section;
  blockId: string;
  onClearSelection: () => void;
  onUpdateBlock: (content: Record<string, unknown>) => void;
  onLiveUpdate: (content: Record<string, unknown>) => void;
  onResponsiveUpdate: (responsive: import('@/lib/blockTypes').Block['responsive']) => void;
}) {
  const blocks = getBlocksFromContent(section.content);
  const block = blocks.find((b) => b.id === blockId) || null;

  if (!block) {
    return (
      <div className="p-6 text-center">
        <p className="text-[0.75rem] text-white/30">Block not found.</p>
        <button onClick={onClearSelection} className="mt-2 text-[0.65rem] text-gold/60 hover:text-gold">
          Back to section
        </button>
      </div>
    );
  }

  const Editor = blockEditorRegistry[block.type];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-0.5">
            BLOCK
          </p>
          <h2 className="font-serif font-medium text-sm tracking-tight text-ivory truncate">
            {getBlockLabel(block.type)}
          </h2>
        </div>
        <button
          onClick={onClearSelection}
          className="text-[0.55rem] text-white/30 hover:text-white/50 transition-colors"
        >
          Back to section
        </button>
      </div>

      {/* Block editor */}
      <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {Editor ? (
          <Editor
            content={block.content}
            onChange={onLiveUpdate}
            responsive={block.responsive}
            onResponsiveChange={onResponsiveUpdate}
          />
        ) : (
          <p className="text-[0.7rem] text-white/30">No editor for {block.type}</p>
        )}
      </div>
    </div>
  );
}

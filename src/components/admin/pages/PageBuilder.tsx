import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Eye, EyeOff, GripVertical, Copy, Trash2,
  ExternalLink, Settings, AlertTriangle, Maximize2, ChevronUp, ChevronDown,
  Undo2, Redo2, Save, Globe, Eye as EyeIcon, Loader2, Check, X,
  PanelRightOpen, PanelRightClose,
} from 'lucide-react';
import { AdminLoading, AdminButton, AdminInput, Toast } from '@/components/admin/AdminUI';
import { getPage, updatePage, publishPage, unpublishPage, duplicatePage } from '@/lib/pagesService';
import {
  getSections, createSection, updateSection, deleteSection,
  duplicateSection, reorderSections, toggleSectionVisibility,
} from '@/lib/sectionsService';
import { SECTION_TYPES, getSectionLabel } from '@/lib/sectionTypes';
import { VisualCanvas } from './VisualCanvas';
import { SectionEditor } from './SectionEditor';
import { AddSectionModal } from './AddSectionModal';
import { SectionPreviewModal } from './SectionPreviewModal';
import { SectionNavigator } from './SectionNavigator';
import FullPagePreview from './FullPagePreview';
import PublishConfirmDialog from './PublishConfirmDialog';
import UnsavedChangesDialog from './UnsavedChangesDialog';
import { usePageHistory } from '@/hooks/usePageHistory';
import type { Page, Section, SectionType } from '@/lib/types';

type SaveState = 'saved' | 'saving' | 'unsaved' | 'failed' | 'publishing';

export function PageBuilder() {
  const { pageId } = useParams<{ pageId: string }>();

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewSection, setPreviewSection] = useState<Section | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const [liveContentMap, setLiveContentMap] = useState<Record<string, Record<string, unknown>>>({});
  const dragIndexRef = useRef<number | null>(null);

  const history = usePageHistory({
    sections: [],
    pageFields: { title: '', slug: '', description: '', published: false },
  });

  const { sections } = history.present;
  const dirty = history.canUndo || history.canRedo;

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

  const loadPage = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    try {
      const p = await getPage(pageId);
      setPage(p);
      const s = await getSections(pageId);
      history.pushState({
        sections: s,
        pageFields: {
          title: p.title,
          slug: p.slug,
          description: p.description || '',
          published: p.published,
        },
      });
      if (s.length > 0 && !selectedSectionId) {
        setSelectedSectionId(s[0].id);
      }
    } catch {
      setToast('Failed to load page');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadPage(); }, [pageId]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Live content tracking — updates canvas in real-time as user types
  const handleLiveContentChange = useCallback((sectionId: string, content: Record<string, unknown>) => {
    setLiveContentMap((prev) => ({ ...prev, [sectionId]: content }));
  }, []);

  // Merge sections with live content for canvas display
  const canvasSections = sections.map((s) => ({
    ...s,
    content: liveContentMap[s.id] || s.content,
  }));

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
    showToast('Page settings updated');
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
      // Clear all live content after successful save
      setLiveContentMap({});
      const updated = await getPage(pageId);
      setPage(updated);
      setSaveState('saved');
      showToast('Changes saved');
    } catch {
      setSaveState('failed');
      showToast('Save failed');
    }
  };

  // Publish workflow
  const handlePublishConfirm = async () => {
    if (!pageId) return;
    setShowPublishDialog(false);
    setSaveState('publishing');
    try {
      await publishPage(pageId);
      history.updatePageFields({ published: true });
      const updated = await getPage(pageId);
      setPage(updated);
      setSaveState('saved');
      showToast('Page published');
    } catch {
      setSaveState('failed');
      showToast('Publish failed');
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
      setPage(updated);
      setSaveState('saved');
      showToast('Page unpublished');
    } catch {
      setSaveState('failed');
      showToast('Unpublish failed');
    }
  };

  // Section CRUD
  const handleAddSection = async (type: SectionType) => {
    if (!pageId) return;
    try {
      const newSection = await createSection(pageId, type);
      history.updateSections([...history.present.sections, newSection]);
      setSelectedSectionId(newSection.id);
      setShowAddSection(false);
      setSaveState('unsaved');
      showToast('Section added');
    } catch {
      showToast('Failed to add section');
    }
  };

  const handleUpdateSection = async (id: string, content: Record<string, unknown>) => {
    try {
      const updated = await updateSection(id, { content });
      history.updateSections(history.present.sections.map((s) => s.id === id ? updated : s));
      clearLiveContent(id);
      setSaveState('unsaved');
    } catch {
      showToast('Failed to save section');
    }
  };

  const handleUpdateSectionTitle = async (id: string, title: string) => {
    try {
      const updated = await updateSection(id, { title });
      history.updateSections(history.present.sections.map((s) => s.id === id ? updated : s));
    } catch {
      showToast('Failed to update');
    }
  };

  const handleDeleteSection = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    if (!confirm(`Delete "${getSectionLabel(section.section_type as SectionType)}"?\n\nThis action cannot be undone.`)) return;
    try {
      await deleteSection(id);
      const next = history.present.sections.filter((s) => s.id !== id);
      history.updateSections(next);
      if (selectedSectionId === id) {
        setSelectedSectionId(next.find((s) => s.id !== id)?.id || null);
      }
      clearLiveContent(id);
      setSaveState('unsaved');
      showToast('Section deleted');
    } catch {
      showToast('Delete failed');
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
      showToast('Section duplicated');
    } catch {
      showToast('Duplicate failed');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      const updated = await toggleSectionVisibility(id, !section.published);
      history.updateSections(history.present.sections.map((s) => s.id === id ? updated : s));
    } catch {
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
    } catch {
      showToast('Reorder failed');
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
      showToast('Sections reordered');
    } catch {
      showToast('Reorder failed');
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
      showToast('Sections reordered');
    } catch {
      showToast('Reorder failed');
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

  const handleSelectSection = (id: string | null) => {
    if (id && dirty && !confirm('You have unsaved changes. Discard them?')) return;
    setSelectedSectionId(id);
  };

  const handleDuplicatePage = async () => {
    if (!pageId) return;
    try {
      const newPage = await duplicatePage(pageId);
      showToast('Page duplicated');
      window.location.href = `/admin/pages/${newPage.id}/edit`;
    } catch {
      showToast('Duplicate failed');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || null;

  if (loading) return <AdminLoading text="Loading page..." />;
  if (!page) return <div className="py-16 text-center text-red-400/70">Page not found.</div>;

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
        {/* ── Left Panel: Section Structure ── */}
        <div className="w-72 border-r border-white/[0.06] bg-charcoal flex flex-col flex-shrink-0">
          <div className="px-3 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25">
              Sections
            </h2>
            <span className="text-[0.5rem] text-white/15">{sections.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {sections.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[0.7rem] text-white/30 mb-3">No sections yet</p>
                <AdminButton size="sm" onClick={() => setShowAddSection(true)} className="gap-1.5">
                  <Plus size={10} strokeWidth={1.5} /> Add Section
                </AdminButton>
              </div>
            ) : (
              <div className="space-y-0.5">
                {sections.map((section, i) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    index={i}
                    isSelected={section.id === selectedSectionId}
                    total={sections.length}
                    dragOver={dragOverIndex === i}
                    onSelect={() => setSelectedSectionId(section.id)}
                    onDelete={() => handleDeleteSection(section.id)}
                    onDuplicate={() => handleDuplicateSection(section.id)}
                    onToggleVisibility={() => handleToggleVisibility(section.id)}
                    onPreview={() => setPreviewSection(section)}
                    onMoveUp={() => handleMoveSection(i, 'up')}
                    onMoveDown={() => handleMoveSection(i, 'down')}
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDrop={() => handleDrop(i)}
                    onDragEnd={handleDragEnd}
                  />
                ))}

                <button
                  onClick={() => setShowAddSection(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 border border-dashed border-white/[0.08] rounded text-[0.65rem] text-white/25 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  <Plus size={11} strokeWidth={1.5} /> Add Section
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Center: Visual Canvas ── */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <VisualCanvas
            sections={canvasSections}
            selectedSectionId={selectedSectionId}
            onSelectSection={setSelectedSectionId}
            onReorder={handleCanvasReorder}
            onFocalPointChange={handleFocalPointChange}
          />
        </div>

        {/* ── Right Panel: Section Editor (collapsible) ── */}
        <div
          className={`border-l border-white/[0.06] bg-charcoal flex flex-col flex-shrink-0 transition-all duration-200 ${
            showEditor ? 'w-[380px]' : 'w-10'
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
              <div className="flex-1 overflow-y-auto">
                {selectedSection ? (
                  <SectionEditor
                    key={selectedSection.id}
                    section={selectedSection}
                    onUpdate={(content) => handleUpdateSection(selectedSection.id, content)}
                    onUpdateTitle={(title) => handleUpdateSectionTitle(selectedSection.id, title)}
                    onDirty={() => setSaveState('unsaved')}
                    onPreview={(content) => handleLiveContentChange(selectedSection.id, content)}
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

      {toast && <Toast message={toast} />}
    </div>
  );
}

/* ── Save State Indicator ── */
function SaveStateIndicator({ state }: { state: SaveState }) {
  const config = {
    saved: { icon: Check, label: 'Saved', className: 'text-green-400' },
    saving: { icon: Loader2, label: 'Saving...', className: 'text-stone animate-spin' },
    unsaved: { icon: AlertTriangle, label: 'Unsaved', className: 'text-gold' },
    failed: { icon: X, label: 'Failed', className: 'text-red-400' },
    publishing: { icon: Loader2, label: 'Publishing...', className: 'text-gold animate-spin' },
  }[state];

  const Icon = config.icon;
  return (
    <div className={`flex items-center gap-1 text-[0.55rem] ${config.className}`}>
      <Icon size={11} />
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

/* ── Section Row (draggable) ── */
function SectionRow({
  section,
  index,
  isSelected,
  total,
  dragOver,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onPreview,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  section: Section;
  index: number;
  isSelected: boolean;
  total: number;
  dragOver: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onPreview: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const label = getSectionLabel(section.section_type as SectionType);
  const config = SECTION_TYPES[section.section_type as SectionType];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`group flex items-center gap-1.5 px-2 py-2 rounded cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-gold/[0.08] border border-gold/20'
          : dragOver
          ? 'border border-gold/30 bg-gold/[0.04]'
          : 'border border-transparent hover:bg-white/[0.02] hover:border-white/[0.06]'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      <GripVertical size={11} className="text-white/10 shrink-0 cursor-grab active:cursor-grabbing" />

      <span className="text-[0.5rem] font-semibold text-white/20 w-4 shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="flex-1 min-w-0">
        <p className={`text-[0.7rem] font-medium truncate ${isSelected ? 'text-ivory' : 'text-white/60'}`}>
          {label}
        </p>
        {config && (
          <p className="text-[0.55rem] text-white/20 truncate">
            {config.icon} {config.description}
          </p>
        )}
      </div>

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
        className="shrink-0 text-white/15 hover:text-gold transition-colors"
        aria-label="Preview section"
        title="Preview section"
      >
        <Maximize2 size={11} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        className="shrink-0"
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
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="text-[0.55rem] text-white/20 hover:text-white/50 px-0.5"
          aria-label="Section actions"
          aria-expanded={menuOpen}
        >
          ···
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-charcoal border border-white/[0.08] rounded-lg shadow-xl py-1">
              <MenuAction onClick={() => { onDuplicate(); setMenuOpen(false); }}>Duplicate</MenuAction>
              <div className="border-t border-white/[0.06] my-0.5" />
              <MenuAction danger onClick={() => { onDelete(); setMenuOpen(false); }}>Delete</MenuAction>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
      }`}
    >
      {children}
    </button>
  );
}

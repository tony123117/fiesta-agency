import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, ArrowLeft, Loader2, Check, AlertCircle, Home, Calendar,
  Briefcase, LayoutGrid, Users, Mail, FileText,
} from 'lucide-react';
import { AdminInput } from '@/components/admin/AdminUI';
import { createPage } from '@/lib/pagesService';
import { createSection, updateSection } from '@/lib/sectionsService';
import { getPageBySlug } from '@/lib/pagesService';
import { PAGE_TEMPLATES, getTemplateById, type PageTemplate } from '@/lib/pageTemplates';
import { SectionThumbnail } from './SectionThumbnail';
import type { SectionType } from '@/lib/types';

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home size={18} />,
  Calendar: <Calendar size={18} />,
  Briefcase: <Briefcase size={18} />,
  LayoutGrid: <LayoutGrid size={18} />,
  Users: <Users size={18} />,
  Mail: <Mail size={18} />,
  FileText: <FileText size={18} />,
};

interface CreatePageModalProps {
  open: boolean;
  onClose: () => void;
}

type View = 'select' | 'configure' | 'creating';

export default function CreatePageModal({ open, onClose }: CreatePageModalProps) {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [slugError, setSlugError] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);

  useEffect(() => {
    if (!open) {
      setView('select');
      setSelectedTemplate(null);
      setTitle('');
      setSlug('');
      setDescription('');
      setSlugError('');
      setCreating(false);
      setError('');
      setPreviewTemplate(null);
    }
  }, [open]);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (selectedTemplate) {
      setSlug(slugify(value));
    }
    setSlugError('');
  };

  const handleSlugChange = (value: string) => {
    setSlug(slugify(value));
    setSlugError('');
  };

  const handleSelectTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setTitle(template.pageDefaults.title);
    setSlug(template.pageDefaults.slug);
    setDescription(template.pageDefaults.description);
    setSlugError('');
    setView('configure');
  };

  const handleCreate = async () => {
    if (!selectedTemplate) return;
    if (!title.trim()) { setError('Page title is required.'); return; }
    if (!slug.trim()) { setError('Page slug is required.'); return; }

    setSlugError('');
    setError('');
    setCreating(true);
    setView('creating');

    try {
      const existing = await getPageBySlug(slug);
      if (existing) {
        setSlugError(`Slug "${slug}" already exists. Try "${slug}-2".`);
        setView('configure');
        setCreating(false);
        return;
      }

      const page = await createPage({
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        published: false,
      });

      for (let i = 0; i < selectedTemplate.sections.length; i++) {
        const def = selectedTemplate.sections[i];
        const section = await createSection(page.id, def.type as SectionType, def.title);
        await updateSection(section.id, { content: def.content, published: false, sort_order: i });
      }

      navigate(`/admin/pages/${page.id}`);
    } catch {
      setError('Failed to create page. Please try again.');
      setView('configure');
      setCreating(false);
    }
  };

  const handlePreviewKeyDown = (e: React.KeyboardEvent, template: PageTemplate) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setPreviewTemplate(template);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-10 px-4">
      <div className="bg-charcoal rounded-xl border border-white/[0.08] w-full max-w-4xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {view === 'configure' && (
              <button
                onClick={() => { setView('select'); setSelectedTemplate(null); setError(''); setSlugError(''); }}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold mb-0.5">
                {view === 'select' ? 'CREATE PAGE' : view === 'configure' ? 'PAGE SETTINGS' : 'CREATING'}
              </p>
              <h2 className="text-lg font-medium text-warm-white font-heading">
                {view === 'select' ? 'Choose a Template' : view === 'configure' ? `Using: ${selectedTemplate?.name}` : 'Creating your page...'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {view === 'select' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PAGE_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleSelectTemplate(template)}
                  onPreview={() => setPreviewTemplate(template)}
                />
              ))}
            </div>
          )}

          {view === 'configure' && selectedTemplate && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                  {ICON_MAP[selectedTemplate.icon] || <FileText size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-warm-white">{selectedTemplate.name} Template</p>
                  <p className="text-xs text-white/40">{selectedTemplate.sectionCount} sections will be created as drafts</p>
                </div>
              </div>

              <AdminInput
                label="Page Title"
                name="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter page title"
              />

              <div>
                <AdminInput
                  label="Slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="page-slug"
                />
                {slugError && (
                  <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle size={12} /> {slugError}
                  </p>
                )}
              </div>

              <AdminInput
                label="Description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief page description (optional)"
              />

              {error && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle size={12} /> {error}
                </p>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => { setView('select'); setSelectedTemplate(null); setError(''); setSlugError(''); }}
                  className="px-4 py-2 text-sm text-stone hover:text-warm-white bg-charcoal border border-stone/20 rounded-lg hover:border-stone/40 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !title.trim() || !slug.trim()}
                  className="px-5 py-2 text-sm font-medium text-obsidian bg-gold rounded-lg hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Create Draft
                </button>
              </div>
            </div>
          )}

          {view === 'creating' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={32} className="text-gold animate-spin mb-4" />
              <p className="text-sm text-stone">Creating page and sections...</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => { setPreviewTemplate(null); handleSelectTemplate(previewTemplate); }}
        />
      )}
    </div>
  );
}

/* ── Template Card ── */
function TemplateCard({
  template,
  onSelect,
  onPreview,
}: {
  template: PageTemplate;
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group border border-white/[0.06] rounded-lg overflow-hidden hover:border-gold/20 transition-all">
      {/* Visual Preview Strip */}
      <div className="h-40 bg-obsidian relative overflow-hidden">
        <TemplateVisualPreview template={template} />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-ivory">{template.name}</p>
            <p className="text-[0.6rem] text-white/40">{template.sectionCount} sections</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="text-[0.6rem] text-white/50 hover:text-gold px-2 py-1 rounded bg-charcoal/60 transition-colors"
          >
            Preview
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-white/40 mb-3 line-clamp-2">{template.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[0.6rem] text-white/25 uppercase tracking-wider">{template.recommendedFor}</span>
          <button
            onClick={onSelect}
            className="px-3 py-1.5 text-[0.65rem] font-semibold text-obsidian bg-gold rounded hover:bg-gold/90 transition-colors"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Template Visual Preview (miniature section strip) ── */
function TemplateVisualPreview({ template }: { template: PageTemplate }) {
  if (template.sections.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <FileText size={24} className="text-white/10" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {template.sections.slice(0, 5).map((section, i) => (
        <div key={i} className="flex-1 min-h-0">
          <SectionThumbnail type={section.type as SectionType} />
        </div>
      ))}
    </div>
  );
}

/* ── Template Preview Modal ── */
function TemplatePreviewModal({
  template,
  onClose,
  onUse,
}: {
  template: PageTemplate;
  onClose: () => void;
  onUse: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-charcoal rounded-xl border border-white/[0.08] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-lg font-medium text-warm-white font-heading">{template.name} Template</h3>
            <p className="text-xs text-white/40 mt-0.5">{template.description}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Visual Preview */}
          <div className="border border-white/[0.06] rounded-lg overflow-hidden mb-6">
            <div className="bg-obsidian" style={{ height: '400px' }}>
              <div className="w-full h-full flex flex-col">
                {template.sections.map((section, i) => (
                  <div key={i} className="flex-1 min-h-0 border-b border-white/[0.04] last:border-b-0">
                    <SectionThumbnail type={section.type as SectionType} />
                  </div>
                ))}
                {template.sections.length === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                    Blank page — no sections
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section List */}
          <div>
            <h4 className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-3">
              Sections ({template.sections.length})
            </h4>
            <div className="space-y-1">
              {template.sections.map((section, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded bg-white/[0.02]">
                  <span className="text-[0.55rem] font-mono text-white/20 w-5 text-right">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-ivory/70">{section.title}</span>
                  <span className="text-[0.6rem] text-white/20 ml-auto">{section.type}</span>
                </div>
              ))}
              {template.sections.length === 0 && (
                <p className="text-xs text-white/30 py-2">No sections — you'll start with a blank canvas.</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-stone hover:text-warm-white bg-charcoal border border-stone/20 rounded-lg hover:border-stone/40 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onUse}
            className="px-5 py-2 text-sm font-medium text-obsidian bg-gold rounded-lg hover:bg-gold/90 transition-colors"
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
}

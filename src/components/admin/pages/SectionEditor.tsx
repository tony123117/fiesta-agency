import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AdminButton, AdminInput } from '@/components/admin/AdminUI';
import { sectionEditorRegistry } from './SectionEditorRegistry';
import { getSectionLabel } from '@/lib/sectionTypes';
import { toggleSectionVisibility } from '@/lib/sectionsService';
import type { Section, SectionType } from '@/lib/types';

export function SectionEditor({
  section,
  onUpdate,
  onUpdateTitle,
  onDirty,
  onPreview,
  onTogglePublish,
}: {
  section: Section;
  onUpdate: (content: Record<string, unknown>) => void;
  onUpdateTitle: (title: string) => void;
  onDirty: () => void;
  onPreview?: (content: Record<string, unknown>) => void;
  onTogglePublish?: () => void;
}) {
  const [localContent, setLocalContent] = useState<Record<string, unknown>>(section.content || {});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(section.published);
  const type = section.section_type as SectionType;
  const label = getSectionLabel(type);

  useEffect(() => {
    setLocalContent(section.content || {});
    setPublished(section.published);
  }, [section.id, section.content, section.published]);

  const EditorComponent = sectionEditorRegistry[type];

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(localContent);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (content: Record<string, unknown>) => {
    setLocalContent(content);
    onDirty();
    onPreview?.(content);
  };

  const handleTogglePublish = async () => {
    setPublishing(true);
    try {
      if (onTogglePublish) {
        onTogglePublish();
      } else {
        await toggleSectionVisibility(section.id, !published);
        setPublished(!published);
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-0.5">
            EDITING
          </p>
          <h2 className="font-serif font-medium text-sm tracking-tight text-ivory truncate">{label}</h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleTogglePublish}
            disabled={publishing}
            className="inline-flex items-center gap-1 px-2 py-1 text-[0.55rem] font-medium rounded border border-white/[0.08] hover:border-white/[0.15] transition-all"
            title={published ? 'Hide section from public' : 'Show section on public'}
          >
            {published ? (
              <>
                <Eye size={10} className="text-green-400/60" />
                <span className="text-white/40">Published</span>
              </>
            ) : (
              <>
                <EyeOff size={10} className="text-white/25" />
                <span className="text-white/30">Hidden</span>
              </>
            )}
          </button>
          <AdminButton onClick={handleSave} loading={saving} size="sm">
            Save
          </AdminButton>
        </div>
      </div>

      {/* Section title */}
      <div className="px-4 py-2.5 border-b border-white/[0.04]">
        <AdminInput
          label="Section Title (admin only)"
          name="section_title"
          value={section.title || ''}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Internal label"
        />
      </div>

      {/* Type-specific editor */}
      <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        {EditorComponent ? (
          <EditorComponent content={localContent} onChange={handleChange} />
        ) : (
          <div className="py-10 text-center">
            <p className="text-[0.75rem] text-white/30">No editor available for this section type.</p>
            <p className="text-[0.65rem] text-white/20 mt-1">Type: {type}</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus, ExternalLink, Image } from 'lucide-react';
import { PageHeader, AdminLoading, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, Toast } from '@/components/admin/AdminUI';
import { MediaPicker } from '@/components/admin/media';
import { getEvent, createEvent, updateEvent, deleteEvent } from '@/lib/eventsService';
import { supabase } from '@/lib/supabase';
import { EVENT_CATEGORIES } from '@/lib/types';
import type { EventItem, MediaItem } from '@/lib/types';

export function EventEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [event, setEvent] = useState<Partial<EventItem>>({
    title: '', slug: '', description: '', category: 'Corporate',
    status: 'upcoming', event_date: '', location: '',
    cover_image: '', cover_alt: '', sort_order: 0,
    featured: false, published: false, gallery: [], lineup: [],
    ticket_url: '', registration_url: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [lineupInput, setLineupInput] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    getEvent(id).then((data) => {
      setEvent(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      setToast('Failed to load event');
    });
  }, [id, isEdit]);

  const update = (fields: Partial<EventItem>) => setEvent((prev) => ({ ...prev, ...fields }));

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async (publishImmediately = false) => {
    if (!event.title?.trim()) {
      setToast('Title is required');
      return;
    }
    setSaving(true);
    try {
      const slug = event.slug?.trim() || generateSlug(event.title);
      const payload = { ...event, slug, published: publishImmediately ? true : event.published };

      if (isEdit && id) {
        const updated = await updateEvent(id, payload);
        setEvent(updated);
        setToast('Event updated');
      } else {
        const created = await createEvent(payload);
        setToast('Event created');
        navigate(`/admin/events/${created.id}/edit`, { replace: true });
      }
    } catch {
      setToast('Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteEvent(id);
      setToast('Event deleted');
      setTimeout(() => navigate('/admin/events', { replace: true }), 500);
    } catch {
      setToast('Delete failed');
    }
    setShowDeleteConfirm(false);
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
      update({ cover_image: urlData.publicUrl });
    } catch {
      setToast('Upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const ext = file.name.split('.').pop();
        const path = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('media').upload(path, file);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
        newUrls.push(urlData.publicUrl);
      } catch {
        setToast(`Failed to upload ${file.name}`);
      }
    }
    update({ gallery: [...(event.gallery || []), ...newUrls] });
    setUploadingGallery(false);
  };

  const addLineup = () => {
    const name = lineupInput.trim();
    if (!name) return;
    update({ lineup: [...(event.lineup || []), name] });
    setLineupInput('');
  };

  const removeLineup = (index: number) => {
    update({ lineup: (event.lineup || []).filter((_, i) => i !== index) });
  };

  if (loading) return <AdminLoading text="Loading event..." />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/events"
            className="flex items-center justify-center w-8 h-8 rounded text-white/30 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] transition-colors"
            aria-label="Back to events"
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
          </Link>
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-gold mb-0.5">
              {isEdit ? 'EDITING' : 'CREATING'}
            </p>
            <h1 className="font-serif font-medium text-xl tracking-tight text-ivory">
              {isEdit ? event.title || 'Event' : 'New Event'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEdit && event.slug && (
            <Link
              to={`/events/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/30 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] rounded transition-all"
            >
              <ExternalLink size={11} strokeWidth={1.5} /> Preview
            </Link>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* ── Main content (70%) ── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Basic Info */}
          <Section title="Event Information">
            <div className="space-y-5">
              <AdminInput
                label="Event Title"
                name="title"
                value={event.title || ''}
                onChange={(e) => {
                  const title = e.target.value;
                  update({ title, slug: generateSlug(title) });
                }}
                required
                placeholder="e.g. Fiesta Summer Night"
              />
              <AdminInput
                label="Slug"
                name="slug"
                value={event.slug || ''}
                onChange={(e) => update({ slug: e.target.value })}
                placeholder="auto-generated-from-title"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <AdminSelect
                  label="Category"
                  name="category"
                  value={event.category || 'Corporate'}
                  onChange={(e) => update({ category: e.target.value })}
                >
                  {EVENT_CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                </AdminSelect>
                <AdminInput
                  label="Event Date"
                  type="date"
                  name="event_date"
                  value={event.event_date || ''}
                  onChange={(e) => update({ event_date: e.target.value })}
                />
              </div>
              <AdminInput
                label="Venue"
                name="location"
                value={event.location || ''}
                onChange={(e) => update({ location: e.target.value })}
                placeholder="e.g. Kigali Convention Centre"
              />
              <AdminTextarea
                label="Description"
                name="description"
                value={event.description || ''}
                onChange={(e) => update({ description: e.target.value })}
                rows={6}
                placeholder="Describe the event..."
              />
            </div>
          </Section>

          {/* Cover Image */}
          <Section title="Cover Image">
            <div className="space-y-4">
              {event.cover_image ? (
                <div className="relative group">
                  <img
                    src={event.cover_image}
                    alt={event.cover_alt || 'Cover'}
                    className="w-full h-48 md:h-56 object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded">
                    <button
                      onClick={() => setShowCoverPicker(true)}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-[0.7rem] text-white rounded border border-white/20 hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Image size={12} /> Choose from Library
                    </button>
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-[0.7rem] text-white rounded border border-white/20 hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Upload size={12} /> Upload New
                    </button>
                    <button
                      onClick={() => update({ cover_image: '' })}
                      className="px-3 py-1.5 bg-red-500/20 backdrop-blur-sm text-[0.7rem] text-red-300 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCoverPicker(true)}
                    className="flex-1 h-48 md:h-56 border-2 border-dashed border-white/[0.08] rounded flex flex-col items-center justify-center gap-2 hover:border-gold/30 transition-colors"
                  >
                    <Image size={20} className="text-white/20" />
                    <span className="text-[0.7rem] text-white/25">Choose from Library</span>
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingCover}
                    className="flex-1 h-48 md:h-56 border-2 border-dashed border-white/[0.08] rounded flex flex-col items-center justify-center gap-2 hover:border-gold/30 transition-colors"
                  >
                    {uploadingCover ? (
                      <div className="w-5 h-5 border-[1.5px] border-gold/30 border-t-gold rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload size={20} className="text-white/20" />
                        <span className="text-[0.7rem] text-white/25">Upload New</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])} />
              <AdminInput
                label="Cover Alt Text"
                name="cover_alt"
                value={event.cover_alt || ''}
                onChange={(e) => update({ cover_alt: e.target.value })}
                placeholder="Describe the cover image"
              />
            </div>
          </Section>

          {/* Gallery */}
          <Section title="Photo Gallery">
            <div className="space-y-4">
              {event.gallery && event.gallery.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {event.gallery.map((img, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img src={img} alt="" className="w-full h-full object-cover rounded" loading="lazy" />
                      <button
                        onClick={() => update({ gallery: event.gallery!.filter((_, j) => j !== i) })}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove image ${i + 1}`}
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGalleryPicker(true)}
                  className="flex-1 h-24 border border-dashed border-white/[0.08] rounded flex items-center justify-center gap-2 hover:border-gold/30 transition-colors"
                >
                  <Image size={14} className="text-white/20" />
                  <span className="text-[0.7rem] text-white/25">Choose from Library</span>
                </button>
                <button
                  onClick={() => galleryRef.current?.click()}
                  disabled={uploadingGallery}
                  className="flex-1 h-24 border border-dashed border-white/[0.08] rounded flex items-center justify-center gap-2 hover:border-gold/30 transition-colors"
                >
                  {uploadingGallery ? (
                    <div className="w-4 h-4 border-[1.5px] border-gold/30 border-t-gold rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload size={14} className="text-white/20" />
                      <span className="text-[0.7rem] text-white/25">Upload New</span>
                    </>
                  )}
                </button>
              </div>
              <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)} />
            </div>
          </Section>

          {/* Lineup */}
          <Section title="Lineup">
            <div className="space-y-3">
              {event.lineup && event.lineup.length > 0 && (
                <div className="space-y-1">
                  {event.lineup.map((name, i) => (
                    <div key={i} className="flex items-center gap-2 py-2 border-b border-white/[0.04]">
                      <span className="text-[0.6rem] text-white/15 w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-[0.8rem] text-ivory flex-1">{name}</span>
                      <button
                        onClick={() => removeLineup(i)}
                        className="text-white/15 hover:text-red-400/60 transition-colors"
                        aria-label={`Remove ${name}`}
                      >
                        <X size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lineupInput}
                  onChange={(e) => setLineupInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLineup(); } }}
                  placeholder="Artist or performer name"
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-[0.8rem] text-ivory rounded placeholder:text-white/20 focus:border-gold/40 focus:outline-none transition-colors"
                />
                <button
                  onClick={addLineup}
                  disabled={!lineupInput.trim()}
                  className="flex items-center justify-center w-9 h-9 border border-white/[0.08] rounded text-white/30 hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-30"
                  aria-label="Add lineup member"
                >
                  <Plus size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </Section>

          {/* Ticket / Registration */}
          <Section title="Tickets & Registration">
            <div className="space-y-5">
              <AdminInput
                label="Ticket URL"
                name="ticket_url"
                value={event.ticket_url || ''}
                onChange={(e) => update({ ticket_url: e.target.value })}
                placeholder="https://..."
              />
              <AdminInput
                label="Registration URL"
                name="registration_url"
                value={event.registration_url || ''}
                onChange={(e) => update({ registration_url: e.target.value })}
                placeholder="https://..."
              />
              <p className="text-[0.65rem] text-white/20">
                Optional. If left empty, the public event will not show ticket or registration CTAs.
              </p>
            </div>
          </Section>
        </div>

        {/* ── Sidebar (30%) ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publication */}
          <SidebarSection title="Publication">
            <div className="space-y-4">
              <AdminSelect
                label="Event Status"
                name="status"
                value={event.status || 'upcoming'}
                onChange={(e) => update({ status: e.target.value as EventItem['status'] })}
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </AdminSelect>

              <AdminToggle
                label="Published"
                checked={event.published || false}
                onChange={(v) => update({ published: v })}
              />

              <AdminToggle
                label="Featured"
                checked={event.featured || false}
                onChange={(v) => update({ featured: v })}
              />

              <AdminInput
                label="Sort Order"
                type="number"
                name="sort_order"
                value={event.sort_order || 0}
                onChange={(e) => update({ sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </SidebarSection>

          {/* Actions */}
          <SidebarSection title="Actions">
            <div className="space-y-2">
              <AdminButton
                onClick={() => handleSave(false)}
                loading={saving}
                className="w-full"
              >
                {isEdit ? 'Save Changes' : 'Save Draft'}
              </AdminButton>
              {!event.published && (
                <AdminButton
                  variant="secondary"
                  onClick={() => handleSave(true)}
                  loading={saving}
                  className="w-full"
                >
                  {isEdit ? 'Publish Event' : 'Save & Publish'}
                </AdminButton>
              )}
            </div>
          </SidebarSection>

          {/* Quick Info */}
          <SidebarSection title="Details">
            <div className="space-y-3">
              <InfoRow label="Created" value={event.created_at ? new Date(event.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} />
              <InfoRow label="Updated" value={event.updated_at ? new Date(event.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} />
              <InfoRow label="Gallery" value={`${(event.gallery || []).length} images`} />
              <InfoRow label="Lineup" value={`${(event.lineup || []).length} members`} />
            </div>
          </SidebarSection>

          {/* Danger zone */}
          {isEdit && (
            <SidebarSection title="Danger Zone">
              <AdminButton
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full"
              >
                Delete Event
              </AdminButton>
            </SidebarSection>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
        >
          <div
            className="w-full max-w-sm bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif font-medium text-ivory text-base mb-2">Delete event?</h3>
            <p className="text-[0.8rem] text-white/40 mb-6">
              This action cannot be undone. The event &ldquo;{event.title}&rdquo; will be permanently removed.
            </p>
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                Cancel
              </AdminButton>
              <AdminButton variant="danger" onClick={handleDelete} className="flex-1">
                Delete Event
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} />}

      {/* Cover Image Picker */}
      <MediaPicker
        open={showCoverPicker}
        onClose={() => setShowCoverPicker(false)}
        onSelect={(items) => {
          if (items[0]) {
            update({ cover_image: items[0].public_url, cover_alt: items[0].alt_text || items[0].name });
          }
        }}
        mode="single"
        value={event.cover_image ? { id: '', public_url: event.cover_image } as MediaItem : undefined}
      />

      {/* Gallery Picker */}
      <MediaPicker
        open={showGalleryPicker}
        onClose={() => setShowGalleryPicker(false)}
        onSelect={(items) => {
          const urls = items.map((i) => i.public_url);
          update({ gallery: [...(event.gallery || []), ...urls] });
        }}
        mode="multiple"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/[0.06] rounded-lg p-5 md:p-6">
      <h2 className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-white/[0.06] rounded-lg p-5">
      <h3 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[0.7rem] text-white/30">{label}</span>
      <span className="text-[0.7rem] text-white/50">{value}</span>
    </div>
  );
}

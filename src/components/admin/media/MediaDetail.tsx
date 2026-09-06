import { useState, useEffect } from 'react';
import { X, ExternalLink, Copy } from 'lucide-react';
import { AdminButton, AdminInput, Toast } from '@/components/admin/AdminUI';
import { FocalPointEditor } from './FocalPointEditor';
import { updateMedia, deleteMedia, formatFileSize, isImageMime } from '@/lib/mediaService';
import type { MediaItem } from '@/lib/types';

export function MediaDetail({
  item,
  onClose,
  onDeleted,
  onUpdated,
}: {
  item: MediaItem;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onUpdated: (item: MediaItem) => void;
}) {
  const [altText, setAltText] = useState(item.alt_text || '');
  const [focalX, setFocalX] = useState(item.focal_x ?? 0.5);
  const [focalY, setFocalY] = useState(item.focal_y ?? 0.5);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const isImage = isImageMime(item.mime_type);

  useEffect(() => {
    setAltText(item.alt_text || '');
    setFocalX(item.focal_x ?? 0.5);
    setFocalY(item.focal_y ?? 0.5);
  }, [item]);

  const handleSaveMetadata = async () => {
    setSaving(true);
    try {
      const updated = await updateMedia(item.id, {
        alt_text: altText || null,
        focal_x: focalX,
        focal_y: focalY,
      });
      onUpdated(updated);
      setToast('Metadata saved');
      setTimeout(() => setToast(null), 3000);
    } catch {
      setToast('Save failed');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMedia(item.id);
      onDeleted(item.id);
      onClose();
    } catch {
      setToast('Delete failed');
      setDeleting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(item.public_url);
    setToast('URL copied');
    setTimeout(() => setToast(null), 2000);
  };

  const hasChanges = altText !== (item.alt_text || '') ||
    Math.abs(focalX - (item.focal_x ?? 0.5)) > 0.01 ||
    Math.abs(focalY - (item.focal_y ?? 0.5)) > 0.01;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Media details: ${item.name}`}
      >
        <div className="w-full flex flex-col lg:flex-row" onClick={(e) => e.stopPropagation()}>
          {/* Image preview — left / top */}
          <div className="flex-1 bg-black flex items-center justify-center p-4 lg:p-8 min-h-[40vh] lg:min-h-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white/60 hover:text-white flex items-center justify-center z-10"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            {isImage ? (
              <img
                src={item.public_url}
                alt={item.alt_text || item.name}
                className="max-w-full max-h-[60vh] lg:max-h-[80vh] object-contain rounded"
              />
            ) : (
              <video src={item.public_url} controls className="max-w-full max-h-[60vh] lg:max-h-[80vh]" />
            )}
          </div>

          {/* Details — right / bottom */}
          <div className="w-full lg:w-[22rem] bg-charcoal border-l border-white/[0.06] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06]">
              <h2 className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-white/25 mb-3">Media Details</h2>
              <p className="text-[0.85rem] text-ivory truncate mb-1">{item.name}</p>
              <div className="flex items-center gap-3 text-[0.65rem] text-white/30">
                <span>{item.width && item.height ? `${item.width} × ${item.height}` : '—'}</span>
                <span>·</span>
                <span>{formatFileSize(item.size_bytes)}</span>
                <span>·</span>
                <span>{item.mime_type?.split('/')[1]?.toUpperCase() || '—'}</span>
              </div>
            </div>

            <div className="flex-1 p-5 space-y-5">
              {/* Alt text */}
              <AdminInput
                label="Alt Text"
                name="alt_text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe this image for accessibility"
              />
              {!item.alt_text && (
                <p className="text-[0.6rem] text-amber-400/60 -mt-3">Alt text not set. Adding alt text improves accessibility.</p>
              )}

              {/* Focal point */}
              {isImage && (
                <div>
                  <label className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/40 mb-2 block">
                    Focal Point
                  </label>
                  <FocalPointEditor
                    imageUrl={item.public_url}
                    focalX={focalX}
                    focalY={focalY}
                    onChange={(x, y) => { setFocalX(x); setFocalY(y); }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2 pt-2">
                <MetaRow label="Created" value={new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
                {item.updated_at && item.updated_at !== item.created_at && (
                  <MetaRow label="Updated" value={new Date(item.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
                )}
                <MetaRow label="Storage" value={item.storage_path} />
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-white/[0.06] space-y-2">
              <div className="flex gap-2">
                <AdminButton
                  onClick={handleSaveMetadata}
                  loading={saving}
                  disabled={!hasChanges}
                  className="flex-1"
                >
                  Save Changes
                </AdminButton>
                <AdminButton variant="secondary" onClick={copyUrl} className="gap-1.5">
                  <Copy size={11} strokeWidth={1.5} /> URL
                </AdminButton>
              </div>
              <a
                href={item.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white/30 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.15] rounded transition-all"
              >
                <ExternalLink size={10} strokeWidth={1.5} /> Open Full Size
              </a>
              <AdminButton variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} className="w-full">
                Delete Media
              </AdminButton>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowDeleteConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
        >
          <div className="w-full max-w-sm bg-charcoal border border-white/[0.08] rounded-lg shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif font-medium text-ivory text-base mb-2">Delete media?</h3>
            <p className="text-[0.8rem] text-white/40 mb-1">
              &ldquo;{item.name}&rdquo; will be permanently removed from storage.
            </p>
            <p className="text-[0.7rem] text-white/25 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                Cancel
              </AdminButton>
              <AdminButton variant="danger" onClick={handleDelete} loading={deleting} className="flex-1">
                Delete
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[0.7rem] text-white/30">{label}</span>
      <span className="text-[0.65rem] text-white/50 truncate max-w-[12rem] text-right">{value}</span>
    </div>
  );
}

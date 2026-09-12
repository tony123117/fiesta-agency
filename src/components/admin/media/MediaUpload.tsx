import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminButton, Toast } from '@/components/admin/AdminUI';
import { uploadMedia, formatFileSize } from '@/lib/mediaService';
import type { MediaItem } from '@/lib/types';

interface PendingFile {
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
  result?: MediaItem;
}

export function MediaUpload({ onUploaded }: { onUploaded: (items: MediaItem[]) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const blobUrlsRef = useRef<Map<File, string>>(new Map());

  const blobUrls = useMemo(() => {
    const newMap = new Map<File, string>();
    for (const f of files) {
      const existing = blobUrlsRef.current.get(f.file);
      if (existing) {
        newMap.set(f.file, existing);
      }
    }
    blobUrlsRef.current = newMap;
    return newMap;
  }, [files]);

  useEffect(() => {
    for (const f of files) {
      if (!blobUrlsRef.current.has(f.file) && f.file.type.startsWith('image/')) {
        blobUrlsRef.current.set(f.file, URL.createObjectURL(f.file));
      }
    }
    // Revoke URLs for removed files
    for (const [file, url] of blobUrlsRef.current) {
      if (!files.some((f) => f.file === file)) {
        URL.revokeObjectURL(url);
        blobUrlsRef.current.delete(file);
      }
    }
  }, [files]);

  useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current.values()) URL.revokeObjectURL(url);
      blobUrlsRef.current.clear();
    };
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter((f) =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    if (arr.length === 0) {
      setToast('Only image and video files are supported');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setFiles((prev) => [...prev, ...arr.map((file) => ({ file, status: 'pending' as const }))]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleUpload = async () => {
    setUploading(true);
    const uploaded: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));

      try {
        const result = await uploadMedia(files[i].file);
        uploaded.push(result);
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'done', result } : f));
      } catch (err) {
        setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Failed' } : f));
      }
    }

    setUploading(false);
    if (uploaded.length > 0) {
      onUploaded(uploaded);
      setToast(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} uploaded`);
      setTimeout(() => { setToast(null); setFiles([]); setIsOpen(false); }, 1500);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) {
    return (
      <>
        <AdminButton onClick={() => setIsOpen(true)} className="gap-2">
          <Upload size={13} strokeWidth={1.5} /> Upload Media
        </AdminButton>
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <>
      <div className="border border-white/[0.06] rounded-lg p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/25">Upload Media</h3>
          <button onClick={() => { setIsOpen(false); setFiles([]); }} className="text-white/30 hover:text-white/60" aria-label="Close upload">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-gold/50 bg-gold/[0.03]' : 'border-white/[0.08] hover:border-white/[0.15]'
          }`}
        >
          <Upload size={24} className="mx-auto mb-3 text-white/20" />
          <p className="text-[0.8rem] text-white/40 mb-1">Drag images here or click to browse</p>
          <p className="text-[0.65rem] text-white/20">JPG, PNG, WEBP, AVIF</p>
        </div>

        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
        />

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <div className="w-10 h-10 rounded overflow-hidden bg-white/[0.04] shrink-0">
                  {f.file.type.startsWith('image/') ? (
                    <img src={blobUrls.get(f.file) || ''} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[0.45rem] text-white/20">VID</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.75rem] text-ivory truncate">{f.file.name}</p>
                  <p className="text-[0.6rem] text-white/30">{formatFileSize(f.file.size)}</p>
                </div>
                <div className="shrink-0">
                  {f.status === 'pending' && (
                    <button onClick={() => removeFile(i)} className="text-white/20 hover:text-white/50" aria-label={`Remove ${f.file.name}`}>
                      <X size={12} />
                    </button>
                  )}
                  {f.status === 'uploading' && (
                    <div className="w-4 h-4 border-[1.5px] border-gold/30 border-t-gold rounded-full animate-spin" />
                  )}
                  {f.status === 'done' && <CheckCircle size={14} className="text-green-400/60" />}
                  {f.status === 'error' && <AlertCircle size={14} className="text-red-400/60" />}
                </div>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <AdminButton
                onClick={handleUpload}
                loading={uploading}
                disabled={files.every((f) => f.status !== 'pending')}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : `Upload ${files.filter((f) => f.status === 'pending').length} files`}
              </AdminButton>
              <AdminButton variant="ghost" onClick={() => setFiles([])} disabled={uploading}>
                Clear
              </AdminButton>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast} />}
    </>
  );
}

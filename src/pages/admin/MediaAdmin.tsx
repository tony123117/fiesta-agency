import { useEffect, useState, useRef } from 'react';
import { Upload, Search, Trash2, Copy, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PageHeader, AdminLoading, EmptyState, Toast } from '@/components/admin/AdminUI';
import type { MediaItem } from '@/lib/types';

export function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems((data || []) as MediaItem[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(path, file);
      if (error) { setToast(`Upload failed: ${file.name}`); continue; }
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
      await supabase.from('media').insert({
        name: file.name, storage_path: path, public_url: urlData.publicUrl,
        mime_type: file.type, size_bytes: file.size,
      });
    }
    setUploading(false);
    setToast('Upload complete');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    await supabase.storage.from('media').remove([item.storage_path]);
    await supabase.from('media').delete().eq('id', item.id);
    load();
    setToast('Media deleted');
    setTimeout(() => setToast(null), 3000);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setToast('URL copied');
    setTimeout(() => setToast(null), 2000);
  };

  const filtered = items.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;

  return (
    <div className="p-6 md:p-10">
      <PageHeader title="Media Library" action={
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 bg-gold text-obsidian px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-colors disabled:opacity-50">
            <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      } />

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-muted" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search media..."
          className="w-full bg-charcoal border border-charcoal-border pl-10 pr-4 py-2 text-sm text-ivory focus:border-gold focus:outline-none" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No media uploaded yet." subtitle="Upload images to use across your site." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((m) => (
            <div key={m.id} className="group relative bg-charcoal border border-charcoal-border overflow-hidden">
              <img src={m.public_url} alt={m.alt_text || m.name} className="w-full h-32 object-cover cursor-pointer" onClick={() => setPreview(m)} />
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button onClick={() => copyUrl(m.public_url)} className="p-2 bg-obsidian/80 text-gold hover:text-ivory transition-colors"><Copy size={14} /></button>
                <button onClick={() => handleDelete(m)} className="p-2 bg-obsidian/80 text-red-400 hover:text-red-300 transition-colors"><Trash2 size={14} /></button>
              </div>
              <p className="text-xs text-ivory-muted px-2 py-1.5 truncate">{m.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-obsidian/90 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl w-full">
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-ivory hover:text-gold"><X size={24} /></button>
            <img src={preview.public_url} alt={preview.alt_text || preview.name} className="w-full max-h-[80vh] object-contain" />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-ivory">{preview.name}</p>
              <button onClick={() => copyUrl(preview.public_url)} className="inline-flex items-center gap-2 text-xs text-gold hover:gap-3 transition-all">
                <Copy size={12} /> Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

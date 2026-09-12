import { supabase } from '@/lib/supabase';
import type { MediaItem } from '@/lib/types';

export interface MediaFilters {
  search?: string;
  type?: 'all' | 'images' | 'videos';
  sort?: 'newest' | 'oldest' | 'name';
}

export async function getMedia(filters?: MediaFilters): Promise<MediaItem[]> {
  let query = supabase.from('media').select('*');

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    query = query.or(`name.ilike.%${term}%,alt_text.ilike.%${term}%`);
  }

  if (filters?.type === 'images') {
    query = query.like('mime_type', 'image%');
  } else if (filters?.type === 'videos') {
    query = query.like('mime_type', 'video%');
  }

  const sort = filters?.sort || 'newest';
  query = query.order('created_at', { ascending: sort === 'oldest' });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as MediaItem[];
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  const { data, error } = await supabase.from('media').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as MediaItem | null;
}

export async function uploadMedia(
  file: File,
  opts?: { alt?: string; onProgress?: (pct: number) => void }
): Promise<MediaItem> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `originals/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);

  // Get image dimensions if it's an image
  let width: number | null = null;
  let height: number | null = null;
  if (file.type.startsWith('image/')) {
    const dims = await getImageDimensions(file);
    width = dims.width;
    height = dims.height;
  }

  const record = {
    name: file.name,
    storage_path: path,
    public_url: urlData.publicUrl,
    mime_type: file.type,
    size_bytes: file.size,
    width,
    height,
    alt_text: opts?.alt || null,
    focal_x: 0.5,
    focal_y: 0.5,
  };

  const { data, error: dbError } = await supabase.from('media').insert(record).select('*').single();
  if (dbError) {
    // Cleanup: remove uploaded file if DB insert fails
    await supabase.storage.from('media').remove([path]);
    throw dbError;
  }

  return data as MediaItem;
}

export async function uploadMultipleMedia(
  files: File[],
  opts?: { alt?: string; onFileComplete?: (item: MediaItem) => void; onFileError?: (file: File, error: Error) => void }
): Promise<MediaItem[]> {
  const results: MediaItem[] = [];

  for (const file of files) {
    try {
      const item = await uploadMedia(file, { alt: opts?.alt });
      results.push(item);
      opts?.onFileComplete?.(item);
    } catch (err) {
      opts?.onFileError?.(file, err instanceof Error ? err : new Error('Upload failed'));
    }
  }

  return results;
}

export async function updateMedia(id: string, updates: Partial<Pick<MediaItem, 'alt_text' | 'focal_x' | 'focal_y' | 'name'>>): Promise<MediaItem> {
  const { data, error } = await supabase.from('media').update(updates).eq('id', id).select('*').single();
  if (error) throw error;
  return data as MediaItem;
}

export async function deleteMedia(id: string): Promise<void> {
  const { data: item, error: fetchError } = await supabase.from('media').select('storage_path').eq('id', id).maybeSingle();
  if (fetchError) throw fetchError;
  if (!item) throw new Error('Media item not found');

  // Delete from storage first
  const { error: storageError } = await supabase.storage.from('media').remove([item.storage_path]);
  if (storageError) throw storageError;

  // Then delete DB record
  const { error: dbError } = await supabase.from('media').delete().eq('id', id);
  if (dbError) throw dbError;
}

export async function replaceMedia(
  id: string,
  newFile: File,
  opts?: { alt?: string }
): Promise<MediaItem> {
  // Get existing record
  const existing = await getMediaById(id);

  // Upload new file
  const ext = newFile.name.split('.').pop() || 'jpg';
  const path = `originals/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage.from('media').upload(path, newFile);
  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);

  let width: number | null = null;
  let height: number | null = null;
  if (newFile.type.startsWith('image/')) {
    const dims = await getImageDimensions(newFile);
    width = dims.width;
    height = dims.height;
  }

  // Update DB record
  const { data, error: dbError } = await supabase.from('media').update({
    name: newFile.name,
    storage_path: path,
    public_url: urlData.publicUrl,
    mime_type: newFile.type,
    size_bytes: newFile.size,
    width,
    height,
    alt_text: opts?.alt ?? existing.alt_text,
  }).eq('id', id).select('*').single();

  if (dbError) {
    await supabase.storage.from('media').remove([path]);
    throw dbError;
  }

  // Delete old storage file (best-effort)
  await supabase.storage.from('media').remove([existing.storage_path]).catch(() => {});

  return data as MediaItem;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageMime(mime: string | null): boolean {
  return !!mime && mime.startsWith('image/');
}

export function isVideoMime(mime: string | null): boolean {
  return !!mime && mime.startsWith('video/');
}

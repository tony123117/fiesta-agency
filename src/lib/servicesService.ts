import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types';

export interface ServiceFilters {
  search?: string;
  published?: string;
  featured?: string;
}

export interface ServiceSort {
  field: 'sort_order' | 'created_at' | 'title';
  ascending: boolean;
}

export async function getServices(filters?: ServiceFilters, sort?: ServiceSort) {
  let query = supabase.from('services').select('*');

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    query = query.or(`title.ilike.%${term}%,slug.ilike.%${term}%,description.ilike.%${term}%`);
  }

  if (filters?.published && filters.published !== 'all') {
    query = query.eq('published', filters.published === 'published');
  }

  if (filters?.featured && filters.featured !== 'all') {
    query = query.eq('featured', filters.featured === 'featured');
  }

  const sortField = sort?.field || 'sort_order';
  const sortAsc = sort?.ascending ?? true;
  query = query.order(sortField, { ascending: sortAsc });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Service[];
}

export async function getService(id: string) {
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Service;
}

export async function getServiceBySlug(slug: string) {
  const { data, error } = await supabase.from('services').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data as Service;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createService(service: Partial<Service>) {
  const slug = service.slug || (service.title ? generateSlug(service.title) : '');
  const payload = { ...service, slug };
  const { data, error } = await supabase.from('services').insert(payload).select('*').single();
  if (error) throw error;
  return data as Service;
}

export async function updateService(id: string, service: Partial<Service>) {
  const payload = { ...service, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('services').update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

export async function duplicateService(id: string) {
  const original = await getService(id);
  const { id: _id, created_at, updated_at, ...rest } = original;
  const slug = `${rest.slug}-copy-${Date.now()}`;
  const payload = { ...rest, title: `${rest.title} (Copy)`, slug, published: false };
  const { data, error } = await supabase.from('services').insert(payload).select('*').single();
  if (error) throw error;
  return data as Service;
}

export async function publishService(id: string) {
  return updateService(id, { published: true });
}

export async function unpublishService(id: string) {
  return updateService(id, { published: false });
}

export async function toggleServiceFeatured(id: string, featured: boolean) {
  return updateService(id, { featured });
}

export async function reorderServices(orderedIds: string[]) {
  const updates = orderedIds.map((id, index) =>
    supabase.from('services').update({ sort_order: index + 1 }).eq('id', id)
  );
  await Promise.all(updates);
}

export function generateServiceSlug(title: string): string {
  return generateSlug(title);
}

import { supabase } from '@/lib/supabase';
import type { EventItem } from '@/lib/types';

export interface EventFilters {
  search?: string;
  status?: string;
  published?: string;
  featured?: string;
}

export interface EventSort {
  field: 'created_at' | 'event_date' | 'title';
  ascending: boolean;
}

export async function getEvents(filters?: EventFilters, sort?: EventSort) {
  let query = supabase.from('events').select('*');

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    query = query.or(`title.ilike.%${term}%,slug.ilike.%${term}%,location.ilike.%${term}%,category.ilike.%${term}%`);
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.published && filters.published !== 'all') {
    query = query.eq('published', filters.published === 'published');
  }

  if (filters?.featured && filters.featured !== 'all') {
    query = query.eq('featured', filters.featured === 'featured');
  }

  const sortField = sort?.field || 'event_date';
  const sortAsc = sort?.ascending ?? true;
  query = query.order(sortField, { ascending: sortAsc });

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as EventItem[];
}

export async function getEvent(id: string) {
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (error) throw error;
  return data as EventItem;
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data as EventItem;
}

export async function createEvent(event: Partial<EventItem>) {
  const slug = event.title
    ? event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : '';
  const payload = { ...event, slug };
  const { data, error } = await supabase.from('events').insert(payload).select('*').single();
  if (error) throw error;
  return data as EventItem;
}

export async function updateEvent(id: string, event: Partial<EventItem>) {
  const payload = { ...event, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('events').update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return data as EventItem;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

export async function publishEvent(id: string) {
  return updateEvent(id, { published: true });
}

export async function unpublishEvent(id: string) {
  return updateEvent(id, { published: false });
}

export async function toggleFeatured(id: string, featured: boolean) {
  return updateEvent(id, { featured });
}

export async function updateEventStatus(id: string, status: EventItem['status']) {
  return updateEvent(id, { status });
}

export async function duplicateEvent(id: string) {
  const original = await getEvent(id);
  const { id: _id, created_at, updated_at, ...rest } = original;
  const slug = `${rest.slug}-copy-${Date.now()}`;
  const payload = { ...rest, title: `${rest.title} (Copy)`, slug, published: false, featured: false };
  const { data, error } = await supabase.from('events').insert(payload).select('*').single();
  if (error) throw error;
  return data as EventItem;
}

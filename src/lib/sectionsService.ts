import { supabase } from '@/lib/supabase';
import type { Section, SectionType } from '@/lib/types';
import { getDefaultContent } from '@/lib/sectionTypes';

export async function getSections(pageId: string): Promise<Section[]> {
  const { data, error } = await supabase.from('sections')
    .select('*')
    .eq('page_id', pageId)
    .order('sort_order');
  if (error) throw error;
  return (data || []) as Section[];
}

export async function getSection(id: string): Promise<Section> {
  const { data, error } = await supabase.from('sections').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Section;
}

export async function createSection(pageId: string, type: SectionType, title?: string): Promise<Section> {
  // Get max sort_order
  const { data: existing } = await supabase.from('sections')
    .select('sort_order')
    .eq('page_id', pageId)
    .order('sort_order', { ascending: false })
    .limit(1);

  const maxOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const record = {
    page_id: pageId,
    title: title || type,
    section_type: type,
    content: getDefaultContent(type),
    sort_order: maxOrder,
    published: true,
  };

  const { data, error } = await supabase.from('sections').insert(record).select('*').single();
  if (error) throw error;
  return data as Section;
}

export async function updateSection(id: string, updates: Partial<Pick<Section, 'title' | 'subtitle' | 'content' | 'published' | 'layout' | 'section_type' | 'sort_order'>>): Promise<Section> {
  const { data, error } = await supabase.from('sections').update(updates).eq('id', id).select('*').single();
  if (error) throw error;
  return data as Section;
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase.from('sections').delete().eq('id', id);
  if (error) throw error;
}

export async function duplicateSection(section: Section): Promise<Section> {
  const { id, created_at, updated_at, ...rest } = section;
  const record = {
    ...rest,
    title: `${rest.title || 'Section'} (Copy)`,
  };
  const { data, error } = await supabase.from('sections').insert(record).select('*').single();
  if (error) throw error;
  return data as Section;
}

export async function reorderSections(sections: Section[]): Promise<void> {
  const updates = sections.map((s, i) =>
    supabase.from('sections').update({ sort_order: i }).eq('id', s.id)
  );
  await Promise.all(updates);
}

export async function moveSection(id: string, direction: 'up' | 'down', sections: Section[]): Promise<void> {
  const idx = sections.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= sections.length) return;

  const reordered = [...sections];
  const [moved] = reordered.splice(idx, 1);
  reordered.splice(targetIdx, 0, moved);

  await reorderSections(reordered);
}

export async function toggleSectionVisibility(id: string, published: boolean): Promise<Section> {
  return updateSection(id, { published });
}

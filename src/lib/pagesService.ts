import { supabase } from '@/lib/supabase';
import type { Page } from '@/lib/types';

export async function getPages(): Promise<Page[]> {
  const { data, error } = await supabase.from('pages').select('*').order('title');
  if (error) throw error;
  return (data || []) as Page[];
}

export async function getPage(id: string): Promise<Page> {
  const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
  if (error) return null;
  return data as Page;
}

export async function createPage(page: Partial<Page>): Promise<Page> {
  const { data, error } = await supabase.from('pages').insert(page).select('*').single();
  if (error) throw error;
  return data as Page;
}

export async function updatePage(id: string, page: Partial<Page>): Promise<Page> {
  const { data, error } = await supabase.from('pages').update(page).eq('id', id).select('*').single();
  if (error) throw error;
  return data as Page;
}

export async function deletePage(id: string): Promise<void> {
  const { error } = await supabase.from('pages').delete().eq('id', id);
  if (error) throw error;
}

export async function publishPage(id: string): Promise<Page> {
  return updatePage(id, { published: true, published_at: new Date().toISOString() });
}

export async function unpublishPage(id: string): Promise<Page> {
  return updatePage(id, { published: false });
}

export async function duplicatePage(id: string): Promise<Page> {
  const page = await getPage(id);
  const sections = (await supabase.from('sections').select('*').eq('page_id', id).order('sort_order')).data || [];

  const newPage = await createPage({
    title: `${page.title} (Copy)`,
    slug: `${page.slug}-copy`,
    description: page.description,
    published: false,
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    og_image_url: page.og_image_url,
  });

  for (const section of sections) {
    const { id: _, created_at, updated_at, ...sectionData } = section;
    await supabase.from('sections').insert({
      ...sectionData,
      page_id: newPage.id,
      published: false,
    });
  }

  return newPage;
}

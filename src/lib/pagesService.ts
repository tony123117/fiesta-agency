import { supabase } from '@/lib/supabase';
import type { Page } from '@/lib/types';

const PAGE_COLUMNS = 'id, slug, title, description, published, published_at, seo_title, seo_description, og_image_url, created_at, updated_at';

export async function getPages(): Promise<Page[]> {
  const { data, error } = await supabase.from('pages').select(PAGE_COLUMNS).order('title');
  if (error) throw error;
  return (data || []) as Page[];
}

export async function getPage(id: string): Promise<Page | null> {
  const { data, error } = await supabase.from('pages').select(PAGE_COLUMNS).eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Page | null;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await supabase.from('pages').select(PAGE_COLUMNS).eq('slug', slug).maybeSingle();
  if (error) return null;
  return data as Page;
}

export async function createPage(page: Partial<Page>): Promise<Page> {
  const { data, error } = await supabase.from('pages').insert(page).select(PAGE_COLUMNS).single();
  if (error) throw error;
  return data as Page;
}

export async function updatePage(id: string, page: Partial<Page>): Promise<Page> {
  const { data, error } = await supabase.from('pages').update(page).eq('id', id).select(PAGE_COLUMNS).single();
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
  if (!page) throw new Error('Page not found');
  const sections = (await supabase.from('sections')
    .select('id, page_id, title, section_type, content, sort_order, published, subtitle, body, image_url, image_alt, layout')
    .eq('page_id', id).order('sort_order')).data || [];

  const newPage = await createPage({
    title: `${page.title} (Copy)`,
    slug: `${page.slug}-copy-${Date.now()}`,
    description: page.description,
    published: false,
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    og_image_url: page.og_image_url,
  });

  for (const section of sections) {
    const { id, created_at, updated_at, ...sectionData } = section;
    void id; void created_at; void updated_at;
    await supabase.from('sections').insert({
      ...sectionData,
      page_id: newPage.id,
      published: false,
    });
  }

  return newPage;
}

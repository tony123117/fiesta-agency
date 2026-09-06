-- Phase 11: Add SEO fields and published_at to pages table

ALTER TABLE public.pages
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT;

COMMENT ON COLUMN public.pages.published_at IS 'Timestamp of when the page was last published';
COMMENT ON COLUMN public.pages.seo_title IS 'Custom title for search engines (falls back to page title)';
COMMENT ON COLUMN public.pages.seo_description IS 'Meta description for search engines';
COMMENT ON COLUMN public.pages.og_image_url IS 'Open Graph image URL for social sharing';

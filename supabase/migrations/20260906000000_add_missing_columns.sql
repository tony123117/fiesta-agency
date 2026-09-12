/*
  Fiesta Agency — Schema Fix
  Adds missing columns + fixes RLS is_staff() check.
  
  Run this in Supabase SQL Editor:
  https://supabase.com/dashboard/project/_/sql/new
*/

-- ── Fix is_staff() to check profiles table (not just app_metadata) ──
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    -- Check app_metadata first (JWT claim)
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff')
    OR
    -- Fallback: check profiles table
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    ),
    false
  );
$$;

-- ── pages: add missing columns ──
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS seo_title text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS seo_description text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- ── sections: add missing columns ──
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS section_type text;
ALTER TABLE public.sections ADD COLUMN IF NOT EXISTS content jsonb;

-- ── sections: backfill section_type from title if possible ──
UPDATE public.sections SET section_type = title WHERE section_type IS NULL AND title IS NOT NULL;

-- ── sections: backfill content from body if body has data ──
UPDATE public.sections SET content = body WHERE content IS NULL AND body IS NOT NULL;

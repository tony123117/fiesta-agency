/*
# Add section_type and content columns to sections

Adds the section type system for the Page Builder.
- section_type: identifies what kind of section this is (hero, brand-statement, etc.)
- content: jsonb column for flexible, typed section content
*/

ALTER TABLE public.sections
  ADD COLUMN IF NOT EXISTS section_type text NOT NULL DEFAULT 'text-image',
  ADD COLUMN IF NOT EXISTS content jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_sections_type ON public.sections(section_type);

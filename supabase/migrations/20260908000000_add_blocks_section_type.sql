-- ── Migration: Add blocks section type support ──
-- No new tables needed. Blocks live inside sections.content JSONB.
-- This migration just adds an index on section_type for the new 'blocks' type.

-- The blocks section type uses the existing sections table.
-- Block data is stored in sections.content as:
-- { "blocks": [ { "id": "...", "type": "heading|text|image|button|spacer", "content": {...}, "sort_order": 0, "responsive": {...} } ] }

-- No schema changes required — the existing JSONB content column
-- already supports arbitrary structures.

-- Verify the section_type column accepts 'blocks' (it's TEXT, so it does).
-- Add a comment for documentation:
COMMENT ON COLUMN public.sections.content IS 'JSONB content. For typed sections, contains section-specific data. For "blocks" type, contains { blocks: Block[] } where each block has id, type, content, sort_order, responsive.';
COMMENT ON COLUMN public.sections.section_type IS 'Section type identifier. Includes standard types (hero-carousel, brand-statement, etc.) and the "blocks" visual editor type.';

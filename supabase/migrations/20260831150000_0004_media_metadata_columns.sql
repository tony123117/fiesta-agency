/*
# Add media metadata columns

Adds updated_at, focal_x, focal_y to the media table for the centralized Media Library.
*/

ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS focal_x real DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS focal_y real DEFAULT 0.5;

-- Add updated_at trigger to media (was missing from initial schema)
DROP TRIGGER IF EXISTS set_updated_at ON public.media;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

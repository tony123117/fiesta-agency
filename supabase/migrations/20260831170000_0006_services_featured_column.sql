-- Phase 7: Add featured column to services table
-- This column allows admins to highlight specific services on the public website.

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- Add index for featured queries (public site filters featured services)
CREATE INDEX IF NOT EXISTS idx_services_featured ON public.services(featured) WHERE featured = true;

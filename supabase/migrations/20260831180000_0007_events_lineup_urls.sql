-- Phase 8: Add lineup, ticket_url, registration_url columns to events table
-- These columns are required by the admin editor and public EventDetail page.

-- lineup: stores array of performer/artist names as JSONB
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS lineup jsonb DEFAULT '[]'::jsonb;

-- ticket_url: optional link to ticket purchase page
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS ticket_url text;

-- registration_url: optional link to event registration page
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_url text;

-- Add index for ticket/registration URL lookups (no index needed — these are write-once fields)

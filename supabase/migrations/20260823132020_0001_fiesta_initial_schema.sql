/*
# Fiesta Agency — Initial Schema

## Overview
Creates the complete database schema for the Fiesta Agency platform: a cinematic luxury
event experience company with a public website and admin CMS.

## New Tables
1. `profiles` — extends auth.users with role (admin/staff) and display info
2. `pages` — top-level CMS pages (home, about, services, how-we-work)
3. `sections` — ordered, publishable content sections within a page (rich-text JSON body)
4. `services` — service catalog with slug, image, sort order, publish toggle
5. `events` — event records with category, date, location, cover image, gallery, status
6. `portfolio_projects` — portfolio work with category, year, cover, gallery, sort order
7. `testimonials` — client quotes with event type, location, image
8. `faqs` — FAQ entries with category, question, answer, sort order
9. `bookings` — inquiry submissions from the Plan Your Event form
10. `media` — media library entries (path, url, dimensions, alt text)
11. `site_settings` — single-row table for global site configuration

## Security
- RLS enabled on every table.
- Public content (services, events, portfolio, testimonials, faqs, published sections, site_settings, media):
  anon + authenticated can SELECT published/visible rows; only authenticated staff/admin can INSERT/UPDATE/DELETE.
- Bookings: anyone (anon, authenticated) can INSERT (form submission); only staff/admin can SELECT/UPDATE/DELETE.
- Profiles: each authenticated user can read/update their own; admins can read all.
- Admin/staff write access is enforced via a helper function `is_staff()` checking raw_app_meta_data role.
*/

-- ---------- helper: is_staff ----------
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff'),
    false
  );
$$;

-- ---------- profiles ----------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own_or_staff" ON public.profiles;
CREATE POLICY "profiles_select_own_or_staff" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_staff());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ---------- pages ----------
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_select_public" ON public.pages;
CREATE POLICY "pages_select_public" ON public.pages FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "pages_staff_write" ON public.pages;
CREATE POLICY "pages_staff_write" ON public.pages FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- sections ----------
CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  title text,
  subtitle text,
  body jsonb,
  image_url text,
  image_alt text,
  layout text DEFAULT 'default',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_sections_page_id ON public.sections(page_id);
CREATE INDEX IF NOT EXISTS idx_sections_sort ON public.sections(sort_order);

DROP POLICY IF EXISTS "sections_select_public" ON public.sections;
CREATE POLICY "sections_select_public" ON public.sections FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "sections_staff_write" ON public.sections;
CREATE POLICY "sections_staff_write" ON public.sections FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- services ----------
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  details jsonb,
  image_url text,
  image_alt text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_services_sort ON public.services(sort_order);

DROP POLICY IF EXISTS "services_select_public" ON public.services;
CREATE POLICY "services_select_public" ON public.services FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "services_staff_write" ON public.services;
CREATE POLICY "services_staff_write" ON public.services FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- events ----------
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category text NOT NULL DEFAULT 'Celebration',
  event_date date,
  location text,
  cover_image text,
  cover_alt text,
  gallery jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(published);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date);

DROP POLICY IF EXISTS "events_select_public" ON public.events;
CREATE POLICY "events_select_public" ON public.events FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "events_staff_write" ON public.events;
CREATE POLICY "events_staff_write" ON public.events FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- portfolio_projects ----------
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Wedding',
  description text,
  story jsonb,
  year int,
  cover_image text,
  cover_alt text,
  gallery jsonb DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON public.portfolio_projects(published);
CREATE INDEX IF NOT EXISTS idx_portfolio_sort ON public.portfolio_projects(sort_order);

DROP POLICY IF EXISTS "portfolio_select_public" ON public.portfolio_projects;
CREATE POLICY "portfolio_select_public" ON public.portfolio_projects FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "portfolio_staff_write" ON public.portfolio_projects;
CREATE POLICY "portfolio_staff_write" ON public.portfolio_projects FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- testimonials ----------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  quote text NOT NULL,
  event_type text,
  location text,
  image_url text,
  image_alt text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials(sort_order);

DROP POLICY IF EXISTS "testimonials_select_public" ON public.testimonials;
CREATE POLICY "testimonials_select_public" ON public.testimonials FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "testimonials_staff_write" ON public.testimonials;
CREATE POLICY "testimonials_staff_write" ON public.testimonials FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- faqs ----------
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_faqs_published ON public.faqs(published);
CREATE INDEX IF NOT EXISTS idx_faqs_sort ON public.faqs(sort_order);

DROP POLICY IF EXISTS "faqs_select_public" ON public.faqs;
CREATE POLICY "faqs_select_public" ON public.faqs FOR SELECT
  TO anon, authenticated USING (published = true OR public.is_staff());

DROP POLICY IF EXISTS "faqs_staff_write" ON public.faqs;
CREATE POLICY "faqs_staff_write" ON public.faqs FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- bookings ----------
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_type text NOT NULL,
  event_date date,
  location text,
  guest_count int,
  budget text,
  message text,
  referral text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at);

DROP POLICY IF EXISTS "bookings_insert_public" ON public.bookings;
CREATE POLICY "bookings_insert_public" ON public.bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "bookings_staff_read" ON public.bookings;
CREATE POLICY "bookings_staff_read" ON public.bookings FOR SELECT
  TO authenticated USING (public.is_staff());

DROP POLICY IF EXISTS "bookings_staff_update" ON public.bookings;
CREATE POLICY "bookings_staff_update" ON public.bookings FOR UPDATE
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "bookings_staff_delete" ON public.bookings;
CREATE POLICY "bookings_staff_delete" ON public.bookings FOR DELETE
  TO authenticated USING (public.is_staff());

-- ---------- media ----------
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  alt_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_media_created ON public.media(created_at);

DROP POLICY IF EXISTS "media_select_public" ON public.media;
CREATE POLICY "media_select_public" ON public.media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "media_staff_write" ON public.media;
CREATE POLICY "media_staff_write" ON public.media FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- site_settings (single row) ----------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  company_name text NOT NULL DEFAULT 'Fiesta Agency',
  tagline text NOT NULL DEFAULT 'Moments that live long after the night ends.',
  logo_url text,
  email text,
  phone text,
  whatsapp text,
  address text,
  instagram text,
  facebook text,
  tiktok text,
  seo_title text,
  seo_description text,
  footer_text text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_public" ON public.site_settings;
CREATE POLICY "settings_select_public" ON public.site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "settings_staff_write" ON public.site_settings;
CREATE POLICY "settings_staff_write" ON public.site_settings FOR ALL
  TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ---------- updated_at trigger ----------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY['profiles','pages','sections','services','events',
      'portfolio_projects','testimonials','faqs','bookings','site_settings'])
  LOOP
    EXECUTE format($f$
      DROP TRIGGER IF EXISTS set_updated_at ON public.%I;
      CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I
      FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    $f$, t, t);
  END LOOP;
END $$;

-- ---------- seed site_settings ----------
INSERT INTO public.site_settings (id, company_name, tagline, email, phone, whatsapp, address,
  instagram, facebook, tiktok, seo_title, seo_description, footer_text)
VALUES (1,
  'Fiesta Agency',
  'Moments that live long after the night ends.',
  'hello@fiestaagency.example',
  '+1 (555) 000-0000',
  '+1 (555) 000-0000',
  'Design Studio, Lagos · London · Dubai',
  '@fiestaagency',
  'facebook.com/fiestaagency',
  '@fiestaagency',
  'Fiesta Agency — Unforgettable Events & Experiences',
  'Fiesta designs, produces and manages unforgettable weddings, celebrations, corporate events and premium experiences.',
  'Moments that live long after the night ends.')
ON CONFLICT (id) DO NOTHING;

-- ---------- seed pages ----------
INSERT INTO public.pages (slug, title, description) VALUES
  ('home', 'Home', 'The Fiesta Agency homepage experience.'),
  ('about', 'About', 'Who Fiesta is and what we believe.'),
  ('services', 'Services', 'What Fiesta creates.'),
  ('how-we-work', 'How We Work', 'From idea to experience.')
ON CONFLICT (slug) DO NOTHING;

-- ---------- seed services ----------
INSERT INTO public.services (title, slug, description, details, image_url, image_alt, sort_order, published) VALUES
  ('Event Planning', 'event-planning', 'End-to-end planning from initial concept through execution.',
    '{"items":["Logistics","Vendor coordination","Timelines","Budgeting","Event coordination"]}',
    'https://images.pexels.com/photos/2608516/pexels-photo-2608516.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Creative team planning an event', 1, true),
  ('Event Production', 'event-production', 'Technical and production management for extraordinary experiences.',
    '{"items":["Staging","Lighting","Sound","Technical planning","Production coordination","Live event execution","Streaming / broadcast"]}',
    'https://images.pexels.com/photos/2177813/pexels-photo-2177813.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Dramatic stage lighting setup', 2, true),
  ('Weddings & Celebrations', 'weddings-celebrations', 'Bespoke weddings and milestone celebrations.',
    '{"items":["Personalization","Atmosphere","Emotion","Detail"]}',
    'https://images.pexels.com/photos/16120212/pexels-photo-16120212.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Elegant wedding reception', 3, true),
  ('Corporate Events', 'corporate-events', 'Professional experiences for organizations and brands.',
    '{"items":["Corporate celebrations","Product launches","Award events","Conferences","Brand experiences"]}',
    'https://images.pexels.com/photos/167514/pexels-photo-167514.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Corporate event with dramatic lighting', 4, true),
  ('Private Events', 'private-events', 'Intimate and customized experiences. The scale may change. The attention to detail does not.',
    '{"items":["Intimate gatherings","Customized experiences","Personal celebrations"]}',
    'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Intimate candlelit celebration', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- ---------- seed events ----------
INSERT INTO public.events (title, slug, description, category, event_date, location, cover_image, cover_alt, gallery, status, featured, published, sort_order) VALUES
  ('An Evening in Gold', 'an-evening-in-gold',
    'A golden-hour wedding celebration where every surface caught the light. Over two hundred guests gathered beneath a canopy of warm suspended florals, moving from ceremony to reception as the sky shifted from amber to indigo.',
    'Wedding', '2026-02-14', 'Lagos, Nigeria',
    'https://images.pexels.com/photos/37975399/pexels-photo-37975399.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Luxurious event setting with ambient lighting',
    '["https://images.pexels.com/photos/16935999/pexels-photo-16935999.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16120244/pexels-photo-16120244.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16935986/pexels-photo-16935986.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    'completed', true, true, 1),
  ('The Lagos Garden Celebration', 'the-lagos-garden-celebration',
    'An outdoor celebration framed by tropical greenery and soft string lighting. Long communal tables encouraged conversation, while a live ensemble carried the evening from dinner into dancing.',
    'Celebration', '2026-03-22', 'Lagos, Nigeria',
    'https://images.pexels.com/photos/16935910/pexels-photo-16935910.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Lavishly decorated wedding reception',
    '["https://images.pexels.com/photos/29040997/pexels-photo-29040997.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16935894/pexels-photo-16935894.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    'completed', true, true, 2),
  ('A Night of New Beginnings', 'a-night-of-new-beginnings',
    'A corporate product launch staged in a converted warehouse. Architectural lighting, immersive sound, and a reveal moment choreographed to the second made the announcement feel like an event in itself.',
    'Corporate', '2026-05-08', 'London, UK',
    'https://images.pexels.com/photos/2177813/pexels-photo-2177813.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Stage with dramatic lighting setup',
    '["https://images.pexels.com/photos/976862/pexels-photo-976862.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/167514/pexels-photo-167514.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    'completed', true, true, 3),
  ('The Modern Black-Tie Affair', 'the-modern-black-tie-affair',
    'A black-tie gala for three hundred guests. A monochrome palette, sculptural florals, and a string quartet created an atmosphere that felt both restrained and alive.',
    'Celebration', '2026-06-19', 'Dubai, UAE',
    'https://images.pexels.com/photos/37827340/pexels-photo-37827340.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Stylish black and white dining setup',
    '["https://images.pexels.com/photos/14646752/pexels-photo-14646752.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16935903/pexels-photo-16935903.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    'upcoming', true, true, 4),
  ('An Intimate Celebration', 'an-intimate-celebration',
    'A private dinner for thirty. Candlelight, a single long table, and a menu designed around the guest of honor turned a birthday into something closer to a memory.',
    'Private', '2026-07-04', 'Lagos, Nigeria',
    'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Warm intimate celebration with candles',
    '["https://images.pexels.com/photos/6162805/pexels-photo-6162805.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/3937411/pexels-photo-3937411.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    'upcoming', false, true, 5),
  ('The Executive Experience', 'the-executive-experience',
    'A leadership conference and awards evening for a global firm. Stage design, broadcast-quality sound, and a scripted run of show turned a corporate calendar event into a brand moment.',
    'Corporate', '2026-09-12', 'London, UK',
    'https://images.pexels.com/photos/167514/pexels-photo-167514.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Live performance with dramatic lighting',
    '["https://images.pexels.com/photos/24069/pexels-photo-24069.jpg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/35880/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    'upcoming', false, true, 6)
ON CONFLICT (slug) DO NOTHING;

-- ---------- seed portfolio ----------
INSERT INTO public.portfolio_projects (title, slug, category, description, story, year, cover_image, cover_alt, gallery, published, sort_order) VALUES
  ('An Evening in Gold', 'portfolio-evening-in-gold', 'Wedding',
    'A golden-hour wedding beneath suspended florals and amber light.',
    '{"paragraphs":["The brief was simple: make the room feel like the last hour of sunlight. We built the entire design around a single palette — gold, ivory, and the deep green of fresh foliage.","Over two hundred guests moved through a sequence of spaces, each one shifting in mood as the evening progressed, until the final dance floor felt less like a reception and more like a celebration of the night itself."]}'::jsonb,
    2026,
    'https://images.pexels.com/photos/37975406/pexels-photo-37975406.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Luxurious wedding table setup',
    '["https://images.pexels.com/photos/16120212/pexels-photo-16120212.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16935999/pexels-photo-16935999.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/36873712/pexels-photo-36873712.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    true, 1),
  ('The Modern Black-Tie Affair', 'portfolio-modern-black-tie', 'Celebration',
    'A monochrome gala with sculptural florals and a string quartet.',
    '{"paragraphs":["Three hundred guests. One palette. No color except candlelight.","We designed the room as a single composition — table, light, sound, and movement — so that the evening read as one continuous gesture."]}'::jsonb,
    2026,
    'https://images.pexels.com/photos/37827340/pexels-photo-37827340.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Stylish black and white dining setup',
    '["https://images.pexels.com/photos/14646752/pexels-photo-14646752.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16935986/pexels-photo-16935986.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    true, 2),
  ('A Night of New Beginnings', 'portfolio-new-beginnings', 'Corporate',
    'A product launch staged in a converted warehouse with architectural lighting.',
    '{"paragraphs":["The product was the story. Our job was to make the room disappear at the right moment.","A choreographed reveal — lighting, sound, and movement timed to the second — turned an announcement into an event the room would remember."]}'::jsonb,
    2026,
    'https://images.pexels.com/photos/2177813/pexels-photo-2177813.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Dramatic stage lighting',
    '["https://images.pexels.com/photos/976862/pexels-photo-976862.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/167514/pexels-photo-167514.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    true, 3),
  ('An Intimate Celebration', 'portfolio-intimate-celebration', 'Private',
    'A candlelit dinner for thirty, designed around a single long table.',
    '{"paragraphs":["Thirty guests. One table. A menu built around the guest of honor.","The room was lit almost entirely by candlelight, so the evening felt less like a dinner and more like a conversation that happened to include a meal."]}'::jsonb,
    2026,
    'https://images.pexels.com/photos/1405528/pexels-photo-1405528.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Intimate candlelit celebration',
    '["https://images.pexels.com/photos/6162805/pexels-photo-6162805.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/3937411/pexels-photo-3937411.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    true, 4),
  ('The Lagos Garden Celebration', 'portfolio-garden-celebration', 'Celebration',
    'An outdoor celebration framed by tropical greenery and string lighting.',
    '{"paragraphs":["We took the garden as the given and designed everything else to disappear into it.","Long communal tables, soft string lights, and a live ensemble carried the evening from dinner into dancing without anyone noticing the transition."]}'::jsonb,
    2026,
    'https://images.pexels.com/photos/16935910/pexels-photo-16935910.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'Lavishly decorated reception',
    '["https://images.pexels.com/photos/29040997/pexels-photo-29040997.jpeg?auto=compress&cs=tinysrgb&w=1600","https://images.pexels.com/photos/16935894/pexels-photo-16935894.jpeg?auto=compress&cs=tinysrgb&w=1600"]'::jsonb,
    true, 5)
ON CONFLICT (slug) DO NOTHING;

-- ---------- seed testimonials ----------
INSERT INTO public.testimonials (client_name, quote, event_type, location, published, sort_order) VALUES
  ('Amara O.', 'Fiesta did not plan our wedding. They composed it. Every moment felt intentional, and the night moved like it had been written for us.', 'Wedding', 'Lagos', true, 1),
  ('David & Sarah K.', 'We came in with an idea and left with an experience. The team understood what we wanted before we could fully say it.', 'Wedding', 'London', true, 2),
  ('Mr. Adekunle', 'Our product launch felt like a film premiere. The room reacted exactly when we wanted them to. That is not luck — that is craft.', 'Corporate', 'Lagos', true, 3),
  ('Helena R.', 'They turned a birthday dinner into something I will remember for the rest of my life. Thirty people, and every single one felt seen.', 'Private', 'Dubai', true, 4)
ON CONFLICT DO NOTHING;

-- ---------- seed faqs ----------
INSERT INTO public.faqs (question, answer, category, published, sort_order) VALUES
  ('What types of events does Fiesta handle?', 'Fiesta designs and produces weddings, celebrations, corporate events, product launches, conferences, award ceremonies, and private gatherings. If it can be experienced, we can create it.', 'General', true, 1),
  ('How early should we book?', 'We recommend reaching out as early as possible — ideally six months or more before your event date. Larger productions may require a year of lead time. That said, we occasionally take on shorter timelines when our calendar allows.', 'Booking', true, 2),
  ('Does Fiesta handle event production?', 'Yes. Production is a core part of what we do — staging, lighting, sound, technical planning, live execution, and broadcast or streaming when needed. We do not simply plan the event; we build it.', 'Services', true, 3),
  ('Can Fiesta work with our existing vendors?', 'Absolutely. We frequently collaborate with preferred vendors, venues, and in-house teams. Our role is to coordinate the entire experience, and that includes integrating seamlessly with partners you already trust.', 'Services', true, 4),
  ('Do you handle corporate events?', 'Yes — corporate events are one of our specialties. From product launches and conferences to award nights and brand experiences, we bring the same creative direction to professional settings that we bring to private celebrations.', 'Services', true, 5),
  ('Can you plan destination events?', 'Yes. Fiesta operates across multiple cities and can manage destination events end to end — logistics, local coordination, travel, and the full on-the-ground production.', 'Booking', true, 6),
  ('How does the consultation process work?', 'It begins with a conversation. Tell us what you are imagining through the Plan Your Event form, and our team will review your vision and reach out to schedule a consultation. From there we move through discovery, design, planning, and production together.', 'Booking', true, 7)
ON CONFLICT DO NOTHING;

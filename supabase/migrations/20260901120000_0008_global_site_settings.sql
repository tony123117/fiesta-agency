-- =============================================
-- 0008_global_site_settings.sql
-- Extends site_settings with navigation, footer,
-- social links, and SEO columns
-- =============================================

-- Navigation (JSONB array of nav items)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS navigation jsonb DEFAULT '[]'::jsonb;

-- Footer link groups (JSONB array of group objects)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_groups jsonb DEFAULT '[]'::jsonb;

-- Footer CTA section (JSONB object)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_cta jsonb;

-- Copyright text
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS copyright_text text;

-- OG Image URL
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS og_image_url text;

-- Navigation CTA button
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS nav_cta_label text DEFAULT 'PLAN YOUR EVENT';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS nav_cta_url text DEFAULT '/contact';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS nav_cta_visible boolean DEFAULT true;

-- Footer background image (for CTA hero section)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS footer_hero_image text;

-- Seed default navigation (matching existing hardcoded NAV_LINKS)
UPDATE public.site_settings SET navigation = '[
  {"label":"About","to":"/about","visible":true,"order":0},
  {"label":"Services","to":"/services","visible":true,"order":1},
  {"label":"Events","to":"/events","visible":true,"order":2},
  {"label":"Portfolio","to":"/portfolio","visible":true,"order":3},
  {"label":"How We Work","to":"/how-we-work","visible":true,"order":4},
  {"label":"Contact","to":"/contact","visible":true,"order":5}
]'::jsonb WHERE id = 1;

-- Seed default footer groups (matching existing hardcoded Footer)
UPDATE public.site_settings SET footer_groups = '[
  {"title":"PAGES","visible":true,"order":0,"links":[
    {"label":"Home","to":"/","visible":true},
    {"label":"About Us","to":"/about","visible":true},
    {"label":"Services","to":"/services","visible":true},
    {"label":"Portfolio","to":"/portfolio","visible":true},
    {"label":"Events","to":"/events","visible":true},
    {"label":"How We Work","to":"/how-we-work","visible":true},
    {"label":"Contact","to":"/contact","visible":true}
  ]},
  {"title":"OUR SERVICES","visible":true,"order":1,"links":[
    {"label":"Weddings & Celebrations","to":"/services","visible":true},
    {"label":"Corporate Events","to":"/services","visible":true},
    {"label":"Private Events","to":"/services","visible":true},
    {"label":"Concerts & Live Shows","to":"/services","visible":true},
    {"label":"Event Production","to":"/services","visible":true},
    {"label":"Décor & Design","to":"/services","visible":true}
  ]}
]'::jsonb WHERE id = 1;

-- Seed default footer CTA
UPDATE public.site_settings SET footer_cta = '{"heading":"LET''S CREATE SOMETHING EXTRAORDINARY TOGETHER.","subtext":"From intimate celebrations to large-scale productions, we bring creative direction, planning and execution together under one roof.","button_label":"PLAN YOUR EVENT","button_url":"/contact","visible":true}'::jsonb WHERE id = 1;

-- Seed copyright
UPDATE public.site_settings SET copyright_text = '© 2026 Fiesta Events. All Rights Reserved.' WHERE id = 1;

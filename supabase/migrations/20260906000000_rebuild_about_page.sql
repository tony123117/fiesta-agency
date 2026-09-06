-- Clean up old about page sections and seed 8 new ones
-- The about page ID is: b4ae785c-a707-4483-a6ef-3a714bb387f3

-- First, delete old sections via a security-definer function
CREATE OR REPLACE FUNCTION delete_about_sections()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM sections WHERE page_id = 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
END;
$$;

SELECT delete_about_sections();

DROP FUNCTION delete_about_sections();

-- Insert 8 new about sections
INSERT INTO sections (id, page_id, title, section_type, content, sort_order, published, created_at, updated_at)
VALUES
  -- S01: About Introduction
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'About Introduction',
    'about-intro',
    '{
      "eyebrow": "ABOUT FIESTA",
      "heading": "WE DON'\''T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.",
      "body": "At Fiesta, we believe every moment has the potential to become extraordinary. From intimate celebrations to large-scale productions, we bring creativity, precision and passion to every detail.",
      "cta_text": "OUR APPROACH",
      "cta_url": "#",
      "image": "",
      "image_alt": ""
    }'::jsonb,
    0,
    true,
    now(),
    now()
  ),
  -- S02: Our Story
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Our Story',
    'about-story',
    '{
      "eyebrow": "OUR STORY",
      "heading": "BUILT ON PASSION.\nDRIVEN BY PURPOSE.",
      "body": "Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.\n\nOver the years, we have evolved into a trusted full-service event agency, delivering extraordinary experiences for clients around the world.",
      "image": "",
      "image_alt": ""
    }'::jsonb,
    1,
    true,
    now(),
    now()
  ),
  -- S03: Our Identity
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Our Identity',
    'about-editorial',
    '{
      "eyebrow": "WHAT DRIVES US",
      "heading": "WE TURN IDEAS\nINTO MEMORABLE\nEXPERIENCES.",
      "body": "Fiesta takes an initial idea and develops it into a cohesive experience — concept, creative direction, planning, production, and execution — all working together as one vision."
    }'::jsonb,
    2,
    true,
    now(),
    now()
  ),
  -- S04: Our Foundation
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Our Foundation',
    'about-foundation',
    '{
      "eyebrow": "OUR FOUNDATION",
      "heading": "WHAT WE\nBELIEVE IN.",
      "mission": { "title": "OUR MISSION", "description": "We turn ideas into well-crafted experiences by combining creativity, entertainment, production and precision." },
      "vision": { "title": "OUR VISION", "description": "Building a trusted and creative event company. Creating experiences people remember. Growing across the region." },
      "values": { "title": "OUR VALUES", "description": "Creativity. Excellence. Integrity. Passion. Teamwork." }
    }'::jsonb,
    3,
    true,
    now(),
    now()
  ),
  -- S05: Our Values
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Our Values',
    'about-values',
    '{
      "eyebrow": "OUR VALUES",
      "heading": "THE PRINCIPLES\nBEHIND THE\nEXPERIENCE.",
      "values": [
        { "id": "1", "name": "CREATIVITY" },
        { "id": "2", "name": "PASSION" },
        { "id": "3", "name": "INTEGRITY" },
        { "id": "4", "name": "EXCELLENCE" },
        { "id": "5", "name": "TEAMWORK" }
      ],
      "image": "",
      "image_alt": ""
    }'::jsonb,
    4,
    true,
    now(),
    now()
  ),
  -- S06: Our Team
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Our Team',
    'about-team',
    '{
      "eyebrow": "OUR TEAM",
      "heading": "THE PEOPLE\nBEHIND THE\nMOMENTS.",
      "members": []
    }'::jsonb,
    5,
    true,
    now(),
    now()
  ),
  -- S07: Why Fiesta
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Why Fiesta',
    'about-why',
    '{
      "heading": "WHY FIESTA?",
      "points": [
        { "id": "1", "title": "CREATIVE THINKING", "description": "We approach every event from its own story." },
        { "id": "2", "title": "SEAMLESS EXECUTION", "description": "We coordinate the moving parts behind the scenes." },
        { "id": "3", "title": "ATTENTION TO DETAIL", "description": "We care about the details guests may never notice, but always feel." }
      ]
    }'::jsonb,
    6,
    true,
    now(),
    now()
  ),
  -- S08: Cinematic Closing
  (
    gen_random_uuid(),
    'b4ae785c-a707-4483-a6ef-3a714bb387f3',
    'Cinematic Closing',
    'about-closing',
    '{
      "heading": "YOUR VISION.\nOUR EXPERIENCE.",
      "cta_text": "LET'\''S CREATE IT",
      "cta_url": "/contact",
      "background_image": "",
      "background_image_alt": ""
    }'::jsonb,
    7,
    true,
    now(),
    now()
  );

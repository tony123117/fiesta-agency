-- Migration: Replace 8 old about sections with new 6-section design
-- Run this in Supabase SQL Editor
-- About page ID: b4ae785c-a707-4483-a6ef-3a714bb387f3

-- Step 1: Delete ALL old about sections for this page
DELETE FROM sections
WHERE page_id = 'b4ae785c-a707-4483-a6ef-3a714bb387f3'
  AND section_type IN (
    'about-intro', 'about-story', 'about-editorial', 'about-foundation',
    'about-values', 'about-team', 'about-why', 'about-closing'
  );

-- Step 2: Insert new about-intro (with MVV + team embedded)
INSERT INTO sections (
  id, page_id, section_type, title, sort_order, published, content
) VALUES (
  gen_random_uuid(),
  'b4ae785c-a707-4483-a6ef-3a714bb387f3',
  'about-intro',
  'About Introduction',
  0,
  true,
  jsonb_build_object(
    'eyebrow', 'ABOUT FIESTA',
    'heading', E'WE DON''T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.',
    'body', 'At Fiesta, we believe every moment has the potential to become extraordinary. From intimate celebrations to large-scale productions, we bring creativity, precision and passion to every detail.',
    'image', '',
    'image_alt', '',
    'mission', jsonb_build_object(
      'icon', 'target',
      'title', 'OUR MISSION',
      'description', 'We turn ideas into well-crafted experiences by combining creativity, entertainment, production and precision.'
    ),
    'vision', jsonb_build_object(
      'icon', 'eye',
      'title', 'OUR VISION',
      'description', 'Building a trusted and creative event company. Creating experiences people remember. Growing across the region.'
    ),
    'values_intro', jsonb_build_object(
      'icon', 'star',
      'title', 'OUR VALUES',
      'description', 'Creativity. Excellence. Integrity. Passion. Teamwork.'
    ),
    'team_eyebrow', 'OUR TEAM',
    'team_members', '[]'::jsonb
  )
);

-- Step 3: Insert new about-story
INSERT INTO sections (
  id, page_id, section_type, title, sort_order, published, content
) VALUES (
  gen_random_uuid(),
  'b4ae785c-a707-4483-a6ef-3a714bb387f3',
  'about-story',
  'Our Story',
  1,
  true,
  jsonb_build_object(
    'eyebrow', 'OUR STORY',
    'heading', 'BUILT ON PASSION.\nDRIVEN BY PURPOSE.',
    'body', E'Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.\n\nOver the years, we have evolved into a trusted full-service event agency, delivering extraordinary experiences for clients around the world.',
    'image', '',
    'image_alt', ''
  )
);

-- Step 4: Insert new about-foundation (centered editorial, no MVV columns)
INSERT INTO sections (
  id, page_id, section_type, title, sort_order, published, content
) VALUES (
  gen_random_uuid(),
  'b4ae785c-a707-4483-a6ef-3a714bb387f3',
  'about-foundation',
  'Our Foundation',
  2,
  true,
  jsonb_build_object(
    'eyebrow', 'WHAT DRIVES US',
    'heading', 'WE TURN IDEAS\nINTO MEMORABLE\nEXPERIENCES.',
    'body', 'Fiesta takes an initial idea and develops it into a cohesive experience — concept, creative direction, planning, production, and execution — all working together as one vision.'
  )
);

-- Step 5: Insert new about-values
INSERT INTO sections (
  id, page_id, section_type, title, sort_order, published, content
) VALUES (
  gen_random_uuid(),
  'b4ae785c-a707-4483-a6ef-3a714bb387f3',
  'about-values',
  'Our Values',
  3,
  true,
  jsonb_build_object(
    'eyebrow', 'OUR VALUES',
    'heading', 'THE PRINCIPLES\nBEHIND THE\nEXPERIENCE.',
    'values', jsonb_build_array(
      jsonb_build_object('id', '1', 'name', 'CREATIVITY'),
      jsonb_build_object('id', '2', 'name', 'PASSION'),
      jsonb_build_object('id', '3', 'name', 'INTEGRITY'),
      jsonb_build_object('id', '4', 'name', 'EXCELLENCE'),
      jsonb_build_object('id', '5', 'name', 'TEAMWORK')
    ),
    'image', '',
    'image_alt', ''
  )
);

-- Step 6: Insert new about-why
INSERT INTO sections (
  id, page_id, section_type, title, sort_order, published, content
) VALUES (
  gen_random_uuid(),
  'b4ae785c-a707-4483-a6ef-3a714bb387f3',
  'about-why',
  'Why Fiesta',
  4,
  true,
  jsonb_build_object(
    'heading', 'WHY FIESTA?',
    'points', jsonb_build_array(
      jsonb_build_object('id', '1', 'title', 'CREATIVE THINKING', 'description', 'We approach every event from its own story.'),
      jsonb_build_object('id', '2', 'title', 'SEAMLESS EXECUTION', 'description', 'We coordinate the moving parts behind the scenes.'),
      jsonb_build_object('id', '3', 'title', 'ATTENTION TO DETAIL', 'description', 'We care about the details guests may never notice, but always feel.')
    )
  )
);

-- Step 7: Insert new about-closing
INSERT INTO sections (
  id, page_id, section_type, title, sort_order, published, content
) VALUES (
  gen_random_uuid(),
  'b4ae785c-a707-4483-a6ef-3a714bb387f3',
  'about-closing',
  'Cinematic Closing',
  5,
  true,
  jsonb_build_object(
    'heading', 'YOUR VISION.\nOUR EXPERIENCE.',
    'cta_text', E'LET''S CREATE IT',
    'cta_url', '/contact',
    'background_image', '',
    'background_image_alt', ''
  )
);

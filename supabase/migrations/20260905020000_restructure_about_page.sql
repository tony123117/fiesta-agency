-- Replace About page sections with new layout matching reference design

DO $$
DECLARE
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
  hero_image TEXT := 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80';
BEGIN
  DELETE FROM sections WHERE page_id = about_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
  (about_id, 'Hero', 'about-hero',
   jsonb_build_object(
     'eyebrow', 'ABOUT US',
     'heading', 'WE DO NOT JUST'||chr(10)||'PLAN EVENTS.'||chr(10)||chr(10)||'WE CREATE'||chr(10)||'EXPERIENCES THAT'||chr(10)||'STAY WITH YOU'||chr(10)||'FOREVER.',
     'body', 'At Fiesta, we believe every moment has the potential to be extraordinary.',
     'cta_text', 'OUR APPROACH',
     'cta_url', '/about#approach',
     'image', '',
     'image_alt', ''
   ),
   0, true),

  (about_id, 'Our Story', 'about-story',
   jsonb_build_object(
     'eyebrow', 'OUR STORY',
     'heading', 'BUILT ON PASSION.'||chr(10)||'DRIVEN BY PURPOSE.',
     'body', 'Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.'||chr(10)||chr(10)||'Today, we are a full-service event management company trusted by individuals, brands, and organizations to deliver experiences that resonate long after the last guest departs.',
     'image', '',
     'image_alt', '',
     'cta_text', 'OUR SERVICES',
     'cta_url', '/services'
   ),
   1, true),

  (about_id, 'Intro Image', 'about-intro-image',
   jsonb_build_object('image', hero_image, 'image_alt', 'Fiesta event production'),
   2, true),

  (about_id, 'Mission / Vision / Values', 'about-mission-vision-values',
   jsonb_build_object(
     'mission_heading', 'Our Mission',
     'mission_body', 'To turn ideas into well-planned events by combining creativity, entertainment, production, communication, logistics and professional customer service.',
     'vision_heading', 'Our Vision',
     'vision_body', 'To become a trusted and creative event brand in Rwanda and, over time, across the region.',
     'values_heading', 'Our Values',
     'values_body', 'Creativity, Excellence, Reliability, Passion, Teamwork, Integrity.'
   ),
   3, true),

  (about_id, 'Team', 'about-team',
   jsonb_build_object('heading', 'OUR TEAM', 'members', '[]'::jsonb),
   4, true);

END $$;

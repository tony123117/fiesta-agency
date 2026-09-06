-- Complete About page redesign: 6 premium editorial sections
-- S01: about-hero, S02: about-story, S03: about-values, S04: about-vision-cta, S05: about-manifesto, S06: about-team

DO $$
DECLARE
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
  story_img TEXT := 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=80';
  values_img TEXT := 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80';
  vision_img TEXT := 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80';
BEGIN
  DELETE FROM sections WHERE page_id = about_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES

  (about_id, 'About Fiesta', 'about-hero',
   jsonb_build_object(
     'eyebrow', 'ABOUT FIESTA',
     'heading', 'We turn ideas into'||chr(10)||'memorable experiences.',
     'body', 'Fiesta Agency is an event planning and entertainment company built on vision, creativity, production, entertainment and flawless execution.',
     'image', '',
     'image_alt', ''
   ),
   0, true),

  (about_id, 'Our Story', 'about-story',
   jsonb_build_object(
     'eyebrow', 'OUR STORY',
     'heading', 'BUILT ON PASSION.'||chr(10)||'DRIVEN BY PURPOSE.',
     'body', 'Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.'||chr(10)||chr(10)||'Over the years, we have evolved into a trusted full-service event agency, delivering extraordinary experiences for clients around the world.',
     'image', story_img,
     'image_alt', 'Fiesta event production'
   ),
   1, true),

  (about_id, 'Our Values', 'about-values',
   jsonb_build_object(
     'eyebrow', 'OUR VALUES',
     'heading', 'WHAT WE'||chr(10)||'BELIEVE IN.',
     'values', jsonb_build_array(
       jsonb_build_object('id', '1', 'name', 'CREATIVITY'),
       jsonb_build_object('id', '2', 'name', 'PASSION'),
       jsonb_build_object('id', '3', 'name', 'INTEGRITY'),
       jsonb_build_object('id', '4', 'name', 'EXCELLENCE'),
       jsonb_build_object('id', '5', 'name', 'TEAMWORK')
     ),
     'image', values_img
   ),
   2, true),

  (about_id, 'Vision CTA', 'about-vision-cta',
   jsonb_build_object(
     'heading', 'YOUR VISION.'||chr(10)||'OUR EXPERIENCE.',
     'subheading', '',
     'button_text', 'LET''S CREATE',
     'button_url', '/contact',
     'background_image', vision_img
   ),
   3, true),

  (about_id, 'Mission / Vision / Values', 'about-manifesto',
   jsonb_build_object(
     'mission_heading', 'Our Mission',
     'mission_body', 'To turn ideas into well-planned events by combining creativity, entertainment, production, communication, logistics and professional customer service.',
     'vision_heading', 'Our Vision',
     'vision_body', 'To become a trusted and creative event brand in Rwanda and, over time, across the region.',
     'values_heading', 'Our Values',
     'values_body', 'Creativity, Excellence, Reliability, Passion, Teamwork, Integrity.'
   ),
   4, true),

  (about_id, 'Our Team', 'about-team',
   jsonb_build_object('heading', 'OUR TEAM', 'members', '[]'::jsonb),
   5, true);

END $$;

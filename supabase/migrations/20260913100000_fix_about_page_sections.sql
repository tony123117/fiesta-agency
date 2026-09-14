-- Fix About page sections: replace invalid types (about-editorial, about-team)
-- with valid types (about-intro, about-story, about-foundation, about-values,
-- about-why, about-closing). Populate with production content from hardcoded About.tsx.
--
-- About page ID: b4ae785c-a707-4483-a6ef-3a714bb387f3

DO $$
DECLARE
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
BEGIN
  -- Delete all existing about sections (clean slate)
  DELETE FROM sections WHERE page_id = about_id;

  -- S01: About Intro (hero + MVV + team grid)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'About Introduction', 'about-intro',
    jsonb_build_object(
      'eyebrow', 'ABOUT FIESTA',
      'heading', 'WE DON''T JUST' || chr(10) || 'PLAN EVENTS.' || chr(10) || 'WE CREATE' || chr(10) || 'EXPERIENCES.',
      'body', 'Fiesta Agency is a creative event company focused on producing unforgettable weddings, concerts, corporate experiences and private celebrations across Rwanda.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237163289-ytc5w0r4sur.JPG',
      'image_alt', 'Elegant wedding ceremony setup',
      'mission', jsonb_build_object(
        'title', 'OUR MISSION',
        'description', 'We combine creativity, entertainment, production and precision to transform your vision into an event that resonates with every guest.'
      ),
      'vision', jsonb_build_object(
        'title', 'OUR VISION',
        'description', 'Creating experiences people remember. Growing across the region. Becoming the name people think of when they imagine an extraordinary event.'
      ),
      'values_intro', jsonb_build_object(
        'title', 'OUR VALUES',
        'description', 'Creativity. Excellence. Integrity. Passion.'
      ),
      'team_eyebrow', 'THE TEAM',
      'team_members', jsonb_build_array(
        jsonb_build_object('id', 'tm1', 'name', 'Jean-Paul Habimana', 'role', 'Founder & Creative Director', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237063512-hk7ssv7z6e5.JPG'),
        jsonb_build_object('id', 'tm2', 'name', 'Alice Uwimana', 'role', 'Head of Production', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237078525-xb8l1nuw1wo.JPG'),
        jsonb_build_object('id', 'tm3', 'name', 'David Niyonzima', 'role', 'Event Coordinator', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG'),
        jsonb_build_object('id', 'tm4', 'name', 'Grace Mukamana', 'role', 'Design Lead', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237098705-9rjfftokfzq.JPG'),
        jsonb_build_object('id', 'tm5', 'name', 'Samuel Bizimana', 'role', 'Technical Director', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237065570-p1isqdooo8m.JPG')
      )
    ),
    0, true);

  -- S02: Our Story
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Our Story', 'about-story',
    jsonb_build_object(
      'eyebrow', 'OUR STORY',
      'heading', 'FROM A SINGLE IDEA' || chr(10) || 'TO A REGIONAL' || chr(10) || 'LEADER.',
      'body', 'Fiesta started with a simple belief: every gathering deserves to feel extraordinary. What began as a small event coordination effort has grown into one of Rwanda''s most trusted creative event agencies.' || chr(10) || chr(10) || 'We''ve produced weddings that make people cry, concerts that make people dance until sunrise, and corporate events that inspire entire organizations. Our work speaks for itself — and our clients come back because they trust us to deliver.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237084674-mrxqrfeqzf.JPG',
      'image_alt', 'Fiesta team coordinating event production behind the scenes'
    ),
    1, true);

  -- S03: Mission / Vision / Values (foundation)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Our Foundation', 'about-foundation',
    jsonb_build_object(
      'eyebrow', 'OUR FOUNDATION',
      'heading', 'TURN IDEAS INTO' || chr(10) || 'WELL-CRAFTED' || chr(10) || 'EXPERIENCES.',
      'body', 'We combine creativity, entertainment, production and precision to transform your vision into an event that resonates with every guest.'
    ),
    2, true);

  -- S04: Values
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Our Values', 'about-values',
    jsonb_build_object(
      'eyebrow', 'OUR VALUES',
      'heading', 'THE PRINCIPLES' || chr(10) || 'BEHIND OUR WORK.',
      'values', jsonb_build_array(
        jsonb_build_object('id', 'v1', 'name', 'CREATIVITY'),
        jsonb_build_object('id', 'v2', 'name', 'EXCELLENCE'),
        jsonb_build_object('id', 'v3', 'name', 'INTEGRITY'),
        jsonb_build_object('id', 'v4', 'name', 'PASSION')
      ),
      'image', '',
      'image_alt', ''
    ),
    3, true);

  -- S05: Why Fiesta
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Why Fiesta', 'about-why',
    jsonb_build_object(
      'heading', 'WHY FIESTA?',
      'points', jsonb_build_array(
        jsonb_build_object('id', 'w1', 'title', 'CREATIVE THINKING', 'description', 'We approach every event from its own story.'),
        jsonb_build_object('id', 'w2', 'title', 'SEAMLESS EXECUTION', 'description', 'We coordinate the moving parts behind the scenes.'),
        jsonb_build_object('id', 'w3', 'title', 'ATTENTION TO DETAIL', 'description', 'We care about the details guests may never notice, but always feel.')
      )
    ),
    4, true);

  -- S06: CTA Closing
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Cinematic Closing', 'about-closing',
    jsonb_build_object(
      'heading', 'READY TO CREATE' || chr(10) || 'SOMETHING EXTRAORDINARY?',
      'cta_text', 'GET IN TOUCH',
      'cta_url', '/contact',
      'background_image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237175061-z8v0lre8e9.JPG',
      'background_image_alt', 'Elegant outdoor celebration with warm atmospheric lighting'
    ),
    5, true);

  -- Update SEO metadata on the about page
  UPDATE pages SET
    seo_title = 'About Fiesta Agency | Rwanda',
    seo_description = 'Learn about Fiesta — a creative event agency turning ideas into memorable experiences across Rwanda.',
    updated_at = now()
  WHERE id = about_id;

END $$;

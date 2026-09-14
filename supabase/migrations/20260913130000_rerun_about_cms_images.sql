-- Re-run about page CMS with portfolio images (migration was applied before update)
DO $$
DECLARE
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
BEGIN
  DELETE FROM sections WHERE page_id = about_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'About Hero', 'about-intro',
    jsonb_build_object(
      'eyebrow', 'ABOUT FIESTA',
      'heading', 'WE DON''T JUST' || chr(10) || 'PLAN EVENTS.' || chr(10) || 'WE CREATE' || chr(10) || 'EXPERIENCES.',
      'body', 'Fiesta Agency is a creative event company focused on producing unforgettable weddings, concerts, corporate experiences and private celebrations across Rwanda.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237165565-0wd1p2pkzpj.JPG',
      'image_alt', 'Elegant wedding ceremony setup',
      'image2', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237175061-z8v0lre8e9.JPG',
      'image2_alt', 'Event production and lighting'
    ), 0, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Our Story', 'about-story',
    jsonb_build_object(
      'eyebrow', 'OUR STORY',
      'heading', 'FROM A SINGLE IDEA' || chr(10) || 'TO A REGIONAL' || chr(10) || 'LEADER.',
      'paragraphs', jsonb_build_array(
        'Fiesta started with a simple belief: every gathering deserves to feel extraordinary. What began as a small event coordination effort has grown into one of Rwanda''s most trusted creative event agencies.',
        'We''ve produced weddings that make people cry, concerts that make people dance until sunrise, and corporate events that inspire entire organizations. Our work speaks for itself — and our clients come back because they trust us to deliver.'
      ),
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237084674-mrxqrfeqzf.JPG',
      'image_alt', 'Fiesta team coordinating event production behind the scenes'
    ), 1, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Mission & Vision', 'about-mission',
    jsonb_build_object(
      'mission_heading', 'TURN IDEAS INTO' || chr(10) || 'WELL-CRAFTED' || chr(10) || 'EXPERIENCES.',
      'mission_body', 'We combine creativity, entertainment, production and precision to transform your vision into an event that resonates with every guest.',
      'vision_heading', 'BUILDING A TRUSTED' || chr(10) || 'CREATIVE EVENT' || chr(10) || 'COMPANY.',
      'vision_body', 'Creating experiences people remember. Growing across the region. Becoming the name people think of when they imagine an extraordinary event.'
    ), 2, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Our Values', 'about-values',
    jsonb_build_object(
      'eyebrow', 'OUR VALUES',
      'heading', 'THE PRINCIPLES' || chr(10) || 'BEHIND OUR WORK.',
      'values', jsonb_build_array(
        jsonb_build_object('id', 'v1', 'num', '01', 'title', 'CREATIVITY', 'text', 'Every event is a blank canvas. We bring fresh thinking and original ideas to every project.'),
        jsonb_build_object('id', 'v2', 'num', '02', 'title', 'EXCELLENCE', 'text', 'We don''t settle for average. Every detail is refined until it reaches our highest standard.'),
        jsonb_build_object('id', 'v3', 'num', '03', 'title', 'INTEGRITY', 'text', 'Transparent communication, honest pricing, and genuine care for every client relationship.'),
        jsonb_build_object('id', 'v4', 'num', '04', 'title', 'PASSION', 'text', 'We love what we do. That energy translates into events that feel alive and memorable.')
      )
    ), 3, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'The Team', 'about-team',
    jsonb_build_object(
      'eyebrow', 'THE TEAM',
      'heading', 'THE PEOPLE BEHIND' || chr(10) || 'THE MAGIC.',
      'members', jsonb_build_array(
        jsonb_build_object('id', 'tm1', 'name', 'Jean-Paul Habimana', 'role', 'Founder & Creative Director', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237168928-llt7gkihpq.JPG'),
        jsonb_build_object('id', 'tm2', 'name', 'Alice Uwimana', 'role', 'Head of Production', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237170984-1k51s9ajkxp.JPG'),
        jsonb_build_object('id', 'tm3', 'name', 'David Niyonzima', 'role', 'Event Coordinator', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237072595-bmu1u9nj21h.JPG'),
        jsonb_build_object('id', 'tm4', 'name', 'Grace Mukamana', 'role', 'Design Lead', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237160878-xn7u6tvntc.JPG'),
        jsonb_build_object('id', 'tm5', 'name', 'Samuel Bizimana', 'role', 'Technical Director', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237166605-f027qes5wyn.JPG')
      )
    ), 4, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (about_id, 'Closing CTA', 'about-closing',
    jsonb_build_object(
      'heading', 'READY TO CREATE' || chr(10) || 'SOMETHING EXTRAORDINARY?',
      'cta_text', 'GET IN TOUCH',
      'cta_url', '/contact',
      'background_image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237175061-z8v0lre8e9.JPG',
      'background_image_alt', 'Elegant outdoor celebration with warm atmospheric lighting'
    ), 5, true);

  UPDATE pages SET
    seo_title = 'About Fiesta Agency | Rwanda',
    seo_description = 'Learn about Fiesta — a creative event agency turning ideas into memorable experiences across Rwanda.',
    updated_at = now()
  WHERE id = about_id;
END $$;

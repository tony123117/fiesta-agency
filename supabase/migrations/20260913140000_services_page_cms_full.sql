-- Services page fully CMS: seed all 8 sections with original design content
-- Uses existing section types: services-hero, services-featured, stats,
-- services-directory, services-philosophy, services-process, testimonials, services-cta

DO $$
DECLARE
  svc_id UUID;
BEGIN
  SELECT id INTO svc_id FROM pages WHERE slug = 'services';
  IF svc_id IS NULL THEN RETURN; END IF;

  DELETE FROM sections WHERE page_id = svc_id;

  -- S01: Hero (dual images)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Services Hero', 'services-hero',
    jsonb_build_object(
      'eyebrow', 'OUR SERVICES',
      'heading', 'EVERY DETAIL' || chr(10) || 'CRAFTED TO' || chr(10) || 'PERFECTION.',
      'description', 'From concept to execution, we offer end-to-end event solutions tailored to your vision. Whatever the occasion, we make it extraordinary.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
      'image_alt', 'Luxury event setup with elegant decor and warm lighting',
      'image2', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181965-r5gizmmxm5.JPG',
      'image2_alt', 'Event production and live audience atmosphere'
    ), 0, true);

  -- S02: Featured (3 cards)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Featured Services', 'services-featured',
    jsonb_build_object(
      'eyebrow', 'FEATURED SERVICES',
      'heading', 'EXPERIENCES' || chr(10) || 'CRAFTED WITH' || chr(10) || 'INTENTION.',
      'services', jsonb_build_array(
        jsonb_build_object('id', 'fs1', 'title', 'EVENT PLANNING', 'description', 'Full-service event planning tailored to your vision and goals.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237168928-llt7gkihpq.JPG'),
        jsonb_build_object('id', 'fs2', 'title', 'CONCERTS & LIVE SHOWS', 'description', 'End-to-end production for unforgettable live experiences.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237172993-j8adyfkfn3k.JPG'),
        jsonb_build_object('id', 'fs3', 'title', 'WEDDINGS & CELEBRATIONS', 'description', 'Beautifully curated weddings and private celebrations.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237160878-xn7u6tvntc.JPG')
      )
    ), 1, true);

  -- S03: Stats
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Why Choose Us', 'stats',
    jsonb_build_object(
      'heading', 'WHY CHOOSE US',
      'stats', jsonb_build_array(
        jsonb_build_object('id', 'st1', 'number', '200+', 'label', 'EVENTS PRODUCED'),
        jsonb_build_object('id', 'st2', 'number', '8', 'label', 'YEARS OF EXPERIENCE'),
        jsonb_build_object('id', 'st3', 'number', '5K+', 'label', 'GUESTS SERVED'),
        jsonb_build_object('id', 'st4', 'number', '100%', 'label', 'CLIENT SATISFACTION')
      ),
      'variant', 'default'
    ), 2, true);

  -- S04: Directory (two-column list)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Full Service Directory', 'services-directory',
    jsonb_build_object(
      'eyebrow', 'OUR FULL SERVICES',
      'heading', 'MORE EXPERIENCES.' || chr(10) || 'MORE POSSIBILITIES.',
      'description', 'From large-scale productions to intimate gatherings, our full range of services covers every aspect of event creation and management.',
      'left_items', jsonb_build_array(
        jsonb_build_object('id', 'd1', 'number', '04', 'title', 'CORPORATE EVENTS'),
        jsonb_build_object('id', 'd2', 'number', '05', 'title', 'PRIVATE EVENTS & PARTIES'),
        jsonb_build_object('id', 'd3', 'number', '06', 'title', 'FESTIVALS & PUBLIC EVENTS'),
        jsonb_build_object('id', 'd4', 'number', '07', 'title', 'DECORATION & BRANDING'),
        jsonb_build_object('id', 'd5', 'number', '08', 'title', 'SOUND, LIGHTING & STAGE PRODUCTION'),
        jsonb_build_object('id', 'd6', 'number', '09', 'title', 'DJ & MC COORDINATION')
      ),
      'right_items', jsonb_build_array(
        jsonb_build_object('id', 'd7', 'number', '10', 'title', 'PHOTOGRAPHY & VIDEOGRAPHY'),
        jsonb_build_object('id', 'd8', 'number', '11', 'title', 'EVENT PROMOTION & SOCIAL MEDIA'),
        jsonb_build_object('id', 'd9', 'number', '12', 'title', 'BIRTHDAYS & GRADUATIONS')
      )
    ), 3, true);

  -- S05: Philosophy (The Fiesta Standard)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'The Fiesta Standard', 'services-philosophy',
    jsonb_build_object(
      'eyebrow', 'THE FIESTA STANDARD',
      'heading', 'EVERY EVENT' || chr(10) || 'DESERVES ITS' || chr(10) || 'OWN STORY.',
      'body', 'We don''t believe in copying the same event twice. A wedding should feel like the people getting married. A concert should feel like the artist performing. A corporate gathering should feel like the brand behind it.' || chr(10) || chr(10) || 'Our role is to understand the idea first, then build everything around it — creative direction, planning, production, coordination, and flawless execution. Every event deserves its own story, and we are here to tell it.'
    ), 4, true);

  -- S06: Process
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Our Process', 'services-process',
    jsonb_build_object(
      'eyebrow', 'HOW WE BRING IT TO LIFE',
      'heading', 'FROM IDEA TO' || chr(10) || 'UNFORGETTABLE.',
      'steps', jsonb_build_array(
        jsonb_build_object('id', 'sp1', 'number', '01', 'title', 'IDEA', 'description', 'We listen to your vision and understand the heart of what you want.'),
        jsonb_build_object('id', 'sp2', 'number', '02', 'title', 'CREATIVE', 'description', 'We develop a creative direction that brings your idea to life.'),
        jsonb_build_object('id', 'sp3', 'number', '03', 'title', 'PLANNING', 'description', 'Every detail is mapped out with precision and care.'),
        jsonb_build_object('id', 'sp4', 'number', '04', 'title', 'PRODUCTION', 'description', 'We execute with expertise, coordination, and flawless timing.'),
        jsonb_build_object('id', 'sp5', 'number', '05', 'title', 'DELIVERY', 'description', 'The final experience exceeds expectations and creates lasting memories.')
      )
    ), 5, true);

  -- S07: Testimonials
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Client Testimonials', 'testimonials',
    jsonb_build_object(
      'heading', 'WHAT THEY SAY',
      'description', '',
      'testimonials', jsonb_build_array(
        jsonb_build_object('id', 't1', 'quote', 'Fiesta turned our wedding into something we could never have imagined. Every guest said it was the most beautiful event they had ever attended.', 'client_name', 'SARAH & MICHEL', 'event_type', 'Wedding, Kigali', 'location', '', 'image_url', ''),
        jsonb_build_object('id', 't2', 'quote', 'Professional, creative, and genuinely passionate. They don''t just plan events — they create experiences that stay with you.', 'client_name', 'DAVID NZAMUHO', 'event_type', 'Corporate Summit', 'location', '', 'image_url', ''),
        jsonb_build_object('id', 't3', 'quote', 'The energy they brought to our concert was unreal. From stage design to sound production — absolute perfection.', 'client_name', 'JEAN-PASCAL', 'event_type', 'Live Show Production', 'location', '', 'image_url', '')
      ),
      'variant', 'default'
    ), 6, true);

  -- S08: CTA
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Services CTA', 'services-cta',
    jsonb_build_object(
      'eyebrow', 'LET''S CREATE SOMETHING EXTRAORDINARY',
      'heading', 'Your Vision. Our Expertise.',
      'description', 'Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.',
      'button_text', 'BOOK YOUR EVENT',
      'button_url', '/contact',
      'background_image', ''
    ), 7, true);

  -- Update SEO
  UPDATE pages SET
    seo_title = 'Services | Fiesta Agency Rwanda',
    seo_description = 'Explore our comprehensive event services — planning, production, entertainment and more.',
    updated_at = now()
  WHERE id = svc_id;

END $$;

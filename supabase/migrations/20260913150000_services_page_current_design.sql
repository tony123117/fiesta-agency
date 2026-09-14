-- Services page CMS: seed sections matching the CURRENT design (commit 3ae04ee)
-- Sections: services-hero, services-featured, services-cards, stats, services-process, testimonials, services-cta

DO $$
DECLARE
  svc_id UUID;
BEGIN
  SELECT id INTO svc_id FROM pages WHERE slug = 'services';
  IF svc_id IS NULL THEN
    INSERT INTO pages (slug, title, description, published, seo_title, seo_description)
    VALUES ('services', 'Services', 'Our comprehensive event services', true,
            'Services | Fiesta Agency Rwanda',
            'Explore our comprehensive event services - planning, production, entertainment and more.')
    RETURNING id INTO svc_id;
  END IF;

  DELETE FROM sections WHERE page_id = svc_id;

  -- S01: Hero (single image, heading, description)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Services Hero', 'services-hero',
    jsonb_build_object(
      'eyebrow', 'OUR SERVICES',
      'heading', 'EXCEPTIONAL SERVICES FOR UNFORGETTABLE' || chr(10) || 'EVENTS.',
      'description', 'From concept to execution, we offer end-to-end event solutions tailored to your vision. Whatever the occasion, we make it extraordinary.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181004-3xhl7jh5r8c.JPG',
      'image_alt', 'Luxury event setup with elegant decor and warm lighting'
    ), 0, true);

  -- S02: Featured (split layout with image + description)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Featured Services', 'services-featured',
    jsonb_build_object(
      'eyebrow', 'WHAT WE OFFER',
      'heading', 'Experiences Crafted With' || chr(10) || 'Intentions.',
      'description', 'Every event is unique. We listen, design, and deliver experiences that reflect your vision and exceed expectations.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237168928-llt7gkihpq.JPG',
      'label', 'EVENT PLANNING',
      'label_text', 'Full-service event planning tailored to your vision and goals.',
      'link_text', 'Explore Our Services'
    ), 1, true);

  -- S03: Service Cards (8-card grid)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Service Cards', 'services-cards',
    jsonb_build_object(
      'cards', jsonb_build_array(
        jsonb_build_object('id', 'sc1', 'title', 'Event Planning', 'description', 'Full-service planning from concept to execution.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237168928-llt7gkihpq.JPG'),
        jsonb_build_object('id', 'sc2', 'title', 'Event Design & Styling', 'description', 'Creative direction and aesthetic curation for your event.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237181965-r5gizmmxm5.JPG'),
        jsonb_build_object('id', 'sc3', 'title', 'Weddings & Celebrations', 'description', 'Beautifully curated weddings and milestone celebrations.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237160878-xn7u6tvntc.JPG'),
        jsonb_build_object('id', 'sc4', 'title', 'Corporate Events', 'description', 'Professional conferences, summits, and corporate gatherings.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237172993-j8adyfkfn3k.JPG'),
        jsonb_build_object('id', 'sc5', 'title', 'Production & Lighting', 'description', 'Stage design, sound, lighting, and full production.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237175498-0azrcjz56r.JPG'),
        jsonb_build_object('id', 'sc6', 'title', 'Catering & Hospitality', 'description', 'Premium catering and guest experience management.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237177903-rv9ydryyuu.JPG'),
        jsonb_build_object('id', 'sc7', 'title', 'Photography & Videography', 'description', 'Professional coverage to capture every moment.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237180388-7nxt47r9bp.JPG'),
        jsonb_build_object('id', 'sc8', 'title', 'Private Events', 'description', 'Exclusive birthday parties, anniversaries, and private gatherings.', 'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237182960-v5s9j8x7kp.JPG')
      )
    ), 2, true);

  -- S04: Stats (4 counters)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Stats', 'stats',
    jsonb_build_object(
      'eyebrow', 'WHY CHOOSE US',
      'heading', 'More Than Just' || chr(10) || 'An Event.',
      'stats', jsonb_build_array(
        jsonb_build_object('number', '200+', 'label', 'Events Executed'),
        jsonb_build_object('number', '98%', 'label', 'Client Satisfaction'),
        jsonb_build_object('number', '5K+', 'label', 'Happy Guests'),
        jsonb_build_object('number', '100%', 'label', 'Commitment')
      ),
      'link_text', 'Learn More',
      'variant', 'default'
    ), 3, true);

  -- S05: Process (5 steps)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Our Process', 'services-process',
    jsonb_build_object(
      'eyebrow', 'HOW WE BRING IT TO LIFE',
      'heading', 'FROM IDEA TO' || chr(10) || 'UNFORGETTABLE.',
      'steps', jsonb_build_array(
        jsonb_build_object('number', '01', 'title', 'DISCOVER', 'description', 'We listen to your vision and understand the heart of what you want.'),
        jsonb_build_object('number', '02', 'title', 'DESIGN', 'description', 'We develop a creative direction that brings your idea to life.'),
        jsonb_build_object('number', '03', 'title', 'PLAN', 'description', 'Every detail is mapped out with precision and care.'),
        jsonb_build_object('number', '04', 'title', 'PRODUCE', 'description', 'We execute with expertise, coordination, and flawless timing.'),
        jsonb_build_object('number', '05', 'title', 'DELIVER', 'description', 'The final experience exceeds expectations and creates lasting memories.')
      )
    ), 4, true);

  -- S06: Testimonials (3 cards)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Client Testimonials', 'testimonials',
    jsonb_build_object(
      'eyebrow', 'WHAT THEY SAY',
      'heading', 'WORDS FROM' || chr(10) || 'OUR CLIENTS.',
      'testimonials', jsonb_build_array(
        jsonb_build_object('quote', 'Fiesta turned our wedding into something we could never have imagined. Every guest said it was the most beautiful event they had ever attended.', 'author', 'SARAH & MICHEL', 'role', 'Wedding, Kigali'),
        jsonb_build_object('quote', 'Professional, creative, and genuinely passionate. They don''t just plan events - they create experiences that stay with you.', 'author', 'DAVID NZAMUHO', 'role', 'Corporate Summit'),
        jsonb_build_object('quote', 'The energy they brought to our concert was unreal. From stage design to sound production - absolute perfection.', 'author', 'JEAN-PASCAL', 'role', 'Live Show Production')
      ),
      'variant', 'default'
    ), 5, true);

  -- S07: CTA
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (svc_id, 'Services CTA', 'services-cta',
    jsonb_build_object(
      'eyebrow', 'LET''S CREATE SOMETHING EXTRAORDINARY',
      'heading', 'Your Vision. Our Expertise.',
      'description', 'Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.',
      'button_text', 'Book Your Event',
      'button_url', '/contact',
      'background_image', ''
    ), 6, true);

  -- Update SEO
  UPDATE pages SET
    seo_title = 'Services | Fiesta Agency Rwanda',
    seo_description = 'Explore our comprehensive event services - planning, production, entertainment and more.',
    updated_at = now()
  WHERE id = svc_id;

END $$;

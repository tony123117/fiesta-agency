-- Events page CMS: seed hero and CTA sections
-- Sections: events-hero, events-cta

DO $$
DECLARE
  evt_id UUID;
BEGIN
  SELECT id INTO evt_id FROM pages WHERE slug = 'events';
  IF evt_id IS NULL THEN
    INSERT INTO pages (slug, title, description, published, seo_title, seo_description)
    VALUES ('events', 'Events', 'Discover upcoming events and see our past productions', true,
            'Events | Fiesta Agency Rwanda',
            'Discover upcoming events and see our past productions across Rwanda.')
    RETURNING id INTO evt_id;
  END IF;

  DELETE FROM sections WHERE page_id = evt_id;

  -- Hero section
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (evt_id, 'Events Hero', 'events-hero',
    jsonb_build_object(
      'eyebrow', 'OUR EVENTS',
      'heading', 'EXTRAORDINARY MOMENTS.' || chr(10) || 'ALWAYS.',
      'description', 'From intimate gatherings to large-scale productions, we design and manage events that leave lasting impressions. Every detail matters.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237158612-mn2meeybu9o.JPG',
      'image_alt', 'Elegant candlelit event reception with floral arrangements'
    ), 0, true);

  -- CTA section
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (evt_id, 'Events CTA', 'events-cta',
    jsonb_build_object(
      'eyebrow', 'LET''S CREATE TOGETHER',
      'heading', 'YOUR EVENT DESERVES' || chr(10) || 'ITS OWN STORY.',
      'description', 'Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.',
      'button_text', 'Book Your Event',
      'button_url', '/contact'
    ), 1, true);

  -- Update SEO
  UPDATE pages SET
    seo_title = 'Events | Fiesta Agency Rwanda',
    seo_description = 'Discover upcoming events and see our past productions across Rwanda.',
    updated_at = now()
  WHERE id = evt_id;

END $$;

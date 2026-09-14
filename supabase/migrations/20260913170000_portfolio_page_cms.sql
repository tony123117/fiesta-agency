-- Portfolio page CMS: seed hero section

DO $$
DECLARE
  p_id UUID;
BEGIN
  SELECT id INTO p_id FROM pages WHERE slug = 'portfolio';
  IF p_id IS NULL THEN
    INSERT INTO pages (slug, title, description, published, seo_title, seo_description)
    VALUES ('portfolio', 'Portfolio', 'Explore our portfolio of events', true,
            'Portfolio | Fiesta Agency Rwanda',
            'Explore our portfolio of events, productions and experiences across Rwanda.')
    RETURNING id INTO p_id;
  END IF;

  DELETE FROM sections WHERE page_id = p_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (p_id, 'Portfolio Hero', 'portfolio-hero',
    jsonb_build_object(
      'eyebrow', 'OUR PORTFOLIO',
      'heading', 'MEMORABLE.' || chr(10) || 'LASTING' || chr(10) || 'IMPRESSIONS.',
      'description', 'A curated collection of our most memorable moments, from intimate celebrations to large-scale productions.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237075747-fnh3bgdpf4l.JPG',
      'image_alt', 'Elegant candlelit event venue with warm atmospheric lighting'
    ), 0, true);

  UPDATE pages SET
    seo_title = 'Portfolio | Fiesta Agency Rwanda',
    seo_description = 'Explore our portfolio of events, productions and experiences across Rwanda.',
    updated_at = now()
  WHERE id = p_id;
END $$;

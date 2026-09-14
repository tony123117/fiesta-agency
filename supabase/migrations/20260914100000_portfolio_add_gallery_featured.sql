-- Portfolio page CMS: add filtered gallery and featured sections

DO $$
DECLARE
  p_id UUID;
  max_sort INT;
BEGIN
  SELECT id INTO p_id FROM pages WHERE slug = 'portfolio';
  IF p_id IS NULL THEN
    RAISE EXCEPTION 'Portfolio page not found';
  END IF;

  -- Get current max sort_order
  SELECT COALESCE(MAX(sort_order), -1) INTO max_sort FROM sections WHERE page_id = p_id;

  -- Add filtered gallery section (after hero)
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (p_id, 'Portfolio Gallery', 'portfolio-filtered-gallery',
    jsonb_build_object(
      'eyebrow', 'OUR WORK',
      'categories', jsonb_build_array('ALL', 'CORPORATE', 'PRIVATE', 'WEDDINGS', 'CONCERTS', 'FESTIVALS'),
      'max_projects', 9,
      'variant', 'grid'
    ), max_sort + 1, true);

  -- Add featured project section
  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (p_id, 'Featured Project', 'portfolio-featured',
    jsonb_build_object(
      'eyebrow', 'FEATURED PROJECT',
      'button_text', 'View Project'
    ), max_sort + 2, true);

  -- Update page SEO
  UPDATE pages SET
    seo_title = 'Portfolio | Fiesta Agency Rwanda',
    seo_description = 'Explore our portfolio of events, productions and experiences across Rwanda.',
    updated_at = now()
  WHERE id = p_id;
END $$;

-- How We Work page CMS: seed all sections

DO $$
DECLARE
  hw_id UUID;
BEGIN
  SELECT id INTO hw_id FROM pages WHERE slug = 'how-we-work';
  IF hw_id IS NULL THEN
    INSERT INTO pages (slug, title, description, published, seo_title, seo_description)
    VALUES ('how-we-work', 'How We Work', 'Discover our process', true,
            'How We Work | Fiesta Agency Rwanda',
            'Discover our five-phase process for planning and producing extraordinary events.')
    RETURNING id INTO hw_id;
  END IF;

  DELETE FROM sections WHERE page_id = hw_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (hw_id, 'HWW Hero', 'hww-hero',
    jsonb_build_object(
      'eyebrow', 'HOW WE WORK',
      'heading', 'A SEAMLESS PROCESS.' || chr(10) || 'EXCEPTIONAL RESULTS.',
      'description', 'From concept to execution, we handle every detail with precision, creativity and care - so you can focus on what matters most.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237063512-hk7ssv7z6e5.JPG',
      'image_alt', 'Event production team coordinating behind the scenes'
    ), 0, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (hw_id, 'HWW Intro', 'hww-intro',
    jsonb_build_object(
      'eyebrow', 'THE FIESTA APPROACH',
      'heading', 'FROM FIRST IDEA' || chr(10) || 'TO FINAL MOMENT.',
      'description', 'Every great event starts with a conversation. We listen, understand your vision, and bring it to life with a detailed plan, trusted partners and flawless execution.',
      'image', 'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237065570-p1isqdooo8m.JPG',
      'image_alt', 'Event planning meeting with creative team',
      'link_text', 'View Our Services',
      'link_url', '/services'
    ), 1, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (hw_id, 'HWW Process', 'hww-process',
    jsonb_build_object(
      'steps', jsonb_build_array(
        jsonb_build_object('num', '01', 'title', 'CONSULTATION', 'description', 'We understand your vision, requirements and expectations.'),
        jsonb_build_object('num', '02', 'title', 'PLANNING', 'description', 'We develop the concept, logistics and detailed event plan.'),
        jsonb_build_object('num', '03', 'title', 'PREPARATION', 'description', 'We coordinate suppliers, production and every necessary detail.'),
        jsonb_build_object('num', '04', 'title', 'EXECUTION', 'description', 'The vision becomes reality through precise coordination and execution.'),
        jsonb_build_object('num', '05', 'title', 'FOLLOW-UP', 'description', 'We review the experience and ensure every detail is properly concluded.')
      )
    ), 2, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (hw_id, 'Behind The Scenes', 'hww-behind',
    jsonb_build_object(
      'eyebrow', 'BEHIND THE SCENES',
      'heading', 'BEHIND' || chr(10) || 'THE MOMENT.',
      'description', 'It''s not just about what you see. Behind every beautiful event is a dedicated team working with precision, creativity and passion.',
      'images', jsonb_build_array(
        'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237081941-v72s63162fo.JPG',
        'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237154468-13mzpawezpsg.JPG',
        'https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237156010-u84709r1dkq.JPG'
      )
    ), 3, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (hw_id, 'Why Fiesta', 'hww-why',
    jsonb_build_object(
      'eyebrow', 'WHY FIESTA',
      'heading', 'THE PRINCIPLES' || chr(10) || 'BEHIND OUR WORK.',
      'principles', jsonb_build_array(
        jsonb_build_object('num', '01', 'title', 'CREATIVITY', 'text', 'Fresh ideas, distinctive concepts and thoughtful details.'),
        jsonb_build_object('num', '02', 'title', 'PRECISION', 'text', 'Careful planning and attention to every important detail.'),
        jsonb_build_object('num', '03', 'title', 'COLLABORATION', 'text', 'Working closely with clients and partners to bring the vision together.'),
        jsonb_build_object('num', '04', 'title', 'EXCELLENCE', 'text', 'A commitment to delivering memorable experiences.')
      )
    ), 4, true);

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published)
  VALUES (hw_id, 'HWW CTA', 'hww-cta',
    jsonb_build_object(
      'eyebrow', 'READY TO START?',
      'heading', 'PLANNING AN EVENT?' || chr(10) || 'LET''S MAKE IT HAPPEN.',
      'description', 'Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.',
      'button_text', 'Get In Touch',
      'button_url', '/contact'
    ), 5, true);

  UPDATE pages SET
    seo_title = 'How We Work | Fiesta Agency Rwanda',
    seo_description = 'Discover our five-phase process for planning and producing extraordinary events.',
    updated_at = now()
  WHERE id = hw_id;
END $$;

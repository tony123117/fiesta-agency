-- Phase 30.7: Fix Home page empty sections + seed Contact page + update HWW/Portfolio CMS content

DO $$
DECLARE
  home_id UUID := 'bd69ce45-ca3f-46ce-8fee-39c33730d5df';
  how_we_work_id UUID := 'd19864e2-464f-4d4b-b845-2d1315049dfd';
  portfolio_id UUID;
  contact_id UUID;
  existing_count INTEGER;
BEGIN

  -- HOME PAGE: Fix empty portfolio-gallery section
  UPDATE sections SET content = '{"heading": "A collection of moments.", "description": "A collection of moments, spaces and experiences designed by Fiesta.", "variant": "grid", "items": [{"id":"f1","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237168928-llt7gkihpq.JPG","title":"The Modern Black-Tie Affair","category":"Private"},{"id":"f2","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237170984-1k51s9ajkxp.JPG","title":"A Night of New Beginnings","category":"Concert"},{"id":"f3","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237072595-bmu1u9nj21h.JPG","title":"An Intimate Celebration","category":"Private"},{"id":"f4","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237090595-kp1lke5gae.JPG","title":"The Lagoon Garden Celebration","category":"Wedding"},{"id":"f5","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237166605-f027qes5wyn.JPG","title":"Kigali Rooftop Gala","category":"Corporate"}]}'::jsonb
  WHERE page_id = home_id AND section_type = 'portfolio-gallery';

  -- HOME PAGE: Fix empty testimonials section
  UPDATE sections SET content = '{"heading": "What Our Clients Say", "description": "", "variant": "default", "testimonials": [{"id":"t1","quote":"Fiesta did not plan our wedding. They composed it. Every moment felt intentional, and the night moved like it had been written for us.","client_name":"Amara O.","event_type":"Wedding","location":"Lagos","image_url":""},{"id":"t2","quote":"We came in with an idea and left with an experience. The team understood what we wanted before we could fully say it.","client_name":"David & Sarah K.","event_type":"Wedding","location":"London","image_url":""},{"id":"t3","quote":"Our product launch felt like a film premiere. The room reacted exactly when we wanted them to. That is not luck - that is craft.","client_name":"Mr. Adekunle","event_type":"Corporate","location":"Lagos","image_url":""},{"id":"t4","quote":"They turned a birthday dinner into something I will remember for the rest of my life. Thirty people, and every single one felt seen.","client_name":"Helena R.","event_type":"Private","location":"Dubai","image_url":""}]}'::jsonb
  WHERE page_id = home_id AND section_type = 'testimonials';

  -- CONTACT PAGE: Create page and sections
  SELECT count(*) INTO existing_count FROM pages WHERE slug = 'contact';
  IF existing_count = 0 THEN
    INSERT INTO pages (id, slug, title, seo_title, seo_description, published)
    VALUES (gen_random_uuid(), 'contact', 'Contact', 'Contact | Fiesta Agency Rwanda', 'Get in touch with Fiesta to plan your next event.', true);
  END IF;

  SELECT id INTO contact_id FROM pages WHERE slug = 'contact';

  SELECT count(*) INTO existing_count FROM sections WHERE page_id = contact_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (contact_id, 'Contact Hero', 'contact-hero', '{"eyebrow": "GET IN TOUCH", "heading": "LET S MAKE YOUR NEXT EVENT EXTRAORDINARY.", "description": "Whether you have a clear vision or just the beginning of an idea, we are here to help bring it to life. Let us start a conversation.", "image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237176199-daxcqt30odk.JPG", "image_alt": "Elegant event setup with warm lighting"}'::jsonb, 0, true),
    (contact_id, 'Contact Info', 'contact-info', '{"eyebrow": "CONTACT INFO", "heading": "WE D LOVE TO HEAR FROM YOU.", "event_types": ["Wedding","Corporate Event","Private Party","Gala Dinner","Conference","Other"]}'::jsonb, 1, true),
    (contact_id, 'Contact Location', 'contact-location', '{"eyebrow": "VISIT US", "heading": "OUR OFFICE.", "description": "We welcome visits by appointment. Reach out to schedule a meeting at our office to discuss your event in person.", "image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237066673-tq84n1r42u.JPG", "image_alt": "Map showing Fiesta Agency office location in Kigali"}'::jsonb, 2, true),
    (contact_id, 'Contact CTA', 'contact-cta', '{"heading": "READY TO START? WE ARE ALL EARS.", "background_image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237079696-ug1xt12cxga.JPG", "background_image_alt": "Beautiful outdoor celebration setup with ambient lighting"}'::jsonb, 3, true);
  END IF;

  -- HOW WE WORK: Update CMS content
  UPDATE sections SET content = '{"eyebrow": "HOW WE WORK", "heading": "A SEAMLESS PROCESS. EXCEPTIONAL RESULTS.", "description": "From concept to execution, we handle every detail with precision, creativity and care - so you can focus on what matters most.", "image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237063512-hk7ssv7z6e5.JPG", "image_alt": "Event production team coordinating behind the scenes"}'::jsonb
  WHERE page_id = how_we_work_id AND section_type = 'hww-hero';

  UPDATE sections SET content = '{"eyebrow": "THE FIESTA APPROACH", "heading": "FROM FIRST IDEA TO FINAL MOMENT.", "description": "Every great event starts with a conversation. We listen, understand your vision, and bring it to life with a detailed plan, trusted partners and flawless execution. From concept development to on-site management, we ensure every detail is handled with precision.", "image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237065570-p1isqdooo8m.JPG", "image_alt": "Event planning meeting with creative team", "link_text": "View Our Services", "link_url": "/services"}'::jsonb
  WHERE page_id = how_we_work_id AND section_type = 'hww-intro';

  UPDATE sections SET content = '{"steps": [{"num":"01","title":"CONSULTATION","description":"We understand your vision, requirements and expectations."},{"num":"02","title":"PLANNING","description":"We develop the concept, logistics and detailed event plan."},{"num":"03","title":"PREPARATION","description":"We coordinate suppliers, production and every necessary detail."},{"num":"04","title":"EXECUTION","description":"The vision becomes reality through precise coordination and execution."},{"num":"05","title":"FOLLOW-UP","description":"We review the experience and ensure every detail is properly concluded."}]}'::jsonb
  WHERE page_id = how_we_work_id AND section_type = 'hww-process';

  UPDATE sections SET content = '{"eyebrow": "BEHIND THE SCENES", "heading": "BEHIND THE MOMENT.", "description": "It is not just about what you see. Behind every beautiful event is a dedicated team working with precision, creativity and passion.", "images": [{"url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237081941-v72s63162fo.JPG","alt":"Event setup and stage production preparation"},{"url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237154468-13mzpawezpsg.JPG","alt":"Table styling and floral arrangements"},{"url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237156010-u84709r1dkq.JPG","alt":"Lighting and sound production setup"}]}'::jsonb
  WHERE page_id = how_we_work_id AND section_type = 'hww-behind';

  UPDATE sections SET content = '{"eyebrow": "WHY FIESTA", "heading": "THE PRINCIPLES BEHIND OUR WORK.", "principles": [{"num":"01","title":"CREATIVITY","text":"Fresh ideas, distinctive concepts and thoughtful details."},{"num":"02","title":"PRECISION","text":"Careful planning and attention to every important detail."},{"num":"03","title":"COLLABORATION","text":"Working closely with clients and partners to bring the vision together."},{"num":"04","title":"EXCELLENCE","text":"A commitment to delivering memorable experiences."}]}'::jsonb
  WHERE page_id = how_we_work_id AND section_type = 'hww-why';

  UPDATE sections SET content = '{"eyebrow": "READY TO START?", "heading": "PLANNING AN EVENT? LET US MAKE IT HAPPEN.", "description": "Let us help you design and execute an event that reflects your vision and creates lasting memories for every guest.", "button_text": "Get In Touch", "button_url": "/contact"}'::jsonb
  WHERE page_id = how_we_work_id AND section_type = 'hww-cta';

  -- PORTFOLIO: Update CMS content
  SELECT id INTO portfolio_id FROM pages WHERE slug = 'portfolio';

  IF portfolio_id IS NOT NULL THEN
    UPDATE sections SET content = '{"eyebrow": "OUR PORTFOLIO", "heading": "MEMORABLE. LASTING IMPRESSIONS.", "description": "A curated collection of our most memorable moments, from intimate celebrations to large-scale productions.", "image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/1789237075747-fnh3bgdpf4l.JPG", "image_alt": "Elegant candlelit event venue with warm atmospheric lighting"}'::jsonb
    WHERE page_id = portfolio_id AND section_type = 'portfolio-hero';

    UPDATE sections SET content = '{"eyebrow": "OUR WORK", "heading": "", "description": "", "categories": ["ALL","CORPORATE","PRIVATE","WEDDINGS","CONCERTS","FESTIVALS"], "max_projects": 9, "variant": "grid"}'::jsonb
    WHERE page_id = portfolio_id AND section_type = 'portfolio-filtered-gallery';

    UPDATE sections SET content = '{"eyebrow": "FEATURED PROJECT", "heading": "", "description": "", "button_text": "View Project", "button_url": ""}'::jsonb
    WHERE page_id = portfolio_id AND section_type = 'portfolio-featured';
  END IF;

END $$;

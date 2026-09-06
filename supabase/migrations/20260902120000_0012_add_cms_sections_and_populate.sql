-- Phase 13.11.3: Add new CMS sections and populate content
-- Adds: cinematic-image, editorial-list, team-members, image-carousel sections
-- Populates: process steps, missing text-image sections, editorial lists
-- Idempotent: checks for existing sections before inserting

DO $$
DECLARE
  home_id UUID := 'bd69ce45-ca3f-46ce-8fee-39c33730d5df';
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
  services_id UUID := '198822b7-d1e8-413d-a617-1fdf4216c88f';
  how_we_work_id UUID := 'd19864e2-464f-4d4b-b845-2d1315049dfd';
  existing_count INTEGER;
BEGIN

  -- ═══════════════════════════════════════════
  -- ABOUT PAGE: Add new sections
  -- ═══════════════════════════════════════════

  -- Cinematic Image Break (sort_order 2)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = about_id AND section_type = 'cinematic-image';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (about_id, 'Cinematic Break', 'cinematic-image',
     '{"image":"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80","mobile_image":null,"image_alt":"Grand celebration venue with chandeliers, draped fabric and elegantly dressed guests","focal_x":0.5,"focal_y":0.5,"caption":"MOMENTS, CAREFULLY CONSIDERED.","caption_alignment":"left"}'::jsonb,
     2, true);
  END IF;

  -- Editorial List: What We Believe (sort_order 4)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = about_id AND section_type = 'editorial-list';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (about_id, 'What We Believe', 'editorial-list',
     '{"heading":"THE DETAILS ARE THE EXPERIENCE.","description":null,"items":[{"id":"el1","number":"01","title":"CREATIVITY","description":"Every event starts with an idea worth bringing to life."},{"id":"el2","number":"02","title":"PRECISION","description":"Great experiences depend on details being handled before they become problems."},{"id":"el3","number":"03","title":"PEOPLE","description":"The right people turn planning into an experience."},{"id":"el4","number":"04","title":"ENERGY","description":"Every event has its own rhythm, atmosphere and identity."},{"id":"el5","number":"05","title":"EXCELLENCE","description":"We aim for experiences that feel considered from beginning to end."}]}'::jsonb,
     4, true);
  END IF;

  -- Team Members (sort_order 7)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = about_id AND section_type = 'team-members';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (about_id, 'Team', 'team-members',
     '{"heading":"A TEAM BUILT AROUND THE EXPERIENCE.","members":[{"id":"tm1","name":"Claire Uwimana","role":"CREATIVE DIRECTOR","image":"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80","bio":"Leading creative vision and artistic direction for every Fiesta experience."},{"id":"tm2","name":"Jean-Pierre Niyonzima","role":"EVENT PLANNER","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80","bio":"Orchestrating logistics, timelines, and vendor coordination with precision."},{"id":"tm3","name":"Samuel Bizimana","role":"PRODUCTION / TECHNICAL COORDINATOR","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80","bio":"Managing staging, lighting, sound, and all technical production elements."},{"id":"tm4","name":"Grace Mugabekazi","role":"MARKETING & SOCIAL MEDIA","image":"https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80","bio":"Crafting the story of every event across digital channels and press."},{"id":"tm5","name":"David Habimana","role":"CLIENT / BOOKING COORDINATOR","image":"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80","bio":"Your first point of contact — from inquiry through to the final handshake."}]}'::jsonb,
     7, true);
  END IF;

  -- Populate About Process steps
  UPDATE sections SET content = jsonb_set(content, '{steps}',
    '[{"id":"ap1","number":"01","title":"IDEA","description":"We start with your vision and understand the occasion, the audience, the atmosphere, the goals and the expectations.","image":""},{"id":"ap2","number":"02","title":"PLANNING","description":"Logistics, vendors, timelines, production schedules, technical requirements and coordination.","image":""},{"id":"ap3","number":"03","title":"PRODUCTION","description":"Staging, lighting, sound, decor, entertainment, guest experience and on-site execution.","image":""},{"id":"ap4","number":"04","title":"EXPERIENCE","description":"Fiesta handles the complexity behind the scenes so you can be fully present.","image":""}]'::jsonb
  ) WHERE page_id = about_id AND section_type = 'process' AND title = 'Approach';

  -- ═══════════════════════════════════════════
  -- SERVICES PAGE: Add missing text-image sections and new types
  -- ═══════════════════════════════════════════

  -- Introduction text-image (sort_order 1)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND title = 'Introduction';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Introduction', 'text-image',
     '{"eyebrow":"THE FIESTA APPROACH","heading":"Every event begins with an idea.","body":"Fiesta transforms ideas into experiences through creative direction, thoughtful planning and precise execution. Every event we produce is built from the ground up — designed to feel effortless to our clients and unforgettable to their guests.\n\nWe are not a booking service. We are a creative production agency that manages the full lifecycle — from the first conversation to the final guest departure.","image":"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80","image_alt":"Creative team collaborating on event design and planning","image_position":"right","cta_text":"","cta_url":"","variant":"default"}'::jsonb,
     1, true);
  END IF;

  -- Weddings text-image (sort_order 3)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND title = 'Weddings';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Weddings', 'text-image',
     '{"eyebrow":"WEDDINGS & CEREMONIES","heading":"Every detail, beautifully considered.","body":"Your wedding should feel like a reflection of you — not a template. Fiesta brings creative direction, design coordination and full production together so every moment, from the first look to the final dance, feels considered and unforgettable.","image":"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80","image_alt":"Luxury wedding reception with floral arches, candlelight and elegant décor","image_position":"left","cta_text":"DISCOVER WEDDINGS","cta_url":"/services#weddings-ceremonies","variant":"default"}'::jsonb,
     3, true);
  END IF;

  -- Corporate text-image (sort_order 4)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND title = 'Corporate';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Corporate', 'text-image',
     '{"eyebrow":"CORPORATE EVENTS","heading":"Designed for impact.","body":"From conferences and product launches to award ceremonies and brand experiences, Fiesta delivers corporate events that command attention and leave lasting impressions.","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80","image_alt":"Sophisticated corporate gala with professional staging and dramatic lighting","image_position":"right","cta_text":"EXPLORE CORPORATE EVENTS","cta_url":"/services#corporate-events","variant":"default"}'::jsonb,
     4, true);
  END IF;

  -- Celebrations text-image (sort_order 5)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND title = 'Celebrations';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Celebrations', 'text-image',
     '{"eyebrow":"PRIVATE CELEBRATIONS","heading":"Made personal. Made unforgettable.","body":"Birthdays, anniversaries, private dinners, milestone celebrations — every personal occasion deserves the same level of care and creativity as the grandest production. The scale may change. The attention to detail does not.","image":"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80","image_alt":"Private dinner celebration with warm candlelight and elegant table setting","image_position":"left","cta_text":"","cta_url":"","variant":"default"}'::jsonb,
     5, true);
  END IF;

  -- Production text-image (sort_order 6)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND title = 'Production';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Production', 'text-image',
     '{"eyebrow":"EVENT PRODUCTION","heading":"From vision to execution.","body":"Fiesta brings together every technical discipline required to bring an event to life — managing the full production lifecycle so nothing is left to chance.","image":"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80","image_alt":"Professional event production with stage lighting, sound equipment and technical setup","image_position":"right","cta_text":"","cta_url":"","variant":"default"}'::jsonb,
     6, true);
  END IF;

  -- Image Carousel (sort_order 7)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND section_type = 'image-carousel';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Visual Moments', 'image-carousel',
     '{"heading":"THE WORK","description":"See what these services look like in motion.","images":[{"id":"ic1","src":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80","alt":"Elegant candlelit event reception"},{"id":"ic2","src":"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80","alt":"Outdoor celebration with string lights"},{"id":"ic3","src":"https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80","alt":"Grand ballroom event with chandeliers"},{"id":"ic4","src":"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80","alt":"Intimate dinner setting with warm ambiance"},{"id":"ic5","src":"https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&q=80","alt":"Outdoor wedding venue at sunset"},{"id":"ic6","src":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80","alt":"Concert stage with dramatic lighting"}]}'::jsonb,
     7, true);
  END IF;

  -- Editorial List: Why Fiesta (sort_order 8)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND section_type = 'editorial-list';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Why Fiesta', 'editorial-list',
     '{"heading":"One team. One vision. Every detail.","description":null,"items":[{"id":"wf1","number":"01","title":"Creative Direction","description":"We begin with a vision. Every event starts with a creative concept that guides every decision — from palette to pacing, from lighting to layout."},{"id":"wf2","number":"02","title":"Thoughtful Planning","description":"Great events are built on rigorous planning. We map every timeline, every vendor, every contingency — so the day itself feels effortless."},{"id":"wf3","number":"03","title":"Seamless Production","description":"From staging and sound to the final toast, our production team manages every technical element with the precision of a film crew."},{"id":"wf4","number":"04","title":"Personal Attention","description":"Every client is different. We listen first, then design an experience that reflects your story — not a template, not a trend."}]}'::jsonb,
     8, true);
  END IF;

  -- Final Statement text-image centered (sort_order 9)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id AND title = 'Statement';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Statement', 'text-image',
     '{"eyebrow":"","heading":"Whatever the occasion, we believe it deserves to feel extraordinary.","body":"","image":"","image_alt":"","image_position":"right","cta_text":"","cta_url":"","variant":"centered"}'::jsonb,
     9, true);
  END IF;

  -- Renumber existing Services sections
  UPDATE sections SET sort_order = 2 WHERE page_id = services_id AND title = 'Services';
  UPDATE sections SET sort_order = 10 WHERE page_id = services_id AND title = 'Process';
  UPDATE sections SET sort_order = 11 WHERE page_id = services_id AND title = 'Testimonials';
  UPDATE sections SET sort_order = 12 WHERE page_id = services_id AND title = 'Call to Action';

  -- Populate Services Process steps
  UPDATE sections SET content = jsonb_set(content, '{steps}',
    '[{"id":"sp1","number":"01","title":"DISCOVER","description":"We listen. We understand the occasion, the audience, the atmosphere, the goals and the expectations.","image":""},{"id":"sp2","number":"02","title":"DESIGN","description":"Creative direction, visual identity, styling, spatial design and experience architecture.","image":""},{"id":"sp3","number":"03","title":"PLAN","description":"Logistics, vendors, timelines, production schedules, technical requirements and coordination.","image":""},{"id":"sp4","number":"04","title":"PRODUCE","description":"Staging, lighting, sound, decor, entertainment, guest experience and on-site execution.","image":""},{"id":"sp5","number":"05","title":"DELIVER","description":"Fiesta handles the complexity behind the scenes so you can be fully present.","image":""}]'::jsonb
  ) WHERE page_id = services_id AND section_type = 'process';

  -- ═══════════════════════════════════════════
  -- HOW WE WORK PAGE: Add missing sections
  -- ═══════════════════════════════════════════

  -- Introduction text-image (sort_order 1)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = how_we_work_id AND title = 'Introduction';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (how_we_work_id, 'Introduction', 'text-image',
     '{"eyebrow":"THE FIESTA METHOD","heading":"Great events don''t happen by accident.","body":"Fiesta combines creative direction, strategic planning and meticulous production to create events that feel effortless — but are built through hundreds of intentional decisions.","image":"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80","image_alt":"Creative team collaborating on event design and strategic planning","image_position":"right","cta_text":"","cta_url":"","variant":"default"}'::jsonb,
     1, true);
  END IF;

  -- Cinematic Image: Visual Transition (sort_order 3)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = how_we_work_id AND section_type = 'cinematic-image';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (how_we_work_id, 'Visual Transition', 'cinematic-image',
     '{"image":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80","mobile_image":null,"image_alt":"Elegant candlelit event atmosphere with warm lighting","focal_x":0.5,"focal_y":0.5,"caption":"Every detail contributes to the atmosphere.","caption_alignment":"center"}'::jsonb,
     3, true);
  END IF;

  -- Editorial List: Differentiators (sort_order 4)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = how_we_work_id AND section_type = 'editorial-list';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (how_we_work_id, 'Differentiators', 'editorial-list',
     '{"heading":"WE DON''T JUST EXECUTE A BRIEF. WE BUILD THE EXPERIENCE.","description":null,"items":[{"id":"df1","number":"","title":"Creative Direction","description":null},{"id":"df2","number":"","title":"Strategic Planning","description":null},{"id":"df3","number":"","title":"Event Production","description":null},{"id":"df4","number":"","title":"Vendor Management","description":null},{"id":"df5","number":"","title":"Technical Production","description":null},{"id":"df6","number":"","title":"Guest Experience","description":null},{"id":"df7","number":"","title":"On-Site Management","description":null},{"id":"df8","number":"","title":"Post-Event Support","description":null}]}'::jsonb,
     4, true);
  END IF;

  -- Portfolio Gallery: Behind the Scenes (sort_order 5)
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = how_we_work_id AND title = 'Behind the Scenes';
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (how_we_work_id, 'Behind the Scenes', 'portfolio-gallery',
     '{"heading":"BEHIND THE MOMENT","description":"What guests remember as effortless is built through hundreds of intentional decisions.","items":[{"id":"bts1","image":"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80","title":"Team coordinating event setup","category":"Production"},{"id":"bts2","image":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80","title":"Professional lighting rig being prepared","category":"Technical"},{"id":"bts3","image":"https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80","title":"Elegant tablescape with floral arrangements","category":"Design"},{"id":"bts4","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80","title":"Stage production in progress","category":"Production"},{"id":"bts5","image":"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80","title":"Team in production meeting","category":"Planning"},{"id":"bts6","image":"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80","title":"Venue transformation complete","category":"Result"}],"variant":"asymmetric"}'::jsonb,
     5, true);
  END IF;

  -- Renumber existing How We Work sections
  UPDATE sections SET sort_order = 2 WHERE page_id = how_we_work_id AND section_type = 'process';
  UPDATE sections SET sort_order = 6 WHERE page_id = how_we_work_id AND section_type = 'testimonials';
  UPDATE sections SET sort_order = 7 WHERE page_id = how_we_work_id AND section_type = 'cta';

  -- Populate How We Work Process steps
  UPDATE sections SET content = jsonb_set(content, '{steps}',
    '[{"id":"hw1","number":"01","title":"DISCOVER","description":"We listen. We understand the occasion, the audience, the atmosphere, the goals and the expectations.","image":""},{"id":"hw2","number":"02","title":"DESIGN","description":"Creative direction, visual identity, styling, spatial design and experience architecture.","image":""},{"id":"hw3","number":"03","title":"PLAN","description":"Logistics, vendors, timelines, production schedules, technical requirements and coordination.","image":""},{"id":"hw4","number":"04","title":"PRODUCE","description":"Staging, lighting, sound, decor, entertainment, guest experience and on-site execution.","image":""},{"id":"hw5","number":"05","title":"DELIVER","description":"Fiesta handles the complexity behind the scenes so you can be fully present.","image":""}]'::jsonb
  ) WHERE page_id = how_we_work_id AND section_type = 'process';

END $$;

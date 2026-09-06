-- Phase 12.5: Seed CMS section records for existing hardcoded pages
-- Idempotent: checks if sections already exist before creating
-- Preserves existing pages and their published state

DO $$
DECLARE
  home_id UUID := 'bd69ce45-ca3f-46ce-8fee-39c33730d5df';
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
  services_id UUID := '198822b7-d1e8-413d-a617-1fdf4216c88f';
  how_we_work_id UUID := 'd19864e2-464f-4d4b-b845-2d1315049dfd';
  existing_count INTEGER;
BEGIN

  -- ═══════════════════════════════════════════
  -- HOME PAGE SECTIONS
  -- ═══════════════════════════════════════════
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = home_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (home_id, 'Hero', 'hero-carousel', '{"slides":[{"id":"h1","image":"","mobile_image":null,"eyebrow":"Welcome to Fiesta","headline":"WE CREATE UNFORGETTABLE EXPERIENCES","description":"Fiesta is a creative event agency turning ideas into memorable experiences across Rwanda.","cta_text":"Plan Your Event","cta_url":"/plan-your-event","secondary_cta_text":"View Our Work","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5}]}'::jsonb, 0, true),
    (home_id, 'Brand Statement', 'brand-statement', '{"eyebrow":"Who We Are","primary_text":"We design, produce and manage extraordinary events that people remember.","highlighted_text":"","description":"From intimate celebrations to large-scale productions, Fiesta brings together creativity, planning, entertainment and production.","metadata":"","accent_word":"","variant":"default"}'::jsonb, 1, true),
    (home_id, 'Services', 'services-editorial', '{"heading":"Our Services","description":"Full-service event planning, production and entertainment.","services":[],"variant":"default"}'::jsonb, 2, true),
    (home_id, 'Featured Work', 'portfolio-gallery', '{"heading":"Our Work","description":"A curated collection of our projects.","items":[],"variant":"grid"}'::jsonb, 3, true),
    (home_id, 'Stats', 'stats', '{"heading":"","stats":[],"variant":"default"}'::jsonb, 4, true),
    (home_id, 'Testimonials', 'testimonials', '{"heading":"What Our Clients Say","description":"","testimonials":[],"variant":"default"}'::jsonb, 5, true),
    (home_id, 'Call to Action', 'cta', '{"eyebrow":"Ready to Start?","heading":"Let Create Something Together","description":"","button_text":"Plan Your Event","button_url":"/plan-your-event","secondary_button_text":"","secondary_button_url":"","background_image":"","variant":"default"}'::jsonb, 6, true);
  END IF;

  -- ═══════════════════════════════════════════
  -- ABOUT PAGE SECTIONS
  -- ═══════════════════════════════════════════
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = about_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (about_id, 'Hero', 'hero-carousel', '{"slides":[{"id":"a1","image":"","mobile_image":null,"eyebrow":"About Fiesta","headline":"WE CREATE MORE THAN EVENTS","description":"Fiesta is an event and entertainment agency dedicated to creating professionally planned, memorable experiences.","cta_text":"","cta_url":"","secondary_cta_text":"","secondary_cta_url":"","focal_x":0.5,"focal_y":0.5}]}'::jsonb, 0, true),
    (about_id, 'Our Story', 'brand-statement', '{"eyebrow":"Our Story","primary_text":"Fiesta exists to transform ideas into experiences people remember.","highlighted_text":"","description":"From intimate celebrations to large-scale productions, Fiesta brings together creativity, planning, entertainment, production and people.","metadata":"","accent_word":"","variant":"default"}'::jsonb, 1, true),
    (about_id, 'Mission', 'text-image', '{"eyebrow":"01","heading":"MISSION","body":"To turn clients ideas into well-planned events by combining creativity, entertainment, production, communication, logistics and professional customer service.","image":"","image_alt":"","image_position":"right","cta_text":"","cta_url":"","variant":"default"}'::jsonb, 2, true),
    (about_id, 'Vision', 'text-image', '{"eyebrow":"02","heading":"VISION","body":"To become a trusted and creative event brand in Rwanda and, over time, across the region, known for professional organization, strong entertainment experiences and reliable event execution.","image":"","image_alt":"","image_position":"left","cta_text":"","cta_url":"","variant":"default"}'::jsonb, 3, true),
    (about_id, 'Approach', 'process', '{"heading":"The Fiesta Approach","description":"We combine creative thinking, careful planning, production, communication and on-the-ground coordination.","steps":[]}'::jsonb, 4, true),
    (about_id, 'Values', 'stats', '{"heading":"What We Believe","stats":[],"variant":"default"}'::jsonb, 5, true),
    (about_id, 'Testimonials', 'testimonials', '{"heading":"What People Say","description":"","testimonials":[],"variant":"default"}'::jsonb, 6, true),
    (about_id, 'Call to Action', 'cta', '{"eyebrow":"Work With Us","heading":"Lets Connect","description":"","button_text":"Contact Us","button_url":"/contact","secondary_button_text":"","secondary_button_url":"","background_image":"","variant":"default"}'::jsonb, 7, true);
  END IF;

  -- ═══════════════════════════════════════════
  -- SERVICES PAGE SECTIONS
  -- ═══════════════════════════════════════════
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = services_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (services_id, 'Hero', 'hero-carousel', '{"slides":[{"id":"s1","image":"","mobile_image":null,"eyebrow":"What We Do","headline":"OUR SERVICES","description":"Explore our full range of event and creative services.","cta_text":"Contact Us","cta_url":"/contact","secondary_cta_text":"","secondary_cta_url":"","focal_x":0.5,"focal_y":0.5}]}'::jsonb, 0, true),
    (services_id, 'Services', 'services-editorial', '{"heading":"What We Offer","description":"Full-service event planning, production and entertainment.","services":[],"variant":"default"}'::jsonb, 1, true),
    (services_id, 'Process', 'process', '{"heading":"How We Work","description":"Our proven approach to creating extraordinary events.","steps":[]}'::jsonb, 2, true),
    (services_id, 'Testimonials', 'testimonials', '{"heading":"Client Feedback","description":"","testimonials":[],"variant":"default"}'::jsonb, 3, true),
    (services_id, 'Call to Action', 'cta', '{"eyebrow":"Ready to Begin?","heading":"Lets Discuss Your Project","description":"","button_text":"Get in Touch","button_url":"/contact","secondary_button_text":"","secondary_button_url":"","background_image":"","variant":"default"}'::jsonb, 4, true);
  END IF;

  -- ═══════════════════════════════════════════
  -- HOW WE WORK PAGE SECTIONS
  -- ═══════════════════════════════════════════
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = how_we_work_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (how_we_work_id, 'Hero', 'hero-carousel', '{"slides":[{"id":"hw1","image":"","mobile_image":null,"eyebrow":"How We Work","headline":"FROM IDEA TO EXPERIENCE","description":"Our proven process turns your vision into an unforgettable event.","cta_text":"Plan Your Event","cta_url":"/plan-your-event","secondary_cta_text":"","secondary_cta_url":"","focal_x":0.5,"focal_y":0.5}]}'::jsonb, 0, true),
    (how_we_work_id, 'Process', 'process', '{"heading":"Our Process","description":"From the first conversation to the final moment, we handle every detail.","steps":[]}'::jsonb, 1, true),
    (how_we_work_id, 'Services', 'services-editorial', '{"heading":"What We Bring","description":"Creativity, planning, production and people.","services":[],"variant":"default"}'::jsonb, 2, true),
    (how_we_work_id, 'Testimonials', 'testimonials', '{"heading":"Client Stories","description":"","testimonials":[],"variant":"default"}'::jsonb, 3, true),
    (how_we_work_id, 'Call to Action', 'cta', '{"eyebrow":"Ready to Start?","heading":"Lets Create Your Event","description":"","button_text":"Plan Your Event","button_url":"/plan-your-event","secondary_button_text":"","secondary_button_url":"","background_image":"","variant":"default"}'::jsonb, 4, true);
  END IF;

END $$;

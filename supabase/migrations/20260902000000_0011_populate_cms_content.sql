-- Phase 13.10: Populate CMS sections with production content extracted from hardcoded pages
-- Uses direct SQL to bypass RLS
-- Fixes typos: "Let's" not "Lets", "clients'" not "clients"

DO $$
DECLARE
  home_id UUID := 'bd69ce45-ca3f-46ce-8fee-39c33730d5df';
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
  services_id UUID := '198822b7-d1e8-413d-a617-1fdf4216c88f';
  hww_id UUID := 'd19864e2-464f-4d4b-b845-2d1315049dfd';
BEGIN

  -- ═══════════════════════════════════════════
  -- HOME PAGE
  -- ═══════════════════════════════════════════

  -- Hero: 4 slides matching Hero.tsx SLIDES array
  UPDATE sections SET content = '{
    "slides": [
      {"id":"h1","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80","mobile_image":null,"eyebrow":"FIESTA AGENCY","headline":"Moments that live long after the night ends.","description":"Unforgettable celebrations, thoughtfully designed from first idea to final farewell.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5},
      {"id":"h2","image":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80","mobile_image":null,"eyebrow":"EXTRAORDINARY BY DESIGN","headline":"Where every detail becomes part of the story.","description":"From atmosphere and lighting to production and execution, we create experiences people remember.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"DISCOVER FIESTA","secondary_cta_url":"/about","focal_x":0.5,"focal_y":0.5},
      {"id":"h3","image":"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80","mobile_image":null,"eyebrow":"EVENTS WORTH REMEMBERING","headline":"You bring the occasion. We create the experience.","description":"Creative direction, planning and production brought together under one roof.","cta_text":"START PLANNING","cta_url":"/contact","secondary_cta_text":"VIEW OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5},
      {"id":"h4","image":"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80","mobile_image":null,"eyebrow":"THE FIESTA EXPERIENCE","headline":"Designed for the moments that matter most.","description":"Intimate celebrations or large-scale productions — every Fiesta experience is built with intention.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5}
    ]
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'hero-carousel';

  -- Brand Statement: matching BrandStatement.tsx
  UPDATE sections SET content = '{
    "eyebrow": "THE FIESTA APPROACH",
    "primary_text": "WE DON''T JUST PLAN EVENTS.",
    "highlighted_text": "WE CREATE EXPERIENCES PEOPLE REMEMBER.",
    "description": "From the first idea to the final moment, Fiesta brings together creativity, planning, production and people to turn an event into an experience.",
    "metadata": "",
    "accent_word": "REMEMBER",
    "variant": "default",
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
    "image_alt": "Elegant dinner table setup under warm lighting with floral arrangements"
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'brand-statement';

  -- Services Editorial: 10 services matching ServiceSection.tsx FALLBACK_SERVICES
  UPDATE sections SET content = '{
    "heading": "WHAT WE DO",
    "description": "EXPERIENCES CRAFTED WITH INTENTION",
    "variant": "default",
    "services": [
      {"id":"svc1","title":"Concerts & Live Shows","slug":"concerts-live-shows","description":"Planning and production support for live performances, concerts and entertainment experiences.","image_url":"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80","image_alt":"Live concert with professional stage lighting","featured":false},
      {"id":"svc2","title":"Parties & Celebrations","slug":"parties-celebrations","description":"Creative event design and coordination for private celebrations that bring people together.","image_url":"https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80","image_alt":"Private celebration with festive atmosphere","featured":false},
      {"id":"svc3","title":"Weddings & Ceremonies","slug":"weddings-ceremonies","description":"Thoughtful planning and coordination for beautiful weddings and private ceremonies crafted around your love story.","image_url":"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80","image_alt":"Elegant wedding venue with floral arrangements","featured":false},
      {"id":"svc4","title":"Corporate Events","slug":"corporate-events","description":"Professional event planning for conferences, launches and corporate experiences.","image_url":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80","image_alt":"Professional corporate event with staging","featured":false},
      {"id":"svc5","title":"Birthdays & Graduations","slug":"birthdays-graduations","description":"Personalised planning and production for milestone birthdays, graduations and gatherings.","image_url":"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=80","image_alt":"Birthday celebration with decorations and cake","featured":false},
      {"id":"svc6","title":"Event Planning","slug":"event-planning","description":"From the first idea to the final guest departure, we coordinate every detail that brings your event together.","image_url":"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80","image_alt":"Elegant event setup with dramatic lighting","featured":false},
      {"id":"svc7","title":"Decoration & Branding","slug":"decoration-branding","description":"Event styling and branded spaces that make the occasion unmistakably yours.","image_url":"https://images.unsplash.com/photo-1478146059778-26028b07395a?w=900&q=80","image_alt":"Beautiful event decor and floral styling","featured":false},
      {"id":"svc8","title":"Sound, Lighting & Stage","slug":"sound-lighting-stage","description":"Technical production covering sound, lighting, staging and event-day coordination.","image_url":"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=900&q=80","image_alt":"Professional stage lighting and sound setup","featured":false},
      {"id":"svc9","title":"DJ & MC Coordination","slug":"dj-mc-coordination","description":"Connect your event with the right DJs, MCs and entertainment talent.","image_url":"https://images.unsplash.com/photo-1571266028243-3716f02d2d82?w=900&q=80","image_alt":"DJ performing at a premium event","featured":false},
      {"id":"svc10","title":"Photography & Videography","slug":"photography-videography","description":"Capture the atmosphere, people and moments that deserve to live beyond the event.","image_url":"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80","image_alt":"Professional event photographer at work","featured":false}
    ]
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'services-editorial';

  -- Stats: matching StatsSection.tsx FALLBACK_STATS
  UPDATE sections SET content = '{
    "heading": "BY THE NUMBERS",
    "variant": "default",
    "stats": [
      {"id":"st1","number":"10+","label":"YEARS OF EXPERIENCE"},
      {"id":"st2","number":"500+","label":"EVENTS PRODUCED"},
      {"id":"st3","number":"50K+","label":"GUESTS IMPACTED"},
      {"id":"st4","number":"25+","label":"BRANDS & PARTNERS"}
    ]
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'stats';

  -- CTA: matching CTASection.tsx with typo fix and background image
  UPDATE sections SET content = '{
    "eyebrow": "READY TO BEGIN?",
    "heading": "YOUR VISION. OUR CRAFT.",
    "description": "From the first idea to the final moment, we''ll create an experience your guests will remember long after the night ends.",
    "button_text": "PLAN YOUR EVENT",
    "button_url": "/contact",
    "secondary_button_text": "",
    "secondary_button_url": "",
    "background_image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
    "variant": "default"
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'cta';

  -- ═══════════════════════════════════════════
  -- ABOUT PAGE
  -- ═══════════════════════════════════════════

  -- Hero: matching About.tsx hero section
  UPDATE sections SET content = '{
    "slides": [
      {"id":"a1","image":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80","mobile_image":null,"eyebrow":"ABOUT FIESTA","headline":"WE CREATE MORE THAN EVENTS.","description":"Fiesta is an event and entertainment agency dedicated to creating professionally planned, memorable experiences.","cta_text":"","cta_url":"","secondary_cta_text":"","secondary_cta_url":"","focal_x":0.5,"focal_y":0.5}
    ]
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'hero-carousel';

  -- Brand Statement (Our Story): matching About.tsx Our Story section
  UPDATE sections SET content = '{
    "eyebrow": "OUR STORY",
    "primary_text": "BUILT ON PASSION. DRIVEN BY PURPOSE.",
    "highlighted_text": "",
    "description": "Fiesta exists to transform ideas into experiences people remember.",
    "metadata": "",
    "accent_word": "PURPOSE",
    "variant": "default",
    "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80",
    "image_alt": "Elegant event setup with floral arrangements and warm ambient lighting"
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'brand-statement';

  -- Text-Image Mission: matching About.tsx Mission section
  UPDATE sections SET content = '{
    "eyebrow": "01",
    "heading": "MISSION",
    "body": "To turn clients'' ideas into well-planned events by combining creativity, entertainment, production, communication, logistics and professional customer service.",
    "image": "",
    "image_alt": "",
    "image_position": "right",
    "cta_text": "",
    "cta_url": "",
    "variant": "default"
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'text-image' AND sort_order = 2;

  -- Text-Image Vision: matching About.tsx Vision section
  UPDATE sections SET content = '{
    "eyebrow": "02",
    "heading": "VISION",
    "body": "To become a trusted and creative event brand in Rwanda and, over time, across the region, known for professional organization, strong entertainment experiences and reliable event execution.",
    "image": "",
    "image_alt": "",
    "image_position": "left",
    "cta_text": "",
    "cta_url": "",
    "variant": "default"
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'text-image' AND sort_order = 3;

  -- Process (Approach): matching About.tsx Approach section
  UPDATE sections SET content = '{
    "heading": "THE FIESTA APPROACH",
    "description": "We combine creative thinking, careful planning, production, communication and on-the-ground coordination to turn an idea into an experience.",
    "steps": [
      {"id":"ap1","number":"01","title":"IDEA","description":"Every event starts with an idea worth bringing to life.","image":""},
      {"id":"ap2","number":"02","title":"PLANNING","description":"Great experiences depend on details being handled before they become problems.","image":""},
      {"id":"ap3","number":"03","title":"PRODUCTION","description":"The right people turn planning into an experience.","image":""},
      {"id":"ap4","number":"04","title":"EXPERIENCE","description":"Every event has its own rhythm, atmosphere and identity.","image":""}
    ]
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'process';

  -- Stats (Values): matching About.tsx "What Fiesta Believes" principles
  UPDATE sections SET content = '{
    "heading": "WHAT WE BELIEVE",
    "variant": "default",
    "stats": [
      {"id":"v1","number":"01","label":"CREATIVITY — Every event starts with an idea worth bringing to life."},
      {"id":"v2","number":"02","label":"PRECISION — Great experiences depend on details being handled before they become problems."},
      {"id":"v3","number":"03","label":"PEOPLE — The right people turn planning into an experience."},
      {"id":"v4","number":"04","label":"ENERGY — Every event has its own rhythm, atmosphere and identity."},
      {"id":"v5","number":"05","label":"EXCELLENCE — We aim for experiences that feel considered from beginning to end."}
    ]
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'stats';

  -- CTA: matching About.tsx CTA with typo fix
  UPDATE sections SET content = '{
    "eyebrow": "WORK WITH US",
    "heading": "LET''S CONNECT",
    "description": "",
    "button_text": "CONTACT US",
    "button_url": "/contact",
    "secondary_button_text": "",
    "secondary_button_url": "",
    "background_image": "",
    "variant": "default"
  }'::jsonb
  WHERE page_id = about_id AND section_type = 'cta';

  -- ═══════════════════════════════════════════
  -- HOW WE WORK PAGE
  -- ═══════════════════════════════════════════

  -- Hero: matching HowWeWork.tsx hero
  UPDATE sections SET content = '{
    "slides": [
      {"id":"hw1","image":"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80","mobile_image":null,"eyebrow":"HOW WE WORK","headline":"From First Thought to Final Moment.","description":"Every extraordinary event begins with an idea. We turn that idea into an experience through strategy, creativity, production and meticulous execution.","cta_text":"START A CONVERSATION","cta_url":"/contact","secondary_cta_text":"","secondary_cta_url":"","focal_x":0.5,"focal_y":0.5}
    ]
  }'::jsonb
  WHERE page_id = hww_id AND section_type = 'hero-carousel';

  -- Process: matching HowWeWork.tsx STAGES array (5 stages)
  UPDATE sections SET content = '{
    "heading": "OUR PROCESS",
    "description": "From the first conversation to the final moment, we handle every detail.",
    "steps": [
      {"id":"p1","number":"01","title":"DISCOVER","description":"We listen. We understand the occasion, the audience, the atmosphere, the goals and the expectations. Every event begins with a conversation — and every conversation begins with listening.","image":"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80"},
      {"id":"p2","number":"02","title":"DESIGN","description":"Creative direction, visual identity, styling, spatial design and experience architecture. We shape your vision into a coherent creative language — a mood, a palette, a feeling.","image":"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80"},
      {"id":"p3","number":"03","title":"PLAN","description":"Logistics, vendors, timelines, production schedules, technical requirements and coordination. We build the architecture behind the experience — invisible to guests, essential to success.","image":"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80"},
      {"id":"p4","number":"04","title":"PRODUCE","description":"Staging, lighting, sound, decor, entertainment, guest experience and on-site execution. The moment where months of planning become something guests can see, hear, feel and remember.","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"},
      {"id":"p5","number":"05","title":"DELIVER","description":"Fiesta handles the complexity behind the scenes so you can be fully present. You don''t worry about timelines, vendors or transitions. You simply experience the event you imagined.","image":"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80"}
    ]
  }'::jsonb
  WHERE page_id = hww_id AND section_type = 'process';

  -- CTA: matching HowWeWork.tsx CTA with typo fix
  UPDATE sections SET content = '{
    "eyebrow": "READY TO START?",
    "heading": "YOUR IDEA DESERVES AN EXTRAORDINARY EXPERIENCE.",
    "description": "Let''s bring it to life. Share your vision and we''ll handle everything — from concept to the final standing ovation.",
    "button_text": "PLAN YOUR EVENT",
    "button_url": "/contact",
    "secondary_button_text": "",
    "secondary_button_url": "",
    "background_image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=80",
    "variant": "default"
  }'::jsonb
  WHERE page_id = hww_id AND section_type = 'cta';

  -- ═══════════════════════════════════════════
  -- SERVICES PAGE
  -- ═══════════════════════════════════════════

  -- Hero: matching Services.tsx hero
  UPDATE sections SET content = '{
    "slides": [
      {"id":"s1","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80","mobile_image":null,"eyebrow":"WHAT WE DO","headline":"Experiences designed with intention.","description":"From intimate celebrations to large-scale productions, Fiesta brings creative direction, planning and execution together under one roof.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5}
    ]
  }'::jsonb
  WHERE page_id = services_id AND section_type = 'hero-carousel';

  -- Process: matching Services.tsx process steps
  UPDATE sections SET content = '{
    "heading": "HOW WE WORK",
    "description": "Our proven approach to creating extraordinary events.",
    "steps": [
      {"id":"sp1","number":"01","title":"DISCOVER","description":"We listen. We understand the occasion, the audience, the atmosphere, the goals and the expectations.","image":"https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80"},
      {"id":"sp2","number":"02","title":"DESIGN","description":"Creative direction, visual identity, styling, spatial design and experience architecture.","image":"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80"},
      {"id":"sp3","number":"03","title":"PLAN","description":"Logistics, vendors, timelines, production schedules, technical requirements and coordination.","image":"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=80"},
      {"id":"sp4","number":"04","title":"PRODUCE","description":"Staging, lighting, sound, decor, entertainment, guest experience and on-site execution.","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"},
      {"id":"sp5","number":"05","title":"DELIVER","description":"You simply experience the event you imagined.","image":"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80"}
    ]
  }'::jsonb
  WHERE page_id = services_id AND section_type = 'process';

  -- CTA: matching Services.tsx CTA with typo fix
  UPDATE sections SET content = '{
    "eyebrow": "READY TO BEGIN?",
    "heading": "LET''S DISCUSS YOUR PROJECT",
    "description": "",
    "button_text": "GET IN TOUCH",
    "button_url": "/contact",
    "secondary_button_text": "",
    "secondary_button_url": "",
    "background_image": "",
    "variant": "default"
  }'::jsonb
  WHERE page_id = services_id AND section_type = 'cta';

END $$;

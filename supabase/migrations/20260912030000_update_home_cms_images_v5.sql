-- Phase 13.11: Update home page CMS images with uploaded Supabase Storage images
-- Uses TEXT variables for filenames (UUIDs with .JPG extension)

DO $$
DECLARE
  home_id UUID := 'bd69ce45-ca3f-46ce-8fee-39c33730d5df';
  img1 TEXT := '1789237181004-3xhl7jh5r8c.JPG';
  img2 TEXT := '1789237158612-mn2meeybu9o.JPG';
  img3 TEXT := '1789237092060-8sq54jcdwr8.JPG';
BEGIN

  -- Hero: 4 slides matching Hero.tsx SLIDES array
  UPDATE sections SET content = $$
  {
    "slides": [
      {"id":"h1","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img1||'","mobile_image":null,"eyebrow":"FIESTA AGENCY","headline":"Moments that live long after the night ends.","description":"Unforgettable celebrations, thoughtfully designed from first idea to final farewell.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5},
      {"id":"h2","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img2||'","mobile_image":null,"eyebrow":"EXTRAORDINARY BY DESIGN","headline":"Where every detail becomes part of the story.","description":"From atmosphere and lighting to production and execution, we create experiences people remember.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"DISCOVER FIESTA","secondary_cta_url":"/about","focal_x":0.5,"focal_y":0.5},
      {"id":"h3","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img3||'","mobile_image":null,"eyebrow":"EVENTS WORTH REMEMBERING","headline":"You bring the occasion. We create the experience.","description":"Creative direction, planning and production brought together under one roof.","cta_text":"START PLANNING","cta_url":"/contact","secondary_cta_text":"VIEW OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5},
      {"id":"h4","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img1||'","mobile_image":null,"eyebrow":"THE FIESTA EXPERIENCE","headline":"Designed for the moments that matter most.","description":"Intimate celebrations or large-scale productions - every Fiesta experience is built with intention.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5}
    ]
  }$$::jsonb
  WHERE page_id = home_id AND section_type = 'hero-carousel';

  -- Brand Statement: matching BrandStatement.tsx
  UPDATE sections SET content = $$
  {
    "eyebrow": "THE FIESTA APPROACH",
    "primary_text": "WE DON''T JUST PLAN EVENTS.",
    "highlighted_text": "WE CREATE EXPERIENCES PEOPLE REMEMBER.",
    "description": "From the first idea to the final moment, Fiesta brings together creativity, planning, production and people to turn an event into an experience.",
    "metadata": "",
    "accent_word": "REMEMBER",
    "variant": "default",
    "image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img2||'",
    "image_alt": "Elegant dinner table setup under warm lighting with floral arrangements"
  }$$::jsonb
  WHERE page_id = home_id AND section_type = 'brand-statement';

  -- Services Editorial: 10 services matching ServiceSection.tsx FALLBACK_SERVICES
  UPDATE sections SET content = $$
  {
    "heading": "WHAT WE DO",
    "description": "EXPERIENCES CRAFTED WITH INTENTION",
    "variant": "default",
    "services": [
      {"id":"svc1","title":"Concerts & Live Shows","slug":"concerts-live-shows","description":"Planning and production support for live performances, concerts and entertainment experiences.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img1||'","image_alt":"Live concert with professional stage lighting","featured":false},
      {"id":"svc2","title":"Parties & Celebrations","slug":"parties-celebrations","description":"Creative event design and coordination for private celebrations that bring people together.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img2||'","image_alt":"Private celebration with festive atmosphere","featured":false},
      {"id":"svc3","title":"Weddings & Ceremonies","slug":"weddings-ceremonies","description":"Thoughtful planning and coordination for beautiful weddings and private ceremonies crafted around your love story.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img3||'","image_alt":"Elegant wedding venue with floral arrangements","featured":false},
      {"id":"svc4","title":"Corporate Events","slug":"corporate-events","description":"Professional event planning for conferences, launches and corporate experiences.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img1||'","image_alt":"Professional corporate event with staging","featured":false},
      {"id":"svc5","title":"Birthdays & Graduations","slug":"birthdays-graduations","description":"Personalised planning and production for milestone birthdays, graduations and gatherings.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img2||'","image_alt":"Birthday celebration with decorations and cake","featured":false},
      {"id":"svc6","title":"Event Planning","slug":"event-planning","description":"From the first idea to the final guest departure, we coordinate every detail that brings your event together.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img3||'","image_alt":"Elegant event setup with dramatic lighting","featured":false},
      {"id":"svc7","title":"Decoration & Branding","slug":"decoration-branding","description":"Event styling and branded spaces that make the occasion unmistakably yours.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img1||'","image_alt":"Beautiful event decor and floral styling","featured":false},
      {"id":"svc8","title":"Sound, Lighting & Stage","slug":"sound-lighting-stage","description":"Technical production covering sound, lighting, staging and event-day coordination.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img2||'","image_alt":"Professional stage lighting and sound setup","featured":false},
      {"id":"svc9","title":"DJ & MC Coordination","slug":"dj-mc-coordination","description":"Connect your event with the right DJs, MCs and entertainment talent.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img3||'","image_alt":"DJ performing at a premium event","featured":false},
      {"id":"svc10","title":"Photography & Videography","slug":"photography-videography","description":"Capture the atmosphere, people and moments that deserve to live beyond the event.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img1||'","image_alt":"Professional event photographer at work","featured":false}
    ]
  }$$::jsonb
  WHERE page_id = home_id AND section_type = 'services-editorial';

  -- CTA: matching CTASection.tsx with typo fix and background image
  UPDATE sections SET content = $$
  {
    "eyebrow": "READY TO BEGIN?",
    "heading": "YOUR VISION. OUR CRAFT.",
    "description": "From the first idea to the final moment, we will create an experience your guests will remember long after the night ends.",
    "button_text": "PLAN YOUR EVENT",
    "button_url": "/contact",
    "secondary_button_text": "",
    "secondary_button_url": "",
    "background_image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/'||img2||'",
    "variant": "default"
  }$$::jsonb
  WHERE page_id = home_id AND section_type = 'cta';

END $$;
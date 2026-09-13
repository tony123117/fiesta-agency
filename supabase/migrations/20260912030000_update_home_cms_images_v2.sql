-- Update home page CMS images with uploaded images from Supabase Storage
-- Bucket: media/originals (uploaded via admin panel)
-- Folder mapping: hero, intimate, process, behind, lagoon, serena, garden, blacktie

DO $$
DECLARE
  home_id UUID := 'bd69ce45-ca3f-46ce-8fee-39c33730d5df';
BEGIN

  -- Hero: 4 slides from hero folder
  UPDATE sections SET content = '{
    "slides": [
      {"id":"h1","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/hero/1789237163289-ytc5w0r4sur.JPG","mobile_image":null,"eyebrow":"FIESTA AGENCY","headline":"Moments that live long after the night ends.","description":"Unforgettable celebrations, thoughtfully designed from first idea to final farewell.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5},
      {"id":"h2","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/hero/2ND-IMAGE-UUID.JPG","mobile_image":null,"eyebrow":"EXTRAORDINARY BY DESIGN","headline":"Where every detail becomes part of the story.","description":"From atmosphere and lighting to production and execution, we create experiences people remember.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"DISCOVER FIESTA","secondary_cta_url":"/about","focal_x":0.5,"focal_y":0.5},
      {"id":"h3","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/hero/3RD-IMAGE-UUID.JPG","mobile_image":null,"eyebrow":"EVENTS WORTH REMEMBERING","headline":"You bring the occasion. We create the experience.","description":"Creative direction, planning and production brought together under one roof.","cta_text":"START PLANNING","cta_url":"/contact","secondary_cta_text":"VIEW OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5},
      {"id":"h4","image":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/hero/4TH-IMAGE-UUID.JPG","mobile_image":null,"eyebrow":"THE FIESTA EXPERIENCE","headline":"Designed for the moments that matter most.","description":"Intimate celebrations or large-scale productions - every Fiesta experience is built with intention.","cta_text":"PLAN YOUR EVENT","cta_url":"/contact","secondary_cta_text":"EXPLORE OUR WORK","secondary_cta_url":"/portfolio","focal_x":0.5,"focal_y":0.5}
    ]
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'hero-carousel';

  -- Brand Statement: 1 image from intimate folder (matches "intimate celebrations" theme)
  UPDATE sections SET content = '{
    "eyebrow": "THE FIESTA APPROACH",
    "primary_text": "WE DON''T JUST PLAN EVENTS.",
    "highlighted_text": "WE CREATE EXPERIENCES PEOPLE REMEMBER.",
    "description": "From the first idea to the final moment, Fiesta brings together creativity, planning, production and people to turn an event into an experience.",
    "metadata": "",
    "accent_word": "REMEMBER",
    "variant": "default",
    "image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/intimate/5GPWgBpgYKQXTTxmolDIkosGgdDfLFb2LwG9moj0n9wGy_XBZa4E7LsRD24_D-6ttWvOkob7Gt_59MB_abAFiSySFzZolpS6juAZ5jWV2KtEkKFT9KxqwW2R-mMXjXFrbLsufQ0UMfxqkbZhg6fpMzjUS8IDwAoFJ.jpg",
    "image_alt": "Elegant candlelit event venue with warm atmospheric lighting"
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'brand-statement';

  -- Services Editorial: 10 services with images from process (6) + behind (4) folders
  UPDATE sections SET content = '{
    "heading": "WHAT WE DO",
    "description": "EXPERIENCES CRAFTED WITH INTENTION",
    "variant": "default",
    "services": [
      {"id":"svc1","title":"Concerts & Live Shows","slug":"concerts-live-shows","description":"Planning and production support for live performances, concerts and entertainment experiences.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/process/1zonCqikcTn-piNgtPuY_2KgN_PzpUee4muM6VbPUcQW56vQoDcKj4EP89H6vuBorFVoAZgc1VsVwtmzZLv87LKFNVvZWmfpeyOE8gsp9IKlcgEC5D2ldyQ_QrVA-teMpOncAEA7GjHDlYK_NXrafCDq5lftZz4Tl.jpg","image_alt":"Live concert with professional stage lighting","featured":false},
      {"id":"svc2","title":"Parties & Celebrations","slug":"parties-celebrations","description":"Creative event design and coordination for private celebrations that bring people together.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/process/z1_ajhFh2mz4Up8w1VRFoxOCKqwSoaVYU2i_zhxbVf-8HQ2EperUFt-5mN9Z25Nb9JMeLbUJ0DoFCGB01c4RtcFRyhU1aupaWzw3v1yEmXyFdryKwYpjj7Fa_a5e8aGKYOCD04Zs9QtjN6JHsxm-ERzh98ZMPhmahsAOPm.jpg","image_alt":"Private celebration with festive atmosphere","featured":false},
      {"id":"svc3","title":"Weddings & Ceremonies","slug":"weddings-ceremonies","description":"Thoughtful planning and coordination for beautiful weddings and private ceremonies crafted around your love story.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/behind/go6LV93dWlqowlwlLYowtbdO19Cq7AFCyOpHDswz4pHtqFvQFlIosXCX-YTI8ULNU7VARYXRBV2DL5AZbgUGUYrCD_Rc1yvzv-DMIq2rrfEYpq3e9NDbfKoNQCZq4bIZLWL2MI1H9TU2wbsh5n6G4KJ_O31k0cl2eQA5uGZ.jpg","image_alt":"Elegant wedding venue with floral arrangements","featured":false},
      {"id":"svc4","title":"Corporate Events","slug":"corporate-events","description":"Professional event planning for conferences, launches and corporate experiences.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/lagoon/B-3dT5_Bu6Abcjwx1OhorJNrR33ubT04B7-J0OZw_MhvOjBWtfrL4AA3byiHD9m4WLV7dEkWv3eZ1_NK1Q_yctr47xawqQMzOwoXQnNEYj8QgpEtuvRC5Vp386Gf2WhnvFD_LRJPxS9Ij4_fzc8aH0MxfshJea7pCj.jpg","image_alt":"Professional corporate event with staging","featured":false},
      {"id":"svc5","title":"Birthdays & Graduations","slug":"birthdays-graduations","description":"Personalised planning and production for milestone birthdays, graduations and gatherings.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/serena/dnnOb9SYQKpoaMOREWERYqricRJJ1pXcf5TPNTmaXUfnSJOavqj0uZdcnL0ycYs9StPT7cnRtyQslUTibn9QEpEFuUav66VKzdRPXUIyN6b_lAyAHSm8hv2mAxDNai9kMQ0MDKYZmpb9HYoKCNiO1zOfVbS2IyBeE.jpg","image_alt":"Birthday celebration with decorations and cake","featured":false},
      {"id":"svc6","title":"Event Planning","slug":"event-planning","description":"From the first idea to the final guest departure, we coordinate every detail that brings your event together.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/blacktie/anA8v6GDr90GpgNpNRZE7SXYr8BevKadNT3JRkM1O6woLClThlX4m71by0zJvyThjJXgDjFZg9akV7_N3s_llqKl3b89E8y5IDAKIGkq07YsrL90bMRTrboiBmnM3tgCXGwTxgvkodarEnwSt2F0tyRsDddwn.jpg","image_alt":"Elegant event setup with dramatic lighting","featured":false},
      {"id":"svc7","title":"Decoration & Branding","slug":"decoration-branding","description":"Event styling and branded spaces that make the occasion unmistakably yours.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/garden/3znKhu5BZLQQlhTTUq-MSeF1lZOm-_hx190-sYZnxYEBHxKwkftleM-Ngs7as-lFsCxTOA1WtB6U6oxQHW0n3Xktkq8BSmIoduXBp6F84USgxXWgHYPm-2KT-MKZ-F-qyzNIbRE4hVj0mzVNu2wK-8.jpg","image_alt":"Beautiful event decor and floral styling","featured":false},
      {"id":"svc8","title":"Sound, Lighting & Stage","slug":"sound-lighting-stage","description":"Technical production covering sound, lighting, staging and event-day coordination.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/bts/QP3uWXpNGy_PdyMLVl7tKDJzTxd7WpSKKNjeNpqsjwDlTUvcRd3DJpP5jdgZyehHJHAon-bGMGz6qljo64r1g02MZ3gBQBnLyPcbI7gNUn2YYYXPVYZVoA42pTAT1xKZCaonE3pvFEIyJUFSV7HvGdu5LGVkMlalbpS7c5rErGw6MYFgr1W3.jpg","image_alt":"Professional stage lighting and sound setup","featured":false},
      {"id":"svc9","title":"DJ & MC Coordination","slug":"dj-mc-coordination","description":"Connect your event with the right DJs, MCs and entertainment talent.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/behind/OzM5EdmA8sB35K1ZUbckWQ7F1nYORAOLI66QUyFPboOYVZmJ9fcTvXZz2sXZtWugWfdFaFt55zisfYHY1mQH1Hq9QV9HwYau62qQqsniabeGAQiK75pIUYRLfPw33bD6_wQKY04P94KWEkx988uI2VQTxorPqlFwo_psqC0WvMrqDbAEzL09AaeHqtOvzm06.jpg","image_alt":"DJ performing at a premium event","featured":false},
      {"id":"svc10","title":"Photography & Videography","slug":"photography-videography","description":"Capture the atmosphere, people and moments that deserve to live beyond the event.","image_url":"https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/intimate/OzM5EdmA8sB35K1ZUbckWQ7F1nYORAOLI66QUyFPboOYVZmJ9fcTvXZz2sXZtWugWfdFaFt55zisfYHY1mQH1Hq9QV9HwYau62qQqsniabeGAQiK75pIUYRLfPw33bD6_wQKY04P94KWEkx988uI2VQTxorPqlFwo_psqC0WvMrqDbAEzL09AaeHqtOvzm06.jpg","image_alt":"Professional event photographer at work","featured":false}
    ]
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'services-editorial';

  -- CTA: 1 background image from lagoon folder
  UPDATE sections SET content = '{
    "eyebrow": "READY TO BEGIN?",
    "heading": "YOUR VISION. OUR CRAFT.",
    "description": "From the first idea to the final moment, we will create an experience your guests will remember long after the night ends.",
    "button_text": "PLAN YOUR EVENT",
    "button_url": "/contact",
    "secondary_button_text": "",
    "secondary_button_url": "",
    "background_image": "https://fbrxvzcaylwdchrmsatn.supabase.co/storage/v1/object/public/media/originals/lagoon/1zonCqikcTn-piNgtPuY_2KgN_PzpUee4muM6VbPUcQW56vQoDcKj4EP89H6vuBorFVoAZgc1VsVwtmzZLv87LKFNVvZWmfpeyOE8gsp9IKlcgEC5D2ldyQ_QrVA-teMpOncAEA7GjHDlYK_NXrafCDq5lftZz4Tl.jpg",
    "variant": "default"
  }'::jsonb
  WHERE page_id = home_id AND section_type = 'cta';

END $$;
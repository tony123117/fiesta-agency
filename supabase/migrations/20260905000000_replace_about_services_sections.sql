-- Replace About & Services page sections with new dedicated section types

DO $$
DECLARE
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
  services_id UUID := '198822b7-d1e8-413d-a617-1fdf4216c88f';
BEGIN

  DELETE FROM sections WHERE page_id = about_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
  (about_id, 'Hero', 'about-hero',
   '{"eyebrow":"ABOUT US","heading":"WE DON''T JUST\nPLAN EVENTS.\n\nWE CREATE\nEXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.","body":"At Fiesta, we believe every moment has the potential to be extraordinary.","cta_text":"OUR APPROACH","cta_url":"/about#approach","image":"","image_alt":""}'::jsonb,
   0, true),

  (about_id, 'Our Story', 'about-story',
   '{"eyebrow":"OUR STORY","heading":"BUILT ON PASSION.\nDRIVEN BY PURPOSE.","body":"Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.\n\nToday, we are a full-service event management company trusted by individuals, brands, and organizations to deliver experiences that resonate long after the last guest departs.","image":"","image_alt":"","cta_text":"OUR SERVICES","cta_url":"/services"}'::jsonb,
   1, true),

  (about_id, 'Philosophy', 'about-philosophy',
   '{"eyebrow":"THE FIESTA PHILOSOPHY","heading":"THE DETAILS ARE\nTHE EXPERIENCE.","body":"Sometimes the idea arrives as a mood board.\nSometimes it begins with a conversation.\nSometimes it is simply a feeling about how people should remember a night.\n\nOur job is to turn that idea into something real.","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80"}'::jsonb,
   2, true),

  (about_id, 'Mission + Vision', 'about-mission-vision',
   '{"mission_heading":"OUR MISSION","mission_body":"To turn ideas into experiences that people can feel.","vision_heading":"OUR VISION","vision_body":"To become the most trusted premium event and entertainment brand."}'::jsonb,
   3, true),

  (about_id, 'Values', 'about-values',
   '{"eyebrow":"OUR VALUES","heading":"WHAT WE\nBELIEVE IN.","values":[{"id":"v1","title":"CREATIVITY","description":"Every event deserves a unique creative vision."},{"id":"v2","title":"PRECISION","description":"The details matter. We obsess over every element."},{"id":"v3","title":"PASSION","description":"We genuinely care about the experiences we create."},{"id":"v4","title":"INTEGRITY","description":"Honest communication and reliable execution."},{"id":"v5","title":"EXCELLENCE","description":"Good enough is never enough."}]}'::jsonb,
   4, true),

  (about_id, 'Why Fiesta', 'about-why',
   '{"heading":"WHY FIESTA?","items":[{"id":"w1","title":"CREATIVE DIRECTION","description":"We shape an idea into a clear creative vision."},{"id":"w2","title":"SEAMLESS EXECUTION","description":"Every moving part is planned, coordinated and delivered."},{"id":"w3","title":"PERSONAL ATTENTION","description":"No two events are treated exactly the same."},{"id":"w4","title":"UNFORGETTABLE EXPERIENCES","description":"The final result should be felt long after the event ends."}]}'::jsonb,
   5, true),

  (about_id, 'People', 'about-team',
   '{"heading":"THE PEOPLE\nBEHIND THE MOMENTS.","members":[]}'::jsonb,
   6, true),

  (about_id, 'CTA', 'about-cta',
   '{"heading":"YOUR VISION.\nOUR EXPERIENCE.","button_text":"LET''S CREATE IT","button_url":"/contact","background_image":""}'::jsonb,
   7, true);

  DELETE FROM sections WHERE page_id = services_id;

  INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
  (services_id, 'Hero', 'services-hero',
   '{"eyebrow":"OUR SERVICES","heading":"EVERY DETAIL\nCRAFTED TO\nPERFECTION.","description":"From concept to execution, we offer end-to-end event solutions tailored to your vision."}'::jsonb,
   0, true),

  (services_id, 'Featured Services', 'services-featured',
   '{"eyebrow":"WHAT WE DO","heading":"EVENTS\nCRAFTED WITH\nINTENTION.","services":[{"id":"sf1","title":"EVENT PLANNING","description":"Full-service event planning from concept to execution.","image":""},{"id":"sf2","title":"CONCERTS & LIVE SHOWS","description":"End-to-end production for concerts and live performances.","image":""},{"id":"sf3","title":"WEDDINGS & CELEBRATIONS","description":"Beautifully curated weddings and private celebrations.","image":""}]}'::jsonb,
   1, true),

  (services_id, 'Service Directory', 'services-directory',
   '{"heading":"","services":[{"id":"sd1","number":"01","title":"EVENT PLANNING & COORDINATION"},{"id":"sd2","number":"02","title":"CONCERTS & LIVE SHOWS"},{"id":"sd3","number":"03","title":"WEDDINGS & CELEBRATIONS"},{"id":"sd4","number":"04","title":"CORPORATE EVENTS"},{"id":"sd5","number":"05","title":"PRIVATE EVENTS & PARTIES"},{"id":"sd6","number":"06","title":"SOUND & LIGHTING PRODUCTION"},{"id":"sd7","number":"07","title":"STAGE DESIGN & SCENOGRAPHY"},{"id":"sd8","number":"08","title":"ARTIST & TALENT BOOKING"},{"id":"sd9","number":"09","title":"BRAND ACTIVATIONS"},{"id":"sd10","number":"10","title":"PHOTOGRAPHY & VIDEOGRAPHY"}]}'::jsonb,
   2, true),

  (services_id, 'Service Philosophy', 'services-philosophy',
   '{"eyebrow":"THE FIESTA STANDARD","heading":"EVERY EVENT\nDESERVES ITS\nOWN STORY.","body":"We don''t believe in copying the same event twice.\n\nA wedding should feel like the people getting married.\nA concert should feel like the artist performing.\nA corporate gathering should feel like the brand behind it.\n\nOur role is to understand the idea first, then build everything around it."}'::jsonb,
   3, true),

  (services_id, 'Process', 'services-process',
   '{"heading":"","steps":[{"id":"sp1","number":"01","title":"IDEA","description":"We listen to your vision and understand the feeling you want to create."},{"id":"sp2","number":"02","title":"CREATIVE","description":"We develop a creative direction that brings your idea to life."},{"id":"sp3","number":"03","title":"PLANNING","description":"Every detail is mapped out with precision and care."},{"id":"sp4","number":"04","title":"PRODUCTION","description":"We execute with expertise, managing every moving part."},{"id":"sp5","number":"05","title":"DELIVERY","description":"The final experience exceeds expectations."}]}'::jsonb,
   4, true),

  (services_id, 'Image Statement', 'services-image-statement',
   '{"heading":"WE TAKE CARE\nOF THE DETAILS.","description":"","image":""}'::jsonb,
   5, true),

  (services_id, 'CTA', 'services-cta',
   '{"heading":"TELL US WHAT\nYOU''RE IMAGINING.","button_text":"GET IN TOUCH","button_url":"/contact","background_image":""}'::jsonb,
   6, true);

END $$;

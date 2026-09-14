-- Fix services page testimonials section field names
-- CMS used 'author'/'role' but TestimonialsRenderer expects 'client_name'/'event_type'/'location'/'id'/'image_url'

DO $$
DECLARE
  svc_id UUID;
BEGIN
  SELECT id INTO svc_id FROM pages WHERE slug = 'services';

  IF svc_id IS NOT NULL THEN
    UPDATE sections SET content = '{"eyebrow":"WHAT THEY SAY","heading":"WORDS FROM OUR CLIENTS.","testimonials":[{"id":"st1","quote":"Fiesta turned our wedding into something we could never have imagined. Every guest said it was the most beautiful event they had ever attended.","client_name":"SARAH & MICHEL","event_type":"Wedding","location":"Kigali","image_url":""},{"id":"st2","quote":"Professional, creative, and genuinely passionate. They don''t just plan events - they create experiences that stay with you.","client_name":"DAVID NZAMUHO","event_type":"Corporate Summit","location":"","image_url":""},{"id":"st3","quote":"The energy they brought to our concert was unreal. From stage design to sound production - absolute perfection.","client_name":"JEAN-PASCAL","event_type":"Live Show Production","location":"","image_url":""}],"variant":"default"}'::jsonb
    WHERE page_id = svc_id AND section_type = 'testimonials';
  END IF;
END $$;

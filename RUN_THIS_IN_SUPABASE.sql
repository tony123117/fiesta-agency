-- Run this in Supabase SQL Editor
-- Deletes old about sections and inserts 8 new ones

CREATE OR REPLACE FUNCTION _tmp_delete_about()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM sections WHERE page_id = 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
END;
$$;
SELECT _tmp_delete_about();
DROP FUNCTION _tmp_delete_about();

DO $$
DECLARE
  pid UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
BEGIN
INSERT INTO sections (id, page_id, title, section_type, content, sort_order, published, created_at, updated_at) VALUES
(gen_random_uuid(), pid, 'About Introduction', 'about-intro',
 jsonb_build_object('eyebrow','ABOUT FIESTA','heading','WE DONT JUST PLAN EVENTS. WE CREATE EXPERIENCES THAT STAY WITH YOU FOREVER.','body','At Fiesta, we believe every moment has the potential to become extraordinary. From intimate celebrations to large-scale productions, we bring creativity, precision and passion to every detail.','cta_text','OUR APPROACH','cta_url','#','image','','image_alt',''),
 0, true, now(), now()),

(gen_random_uuid(), pid, 'Our Story', 'about-story',
 jsonb_build_object('eyebrow','OUR STORY','heading','BUILT ON PASSION. DRIVEN BY PURPOSE.','body','Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.','image','','image_alt',''),
 1, true, now(), now()),

(gen_random_uuid(), pid, 'Our Identity', 'about-editorial',
 jsonb_build_object('eyebrow','WHAT DRIVES US','heading','WE TURN IDEAS INTO MEMORABLE EXPERIENCES.','body','Fiesta takes an initial idea and develops it into a cohesive experience: concept, creative direction, planning, production, and execution: all working together as one vision.'),
 2, true, now(), now()),

(gen_random_uuid(), pid, 'Our Foundation', 'about-foundation',
 jsonb_build_object('eyebrow','OUR FOUNDATION','heading','WHAT WE BELIEVE IN.',
  'mission', jsonb_build_object('title','OUR MISSION','description','We turn ideas into well-crafted experiences by combining creativity, entertainment, production and precision.'),
  'vision', jsonb_build_object('title','OUR VISION','description','Building a trusted and creative event company. Creating experiences people remember. Growing across the region.'),
  'values', jsonb_build_object('title','OUR VALUES','description','Creativity. Excellence. Integrity. Passion. Teamwork.')),
 3, true, now(), now()),

(gen_random_uuid(), pid, 'Our Values', 'about-values',
 jsonb_build_object('eyebrow','OUR VALUES','heading','THE PRINCIPLES BEHIND THE EXPERIENCE.',
  'values', jsonb_build_array(
    jsonb_build_object('id','1','name','CREATIVITY'),
    jsonb_build_object('id','2','name','PASSION'),
    jsonb_build_object('id','3','name','INTEGRITY'),
    jsonb_build_object('id','4','name','EXCELLENCE'),
    jsonb_build_object('id','5','name','TEAMWORK')),
  'image','','image_alt',''),
 4, true, now(), now()),

(gen_random_uuid(), pid, 'Our Team', 'about-team',
 jsonb_build_object('eyebrow','OUR TEAM','heading','THE PEOPLE BEHIND THE MOMENTS.','members','[]'::jsonb),
 5, true, now(), now()),

(gen_random_uuid(), pid, 'Why Fiesta', 'about-why',
 jsonb_build_object('heading','WHY FIESTA?',
  'points', jsonb_build_array(
    jsonb_build_object('id','1','title','CREATIVE THINKING','description','We approach every event from its own story.'),
    jsonb_build_object('id','2','title','SEAMLESS EXECUTION','description','We coordinate the moving parts behind the scenes.'),
    jsonb_build_object('id','3','title','ATTENTION TO DETAIL','description','We care about the details guests may never notice, but always feel.'))),
 6, true, now(), now()),

(gen_random_uuid(), pid, 'Cinematic Closing', 'about-closing',
 jsonb_build_object('heading','YOUR VISION. OUR EXPERIENCE.','cta_text','LETS CREATE IT','cta_url','/contact','background_image','','background_image_alt',''),
 7, true, now(), now());
END $$;

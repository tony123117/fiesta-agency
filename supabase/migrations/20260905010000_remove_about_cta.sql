-- Remove About CTA section (Footer already has its own CTA)
-- Also update About page template: remove the about-cta section

DO $$
DECLARE
  about_id UUID := 'b4ae785c-a707-4483-a6ef-3a714bb387f3';
BEGIN
  DELETE FROM sections WHERE page_id = about_id AND section_type = 'about-cta';
END $$;

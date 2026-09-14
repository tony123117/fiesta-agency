-- Phase 30.8: Seed Privacy, Terms, Events, and Portfolio CMS sections
-- Creates pages and sections for legal pages
-- Adds section metadata for Events and Portfolio pages

DO $$
DECLARE
  privacy_id UUID;
  terms_id UUID;
  events_id UUID;
  portfolio_id UUID;
  existing_count INTEGER;
BEGIN

  -- ═══════════════════════════════════════════
  -- PRIVACY PAGE
  -- ═══════════════════════════════════════════
  SELECT count(*) INTO existing_count FROM pages WHERE slug = 'privacy';
  IF existing_count = 0 THEN
    INSERT INTO pages (id, slug, title, seo_title, seo_description, published)
    VALUES (gen_random_uuid(), 'privacy', 'Privacy Policy', 'Privacy Policy | Fiesta Agency', 'Fiesta Agency privacy policy. Learn how we collect, use, and protect your personal information.', true);
  END IF;

  SELECT id INTO privacy_id FROM pages WHERE slug = 'privacy';
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = privacy_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (privacy_id, 'Privacy Policy', 'legal-page', '{"eyebrow":"Legal","heading":"PRIVACY POLICY","sections":[{"heading":"1. Information We Collect","content":"When you contact us through our website forms, we collect your name, email address, phone number, and any information you provide in your message. This includes event details and preferences you share with us."},{"heading":"2. How We Use Your Information","content":"We use your information to respond to your inquiries, provide event planning services, and communicate about your projects. We do not sell or share your personal information with third parties for marketing purposes."},{"heading":"3. Data Protection","content":"We implement appropriate security measures to protect your personal information. Your data is stored securely and accessed only by authorized team members who need it to provide our services."},{"heading":"4. Cookies","content":"Our website uses essential cookies to ensure proper functionality. We do not use tracking cookies or third-party analytics that collect personal data."},{"heading":"5. Your Rights","content":"You have the right to request access to your personal data, request corrections, or ask us to delete your information. To exercise these rights, please contact us at the email address below."},{"heading":"6. Contact Us","content":"For questions about this privacy policy or your personal data, contact us at: info@fiestaagency.com"}]}'::jsonb, 0, true);
  END IF;

  -- ═══════════════════════════════════════════
  -- TERMS PAGE
  -- ═══════════════════════════════════════════
  SELECT count(*) INTO existing_count FROM pages WHERE slug = 'terms';
  IF existing_count = 0 THEN
    INSERT INTO pages (id, slug, title, seo_title, seo_description, published)
    VALUES (gen_random_uuid(), 'terms', 'Terms & Conditions', 'Terms & Conditions | Fiesta Agency', 'Fiesta Agency terms and conditions. Read about the rules governing use of our services and website.', true);
  END IF;

  SELECT id INTO terms_id FROM pages WHERE slug = 'terms';
  SELECT count(*) INTO existing_count FROM sections WHERE page_id = terms_id;
  IF existing_count = 0 THEN
    INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
    (terms_id, 'Terms & Conditions', 'legal-page', '{"eyebrow":"Legal","heading":"TERMS & CONDITIONS","sections":[{"heading":"1. Services","content":"Fiesta Agency provides event planning, entertainment, and production services. All services are subject to availability and mutual agreement on scope, timeline, and pricing as outlined in individual service agreements."},{"heading":"2. Booking & Payments","content":"A deposit is required to confirm your booking. Remaining balances are due according to the payment schedule specified in your service agreement. Late payments may result in service delays or cancellation."},{"heading":"3. Cancellation Policy","content":"Cancellations made more than 30 days before the event date may receive a partial refund of the deposit. Cancellations within 30 days of the event are non-refundable. Rescheduling is subject to availability."},{"heading":"4. Intellectual Property","content":"All content on this website, including images, text, and design elements, is the property of Fiesta Agency unless otherwise stated. Event photographs may be used for portfolio and marketing purposes unless you request otherwise in writing."},{"heading":"5. Limitation of Liability","content":"Fiesta Agency shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question."},{"heading":"6. Governing Law","content":"These terms are governed by the laws of Rwanda. Any disputes shall be resolved through good-faith negotiation before pursuing formal legal action."},{"heading":"7. Contact","content":"For questions about these terms, please contact us at: info@fiestaagency.com"}]}'::jsonb, 0, true);
  END IF;

  -- ═══════════════════════════════════════════
  -- EVENTS PAGE: Add section metadata
  -- ═══════════════════════════════════════════
  SELECT id INTO events_id FROM pages WHERE slug = 'events';

  IF events_id IS NOT NULL THEN
    -- Events Featured
    SELECT count(*) INTO existing_count FROM sections WHERE page_id = events_id AND section_type = 'events-featured';
    IF existing_count = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (events_id, 'Featured Event', 'events-featured', '{"eyebrow":"FEATURED EVENT","heading":"","description":""}'::jsonb, 1, true);
    END IF;

    -- Events Filter
    SELECT count(*) INTO existing_count FROM sections WHERE page_id = events_id AND section_type = 'events-filter';
    IF existing_count = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (events_id, 'Event Filter', 'events-filter', '{"eyebrow":"","categories":["ALL","CORPORATE","PRIVATE","WEDDINGS","CONCERTS","FESTIVALS"]}'::jsonb, 2, true);
    END IF;

    -- Events Upcoming
    SELECT count(*) INTO existing_count FROM sections WHERE page_id = events_id AND section_type = 'events-upcoming';
    IF existing_count = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (events_id, 'Upcoming Events', 'events-upcoming', '{"eyebrow":"UPCOMING EVENTS","heading":"WHAT S COMING UP","description":""}'::jsonb, 3, true);
    END IF;

    -- Events Past
    SELECT count(*) INTO existing_count FROM sections WHERE page_id = events_id AND section_type = 'events-past';
    IF existing_count = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (events_id, 'Past Events', 'events-past', '{"eyebrow":"PAST EVENTS","heading":"MOMENTS WE VE CREATED","description":""}'::jsonb, 4, true);
    END IF;
  END IF;

  -- ═══════════════════════════════════════════
  -- PORTFOLIO PAGE: Add section metadata
  -- ═══════════════════════════════════════════
  SELECT id INTO portfolio_id FROM pages WHERE slug = 'portfolio';

  IF portfolio_id IS NOT NULL THEN
    -- Portfolio Filter
    SELECT count(*) INTO existing_count FROM sections WHERE page_id = portfolio_id AND section_type = 'portfolio-filtered-gallery';
    IF existing_count = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (portfolio_id, 'Portfolio Filter', 'portfolio-filtered-gallery', '{"eyebrow":"","categories":["ALL","CORPORATE","PRIVATE","WEDDINGS","CONCERTS","FESTIVALS"]}'::jsonb, 1, true);
    END IF;

    -- Portfolio Featured
    SELECT count(*) INTO existing_count FROM sections WHERE page_id = portfolio_id AND section_type = 'portfolio-featured';
    IF existing_count = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (portfolio_id, 'Featured Project', 'portfolio-featured', '{"eyebrow":"FEATURED PROJECT","heading":"","description":"","button_text":"View Project","button_url":""}'::jsonb, 3, true);
    END IF;
  END IF;

END $$;

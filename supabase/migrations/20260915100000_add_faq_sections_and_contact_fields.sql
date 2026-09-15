-- Phase 36.1: Add FAQ sections to Services, Events, and Contact pages
-- Also adds contact-info email/phone/address fields to section content

DO $$
DECLARE
  services_id UUID;
  events_id UUID;
  contact_id UUID;
  existing_faq INTEGER;
BEGIN

  -- ═══════════════════════════════════════════
  -- SERVICES PAGE: Add FAQ section
  -- ═══════════════════════════════════════════
  SELECT id INTO services_id FROM pages WHERE slug = 'services';
  IF services_id IS NOT NULL THEN
    SELECT count(*) INTO existing_faq FROM sections WHERE page_id = services_id AND section_type = 'faq';
    IF existing_faq = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (services_id, 'Services FAQ', 'faq', '{"heading":"FREQUENTLY ASKED QUESTIONS","description":"Everything you need to know about working with us.","items":[{"id":"f1","question":"How far in advance should I book?","answer":"We recommend booking 3-6 months in advance for large events like weddings and galas. For smaller events, 4-8 weeks is usually sufficient. Peak season (June-August, December) fills up quickly, so earlier is always better."},{"id":"f2","question":"Do you handle events outside Rwanda?","answer":"Yes! While we''re based in Rwanda, we''ve produced events across East Africa and beyond. We have a network of trusted vendors and production partners in multiple countries."},{"id":"f3","question":"What''s included in your event planning service?","answer":"Our full-service planning includes concept development, venue sourcing, vendor coordination, budget management, timeline creation, day-of coordination, and post-event review. We tailor the scope to your specific needs."},{"id":"f4","question":"Can I hire you for just one aspect of my event?","answer":"Absolutely. While we love full-service projects, we also offer standalone services like decoration, sound/lighting, photography, and MC coordination. Let us know what you need."},{"id":"f5","question":"How do you handle dietary restrictions and special requests?","answer":"We work closely with caterers and vendors to accommodate all dietary needs, accessibility requirements, and special requests. We discuss these details during the planning phase to ensure nothing is overlooked."}]}'::jsonb, 9, true);
    END IF;
  END IF;

  -- ═══════════════════════════════════════════
  -- EVENTS PAGE: Add FAQ section
  -- ═══════════════════════════════════════════
  SELECT id INTO events_id FROM pages WHERE slug = 'events';
  IF events_id IS NOT NULL THEN
    SELECT count(*) INTO existing_faq FROM sections WHERE page_id = events_id AND section_type = 'faq';
    IF existing_faq = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (events_id, 'Events FAQ', 'faq', '{"heading":"EVENT QUESTIONS","description":"Answers to common questions about our events.","items":[{"id":"f1","question":"How can I get tickets for upcoming events?","answer":"Tickets for our events are available through our website and authorized ticketing partners. Check the event page for direct booking links and early-bird offers."},{"id":"f2","question":"Can I book Fiesta for my own event?","answer":"Yes! We produce events for private clients, corporations, and organizations. Visit our Contact page or click Book Your Event to start a conversation about your vision."},{"id":"f3","question":"Do you offer event sponsorship opportunities?","answer":"We partner with brands and sponsors for select events. If you''re interested in sponsoring an upcoming event, please reach out to our partnerships team through the Contact page."},{"id":"f4","question":"Where are your events held?","answer":"We produce events at venues across Rwanda and East Africa. Each event is carefully matched with the perfect venue based on scale, style, and audience."},{"id":"f5","question":"Can I see photos or videos from past events?","answer":"Absolutely! Our Portfolio and individual event pages showcase highlights from our past productions. Follow us on social media for real-time updates and behind-the-scenes content."}]}'::jsonb, 9, true);
    END IF;
  END IF;

  -- ═══════════════════════════════════════════
  -- CONTACT PAGE: Add FAQ section
  -- ═══════════════════════════════════════════
  SELECT id INTO contact_id FROM pages WHERE slug = 'contact';
  IF contact_id IS NOT NULL THEN
    SELECT count(*) INTO existing_faq FROM sections WHERE page_id = contact_id AND section_type = 'faq';
    IF existing_faq = 0 THEN
      INSERT INTO sections (page_id, title, section_type, content, sort_order, published) VALUES
      (contact_id, 'Contact FAQ', 'faq', '{"heading":"COMMON QUESTIONS","description":"Quick answers before you reach out.","items":[{"id":"f1","question":"How quickly will I get a response?","answer":"We typically respond within 24 hours during business days. For urgent inquiries, call us directly at the phone number listed above."},{"id":"f2","question":"What information should I include in my inquiry?","answer":"The more details the better! Include your preferred date, event type, expected guest count, venue preferences, and any specific ideas or requirements you have in mind."},{"id":"f3","question":"Do you offer free consultations?","answer":"Yes, we offer a complimentary initial consultation to discuss your event vision, requirements, and how we can help bring it to life. This can be in-person or virtual."},{"id":"f4","question":"What areas do you serve?","answer":"We are based in Rwanda with operations across East Africa. We''ve produced events in Kigali, across Rwanda, and in neighboring countries. International events are also available upon request."}]}'::jsonb, 9, true);
    END IF;
  END IF;

  -- ═══════════════════════════════════════════
  -- CONTACT PAGE: Update contact-info section with email/phone/address
  -- ═══════════════════════════════════════════
  IF contact_id IS NOT NULL THEN
    UPDATE sections
    SET content = content || '{"email":"hello@fiestaagency.example","phone":"+1 (555) 000-0000","address":"Design Studio, Lagos · London · Dubai"}'::jsonb
    WHERE page_id = contact_id AND section_type = 'contact-info';
  END IF;

END $$;

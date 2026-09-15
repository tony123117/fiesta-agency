import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import type { Section } from '@/lib/types';
import { LegalPageRenderer } from '@/components/public/LegalPageRenderer';

const FALLBACK_CONTENT = {
  eyebrow: 'Legal',
  heading: 'TERMS & CONDITIONS',
  sections: [
    { heading: '1. Services', content: 'Fiesta Agency provides event planning, entertainment, and production services. All services are subject to availability and mutual agreement on scope, timeline, and pricing as outlined in individual service agreements.' },
    { heading: '2. Booking & Payments', content: 'A deposit is required to confirm your booking. Remaining balances are due according to the payment schedule specified in your service agreement. Late payments may result in service delays or cancellation.' },
    { heading: '3. Cancellation Policy', content: 'Cancellations made more than 30 days before the event date may receive a partial refund of the deposit. Cancellations within 30 days of the event are non-refundable. Rescheduling is subject to availability.' },
    { heading: '4. Intellectual Property', content: 'All content on this website, including images, text, and design elements, is the property of Fiesta Agency unless otherwise stated. Event photographs may be used for portfolio and marketing purposes unless you request otherwise in writing.' },
    { heading: '5. Limitation of Liability', content: 'Fiesta Agency shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.' },
    { heading: '6. Governing Law', content: 'These terms are governed by the laws of Rwanda. Any disputes shall be resolved through good-faith negotiation before pursuing formal legal action.' },
    { heading: '7. Contact', content: 'For questions about these terms, please contact us at: info@fiestaagency.com' },
  ],
};

export function Terms() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loaded, setLoaded] = useState(false);

  useDocumentMeta({
    title: 'Terms & Conditions | Fiesta Agency',
    description: 'Fiesta Agency terms and conditions. Read about the rules governing use of our services and website.',
    canonicalPath: '/terms',
  });

  useEffect(() => {
    (async () => {
      try {
        const page = await getPageBySlug('terms');
        if (!page) { setLoaded(true); return; }
        const secs = await getSections(page.id);
        setSections(secs.filter((s: Section) => s.published));
      } catch { /* silent */ }
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return null;

  const get = (type: string) => sections.find(s => s.section_type === type)?.content || {};

  const legalContent = get('legal-page');
  const hasSections = legalContent && (legalContent as Record<string, unknown>).sections;

  return (
    <>
      <LegalPageRenderer content={hasSections ? legalContent : FALLBACK_CONTENT} />
      <div style={{ backgroundColor: '#090909', paddingBottom: '40px' }}>
        <div className="max-w-3xl mx-auto px-5 md:px-[4vw]">
          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              to="/"
              className="inline-flex items-center gap-3 font-sans hover:text-ivory transition-colors duration-300"
              style={{ fontSize: 'clamp(0.75rem, 0.85vw, 0.85rem)', letterSpacing: '0.15em', color: '#D6A54A' }}
            >
              BACK TO HOME
              <ArrowRight className="w-4 h-4 stroke-2" size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Terms;

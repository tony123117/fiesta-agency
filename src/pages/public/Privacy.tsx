import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useDocumentMeta } from '@/lib/useDocumentMeta';
import { getPageBySlug } from '@/lib/pagesService';
import { getSections } from '@/lib/sectionsService';
import type { Section } from '@/lib/types';
import { LegalPageRenderer } from '@/components/public/LegalPageRenderer';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const FALLBACK_CONTENT = {
  eyebrow: 'Legal',
  heading: 'PRIVACY POLICY',
  sections: [
    { heading: '1. Information We Collect', content: 'When you contact us through our website forms, we collect your name, email address, phone number, and any information you provide in your message. This includes event details and preferences you share with us.' },
    { heading: '2. How We Use Your Information', content: 'We use your information to respond to your inquiries, provide event planning services, and communicate about your projects. We do not sell or share your personal information with third parties for marketing purposes.' },
    { heading: '3. Data Protection', content: 'We implement appropriate security measures to protect your personal information. Your data is stored securely and accessed only by authorized team members who need it to provide our services.' },
    { heading: '4. Cookies', content: 'Our website uses essential cookies to ensure proper functionality. We do not use tracking cookies or third-party analytics that collect personal data.' },
    { heading: '5. Your Rights', content: 'You have the right to request access to your personal data, request corrections, or ask us to delete your information. To exercise these rights, please contact us at the email address below.' },
    { heading: '6. Contact Us', content: 'For questions about this privacy policy or your personal data, contact us at: info@fiestaagency.com' },
  ],
};

export function Privacy() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loaded, setLoaded] = useState(false);

  useDocumentMeta({
    title: 'Privacy Policy | Fiesta Agency',
    description: 'Fiesta Agency privacy policy. Learn how we collect, use, and protect your personal information.',
  });

  useEffect(() => {
    (async () => {
      try {
        const page = await getPageBySlug('privacy');
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

export default Privacy;

import { Hero } from '@/components/public/Hero';
import { BrandStatement } from '@/components/public/BrandStatement';
import { ServiceSection } from '@/components/public/ServiceSection';
import { FeaturedEvents } from '@/components/public/FeaturedEvents';
import { PortfolioGrid } from '@/components/public/PortfolioGrid';
import { ProcessSection } from '@/components/public/ProcessSection';
import { TestimonialSection } from '@/components/public/TestimonialSection';
import { FAQSection } from '@/components/public/FAQSection';
import { CTASection } from '@/components/public/CTASection';
import { Reveal } from '@/components/Reveal';
import { useHomeData } from '@/lib/usePublicData';
import { useDocumentMeta } from '@/lib/useDocumentMeta';

export function Home() {
  const { services, events, portfolio, testimonials, faqs, loading } = useHomeData();
  useDocumentMeta({
    title: 'Fiesta Agency — Unforgettable Events & Experiences',
    description: 'Fiesta designs, produces and manages unforgettable weddings, celebrations, corporate events and premium experiences.',
  });

  if (loading) return <HomeSkeleton />;

  return (
    <>
      <Hero />
      <BrandStatement />
      <ServiceSection services={services} />
      <FeaturedEvents events={events} />
      <section className="py-24 md:py-32 bg-charcoal">
        <div className="container-lux">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
              <div>
                <span className="label-gold mb-4 block">The Work</span>
                <h2 className="font-serif text-section font-light text-ivory">
                  A collection of moments.
                </h2>
              </div>
              <p className="text-ivory-muted max-w-md leading-relaxed">
                A collection of moments, spaces and experiences designed by Fiesta.
              </p>
            </div>
          </Reveal>
          <PortfolioGrid projects={portfolio} limit={5} />
        </div>
      </section>
      <ProcessSection />
      <TestimonialSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <CTASection />
    </>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-obsidian">
      <div className="h-screen skeleton" />
    </div>
  );
}

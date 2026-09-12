import type {
  HeroCarouselContent,
  BrandStatementContent,
  ServicesEditorialContent,
  EventsEditorialContent,
  PortfolioGalleryContent,
  TestimonialsContent,
  FAQContent,
  StatsContent,
  ProcessContent,
  TextImageContent,
  CTAContent,
  EditorialListContent,
  CinematicImageContent,
  TeamMembersContent,
  ImageCarouselContent,
} from '@/lib/types';

const DEMO_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  heroMobile: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  event1: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  event2: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
  event3: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  service1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  service2: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80',
  service3: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
  portfolio1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  portfolio2: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  portfolio3: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  portfolio4: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80',
  textImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  cta: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
  process: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
};

export const DEMO_HERO: HeroCarouselContent = {
  slides: [
    {
      id: 'demo-1',
      image: DEMO_IMAGES.hero,
      mobile_image: DEMO_IMAGES.heroMobile,
      image_alt: 'Elegant event venue with ambient lighting and floral arrangements',
      eyebrow: 'Premium Event Management',
      headline: 'Creating Unforgettable Moments',
      highlight_word: '',
      description: 'From concept to execution, we craft extraordinary experiences that leave lasting impressions.',
      cta_text: 'Explore Our Work',
      cta_url: '/portfolio',
      secondary_cta_text: 'Plan Your Event',
      secondary_cta_url: '/contact',
      focal_x: 0.5,
      focal_y: 0.4,
    },
    {
      id: 'demo-2',
      image: DEMO_IMAGES.event2,
      mobile_image: null,
      image_alt: 'Luxury celebration event with sophisticated decor',
      eyebrow: 'Luxury Celebrations',
      headline: 'Where Vision Meets Precision',
      highlight_word: '',
      description: 'Every detail meticulously curated to reflect your unique story.',
      cta_text: 'Our Services',
      cta_url: '/services',
      secondary_cta_text: '',
      secondary_cta_url: '',
      focal_x: 0.5,
      focal_y: 0.5,
    },
  ],
};

export const DEMO_BRAND_STATEMENT: BrandStatementContent = {
  eyebrow: 'Who We Are',
  primary_text: 'We design experiences that move people.',
  highlighted_text: 'Extraordinary events, crafted with precision.',
  description: 'Fiesta Agency is a premium event management company specializing in luxury weddings, corporate experiences, and large-scale productions across East Africa and beyond.',
  metadata: 'Based in Kigali — Operating Worldwide',
  accent_word: 'Fiesta',
  variant: 'default',
};

export const DEMO_SERVICES: ServicesEditorialContent = {
  heading: 'What We Do',
  description: 'Comprehensive event solutions tailored to your vision.',
  variant: 'default',
  services: [
    { id: 's1', title: 'Luxury Weddings', slug: 'weddings', description: 'Bespoke wedding experiences that reflect your unique love story, from intimate ceremonies to grand celebrations.', image_url: DEMO_IMAGES.service1, image_alt: 'Luxury wedding setup', featured: true },
    { id: 's2', title: 'Corporate Events', slug: 'corporate', description: 'Professional event management for conferences, product launches, and corporate gatherings that make an impact.', image_url: DEMO_IMAGES.service2, image_alt: 'Corporate event', featured: false },
    { id: 's3', title: 'Event Production', slug: 'production', description: 'Full-scale production services including lighting, sound, staging, and technical coordination.', image_url: DEMO_IMAGES.service3, image_alt: 'Event production', featured: false },
  ],
};

export const DEMO_EVENTS: EventsEditorialContent = {
  heading: 'Upcoming Events',
  description: 'Discover our latest events and experiences.',
  limit: 3,
  featured_only: false,
  upcoming_only: false,
  variant: 'default',
};

export const DEMO_PORTFOLIO: PortfolioGalleryContent = {
  heading: 'Featured Work',
  description: 'A selection of our finest event productions.',
  variant: 'grid',
  items: [
    { id: 'p1', image: DEMO_IMAGES.portfolio1, title: 'Gala Dinner', category: 'Corporate' },
    { id: 'p2', image: DEMO_IMAGES.portfolio2, title: 'Garden Wedding', category: 'Wedding' },
    { id: 'p3', image: DEMO_IMAGES.portfolio3, title: 'Music Festival', category: 'Production' },
    { id: 'p4', image: DEMO_IMAGES.portfolio4, title: 'Anniversary Gala', category: 'Celebration' },
  ],
};

export const DEMO_TESTIMONIALS: TestimonialsContent = {
  heading: 'What Our Clients Say',
  description: 'Real experiences from real clients.',
  variant: 'default',
  testimonials: [
    { id: 't1', quote: 'Fiesta Agency transformed our wedding into a fairytale. Every detail was perfect, from the flowers to the last dance.', client_name: 'Sarah & James', event_type: 'Wedding', location: 'Kigali', image_url: null },
    { id: 't2', quote: 'Professional, creative, and incredibly attentive. Our corporate gala exceeded all expectations.', client_name: 'Michael Chen', event_type: 'Corporate Gala', location: 'Nairobi', image_url: null },
  ],
};

export const DEMO_FAQ: FAQContent = {
  heading: 'Frequently Asked Questions',
  description: 'Everything you need to know about working with us.',
  items: [
    { id: 'f1', question: 'How far in advance should I book?', answer: 'We recommend booking 6-12 months in advance for weddings and 3-6 months for corporate events. Peak season dates fill quickly.' },
    { id: 'f2', question: 'Do you work with international clients?', answer: 'Absolutely. We manage events across East Africa and have coordinated destination events worldwide.' },
    { id: 'f3', question: 'What is included in your event planning service?', answer: 'Our full-service planning includes venue selection, vendor coordination, design, logistics, day-of management, and post-event support.' },
    { id: 'f4', question: 'Can I customize a package?', answer: 'Every event is unique. We tailor our services to match your vision, budget, and specific requirements.' },
  ],
};

export const DEMO_STATS: StatsContent = {
  heading: 'By the Numbers',
  variant: 'default',
  stats: [
    { id: 'st1', number: '500+', label: 'Events Produced' },
    { id: 'st2', number: '12', label: 'Years of Excellence' },
    { id: 'st3', number: '15K+', label: 'Guests Served' },
    { id: 'st4', number: '98%', label: 'Client Satisfaction' },
  ],
};

export const DEMO_PROCESS: ProcessContent = {
  heading: 'How We Work',
  description: 'A proven process that ensures every event is flawless.',
  steps: [
    { id: 'pr1', number: '01', title: 'Discovery', description: 'We learn about your vision, goals, and preferences through an in-depth consultation.', image: DEMO_IMAGES.process },
    { id: 'pr2', number: '02', title: 'Design', description: 'Our team creates a comprehensive event concept with detailed planning and mood boards.', image: DEMO_IMAGES.process },
    { id: 'pr3', number: '03', title: 'Deliver', description: 'We execute every detail with precision, ensuring a seamless and memorable experience.', image: DEMO_IMAGES.process },
  ],
};

export const DEMO_TEXT_IMAGE: TextImageContent = {
  eyebrow: 'Our Story',
  heading: 'Crafting Moments Since 2014',
  body: 'What began as a passion for creating beautiful gatherings has grown into one of East Africa\'s most trusted event agencies. We believe every event should tell a story.',
  image: DEMO_IMAGES.textImage,
  image_alt: 'Our team at work',
  image_position: 'right',
  cta_text: 'Read More',
  cta_url: '/about',
  variant: 'default',
};

export const DEMO_CTA: CTAContent = {
  eyebrow: 'Ready to Start?',
  heading: "Let's Create Something Extraordinary",
  description: 'From intimate celebrations to large-scale productions, we bring creative direction, planning and execution together under one roof.',
  button_text: 'Plan Your Event',
  button_url: '/contact',
  secondary_button_text: 'View Our Work',
  secondary_button_url: '/portfolio',
  background_image: DEMO_IMAGES.cta,
  variant: 'default',
};

export const DEMO_EDITORIAL_LIST: EditorialListContent = {
  heading: 'Our Values',
  description: 'The principles that guide everything we do.',
  items: [
    { id: 'el1', number: '01', title: 'CREATIVITY', description: 'Every event starts with an idea worth bringing to life.' },
    { id: 'el2', number: '02', title: 'PRECISION', description: 'Great experiences depend on details being handled before they become problems.' },
    { id: 'el3', number: '03', title: 'PEOPLE', description: 'The right people turn planning into an experience.' },
  ],
};

export const DEMO_CINEMATIC_IMAGE: CinematicImageContent = {
  image: DEMO_IMAGES.hero,
  mobile_image: DEMO_IMAGES.heroMobile,
  image_alt: 'Cinematic event moment',
  focal_x: 0.5,
  focal_y: 0.4,
  caption: 'MOMENTS, CAREFULLY CONSIDERED.',
  caption_alignment: 'left',
};

export const DEMO_TEAM_MEMBERS: TeamMembersContent = {
  heading: 'The Team Behind the Moments',
  members: [
    { id: 'tm1', name: 'Claire Uwimana', role: 'CREATIVE DIRECTOR', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80', bio: 'Leading creative vision and artistic direction.' },
    { id: 'tm2', name: 'Jean-Pierre Niyonzima', role: 'EVENT PLANNER', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80', bio: 'Orchestrating logistics with precision.' },
  ],
};

export const DEMO_IMAGE_CAROUSEL: ImageCarouselContent = {
  heading: 'The Work',
  description: 'See what these services look like in motion.',
  images: [
    { id: 'ic1', src: DEMO_IMAGES.portfolio1, alt: 'Event moment' },
    { id: 'ic2', src: DEMO_IMAGES.portfolio2, alt: 'Celebration' },
    { id: 'ic3', src: DEMO_IMAGES.portfolio3, alt: 'Production' },
  ],
};

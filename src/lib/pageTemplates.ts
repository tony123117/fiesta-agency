import type { SectionType, SectionContentMap } from '@/lib/types';

export interface TemplateSectionDefinition {
  type: SectionType;
  title: string;
  variant?: string;
  content: SectionContentMap[SectionType];
}

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  recommendedFor: string;
  sectionCount: number;
  icon: string;
  pageDefaults: {
    title: string;
    slug: string;
    description: string;
  };
  sections: TemplateSectionDefinition[];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  // ── HOME ──
  {
    id: 'home',
    name: 'Home',
    description: 'Full homepage with hero, services, events, and social proof.',
    recommendedFor: 'Main landing page',
    sectionCount: 8,
    icon: 'Home',
    pageDefaults: {
      title: 'Home',
      slug: 'home',
      description: 'The homepage experience.',
    },
    sections: [
      {
        type: 'hero-carousel',
        title: 'Hero',
        content: {
          slides: [{
            id: uid(), image: '', mobile_image: null, image_alt: '',
            eyebrow: 'Welcome to Fiesta',
            headline: 'Your Headline Goes Here',
            highlight_word: '',
            description: 'A brief description of your brand or event.',
            cta_text: 'Get Started', cta_url: '/contact',
            secondary_cta_text: 'View Our Work', secondary_cta_url: '/portfolio',
            focal_x: 0.5, focal_y: 0.5,
          }],
        },
      },
      {
        type: 'brand-statement',
        title: 'Brand Statement',
        content: {
          eyebrow: 'Who We Are',
          primary_text: 'Your primary statement goes here.',
          highlighted_text: '',
          description: 'A brief description of your agency and what you do.',
          metadata: '',
          accent_word: '',
          variant: 'default',
        },
      },
      {
        type: 'services-editorial',
        title: 'Services',
        content: { heading: 'Our Services', description: '', services: [], variant: 'default' },
      },
      {
        type: 'events-editorial',
        title: 'Events',
        content: { heading: 'Featured Events', description: '', limit: 3, featured_only: false, upcoming_only: false, variant: 'default' },
      },
      {
        type: 'portfolio-gallery',
        title: 'Portfolio',
        content: { heading: 'Our Work', description: '', items: [], variant: 'grid' },
      },
      {
        type: 'stats',
        title: 'Stats',
        content: { heading: '', stats: [], variant: 'default' },
      },
      {
        type: 'testimonials',
        title: 'Testimonials',
        content: { heading: 'What Our Clients Say', description: '', testimonials: [], variant: 'default' },
      },
      {
        type: 'cta',
        title: 'Call to Action',
        content: {
          eyebrow: 'Ready to Start?',
          heading: 'Let\'s Create Something Together',
          description: '',
          button_text: 'Plan Your Event', button_url: '/plan-your-event',
          secondary_button_text: '', secondary_button_url: '',
          background_image: '', variant: 'default',
        },
      },
    ],
  },

  // ── EVENT LANDING ──
  {
    id: 'event-landing',
    name: 'Event Landing',
    description: 'Promote a single event with hero, details, and registration.',
    recommendedFor: 'Individual event promotion',
    sectionCount: 6,
    icon: 'Calendar',
    pageDefaults: {
      title: 'Event Name',
      slug: 'event-name',
      description: 'Event details and registration.',
    },
    sections: [
      {
        type: 'hero-carousel',
        title: 'Event Hero',
        content: {
          slides: [{
            id: uid(), image: '', mobile_image: null, image_alt: '',
            eyebrow: 'Upcoming Event',
            headline: 'Event Name Goes Here',
            description: 'Event date, location, and a brief tagline.',
            cta_text: 'Register Now', cta_url: '#register',
            secondary_cta_text: 'Learn More', secondary_cta_url: '#about',
            focal_x: 0.5, focal_y: 0.5,
          }],
        },
      },
      {
        type: 'text-image',
        title: 'Event Information',
        content: {
          eyebrow: 'About the Event',
          heading: 'Event Details',
          body: 'Describe the event, its purpose, and what attendees can expect.',
          image: '', image_alt: '', image_position: 'right',
          cta_text: '', cta_url: '', variant: 'default',
        },
      },
      {
        type: 'events-editorial',
        title: 'Lineup',
        content: { heading: 'What\'s Happening', description: '', limit: 6, featured_only: false, upcoming_only: false, variant: 'default' },
      },
      {
        type: 'portfolio-gallery',
        title: 'Gallery',
        content: { heading: 'Past Events', description: '', items: [], variant: 'masonry' },
      },
      {
        type: 'testimonials',
        title: 'Attendee Feedback',
        content: { heading: 'What People Say', description: '', testimonials: [], variant: 'carousel' },
      },
      {
        type: 'cta',
        title: 'Registration CTA',
        content: {
          eyebrow: 'Don\'t Miss Out',
          heading: 'Secure Your Spot',
          description: 'Register now to guarantee your place at this event.',
          button_text: 'Register Now', button_url: '#register',
          secondary_button_text: '', secondary_button_url: '',
          background_image: '', variant: 'default',
        },
      },
    ],
  },

  // ── SERVICES ──
  {
    id: 'services',
    name: 'Services',
    description: 'Showcase your service offerings with process and social proof.',
    recommendedFor: 'Service overview page',
    sectionCount: 7,
    icon: 'Briefcase',
    pageDefaults: {
      title: 'Services',
      slug: 'services',
      description: 'Our service offerings.',
    },
    sections: [
      {
        type: 'services-hero',
        title: 'Hero',
        content: {
          eyebrow: 'OUR SERVICES',
          heading: "EVERY DETAIL\nCRAFTED TO\nPERFECTION.",
          description: "From concept to execution, we offer end-to-end event solutions tailored to your vision. Whatever the occasion, we make it extraordinary.",
        },
      },
      {
        type: 'services-featured',
        title: 'Featured Services',
        content: {
          eyebrow: 'WHAT WE DO',
          heading: "EVENTS\nCRAFTED WITH\nINTENTION.",
          services: [],
        },
      },
      {
        type: 'services-directory',
        title: 'Service Directory',
        content: { heading: '', services: [] },
      },
      {
        type: 'services-philosophy',
        title: 'Service Philosophy',
        content: {
          eyebrow: 'THE FIESTA STANDARD',
          heading: "EVERY EVENT\nDESERVES ITS\nOWN STORY.",
          body: "We don't believe in copying the same event twice.\n\nA wedding should feel like the people getting married.\nA concert should feel like the artist performing.\nA corporate gathering should feel like the brand behind it.\n\nOur role is to understand the idea first, then build everything around it.",
        },
      },
      {
        type: 'services-process',
        title: 'Process',
        content: { heading: '', steps: [] },
      },
      {
        type: 'services-image-statement',
        title: 'Image Statement',
        content: { heading: "WE TAKE CARE\nOF THE DETAILS.", description: '', image: '' },
      },
      {
        type: 'services-cta',
        title: 'Final CTA',
        content: {
          heading: "TELL US WHAT\nYOU'RE IMAGINING.",
          button_text: 'GET IN TOUCH',
          button_url: '/contact',
          background_image: '',
        },
      },
    ],
  },

  // ── PORTFOLIO ──
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Display your creative work with a visual gallery.',
    recommendedFor: 'Work showcase page',
    sectionCount: 5,
    icon: 'LayoutGrid',
    pageDefaults: {
      title: 'Portfolio',
      slug: 'portfolio',
      description: 'Our creative work.',
    },
    sections: [
      {
        type: 'hero-carousel',
        title: 'Hero',
        content: {
          slides: [{
            id: uid(), image: '', mobile_image: null, image_alt: '',
            eyebrow: 'Our Work',
            headline: 'Portfolio',
            description: 'A curated collection of our projects and creative work.',
            cta_text: 'Start a Project', cta_url: '/contact',
            secondary_cta_text: '', secondary_cta_url: '',
            focal_x: 0.5, focal_y: 0.5,
          }],
        },
      },
      {
        type: 'portfolio-gallery',
        title: 'Portfolio Gallery',
        content: { heading: 'Selected Works', description: '', items: [], variant: 'grid' },
      },
      {
        type: 'stats',
        title: 'Stats',
        content: { heading: 'By the Numbers', stats: [], variant: 'default' },
      },
      {
        type: 'testimonials',
        title: 'Client Feedback',
        content: { heading: 'What Clients Say', description: '', testimonials: [], variant: 'default' },
      },
      {
        type: 'cta',
        title: 'Call to Action',
        content: {
          eyebrow: 'Impressed?',
          heading: 'Let\'s Work Together',
          description: '',
          button_text: 'Start a Project', button_url: '/contact',
          secondary_button_text: '', secondary_button_url: '',
          background_image: '', variant: 'default',
        },
      },
    ],
  },

  // ── ABOUT ──
  {
    id: 'about',
    name: 'About',
    description: 'Premium editorial About page with cinematic intro, story, foundation, values, why, and closing CTA.',
    recommendedFor: 'Company about page',
    sectionCount: 6,
    icon: 'Users',
    pageDefaults: {
      title: 'About',
      slug: 'about',
      description: 'Learn about Fiesta — a creative event agency turning ideas into memorable experiences.',
    },
    sections: [
      {
        type: 'about-intro',
        title: 'About Intro',
        content: {
          eyebrow: 'ABOUT FIESTA',
          heading: "WE DON'T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES.",
          body: 'Fiesta Agency is a creative event company focused on producing unforgettable weddings, concerts, corporate experiences and private celebrations across Rwanda.',
          image: '',
          image_alt: '',
          image2: '',
          image2_alt: '',
        },
      },
      {
        type: 'about-story',
        title: 'Our Story',
        content: {
          eyebrow: 'OUR STORY',
          heading: "FROM A SINGLE IDEA\nTO A REGIONAL\nLEADER.",
          paragraphs: [
            "Fiesta started with a simple belief: every gathering deserves to feel extraordinary. What began as a small event coordination effort has grown into one of Rwanda's most trusted creative event agencies.",
            "We've produced weddings that make people cry, concerts that make people dance until sunrise, and corporate events that inspire entire organizations. Our work speaks for itself — and our clients come back because they trust us to deliver.",
          ],
          image: '',
          image_alt: '',
        },
      },
      {
        type: 'about-mission',
        title: 'Mission & Vision',
        content: {
          mission_heading: 'TURN IDEAS INTO\nWELL-CRAFTED\nEXPERIENCES.',
          mission_body: 'We combine creativity, entertainment, production and precision to transform your vision into an event that resonates with every guest.',
          vision_heading: 'BUILDING A TRUSTED\nCREATIVE EVENT\nCOMPANY.',
          vision_body: 'Creating experiences people remember. Growing across the region. Becoming the name people think of when they imagine an extraordinary event.',
        },
      },
      {
        type: 'about-values',
        title: 'Our Values',
        content: {
          eyebrow: 'OUR VALUES',
          heading: 'THE PRINCIPLES\nBEHIND OUR WORK.',
          values: [
            { id: '1', num: '01', title: 'CREATIVITY', text: 'Every event is a blank canvas. We bring fresh thinking and original ideas to every project.' },
            { id: '2', num: '02', title: 'EXCELLENCE', text: "We don't settle for average. Every detail is refined until it reaches our highest standard." },
            { id: '3', num: '03', title: 'INTEGRITY', text: 'Transparent communication, honest pricing, and genuine care for every client relationship.' },
            { id: '4', num: '04', title: 'PASSION', text: 'We love what we do. That energy translates into events that feel alive and memorable.' },
          ],
        },
      },
      {
        type: 'about-team',
        title: 'The Team',
        content: {
          eyebrow: 'THE TEAM',
          heading: 'THE PEOPLE BEHIND\nTHE MAGIC.',
          members: [
            { id: '1', name: 'Jean-Paul Habimana', role: 'Founder & Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
            { id: '2', name: 'Alice Uwimana', role: 'Head of Production', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
            { id: '3', name: 'David Niyonzima', role: 'Event Coordinator', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
            { id: '4', name: 'Grace Mukamana', role: 'Design Lead', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
            { id: '5', name: 'Samuel Bizimana', role: 'Technical Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
          ],
        },
      },
      {
        type: 'about-closing',
        title: 'Closing CTA',
        content: {
          heading: 'READY TO CREATE\nSOMETHING EXTRAORDINARY?',
          cta_text: 'GET IN TOUCH',
          cta_url: '/contact',
          background_image: '',
          background_image_alt: '',
        },
      },
    ],
  },

  // ── CONTACT ──
  {
    id: 'contact',
    name: 'Contact',
    description: 'Contact page with form, FAQ, and location details.',
    recommendedFor: 'Contact and inquiry page',
    sectionCount: 5,
    icon: 'Mail',
    pageDefaults: {
      title: 'Contact',
      slug: 'contact',
      description: 'Get in touch.',
    },
    sections: [
      {
        type: 'hero-carousel',
        title: 'Hero',
        content: {
          slides: [{
            id: uid(), image: '', mobile_image: null, image_alt: '',
            eyebrow: 'Get in Touch',
            headline: 'Contact Us',
            description: 'We\'d love to hear from you.',
            cta_text: '', cta_url: '',
            secondary_cta_text: '', secondary_cta_url: '',
            focal_x: 0.5, focal_y: 0.5,
          }],
        },
      },
      {
        type: 'text-image',
        title: 'Contact Information',
        content: {
          eyebrow: 'Reach Out',
          heading: 'Contact Details',
          body: 'Email, phone, and office location details.',
          image: '', image_alt: '', image_position: 'left',
          cta_text: '', cta_url: '', variant: 'default',
        },
      },
      {
        type: 'faq',
        title: 'FAQ',
        content: { heading: 'Frequently Asked Questions', description: '', items: [] },
      },
      {
        type: 'text-image',
        title: 'Location',
        content: {
          eyebrow: 'Find Us',
          heading: 'Our Location',
          body: 'Office address and directions.',
          image: '', image_alt: '', image_position: 'right',
          cta_text: '', cta_url: '', variant: 'default',
        },
      },
      {
        type: 'cta',
        title: 'Call to Action',
        content: {
          eyebrow: 'Ready to Plan?',
          heading: 'Let\'s Start Your Event',
          description: '',
          button_text: 'Plan Your Event', button_url: '/plan-your-event',
          secondary_button_text: '', secondary_button_url: '',
          background_image: '', variant: 'default',
        },
      },
    ],
  },

  // ── BLANK ──
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from scratch with no predefined sections.',
    recommendedFor: 'Custom page layouts',
    sectionCount: 0,
    icon: 'FileText',
    pageDefaults: {
      title: 'New Page',
      slug: 'new-page',
      description: '',
    },
    sections: [],
  },
];

export function getTemplateById(id: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatePreviewSections(template: PageTemplate): TemplateSectionDefinition[] {
  return template.sections;
}

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
        title: 'About Introduction',
        content: {
          eyebrow: 'ABOUT FIESTA',
          heading: "WE DON'T JUST\nPLAN EVENTS.\nWE CREATE\nEXPERIENCES THAT\nSTAY WITH YOU\nFOREVER.",
          body: 'At Fiesta, we believe every moment has the potential to become extraordinary. From intimate celebrations to large-scale productions, we bring creativity, precision and passion to every detail.',
          image: '',
          image_alt: '',
          mission: { icon: 'target', title: 'OUR MISSION', description: 'We turn ideas into well-crafted experiences by combining creativity, entertainment, production and precision.' },
          vision: { icon: 'eye', title: 'OUR VISION', description: 'Building a trusted and creative event company. Creating experiences people remember. Growing across the region.' },
          values_intro: { icon: 'star', title: 'OUR VALUES', description: 'Creativity. Excellence. Integrity. Passion. Teamwork.' },
          team_eyebrow: 'OUR TEAM',
          team_members: [],
        },
      },
      {
        type: 'about-story',
        title: 'Our Story',
        content: {
          eyebrow: 'OUR STORY',
          heading: 'BUILT ON PASSION.\nDRIVEN BY PURPOSE.',
          body: 'Founded with a vision to transform the event landscape, Fiesta began as a passionate response to the gap between what events could be and what they often were.\n\nOver the years, we have evolved into a trusted full-service event agency, delivering extraordinary experiences for clients around the world.',
          image: '',
          image_alt: '',
        },
      },
      {
        type: 'about-foundation',
        title: 'Our Foundation',
        content: {
          eyebrow: 'WHAT DRIVES US',
          heading: 'WE TURN IDEAS\nINTO MEMORABLE\nEXPERIENCES.',
          body: 'Fiesta takes an initial idea and develops it into a cohesive experience — concept, creative direction, planning, production, and execution — all working together as one vision.',
        },
      },
      {
        type: 'about-values',
        title: 'Our Values',
        content: {
          eyebrow: 'OUR VALUES',
          heading: 'THE PRINCIPLES\nBEHIND THE\nEXPERIENCE.',
          values: [
            { id: '1', name: 'CREATIVITY' },
            { id: '2', name: 'PASSION' },
            { id: '3', name: 'INTEGRITY' },
            { id: '4', name: 'EXCELLENCE' },
            { id: '5', name: 'TEAMWORK' },
          ],
          image: '',
          image_alt: '',
        },
      },
      {
        type: 'about-why',
        title: 'Why Fiesta',
        content: {
          heading: 'WHY FIESTA?',
          points: [
            { id: '1', title: 'CREATIVE THINKING', description: 'We approach every event from its own story.' },
            { id: '2', title: 'SEAMLESS EXECUTION', description: 'We coordinate the moving parts behind the scenes.' },
            { id: '3', title: 'ATTENTION TO DETAIL', description: 'We care about the details guests may never notice, but always feel.' },
          ],
        },
      },
      {
        type: 'about-closing',
        title: 'Cinematic Closing',
        content: {
          heading: 'YOUR VISION.\nOUR EXPERIENCE.',
          cta_text: "LET'S CREATE IT",
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

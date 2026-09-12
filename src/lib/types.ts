export type UserRole = 'admin' | 'staff';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  page_id: string;
  title: string | null;
  subtitle: string | null;
  body: RichTextContent | null;
  image_url: string | null;
  image_alt: string | null;
  layout: string;
  section_type: string;
  content: Record<string, unknown>;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ── Section Content Types ──

export type SectionType =
  | 'hero-carousel'
  | 'brand-statement'
  | 'services-editorial'
  | 'events-editorial'
  | 'portfolio-gallery'
  | 'testimonials'
  | 'faq'
  | 'stats'
  | 'process'
  | 'text-image'
  | 'cta'
  | 'editorial-list'
  | 'cinematic-image'
  | 'team-members'
  | 'image-carousel'
  | 'blocks'
  | 'services-hero'
  | 'services-featured'
  | 'services-directory'
  | 'services-philosophy'
  | 'services-process'
  | 'services-image-statement'
  | 'services-cta'
  | 'about-intro'
  | 'about-story'
  | 'about-foundation'
  | 'about-values'
  | 'about-why'
  | 'about-closing';

export interface HeroSlide {
  id: string;
  image: string;
  mobile_image: string | null;
  image_alt: string;
  eyebrow: string;
  headline: string;
  highlight_word: string;
  description: string;
  cta_text: string;
  cta_url: string;
  secondary_cta_text: string;
  secondary_cta_url: string;
  focal_x: number;
  focal_y: number;
}

export interface HeroCarouselContent {
  slides: HeroSlide[];
}

export interface BrandStatementContent {
  eyebrow: string;
  primary_text: string;
  highlighted_text: string;
  description: string;
  metadata: string;
  accent_word: string;
  image: string;
  image_alt: string;
  variant: 'default' | 'centered';
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  image_alt: string;
  featured: boolean;
}

export interface ServicesEditorialContent {
  heading: string;
  description: string;
  services: ServiceItem[];
  variant: 'default' | 'compact';
}

export interface EventsEditorialContent {
  heading: string;
  description: string;
  limit: number;
  featured_only: boolean;
  upcoming_only: boolean;
  variant: 'default' | 'minimal';
}

export interface PortfolioGalleryItem {
  id: string;
  image: string;
  title: string;
  category: string;
}

export interface PortfolioGalleryContent {
  heading: string;
  description: string;
  items: PortfolioGalleryItem[];
  variant: 'grid' | 'masonry' | 'asymmetric';
}

export interface TestimonialItem {
  id: string;
  quote: string;
  client_name: string;
  event_type: string;
  location: string;
  image_url: string;
}

export interface TestimonialsContent {
  heading: string;
  description: string;
  testimonials: TestimonialItem[];
  variant: 'default' | 'carousel';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  heading: string;
  description: string;
  items: FAQItem[];
}

export interface StatItem {
  id: string;
  number: string;
  label: string;
}

export interface StatsContent {
  heading: string;
  stats: StatItem[];
  variant: 'default' | 'compact';
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface ProcessContent {
  heading: string;
  description: string;
  steps: ProcessStep[];
}

export interface TextImageContent {
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  image_alt: string;
  image_position: 'left' | 'right';
  cta_text: string;
  cta_url: string;
  variant: 'default' | 'split' | 'centered';
}

export interface CTAContent {
  eyebrow: string;
  heading: string;
  description: string;
  button_text: string;
  button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  background_image: string;
  variant: 'default' | 'full-width' | 'minimal';
}

export interface EditorialListItem {
  id: string;
  number: string;
  title: string;
  description: string | null;
}

export interface EditorialListContent {
  heading: string | null;
  description: string | null;
  items: EditorialListItem[];
}

export interface CinematicImageContent {
  image: string;
  mobile_image: string | null;
  image_alt: string | null;
  focal_x: number;
  focal_y: number;
  caption: string | null;
  caption_alignment: 'left' | 'center';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string | null;
}

export interface TeamMembersContent {
  heading: string | null;
  members: TeamMember[];
}

export interface CarouselImage {
  id: string;
  src: string;
  alt: string | null;
}

export interface ImageCarouselContent {
  heading: string | null;
  description: string | null;
  images: CarouselImage[];
}

export interface ServicesHeroContent {
  eyebrow?: string;
  heading?: string;
  description?: string;
}

export interface ServicesFeaturedContent {
  eyebrow?: string;
  heading?: string;
  services?: Array<{ id: string; title: string; description: string; image?: string }>;
}

export interface ServicesDirectoryContent {
  heading?: string;
  services?: Array<{ id: string; number: string; title: string }>;
}

export interface ServicesPhilosophyContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
}

export interface ServicesProcessContent {
  heading?: string;
  steps?: Array<{ id: string; number: string; title: string; description: string }>;
}

export interface ServicesImageStatementContent {
  heading?: string;
  description?: string;
  image?: string;
}

export interface ServicesCTAContent {
  heading?: string;
  button_text?: string;
  button_url?: string;
  background_image?: string;
}

export interface AboutIntroContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: string;
  image_alt?: string;
  mission?: { icon?: string; title?: string; description?: string };
  vision?: { icon?: string; title?: string; description?: string };
  values_intro?: { icon?: string; title?: string; description?: string };
  team_eyebrow?: string;
  team_members?: Array<{ id: string; name: string; role: string; image?: string }>;
}

export interface AboutStoryContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
  image?: string;
  image_alt?: string;
}

export interface AboutFoundationContent {
  eyebrow?: string;
  heading?: string;
  body?: string;
}

export interface AboutValuesContent {
  eyebrow?: string;
  heading?: string;
  values?: Array<{ id: string; name?: string }>;
  image?: string;
  image_alt?: string;
}

export interface AboutWhyContent {
  eyebrow?: string;
  heading?: string;
  points?: Array<{ id: string; title: string; description: string }>;
}

export interface AboutClosingContent {
  heading?: string;
  cta_text?: string;
  cta_url?: string;
  background_image?: string;
  background_image_alt?: string;
}

export interface BlocksContent {
  blocks: Array<{
    id: string;
    type: string;
    content: Record<string, unknown>;
    sort_order: number;
    responsive: {
      desktop: { visible: boolean };
      tablet: { visible: boolean };
      mobile: { visible: boolean };
    };
  }>;
}

export type SectionContentMap = {
  'hero-carousel': HeroCarouselContent;
  'brand-statement': BrandStatementContent;
  'services-editorial': ServicesEditorialContent;
  'events-editorial': EventsEditorialContent;
  'portfolio-gallery': PortfolioGalleryContent;
  'testimonials': TestimonialsContent;
  'faq': FAQContent;
  'stats': StatsContent;
  'process': ProcessContent;
  'text-image': TextImageContent;
  'cta': CTAContent;
  'editorial-list': EditorialListContent;
  'cinematic-image': CinematicImageContent;
  'team-members': TeamMembersContent;
  'image-carousel': ImageCarouselContent;
  'blocks': BlocksContent;
  'services-hero': ServicesHeroContent;
  'services-featured': ServicesFeaturedContent;
  'services-directory': ServicesDirectoryContent;
  'services-philosophy': ServicesPhilosophyContent;
  'services-process': ServicesProcessContent;
  'services-image-statement': ServicesImageStatementContent;
  'services-cta': ServicesCTAContent;
  'about-intro': AboutIntroContent;
  'about-story': AboutStoryContent;
  'about-foundation': AboutFoundationContent;
  'about-values': AboutValuesContent;
  'about-why': AboutWhyContent;
  'about-closing': AboutClosingContent;
};

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  details: { items?: string[] } | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type EventStatus = 'upcoming' | 'completed' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  event_date: string | null;
  location: string | null;
  cover_image: string | null;
  cover_alt: string | null;
  gallery: string[];
  lineup: string[] | null;
  ticket_url: string | null;
  registration_url: string | null;
  status: EventStatus;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  story: { paragraphs?: string[] } | null;
  year: number | null;
  cover_image: string | null;
  cover_alt: string | null;
  gallery: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  quote: string;
  event_type: string | null;
  location: string | null;
  image_url: string | null;
  image_alt: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type BookingStatus = 'new' | 'contacted' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  client_name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  location: string | null;
  guest_count: number | null;
  budget: string | null;
  message: string | null;
  referral: string | null;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  focal_x: number | null;
  focal_y: number | null;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  label: string;
  to: string;
  visible: boolean;
  order: number;
}

export interface FooterLink {
  label: string;
  to: string;
  visible: boolean;
}

export interface FooterGroup {
  title: string;
  visible: boolean;
  order: number;
  links: FooterLink[];
}

export interface FooterCTA {
  heading: string;
  subtext: string;
  button_label: string;
  button_url: string;
  visible: boolean;
}

export interface SiteSettings {
  id: number;
  company_name: string;
  tagline: string;
  logo_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  seo_title: string | null;
  seo_description: string | null;
  footer_text: string | null;
  navigation: NavItem[];
  footer_groups: FooterGroup[];
  footer_cta: FooterCTA | null;
  copyright_text: string | null;
  og_image_url: string | null;
  nav_cta_label: string | null;
  nav_cta_url: string | null;
  nav_cta_visible: boolean;
  footer_hero_image: string | null;
  updated_at: string;
}

// Rich text types
export type RichTextNode =
  | { type: 'paragraph'; children: RichTextInline[] }
  | { type: 'heading'; level: 2 | 3; children: RichTextInline[] }
  | { type: 'list'; ordered: boolean; items: RichTextInline[][] }
  | { type: 'quote'; children: RichTextInline[] };

export type RichTextInline =
  | { text: string; bold?: boolean; italic?: boolean }
  | { type: 'link'; href: string; children: RichTextInline[] };

export type RichTextContent = RichTextNode[];

export const EVENT_CATEGORIES = ['All', 'Wedding', 'Celebration', 'Corporate', 'Private', 'Production', 'Concert'] as const;
export const EVENT_TYPES_FORM = [
  'Wedding', 'Birthday', 'Anniversary', 'Corporate Event', 'Product Launch',
  'Award Event', 'Conference', 'Private Event', 'Other',
] as const;
export const BOOKING_STATUSES: BookingStatus[] = [
  'new', 'contacted', 'in_progress', 'confirmed', 'completed', 'cancelled',
];

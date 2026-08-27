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
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

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
  created_at: string;
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

export const EVENT_CATEGORIES = ['All', 'Weddings', 'Celebrations', 'Corporate', 'Private', 'Production'] as const;
export const EVENT_TYPES_FORM = [
  'Wedding', 'Birthday', 'Anniversary', 'Corporate Event', 'Product Launch',
  'Award Event', 'Conference', 'Private Event', 'Other',
] as const;
export const BOOKING_STATUSES: BookingStatus[] = [
  'new', 'contacted', 'in_progress', 'confirmed', 'completed', 'cancelled',
];

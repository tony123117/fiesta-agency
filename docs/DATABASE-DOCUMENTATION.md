# DATABASE-DOCUMENTATION.md — Fiesta Agency

## Overview

The database is PostgreSQL, managed through Supabase. All tables have Row Level Security (RLS) enabled.

---

## Tables

### `profiles`
Extends Supabase Auth users with role and display info.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK, references `auth.users(id)` |
| `email` | text | Not null |
| `full_name` | text | Nullable |
| `role` | text | `'admin'` or `'staff'`, default `'staff'` |
| `avatar_url` | text | Nullable |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto, trigger-updated |

**RLS**: Users can read/update their own profile. Admins can read all.

---

### `pages`
Top-level CMS pages (home, about, services, etc.).

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `slug` | text | Unique, not null |
| `title` | text | Not null |
| `description` | text | Nullable |
| `published` | boolean | Default true |
| `published_at` | timestamptz | Nullable |
| `seo_title` | text | Nullable |
| `seo_description` | text | Nullable |
| `og_image_url` | text | Nullable |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |

**RLS**: Public can read published pages. Staff can read all and write.

---

### `sections`
Ordered, publishable content sections within a page.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `page_id` | uuid | FK → `pages(id)`, cascade delete |
| `title` | text | Nullable |
| `subtitle` | text | Nullable |
| `body` | jsonb | Legacy rich text content |
| `image_url` | text | Nullable |
| `image_alt` | text | Nullable |
| `section_type` | text | Determines renderer (see Section Types) |
| `content` | jsonb | Section-specific content data |
| `layout` | text | Default `'default'` |
| `sort_order` | int | Not null, default 0 |
| `published` | boolean | Default true |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto |

**RLS**: Public can read published sections. Staff can read all and write.

---

### `services`
Service catalog entries.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title` | text | Not null |
| `slug` | text | Unique, not null |
| `description` | text | Nullable |
| `details` | jsonb | `{ items: string[] }` |
| `image_url` | text | Nullable |
| `image_alt` | text | Nullable |
| `featured` | boolean | Default false |
| `sort_order` | int | Default 0 |
| `published` | boolean | Default true |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Public can read published. Staff can write.

---

### `events`
Event records with category, date, gallery, status.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title` | text | Not null |
| `slug` | text | Unique, not null |
| `description` | text | Nullable |
| `category` | text | Default `'Celebration'` |
| `event_date` | date | Nullable |
| `location` | text | Nullable |
| `cover_image` | text | Nullable |
| `cover_alt` | text | Nullable |
| `gallery` | jsonb | Array of image URLs |
| `lineup` | jsonb | Array of lineup strings |
| `ticket_url` | text | Nullable |
| `registration_url` | text | Nullable |
| `status` | text | `'upcoming'`, `'completed'`, or `'cancelled'` |
| `featured` | boolean | Default false |
| `published` | boolean | Default true |
| `sort_order` | int | Default 0 |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Public can read published. Staff can write.

---

### `portfolio_projects`
Portfolio work entries with stories and galleries.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `title` | text | Not null |
| `slug` | text | Unique, not null |
| `category` | text | Default `'Wedding'` |
| `description` | text | Nullable |
| `story` | jsonb | `{ paragraphs: string[] }` |
| `year` | int | Nullable |
| `cover_image` | text | Nullable |
| `cover_alt` | text | Nullable |
| `gallery` | jsonb | Array of image URLs |
| `published` | boolean | Default true |
| `sort_order` | int | Default 0 |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Public can read published. Staff can write.

---

### `testimonials`
Client quotes with event type and location.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `client_name` | text | Not null |
| `quote` | text | Not null |
| `event_type` | text | Nullable |
| `location` | text | Nullable |
| `image_url` | text | Nullable |
| `image_alt` | text | Nullable |
| `published` | boolean | Default true |
| `sort_order` | int | Default 0 |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Public can read published. Staff can write.

---

### `faqs`
Frequently asked questions.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `question` | text | Not null |
| `answer` | text | Not null |
| `category` | text | Default `'General'` |
| `published` | boolean | Default true |
| `sort_order` | int | Default 0 |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Public can read published. Staff can write.

---

### `bookings`
Inquiry submissions from the contact form.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `client_name` | text | Not null |
| `email` | text | Not null |
| `phone` | text | Nullable |
| `event_type` | text | Not null |
| `event_date` | date | Nullable |
| `location` | text | Nullable |
| `guest_count` | int | Nullable |
| `budget` | text | Nullable |
| `message` | text | Nullable |
| `referral` | text | Nullable |
| `status` | text | `'new'` → `'contacted'` → `'in_progress'` → `'confirmed'` → `'completed'` / `'cancelled'` |
| `notes` | text | Internal admin notes |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Anyone can INSERT (form submission). Only staff can SELECT/UPDATE/DELETE.

---

### `media`
Media library entries for uploaded files.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | PK |
| `name` | text | Original filename |
| `storage_path` | text | Path in Supabase Storage |
| `public_url` | text | Public URL for the file |
| `mime_type` | text | e.g. `image/jpeg` |
| `size_bytes` | bigint | File size |
| `width` | int | Image width (if image) |
| `height` | int | Image height (if image) |
| `alt_text` | text | Accessible description |
| `focal_x` | float | Focal point X (0-1) |
| `focal_y` | float | Focal point Y (0-1) |
| `created_at` / `updated_at` | timestamptz | Auto |

**RLS**: Public can read all. Staff can write.

---

### `site_settings`
Single-row table for global site configuration.

| Column | Type | Notes |
|--------|------|-------|
| `id` | int | Always 1 (single-row constraint) |
| `company_name` | text | Default `'Fiesta Agency'` |
| `tagline` | text | Default tagline |
| `logo_url` | text | Nullable |
| `email` | text | Nullable |
| `phone` | text | Nullable |
| `whatsapp` | text | Nullable |
| `address` | text | Nullable |
| `instagram` | text | Nullable |
| `facebook` | text | Nullable |
| `tiktok` | text | Nullable |
| `seo_title` | text | Nullable |
| `seo_description` | text | Nullable |
| `footer_text` | text | Nullable |
| `navigation` | jsonb | Array of NavItem objects |
| `footer_groups` | jsonb | Array of FooterGroup objects |
| `footer_cta` | jsonb | FooterCTA object |
| `copyright_text` | text | Nullable |
| `og_image_url` | text | Nullable |
| `nav_cta_label` | text | Nullable |
| `nav_cta_url` | text | Nullable |
| `nav_cta_visible` | boolean | Default false |
| `footer_hero_image` | text | Nullable |
| `updated_at` | timestamptz | Auto |

**RLS**: Public can read. Staff can write.

---

## Indexes

| Table | Index | Column |
|-------|-------|--------|
| `sections` | `idx_sections_page_id` | `page_id` |
| `sections` | `idx_sections_sort` | `sort_order` |
| `services` | `idx_services_sort` | `sort_order` |
| `events` | `idx_events_category` | `category` |
| `events` | `idx_events_status` | `status` |
| `events` | `idx_events_published` | `published` |
| `events` | `idx_events_event_date` | `event_date` |
| `portfolio_projects` | `idx_portfolio_category` | `category` |
| `portfolio_projects` | `idx_portfolio_published` | `published` |
| `portfolio_projects` | `idx_portfolio_sort` | `sort_order` |
| `testimonials` | `idx_testimonials_published` | `published` |
| `testimonials` | `idx_testimonials_sort` | `sort_order` |
| `faqs` | `idx_faqs_published` | `published` |
| `faqs` | `idx_faqs_sort` | `sort_order` |
| `bookings` | `idx_bookings_status` | `status` |
| `bookings` | `idx_bookings_created` | `created_at` |
| `media` | `idx_media_created` | `created_at` |

---

## Triggers

All tables with `updated_at` have a `handle_updated_at()` trigger that automatically sets `updated_at = now()` on update.

---

## See Also

- [SUPABASE-DOCUMENTATION.md](./SUPABASE-DOCUMENTATION.md)
- [AUTHENTICATION-AND-SECURITY.md](./AUTHENTICATION-AND-SECURITY.md)
- [CONTENT-MODEL.md](./CONTENT-MODEL.md)

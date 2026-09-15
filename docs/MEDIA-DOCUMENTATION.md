# MEDIA-DOCUMENTATION.md — Fiesta Agency

## Overview

Media files are managed through the admin Media Library and stored in Supabase Storage.

---

## Storage

- **Bucket**: `media`
- **Access**: Public read, staff-only write
- **Path format**: `originals/{timestamp}-{random}.{ext}`

---

## Media Record

Each uploaded file creates a record in the `media` table with:
- `name` — Original filename
- `storage_path` — Path in Supabase Storage
- `public_url` — Public URL for the file
- `mime_type` — e.g., `image/jpeg`
- `size_bytes` — File size
- `width` / `height` — Image dimensions (if applicable)
- `alt_text` — Accessible description
- `focal_x` / `focal_y` — Focal point for responsive cropping

---

## Upload Flow

1. Admin selects/drops files in Media Library
2. Files uploaded to Supabase Storage
3. Record created in `media` table
4. Media appears in library grid
5. Media can be selected in page editors via MediaPicker

---

## Usage

Media is referenced by URL in:
- Section `image_url`
- Section `content` JSON (slide images, service images, etc.)
- Event `cover_image` and `gallery`
- Portfolio `cover_image` and `gallery`
- Settings `logo_url`, `og_image_url`, `footer_hero_image`

---

## Media Picker

The MediaPicker component allows selecting existing media:
- Grid view of all uploaded files
- Search by name or alt text
- Filter by type (images, videos)
- Sort by date or name
- Preview before selecting
- Edit alt text and focal point

---

## Cleanup

When a media record is deleted:
1. Record removed from `media` table
2. File removed from Supabase Storage

---

## See Also

- [ADMIN-DOCUMENTATION.md](./ADMIN-DOCUMENTATION.md)
- [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md)

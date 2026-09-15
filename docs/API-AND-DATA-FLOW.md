# API-AND-DATA-FLOW.md — Fiesta Agency

## Overview

There is no custom REST or GraphQL API. All data access goes through the Supabase JavaScript client, which communicates directly with PostgreSQL and enforces Row Level Security.

---

## Data Flow Patterns

### Public Page Load
```
1. React Router matches URL
2. Page component lazy-loads
3. useEffect triggers Supabase queries:
   - getPageBySlug(slug) → pages table
   - getSections(pageId) → sections table
   - getPublishedCollection(table) → collection tables
4. Data stored in React state
5. Passed as props to section renderers
6. Components render with fallback defaults
7. useDocumentMeta sets SEO tags
```

### Admin Content Edit
```
1. Admin navigates to editor
2. PageBuilder loads page + sections from Supabase
3. Admin edits via SectionEditor
4. saveSection() → upsert to sections table
5. savePage() → update pages table
6. Changes persist in database
7. Public page reflects changes on next load
```

### Contact Form
```
1. Visitor fills form
2. Client-side validation
3. POST to Web3Forms API → email delivered
4. void supabase.from('bookings').insert() → fire-and-forget
5. Success/error state shown
```

### Media Upload
```
1. Admin selects file
2. File uploaded to Supabase Storage
3. Record created in media table
4. Public URL stored
5. URL referenced in section content
```

---

## Supabase Client Methods Used

| Method | Tables | Purpose |
|--------|--------|---------|
| `.select()` | All | Read data |
| `.insert()` | All | Create records |
| `.update()` | All | Modify records |
| `.upsert()` | pages, sections | Create or update |
| `.delete()` | All | Remove records |
| `.eq()` | All | Filter by column |
| `.order()` | All | Sort results |
| `.single()` | pages, site_settings | Return one row |
| `.storage.from()` | — | File operations |

---

## Error Handling

- Database errors logged via `console.error`
- User-facing errors shown as toast notifications
- Form submission errors displayed inline
- Auth errors redirect to login

---

## See Also

- [SUPABASE-DOCUMENTATION.md](./SUPABASE-DOCUMENTATION.md)
- [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md)
- [TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)

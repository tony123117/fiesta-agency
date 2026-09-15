# USER-FLOWS.md — Fiesta Agency

## Public Visitor Flow

```
Homepage
├── About → Agency story, mission, values, team
├── Services → Service showcase with details
├── Events → Filterable event gallery
│   └── Event Detail → Individual event with gallery
├── Portfolio → Filterable project gallery
│   └── Portfolio Detail → Individual project with story
├── How We Work → Five-phase process
├── Contact → Contact form
└── Plan Your Event → Alias for Contact
```

---

## Admin Flow

```
Login
├── Dashboard → Stats, upcoming events, recent bookings
├── Pages
│   ├── Home → Section editor
│   ├── About → Section editor
│   ├── How We Work → Section editor
│   └── Page Builder → Visual drag-and-drop
├── Collections
│   ├── Services → List, add, edit
│   ├── Events → List, add, edit, duplicate
│   ├── Portfolio → List, add, edit, duplicate
│   ├── Testimonials → List, add, edit
│   └── FAQs → List, add, edit
├── Bookings → List, filter, update status
├── Media → Upload, manage, search
└── Settings → Company, nav, footer, SEO
```

---

## Booking Flow

```
Visitor submits contact form
├── Email sent via Web3Forms
├── Booking record created in Supabase
└── Admin reviews in Bookings panel
    ├── Updates status
    ├── Adds notes
    └── Contacts client
```

---

## Content Update Flow

```
Admin edits section in PageBuilder
├── Changes saved to Supabase
├── Public page reflects changes on next load
└── SEO metadata updated if changed
```

---

## See Also

- [PUBLIC-PAGES.md](./PUBLIC-PAGES.md)
- [ADMIN-DOCUMENTATION.md](./ADMIN-DOCUMENTATION.md)

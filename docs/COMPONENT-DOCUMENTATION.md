# COMPONENT-DOCUMENTATION.md — Fiesta Agency

## Component Organization

Components are organized by domain:
- `src/components/public/` — Public-facing components
- `src/components/admin/` — Admin-only components
- `src/components/` — Shared components (Navbar, Footer, etc.)

---

## Public Section Renderers

Each section type has a corresponding renderer component in `src/components/public/`.

### Core Renderers

| Component | File | Purpose |
|-----------|------|---------|
| `SectionRenderer` | `SectionRenderer.tsx` | Maps section_type → component |
| `PageRenderer` | `PageRenderer.tsx` | Fetches and renders a full CMS page |
| `BlocksSectionRenderer` | `BlocksSectionRenderer.tsx` | Renders block-based content |
| `LayoutRenderer` | `LayoutRenderer.tsx` | Renders layout containers |

### Page-Specific Renderers

Located in `src/components/public/about/`, `contact/`, `events/`, `howwe/`, `portfolio/`, `services/`.

---

## Admin Components

### Layout
| Component | File | Purpose |
|-----------|------|---------|
| `AdminLayout` | `AdminLayout.tsx` | Admin page wrapper with sidebar |
| `ProtectedRoute` | `ProtectedRoute.tsx` | Auth route guard |
| `Sidebar` | `Sidebar.tsx` | Admin navigation sidebar |

### Page Builder
| Component | File | Purpose |
|-----------|------|---------|
| `PageBuilder` | `PageBuilder.tsx` | Main page builder interface |
| `SectionEditor` | `SectionEditor.tsx` | Edit section content |
| `AddSectionModal` | `AddSectionModal.tsx` | Add new section |
| `VisualCanvas` | `VisualCanvas.tsx` | Drag-and-drop canvas |
| `MediaPicker` | `MediaPicker.tsx` | Select media from library |

### UI Primitives (`AdminUI.tsx`)
| Component | Purpose |
|-----------|---------|
| `PageHeader` | Page title with action |
| `AdminButton` | Styled button |
| `AdminCard` | Card container |
| `AdminInput` | Text input |
| `AdminTextarea` | Textarea |
| `AdminSelect` | Dropdown select |
| `AdminToggle` | Toggle switch |
| `DataTable` | Sortable table |
| `Toast` | Notification |
| `ConfirmDialog` | Confirmation modal |
| `AdminLoading` | Loading spinner |
| `AdminErrorBoundary` | Error boundary |

---

## Shared Components

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `Navbar.tsx` | Public navigation |
| `Footer` | `Footer.tsx` | Public footer |
| `PublicLayout` | `PublicLayout.tsx` | Public page wrapper |
| `Reveal` | `Reveal.tsx` | Scroll reveal animation |
| `RichText` | `RichText.tsx` | Rich text renderer |
| `WhatsAppButton` | `WhatsAppButton.tsx` | Floating WhatsApp CTA |

---

## See Also

- [SECTION-SYSTEM.md](./SECTION-SYSTEM.md)
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)

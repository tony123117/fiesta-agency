# RESPONSIVE-DESIGN.md — Fiesta Agency

## Approach

The site uses a mobile-first responsive design with Tailwind CSS breakpoints.

---

## Breakpoints

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile phones |
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

---

## Key Responsive Patterns

### Typography
```css
heading:    clamp(2rem, 5vw, 4.5rem)
subheading: clamp(1.5rem, 3vw, 3rem)
body:       0.875rem (mobile) → 1rem (desktop)
eyebrow:    0.6rem (mobile) → 0.7rem (desktop)
```

### Spacing
```css
section padding:    py-20 md:py-28 lg:py-36
horizontal padding: px-5 md:px-[4vw] lg:px-12
max width:          max-w-[1320px]
```

### Layout
- Mobile: Single column, stacked
- Tablet: 2-column grids where appropriate
- Desktop: Full multi-column layouts

---

## Navigation

- **Mobile**: Hamburger menu, full-screen overlay
- **Desktop**: Horizontal navigation with CTA button

---

## Testing Results

Responsive testing was performed across 7 viewports with 56 tests total, all passing:

| Viewport | Width | Tests | Status |
|----------|-------|-------|--------|
| iPhone SE | 375px | 8 | ✅ PASS |
| iPhone 14 | 390px | 8 | ✅ PASS |
| iPhone 14 Pro Max | 430px | 8 | ✅ PASS |
| iPad Mini | 768px | 8 | ✅ PASS |
| iPad Air | 820px | 8 | ✅ PASS |
| iPad Pro 12.9" | 1024px | 8 | ✅ PASS |
| Desktop | 1440px | 8 | ✅ PASS |

---

## See Also

- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)
- [ACCESSIBILITY.md](./ACCESSIBILITY.md)

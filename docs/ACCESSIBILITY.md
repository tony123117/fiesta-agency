# ACCESSIBILITY.md — Fiesta Agency

## Current State

The site uses semantic HTML and basic accessibility practices, but has not been audited for WCAG compliance.

---

## Accessibility Features

| Feature | Status |
|---------|--------|
| Semantic HTML | ✅ |
| Alt text on images | ✅ (CMS-managed) |
| Keyboard navigation | ⚠️ Basic |
| Screen reader support | ⚠️ Basic |
| Color contrast | ⚠️ Not audited |
| Focus management | ⚠️ Basic |
| ARIA labels | ⚠️ Limited |
| Reduced motion | ✅ (usePrefersReducedMotion hook) |

---

## Reduced Motion

The `usePrefersReducedMotion` hook respects the user's `prefers-reduced-motion` setting:
- If enabled, animations are disabled
- Transitions are removed
- Scroll reveal effects are skipped

---

## Keyboard Navigation

- All interactive elements are focusable
- Tab order follows visual order
- Modal dialogs trap focus
- Escape key closes modals

---

## Known Limitations

- No skip-to-content link
- No ARIA landmarks on all sections
- No live region announcements
- Color contrast not audited
- Focus indicators may be insufficient

---

## See Also

- [RESPONSIVE-DESIGN.md](./RESPONSIVE-DESIGN.md)
- [FRONTEND-DOCUMENTATION.md](./FRONTEND-DOCUMENTATION.md)

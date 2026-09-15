# SECURITY.md — Fiesta Agency

## Security Overview

The application's security is layered across Supabase RLS, frontend sanitization, and authentication.

---

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| Unauthorized admin access | ProtectedRoute + Supabase Auth + role check |
| XSS via CMS content | DOMPurify on all `dangerouslySetInnerHTML` |
| SQL injection | Supabase client parameterized queries |
| Unauthorized data access | Row Level Security on every table |
| Session hijacking | JWT auto-refresh, secure localStorage |
| Malicious file uploads | Supabase Storage policies (staff-only) |
| CSRF | Supabase JWT-based auth (no cookies) |

---

## Sanitization

DOMPurify is applied at two entry points:
1. `BlocksSectionRenderer.tsx` — Public rendering of block HTML
2. `BlockRenderer.tsx` — Admin rendering of block HTML

This prevents stored XSS through the CMS block editor.

---

## RLS Enforcement

All data access goes through Supabase, which enforces RLS policies. The frontend cannot bypass RLS because the policies are enforced at the database level, not the application level.

---

## Known Security Considerations

| Item | Status |
|------|--------|
| Admin routes protected | ✅ |
| RLS on all tables | ✅ |
| HTML sanitized | ✅ |
| No secrets in frontend | ✅ (except Web3Forms key) |
| No sensitive data in localStorage | ✅ |
| HTTPS enforced by Supabase | ✅ |
| Storage bucket public read | ⚠️ Intentional for media |
| Web3Forms API key in frontend | ⚠️ Intentional, public service |

---

## See Also

- [AUTHENTICATION-AND-SECURITY.md](./AUTHENTICATION-AND-SECURITY.md)

# MAINTENANCE.md — Fiesta Agency

## Regular Tasks

| Task | Frequency | Location |
|------|-----------|----------|
| Update dependencies | Monthly | `package.json` |
| Check for security vulnerabilities | Monthly | `npm audit` |
| Review Supabase logs | Weekly | Supabase dashboard |
| Backup database | Weekly | Supabase dashboard |
| Update content | As needed | Admin UI |
| Test contact form | Weekly | `/contact` |
| Check SEO | Monthly | Google Search Console |

---

## Content Updates

All content can be updated through the admin UI:
- Page sections → PageBuilder
- Events → EventsAdmin
- Portfolio → PortfolioAdmin
- Testimonials → TestimonialsAdmin
- FAQs → FAQsAdmin
- Services → ServicesCMSAdmin
- Site settings → SettingsAdmin

---

## Code Updates

For code changes:
1. Create a branch
2. Make changes
3. Run `npm run lint` and `npm run typecheck`
4. Test responsive design
5. Build and verify
6. Deploy

---

## Database Migrations

For schema changes:
1. Create migration file in `supabase/migrations/`
2. Test migration locally
3. Apply to production via Supabase dashboard
4. Update TypeScript types if needed

---

## See Also

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

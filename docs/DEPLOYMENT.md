# DEPLOYMENT.md — Fiesta Agency

## Build

```bash
npm run build
```

Output in `dist/` directory.

---

## Static Hosting

The application is a static SPA and can be deployed to any static hosting provider:
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- GitHub Pages

---

## Environment Setup

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in hosting provider
2. Deploy `dist/` directory
3. Configure SPA routing (redirect all routes to `index.html`)
4. Ensure `robots.txt` and `sitemap.xml` are served from root

---

## Post-Deployment

1. Verify public pages load correctly
2. Verify admin login works
3. Test contact form submission
4. Check SEO meta tags
5. Test responsive design on mobile

---

## Production Domain

- `robots.txt` references `https://fiestaagency.com`
- `sitemap.xml` references `https://fiestaagency.com`
- Update these files if deploying to a different domain

---

## See Also

- [DEVELOPMENT-SETUP.md](./DEVELOPMENT-SETUP.md)
- [PERFORMANCE.md](./PERFORMANCE.md)

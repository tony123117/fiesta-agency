# TROUBLESHOOTING.md — Fiesta Agency

## Common Issues

### Build Fails

**Symptom**: `npm run build` errors

**Check**:
1. Run `npm run typecheck` for TypeScript errors
2. Run `npm run lint` for linting errors
3. Check `package.json` for missing dependencies

---

### Admin Login Fails

**Symptom**: Cannot log in at `/admin/login`

**Check**:
1. Verify Supabase URL and anon key in `.env`
2. Verify user exists in Supabase Auth
3. Verify user has profile in `profiles` table
4. Verify profile has `admin` or `staff` role

---

### Content Not Showing

**Symptom**: Public page shows placeholder content

**Check**:
1. Verify page exists in `pages` table with `published=true`
2. Verify sections exist with `published=true`
3. Verify `section_type` matches a registered type
4. Check browser console for errors

---

### Images Not Loading

**Symptom**: Broken images on public pages

**Check**:
1. Verify image URL is valid
2. Verify Supabase Storage bucket is public
3. Check browser console for CORS errors

---

### Contact Form Not Working

**Symptom**: Form submission fails

**Check**:
1. Verify Web3Forms API key is correct
2. Check browser console for network errors
3. Verify all required fields are filled
4. Check Supabase `bookings` table for record

---

### TypeScript Errors

**Symptom**: `npm run typecheck` shows errors

**Note**: There are 114 pre-existing TypeScript errors. These are known and do not affect functionality. New code should not introduce additional errors.

---

## See Also

- [TESTING-AND-QA.md](./TESTING-AND-QA.md)
- [KNOWN-LIMITATIONS.md](./KNOWN-LIMITATIONS.md)

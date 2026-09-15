# SUPABASE-DOCUMENTATION.md — Fiesta Agency

## Project Role

Supabase provides the complete backend:
- **Authentication** — Email/password login
- **PostgreSQL Database** — All application data
- **Row Level Security** — Access control at database level
- **Storage** — Media file uploads and serving
- **Migrations** — Schema version control

---

## Client Configuration

The Supabase client is created in `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
```

---

## Authentication

- Email/password authentication via Supabase Auth
- Sessions persisted in localStorage
- JWT tokens with `app_metadata.role` for role checking
- Token auto-refresh enabled
- Profile auto-creation on first login

---

## Row Level Security (RLS)

Every table has RLS enabled. The access model:

| Role | Public Tables | Bookings | Profiles |
|------|--------------|----------|----------|
| Anonymous | SELECT published | INSERT | — |
| Authenticated | SELECT published | INSERT | SELECT/UPDATE own |
| Staff | SELECT all, INSERT/UPDATE/DELETE | SELECT/UPDATE/DELETE | SELECT all |
| Admin | SELECT all, INSERT/UPDATE/DELETE | SELECT/UPDATE/DELETE | SELECT all |

The `is_staff()` function checks `app_metadata.role`:
```sql
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'staff'),
    false
  );
$$;
```

---

## Storage

- **Bucket**: `media`
- **Path format**: `originals/{timestamp}-{random}.{ext}`
- **Access**: Public read, staff-only write
- **Cleanup**: Storage files removed when media records are deleted

---

## Migrations

Located in `supabase/migrations/`. There are 42 migration files covering:
1. Initial schema (all tables, RLS, triggers, seed data)
2. Media storage bucket
3. Security fixes
4. Media metadata columns
5. Section type column
6. Services featured column
7. Events lineup/URLs
8. Site settings
9. Pages SEO fields
10. CMS content population
11. Page restructuring
12. Blocks section type
13. Security fixes
14. Content seeding
15. FAQ sections and contact fields

---

## Generated Types

TypeScript types are defined manually in `src/lib/types.ts` rather than using Supabase's type generation. This provides full control over the type definitions.

---

## Important: What the Frontend Can Safely Expose

The frontend uses the **anon key**, which is safe to expose. The anon key's permissions are controlled by RLS policies. The service-role key must never be included in the frontend code.

---

## See Also

- [DATABASE-DOCUMENTATION.md](./DATABASE-DOCUMENTATION.md)
- [AUTHENTICATION-AND-SECURITY.md](./AUTHENTICATION-AND-SECURITY.md)
- [API-AND-DATA-FLOW.md](./API-AND-DATA-FLOW.md)

# DEVELOPMENT-SETUP.md — Fiesta Agency

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase project (for backend)

---

## Installation

```bash
git clone <repository-url>
cd fiesta-agency
npm install
```

---

## Environment Variables

Create `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Development

```bash
npm run dev        # Start dev server (port 5175)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript check
```

---

## Database

1. Create Supabase project
2. Run migrations in order from `supabase/migrations/`
3. Ensure RLS is enabled on all tables
4. Create admin user in Supabase Auth
5. Add user to `profiles` table with `admin` role

---

## See Also

- [ENVIRONMENT-VARIABLES.md](./ENVIRONMENT-VARIABLES.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)

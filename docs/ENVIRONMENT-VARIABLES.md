# ENVIRONMENT-VARIABLES.md — Fiesta Agency

## Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |

These are the only required environment variables. Both are safe to expose in the frontend (anon key is public by design).

---

## Build Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `VITE_APP_VERSION` | `package.json` | Application version |

---

## Supabase Variables (Backend)

These are configured in the Supabase dashboard, not in the frontend:
- Database connection string
- Service role key
- JWT secret

---

## Web3Forms

The Web3Forms API key is hardcoded in the contact form components. This is intentional — Web3Forms is a public form service.

---

## See Also

- [DEVELOPMENT-SETUP.md](./DEVELOPMENT-SETUP.md)
- [SUPABASE-DOCUMENTATION.md](./SUPABASE-DOCUMENTATION.md)

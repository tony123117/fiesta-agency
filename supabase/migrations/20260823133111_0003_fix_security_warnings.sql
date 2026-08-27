/*
# Fix security advisor warnings

1. Change `is_staff()` from SECURITY DEFINER to SECURITY INVOKER and set search_path.
   Uses ALTER FUNCTION to avoid dropping dependent policies.
2. Set `search_path = public` on `handle_updated_at()` trigger function.
*/

ALTER FUNCTION public.is_staff() SECURITY INVOKER;
ALTER FUNCTION public.is_staff() SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

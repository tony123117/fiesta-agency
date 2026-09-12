/*
  ============================================
  FIX: is_staff() RLS Circular Dependency
  ============================================
  
  Run this ENTIRE script in Supabase SQL Editor:
  https://supabase.com/dashboard/project/_/sql/new
  
  Step 1: Check current is_staff() security attribute
  Step 2: Fix is_staff() to SECURITY DEFINER
  Step 3: Verify your profile has admin/staff role
  Step 4: Test is_staff() returns true
*/

-- ═══ STEP 1: Check current security attribute ═══
SELECT 
  p.proname AS function_name,
  CASE 
    WHEN p.prosecdef = true THEN 'SECURITY DEFINER'
    ELSE 'SECURITY INVOKER'
  END AS security_type,
  p.proconfig AS config_settings
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'is_staff';

-- Expected before fix: SECURITY INVOKER
-- Expected after fix: SECURITY DEFINER

-- ═══ STEP 2: Fix is_staff() ═══
ALTER FUNCTION public.is_staff() SECURITY DEFINER;

-- ═══ STEP 3: Verify fix applied ═══
SELECT 
  p.proname AS function_name,
  CASE 
    WHEN p.prosecdef = true THEN 'SECURITY DEFINER ✓'
    ELSE 'SECURITY INVOKER ✗ (FIX FAILED)'
  END AS security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'is_staff';

-- ═══ STEP 4: Check your profile role ═══
-- Replace the email below with your login email if different
SELECT id, email, full_name, role 
FROM public.profiles 
WHERE email = 'arum200909@gmail.com';

-- If role is NOT 'admin' or 'staff', fix it:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'arum200909@gmail.com';

-- ═══ STEP 5: Test is_staff() returns true ═══
SELECT public.is_staff() AS is_staff_result;

-- Expected: true (if your profile has admin/staff role)

-- ═══ STEP 6: Test INSERT permission ═══
-- This will INSERT and immediately DELETE a test event to verify RLS allows it
WITH test_insert AS (
  INSERT INTO public.events (title, slug, description, category, event_date, location, status, published)
  VALUES ('RLS Test Event', 'rls-test-delete-me', 'Test for RLS fix', 'Corporate', '2026-12-31', 'Test', 'upcoming', false)
  RETURNING id
)
DELETE FROM public.events WHERE id = (SELECT id FROM test_insert);

SELECT 'INSERT test passed - RLS is working correctly' AS result;

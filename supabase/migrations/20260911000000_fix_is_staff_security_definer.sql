/*
  Fix is_staff() SECURITY DEFINER
  
  Problem:
  Migration 0003 changed is_staff() from SECURITY DEFINER to SECURITY INVOKER.
  Migration 0006 tried to restore SECURITY DEFINER via CREATE OR REPLACE, but
  CREATE OR REPLACE does NOT change security attributes on existing functions.
  
  This caused is_staff() to run with the calling user's permissions (subject to RLS).
  Since is_staff() queries the profiles table, and profiles RLS calls is_staff(),
  this creates a circular dependency that always returns false.
  
  Result: All INSERT/UPDATE/DELETE operations requiring is_staff() are blocked.
  
  Fix:
  Use ALTER FUNCTION to properly restore SECURITY DEFINER.
*/

-- Restore SECURITY DEFINER on is_staff()
-- CREATE OR REPLACE cannot change security attributes; ALTER FUNCTION is required
ALTER FUNCTION public.is_staff() SECURITY DEFINER;

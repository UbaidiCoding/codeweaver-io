-- Revoke public SELECT access from all tables to prevent data exposure
-- This addresses the PUBLIC_DATA_EXPOSURE security finding
REVOKE SELECT ON public.profiles FROM anon, public;
REVOKE SELECT ON public.receipts FROM anon, public;
REVOKE SELECT ON public.affiliates FROM anon, public;
REVOKE SELECT ON public.user_roles FROM anon, public;
-- Revoke public SELECT access from all tables to prevent data exposure
-- This addresses the PUBLIC_DATA_EXPOSURE security finding

REVOKE SELECT ON public.profiles FROM anon, public;
REVOKE SELECT ON public.receipts FROM anon, public;
REVOKE SELECT ON public.affiliates FROM anon, public;
REVOKE SELECT ON public.user_roles FROM anon, public;

-- Add missing INSERT policy for receipts (system needs to create receipts)
CREATE POLICY "Authenticated users can create own receipts"
  ON public.receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add missing role management policies for admins
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Add missing affiliate management policies
CREATE POLICY "Users can update own affiliate data"
  ON public.affiliates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all affiliates"
  ON public.affiliates FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete affiliates"
  ON public.affiliates FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
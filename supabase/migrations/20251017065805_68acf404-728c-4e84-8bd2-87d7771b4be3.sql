-- Fix admin bootstrap issue by making the first user an admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  first_user_is_admin boolean;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Check if this is the first user (excluding the new user)
  SELECT COUNT(*) = 0 INTO first_user_is_admin 
  FROM auth.users 
  WHERE id != NEW.id;
  
  -- First user gets admin role, rest get user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN first_user_is_admin THEN 'admin' ELSE 'user' END);
  
  RETURN NEW;
END;
$$;
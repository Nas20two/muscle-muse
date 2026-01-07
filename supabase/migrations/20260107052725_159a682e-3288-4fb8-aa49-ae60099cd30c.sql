-- Remove email column from profiles table (auth.users already has it)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Update handle_new_user function to not store email and add input validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  safe_display_name TEXT;
BEGIN
  -- Sanitize display name: limit length, trim whitespace, use email prefix as fallback
  safe_display_name := LEFT(
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
      split_part(NEW.email, '@', 1)
    ),
    100
  );
  
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, safe_display_name);
  
  RETURN NEW;
END;
$$;
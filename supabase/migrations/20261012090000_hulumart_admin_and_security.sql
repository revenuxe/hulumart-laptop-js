-- Provision only the explicitly requested, verified account; never trust signup metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.make_user_admin(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.make_user_admin(TEXT) TO service_role;

DO $$
DECLARE admin_uid UUID; t RECORD;
BEGIN
  SELECT id INTO admin_uid FROM auth.users
  WHERE lower(email) = 'admin@hulumart.com' AND email_confirmed_at IS NOT NULL;
  IF admin_uid IS NULL THEN
    RAISE EXCEPTION 'Create and confirm admin@hulumart.com before applying this migration';
  END IF;
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (admin_uid, 'admin@hulumart.com', 'Hulumart Admin')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_uid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Full application management remains subject to a server-checked admin role.
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
    EXECUTE format('DROP POLICY IF EXISTS "Hulumart admins manage all" ON public.%I', t.tablename);
    EXECUTE format('CREATE POLICY "Hulumart admins manage all" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t.tablename);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t.tablename);
  END LOOP;
END $$;

-- Rebrand existing seeded articles without modifying IDs or slugs.
UPDATE public.blogs SET
  title = replace(title, 'Laptap', 'Hulumart'),
  excerpt = replace(excerpt, 'Laptap', 'Hulumart'),
  content = replace(replace(replace(content, 'https://www.laptap.in', 'https://www.hulumart.com'), 'Laptap.in', 'Hulumart.com'), 'Laptap', 'Hulumart'),
  meta_title = replace(meta_title, 'Laptap', 'Hulumart'),
  meta_description = replace(meta_description, 'Laptap', 'Hulumart'),
  author = replace(author, 'Laptap', 'Hulumart');

NOTIFY pgrst, 'reload schema';

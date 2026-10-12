-- Linked-project smoke test. Every test write is rolled back.
BEGIN;
SET LOCAL ROLE anon;
DO $$
DECLARE receipt TEXT; selected_model UUID;
BEGIN
  SELECT id INTO selected_model FROM public.models WHERE active LIMIT 1;
  IF selected_model IS NULL THEN RAISE EXCEPTION 'No public catalog models'; END IF;
  receipt := public.create_sell_booking(selected_model, 'Migration Test', '9999999999', '560045');
  IF receipt NOT LIKE 'HUL-%' THEN RAISE EXCEPTION 'Invalid sell receipt'; END IF;
  receipt := public.create_repair_booking(jsonb_build_object('customer_name', 'Migration Test',
    'customer_phone', '9999999999', 'model_name', 'Test laptop', 'issue_category', 'Hardware'));
  IF receipt IS NULL THEN RAISE EXCEPTION 'Missing repair receipt'; END IF;
  INSERT INTO public.contact_submissions(name,email,message)
  VALUES('Migration Test','migration-test@example.invalid','Rollback test');
  INSERT INTO public.simple_forms(name,phone,selling_type,model)
  VALUES('Migration Test','9999999999','laptop','Test laptop');
  IF EXISTS (SELECT 1 FROM public.sell_requests) OR EXISTS (SELECT 1 FROM public.repair_requests)
     OR EXISTS (SELECT 1 FROM public.contact_submissions) THEN
    RAISE EXCEPTION 'Guest can read private customer records';
  END IF;
  IF has_function_privilege('anon','public.make_user_admin(text)','EXECUTE') THEN
    RAISE EXCEPTION 'Public admin escalation remains enabled';
  END IF;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub', (SELECT id::text FROM auth.users WHERE email='admin@hulumart.com'), true);
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Admin role missing'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.sell_requests WHERE config->>'customer_name'='Migration Test')
     OR NOT EXISTS (SELECT 1 FROM public.contact_submissions WHERE email='migration-test@example.invalid') THEN
    RAISE EXCEPTION 'Admin cannot manage submissions';
  END IF;
  UPDATE public.contact_submissions SET message='Admin update verified' WHERE email='migration-test@example.invalid';
  DELETE FROM public.contact_submissions WHERE email='migration-test@example.invalid';
END $$;
ROLLBACK;
SELECT 'PASS: catalog, guest bookings, contact/quick forms, privacy, admin read/update/delete; all writes rolled back' AS result;

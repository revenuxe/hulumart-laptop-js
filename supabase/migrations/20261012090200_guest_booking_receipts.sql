-- Return only the newly created receipt; guest customers cannot read other orders.
CREATE OR REPLACE FUNCTION public.generate_sell_order_number()
RETURNS TEXT LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'HUL-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', '') FROM 1 FOR 12));
$$;

CREATE OR REPLACE FUNCTION public.create_sell_booking(
  selected_model UUID, customer_name TEXT, customer_phone TEXT, pickup_pincode TEXT
) RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE receipt TEXT;
BEGIN
  IF length(trim(customer_name)) NOT BETWEEN 2 AND 120
     OR customer_phone !~ '^[0-9+ ()-]{10,20}$'
     OR pickup_pincode !~ '^[1-9][0-9]{5}$'
     OR customer_name IS NULL OR customer_phone IS NULL OR pickup_pincode IS NULL THEN
    RAISE EXCEPTION 'Valid name, phone number, and six-digit pickup pincode are required';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.models WHERE id = selected_model AND active = true) THEN
    RAISE EXCEPTION 'Selected model is unavailable';
  END IF;
  INSERT INTO public.sell_requests (user_id, model_id, age_months, condition, estimated_price, pincode, config)
  VALUES (auth.uid(), selected_model, 0, 'good', 0, pickup_pincode,
    jsonb_build_object('customer_name', trim(customer_name), 'customer_mobile', customer_phone, 'booking_source', 'model_selection'))
  RETURNING order_number INTO receipt;
  RETURN receipt;
END;
$$;
REVOKE ALL ON FUNCTION public.create_sell_booking(UUID,TEXT,TEXT,TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_sell_booking(UUID,TEXT,TEXT,TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_repair_booking(details JSONB)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE receipt TEXT;
BEGIN
  IF coalesce(length(trim(details->>'customer_name')), 0) NOT BETWEEN 2 AND 120
     OR coalesce(details->>'customer_phone', '') !~ '^[0-9+ ()-]{10,20}$'
     OR coalesce(length(trim(details->>'model_name')), 0) NOT BETWEEN 1 AND 200
     OR coalesce(length(trim(details->>'issue_category')), 0) NOT BETWEEN 1 AND 120
     OR length(coalesce(details->>'issue_details', '')) > 5000 THEN
    RAISE EXCEPTION 'Valid customer, model, and repair details are required';
  END IF;
  INSERT INTO public.repair_requests(user_id, brand_id, model_name, customer_name, customer_email,
    customer_phone, issue_category, issue_subcategory, issue_details, preferred_date, status)
  VALUES(auth.uid(), (details->>'brand_id')::UUID, trim(details->>'model_name'),
    trim(details->>'customer_name'), details->>'customer_email', details->>'customer_phone',
    details->>'issue_category', details->>'issue_subcategory', details->>'issue_details',
    (details->>'preferred_date')::TIMESTAMPTZ, 'pending')
  RETURNING order_number INTO receipt;
  RETURN receipt;
END;
$$;
REVOKE ALL ON FUNCTION public.create_repair_booking(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_repair_booking(JSONB) TO anon, authenticated;
NOTIFY pgrst, 'reload schema';

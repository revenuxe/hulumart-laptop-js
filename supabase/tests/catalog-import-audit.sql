SELECT jsonb_build_object(
  'categories', (SELECT jsonb_agg(to_jsonb(c)) FROM public.categories c),
  'brands', (SELECT jsonb_agg(to_jsonb(b)) FROM public.brands b),
  'series', (SELECT jsonb_agg(to_jsonb(s)) FROM public.series s),
  'models', (SELECT jsonb_agg(to_jsonb(m)) FROM public.models m),
  'modelReferences', (SELECT jsonb_agg(jsonb_build_object('table', conrelid::regclass::text, 'constraint', conname, 'definition', pg_get_constraintdef(oid))) FROM pg_constraint WHERE confrelid = 'public.models'::regclass AND contype = 'f'),
  'uniqueConstraints', (SELECT jsonb_agg(jsonb_build_object('table', conrelid::regclass::text, 'definition', pg_get_constraintdef(oid))) FROM pg_constraint WHERE conrelid IN ('public.brands'::regclass,'public.series'::regclass,'public.models'::regclass) AND contype = 'u')
) AS catalog;

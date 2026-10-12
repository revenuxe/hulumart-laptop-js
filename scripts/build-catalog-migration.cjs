const fs = require('fs');
const plan = JSON.parse(fs.readFileSync('docs/catalog/import-plan-2026-10-12.json', 'utf8'));
if (plan.decisions.some(row => row.action === 'review')) throw Error('Resolve ambiguous matches before generating SQL');
const slug = value => value.toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rows = plan.decisions.map(row => ({
  brand_slug: slug(row.brand), series_name: row.seriesName, series_slug: slug(row.seriesName),
  source_series: row.series, source_model: row.model, launch_year: row.year,
  model_name: /\b20\d{2}\b/.test(row.model) ? row.model : `${row.model.replace(/\s*\((original model|new model|announced)\)/g, '')} (${row.year})`,
  model_slug: row.slug, existing_name: row.existingName, announced: row.announced,
  approximate_year: row.approximateYear, year_conflict: row.yearConflict || null,
}));
const sql = `-- User-provided catalog, imported 2026-10-12. Launch years are supplied data,
-- not independently verified release claims. Existing IDs, prices, slugs, and
-- hardware configuration variants are preserved. No bookings are deleted.
BEGIN;
LOCK TABLE public.brands, public.series, public.models IN SHARE ROW EXCLUSIVE MODE;

CREATE TABLE IF NOT EXISTS public.catalog_import_records (
  source_key text NOT NULL,
  brand_slug text NOT NULL,
  source_series text NOT NULL,
  source_model text NOT NULL,
  launch_year integer NOT NULL CHECK (launch_year BETWEEN 1980 AND 2100),
  model_id uuid NOT NULL REFERENCES public.models(id) ON DELETE RESTRICT,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  imported_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source_key, brand_slug, source_model, launch_year)
);
ALTER TABLE public.catalog_import_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins manage catalog import records" ON public.catalog_import_records;
CREATE POLICY "Admins manage catalog import records" ON public.catalog_import_records FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_import_records TO authenticated;
GRANT ALL ON public.catalog_import_records TO service_role;

CREATE TEMP TABLE incoming_catalog (payload jsonb) ON COMMIT DROP;
INSERT INTO incoming_catalog VALUES ($catalog$${JSON.stringify(rows)}$catalog$::jsonb);

DO $import$
#variable_conflict use_variable
DECLARE
  row jsonb;
  category_id uuid;
  brand_id uuid;
  series_id uuid;
  model_id uuid;
  matched_name text;
  inserted_models integer := 0;
  reused_models integer := 0;
BEGIN
  SELECT c.id INTO STRICT category_id FROM public.categories c WHERE c.slug = 'laptop';
  FOR row IN SELECT jsonb_array_elements(payload) FROM incoming_catalog LOOP
    SELECT b.id INTO STRICT brand_id FROM public.brands b WHERE b.category_id = category_id AND b.slug = row->>'brand_slug';
    -- Reuse existing series, including established family-name aliases.
    SELECT s.id INTO series_id FROM public.series s WHERE s.brand_id = brand_id AND lower(trim(s.name)) = lower(trim(row->>'series_name')) ORDER BY s.created_at, s.id LIMIT 1;
    IF series_id IS NULL THEN
      INSERT INTO public.series(brand_id, name, slug) VALUES (brand_id, row->>'series_name', row->>'series_slug') RETURNING id INTO series_id;
    END IF;

    -- An earlier import of the same source row is an exact match.
    SELECT r.model_id INTO model_id FROM public.catalog_import_records r WHERE r.source_key = 'user-list-2026-10-12'
      AND r.brand_slug = row->>'brand_slug' AND r.source_model = row->>'source_model' AND r.launch_year = (row->>'launch_year')::integer;
    IF model_id IS NULL AND row->>'existing_name' IS NOT NULL THEN
      SELECT m.id INTO model_id FROM public.models m JOIN public.series s ON s.id = m.series_id
        WHERE s.brand_id = brand_id AND m.name = row->>'existing_name' ORDER BY m.created_at, m.id LIMIT 1;
      IF model_id IS NULL THEN RAISE EXCEPTION 'Expected existing model missing: %', row->>'existing_name'; END IF;
    END IF;
    IF model_id IS NULL THEN
      SELECT m.id INTO model_id FROM public.models m WHERE m.series_id = series_id AND
        (lower(trim(m.name)) = lower(trim(row->>'model_name')) OR m.slug = row->>'model_slug') ORDER BY m.created_at, m.id LIMIT 1;
    END IF;
    IF model_id IS NULL THEN
      INSERT INTO public.models(series_id, name, slug, base_price, description, active)
      VALUES (series_id, row->>'model_name', row->>'model_slug', 0,
        CASE WHEN (row->>'announced')::boolean THEN 'Announced model from supplied catalog; not available for booking.' ELSE 'Configuration and condition are confirmed during assessment.' END,
        NOT (row->>'announced')::boolean) RETURNING id INTO model_id;
      inserted_models := inserted_models + 1;
    ELSE
      reused_models := reused_models + 1;
    END IF;
    INSERT INTO public.catalog_import_records(source_key, brand_slug, source_series, source_model, launch_year, model_id, metadata)
    VALUES ('user-list-2026-10-12', row->>'brand_slug', row->>'source_series', row->>'source_model', (row->>'launch_year')::integer, model_id,
      jsonb_build_object('year_source','user_provided','approximate_year',(row->>'approximate_year')::boolean,'announced',(row->>'announced')::boolean,'year_conflict',row->'year_conflict','requested_series',row->>'series_name'))
    ON CONFLICT (source_key, brand_slug, source_model, launch_year) DO NOTHING;
  END LOOP;
  IF (SELECT count(*) FROM public.catalog_import_records WHERE source_key = 'user-list-2026-10-12') <> ${rows.length} THEN
    RAISE EXCEPTION 'Catalog import did not cover every source row';
  END IF;
  RAISE NOTICE 'Catalog import: % inserted, % reused', inserted_models, reused_models;
END;
$import$;

COMMIT;
`;
fs.writeFileSync('supabase/migrations/20261012140000_import_user_laptop_catalog.sql', sql);
const replay = sql.match(/DO \$import\$[\s\S]*?\$import\$;/)[0];
fs.writeFileSync('.next-area-verify/catalog-dry-run.sql', sql.replace(/COMMIT;\s*$/, `${replay}\nSELECT (SELECT count(*) FROM public.catalog_import_records WHERE source_key = 'user-list-2026-10-12') AS imported_source_rows, (SELECT count(*) FROM public.models) AS total_models, (SELECT count(*) FROM public.series) AS total_series;\nROLLBACK;\n`));
console.log('Migration generated:', rows.length, 'source records');

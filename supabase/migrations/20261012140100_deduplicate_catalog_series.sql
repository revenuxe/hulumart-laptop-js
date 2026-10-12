-- Consolidate exact series duplicates with the same brand, name, and URL slug.
-- Model IDs and route paths remain unchanged.
BEGIN;
LOCK TABLE public.series, public.models IN SHARE ROW EXCLUSIVE MODE;

DO $merge$
DECLARE
  duplicate record;
BEGIN
  FOR duplicate IN
    WITH ranked AS (
      SELECT s.id, s.brand_id, s.name, s.slug,
        first_value(s.id) OVER (PARTITION BY s.brand_id, lower(trim(s.name)), coalesce(s.slug, '') ORDER BY (SELECT count(*) FROM public.models m WHERE m.series_id = s.id) DESC, s.created_at, s.id) AS survivor
      FROM public.series s
    ) SELECT * FROM ranked WHERE id <> survivor
  LOOP
    UPDATE public.models SET series_id = duplicate.survivor WHERE series_id = duplicate.id;
    DELETE FROM public.series WHERE id = duplicate.id;
  END LOOP;
END;
$merge$;

CREATE UNIQUE INDEX IF NOT EXISTS series_brand_name_unique ON public.series(brand_id, lower(trim(name)));
CREATE UNIQUE INDEX IF NOT EXISTS series_brand_slug_unique ON public.series(brand_id, slug) WHERE slug IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS models_series_name_unique ON public.models(series_id, lower(trim(name)));
CREATE UNIQUE INDEX IF NOT EXISTS models_series_slug_unique ON public.models(series_id, slug) WHERE slug IS NOT NULL;
COMMIT;

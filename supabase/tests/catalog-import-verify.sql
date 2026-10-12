DO $verify$
BEGIN
  IF (SELECT count(*) FROM public.catalog_import_records WHERE source_key = 'user-list-2026-10-12') <> 618 THEN RAISE EXCEPTION 'Missing source entries'; END IF;
  IF EXISTS (SELECT 1 FROM public.catalog_import_records r JOIN public.models m ON m.id = r.model_id WHERE r.source_key = 'user-list-2026-10-12' AND (r.metadata->>'announced')::boolean AND m.active) THEN RAISE EXCEPTION 'Announced model is bookable'; END IF;
  IF EXISTS (SELECT 1 FROM public.models m JOIN public.series s ON s.id = m.series_id GROUP BY s.brand_id, lower(trim(m.name)) HAVING count(*) > 1) THEN RAISE EXCEPTION 'Duplicate model names within brand'; END IF;
  IF EXISTS (SELECT 1 FROM public.series GROUP BY brand_id, lower(trim(name)) HAVING count(*) > 1) THEN RAISE EXCEPTION 'Duplicate series names within brand'; END IF;
END;
$verify$;

SELECT (SELECT count(*) FROM public.catalog_import_records WHERE source_key = 'user-list-2026-10-12') AS source_entries,
  (SELECT count(*) FROM public.models) AS total_models,
  (SELECT count(*) FROM public.series) AS total_series,
  (SELECT count(*) FROM public.catalog_import_records WHERE metadata->'year_conflict' <> 'null'::jsonb) AS recorded_year_conflicts,
  (SELECT count(*) FROM public.catalog_import_records WHERE (metadata->>'announced')::boolean) AS inactive_announced_models;

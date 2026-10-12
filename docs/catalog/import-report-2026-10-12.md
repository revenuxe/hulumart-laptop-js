# Laptop catalog import — 12 October 2026

Applied to linked project `snnnurtjzdkjweoewrwf` using the Supabase CLI.

## Results

- 618 source rows across 10 brands and 38 source series groups.
- 558 new models inserted; 60 source entries reused existing models.
- All 231 original model IDs, names, slugs, prices, active states, and parent-series references preserved.
- 25 series added. Two pre-existing duplicate Dell series (Inspiron and Latitude) removed; each had the same brand, name, and slug as its retained record. Final catalog: 57 series and 789 models.
- No exact duplicate model names remained within a brand. Configuration-specific models remain distinct from generic hardware entries.
- Reused models retain their established series and URLs; the source's requested group is recorded in the import manifest. New models use the curated source groups, with HP gaming entries assigned to Omen or Victus.
- Surface Laptop Ultra is recorded as announced and inactive, as specified in the source. It does not appear among active booking options.
- No invented specifications or offers: new models use the existing neutral base-price default of zero.

## Source and year handling

The attached document supplied names and launch years. The import does not independently certify these facts. Its narrative and publisher labels were treated as source content, not migration instructions. `2015-era` remains an approximate source year in the manifest.

Five existing labels disagree with supplied years: XPS 13 9360, ProBook 440 G7, ProBook 440 G8, ProBook 450 G8, and Notebook 9 Pro. Existing labels are preserved; the different supplied years are recorded under `catalog_import_records.metadata.year_conflict` for review.

Repeated names with distinct years (for example MacBook Retina 12-inch and Latitude 3450) remain separate generations. A plus sign is preserved in identities and slugs, so Surface Pro 7 and 7+ are distinct.

## Validation

The full import was executed twice inside a rollback-only transaction before applying it, confirming repeat execution created no extra models. Only the two new migrations were applied. Post-import SQL checks verified all source rows, duplicate-free series/model names, and the inactive announced entry. Before/after comparison verified all existing model records were preserved. Unique indexes now prevent duplicate names and slugs within their parent series or brand.

Import provenance is stored in the admin-only `catalog_import_records` table. No customer records or booking references were deleted. The source dataset and import plan are saved alongside this report.

Migrations:

- `20261012140000_import_user_laptop_catalog.sql`
- `20261012140100_deduplicate_catalog_series.sql`

Re-run checks with `npx supabase db query --linked --file supabase/tests/catalog-import-verify.sql`.

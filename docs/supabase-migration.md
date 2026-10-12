# Hulumart Supabase setup

Target: `snnnurtjzdkjweoewrwf` (Hulumart Laptop).

Applied the repository migrations plus Hulumart admin, internal-function hardening, and guest receipt fixes. Seeded 3 categories, 10 brands, 34 series, 231 models, and 6 blog posts. Created the brand-logos, series-images, and model-thumbnails storage buckets and their policies.

The existing confirmed `admin@hulumart.com` user has the application admin role. Sign in at `/admin` with that account's existing password. This is full application access enforced by RLS, not a database superuser or Supabase organization membership. Signup metadata cannot grant admin access; the old public admin-grant helper is restricted to the service role.

Auth Site URL is `https://www.hulumart.com`; production and localhost:3000 redirects are configured. Hosting must use the new Supabase URL and publishable key documented in README.md and be rebuilt.

`generate-blog` is deployed with authenticated admin checks. Configure `GEMINI_API_KEY` in Supabase Edge Function secrets before using AI generation. No AI provider secret was configured during migration.

This installs schema and seed data from the repository. It does not copy historical customers, orders, passwords, or uploaded files from the previous Supabase project; that project was not available in the connected CLI account. Existing confirmed users in the target were preserved.

Validation: database lint, publishable-key catalog/private-record checks, and the rollback-only test in `supabase/tests/hulumart-smoke.sql`. Re-run with `npx supabase db query --linked --file supabase/tests/hulumart-smoke.sql`.

An isolated production build can run with `NEXT_BUILD_DIR=.next-verify` when a development preview is using `.next`.

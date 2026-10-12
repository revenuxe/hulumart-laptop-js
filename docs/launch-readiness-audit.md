# Launch readiness audit — 12 October 2026

Verdict: hold the public launch of this laptop application until the blockers below are resolved. SEO foundations exist, but rendered output and business flows have defects. No deployment or application fixes were performed during this audit.

## Scope and evidence

- Inspected application source, metadata, navigation, forms, database policies, and production configuration.
- Served the existing successful production build in `.next-verify` on localhost:3107 and checked 44 URLs. This build predates the most recent cosmetic, favicon, and scrolling edits; the audited SEO/form findings were cross-checked against current source. Raw route results: `launch-audit-routes.json`.
- Re-ran rollback-only Supabase tests: catalog reads, sell/repair RPC bookings, contact/quick forms, customer-record privacy, and admin read/update/delete passed. All test writes rolled back.
- Queried the current npm production dependency audit and Supabase security advisor.
- Checked the public domain directly over HTTPS. It serves the broader Hulumart marketplace; `/sell/laptop` returns HTTP 404.
- Did not run browser automation, Lighthouse/Core Web Vitals measurement, real admin sign-in, Rich Results Test, email delivery tests, or Search Console verification. Database-level success does not prove browser form usability.

## Blockers

1. **Unsupported framework with critical audit findings.** Installed Next.js is 14.2.35. `npm audit --omit=dev` reports 10 vulnerable packages: 1 critical, 7 high, 2 moderate. Counts are affected package counts, not distinct exploitable issues. Next.js findings include Windows-hosted remote code execution and AVIF image-optimizer remote code execution; applicability depends on deployment and enabled paths. Upgrade to a supported patched framework and recheck before launch. Do not blindly use `npm audit fix --force`.
   - https://nextjs.org/support-policy
   - https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36
   - https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4
2. **Production domain conflict.** `https://www.hulumart.com/` currently returns the general marketplace, not this checkout. `/sell/laptop` returns 404. Decide whether this app replaces the marketplace, is integrated into it, or uses a dedicated subdomain. Do not overwrite the existing site without resolving this.
3. **Repair form cannot collect its required email.** `app/repair/form/page-client.tsx` initializes email to an empty string, requires a valid email with Zod, and disables the email input. Visitors cannot satisfy validation. Enable and test the complete browser flow.
4. **Public inserts can bypass booking RPC validation.** Guest policies for sell and repair requests still permit direct inserts with `WITH CHECK (true)`. The new RPCs validate their inputs, but the public API can insert directly, potentially supplying customer ownership, status, or pricing fields. Restrict table writes and make the validated booking endpoint the only public entry point after auditing all callers. Add abuse protection to guest booking/contact submissions; no application CAPTCHA or rate limiter was found in the reviewed paths.

## SEO corrections required

5. **Static sitemap shadows the generated sitemap.** The served `/sitemap.xml` exactly matches `public/sitemap.xml`, rather than the updated `app/sitemap.ts` output. Five Hyderabad entries return 404. It also includes `/dashboard` (a redirect), `/sell/mobile` (unsupported category), and only the older blog inventory. Consolidate to one maintained sitemap of canonical, indexable HTTP 200 URLs; include valid catalog/guide URLs where appropriate.
6. **Crawler rules and private indexing are incorrect.** Both robots sources give Googlebot/Bingbot their own unrestricted group. They do not inherit the wildcard group's private-route exclusions. `/admin`, `/admin/dashboard`, `/track/test`, `/repair/form`, and `/repair/thank-you` render `index, follow`. Add correct page-specific noindex directives, including Googlebot metadata, and consolidate crawler rules. Robots exclusions do not secure private data.
   - https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
7. **Duplicate brand names in titles.** Child titles already contain Hulumart, and the layout appends it again. Example: `Admin Login - Hulumart | Hulumart`; public marketing and blog titles have the same issue. Use one consistent title strategy.
8. **Invalid catalog paths return HTTP 200.** `/sell/laptop/not-a-real-brand` renders a manufactured title and a success response. `/sell/mobile` renders laptop metadata. Validate category and parent-child catalog relationships server-side and return real 404s for nonexistent routes.
9. **Review schema needs evidence and policy review.** Layout emits a hardcoded 4.8 score and 500 reviews. The audit did not establish a verifiable source. Google does not allow self-serving LocalBusiness reviews to earn review stars. Remove unsupported markup; verify address, hours, pickup/payment guarantees and differing customer-count claims before publication.
   - https://developers.google.com/search/docs/appearance/structured-data/review-snippet
10. **Measurement is not configured.** GA4 uses `G-XXXXXXXXXX`. Configure a real measurement ID or omit the placeholder script; verify Search Console ownership and submit the corrected sitemap after deploying to the final domain.

## Additional findings

- Invoice generation still includes `www.laptap.in`, `laptap.in@gmail.com`, and `Hulumart.in` in `utils/invoiceGenerator.ts`.
- Existing social links still target Laptap profiles; replace when verified Hulumart profile URLs are available.
- AI blog generation has no provider secret configured. It is optional for visitor launch, but not ready for admin use.
- Supabase leaked-password protection is disabled. Its remaining SECURITY DEFINER warnings include intentionally public guest receipt functions and the role-check helper; these are not proof of a vulnerability by themselves. Keep intentional execution permissions, validate inputs, and retain RLS tests.
- Sitemap timestamps, missing catalog URLs, mobile image sizes/layout shifts, performance and accessibility require further review. No performance scores or ranking guarantees are claimed.
- Confirm hosting environment variables reference the new Supabase project before rebuilding. The audit cannot verify the deployment provider's environment.

## What is already working

Canonical-domain branding, page descriptions, organization/local-business and blog/breadcrumb schema foundations, sitemap/robots infrastructure, database schema and seeded catalog, verified admin role, private-record RLS, and database-level guest receipt creation. A production build previously completed successfully. These are useful foundations, not a production approval or a guarantee of rankings.

## Release gate

Resolve blockers 1–4; correct sitemap/indexing/title/invalid-route issues; verify factual claims and final-domain ownership; run a fresh production build and dependency audit; complete mobile browser tests for sell, repair, contact, navigation, admin sign-in and uploads; check the deployed HTTPS domain, redirects, metadata, robots and sitemap; then run Rich Results Test, mobile performance checks and Search Console inspection.

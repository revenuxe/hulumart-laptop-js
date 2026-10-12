# Launch readiness recheck — 12 October 2026

Verdict: not ready for unrestricted public promotion. The laptop site is already reachable on the production domain, but launch blockers remain. This recheck supersedes the earlier report where its live-domain and sitemap observations differ. No application fixes or deployment were performed during this review.

## Fresh results

- Latest local production build passed: compilation, type validation, and 41 generated pages.
- Remote migrations are up to date. Rollback-only catalog, booking, contact, privacy, and admin CRUD smoke tests passed; no test records were retained.
- Live `https://www.hulumart.com/` now serves the laptop application; `/sell/laptop` returns 200. The earlier marketplace/domain conflict is resolved.
- Crawled the live sitemap plus admin/tracking and invalid-route probes: 40 URLs reached HTTP 200 responses. This verifies availability, not correctness of every page or redirect. No previous Hyderabad 404 entries were observed in the current live sitemap.
- 39 of the 40 checked titles contain Hulumart more than once. Admin, dashboard and tracking probes emit `index, follow`.
- `/sell/laptop/not-a-real-brand` returns 200, an indexable manufactured title, and a self-referencing canonical instead of a 404.
- Current robots.txt still has unrestricted Googlebot/Bingbot groups that override wildcard exclusions.
- npm production dependency audit still reports 10 affected packages: 1 critical, 7 high, 2 moderate. Installed Next.js remains 14.2.35, an unsupported major. Exploitability of each advisory depends on hosting and enabled functionality; upgrade to a supported patched version and verify again.

Raw live results: `launch-audit-live-recheck.json`.

## Required before launch approval

1. Upgrade unsupported/vulnerable dependencies and repeat the production build and security audit.
2. Fix `app/repair/form/page-client.tsx`: email defaults to empty, is required by validation, and its input is disabled. Database RPC tests do not validate the browser form.
3. Restrict direct public table inserts so guests cannot bypass validated booking RPCs or supply ownership, pricing and order-status fields. Add submission-abuse protection. Existing RLS protects reads, but read privacy alone does not validate public writes.
4. Add correct noindex directives for admin, tracking and booking utility pages, including Googlebot overrides. Consolidate robots rules.
5. Validate catalog paths on the server and return actual 404s for nonexistent categories/brands/series/models. Correct duplicated branding in titles.
6. Configure real Analytics or remove placeholder `G-XXXXXXXXXX`; verify hardcoded review/customer claims; correct remaining invoice branding. Add the AI provider secret if the optional generator is needed.
7. Complete real mobile/desktop browser tests for sell, repair, contact, admin login/upload, errors and navigation. Measure accessibility and Core Web Vitals; inspect the final deployment with Search Console and Rich Results Test.

## Verification limits

No browser automation, Lighthouse, actual admin password sign-in, email delivery, Search Console, or rich-result validation was performed. Passing build, HTTP and SQL checks does not establish all user-facing interactions work or guarantee SEO rankings. The mobile brand-card change remains local and uncommitted at the time of this check.

References:
- https://nextjs.org/support-policy
- https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec
- https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36
- https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4

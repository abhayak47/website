# Onjaal website: discoverability audit

Audited: the repository at the state of branch `fix-ci-line-endings` (static HTML site, GitHub Pages, custom domain `onjaal.com`).
Method: source inspection, local rendering in Edge, automated checks (`tools/check_site.py`, `tools/check_seo.py`).
Not possible from source alone: live-production behaviour, indexing status, Search Console / Bing data, real-device testing. Those are listed at the end.

## 0. Architecture baseline (verified from the repo)

| Area | Finding |
|---|---|
| Stack | Plain static HTML/CSS/JS. No framework, no bundler, no backend. 18 HTML pages. Python helpers in `tools/` generate the shared header/footer, pricing page and guides |
| Rendering | Every page is fully server-delivered HTML. Crawlers get all marketing content without running JavaScript (JavaScript only powers the nav, theme toggle, product tour, pricing estimator, preview and form). No SSR migration is needed |
| Hosting | GitHub Pages (`CNAME` = `onjaal.com`, `.nojekyll`). Cannot set HTTP headers or server-side redirects |
| Forms | One enquiry form posting to FormSubmit (`tech@onjaal.com`) with an in-page success state and a `/thanks/` fallback |
| Analytics | None. `assets/js/consent.js` contains a consent-aware GA4 loader that is inert while its ID is empty |
| Search tooling | No Search Console or Bing verification in the repo |
| Application / login | None in this repository. There is no product login, dashboard or private route here, so none could be affected |

## 1. Findings

### Critical

**C1. The testimonials were invented. RESOLVED 2026-10-15: removed from the home and About pages.**
`index.html` and `about/index.html` show quotes attributed to named people at named kinds of companies (Neha Iyer, Rajesh Agarwal, Farhana Sheikh). None come from real customers. The disclaimer line was removed at the owner's request.
*Impact:* presenting invented reviews as real can mislead visitors, damages trust if discovered, and may breach consumer-protection rules on fake reviews. It also contradicts this mission's own rule (no invented customers or testimonials).
*Fix:* removed. Re-add only genuine, written-permission testimonials with the person's real name, role and company.

**C2. Pricing tiers and plan features are not confirmed by the business.**
The original site verifiably published: ₹59 per user per month, ₹60,000 implementation (150 users) and ₹15,000 biometric integration. The Free plan (up to 5 employees), Premium at ₹99, monthly rates (₹71, ₹119), and the feature split between Free / Standard / Premium / Enterprise were proposed in a working session and are not confirmed facts. They appear in visible copy, the comparison table, the estimator, the FAQ and `Offer` structured data.
*Impact:* a published price or free plan the company will not honour is a legal and reputational risk.
*Fix:* owner confirms or corrects (see `brand-information-needed.md`). Structured-data prices are checked against visible text by `check_seo.py`, so a correction in one place cannot silently contradict the other.

### High

**H1. Product capability claims need confirmation.**
Beyond the original copy, the site now names: "Advanced reporting", "Priority support", "Dedicated implementation team", "Security review support", "Custom workflows and integrations", "Approval workflows", "HR documents". Feature status (live vs in development) is also unknown for recruitment, onboarding/offboarding, expenses and performance management, which the brief lists as product areas but the site does not currently claim. Fix: owner marks each as Live / In development / Roadmap; copy is aligned. See `brand-information-needed.md`.

**H2. Identity facts are missing for trust and structured data.**
No legal entity name, registered address, GSTIN/CIN, grievance officer, phone number, social profiles or named leadership appear anywhere. The `Organization` schema therefore has no `sameAs`, address or founding date. Fix: supply the facts; do not invent them. Status: listed in `brand-information-needed.md`.

**H3. Conflicting structured data (fixed).**
`/pricing/` and `/products/hrms/` each defined their own anonymous `SoftwareApplication` with different `Offer` data; article publishers were repeated inline. Fixed: one `SoftwareApplication` with a stable `@id` (`https://onjaal.com/products/hrms/#software`) carrying all offers on `/pricing/` only, referenced everywhere else; `Organization` (`#organization`) and `WebSite` (`#website`) are defined once on the home page and referenced by `@id` from Articles and the software entity. `check_seo.py` now enforces this.

**H4. Brand positioning was inconsistent (fixed).**
Home title/H1 ("Connected business software…" / "Simpler HR for growing teams"), the logo tagline ("Simpler HR. Stronger Teams.") and the brief's positioning ("HR, simplified for growing businesses") all differed. Fixed on the home page: title, description, social tags, `Organization.slogan` and H1 now use *"HR, simplified for growing businesses"*. The logo tagline and the HRMS page H1 still use *"Simpler HR. Stronger Teams."* because they are brand assets; owner should pick one primary line.

**H5. Internal tooling would be publicly crawlable (fixed).**
GitHub Pages publishes every file in the repo, including `tools/` and the new `docs/`. `robots.txt` now disallows `/docs/`, `/tools/` and `/.github/`. Note: `robots.txt` is a request to crawlers, not access control. Anything in `docs/` is technically fetchable at `https://onjaal.com/docs/...`. These reports contain no secrets, but if that is unwanted, keep `docs/` out of the published branch or repository.

**H6. No analytics, Search Console or Bing Webmaster Tools.**
Nothing can be measured or monitored, and the sitemap has not been submitted anywhere. Fix: external accounts required. See `search-engine-setup.md`. GA4 loader is built but disabled until the owner supplies a Measurement ID and the privacy copy is updated.

### Medium

**M1. Heading hierarchy skipped levels (fixed).** `/pricing/` and `/resources/` went from `h1` straight to `h3` (cards). Added visually hidden `h2` landmarks. `check_seo.py` now fails on any skipped level.

**M2. No automated SEO regression guard (fixed).** Added `tools/check_seo.py` (canonical strategy, sitemap vs robots, private paths, heading order, JSON-LD validity/consistency, no rating or review markup, offer prices visible) and wired it into the GitHub workflow alongside `check_site.py`. Mutation-tested: it fails on an injected rating, a mismatched price, a skipped heading and a missing robots rule.

**M3. Thin organic content footprint.** Five guides exist (HRMS for Indian SMEs; leave and attendance management; leave policy; attendance policy; choosing HR software). This is a reasonable start. Recommendation: do not mass-produce pages. Add content only when each page answers a real question and can be reviewed (especially anything touching statutory payroll, PF/ESI/PT or labour law, which the guides deliberately do not give authoritative advice on).

**M4. Form delivery depends on a third party.** FormSubmit requires a one-time activation email click for `tech@onjaal.com` before submissions are delivered. The in-page success state only shows when FormSubmit returns success, and falls back to a normal POST otherwise, so submissions are not silently discarded, but the activation must be confirmed on production. The background (AJAX) path relies on a honeypot field; FormSubmit's captcha applies only to the non-JavaScript path. Fix: send a real test enquiry after deploy; consider a service with spam filtering and delivery logs if volume grows.

**M5. No security headers.** GitHub Pages cannot send HSTS, CSP or cache headers. Mitigation options in `search-engine-setup.md` (Cloudflare proxy). Not an SEO blocker.

**M6. Unverified live behaviour.** `www` redirect, HTTPS enforcement, 404 status code for unknown URLs, and Pages deployment status could not be tested from source. See "Requires external access".

### Low

**L1. `llms.txt`.** Evaluated and added as a small, factual file (`/llms.txt`). It is a proposed convention, not a standard. No major AI provider has confirmed it uses the file, so it carries no guaranteed benefit. It costs nothing, duplicates only already-public facts, and `check_seo.py` verifies its links resolve. Remove it if you prefer not to maintain it. Nothing here guarantees any assistant will index, recommend or describe Onjaal correctly.
**L2. Logo alt text** is "Onjaal.com" on the header logo and a tagline on the footer logo. Acceptable.
**L3. Sitemap `lastmod`** is derived from git history by `tools/sync_layout.py`; accurate only if files are committed.
**L4. Share images** are generated from the brand mark with Segoe UI; replace with a designer's artwork when available.

## 2. What was already sound (verified)

Unique titles and descriptions on all 15 indexable pages; canonicals on every indexable page; one `h1` per page; every image has `alt` and explicit dimensions; `thanks` and `404` are `noindex` and excluded from the sitemap; sitemap lists only canonical, trailing-slash HTTPS URLs; no broken internal links or anchors; fonts self-hosted with `font-display: swap`; no horizontal overflow at 390px on any page (CDP emulation); skip link, focus styles, reduced-motion support.

## 3. Requires external access (cannot be confirmed from source)

Live deployment and HTTPS state · `www` to apex redirect · real HTTP status codes · Search Console and Bing verification and indexing · Core Web Vitals field data and Lighthouse scores (CI will produce lab scores on the next pull request) · email deliverability (SPF/DKIM/DMARC) · FormSubmit activation · real-device iOS Safari / Android Chrome checks · any AI-platform representation of the brand.

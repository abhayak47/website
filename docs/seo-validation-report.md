# SEO validation report

Scope: the working tree on branch `fix-ci-line-endings` (changes in this mission are **uncommitted and not pushed**, per the brief).

## 1. Changes made in this mission

| Area | Change |
|---|---|
| Structured data | One `SoftwareApplication` with stable `@id` (`/products/hrms/#software`); offers live only on `/pricing/`; `Organization` (`#organization`) and `WebSite` (`#website`) defined once on the home page and referenced by `@id` from the software entity and all Articles. Added `description`, `slogan`, `areaServed: India` to `Organization`. No ratings, reviews or people markup |
| Home positioning | Title, description, Open Graph/Twitter tags, H1 and `Organization.slogan` aligned to "HR, simplified for growing businesses" |
| Headings | Hidden `h2` landmarks on `/pricing/` and `/resources/` so heading levels never skip |
| robots.txt | Added `Disallow` for `/docs/`, `/tools/`, `/.github/`; sitemap line kept; public site unaffected |
| llms.txt | Added a short factual `/llms.txt` (evaluated; unproven convention, see audit L1) |
| Tests | New `tools/check_seo.py` (canonical strategy, sitemap vs robots, private paths, heading order, JSON-LD validity and `@id` consistency, no rating/review markup, offer prices visible). Wired into `.github/workflows/checks.yml` |
| Docs | `docs/website-discoverability-audit.md`, `brand-information-needed.md`, `search-engine-setup.md`, this report |

Carried over from earlier work (already in the branch): per-page share images, web manifest, `security.txt`, FAQPage markup on `/pricing/` and `/products/hrms/`, five guides, consent-aware GA4 loader (disabled), cache-busting, sitemap dates from git, `check_site.py`, Lighthouse CI configuration.

## 2. Checks actually performed (locally, on this working tree)

| Check | Result |
|---|---|
| `python tools/check_site.py` (links, anchors, JSON-LD parses, one h1, unique ids, aria targets, alt text, title/description length, canonicals, share images, sitemap) | **Pass**, 17 pages, 0 errors, 0 warnings |
| `python tools/check_seo.py` | **Pass**, 17 pages, 3 JSON-LD ids, 0 failures |
| Negative test of `check_seo.py` on a deliberately broken copy (injected AggregateRating, skipped heading, mismatched Offer price, robots rules removed) | **Detected all 6 injected faults**, exit code 1 |
| JavaScript syntax (`node` parse) for all 6 scripts | **Pass** |
| External hosts referenced by any HTML page | Only `onjaal.com` (no third-party scripts, fonts or trackers) |
| Analytics state | `GA4_ID` empty, so no tracking code can load |
| Horizontal overflow at 390 px width (Edge DevTools protocol, 13 page templates incl. both new guides) | **Pass**, no sideways scroll |
| Desktop visual review in Edge (home, pricing, about, products, HRMS, contact, security, resources, guides, thanks, 404; light and dark) | Reviewed visually earlier in the project; no layout faults outstanding |
| Existing user flows | Enquiry form logic, theme toggle, tour tabs, pricing estimator and nav code unchanged by this mission's edits except hero heading text |

Login, registration and dashboards: **not applicable**. This repository contains only the marketing site; there is no application, authentication or private route in it.

## 3. Not performed (needs production access, accounts or real devices)

- Live deployment, HTTPS enforcement, `www` redirect, real HTTP status codes (including the 404 status)
- Google Search Console / Bing verification, sitemap submission, indexing status
- Lighthouse and Core Web Vitals scores (the GitHub workflow will produce lab scores on the next pull request; the Lighthouse job itself has not yet run successfully)
- Google Rich Results Test / Schema Markup Validator (JSON-LD was validated for syntax and internal consistency only)
- FormSubmit activation and end-to-end enquiry delivery; email deliverability (SPF/DKIM/DMARC)
- Real-device iOS Safari and Android Chrome testing, screen-reader testing
- Any AI assistant's representation of Onjaal (cannot be verified or guaranteed)

## 4. Remaining risks

1. ~~Invented testimonials~~ removed 2026-10-15. See `docs/ai-search-misclassification-report.md` for the related public-signal risks (competing old site, contradictory README).
2. **Unconfirmed pricing and plan features** are published and in `Offer` markup.
3. **Unconfirmed capability claims** (see `brand-information-needed.md`, section A).
4. FormSubmit delivery is unverified until activated; the AJAX path has honeypot-only spam protection.
5. GitHub Pages cannot send security headers and publishes every file in the repo (mitigated by `robots.txt` only).
6. No organic content or brand signals exist yet beyond the site itself; ranking depends on time, content quality and genuine external mentions.

## 5. Prioritised next steps

1. Merge the branch so the testimonial removal and the new support page go live; retire the old `abhayak47.github.io/onjaal/` copy.
2. Confirm pricing, the Free plan and feature-by-plan allocation; mark each feature Live / In development / Roadmap.
3. Merge, enable GitHub Pages with HTTPS, add the `www` CNAME, then verify live URLs and the 404 status.
4. Verify Search Console (DNS TXT) and Bing, submit `sitemap.xml`, request indexing for the five key pages.
5. Activate FormSubmit and send a real test enquiry; set up SPF/DKIM/DMARC.
6. Supply company identity facts (legal name, address, GSTIN/CIN, grievance officer, social profiles) so `Organization` markup and trust pages can be completed truthfully.
7. Decide on analytics: create the GA4 property, supply the ID, then update the privacy and trust copy before enabling.
8. Add a small number of genuinely reviewed guides over time; avoid statutory or legal advice without expert review.

## Launch pass (2026-10-15)

Additional checks run on the final working tree, all passing unless noted:

| Check | Result |
|---|---|
| `check_site.py` / `check_seo.py` | 18 pages, 0 errors, 0 failures; sitemap 16 URLs |
| Horizontal overflow, all 18 pages at 360, 390, 768, 1024 px | None |
| Lighthouse, mobile profile: home, about, support, pricing, HRMS, contact, guide | Performance 97 to 99, Accessibility 100, Best Practices 100, SEO 100, CLS 0 |
| Pricing calculator, 80 combinations (1, 5, 6, 150, 1,000 users x plan x billing x add-ons) | 0 mismatches; original 150-user figure reproduces; input clamped to 1 to 1,000 |
| Mouse wheel over the interactive preview | Scrolls the page (previously trapped by an inner scrollbar) |
| Browser user flows (13 checks): preview, tour tabs by keyboard, theme, mobile menu, enquiry form validation / failure / success | 13 of 13 pass; form network call intercepted, nothing sent |
| Keyboard Tab-through and accessible names on 6 pages | 0 issues |
| Colour contrast of design tokens (WCAG AA) | Two failures found and fixed (placeholder text, form field borders) |

Defects found and fixed during this pass: preview scroll trap; **mobile menu collapsed to a 48 px sliver** (header backdrop-filter created a containing block for the fixed menu); download button overflowed on small screens; dark-mode text invisible under the preview; price format ("1188"); an unconfirmed "Unlimited employees" claim.

Still not verifiable here: FormSubmit delivery to the real inbox, Search Console and Bing, field Core Web Vitals, screen-reader testing, Google Rich Results Test, anything about the private product application. See `docs/launch-readiness-checklist.md`.

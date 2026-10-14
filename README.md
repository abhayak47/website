# Onjaal website

Static marketing site for [onjaal.com](https://onjaal.com), served by GitHub Pages (`CNAME` = `onjaal.com`). No framework and no build step needed to serve it.

## Structure
- Pages: `index.html`, `about/`, `products/`, `products/hrms/`, `pricing/`, `security/`, `resources/` (+ guides), `contact/`, `thanks/`, `privacy/`, `terms/`, `404.html`
- `assets/css/site.css` (global, includes the dark theme), `assets/css/preview.css` (HRMS preview)
- `assets/js/site.js` (nav, theme toggle, product tour, sticky CTA, enquiry form), `assets/js/pricing.js` (billing toggle and estimator), `assets/js/preview/` (interactive HRMS demo with fictional data)
- `sitemap.xml`, `robots.txt`
- `tools/` small Python helpers: `sync_layout.py` (shared header/footer, share images, cache-busting, sitemap dates), `build_pricing.py`, `build_resources.py`, `build_og.py` (needs Pillow), `check_site.py` and `check_seo.py` (quality gates)
- `site.webmanifest`, `.well-known/security.txt`, `.nojekyll` (lets GitHub Pages serve dot-folders), `lighthouserc.json`, `.github/workflows/checks.yml`

## Editing
- **Header and footer** live in `tools/partials/`. After changing them run `python tools/sync_layout.py` to copy them into every page (it also marks the current nav link).
- **Pricing** is generated: edit `PLANS`, `FEATURES` and `FAQ` in `tools/build_pricing.py`, then run `python tools/build_pricing.py && python tools/sync_layout.py`. Keep the `RATES` in `assets/js/pricing.js` in sync with the plans. The home page tier teaser (`index.html`) and `products/hrms/index.html` mention prices by hand.
- `sitemap.xml` dates refresh automatically when you run `python tools/sync_layout.py`; add new page URLs to it by hand (`check_site.py` reminds you).
- Resources: edit `GUIDES` in `tools/build_resources.py`, then run it, then `sync_layout.py`.
- Share images: edit `PAGES` in `tools/build_og.py` and run it.

## Enquiry form
Posts via FormSubmit to `tech@onjaal.com`, with an in-page success state. If JavaScript fails it falls back to a normal POST that redirects to `/thanks/`. FormSubmit needs a one-time email activation for the address.

## Quality checks
`python tools/check_seo.py` guards canonical URLs, sitemap vs robots, heading order and structured-data consistency. Reports and setup guides are in `docs/`. `python tools/check_site.py` validates links, anchors, JSON-LD, titles/descriptions, canonicals, share images and the sitemap. The same check plus Lighthouse CI runs on every pull request (`.github/workflows/checks.yml`).

## Analytics (off by default)
`assets/js/consent.js` contains a consent-aware Google Analytics 4 loader. While `GA4_ID` is empty it does nothing. To enable: paste the Measurement ID, then update `privacy/index.html` and `security/index.html` (they currently state there is no analytics), and test in GA4 DebugView that nothing loads before a visitor accepts.

## Privacy note
The site sets no cookies and uses no analytics. The theme choice is stored in the visitor's own `localStorage`. If you add analytics, update `privacy/index.html`, and `security/index.html` (the "No tracking" tile).

## Local preview
`python -m http.server 8000` from this folder, then open http://localhost:8000

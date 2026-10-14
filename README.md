# Onjaal website

Static marketing site for [onjaal.com](https://onjaal.com), served by GitHub Pages (`CNAME` = `onjaal.com`). No framework and no build step needed to serve it.

## Structure
- Pages: `index.html`, `about/`, `products/`, `products/hrms/`, `pricing/`, `security/`, `resources/` (+ guides), `contact/`, `thanks/`, `privacy/`, `terms/`, `404.html`
- `assets/css/site.css` (global, includes the dark theme), `assets/css/preview.css` (HRMS preview)
- `assets/js/site.js` (nav, theme toggle, product tour, sticky CTA, enquiry form), `assets/js/pricing.js` (billing toggle and estimator), `assets/js/preview/` (interactive HRMS demo with fictional data)
- `sitemap.xml`, `robots.txt`
- `tools/` small Python helpers (standard library only)

## Editing
- **Header and footer** live in `tools/partials/`. After changing them run `python tools/sync_layout.py` to copy them into every page (it also marks the current nav link).
- **Pricing** is generated: edit `PLANS`, `FEATURES` and `FAQ` in `tools/build_pricing.py`, then run `python tools/build_pricing.py && python tools/sync_layout.py`. Keep the `RATES` in `assets/js/pricing.js` in sync with the plans. The home page tier teaser (`index.html`) and `products/hrms/index.html` mention prices by hand.
- Update `lastmod` in `sitemap.xml` when a page changes.

## Enquiry form
Posts via FormSubmit to `tech@onjaal.com`, with an in-page success state. If JavaScript fails it falls back to a normal POST that redirects to `/thanks/`. FormSubmit needs a one-time email activation for the address.

## Privacy note
The site sets no cookies and uses no analytics. The theme choice is stored in the visitor's own `localStorage`. If you add analytics, update `privacy/index.html`, `security/index.html` and the trust strip on the home page.

## Local preview
`python -m http.server 8000` from this folder, then open http://localhost:8000

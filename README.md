# Onjaal website

Static marketing site for [onjaal.com](https://onjaal.com), served by GitHub Pages (`CNAME` = `onjaal.com`). No build step.

## Structure
- `index.html`, `about/`, `products/`, `products/hrms/`, `pricing/`, `contact/`, `thanks/`, `privacy/`, `terms/`, `404.html`
- `assets/css/site.css` (global), `assets/css/preview.css` (HRMS preview)
- `assets/js/site.js` (nav, reveal, enquiry form), `assets/js/pricing.js` (estimator), `assets/js/preview/` (interactive HRMS demo, fictional data)
- `sitemap.xml`, `robots.txt`

## Editing
- Header and footer are repeated in each page; change them in every file.
- Pricing constants live in `assets/js/pricing.js` and in the static tables/FAQ on `pricing/index.html`. Keep them in sync.
- Update `lastmod` in `sitemap.xml` when a page changes.

## Enquiry form
Posts via FormSubmit (`tech@onjaal.com`) with an in-page success state; if JavaScript fails it falls back to a normal POST that redirects to `/thanks/`. FormSubmit requires a one-time email activation for the address.

## Local preview
`python -m http.server 8000` from this folder, then open http://localhost:8000

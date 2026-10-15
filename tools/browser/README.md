# Browser tests

Optional end-to-end checks that drive a real Microsoft Edge through the DevTools protocol (Node 22+, Edge installed, no npm packages).
Start the site first: `python -m http.server 8000` from the repo root. Each script takes a scratch directory (any empty folder outside the repo, used for the throw-away browser profile) and a URL.

| Script | What it checks |
|---|---|
| `cdp.mjs` | No horizontal overflow at a phone width, per page |
| `calc.mjs` | Pricing calculator maths for 1, 5, 6, 150 and 1,000 users across plans, billing and add-ons; input clamping |
| `flows.mjs` | Interactive preview, tour tabs by keyboard, theme toggle, mobile menu, enquiry form validation/failure/success. The form call to FormSubmit is intercepted, so no email is ever sent |
| `a11y.mjs` | Accessible names, form labels, positive tabindex, keyboard Tab-through with a visible focus ring and focus not hidden under the header |
| `wheel.mjs` | The mouse wheel over the preview scrolls the page |

Lighthouse (performance, accessibility, best practices, SEO) runs in CI via `lighthouserc.json`, or locally with `npx lighthouse http://localhost:8000/ --chrome-flags="--headless=new"` (set `CHROME_PATH` to Edge or Chrome).

# Search engine and measurement setup

Everything here needs an account only you control. Nothing has been verified or connected on your behalf, and no tokens or IDs have been invented. Never commit passwords, API keys or private tokens to Git.

## 0. Before you start
1. Merge the pending pull request, enable GitHub Pages (Settings, Pages, deploy from `main`, root, custom domain `onjaal.com`) and tick **Enforce HTTPS**.
2. Add a DNS `CNAME` record `www` pointing to `abhayak47.github.io` so `www.onjaal.com` redirects to the apex.
3. Confirm these load: `https://onjaal.com/`, `https://onjaal.com/sitemap.xml`, `https://onjaal.com/robots.txt`, `https://onjaal.com/llms.txt`.
4. Confirm an unknown URL (for example `/does-not-exist`) shows the custom 404 page.

## 1. Google Search Console
1. Go to https://search.google.com/search-console and sign in with the Google account that should own the property.
2. Add property, choose **Domain** and enter `onjaal.com` (covers www, http and https).
3. Verify with the **DNS TXT record** Google gives you, added at your DNS provider. This needs no code change. (If you cannot edit DNS, use a **URL-prefix** property for `https://onjaal.com/` with an HTML meta tag; send the tag and it can be added to the shared page head.)
4. After verification: Sitemaps, add `sitemap.xml`, Submit. Expect "Success" and 15 discovered URLs.
5. URL Inspection: inspect `https://onjaal.com/`, then **Request indexing**. Repeat for `/pricing/`, `/products/hrms/`, `/about/`, `/contact/`.
6. Later: check Pages (coverage), Core Web Vitals, and Performance (queries and landing pages) weekly for the first month.

## 2. Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters and sign in.
2. Easiest path: **Import from Google Search Console** after step 1 above. Otherwise add `https://onjaal.com` and verify by DNS CNAME/TXT or meta tag.
3. Sitemaps, submit `https://onjaal.com/sitemap.xml`.
4. Optional: IndexNow lets you notify Bing when pages change; not required for a small static site.

## 3. Google Analytics 4 (optional, consent first)
1. Create a GA4 property at https://analytics.google.com and a Web data stream for `https://onjaal.com`. Copy the Measurement ID (`G-` followed by letters and digits).
2. Open `assets/js/consent.js` and paste the ID into `GA4_ID`. While it is empty the file does nothing, which keeps the "no analytics, no cookies" statements true.
3. **Before publishing that change**, update the copy that would otherwise become false: `privacy/index.html` (analytics and cookies sections, consent and withdrawal wording under the Digital Personal Data Protection Act, 2023), the "No tracking" tile in `security/index.html`, and the privacy note in `README.md`.
4. Test: in a private window, open the site. A consent banner should appear and **no** request to `googletagmanager.com` should occur until you click Accept. After Accept, a page view appears in GA4 DebugView.
5. Mark `generate_lead` (fired when the enquiry form is sent successfully) as a **key event** in GA4. `cta_click` is also sent for links to `/contact/`.
6. Link GA4 to Search Console (GA4 Admin, Product links) to see organic queries alongside behaviour.

## 4. Measuring demo and enquiry conversions without analytics
- The `/thanks/` page is `noindex` and only reached by the non-JavaScript form fallback. Most visitors submit in-page, so use the **FormSubmit notification emails** (or GA4 `generate_lead` once enabled) as the source of truth.
- Send one real enquiry after deployment and click FormSubmit's one-time activation email at `tech@onjaal.com`. Until activated, submissions are not delivered.

## 5. Email and sender reputation (so replies and notifications arrive)
At your DNS or mail provider, configure SPF, DKIM and DMARC for `onjaal.com`. Check with https://mxtoolbox.com/SuperTool.aspx or Google Admin Toolbox.

## 6. Ongoing checklist
- After every content change run `python tools/sync_layout.py`, then `python tools/check_site.py` and `python tools/check_seo.py` (CI runs the same on each pull request).
- Add new public pages to `sitemap.xml`; the checks will fail if an indexable page is missing or a private path is listed.
- Monthly: Search Console coverage and queries, broken-link scan, update stale guides.
- Do not rely on any single AI product recognising the brand. Consistent facts on your own site, a Google Business Profile or LinkedIn page you control, and genuine third-party mentions earned over time are what help.

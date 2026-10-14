# Public brand presence checklist

A step-by-step plan for making Onjaal consistently and truthfully recognisable as a public business software brand. Nothing here has been done on your behalf: no accounts, listings, posts or submissions were created. Do each step yourself, or tell me to prepare the exact text.

Golden rules: say the same true thing everywhere; never buy or invent reviews, testimonials, backlinks or profiles; only claim what the product does today.

## Step 0. Agree the master description (30 minutes)
Write once, reuse everywhere. Suggested starting text (edit to match reality; it must agree with whether HRMS is truly available):

- **One sentence:** Onjaal is a business software company in India. Its first product, Onjaal HRMS, covers employee records, attendance, leave and approvals for growing businesses.
- **Name:** Onjaal. **Product:** Onjaal HRMS. **Website:** https://onjaal.com/ **Email:** tech@onjaal.com
- **Tagline:** pick one: "HR, simplified for growing businesses" or "Simpler HR. Stronger Teams."
- Logo files: `assets/brand/` in the repository.
Keep a single source of truth (this repo's homepage). If the wording changes, update the profiles below within a week.

## Step 1. Remove contradictory public signals (this week, highest impact)
1. **Retire the old site** at `https://abhayak47.github.io/onjaal/`. It is a separate, earlier copy with its own canonical and different wording. In the repository `abhayak47/onjaal`, either:
   - Settings, Pages, **Unpublish site** (cleanest), or
   - replace `index.html` with a redirect page (GitHub Pages cannot send a real 301):
     ```html
     <!doctype html><meta charset="utf-8"><title>Onjaal has moved</title>
     <link rel="canonical" href="https://onjaal.com/">
     <meta http-equiv="refresh" content="0; url=https://onjaal.com/">
     <p>Onjaal has moved to <a href="https://onjaal.com/">onjaal.com</a>.</p>
     ```
2. **Fix or archive the public repository** `abhayak47/onjaal`. Its README says HRMS is "in development" and the screens are "illustrative concepts". Either update the README to match the live site, make the repository private, or archive it. Do the same review for `abhayak47/website`.
3. In GitHub, for each public repository set **About**: the one-sentence description from Step 0 and the website `https://onjaal.com/`.
4. Decide whether `abhayak47/website` should stay public. It contains `docs/` (audit notes, including missing-information lists). If you do not want those public, remove `docs/` from the published branch or make the repository private (note: GitHub Pages on a free plan may require a public repository; check before changing).
5. Confirm Onjaal HRMS's real availability status and align the site: "Available now" only if customers can actually start today; otherwise use "Early access" or "In development".

## Step 2. Verify ownership and submit the sitemap (this week)
Follow `docs/search-engine-setup.md`:
1. Google Search Console, Domain property for `onjaal.com`, DNS TXT verification.
2. Submit `https://onjaal.com/sitemap.xml`.
3. URL Inspection, then **Request indexing**: `/`, `/products/hrms/`, `/pricing/`, `/about/`, `/support/`.
4. Bing Webmaster Tools: import from Search Console, submit the sitemap.
5. Add the Google-chosen canonical check: in URL Inspection confirm "User-declared canonical" equals "Google-selected canonical".

## Step 3. Monitor indexing (weekly for the first two months)
- Search Console, Pages: indexed vs not indexed, and the reason for each excluded URL.
- Search Console, Performance: queries that include "onjaal"; any non-brand queries ("HRMS for small business India").
- Manually search `site:onjaal.com`, `Onjaal`, `Onjaal HRMS`, `onjaal.com` on Google and Bing and note the results with the date.
- If `abhayak47.github.io/onjaal/` still appears, request removal via Search Console's Removals tool for that property once it redirects.
- Once indexed, ask an AI assistant "What is Onjaal HRMS?" and record the answer as *measurement*. If it is wrong, the cause is almost always missing or contradictory public sources, not something you can fix by asking.

## Step 4. Create verified official profiles (weeks 1 to 3)
Only when the master description is final and the information is true.
1. **LinkedIn company page** (highest value for a B2B brand): name Onjaal, tagline, the one-sentence description, website, logo, industry "Software Development" or "Human Resources Services" as accurate, company size, location only if you want it public. Link the website to it afterwards (this adds a genuine `sameAs` for the site; send me the URL and I will add it).
2. **Founder profiles**: only with each person's consent. A founder's LinkedIn headline and "Experience" entry should name Onjaal and link to onjaal.com.
3. **Google Business Profile**: only if you operate from a real address or serve a defined area and are willing to publish it. Do not create one with a made-up address.
4. **GitHub organisation or profile**: keep the "About" text consistent with Step 0.
5. Optional: X/Twitter, YouTube. Create only if you will post; an empty profile is worse than none.

## Step 5. Directories and catalogues (month 2 onward, after the product is genuinely available)
Evaluate each; free listings first; never pay for placement that is presented as an organic review.
- **Software catalogues:** Capterra / GetApp / Software Advice, G2, SoftwareSuggest, SaaSworthy, AlternativeTo. Listings need a real, available product; reviews must come from real customers (these platforms prohibit incentivised or fabricated reviews).
- **Startup directories and databases:** Crunchbase, Wellfound, Product Hunt (launch only when there is something people can try), Indian startup lists such as Startup India registration if the company is eligible.
- **Business registries:** a MCA/Udyam registration is not a listing, but publishing the legal entity name consistently on the site and profiles helps entity matching.
- For every listing: identical name, description, URL and logo; link to onjaal.com; screenshots only of the real product (the current preview is conceptual, so use real screenshots once they exist).

## Step 6. Earn genuine mentions (ongoing)
- Publish a small number of **useful, reviewed guides** (the five in `/resources/` are a start). Do not publish statutory or legal advice without an expert's review.
- **Launch announcement**: a short, truthful post on the company LinkedIn page and founders' profiles when HRMS is generally available, linking to the pricing and product pages.
- **HR and SME communities**: answer questions where you can genuinely help (HR forums, founder groups). Disclose your affiliation. Do not drop links.
- **Early customers**: when real customers are happy, ask for a short quote or case study with written permission and publish it with their name and role. Then it can go on the site again.
- **Partnerships and events**: HR consultants, payroll or compliance advisers, biometric device vendors, local industry associations; a genuine "works with" or integration page is valuable once true.
- **Press**: pitch only real news (a launch, a milestone with data you can show) to relevant Indian startup or HR-tech publications. Do not buy coverage.

## Step 7. Consistency audit (monthly)
- Search for `"Onjaal"` and compare every public description with Step 0.
- Check the site's `Organization` markup, social metadata and `llms.txt` still match.
- Update profiles when pricing, plans or availability change.
- Keep `docs/brand-information-needed.md` current as questions are answered.

## What not to do
- No purchased or invented reviews, testimonials, followers or backlinks.
- No profiles claiming an address, team or certification you do not have.
- No cloned or doorway sites; one canonical home at `https://onjaal.com/`.
- No "AI optimisation" tricks, hidden text or keyword stuffing. Clear, consistent, verifiable public information is the whole strategy.

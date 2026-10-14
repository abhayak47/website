# AI search misclassification: investigation report

Investigated 2026-10-15. Evidence is labelled **Confirmed** (observed directly, with how), **Hypothesis** (plausible, not proven) or **External check required**.

## 1. The claim under investigation

> "While onjaal.com exists as an indexed portal or internal HR gateway, public directories and mainstream tech catalogs do not index its specific features, pricing, or product documentation. Because it operates primarily as a private internal system or custom enterprise client portal, details about its interface and direct support options are shielded from public search results."

Intended positioning: a publicly discoverable business software brand, starting with Onjaal HRMS for Indian SMEs.

Important limit: nothing below proves how any AI system built that sentence. The investigation finds *conditions that would make such a description likely*, and fixes what can be fixed.

## 2. What the production site actually does (Confirmed by HTTP checks on 2026-10-15)

| Check | Result |
|---|---|
| `http://onjaal.com`, `http://www.onjaal.com`, `https://www.onjaal.com` | one redirect each to `https://onjaal.com/`, final status 200 |
| `https://onjaal.com/` | 200, served by GitHub Pages, no login or auth in front of it |
| `/pricing/`, `/products/hrms/`, `/about`, `/robots.txt`, `/sitemap.xml`, `/llms.txt` | 200 (`/about` redirects once to `/about/`) |
| `/does-not-exist` | 404 (correct status) |
| robots.txt | `Allow: /`, sitemap declared; only `/docs/`, `/tools/`, `/.github/` disallowed |
| `<meta name="robots">` on public pages | `index, follow`; only `404` and `thanks` are `noindex` |
| Essential content in delivered HTML | yes; headline, product description, features, pricing and contact options are in the raw HTML (confirmed by fetching the page as a text crawler). JavaScript is not needed to read them |
| Canonical URLs | self-referencing, `https://onjaal.com/...`, trailing slash, consistent |
| Structured data on the live home page | `Organization` and `WebSite` present and valid; HRMS and pricing pages carry `SoftwareApplication` and FAQ data |

**Conclusion: nothing in the public site's configuration blocks crawlers or hides it behind a login.** The "private portal" description is not caused by robots, noindex, authentication, redirects or client-side rendering on onjaal.com.

## 3. Confirmed issues that plausibly contribute

### Technical and discoverability

1. **The domain served GitHub's 404 until very recently (Confirmed).** On 2026-10-14 at about 20:14 IST, `onjaal.com` displayed "There isn't a GitHub Pages site here." (screenshot supplied by the owner). Any crawler or AI retrieval during that window saw no site at all. The site is only live now.
2. **onjaal.com appears absent from search results (Confirmed for the tool used; not proof about Google).** A `site:onjaal.com` query and "Onjaal HRMS India" returned nothing from the domain; the brand query surfaced only a GitHub repository and unrelated companies with similar names (Onfleet, ONYX Software, and others). The search tool available here is a general web search, not Google's index, so this is a signal, not a measurement. **External check required:** Search Console URL Inspection.
3. **A second public site competes as the brand's "home" (Confirmed).** `https://abhayak47.github.io/onjaal/` is live (HTTP 200), has its own canonical pointing at itself, no `noindex`, a different title ("Onjaal | Everyday HR work, made clear") and a different headline. It is a separate copy of an earlier version of the site on another host.
4. **Contradictory public statements about the product (Confirmed).** The public GitHub repository `abhayak47/onjaal` (visibility: public, 13 commits) describes Onjaal as "an early-stage company" whose HRMS is "**in development**" and whose screens are "illustrative concepts with fictional people". The live site says Onjaal HRMS is "**Available now**". Anyone (human or machine) reading the README concludes the opposite of the website.
5. **No public support or help page and no product entry point (Confirmed).** Before this investigation the site had no help/support page, no documentation hub for the product, and no sign-in or app link. The only direct contact was a form and `tech@onjaal.com`. A reader or model looking for "interface and direct support options" would find little, which matches the sentence.
6. **Weak entity statement (Confirmed).** The homepage headline did not contain the brand name, and the opening copy did not say plainly what kind of organisation Onjaal is. Fixed (see section 5).
7. **Repository descriptions are thin (Confirmed).** GitHub shows `abhayak47/website` as "Onjaal Website" and `abhayak47/onjaal` as "Onjaal Eco-system", with no homepage URL set. Both are public and indexable.

### Content and trust

8. **Fabricated social proof was live (Confirmed, now removed).** The home and About pages showed quotes attributed to named people at unnamed companies. These were invented. They have been removed from both pages (section 5).
9. **"Available now" versus what a visitor can see (Flagged, needs owner confirmation).** The site says HRMS is available now, but the visible product evidence is a *conceptual* preview with fictional data, there are no real screenshots, no sign-in, and access appears to be by enquiry. Visitors may reasonably read this as an assisted or private service. The owner must confirm the real availability status; if it is not generally available the labels should say so.
10. **Pricing, free tier and plan features are unconfirmed (Flagged).** The original site verifiably published ₹59 per user per month, ₹60,000 implementation and ₹15,000 biometric integration. The Free plan (up to 5 employees), Premium at ₹99, monthly rates and the per-plan feature split are not confirmed as real offers. The "Start free" calls to action depend on the Free plan being real.
11. **No verified company information is published** (legal entity, address, registration, named team, social profiles). This lowers trust signals that directories and models rely on. Listed in `docs/brand-information-needed.md`.

## 4. Hypotheses (not verified)

- **H-A.** The AI system had little or no crawled content for the domain (not yet indexed; domain returned GitHub's 404; site only just launched) and inferred a "portal" from the domain name and the generic word "gateway" alone.
- **H-B.** The system leaned on the public GitHub repositories and the old github.io site, whose wording ("early-stage", "in development", "illustrative concepts") reads like an unreleased or internal project.
- **H-C.** The absence of any third-party mentions (directories, press, social profiles) means no independent source confirms Onjaal as a public product.
- **H-D.** A sparse brand term ("Onjaal") with no authoritative page, plus similarly named companies, makes entity resolution hard.
- **H-E.** Cached copies of an earlier version of the site were used.
None of these can be proven or disproven from source or from public search results alone.

## 5. Changes implemented (in the working tree, uncommitted)

| Change | Files |
|---|---|
| Removed the invented testimonials from the home and About pages; section banding re-balanced | `index.html`, `about/index.html` |
| Homepage now states plainly what Onjaal is: "Onjaal is a business software company for growing businesses in India. Its first product, Onjaal HRMS…" in the hero copy, meta description, Open Graph/Twitter text and structured-data descriptions | `index.html` |
| New public **Help and support** page: contact options, what to include in a request, links to the product FAQ, pricing FAQ and guides. Makes no claims about hours, response times or a customer portal | `support/index.html`, `tools/build_support.py` |
| Linked from the footer of every page, added to the sitemap and `llms.txt`, added a `customer support` contact point to the `Organization` data and `ContactPage` markup | `tools/partials/footer.html`, `sitemap.xml`, `llms.txt`, `index.html` |
| Page builder refactored so new pages reuse one shell | `tools/build_resources.py` |
| Earlier in this session (already pushed on the working branch): unified structured-data graph, SEO consistency tests in CI, robots rules for internal folders, FAQ/product/pricing/trust/resources pages, per-page share images | see `docs/seo-validation-report.md` |

Not changed, deliberately: the "Available now" label, the Free plan and pricing (owner must confirm), and any external repository or profile (outside this repo and outside authorisation).

## 6. Tests and actual results

| Test | Result |
|---|---|
| `tools/check_site.py` (links, anchors, JSON-LD parse, h1, ids, alt, titles, canonicals, share images, sitemap) | Pass: 18 pages, 0 errors, 0 warnings |
| `tools/check_seo.py` (canonical strategy, sitemap vs robots, heading order, JSON-LD `@id` consistency, no rating/review markup, offer prices visible) | Pass: 18 pages, 4 JSON-LD ids, 0 failures |
| No remaining testimonial markup in `index.html` and `about/index.html` | Pass (searched for the testimonial markup: 0 matches) |
| Mobile overflow at 390 px for `/`, `/support/`, `/about/` (Edge DevTools protocol) | Pass: no horizontal scroll |
| Visual review of the new support page and the revised home hero (desktop) | Reviewed, no layout faults |
| Live HTTP checks of production (section 2) | Performed, results as listed |
| Live pages reflect these changes | **Not yet.** Production still serves the previous version (with the testimonials and the disclaimer line) until the branch is merged |

## 7. External checks still required (cannot be done from here)

1. Google Search Console: verify `onjaal.com`, submit the sitemap, run URL Inspection on `/`, `/products/hrms/`, `/pricing/`, `/support/`; check "Indexed" and the Google-selected canonical.
2. Bing Webmaster Tools: same.
3. Google search for `site:onjaal.com`, `"Onjaal HRMS"` and `onjaal.com` after indexing; record what appears.
4. Confirm the old copy at `abhayak47.github.io/onjaal/` is retired (see the checklist) and re-check its status.
5. Spot-check how AI assistants describe Onjaal after Google and Bing have indexed the site. Treat this as measurement only; no assistant is guaranteed to cite or describe the brand correctly.

## 8. Prioritised action plan

1. **Merge the branch** so production drops the fabricated testimonials and gains the support page and clearer identity. (Owner)
2. **Resolve the competing public copy**: retire `abhayak47.github.io/onjaal/` and update or archive the `abhayak47/onjaal` repository so no public page says "in development" while the site says "available". (Owner; steps in the checklist)
3. **Confirm availability and pricing**: is Onjaal HRMS available to customers today, and are the Free plan and published prices real? Align every label to the answer. (Owner)
4. **Verify and submit** in Search Console and Bing Webmaster Tools; request indexing for the five key pages. (Owner)
5. **Publish verified identity**: create the LinkedIn company page and fill the repository "About" fields (description and website URL) with the exact same one-sentence description used on the homepage. (Owner)
6. Add the company facts listed in `brand-information-needed.md` (legal entity, address, social links) so structured data and trust pages can be completed truthfully.
7. Earn genuine third-party mentions slowly: see `docs/public-brand-presence-checklist.md`.

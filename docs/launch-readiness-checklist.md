# Launch readiness checklist (your 10 phases)

Status key: **Done** = built and verified here (how noted) · **Partly** = built, but a fact or asset is still needed · **You** = needs information, accounts or real-world work only the business can do · **N/A** = no such thing exists in this repository (it is the marketing site only; there is no application, login or billing).

Nothing marked Done claims more than was actually verified. Anything involving facts about the product, company, security or legal terms is deliberately not invented.

## Phase 1: Critical fixes and trust

| Item | Status | Notes |
|---|---|---|
| Remove sample testimonials | **Done** | Removed from home and About; no testimonial markup remains (searched) |
| Audit public pages for unverified claims | **Done** | Scanned all visible text for guarantees, certifications, security, customer-count and superlative claims: none. Removed "Unlimited employees" (unconfirmed). Remaining unconfirmed items are listed under "Needs you" below |
| Distinguish live HRMS from CRM/ERP/Accounts | **Done** | "Available now" vs "In development" shown on home, suite section, nav, products, About roadmap, footer text, `llms.txt` |
| Verify CTAs, forms, links | **Done** | Every internal link and `#anchor` resolves; every `?interest=` link maps to a real form option (automated); form tested end to end in a real browser with the network call intercepted: validation, failure message with email fallback, success state and focus. "Signup" is an enquiry form; there is no self-serve signup |
| Confirm demo submissions reach the right inbox | **You** | Needs FormSubmit's one-time activation email at tech@onjaal.com and one real test enquiry. I did not send one because it would email you |
| Verify plan terms and prices | **You** | Free, Standard (₹59/₹71), Premium (₹99/₹119), Enterprise, ₹60,000 implementation, ₹15,000 biometric: confirm or correct in `tools/build_pricing.py` |
| Legal entity, contact details, privacy, terms | **You** | Entity name, address, GSTIN/CIN, grievance officer missing; legal pages need professional review |

## Phase 2: Homepage

| Item | Status | Notes |
|---|---|---|
| Hero positions Onjaal as HRMS for Indian businesses | **Done** | "HRMS software for growing Indian businesses." |
| Concise subheading | **Done** | Records, attendance, leave, approvals; free for up to 5; from ₹59; built by Onjaal |
| Start free primary, Book a demo secondary | **Done** | |
| Real HRMS screenshots | **You** | None exist. The page uses a clearly labelled conceptual preview with fictional data. Provide real captures and they replace the mock |
| Easier-to-use interactive preview | **Done** | Shorter intro, a "try this" prompt, no inner scrollbar (wheel scrolls the page, verified), loads only when near view |
| Three-step "how it works" | **Done** | Plus four verifiable outcomes |
| Specific, verifiable benefits and features | **Done** | Outcomes row and product tour use only claims already on the site |
| Genuine trust section | **Partly** | "Transparent by design" links to live vs coming, pricing, trust and data. Real customer evidence needs real customers |
| CRM/ERP/Accounts kept secondary | **Done** | Below the tour, labelled in development, no dates |
| Better final CTA, less repetition | **Done** | Removed duplicate sections; home is 8 sections |

## Phase 3: HRMS product page

| Item | Status | Notes |
|---|---|---|
| Restructure around workflows and problems | **Partly** | Journey, capabilities, roles, demo topics, rollout, FAQ, guides. Real screenshots needed |
| Screenshots of employees, attendance, leave | **You** | No real screenshots exist |
| Employee, manager, administrator capabilities | **Done** | New "Who uses it" section, drawn only from existing copy |
| Attendance methods, biometric compatibility, integrations | **Partly** | States biometric is optional and subject to device/API compatibility; specifics need your technical facts |
| Payroll scope and limits | **Partly** | States statutory scope is confirmed per organisation; exact scope needs your facts |
| Reports, roles, permissions, export, configuration | **You** | Listed as demo topics "confirmed in writing" so nothing is claimed. Supply facts to publish them |
| Onboarding, migration, implementation, support | **Partly** | Rollout steps plus "who does what" as a demo topic; specifics need your facts |
| Contextual CTAs | **Done** | Inline pricing and demo links after the roles section |

## Phase 4: Pricing and conversion

| Item | Status | Notes |
|---|---|---|
| Monthly and annual price on every paid plan | **Done** | Toggle plus a line on each card: annual per user per year and monthly rate |
| Actual annual amount and taxes | **Done** | ₹708 / ₹1,188 per user per year; "excludes applicable taxes" on cards, calculator and FAQ |
| Free plan limit and what happens above it | **Done** | FAQ and plan copy |
| Upgrades, downgrades, renewals, cancellations, refunds | **You** | The FAQ says these are confirmed in the written proposal. Supply the real policy to publish it |
| Biometric costs and compatibility | **Done** | ₹15,000 one-time, included in Premium, subject to device/API compatibility |
| Calculator shows subscription, one-time charges, first-year total | **Done** | |
| Test 1, 5, 6, 150 and maximum employees | **Done** | 80 combinations in a real browser, 0 mismatches; 150 users Standard annual + setup = ₹1,66,200 as originally published; input clamping verified (max 1,000) |
| Enterprise eligibility and process | **Done** | Recommended from roughly 200 users or for custom integrations; enquiry form |
| Prices match across pages | **Done** | Automated check lists approved figures and warns on any other rupee amount |
| Checkout | **N/A** | There is no checkout; Start free and demos go through the enquiry form |

## Phase 5: Trust, security and company credibility

| Item | Status | Notes |
|---|---|---|
| Security controls, hosting region, encryption, access, backups | **You** | Not invented. The page lists the questions answered in writing. Provide verified facts to publish them |
| Export, retention, deletion, incident response | **You** | Privacy policy covers rights; product-level practice needs your facts |
| Subprocessors | **Partly** | Site-level processors (FormSubmit, email provider, GitHub Pages) are in the privacy policy; product-level list needs your facts |
| Founder and team information | **You** | |
| Verified company identity | **You** | |
| Case studies and testimonials (with permission) | **You** | |
| Privacy and cookie disclosures match behaviour | **Done** | No cookies, no analytics, theme stored locally; GA4 loader is off and documented |
| Legal review by a professional | **You** | |

## Phase 6: Mobile UX, accessibility, design system

| Item | Status | Notes |
|---|---|---|
| Standardise type, spacing, colour, buttons, widths | **Done** | Token-based system; consistency pass; calmer visual language |
| Test every page on mobile, tablet, desktop | **Done** | All 18 pages at 360, 390, 768 and 1024 px: no horizontal overflow; key pages reviewed visually in light and dark |
| Fix overflow, clipped tables, overlaps | **Done** | Fixed the download button overflow on guides, and a **real mobile-menu bug** (the frosted header made the full-screen menu collapse to a 48px sliver; now 736px, tested) |
| Mobile navigation and preview | **Done** | Menu opens, closes on Escape; preview works at phone width |
| Forms: labels, validation, success/error | **Done** | Verified in a real browser |
| Keyboard, focus, contrast, labels | **Done** | Automated Tab-through on 10 pages: every stop has a visible focus ring, none hidden under the header, no unnamed controls or unlabelled fields; fixed two contrast failures (placeholder text and form borders) |
| Reduced motion | **Done** | Animations and smooth scrolling disabled under the preference |
| WCAG 2.2 AA | **Partly** | Lighthouse accessibility 100 on all tested pages plus the checks above. A conformance claim needs a manual audit with a screen reader (NVDA/VoiceOver) |

## Phase 7: Technical SEO

| Item | Status | Notes |
|---|---|---|
| Indexability, status codes, redirects, canonicals | **Done** | Live HTTP checks: apex and www redirect, 404 status, canonicals consistent; checked in CI |
| robots.txt and sitemap | **Done** | 16 URLs, canonical, none blocked |
| Submit sitemap in Search Console | **You** | `docs/search-engine-setup.md` |
| Unique titles and descriptions | **Done** | Automated |
| One H1 and logical headings | **Done** | Automated; skipped levels fixed |
| Internal linking | **Done** | Guides link to the product and pricing; pricing and HRMS link back to guides; support and trust linked from every footer |
| Alt text | **Done** | Automated |
| Structured data | **Done** | Syntax and cross-page consistency verified; run Google's Rich Results Test after deploy (**You**) |
| JavaScript rendering | **Done** | All marketing content is in the delivered HTML |
| Duplicates, broken links, noindex | **Done** | Automated; only 404 and thanks are noindex |

## Phase 8: Content and organic search

| Item | Status | Notes |
|---|---|---|
| Keyword research | **You** | Needs Search Console data and a keyword tool; do not guess volumes |
| One primary intent per landing page | **Done** | See table below |
| Improve the five guides | **Partly** | Added worked examples, sources, "published by / updated" lines. Expert or HR-practitioner review still advisable |
| Author information, qualified review | **Partly** | Organisation-level byline and update date added; named author or reviewer needs a real person |
| Primary sources for regulatory claims | **Done** | Links to India Code, EPFO, ESIC; the guides avoid giving legal advice |
| Downloadable templates and checklists | **Done** | Leave policy, attendance policy, vendor checklist (PDF), linked from the hub and guides |
| Content on selection, attendance, leave, implementation | **Partly** | Selection, attendance and leave covered; a dedicated implementation guide is a good next article |
| Avoid thin or keyword-stuffed pages | **Done** | Five substantive guides only |

Page intents: `/` HRMS software for Indian SMEs (navigational + commercial) · `/products/hrms/` what Onjaal HRMS does · `/pricing/` HRMS pricing (commercial) · `/resources/hrms-for-indian-smes/` evaluating an HRMS · `/resources/leave-and-attendance-management/` why leave and attendance belong together · `/resources/leave-policy-checklist/` and `/attendance-policy-checklist/` policy how-to · `/resources/choosing-hr-software/` vendor selection · `/security/` trust and data · `/support/` help and contact.

## Phase 9: Performance and application QA

| Item | Status | Notes |
|---|---|---|
| PageSpeed / Core Web Vitals | **Done** (lab) | Lighthouse (throttled mobile profile) on home, about, support, pricing, HRMS, contact and a guide: Performance 97 to 99 (home was 76 before the preview was lazy-loaded), Accessibility 100, Best Practices 100, SEO 100; CLS 0; total blocking time 0 to 10 ms. Field data needs real traffic (**You**, via Search Console) |
| Optimise images, fonts, JS, layout stability | **Done** | Preview script and stylesheet load only near view; space reserved so nothing shifts |
| Signup, login, password recovery, sessions | **N/A** | No application in this repository |
| Tenant isolation, roles, leave balances, billing, integrations | **N/A / You** | Test in the product itself |
| Backups, monitoring, logging, rollback, incidents | **You** | For the site: rollback is `git revert` plus redeploy; add an uptime monitor |
| Regression tests on mobile and desktop | **Done** | `tools/browser/` scripts and CI checks |

## Phase 10: Analytics, launch, growth

| Item | Status | Notes |
|---|---|---|
| Search Console, domain verification | **You** | Steps in `docs/search-engine-setup.md` |
| Privacy-respecting analytics | **Partly** | GA4 consent loader built and disabled; needs your Measurement ID and updated privacy copy. A cookie-free tool (Plausible, Umami) is an alternative |
| Track signup, demo, pricing, activation | **Partly** | Events `generate_lead` (form success) and `cta_click` implemented; untested against a real GA4 property |
| Test events without sensitive data | **Done** | Events carry only link text and form name, never form contents |
| Baseline, monitoring, monthly review | **You** | Starts after launch |
| Publish from search data, collect feedback | **You** | |

## Needs you (consolidated)
1. Activate FormSubmit and send one real test enquiry.
2. Confirm pricing, the Free plan and the plan feature split.
3. Real product screenshots (employees, attendance, leave).
4. Facts for the security page: hosting region, encryption, access control, backups, export/retention/deletion, incident process, subprocessors.
5. Company identity: legal name, address, GSTIN/CIN, grievance officer, team and founders, social profiles.
6. Cancellation, refund, renewal and plan-change policy.
7. Real customer testimonials or case studies, with written permission.
8. Merge, enable Pages, verify in Search Console and Bing; retire the old `abhayak47.github.io/onjaal/` copy.
9. Legal review of privacy and terms; a manual screen-reader pass.

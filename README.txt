ONJAAL WEBSITE (onjaal.com)

Static site published with GitHub Pages from the root of the main branch.
Custom domain: onjaal.com (see CNAME). No build step, framework or database.

FILES
- index.html ............ the homepage (Onjaal + Onjaal HRMS)
- 404.html .............. page shown for broken links (not indexed)
- robots.txt ............ lets search engines crawl the site; points to the sitemap
- sitemap.xml ........... lists the public pages (currently only the homepage)
- CNAME ................. custom domain for GitHub Pages; do not edit
- favicon.ico, apple-touch-icon.png ... browser and phone icons
- assets/css/site.css ... all styles
- assets/js/site.js ..... mobile menu, footer year, form validation messages
- assets/fonts/ ......... self-hosted Schibsted Grotesk (SIL Open Font License, see OFL.txt)
- assets/brand/ ......... logo files made from the supplied logo
    onjaal-logo-original.png  the original file, unchanged
    onjaal-logo-full.*        full logo with tagline, transparent background (schema, footer on large screens)
    onjaal-logo-full-460.*    smaller copy of the full logo used in the footer
    onjaal-logo.*             logo without the tagline line (header on high-density screens)
    onjaal-logo-330.*         smaller copy of the header logo
    onjaal-mark.png           symbol only, full size (source for the favicons)
    onjaal-mark-48.png        small symbol used inside the product illustration
    og-image.png              1200x630 image used when the link is shared
    favicon-96.png            icon for search results and browsers

ENQUIRY FORM
The form posts to FormSubmit (https://formsubmit.co/tech@onjaal.com) and is
delivering enquiries. Its action, method, field names, hidden fields
(_subject, _template, _captcha, _next) and the _honey spam trap must stay
exactly as they are unless you intend to change how enquiries are delivered.
Do not send test enquiries casually: each one reaches the real inbox.

PRICING SHOWN ON THE SITE (indicative, 150 users)
- Subscription: Rs 1,06,200 per year (Rs 59 per user per month)
- Implementation: Rs 60,000 one-time
- Year one: Rs 1,66,200
- Optional biometric integration: Rs 15,000 one-time, subject to device/API compatibility
- Year one with biometric integration: Rs 1,81,200
- From year two: Rs 1,06,200 per year, subject to renewal terms
Applicable taxes are confirmed in the written proposal. If you change a price,
update index.html in the pricing table, the hero line and the FAQ answers.

PUBLISHING
Commit and push to the main branch. GitHub Pages republishes automatically,
usually within a few minutes.

ONJAAL WEBSITE (onjaal.com) — version 3, multi-page

Static site published with GitHub Pages from the root of the main branch.
Custom domain: onjaal.com (see CNAME). No build step, framework, database
or third-party scripts. Every page works without JavaScript.

PAGES (each folder holds an index.html, giving clean addresses)
- /                 index.html ............ home
- /products/        products/index.html ... the Onjaal suite
- /products/hrms/   products/hrms/index.html  Onjaal HRMS (with interactive preview)
- /pricing/         pricing/index.html
- /about/           about/index.html
- /contact/         contact/index.html .... the enquiry form
- /privacy/         privacy/index.html .... privacy policy (have a lawyer review)
- /terms/           terms/index.html ...... terms of use (have a lawyer review)
- 404.html ........................... page shown for broken links (not indexed)

The header and footer are repeated inside every page. If you change a menu
link or footer line, change it in all 9 HTML files.

OTHER ROOT FILES
- robots.txt, sitemap.xml (8 public pages), CNAME (do not edit),
  favicon.ico, apple-touch-icon.png

ASSETS
- assets/css/site.css ........ design system for all pages
- assets/css/preview.css ..... interactive HRMS preview styles
- assets/js/site.js .......... menu, Products dropdown, scroll reveal, form checks
- assets/js/preview/ ......... interactive HRMS preview (sample data, drawing, behaviour)
- assets/fonts/ .............. Schibsted Grotesk, self-hosted (SIL Open Font License)
- assets/brand/ .............. logo files made from the supplied Onjaal logo
    onjaal-logo-original.png        the original file, unchanged
    onjaal-logo-light*.png/webp     white wordmark for dark backgrounds (header)
    onjaal-logo-full-light-460.*    full logo with tagline for dark backgrounds (footer)
    onjaal-logo*.png/webp           original colours for light backgrounds
    onjaal-mark*.png                symbol only (favicons, preview, home orbit)
    og-image.png                    1200x630 image used when links are shared

ENQUIRY FORM (contact page)
Posts to FormSubmit (https://formsubmit.co/tech@onjaal.com). Action, method,
field names, hidden fields (_subject, _template, _captcha, _next) and the
_honey spam trap are unchanged. Three options were added to "What are you
exploring?": Onjaal CRM / ERP / Accounts (early access). Links such as
/contact/?interest=crm preselect the right option.

INTERACTIVE HRMS PREVIEW
Runs only in the visitor's browser on fictional sample data. No network
requests, nothing saved, separate from the enquiry form. Edit the sample
people and leave requests in assets/js/preview/preview-data.js.

PRICING SHOWN (indicative, 150 users)
Subscription Rs 1,06,200/year (Rs 59 per user per month) | Implementation
Rs 60,000 one-time | First-year total Rs 1,66,200 | Optional biometric
Rs 15,000 one-time | First-year total with biometric Rs 1,81,200 | From year
two Rs 1,06,200/year. If a price changes, update: pricing/index.html,
index.html, products/hrms/index.html and the FAQ answers in those pages.

PUBLISHING (GitHub website only)
1. Unzip the package.
2. github.com/abhayak47/website > Add file > Upload files.
3. Select EVERYTHING inside the unzipped folder (files and folders: assets,
   products, pricing, about, contact, privacy, terms) and drag it in.
   Use Chrome or Edge so folders keep their structure.
4. Commit directly to main.
5. Check that "products", "pricing" etc. appear as folders at the top level.
6. Wait for the green tick in the Actions tab, then open https://onjaal.com
   and press Ctrl+F5.

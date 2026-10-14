"""Generate /support/ (public help and contact options). Run:
    python tools/build_support.py && python tools/sync_layout.py && python tools/check_site.py

Only states what is verifiable from the site: the contact email, the enquiry form, the FAQ and guides.
It makes no claims about support hours, response times or a customer portal. Add those only once confirmed
(see docs/brand-information-needed.md).
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_resources import ARROW, cta, e, hero, shell, write  # noqa: E402

PATH = '/support/'
TITLE = 'Help and support: contact the Onjaal team'
DESC = 'How to reach the Onjaal team, what to include in a support request, and where to find answers about Onjaal HRMS, pricing, security and HR guides.'

main = hero('Help and support.', 'How to reach the Onjaal team, and where to find answers before you write.',
            '<li><a href="/">Home</a></li><li><span aria-current="page">Help and support</span></li>') + f'''

<section class="section" aria-labelledby="reach-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="kicker">Contact options</span>
      <h2 id="reach-title">Three ways to reach us.</h2>
    </div>
    <div class="support-grid">
      <article class="tile" data-reveal><h3>Email the team</h3><p>For questions about the product, a setup you already have, or anything on this site.</p><p><a class="inline-link" href="mailto:tech@onjaal.com">tech@onjaal.com</a></p></article>
      <article class="tile" data-reveal data-d="1"><h3>Start free or request a demo</h3><p>Tell us about your team and what you want to improve. We will review it and get back to you.</p><p><a class="text-link" href="/contact/">Open the enquiry form {ARROW}</a></p></article>
      <article class="tile" data-reveal data-d="2"><h3>Ask about security and data</h3><p>Hosting, access, backups and export are confirmed in writing before you commit.</p><p><a class="text-link" href="/contact/?interest=security">Ask a security question {ARROW}</a></p></article>
    </div>
    <p class="fine">Support scope and response commitments for your plan are confirmed in your written proposal.</p>
  </div>
</section>

<section class="section section-mist" aria-labelledby="include-title">
  <div class="wrap split-2">
    <div data-reveal><span class="kicker">Get a faster answer</span><h2 id="include-title">What to include when you write.</h2></div>
    <ul class="checklist" data-reveal data-d="1">
      <li>Your organisation name and roughly how many employees you have</li>
      <li>Which part of Onjaal HRMS your question is about (attendance, leave, approvals, records, pricing)</li>
      <li>For biometric attendance: the device make and model</li>
      <li>What you expected to happen, and what happened instead</li>
      <li>A screenshot, if it helps. Please do not send sensitive employee data by email</li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="answers-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="kicker">Find answers</span>
      <h2 id="answers-title">Before you write, these may help.</h2>
    </div>
    <div class="res-grid">
      <a class="res-card" href="/products/hrms/#faq" data-reveal><span class="res-tag">Product</span><h3>Onjaal HRMS questions</h3><p>The preview, biometric devices, payroll scope, implementation and what happens after an enquiry.</p><span class="card-foot">Read the FAQ <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>
      <a class="res-card" href="/pricing/#faq" data-reveal data-d="1"><span class="res-tag">Pricing</span><h3>Pricing questions</h3><p>The free plan, paid plans, billing, taxes, one-time services and larger organisations.</p><span class="card-foot">Read the FAQ <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>
      <a class="res-card" href="/resources/" data-reveal data-d="2"><span class="res-tag">Guides</span><h3>HR guides and checklists</h3><p>Plain-English guides for choosing an HRMS and writing leave and attendance policies.</p><span class="card-foot">Browse the guides <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>
    </div>
  </div>
</section>
''' + cta('Not sure where to start?', 'Send us a short note about your team and we will point you in the right direction.', 'Contact Onjaal', '/contact/')

ld = [{"@type": "ContactPage", "@id": "https://onjaal.com/support/#page", "url": "https://onjaal.com/support/", "name": "Help and support",
       "isPartOf": {"@id": "https://onjaal.com/#website"}, "about": {"@id": "https://onjaal.com/#organization"}}]
html = shell(PATH, 'Help and support', DESC, [('Home', '/'), ('Help and support', PATH)], main, ld)
html = html.replace('<title>Help and support | Onjaal</title>', '<title>%s</title>' % e(TITLE))
html = html.replace('content="Help and support | Onjaal"', 'content="%s"' % e(TITLE))
write(PATH, html)
print('support page written')

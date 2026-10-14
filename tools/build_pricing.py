"""Regenerate the <main> block and structured data of pricing/index.html.
Edit PLANS / FEATURES / FAQ below, then run:
    python tools/build_pricing.py && python tools/sync_layout.py
"""
import json, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, 'pricing', 'index.html')

ARROW = '<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
CHECK = '<svg class="ck" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7"/></svg>'

PLANS = [
    dict(id='free', name='Free', tag='For very small teams', annual=0, monthly=0, unit='for teams of up to 5',
         blurb='Run people basics for up to 5 employees at no cost.', cta='Start free', href='/contact/?interest=free', style='btn-outline',
         items=['Up to 5 employees', 'Employee records', 'Attendance and leave tracking', 'Employee self-service', 'Email support']),
    dict(id='standard', name='Standard', tag='Most popular', annual=59, monthly=71, unit='per user / month',
         blurb='The full HR workspace for growing teams of 6 or more.', cta='Request a demo', href='/contact/?interest=standard', style='btn-primary', featured=True,
         items=['Everything in Free', 'Unlimited employees', 'Approval workflows', 'HR documents and standard reports', 'Payroll-related process support', 'Optional guided implementation']),
    dict(id='premium', name='Premium', tag='For scaling teams', annual=99, monthly=119, unit='per user / month',
         blurb='More depth, integrations and faster support as you scale.', cta='Request a demo', href='/contact/?interest=premium', style='btn-ink',
         items=['Everything in Standard', 'Biometric attendance integration included', 'Advanced reporting', 'Priority support', 'Optional guided implementation']),
    dict(id='enterprise', name='Enterprise', tag='Custom', annual=None, monthly=None, unit='tailored to your organisation',
         blurb='Custom workflows, integrations and rollout for larger organisations.', cta='Talk to us', href='/contact/?interest=enterprise', style='btn-outline',
         items=['Everything in Premium', 'Custom workflows and integrations', 'Dedicated implementation team', 'Custom contract and invoicing', 'Security review support']),
]

# (feature, free, standard, premium, enterprise); True = included, False = not, str = note
FEATURES = [
    ('People', [
        ('Employees', 'Up to 5', 'Unlimited', 'Unlimited', 'Unlimited'),
        ('Employee records and profiles', True, True, True, True),
        ('Employee self-service', True, True, True, True),
        ('HR documents', False, True, True, True),
    ]),
    ('Time and leave', [
        ('Attendance and leave tracking', True, True, True, True),
        ('Approval workflows', False, True, True, True),
        ('Biometric attendance integration', False, 'Add-on', True, True),
    ]),
    ('Insight and process', [
        ('Standard reports', False, True, True, True),
        ('Advanced reporting', False, False, True, True),
        ('Payroll-related process support', False, True, True, True),
        ('Custom workflows and integrations', False, False, False, True),
    ]),
    ('Support and rollout', [
        ('Email support', True, True, True, True),
        ('Priority support', False, False, True, True),
        ('Guided implementation', False, 'Add-on', 'Add-on', 'Scoped for you'),
        ('Custom contract and invoicing', False, False, False, True),
        ('Security review support', False, False, False, True),
    ]),
]

FAQ = [
    ('Is the Free plan really free?', 'Yes. Teams of up to 5 employees can use Onjaal HRMS on the Free plan at ₹0. No card is required. Request access and our team will set you up.'),
    ('What happens when we grow past 5 employees?', 'You move to Standard, billed per user. We will tell you before that happens and confirm the change in writing, so there are no surprises.'),
    ('What is the difference between Standard and Premium?', 'Standard covers the full HR workspace: records, attendance, leave, approvals, documents and standard reports. Premium adds biometric attendance integration, advanced reporting and priority support.'),
    ('How does annual billing work?', 'Annual plans are billed once a year at ₹59 (Standard) or ₹99 (Premium) per user per month. Billed monthly, the rates are ₹71 and ₹119. Annual billing saves about 17%.'),
    ('What does guided implementation include?', 'It is an optional one-time service from ₹60,000 for a 150-user deployment: initial setup and configuration, workflow and requirements alignment, data preparation guidance, and user onboarding and handover. Smaller or larger teams are scoped in your proposal.'),
    ('Will it work with our biometric attendance device?', 'Biometric integration is ₹15,000 one-time on Standard and included on Premium. Whether it is possible depends on your device and its API compatibility, so scope is confirmed before any commitment. Mentioning your device make and model in your enquiry helps.'),
    ('Are taxes included?', 'No. Prices are in Indian rupees and exclude applicable taxes, which are confirmed in your written proposal.'),
    ('What should a larger organisation choose?', 'Enterprise is scoped around your workflows, integrations, rollout and contract. We recommend it from roughly 200 users, or sooner if you need custom integrations. Send an enquiry and we will prepare a proposal.'),
    ('What happens after we send an enquiry?', 'Our team will review your enquiry and get back to you. The details you share help us prepare a more relevant conversation and demo.'),
]


def price_html(p):
    if p['annual'] is None:
        return '<p class="plan-price"><span class="amt amt-text">Custom</span></p><p class="plan-unit">%s</p>' % p['unit']
    if p['annual'] == 0:
        return '<p class="plan-price"><span class="amt">₹0</span></p><p class="plan-unit">%s</p>' % p['unit']
    return ('<p class="plan-price"><span class="amt" data-annual="%d" data-monthly="%d">₹%d</span></p>'
            '<p class="plan-unit"><span data-unit-annual>%s, billed yearly</span><span data-unit-monthly hidden>%s, billed monthly</span></p>'
            % (p['annual'], p['monthly'], p['annual'], p['unit'], p['unit']))


def card(p):
    cls = 'plan' + (' is-featured' if p.get('featured') else '')
    badge = '<span class="plan-badge">%s</span>' % p['tag']
    lis = ''.join('<li>%s<span>%s</span></li>' % (CHECK, i) for i in p['items'])
    return ('<article class="%s" data-reveal><header><h3>%s</h3>%s</header>%s<p class="plan-blurb">%s</p>'
            '<a class="btn %s btn-block" href="%s">%s</a><ul class="plan-list">%s</ul></article>'
            % (cls, p['name'], badge, price_html(p), p['blurb'], p['style'], p['href'], p['cta'], lis))


def cell(v):
    if v is True:
        return '<td><span class="yes">%s<span class="sr-only">Included</span></span></td>' % CHECK
    if v is False:
        return '<td><span class="no" aria-hidden="true">–</span><span class="sr-only">Not included</span></td>'
    return '<td><span class="note">%s</span></td>' % v


def table():
    rows = []
    for group, feats in FEATURES:
        rows.append('<tr class="grp"><th scope="colgroup" colspan="5">%s</th></tr>' % group)
        for f in feats:
            rows.append('<tr><th scope="row">%s</th>%s</tr>' % (f[0], ''.join(cell(v) for v in f[1:])))
    head = ''.join('<th scope="col">%s</th>' % p['name'] for p in PLANS)
    return ('<div class="compare-scroll" tabindex="0" role="region" aria-label="Plan comparison table"><table class="compare">'
            '<caption class="sr-only">Compare Onjaal HRMS plans</caption>'
            '<thead><tr><th scope="col"><span class="sr-only">Feature</span></th>%s</tr></thead><tbody>%s</tbody></table></div>'
            % (head, ''.join(rows)))


def faq():
    return ''.join('<details><summary>%s</summary><p>%s</p></details>' % (q, a) for q, a in FAQ)


MAIN = '''<main id="main">
<section class="on-night page-hero pricing-hero" aria-labelledby="page-title">
  <div class="glow" aria-hidden="true"></div><div class="grid-lines" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-current="page">Pricing</span></li></ol></nav>
    <div class="pricing-intro">
      <h1 id="page-title">Simple pricing that grows with your team.</h1>
      <p class="lead">Start free for up to 5 people. Pay per user when you grow. Talk to us when you need something custom. All prices in ₹, excluding applicable taxes.</p>
      <div class="billing-toggle" role="radiogroup" aria-label="Billing period">
        <input type="radio" name="billing" id="bill-annual" value="annual" checked><label for="bill-annual">Annual <span class="save">Save ~17%</span></label>
        <input type="radio" name="billing" id="bill-monthly" value="monthly"><label for="bill-monthly">Monthly</label>
      </div>
    </div>
  </div>
</section>

<section class="plans-stage" aria-label="Plans">
  <div class="wrap">
    <div class="plans">__CARDS__</div>
    <p class="plans-note">Free plan: up to 5 employees. Paid plans are billed per user. Optional one-time services are listed below. Applicable taxes are confirmed in your written proposal.</p>
  </div>
</section>

<section class="section" aria-labelledby="compare-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="kicker">Compare plans</span>
      <h2 id="compare-title">Every feature, side by side.</h2>
      <p>No hidden tiers and no surprise limits. If something you need is not listed, ask us.</p>
    </div>
    __TABLE__
  </div>
</section>

<section class="section section-mist" aria-labelledby="addons-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="kicker">Optional services</span>
      <h2 id="addons-title">One-time add-ons, priced upfront.</h2>
      <p>Recurring and one-time costs stay separate, so you always know what repeats each year.</p>
    </div>
    <div class="addons">
      <article class="tile" data-reveal><span class="status status-soon">One-time</span><h3>Guided implementation</h3><p class="addon-price">From ₹60,000</p><p>For a 150-user deployment. Initial setup and configuration, workflow and requirements alignment, data preparation guidance, and user onboarding and handover.</p></article>
      <article class="tile" data-reveal data-d="1"><span class="status status-soon">One-time</span><h3>Biometric integration</h3><p class="addon-price">₹15,000 <small>included in Premium</small></p><p>Connect your attendance devices. Subject to device and API compatibility and confirmed scope.</p></article>
    </div>
  </div>
</section>

<section class="section" id="estimator" aria-labelledby="calc-title">
  <div class="wrap">
    <div class="section-head" data-reveal>
      <span class="kicker">Estimate your cost</span>
      <h2 id="calc-title">Size it for your team.</h2>
      <p>An indicative estimate. Your written proposal confirms the final scope and taxes.</p>
    </div>
    <div class="calc" data-reveal>
      <div class="calc-controls">
        <fieldset class="calc-plan"><legend>Plan</legend>
          <label><input type="radio" name="calc-plan" value="standard" checked><span>Standard</span></label>
          <label><input type="radio" name="calc-plan" value="premium"><span>Premium</span></label>
        </fieldset>
        <div class="calc-row">
          <label for="calc-range"><span>Team size</span><output id="calc-users-out" for="calc-range calc-users">150 users</output></label>
          <input id="calc-range" type="range" min="1" max="500" step="1" value="150">
        </div>
        <div class="calc-row">
          <div class="calc-label"><label for="calc-users">Exact number of users</label></div>
          <div class="calc-users"><input id="calc-users" type="number" min="1" max="1000" value="150" inputmode="numeric"><span>users (up to 1,000)</span></div>
        </div>
        <label class="calc-check"><input id="calc-annual" type="checkbox" checked><span>Bill annually<small>Saves about 17% against monthly billing.</small></span></label>
        <label class="calc-check"><input id="calc-impl" type="checkbox"><span>Add guided implementation<small>One-time ₹60,000 (150-user scope).</small></span></label>
        <label class="calc-check"><input id="calc-bio" type="checkbox"><span id="calc-bio-text">Add biometric integration<small>One-time ₹15,000. Included in Premium.</small></span></label>
      </div>
      <div class="calc-result" aria-live="polite">
        <p class="calc-plan-line" id="calc-plan-line">Standard plan</p>
        <dl>
          <div><dt id="calc-rate-label">Per user per month</dt><dd id="calc-rate">₹59</dd></div>
          <div><dt>Subscription per month</dt><dd id="calc-monthly">₹8,850</dd></div>
          <div><dt>Subscription per year</dt><dd id="calc-yearly">₹1,06,200</dd></div>
          <div><dt>One-time services</dt><dd id="calc-onetime">₹0</dd></div>
        </dl>
        <p class="calc-total"><span>First-year total</span><strong id="calc-first">₹1,06,200</strong></p>
        <p class="calc-note" id="calc-note">Applicable taxes are confirmed in your written proposal.</p>
        <a class="btn btn-primary" id="calc-cta" href="/contact/?interest=standard">Get this as a written proposal</a>
      </div>
    </div>
  </div>
</section>

<section class="section section-mist" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div class="faq-head"><h2 id="faq-title">Pricing questions</h2>
      <p>Can’t find your answer? Email <a href="mailto:tech@onjaal.com">tech@onjaal.com</a>.</p></div>
    <div class="faq-list">__FAQ__</div>
  </div>
</section>

<section class="on-night cta-band" aria-labelledby="cta-title">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap" data-reveal>
    <h2 id="cta-title">Start free. Scale when you are ready.</h2>
    <p>Request free access for up to 5 people, or get a written proposal for a larger team.</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="/contact/?interest=free">Start free __ARROW__</a><a class="btn btn-ghost btn-lg" href="/contact/?interest=pricing">Ask for a proposal</a></div>
  </div>
</section>

</main>'''


def ld():
    faq_ld = {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
    offers = []
    for p in PLANS:
        if p['annual'] is None:
            continue
        offers.append({"@type": "Offer", "name": p['name'], "price": str(p['annual']), "priceCurrency": "INR",
                       "url": "https://onjaal.com/pricing/",
                       "priceSpecification": {"@type": "UnitPriceSpecification", "price": str(p['annual']), "priceCurrency": "INR",
                                              "unitText": "user per month, billed yearly"}})
    app = {"@type": "SoftwareApplication", "name": "Onjaal HRMS", "applicationCategory": "BusinessApplication",
           "operatingSystem": "Web", "url": "https://onjaal.com/products/hrms/", "offers": offers}
    crumbs = {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://onjaal.com/"},
        {"@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://onjaal.com/pricing/"}]}
    return ('<script type="application/ld+json">\n'
            + json.dumps({"@context": "https://schema.org", "@graph": [crumbs, faq_ld, app]}, ensure_ascii=False, indent=2)
            + '\n</script>\n')


DESC = 'Onjaal HRMS pricing: Free for up to 5 employees, Standard from ₹59 and Premium from ₹99 per user per month on annual billing, and custom Enterprise plans.'
TITLE = 'Pricing — Free, Standard, Premium and Enterprise | Onjaal HRMS'

s = open(PATH, encoding='utf-8').read()
main = (MAIN.replace('__CARDS__', ''.join(card(p) for p in PLANS)).replace('__TABLE__', table())
        .replace('__FAQ__', faq()).replace('__ARROW__', ARROW))
s = re.sub(r'<main id="main">.*?</main>', lambda m: main, s, count=1, flags=re.S)
s = re.sub(r'<script type="application/ld\+json">.*?</script>\n', '', s, flags=re.S)
s = s.replace('</head>', ld() + '</head>', 1)
s = re.sub(r'<title>.*?</title>', lambda m: '<title>%s</title>' % TITLE, s, count=1)
for key in ('name="description"', 'property="og:title"', 'property="og:description"', 'name="twitter:title"', 'name="twitter:description"'):
    val = TITLE if 'title' in key else DESC
    s = re.sub(r'(<meta %s content=")[^"]*' % re.escape(key), lambda m: m.group(1) + val, s)
open(PATH, 'w', encoding='utf-8', newline='').write(s)
print('pricing rebuilt')

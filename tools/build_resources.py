"""Generate /resources/ (hub + guides). Edit GUIDES below, then run:
    python tools/build_resources.py && python tools/sync_layout.py && python tools/check_site.py
Section items starting with "p:" become paragraphs; other items become checklist bullets.
Add new guide URLs to sitemap.xml (check_site.py will tell you if you forget).
"""
import html, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARROW = '<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg>'
BOOT = "<script>document.documentElement.classList.add('js');try{var t=localStorage.getItem('onjaal-theme');if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>"
DATE = '2026-10-14'


def e(x):
    return html.escape(x, quote=True)


GUIDES = [
    dict(slug='hrms-for-indian-smes', tag='Buying guide', read='6 min read',
         title='HRMS software for Indian SMEs: what to look for',
         desc='What a growing Indian business should expect from HRMS software: core modules, rollout, pricing transparency and the questions to ask before buying.',
         intro='If your team has outgrown spreadsheets and WhatsApp groups, an HRMS is the next step. Here is what to expect from one, and how to tell a good fit from a good demo.',
         sections=[
             ('What an HRMS actually does', ['p:An HRMS (human resource management system) keeps the everyday facts about your people in one place: who works for you, where they are today, what leave they have taken and what is waiting for approval.',
                                             'p:The goal is not more software. It is fewer places where the same fact is typed, checked and argued about.']),
             ('The core modules to expect', ['Employee records and documents, with a profile for every person', 'Attendance, including biometric device integration where you use it', 'Leave policies, balances and holiday calendars', 'Approvals and employee self-service, so requests are easy to follow', 'Reports on headcount, attendance and leave', 'Payroll-related processes. Ask exactly what is covered, because statutory scope varies']),
             ('Why growing teams outgrow spreadsheets', ['Several versions of the truth: the sheet, the biometric export and someone’s memory', 'Approvals buried in chat or email with no trail', 'Month-end spent reconciling leave against attendance', 'New joiners and exits handled differently every time']),
             ('What is specific to Indian teams', ['p:Look for software that treats these as normal, not as exceptions.', 'Several leave types, including statutory leave that applies to you', 'Regional holiday calendars and shift patterns', 'Biometric attendance devices from different vendors', 'Statutory processes such as provident fund, ESI and professional tax, which differ by state and organisation. Confirm scope with the vendor and your advisor']),
             ('How to compare vendors', ['Is the price published? Hidden pricing usually means variable pricing', 'Is it priced per user, or in flat bands? Flat bands can be costly for small teams', 'What is recurring and what is one-time? Ask for them separately', 'Is there a free plan or a trial so your team can try it first?', 'Can you export all your data, in a usable format, if you leave?']),
             ('A sensible rollout', ['Understand your processes, team size and current tools', 'Configure modules, workflows and data requirements', 'Pilot with one team before everyone', 'Go live with clear ownership for HR and managers', 'Review after a month and refine']),
             ('Where Onjaal HRMS fits', ['p:Onjaal HRMS covers employee records, attendance, leave, approvals and HR documents. It is free for up to 5 employees, then Standard is ₹59 and Premium is ₹99 per user per month on annual billing, excluding applicable taxes.',
                                         'p:See the <a class="inline-link" href="/pricing/">pricing page</a> for the comparison and an estimator, or <a class="inline-link" href="/products/hrms/">explore the product</a>.']),
         ]),
    dict(slug='leave-and-attendance-management', tag='Guide', read='5 min read',
         title='Leave and attendance management: why they belong together',
         desc='Why leave and attendance should be one system, what should flow between them automatically, and the signs you have outgrown manual tracking.',
         intro='Leave and attendance describe the same thing from two sides: who is working and who is not. When they live in separate places, someone reconciles them by hand every month.',
         sections=[
             ('The reconciliation problem', ['p:A manager approves a day off on chat. HR records it in a leave sheet. The biometric export still shows the person as absent. At month end, someone matches the three.',
                                             'p:Every manual step is a place for an error, an argument or a delay.']),
             ('What should flow automatically', ['An approved leave should show as leave in attendance, not as absence', 'Holidays and weekly offs should be applied once, from one calendar', 'Leave balances should update the moment a request is decided', 'Regularised punches should correct attendance and not need a second entry']),
             ('Policies to align first', ['Leave types and how each is earned', 'Grace periods and what counts as a late mark', 'How and by when a missed punch can be regularised', 'Who approves, and who covers when the approver is away', 'How half-days, short days and comp-offs are counted']),
             ('Signs you have outgrown manual tracking', ['Month-end closing takes days, not hours', 'Employees ask HR for their leave balance', 'Approvals are lost between inboxes', 'Managers keep their own side sheets', 'You cannot answer “who is out next Friday” in under a minute']),
             ('Numbers worth watching', ['Attendance rate by team and by day of the week', 'Approval turnaround time', 'Late marks and regularisation requests', 'Leave taken against entitlement, so balances do not pile up unnoticed']),
             ('How Onjaal approaches it', ['p:In Onjaal HRMS, approving a leave request updates attendance for those days, so managers and HR see the same picture. Employees can follow their requests, and approvals do not depend on a chat thread.',
                                           'p:You can <a class="inline-link" href="/#preview">try this in the live preview</a>: approve Rohan Deshmukh’s leave and watch Friday’s attendance change.']),
         ]),
    dict(slug='leave-policy-checklist', tag='Policy', read='5 min read',
         title='A leave policy checklist for growing teams',
         desc='A practical checklist for writing a clear leave policy: leave types, accrual, carry-forward, approvals and records.',
         intro='A clear leave policy prevents most of the arguments HR ends up refereeing. Use this checklist to draft one, or to review the one you already have.',
         sections=[
             ('Decide the leave types', ['Casual leave, sick leave and earned (privilege) leave are the usual starting set.', 'Add statutory leave that applies to your organisation, such as maternity leave under the Maternity Benefit Act.', 'Decide how optional holidays, compensatory off and unpaid leave work.']),
             ('Define how leave is earned', ['State the annual entitlement for each type.', 'Say whether leave accrues monthly or is credited upfront.', 'Explain how probation, joining mid-year and exits are handled.']),
             ('Set the carry-forward and encashment rules', ['Say what carries forward, up to what limit, and for how long.', 'State whether any leave can be encashed, and when.', 'Make lapse dates visible to employees.']),
             ('Write the request and approval flow', ['Say how much notice is expected, and what counts as an emergency.', 'Name who approves, and who covers when the approver is away.', 'Set a response time so requests are not left hanging.']),
             ('Cover documentation and records', ['Say when a medical certificate is needed.', 'Keep one source of truth for balances and history.', 'Make sure approved leave shows up correctly in attendance.']),
             ('Check the rules that apply to you', ['Rules can vary by state and by establishment type, for example under Shops and Establishments laws.', 'Have the final policy reviewed by a qualified advisor.']),
         ]),
    dict(slug='attendance-policy-checklist', tag='Policy', read='4 min read',
         title='An attendance policy checklist for Indian SMEs',
         desc='A practical checklist for defining shifts, grace periods, regularisation and records in an attendance policy.',
         intro='Attendance disputes are usually policy gaps in disguise. Settle these points once and write them down.',
         sections=[
             ('Working hours and shifts', ['Define standard hours, shifts and weekly offs.', 'Say how half-days and short days are counted.']),
             ('Grace and late marks', ['Set a grace period and say how many late arrivals are tolerated.', 'State what happens after that, and make it consistent.']),
             ('How attendance is captured', ['Choose the method: biometric device, app, or manual entry.', 'Say what happens when the device is down or someone forgets to punch.']),
             ('Regularisation', ['Define how employees correct a missed or wrong entry.', 'Set a window and an approver, so corrections do not pile up at month end.']),
             ('Remote and field work', ['Say who may work remotely and how their attendance is recorded.', 'Define how on-duty and field visits are logged.']),
             ('Overtime and holidays', ['State whether overtime is allowed, who approves it, and how it is recorded.', 'Publish the holiday calendar early in the year.']),
             ('Keep it connected to leave', ['Leave, holidays and attendance should tell one story.', 'When approved leave updates attendance automatically, the monthly reconciliation shrinks.']),
         ]),
    dict(slug='choosing-hr-software', tag='Buying guide', read='5 min read',
         title='Choosing HR software: 10 questions to ask',
         desc='Ten vendor-neutral questions to ask before you pick an HRMS, from pricing transparency to data export.',
         intro='Most HR software looks the same in a demo. These questions show you the differences that matter after the contract is signed.',
         sections=[
             ('About fit', ['Does it handle the way we actually work, or will we bend our process to it?', 'Can employees and managers use it without training sessions?', 'Does leave flow into attendance without re-entry?']),
             ('About cost', ['Is the pricing published? Hidden pricing usually means variable pricing.', 'What is recurring, and what is one-time? Ask for them separately.', 'What happens to the price when we add ten people?', 'Are taxes included or extra?']),
             ('About rollout', ['Who does the setup, and what exactly is included?', 'How is our existing data brought in?']),
             ('About the long term', ['Can we export all our data in a usable format?', 'How does support work, and who answers when something breaks?', 'What else is the vendor building, and will it connect to what we already use?']),
         ]),
]


def shell(path, title, desc, crumbs, main, extra_ld=None, og_type='website'):
    url = 'https://onjaal.com' + path
    items = [{"@type": "ListItem", "position": i + 1, "name": n, "item": 'https://onjaal.com' + h} for i, (n, h) in enumerate(crumbs)]
    ld = json.dumps({"@context": "https://schema.org", "@graph": [{"@type": "BreadcrumbList", "itemListElement": items}] + (extra_ld or [])}, ensure_ascii=False, indent=2)
    full_title = title + ' | Onjaal'
    return f'''<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(full_title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#030A1A">
<meta name="color-scheme" content="light dark">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="Onjaal">
<meta property="og:locale" content="en_IN">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{e(full_title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="https://onjaal.com/assets/brand/og/resources.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Onjaal resources.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(full_title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="https://onjaal.com/assets/brand/og/resources.png">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/brand/favicon-96.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/schibsted-grotesk-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
{BOOT}
<script type="application/ld+json">
{ld}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"></header>
<main id="main">
{main}
</main>
<footer class="site-footer"></footer>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
'''


def hero(title, lead, crumbs_html, extra=''):
    return f'''<section class="on-night page-hero" aria-labelledby="page-title">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol>{crumbs_html}</ol></nav>
    <h1 id="page-title">{title}</h1>
    <p class="lead">{lead}</p>{extra}
  </div>
</section>'''


def cta(h, p, btn, href):
    return f'''<section class="on-night cta-band" aria-labelledby="cta-title">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap" data-reveal>
    <h2 id="cta-title">{h}</h2>
    <p>{p}</p>
    <div class="actions"><a class="btn btn-primary btn-lg" href="{href}">{btn} {ARROW}</a></div>
  </div>
</section>'''


def write(path, content):
    d = os.path.join(ROOT, path.strip('/').replace('/', os.sep))
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8', newline='').write(content)


def section_html(title, items):
    paras = [i[2:] for i in items if i.startswith('p:')]
    bullets = [i for i in items if not i.startswith('p:')]
    out = '<h2>%s</h2>' % e(title)
    out += ''.join('<p>%s</p>' % p for p in paras)  # paragraphs may contain trusted inline links
    if bullets:
        out += '<ul class="checklist">%s</ul>' % ''.join('<li>%s</li>' % e(b) for b in bullets)
    return out


def guide_page(g):
    secs = ''.join(section_html(t, items) for t, items in g['sections'])
    related = [x for x in GUIDES if x['slug'] != g['slug']][:3]
    rel = ''.join('<li><a href="/resources/%s/">%s</a></li>' % (x['slug'], e(x['title'])) for x in related)
    ld = [{"@type": "Article", "headline": g['title'], "description": g['desc'], "datePublished": DATE, "dateModified": DATE,
           "author": {"@id": "https://onjaal.com/#organization"}, "publisher": {"@id": "https://onjaal.com/#organization"},
           "mainEntityOfPage": "https://onjaal.com/resources/%s/" % g['slug']}]
    main = hero(e(g['title']), e(g['intro']),
                '<li><a href="/">Home</a></li><li><a href="/resources/">Resources</a></li><li><span aria-current="page">%s</span></li>' % e(g['tag']),
                '<p class="meta-line">%s · %s</p>' % (e(g['tag']), g['read'])) + f'''
<section class="section">
  <div class="wrap">
    <article class="article">
      {secs}
      <aside class="related" aria-label="Related guides"><h2>Keep reading</h2><ul>{rel}</ul></aside>
      <p class="fine">This guide is general information, not legal advice. Rules differ by state and organisation, so have your final policy reviewed by a qualified advisor.</p>
    </article>
  </div>
</section>
''' + cta('Want HR that does this for you?', 'See how Onjaal HRMS handles leave, attendance and approvals together.', 'Explore Onjaal HRMS', '/products/hrms/')
    path = '/resources/%s/' % g['slug']
    write(path, shell(path, g['title'], g['desc'], [('Home', '/'), ('Resources', '/resources/'), (g['title'], path)], main, ld, 'article'))


for g in GUIDES:
    guide_page(g)

cards = ''.join(
    f'''<a class="res-card" href="/resources/{g['slug']}/" data-reveal><span class="res-tag">{g['tag']}</span><h3>{e(g['title'])}</h3><p>{e(g['desc'])}</p><span class="card-foot">{g['read']} <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></a>'''
    for g in GUIDES)
hub = hero('Practical guides for people teams.', 'Short, plain-English guides for HR in growing Indian businesses. No sign-up needed.',
           '<li><a href="/">Home</a></li><li><span aria-current="page">Resources</span></li>') + f'''
<section class="section">
  <div class="wrap">
    <h2 class="sr-only">All guides</h2>
    <div class="res-grid">{cards}</div>
    <p class="fine">Guides are general information, not legal advice.</p>
  </div>
</section>
''' + cta('Questions we have not covered?', 'Tell us what you are trying to sort out. We may write the next guide about it.', 'Get in touch', '/contact/')
write('/resources/', shell('/resources/', 'Resources: HR guides and checklists for Indian teams',
                           'Practical, plain-English HR guides for growing teams in India: choosing an HRMS, leave and attendance management, leave policy and attendance policy checklists.',
                           [('Home', '/'), ('Resources', '/resources/')], hub))
print('wrote hub + %d guides' % len(GUIDES))

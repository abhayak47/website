"""SEO and structured-data consistency checks (standard library only).

Run from the repo root:  python tools/check_seo.py      (exit code 1 on any failure)

Complements tools/check_site.py. Checks:
  * canonical URLs follow one strategy: https, apex domain, trailing slash, no index.html, no query string
  * every sitemap URL is canonical, and no sitemap URL is blocked by robots.txt
  * private/internal folders are disallowed in robots.txt and absent from the sitemap
  * heading levels never skip (h1 -> h3)
  * JSON-LD: valid, no rating/review markup, every @id defined once with one type,
    every {"@id": ...} reference resolves, Organization/WebSite defined exactly once
  * every Offer price in JSON-LD appears in the page's visible text
  * llms.txt (if present) only links to pages that exist
"""
import glob, json, os, re, sys
from html import unescape
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SKIP = ('tools/', 'node_modules/', 'onjaal-website-redesign/', '.github/', 'docs/')
FORBIDDEN = {'Review', 'AggregateRating', 'Rating', 'Person'}  # nothing verified to describe yet
PRIVATE = ('/docs/', '/tools/', '/.github/')
fails = []


def fail(where, msg):
    fails.append('%s: %s' % (where, msg))


def read(p):
    return open(p, encoding='utf-8').read()


def nodes_of(doc):
    return doc.get('@graph', [doc]) if isinstance(doc, dict) else doc


defs, refs = {}, []
org_count = site_count = 0
pages = {}
for f in glob.glob('**/*.html', recursive=True):
    f = f.replace(os.sep, '/')
    if not f.startswith(SKIP):
        pages[f] = read(f)

for f, s in sorted(pages.items()):
    path = '/' + f[:-len('index.html')] if f.endswith('index.html') else '/' + f
    indexable = not re.search(r'name="robots" content="[^"]*noindex', s) and f != '404.html'

    c = re.search(r'rel="canonical" href="([^"]*)"', s)
    if indexable and c:
        u = urlparse(c.group(1))
        if u.scheme != 'https' or u.netloc != 'onjaal.com' or u.query or u.fragment or 'index.html' in u.path or not u.path.endswith('/'):
            fail(f, 'canonical breaks the URL strategy: ' + c.group(1))

    levels = [int(x) for x in re.findall(r'<h([1-6])[\s>]', s)]
    for a, b in zip(levels, levels[1:]):
        if b > a + 1:
            fail(f, 'heading level skips from h%d to h%d' % (a, b))
            break

    text = unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', '', s, flags=re.S)))
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        doc = json.loads(block)

        def walk(n):
            global org_count, site_count
            if isinstance(n, list):
                for x in n:
                    walk(x)
                return
            if not isinstance(n, dict):
                return
            t = n.get('@type')
            types = t if isinstance(t, list) else [t]
            for tt in types:
                if tt in FORBIDDEN:
                    fail(f, 'unverified markup type in JSON-LD: ' + str(tt))
            if t == 'Organization' and n.get('@id', '').endswith('#organization') and 'name' in n:
                org_count += 1
            if t == 'WebSite':
                site_count += 1
            if '@id' in n:
                if t is None:
                    refs.append((f, n['@id']))
                else:
                    prev = defs.get(n['@id'])
                    if prev and prev != t:
                        fail(f, '@id %s used with conflicting types %s / %s' % (n['@id'], prev, t))
                    defs[n['@id']] = t
            if t == 'Offer' and 'price' in n and n['price'] not in ('0', 0):
                if '₹' + str(n['price']) not in text:
                    fail(f, 'Offer price %s is not visible on the page' % n['price'])
            for v in n.values():
                walk(v)
        walk(nodes_of(doc))

for f, r in refs:
    if r not in defs:
        fail(f, 'JSON-LD reference to undefined @id ' + r)
if org_count != 1:
    fail('site', 'expected exactly one full Organization definition, found %d' % org_count)
if site_count != 1:
    fail('site', 'expected exactly one WebSite definition, found %d' % site_count)

robots = read('robots.txt')
disallow = [l.split(':', 1)[1].strip() for l in robots.splitlines() if l.lower().startswith('disallow:') and l.split(':', 1)[1].strip()]
for p in PRIVATE:
    if p not in disallow:
        fail('robots.txt', 'does not disallow ' + p)
sm = re.findall(r'<loc>([^<]*)</loc>', read('sitemap.xml'))
for u in sm:
    p = urlparse(u)
    if p.scheme != 'https' or p.netloc != 'onjaal.com' or not p.path.endswith('/') and p.path != '/' or 'index.html' in p.path or p.query:
        fail('sitemap.xml', 'non-canonical URL ' + u)
    if any(p.path.startswith(d) for d in disallow):
        fail('sitemap.xml', 'URL blocked by robots.txt: ' + u)
    if any(p.path.startswith(x) for x in PRIVATE):
        fail('sitemap.xml', 'private path in sitemap: ' + u)

if os.path.exists('llms.txt'):
    for u in re.findall(r'\((https://onjaal\.com[^)]*)\)', read('llms.txt')):
        t = urlparse(u).path.lstrip('/')
        t = t + 'index.html' if not t or t.endswith('/') else t
        if not os.path.exists(t):
            fail('llms.txt', 'links to a missing page ' + u)

for m in fails:
    print('FAIL ', m)
print('SEO checks: %d pages, %d JSON-LD ids, %d failures' % (len(pages), len(defs), len(fails)))
sys.exit(1 if fails else 0)

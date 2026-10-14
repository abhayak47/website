"""Static quality gate for the Onjaal site (standard library only).

Run from the repo root:  python tools/check_site.py
Exit code 1 if any check fails, so it can run in CI.

Checks, per page: JSON-LD parses, one <h1>, unique ids, aria-labelledby targets exist, images have alt,
internal links and in-page #anchors resolve, title/description length, canonical matches the URL,
share image exists. Site-wide: sitemap URLs exist and exclude noindex pages, robots.txt points at the sitemap,
every indexable page is in the sitemap, manifest icons exist.
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
SKIP = ('tools/', 'node_modules/', 'onjaal-website-redesign/', '.github/')
errors, warnings = [], []


def err(f, m):
    errors.append('%s: %s' % (f, m))


def warn(f, m):
    warnings.append('%s: %s' % (f, m))


def read(p):
    return open(p, encoding='utf-8').read()


def url_to_file(url):
    p = url.split('#')[0].split('?')[0].lstrip('/')
    if not p or p.endswith('/'):
        p += 'index.html'
    return p


pages = {}
for f in glob.glob('**/*.html', recursive=True):
    f = f.replace(os.sep, '/')
    if f.startswith(SKIP):
        continue
    pages[f] = read(f)

indexable = set()
for f, s in sorted(pages.items()):
    path = '/' + f[:-len('index.html')] if f.endswith('index.html') else '/' + f
    noindex = bool(re.search(r'name="robots" content="[^"]*noindex', s))
    if not noindex and f != '404.html':
        indexable.add('https://onjaal.com' + path)

    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            json.loads(b)
        except ValueError as e:
            err(f, 'invalid JSON-LD (%s)' % e)

    if len(re.findall(r'<h1[\s>]', s)) != 1:
        err(f, 'expected exactly one <h1>')
    ids = re.findall(r'\sid="([^"]+)"', s)
    for i in {i for i in ids if ids.count(i) > 1}:
        err(f, 'duplicate id "%s"' % i)
    for a in re.findall(r'aria-labelledby="([^"]+)"', s):
        if a not in ids:
            err(f, 'aria-labelledby target "%s" missing' % a)
    for img in re.findall(r'<img\b[^>]*>', s):
        if 'alt=' not in img:
            err(f, 'image without alt: ' + img[:70])

    for link in set(re.findall(r'(?:href|src)="(/[^"]*)"', s)):
        target = url_to_file(link)
        if not os.path.exists(target):
            err(f, 'broken internal link ' + link)
        elif '#' in link and target.endswith('.html'):
            anchor = link.split('#')[1]
            if anchor and ('id="%s"' % anchor) not in read(target):
                err(f, 'anchor #%s not found in %s' % (anchor, target))

    if not noindex and f != '404.html':
        t = re.search(r'<title>(.*?)</title>', s, re.S)
        d = re.search(r'name="description" content="([^"]*)"', s)
        c = re.search(r'rel="canonical" href="([^"]*)"', s)
        if not t or not 20 <= len(t.group(1)) <= 70:
            warn(f, 'title length %s (aim 30-65)' % (len(t.group(1)) if t else 0))
        if not d or not 70 <= len(d.group(1)) <= 170:
            warn(f, 'description length %s (aim 90-160)' % (len(d.group(1)) if d else 0))
        if not c:
            err(f, 'missing canonical')
        elif c.group(1) != 'https://onjaal.com' + path:
            err(f, 'canonical %s does not match %s' % (c.group(1), path))
        og = re.search(r'property="og:image" content="https://onjaal.com([^"]*)"', s)
        if not og or not os.path.exists(og.group(1).lstrip('/')):
            err(f, 'og:image missing or file not found')

sm = read('sitemap.xml')
sm_urls = set(re.findall(r'<loc>([^<]*)</loc>', sm))
for u in sm_urls:
    if not os.path.exists(url_to_file(u.replace('https://onjaal.com', ''))):
        err('sitemap.xml', 'URL has no file: ' + u)
    if u not in indexable:
        err('sitemap.xml', 'lists a noindex or unknown page: ' + u)
for u in indexable - sm_urls:
    err('sitemap.xml', 'indexable page missing: ' + u)
if 'Sitemap: https://onjaal.com/sitemap.xml' not in read('robots.txt'):
    err('robots.txt', 'does not reference the sitemap')
if os.path.exists('site.webmanifest'):
    for icon in json.loads(read('site.webmanifest')).get('icons', []):
        if not os.path.exists(icon['src'].lstrip('/')):
            err('site.webmanifest', 'missing icon ' + icon['src'])

for w in warnings:
    print('warn ', w)
for e in errors:
    print('FAIL ', e)
print('%d pages checked, %d errors, %d warnings' % (len(pages), len(errors), len(warnings)))
sys.exit(1 if errors else 0)

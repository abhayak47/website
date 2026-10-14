"""Keep every page's shared pieces in sync.

Run from the repo root:  python tools/sync_layout.py

What it does (idempotent):
  * copies tools/partials/header.html and footer.html into every page (and marks the current nav link)
  * makes sure each page links the web manifest and loads assets/js/consent.js
  * points og:image / twitter:image at the page's own share image (assets/brand/og/<slug>.png)
  * appends ?v=<content hash> to local CSS/JS URLs so browsers refetch them when they change
  * refreshes <lastmod> in sitemap.xml from git history (or today's date for files with uncommitted changes)
"""
import datetime, glob, hashlib, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'tools', 'partials')
header = open(os.path.join(P, 'header.html'), encoding='utf-8').read().strip()
footer = open(os.path.join(P, 'footer.html'), encoding='utf-8').read().strip()

SKIP = ('tools/', 'node_modules/', 'onjaal-website-redesign/', '.github/')

# page path -> share image slug and alt text (images come from tools/build_og.py)
OG = {
    '/': ('home', 'Onjaal. Simpler HR for growing teams.'),
    '/pricing/': ('pricing', 'Onjaal pricing. Free, Standard, Premium and Enterprise.'),
    '/products/hrms/': ('hrms', 'Onjaal HRMS. Employee records, attendance, leave and approvals.'),
    '/products/': ('products', 'The Onjaal suite. HRMS today, CRM, ERP and Accounts in development.'),
    '/about/': ('about', 'About Onjaal. Software that makes work clearer.'),
    '/contact/': ('contact', 'Start free or request an Onjaal demo.'),
    '/support/': ('contact', 'Onjaal help and support. How to reach the team.'),
    '/security/': ('security', 'Onjaal trust and data. Plain answers about your information.'),
}


def og_for(path):
    if path.startswith('/resources/'):
        return 'resources', 'Onjaal resources. Practical guides for people teams.'
    return OG.get(path)


def render_header(path):
    def cur(m):
        target = m.group(1)
        return ' aria-current="page"' if path == target or (target != '/' and path.startswith(target)) else ''
    return re.sub(r'\{\{cur:([^}]*)\}\}', cur, header)


def file_hash(url):
    p = os.path.join(ROOT, url.lstrip('/').split('?')[0].replace('/', os.sep))
    if not os.path.exists(p):
        return None
    data = open(p, 'rb').read().replace(bytes([13, 10]), bytes([10]))  # same hash on Windows and Linux checkouts
    return hashlib.md5(data).hexdigest()[:8]


def bust(s):
    def sub(m):
        h = file_hash(m.group(2))
        return '%s="%s?v=%s"' % (m.group(1), m.group(2), h) if h else m.group(0)
    return re.sub(r'(href|src)="(/assets/(?:css|js)/[^"?]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"', sub, s)


def ensure_common(s, path):
    if 'rel="manifest"' not in s:
        s = s.replace('<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
                      '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">', 1)
    if '/assets/js/consent.js' not in s and '<script src="/assets/js/site.js' in s:
        s = re.sub(r'(<script src="/assets/js/site\.js[^"]*" defer></script>)', r'\1\n<script src="/assets/js/consent.js" defer></script>', s, count=1)
    og = og_for(path)
    if og:
        slug, alt = og
        url = 'https://onjaal.com/assets/brand/og/%s.png' % slug
        s = re.sub(r'(<meta property="og:image" content=")[^"]*', lambda m: m.group(1) + url, s)
        s = re.sub(r'(<meta name="twitter:image" content=")[^"]*', lambda m: m.group(1) + url, s)
        s = re.sub(r'(<meta property="og:image:alt" content=")[^"]*', lambda m: m.group(1) + alt, s)
    return s


def page_path(rel):
    return '/' + rel[:-len('index.html')] if rel.endswith('index.html') else '/' + rel


changed = 0
for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
    rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
    if rel.startswith(SKIP):
        continue
    path = page_path(rel)
    s = open(f, encoding='utf-8').read()
    n = re.sub(r'<header class="site-header">.*?</header>', lambda m: render_header(path), s, count=1, flags=re.S)
    n = re.sub(r'<footer class="site-footer">.*?</footer>(\s*<a class="sticky-cta"[^>]*>.*?</a>)?', lambda m: footer, n, count=1, flags=re.S)
    n = ensure_common(n, path)
    n = bust(n)
    if n != s:
        open(f, 'w', encoding='utf-8', newline='').write(n)
        changed += 1
print('updated', changed, 'pages')


# ---- sitemap lastmod
def git(*args):
    try:
        return subprocess.run(['git', '-C', ROOT] + list(args), capture_output=True, text=True, check=True).stdout.strip()
    except Exception:
        return ''


def lastmod(path):
    rel = (path.lstrip('/') + 'index.html') if path.endswith('/') else path.lstrip('/')
    rel = rel or 'index.html'
    if git('status', '--porcelain', '--', rel):
        return datetime.date.today().isoformat()
    return git('log', '-1', '--format=%cs', '--', rel) or datetime.date.today().isoformat()


sm = os.path.join(ROOT, 'sitemap.xml')
xml = open(sm, encoding='utf-8').read()


def fix(m):
    path = m.group(1).replace('https://onjaal.com', '') or '/'
    return '<loc>%s</loc>\n    <lastmod>%s</lastmod>' % (m.group(1), lastmod(path))


new = re.sub(r'<loc>([^<]*)</loc>\s*<lastmod>[^<]*</lastmod>', fix, xml)
if new != xml:
    open(sm, 'w', encoding='utf-8', newline='').write(new)
    print('sitemap lastmod refreshed')

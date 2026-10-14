"""Copy the shared header and footer (tools/partials) into every page.

Run from the repo root:  python tools/sync_layout.py
Pages are plain HTML; this only rewrites the <header class="site-header"> and
<footer class="site-footer"> blocks (plus the sticky mobile CTA after the footer).
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'tools', 'partials')
header = open(os.path.join(P, 'header.html'), encoding='utf-8').read().strip()
footer = open(os.path.join(P, 'footer.html'), encoding='utf-8').read().strip()

def render_header(path):
    def cur(m):
        target = m.group(1)
        return ' aria-current="page"' if path == target or (target != '/' and path.startswith(target)) else ''
    return re.sub(r'\{\{cur:([^}]*)\}\}', cur, header)

changed = 0
for f in glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True):
    rel = os.path.relpath(f, ROOT).replace(os.sep, '/')
    if rel.startswith(('tools/', 'node_modules/', 'onjaal-website-redesign/')):
        continue
    path = '/' + rel[:-len('index.html')] if rel.endswith('index.html') else '/' + rel
    s = open(f, encoding='utf-8').read()
    n = re.sub(r'<header class="site-header">.*?</header>', lambda m: render_header(path), s, count=1, flags=re.S)
    n = re.sub(r'<footer class="site-footer">.*?</footer>(\s*<a class="sticky-cta"[^>]*>.*?</a>)?', lambda m: footer, n, count=1, flags=re.S)
    if n != s:
        open(f, 'w', encoding='utf-8', newline='').write(n)
        changed += 1
print('updated', changed, 'pages')

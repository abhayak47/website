"""Generate per-page social share images (1200x630) and PWA icons.

Run from the repo root:  python tools/build_og.py
Needs Pillow. Uses Segoe UI if present (Windows), otherwise DejaVu/Arial, otherwise Pillow's default.
Edit PAGES to change the text; then run `python tools/sync_layout.py` to point each page at its image.
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'brand', 'og')
MARK = Image.open(os.path.join(ROOT, 'assets', 'brand', 'onjaal-mark.png')).convert('RGBA')

# slug: (headline, supporting line)
PAGES = {
    'home': ('Simpler HR for growing teams.', 'Records, attendance, leave and approvals in one calm workspace. Free for up to 5 people.'),
    'pricing': ('Simple pricing that grows with your team.', 'Free, Standard, Premium and Enterprise. Published upfront, in rupees.'),
    'hrms': ('Onjaal HRMS', 'Employee records, attendance, leave and approvals, together.'),
    'products': ('The Onjaal suite.', 'HRMS today. CRM, ERP and Accounts in development, built to connect.'),
    'about': ('Software that makes work clearer.', 'Practical business software for growing teams in India.'),
    'contact': ('Start free or request a demo.', 'Tell us about your team and what you want to improve.'),
    'resources': ('Practical guides for people teams.', 'Plain-English HR checklists for growing Indian businesses.'),
    'security': ('Plain answers about trust and your data.', 'What our website does, and what we put in writing before you commit.'),
}


def font(size, bold=False):
    for name in (['segoeuib.ttf', 'arialbd.ttf', 'DejaVuSans-Bold.ttf'] if bold else ['segoeui.ttf', 'arial.ttf', 'DejaVuSans.ttf']):
        for base in ('C:/Windows/Fonts/', '/usr/share/fonts/truetype/dejavu/', ''):
            try:
                return ImageFont.truetype(base + name, size)
            except OSError:
                continue
    return ImageFont.load_default()


def wrap(draw, text, fnt, width):
    lines, cur = [], ''
    for word in text.split():
        trial = (cur + ' ' + word).strip()
        if draw.textlength(trial, font=fnt) <= width:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    lines.append(cur)
    return lines


def background(w, h):
    bg = Image.new('RGB', (w, h), (3, 10, 26))
    glow = Image.new('RGB', (w, h), (0, 0, 0))
    d = ImageDraw.Draw(glow)
    d.ellipse((-200, -260, 640, 420), fill=(1, 119, 249))
    d.ellipse((620, 260, 1400, 900), fill=(135, 76, 245))
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    return Image.blend(bg, Image.eval(glow, lambda v: min(255, v)), 0.55)


def og(slug, title, sub):
    w, h = 1200, 630
    img = background(w, h)
    d = ImageDraw.Draw(img)
    mark = MARK.resize((54, int(54 * MARK.height / MARK.width)))
    img.paste(mark, (72, 64), mark)
    d.text((140, 70), 'Onjaal', font=font(40, True), fill=(255, 255, 255))
    y = 190
    for line in wrap(d, title, font(78, True), 980):
        d.text((72, y), line, font=font(78, True), fill=(255, 255, 255))
        y += 94
    y += 14
    for line in wrap(d, sub, font(34), 900):
        d.text((72, y), line, font=font(34), fill=(166, 177, 198))
        y += 46
    d.text((72, h - 70), 'onjaal.com', font=font(30, True), fill=(127, 181, 255))
    img.save(os.path.join(OUT, slug + '.png'), optimize=True)


def icons():
    for size, name in ((192, 'icon-192.png'), (512, 'icon-512.png')):
        img = Image.new('RGB', (size, size), (3, 10, 26))
        m = MARK.resize((int(size * 0.5), int(size * 0.5 * MARK.height / MARK.width)))
        img.paste(m, ((size - m.width) // 2, (size - m.height) // 2), m)
        img.save(os.path.join(ROOT, 'assets', 'brand', name), optimize=True)


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for slug, (t, s) in PAGES.items():
        og(slug, t, s)
    icons()
    print('wrote', len(PAGES), 'share images and 2 icons')

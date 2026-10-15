"""Generate the downloadable HR templates (PDF) in /downloads/.

Run from the repo root:  python tools/build_templates.py
Needs Microsoft Edge or Google Chrome installed (headless print-to-PDF). Edit the TEMPLATES below and re-run.
The PDFs are committed, so the site itself needs no build step. Templates are general starting points,
not legal advice; they say so on every page.
"""
import html, os, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'downloads')
LOGO = os.path.join(ROOT, 'assets', 'brand', 'onjaal-logo-full.png').replace('\\', '/')
UPDATED = '15 October 2026'
NOTE = 'General template for guidance only. Adapt it to your organisation and to the central and state rules that apply to you, and have it reviewed by a qualified professional before use.'

E = html.escape

TEMPLATES = {
    'onjaal-leave-policy-template': dict(
        title='Leave policy template',
        intro='Replace every [bracketed] item. Delete anything that does not apply to your organisation.',
        blocks=[
            ('1. Purpose and scope', ['This policy explains how [Company name] grants, records and approves leave for [all employees / list categories].']),
            ('2. Leave types and entitlement', {'table': (['Leave type', 'Entitlement per [year]', 'How it is earned', 'Carry-forward', 'Notes'], [
                ['Casual leave', '[__ days]', '[Credited upfront / accrues monthly]', '[Yes, up to __ days / No]', '[Maximum days at a time]'],
                ['Sick leave', '[__ days]', '[Credited upfront / accrues monthly]', '[Yes / No]', '[Certificate needed after __ days]'],
                ['Earned (privilege) leave', '[__ days]', '[1 day per __ days worked]', '[Up to __ days]', '[Encashment: yes / no]'],
                ['Statutory leave (for example maternity leave)', '[As required by law]', '[As required by law]', '[As required by law]', '[Refer to the applicable Act and rules]'],
                ['Optional holidays / compensatory off', '[__ days]', '[Rule]', '[Rule]', '[Rule]'],
                ['Leave without pay', '[Rule]', 'Approval only', 'No', '[Rule]']])}),
            ('3. Requesting leave', ['Employees request leave through [system / form] at least [__ days] before the first day, except in an emergency.', 'In an emergency, inform [manager] as soon as possible and submit the request within [__ days].']),
            ('4. Approval', ['The reporting manager approves or declines within [__ working days]. If the manager is away, [alternate approver] decides.', 'Declined requests include a short reason.']),
            ('5. Documents', ['A [medical certificate] is required for sick leave longer than [__ days].', 'Other documents: [list].']),
            ('6. Holidays and weekly offs', ['Public and optional holidays are published in [location] by [date] each year. Weekly offs: [days].']),
            ('7. Carry-forward, lapse and encashment', ['Unused [leave type] lapses on [date] / carries forward up to [__ days].', 'Encashment: [rule, or "not applicable"].']),
            ('8. Joining, probation and exit', ['Leave for employees joining part-way through the year is calculated [method].', 'Leave rules during probation: [rule]. Leave balance at exit: [rule].']),
            ('9. Records', ['Leave balances and history are kept in [system]. Approved leave is reflected in attendance records.']),
            ('10. Review', ['HR reviews this policy every [12 months]. Policy owner: [name, role]. Effective from: [date].']),
        ]),
    'onjaal-attendance-policy-template': dict(
        title='Attendance policy template',
        intro='Replace every [bracketed] item. Delete anything that does not apply to your organisation.',
        blocks=[
            ('1. Purpose and scope', ['This policy sets out how [Company name] records and manages attendance for [all employees / list categories].']),
            ('2. Working hours', {'table': (['Item', 'Rule'], [
                ['Standard hours', '[start time] to [end time], including [__ minutes] break'],
                ['Shifts', '[Describe each shift and who works it]'],
                ['Weekly offs', '[Days]'],
                ['Half day', '[Definition, for example at least __ hours worked]'],
                ['Short day', '[How it is counted]']])}),
            ('3. How attendance is recorded', ['Method: [biometric device / mobile or web check-in / manual register].', 'If a device is unavailable, employees [inform manager and record manually / other rule].']),
            ('4. Grace period and late marks', ['A grace period of [__ minutes] applies.', 'After [__] late marks in a month, [consequence, for example half-day leave deducted].']),
            ('5. Missed or incorrect entries (regularisation)', ['Employees may request a correction within [__ days] with a reason.', '[Manager] approves or declines. Corrections are final after [date each month].']),
            ('6. Remote work and field duty', ['Eligible roles: [list]. Attendance is recorded by [method].', 'Field visits and on-duty days are logged by [method] and approved by [role].']),
            ('7. Overtime', ['Overtime is [permitted with prior approval / not permitted]. Approver: [role]. Recorded in [system]. Compensation: [rule].']),
            ('8. Leave and holidays', ['Approved leave and holidays are applied to attendance automatically or by HR within [__ working days].']),
            ('9. Records and review', ['Attendance records are kept for [period] in [system]. HR reviews this policy every [12 months]. Policy owner: [name, role]. Effective from: [date].']),
        ]),
    'onjaal-hrms-vendor-checklist': dict(
        title='HRMS vendor evaluation checklist',
        intro='Score each vendor from 1 (poor) to 5 (excellent). Multiply by the weight you give each criterion. Compare totals, then check the notes.',
        blocks=[
            ('How to use this', ['Choose 5 to 8 criteria that matter most to your team and set a weight from 1 to 3. Ask every vendor the same questions in the same order. Write down the answers, including what they would not commit to in writing.']),
            ('Scorecard', {'table': (['Criterion', 'Weight (1-3)', 'Vendor A', 'Vendor B', 'Vendor C', 'Notes'], [
                ['Handles our real leave and attendance rules', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Leave flows into attendance without re-entry', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Easy for employees and managers without training', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Pricing published; recurring and one-time costs separate', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Taxes and price changes when we add people are clear', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Setup and data migration plan with named owners', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['We can export all our data in a usable format', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Support: channel, scope and who answers', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Biometric device compatibility confirmed for our devices', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Security and data questions answered in writing', '[ ]', '[ ]', '[ ]', '[ ]', ''],
                ['Total (sum of weight x score)', '', '', '', '', '']])}),
            ('Questions to ask every vendor', ['Which of my processes will I have to change to fit your product?', 'What is included in the price, what is extra, and what is one-time?', 'What happens to the price if we grow by ten people? By a hundred?', 'Who does the setup, and what exactly is included?', 'How is our existing employee data brought in?', 'Can we export everything, in what format, and at what cost?', 'Where is our data hosted, who can access it, and how are backups handled?', 'What are the limits of your payroll support, and what depends on other tools?', 'Which statutory calculations are covered for our organisation?', 'What does support look like, and what is the response commitment for our plan?']),
            ('Red flags', ['Pricing only available after a sales call, with no indication of range.', 'Vague answers about data export or what happens if you leave.', 'Features shown in the demo that are described as "coming soon" in contracts.', 'Pressure to sign before you have tested the product with your own data.']),
        ]),
}

CSS = '''
@page { size: A4; margin: 18mm 16mm 20mm; }
* { box-sizing: border-box; }
body { font-family: "Segoe UI", Arial, sans-serif; color: #01122E; font-size: 10.5pt; line-height: 1.5; margin: 0; }
header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0177F9; padding-bottom: 10px; margin-bottom: 18px; }
header img { height: 34px; }
header span { color: #535B6A; font-size: 9pt; }
h1 { font-size: 21pt; margin: 0 0 6px; letter-spacing: -0.02em; }
.intro { color: #535B6A; margin: 0 0 14px; }
h2 { font-size: 12.5pt; margin: 18px 0 6px; color: #01122E; break-after: avoid; }
ul { margin: 0 0 8px 18px; padding: 0; } li { margin: 0 0 4px; } p { margin: 0 0 8px; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 10px; font-size: 9.5pt; break-inside: auto; }
th, td { border: 1px solid #C3C9D3; padding: 5px 7px; text-align: left; vertical-align: top; }
th { background: #F3F5F8; } tr { break-inside: avoid; }
.note { margin-top: 18px; padding: 8px 10px; background: #F3F5F8; border-left: 3px solid #0177F9; font-size: 9pt; color: #353C4A; }
footer { margin-top: 14px; font-size: 8.5pt; color: #535B6A; }
'''


def render(slug, t):
    parts = []
    for heading, body in t['blocks']:
        parts.append('<h2>%s</h2>' % E(heading))
        if isinstance(body, dict):
            head, rows = body['table']
            parts.append('<table><thead><tr>%s</tr></thead><tbody>%s</tbody></table>' % (
                ''.join('<th>%s</th>' % E(h) for h in head),
                ''.join('<tr>%s</tr>' % ''.join('<td>%s</td>' % E(c) for c in r) for r in rows)))
        elif len(body) > 1 and slug.endswith('checklist') or (len(body) > 2):
            parts.append('<ul>%s</ul>' % ''.join('<li>%s</li>' % E(b) for b in body))
        else:
            parts.extend('<p>%s</p>' % E(b) for b in body)
    return ('<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><title>%s | Onjaal</title><style>%s</style></head><body>'
            '<header><img src="file:///%s" alt="Onjaal"><span>onjaal.com &middot; Free template &middot; Updated %s</span></header>'
            '<h1>%s</h1><p class="intro">%s</p>%s<p class="note">%s</p><footer>Published by Onjaal. https://onjaal.com/resources/</footer></body></html>'
            % (E(t['title']), CSS, LOGO, UPDATED, E(t['title']), E(t['intro']), ''.join(parts), E(NOTE)))


def find_browser():
    for p in ('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
              'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'):
        if os.path.exists(p):
            return p
    return shutil.which('msedge') or shutil.which('google-chrome') or shutil.which('chromium')


if __name__ == '__main__':
    browser = find_browser()
    if not browser:
        sys.exit('No Edge/Chrome found for PDF export.')
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp()
    for slug, t in TEMPLATES.items():
        src = os.path.join(tmp, slug + '.html')
        open(src, 'w', encoding='utf-8').write(render(slug, t))
        pdf = os.path.join(OUT, slug + '.pdf')
        subprocess.run([browser, '--headless', '--disable-gpu', '--no-pdf-header-footer', '--print-to-pdf=' + pdf, 'file:///' + src.replace('\\', '/')],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90)
        print(slug + '.pdf', os.path.getsize(pdf) // 1024, 'KB')

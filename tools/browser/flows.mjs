// User-flow test: preview, tour tabs, theme, mobile menu, enquiry form (network intercepted, nothing is sent).
// node tools/browser/flows.mjs <scratch-dir> http://localhost:8000
import { spawn } from 'node:child_process';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9800 + Math.floor(Math.random() * 150);
const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.argv[2]}/fl${PORT}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let t;
for (let i = 0; i < 50; i++) { try { t = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((x) => x.type === 'page'); if (t) break; } catch {} await sleep(200); }
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const p = new Map(); const handlers = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && p.has(d.id)) { p.get(d.id)(d.result); p.delete(d.id); } else handlers.forEach((h) => h(d)); };
const send = (m, a = {}) => new Promise((r) => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: a })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;
const key = async (k, code, vk) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
const B = process.argv[3];
const results = [];
const ok = (n, c, x = '') => results.push((c ? 'PASS ' : 'FAIL ') + n + (x ? ' | ' + x : ''));

await send('Page.enable');
// Intercept any request to formsubmit.co so nothing is ever sent to the real inbox
let mode = 'success'; let intercepted = 0;
await send('Fetch.enable', { patterns: [{ urlPattern: '*formsubmit.co*' }] });
handlers.push(async (d) => {
  if (d.method === 'Fetch.requestPaused') {
    intercepted++;
    const body = mode === 'success' ? JSON.stringify({ success: 'true', message: 'ok' }) : JSON.stringify({ success: 'false', message: 'needs activation' });
    await send('Fetch.fulfillRequest', { requestId: d.params.requestId, responseCode: mode === 'success' ? 200 : 500, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: Buffer.from(body).toString('base64') });
  }
});

// ---------- desktop: preview ----------
await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: B + '/' }); await sleep(1800);
await ev("document.getElementById('hrms-preview').scrollIntoView({block:'center'})"); await sleep(1500);
ok('preview renders after scrolling near it', await ev("!!document.querySelector('#hrms-preview .pv-app')"));
const before = await ev("document.querySelector('#hrms-preview .pv-tab[aria-selected=true]').textContent.trim()");
await ev("[...document.querySelectorAll('#hrms-preview .pv-tab')].find(b=>/Attendance/.test(b.textContent)).click()"); await sleep(400);
const after = await ev("document.querySelector('#hrms-preview .pv-tab[aria-selected=true]').textContent.trim()");
ok('preview tab switches', before !== after, before + ' -> ' + after);
await ev("[...document.querySelectorAll('#hrms-preview .pv-tab')].find(b=>/Leave/.test(b.textContent)).click()"); await sleep(400);
const approveBtns = await ev("[...document.querySelectorAll('#hrms-preview button')].filter(b=>/^Approve/.test(b.textContent.trim())).length");
ok('leave tab lists requests with Approve buttons', approveBtns > 0, 'Approve buttons: ' + approveBtns);

// ---------- desktop: tour tabs by keyboard ----------
await send('Page.navigate', { url: B + '/' }); await sleep(1500);
await ev("document.querySelector('#tt-1').focus()");
await key('ArrowDown', 'ArrowDown', 40); await sleep(200);
ok('tour tabs: ArrowDown selects the next tab', await ev("document.querySelector('#tt-2').getAttribute('aria-selected')==='true' && !document.querySelector('#tp-2').hidden"));

// ---------- theme toggle ----------
await ev("document.querySelector('[data-theme-toggle]').click()"); await sleep(200);
const th = await ev("document.documentElement.getAttribute('data-theme') + '|' + localStorage.getItem('onjaal-theme')");
ok('theme toggle sets and remembers the choice', /^(dark|light)\|(dark|light)$/.test(th) && th.split('|')[0] === th.split('|')[1], th);
await ev("localStorage.removeItem('onjaal-theme')");

// ---------- mobile: menu ----------
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 800, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: B + '/' }); await sleep(1500);
await ev("document.querySelector('.menu-toggle').click()"); await sleep(400);
const openState = JSON.parse(await ev("JSON.stringify({expanded:document.querySelector('.menu-toggle').getAttribute('aria-expanded'),navOpen:document.getElementById('site-nav').classList.contains('is-open'),h:Math.round(document.getElementById('site-nav').getBoundingClientRect().height)})"));
ok('mobile menu opens', openState.expanded === 'true' && openState.navOpen && openState.h > 600, JSON.stringify(openState));
await key('Escape', 'Escape', 27); await sleep(300);
ok('mobile menu closes on Escape', await ev("document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'"));

// ---------- enquiry form ----------
await send('Page.navigate', { url: B + '/contact/?interest=free&users=120' }); await sleep(1500);
ok('Start free link pre-selects the plan and wording', await ev("document.getElementById('need').value==='Free plan (up to 5 employees)' && document.getElementById('submit-btn').textContent.trim()==='Request free access'"));
ok('users=120 pre-selects the 101-150 team-size band', await ev("document.getElementById('employees').value.indexOf('101')===0"));
await ev("document.getElementById('submit-btn').click()"); await sleep(400);
const val = JSON.parse(await ev("JSON.stringify({errors:[...document.querySelectorAll('.field-error.is-visible')].map(e=>e.textContent),focus:document.activeElement.id,btnDisabled:document.getElementById('submit-btn').disabled})"));
ok('empty submit: 3 inline errors (team size was pre-filled by the link), focus on first field, button still enabled', val.errors.length === 3 && val.focus === 'name' && !val.btnDisabled, JSON.stringify(val));
await ev("(()=>{const set=(i,v)=>{const e=document.getElementById(i);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};set('name','Test Person');set('email','test@example.com');set('company','Test Co');const s=document.getElementById('employees');s.selectedIndex=2;s.dispatchEvent(new Event('change',{bubbles:true}));return true})()");
mode = 'fail';
await ev("document.getElementById('submit-btn').click()"); await sleep(1200);
const failState = JSON.parse(await ev("JSON.stringify({status:document.getElementById('form-status').textContent,isErr:document.getElementById('form-status').classList.contains('is-error'),sent:document.getElementById('demo-form').classList.contains('is-sent'),btn:document.getElementById('submit-btn').disabled})"));
ok('failed send: error with email fallback, form kept, button re-enabled', /tech@onjaal\.com/.test(failState.status) && failState.isErr && !failState.sent && !failState.btn, failState.status);
mode = 'success';
await ev("document.getElementById('submit-btn').click()"); await sleep(1200);
const okState = JSON.parse(await ev("JSON.stringify({sent:document.getElementById('demo-form').classList.contains('is-sent'),shown:getComputedStyle(document.getElementById('form-success')).display!=='none',focus:document.activeElement.id})"));
ok('successful send: in-page confirmation shown and focus moved to it', okState.sent && okState.shown && okState.focus === 'form-success', JSON.stringify(okState));
ok('nothing reached the real FormSubmit endpoint (both sends intercepted)', intercepted === 2, 'intercepted=' + intercepted);
console.log(results.join('\n'));
ws.close(); proc.kill(); process.exit(0);

// Overflow check: opens each URL in a phone-sized Edge window and reports horizontal overflow.
// node tools/browser/cdp.mjs <scratch-dir> <width> <url> [url...]
// Drive headless Edge via CDP: emulate a phone, report horizontal overflow + optionally screenshot.
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = process.argv[2];
const WIDTH = +process.argv[3] || 390;
const urls = process.argv.slice(4);
const PORT = 9333 + Math.floor(Math.random() * 300);
const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${OUT}/profile${PORT}`, '--force-prefers-reduced-motion', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}/json`); const t = (await r.json()).find((x) => x.type === 'page'); if (t) return t; } catch {}
    await sleep(200);
  }
  throw new Error('no target');
}
const target = await getTarget();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result ?? d.error); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 800, deviceScaleFactor: 1, mobile: true });
for (const u of urls) {
  await send('Page.navigate', { url: u });
  await sleep(1800);
  const js = `(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1)) {
        let p = el, clipped = false;
        while ((p = p.parentElement)) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') { clipped = true; break; } }
        if (!clipped) bad.push((el.className && el.className.baseVal === undefined ? '.' + String(el.className).split(' ')[0] : el.tagName) + ' ' + Math.round(r.right));
      }
    });
    const wide=[...document.querySelectorAll('body *')].filter(e=>e.scrollWidth>e.clientWidth+2&&e.clientWidth>0).map(e=>e.tagName+'.'+String(e.className).split(' ')[0]+' sw'+e.scrollWidth+' cw'+e.clientWidth+' ox:'+getComputedStyle(e).overflowX).slice(0,8); return JSON.stringify({ wide, vw, sw: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, bad: [...new Set(bad)].slice(0, 10) });
  })()`;
  const r = await send('Runtime.evaluate', { expression: js, returnByValue: true });
  console.log(u.replace('http://localhost:8001', ''), r.result?.value);
  if (process.env.SHOT) {
    const h = JSON.parse(r.result.value).h;
    await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: h, deviceScaleFactor: 1, mobile: true });
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT}/m-${u.replace(/[^a-z0-9]+/gi, '_')}.png`, Buffer.from(s.data, 'base64'));
    await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 800, deviceScaleFactor: 1, mobile: true });
  }
}
ws.close(); proc.kill();
process.exit(0);

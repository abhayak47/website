// Accessibility smoke test: accessible names, labels, keyboard Tab-through with visible focus.
// node tools/browser/a11y.mjs <scratch-dir> <url> [url...]
import { spawn } from 'node:child_process';
const EDGE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT=9100+Math.floor(Math.random()*300);
const proc=spawn(EDGE,['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,`--user-data-dir=${process.argv[2]}/ay${PORT}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let t;for(let i=0;i<50;i++){try{t=(await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(x=>x.type==='page');if(t)break}catch{}await sleep(200)}
const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const p=new Map();ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&p.has(d.id)){p.get(d.id)(d.result);p.delete(d.id)}};
const send=(m,a={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:a}))});
await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
const ev=async e=>(await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true})).result.value;
const pages=process.argv.slice(3);
let totalIssues=0;
for(const u of pages){
  await send('Page.navigate',{url:u});await sleep(1500);
  const static_=JSON.parse(await ev(`(()=>{
    const name=el=>{const a=el.getAttribute('aria-label');if(a)return a.trim();const lb=el.getAttribute('aria-labelledby');if(lb){const t=lb.split(' ').map(i=>document.getElementById(i)?.textContent||'').join(' ').trim();if(t)return t}
      const t=(el.innerText||el.textContent||'').trim();if(t)return t;const img=el.querySelector('img[alt]');if(img&&img.alt.trim())return img.alt.trim();const ti=el.getAttribute('title');return ti||''};
    const issues=[];
    document.querySelectorAll('a[href],button,[role=button],[role=tab]').forEach(el=>{if(el.hidden||el.closest('[hidden]'))return;if(!name(el))issues.push('no accessible name: '+el.outerHTML.slice(0,80))});
    document.querySelectorAll('input:not([type=hidden]):not([type=submit]),select,textarea').forEach(el=>{if(el.closest('.hp'))return;const has=el.id&&document.querySelector('label[for="'+el.id+'"]')||el.closest('label')||el.getAttribute('aria-label')||el.getAttribute('aria-labelledby');if(!has)issues.push('unlabelled control: '+el.outerHTML.slice(0,80))});
    document.querySelectorAll('[tabindex]').forEach(el=>{if(+el.getAttribute('tabindex')>0)issues.push('positive tabindex')});
    if(!document.documentElement.lang)issues.push('missing html lang');
    if(document.querySelectorAll('main').length!==1)issues.push('main landmarks: '+document.querySelectorAll('main').length);
    if(!document.querySelector('a.skip-link'))issues.push('no skip link');
    return JSON.stringify(issues)})()`));
  // keyboard walk: Tab up to 45 times, record focus visibility
  const tabIssues=[];let seen=0;
  for(let i=0;i<45;i++){
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    const r=JSON.parse(await ev(`(()=>{const a=document.activeElement;if(!a||a===document.body)return JSON.stringify({none:true});const cs=getComputedStyle(a);
      const outline=cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>=2;const ring=cs.boxShadow&&cs.boxShadow!=='none';
      const r=a.getBoundingClientRect();const hdr=document.querySelector('.site-header').getBoundingClientRect();
      const covered=r.top<hdr.bottom-1&&r.bottom>hdr.top&&a.closest('.site-header')===null;
      return JSON.stringify({tag:a.tagName,txt:(a.innerText||a.getAttribute('aria-label')||a.id||'').trim().slice(0,30),visible:outline||ring,covered,w:Math.round(r.width),h:Math.round(r.height)})})()`));
    if(r.none)continue;seen++;
    if(!r.visible)tabIssues.push('no visible focus: '+r.tag+' "'+r.txt+'"');
    if(r.covered&&r.txt!=='Skip to content'){await sleep(900);const again=JSON.parse(await ev(`(()=>{const a=document.activeElement;const r=a.getBoundingClientRect();const h=document.querySelector('.site-header').getBoundingClientRect();return JSON.stringify({covered:r.top<h.bottom-1&&r.bottom>h.top&&!a.closest('.site-header')})})()`));if(again.covered)tabIssues.push('focus hidden under header: '+r.tag+' "'+r.txt+'"');}
  }
  const all=[...static_,...tabIssues];totalIssues+=all.length;
  console.log(u.replace('http://localhost:8001','')||'/', '| tab stops:',seen,'| issues:',all.length);
  all.slice(0,6).forEach(x=>console.log('   -',x));
}
console.log('TOTAL issues:',totalIssues);
ws.close();proc.kill();process.exit(0);

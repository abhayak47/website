// Pricing calculator test: 80 combinations of users/plan/billing/add-ons checked against expected totals.
// node tools/browser/calc.mjs <scratch-dir> http://localhost:8000/pricing/
import { spawn } from 'node:child_process';
const EDGE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT=9400+Math.floor(Math.random()*200);
const proc=spawn(EDGE,['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,`--user-data-dir=${process.argv[2]}/cp${PORT}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let t;for(let i=0;i<50;i++){try{t=(await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(x=>x.type==='page');if(t)break}catch{}await sleep(200)}
const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const p=new Map();ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&p.has(d.id)){p.get(d.id)(d.result);p.delete(d.id)}};
const send=(m,a={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:a}))});
await send('Page.enable');await send('Page.navigate',{url:process.argv[3]});await sleep(2000);
const expr=`(async()=>{
  const $=id=>document.getElementById(id);
  const fmt=new Intl.NumberFormat('en-IN'); const inr=n=>'\u20B9'+fmt.format(Math.round(n));
  const RATES={standard:{annual:59,monthly:71},premium:{annual:99,monthly:119}};
  const out={cases:0,fail:[]};
  const fire=(el,type)=>el.dispatchEvent(new Event(type,{bubbles:true}));
  for(const users of [1,5,6,150,1000]) for(const plan of ['standard','premium']) for(const annual of [true,false]) for(const impl of [false,true]) for(const bio of [false,true]){
    document.querySelector('input[name="calc-plan"][value="'+plan+'"]').checked=true; fire(document.querySelector('input[name="calc-plan"][value="'+plan+'"]'),'change');
    $('calc-annual').checked=annual; fire($('calc-annual'),'change');
    $('calc-impl').checked=impl; fire($('calc-impl'),'change');
    $('calc-bio').disabled=false; $('calc-bio').checked=bio; fire($('calc-bio'),'change');
    $('calc-users').value=users; fire($('calc-users'),'input');
    const free=users<=5; const bioIncluded=plan==='premium'&&!free;
    const perUser=free?0:(annual?RATES[plan].annual:RATES[plan].monthly);
    const month=users*perUser, year=month*12;
    const bioOn=bioIncluded?false:bio; // checkbox is forced off when included
    const oneTime=(impl?60000:0)+(bioOn?15000:0);
    const exp={rate:inr(perUser),monthly:inr(month),yearly:inr(year),onetime:inr(oneTime),first:inr(year+oneTime)};
    const got={rate:$('calc-rate').textContent,monthly:$('calc-monthly').textContent,yearly:$('calc-yearly').textContent,onetime:$('calc-onetime').textContent,first:$('calc-first').textContent};
    out.cases++;
    for(const k in exp) if(exp[k]!==got[k]) out.fail.push({users,plan,annual,impl,bio,k,exp:exp[k],got:got[k]});
  }
  // clamping and empty input
  const clampCases=[]; 
  for(const v of ['0','-5','1001','99999','abc']){ $('calc-users').value=v; fire($('calc-users'),'input'); fire($('calc-users'),'blur'); clampCases.push([v,$('calc-users').value,$('calc-users-out').textContent]); }
  // headline scenario from the original published estimate
  document.querySelector('input[name="calc-plan"][value="standard"]').checked=true; fire(document.querySelector('input[name="calc-plan"][value="standard"]'),'change');
  $('calc-annual').checked=true; fire($('calc-annual'),'change'); $('calc-impl').checked=true; fire($('calc-impl'),'change'); $('calc-bio').checked=false; fire($('calc-bio'),'change');
  $('calc-users').value=150; fire($('calc-users'),'input');
  out.scenario150={first:$('calc-first').textContent,yearly:$('calc-yearly').textContent,cta:$('calc-cta').getAttribute('href')};
  out.clamp=clampCases;
  return JSON.stringify(out);})()`;
const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});
const o=JSON.parse(r.result.value);
console.log('cases run:',o.cases,'| mismatches:',o.fail.length);
if(o.fail.length) console.log(o.fail.slice(0,8));
console.log('150 users Standard annual + guided implementation ->',o.scenario150);
console.log('input clamping [typed, stored, label]:',JSON.stringify(o.clamp));
ws.close();proc.kill();process.exit(0);

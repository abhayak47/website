// Scroll test: mouse wheel over the interactive preview must scroll the page.
// node tools/browser/wheel.mjs <scratch-dir> http://localhost:8000/
import { spawn } from 'node:child_process';
const EDGE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT=9700+Math.floor(Math.random()*200);
const proc=spawn(EDGE,['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,`--user-data-dir=${process.argv[2]}/wp${PORT}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let t; for(let i=0;i<50;i++){try{t=(await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(x=>x.type==='page');if(t)break}catch{}await sleep(200)}
const ws=new WebSocket(t.webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
let id=0;const p=new Map();ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&p.has(d.id)){p.get(d.id)(d.result);p.delete(d.id)}};
const send=(m,a={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:a}))});
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:process.argv[3]});await sleep(2500);
const ev=async e=>(await send('Runtime.evaluate',{expression:e,returnByValue:true})).result.value;
// bring the preview to the middle of the viewport, then wheel over it
await ev(`document.getElementById('hrms-preview').scrollIntoView({block:'center'})`);await sleep(600);
const r=JSON.parse(await ev(`(()=>{const b=document.querySelector('.pv-main').getBoundingClientRect();return JSON.stringify({x:Math.round(b.left+b.width/2),y:Math.round(b.top+b.height/2),ov:getComputedStyle(document.querySelector('.pv-main')).overflowY,mainScroll:document.querySelector('.pv-main').scrollHeight-document.querySelector('.pv-main').clientHeight})})()`));
console.log('pv-main overflowY:',r.ov,'| inner scrollable extra px:',r.mainScroll);
const y0=await ev('window.scrollY');
for(let i=0;i<5;i++){await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:r.x,y:r.y,deltaX:0,deltaY:120});await sleep(120)}
await sleep(400);
const y1=await ev('window.scrollY');
console.log('page scrollY before/after 5 wheel ticks over preview:',y0,'->',y1, y1>y0?'PAGE SCROLLS':'STUCK');
ws.close();proc.kill();process.exit(0);

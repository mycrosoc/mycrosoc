/* MYCROSOC service worker: เปิดเร็วและใช้งานออฟไลน์ได้ */
const VERSION='mycrosoc-v499';
const CORE=['./','./index.html','./app.css','./game.js','./tgz.js','./tg1.js','./thfc.js','./fonts/chula-1.woff','./fonts/chula-2.woff'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE).catch(()=>{})).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function notify(){const cs=await self.clients.matchAll({type:'window'});cs.forEach(c=>c.postMessage({type:'mycro-updated'}))}
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
  if(url.origin!==location.origin){if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(req);if(hit)return hit;try{const r=await fetch(req);if(r&&(r.ok||r.type==='opaque'))c.put(req,r.clone());return r}catch(err){return hit||Response.error()}}))}return}
  const isPage=req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('.html');
  e.respondWith(caches.open(VERSION).then(async c=>{const key=isPage?'./index.html':req;const hit=await c.match(key);
    const net=fetch(req,{cache:'no-cache'}).then(async r=>{if(r&&r.ok){const old=hit?(hit.headers.get('etag')||hit.headers.get('last-modified')||hit.headers.get('content-length')):null;const neu=r.headers.get('etag')||r.headers.get('last-modified')||r.headers.get('content-length');await c.put(key,r.clone());if(isPage&&hit&&old&&neu&&old!==neu)notify()}return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}const r=await net;return r||new Response('<h1 style="font-family:sans-serif;text-align:center;margin-top:30vh;color:#E31414">ออฟไลน์อยู่</h1><p style="font-family:sans-serif;text-align:center">เปิดแอปครั้งแรกต้องต่ออินเทอร์เน็ตก่อน</p>',{headers:{'Content-Type':'text/html; charset=utf-8'}})}))});

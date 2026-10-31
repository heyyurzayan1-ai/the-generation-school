const CACHE='tgs-static-v3';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('tgs-static-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.includes('/rest/')||u.pathname.includes('/auth/')||u.pathname.includes('/functions/'))return;
 const isScript=/\.(js|mjs)$/.test(u.pathname);
 const isPage=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(isPage||isScript){
   try{const r=await fetch(e.request,{cache:'no-store'});if(r.ok)cache.put(e.request,r.clone());return r}
   catch(err){const old=await cache.match(e.request);if(old)return old;throw err}
  }
  const hit=await cache.match(e.request);if(hit)return hit;
  const r=await fetch(e.request);if(r.ok)cache.put(e.request,r.clone());return r;
 })());
});
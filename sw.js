const CACHE='tgs-static-v2';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==self.location.origin)return;
 if(u.pathname.includes('/rest/')||u.pathname.includes('/auth/')||u.pathname.includes('/functions/'))return;
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const isPage=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
  if(isPage){
   try{const r=await fetch(e.request);if(r.ok)cache.put(e.request,r.clone());return r}catch(err){const old=await cache.match(e.request);if(old)return old;throw err}
  }
  const hit=await cache.match(e.request);if(hit)return hit;
  const r=await fetch(e.request);if(r.ok)cache.put(e.request,r.clone());return r;
 })());
});
const CACHE='netto-tools-v12';
const CORE=['./rewards.html','./rewards.css?v=1','./rewards.js?v=2','./reward-profile.js?v=2','./','./index.html','./home.html','./articles.html','./bakery.html','./planning.html','./chat.html','./profile.html','./settings.html','./stock-test.html','./accounts.html','./manifest.webmanifest','./design-v2.css','./design-v3.css','./profile-ui.js?v=10','./assets/app-icon.svg','./assets/logo-stock.svg','./assets/logo-planning.svg','./assets/logo-equipe.svg','./assets/logo-article.svg','./assets/logo-boulangerie.svg','./assets/fl-background.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./home.html'))));
   return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r})));
});

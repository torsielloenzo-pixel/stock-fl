const CACHE='netto-tools-v32';
const CORE=['./rewards.html','./rewards.css?v=1','./rewards.js?v=3','./reward-profile.js?v=2','./','./index.html','./home.html','./articles.html','./bakery.html','./planning.html','./chat.html','./profile.html','./settings.html','./stock-test.html','./accounts.html','./admin-portal.html','./custom-menu.html','./fl-assistant.html','./manifest.webmanifest','./design-v2.css','./design-v3.css?v=3','./design-v4.css?v=1','./profile-ui.js?v=21','./assets/app-icon.svg','./assets/logo-stock.svg','./assets/logo-planning.svg','./assets/logo-equipe.svg','./assets/logo-article.svg','./assets/logo-boulangerie.svg','./assets/fl-background.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
 self.registration.getNotifications().then(list=>{list.forEach(n=>n.close())}).catch(()=>{}),
 self.clients.claim()
]))});
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./home.html'))));
   return;
 }
 const isStaticCode=/\.(?:js|css)$/i.test(u.pathname);
 if(isStaticCode){
   e.respondWith(caches.match(e.request).then(cached=>{
     const refresh=fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>cached);
     if(cached){e.waitUntil(refresh);return cached}
     return refresh
   }));
   return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r})));
});


self.addEventListener('push',e=>{
 let data={};
 try{data=e.data?e.data.json():{}}catch(_){data={body:e.data?.text?.()||''}}
 const title=data.title||'Notification';
 const options={
   body:data.body||'',
   icon:'./assets/app-icon.svg',
   badge:'./assets/app-icon.svg',
   data:{url:data.url||'home.html'},
   tag:data.kind==='import_new'?'planning-published':data.kind==='manual_edit'?'planning-modified':undefined
 };
 e.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',e=>{
 e.notification.close();
 const rel=e.notification?.data?.url||'home.html';
 const target=new URL(rel,self.registration.scope).href;
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
   for(const client of list){
     if(client.url===target&&'focus' in client)return client.focus();
   }
   for(const client of list){
     if('navigate' in client&&'focus' in client)return client.navigate(target).then(()=>client.focus());
   }
   return self.clients.openWindow?self.clients.openWindow(target):undefined;
 }));
});

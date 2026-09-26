(function(){
'use strict';
const URL='https://gioxrpaiwogqqtakjpnv.supabase.co';
const KEY='sb_publishable_nJPMS-Z_20ng1aMJmufbmg_gWFFndrC';
const ROLE={admin:'Administrateur',responsable:'Responsable',lecture:'Lecture seule',employe:'Employé'};
const BASE_MODULES=Object.freeze([
 {id:'home',label:'Accueil',subtitle:'Retour au portail',url:'home.html',icon:'⌂',asset:'assets/logo-home.svg',roles:null,home:false,userMenu:true,defaultUser:true},
 {id:'profile',label:'Mon profil',homeLabel:'Mon profil',subtitle:'Profil et notifications',url:'profile.html',icon:'☺',asset:'assets/logo-profile.svg?v=2',roles:null,home:true,userMenu:true,defaultHome:false,defaultUser:true,kicker:'MON COMPTE',description:'Gérer ta photo, ton statut, ton apparence et la sécurité de ton compte.',action:'Ouvrir mon profil',cardClass:'profileCard'},
 {id:'stock',label:'Stock F&L',homeLabel:'Stock F&L',subtitle:'Gestion du stock',url:'index.html',homeUrl:'index.html?mode=stock',asset:'assets/logo-stock.svg',roles:null,home:true,userMenu:true,defaultHome:true,defaultUser:true,kicker:'OPÉRATIONS',description:'Contrôler les quantités, préparer les commandes et administrer le référentiel produits depuis un espace optimisé terrain.',action:'Ouvrir le stock',cardClass:'stock'},
 {id:'planning',label:'Planning',homeLabel:'Planning équipe',subtitle:'Horaires de l’équipe',url:'planning.html',asset:'assets/logo-planning.svg',roles:null,home:true,userMenu:true,defaultHome:true,defaultUser:true,kicker:'ORGANISATION',description:'Consulter les horaires, importer les plannings Excel et suivre précisément chaque modification.',action:'Consulter le planning',cardClass:'planning'},
 {id:'chat',label:'Équipe',homeLabel:'Équipe',subtitle:'Messagerie interne',url:'chat.html',asset:'assets/logo-equipe.svg',roles:null,home:true,userMenu:true,defaultHome:true,defaultUser:true,kicker:'COMMUNICATION',description:'Centraliser les échanges, la présence des membres et les informations utiles au fonctionnement quotidien.',action:'Ouvrir l’espace équipe',cardClass:'chatCard'},
 {id:'articles',label:'Fiches articles',homeLabel:'Fiches articles',subtitle:'Référentiel articles',url:'articles.html',asset:'assets/logo-article.svg',roles:null,home:true,userMenu:true,defaultHome:true,defaultUser:true,kicker:'RÉFÉRENTIEL',description:'Retrouver rapidement les références, codes et informations produit utilisées dans les procédures du rayon.',action:'Ouvrir le référentiel',cardClass:'articlesCard'},
 {id:'rewards',label:'Défis & Boutique',homeLabel:'Défis & Boutique',subtitle:'Missions et récompenses',url:'rewards.html',icon:'✦',asset:'assets/logo-rewards.svg?v=2',roles:['admin'],home:true,userMenu:true,defaultHome:true,defaultUser:true,kicker:'ADMINISTRATION',description:'Créer les défis, gérer les récompenses et utiliser librement le catalogue administrateur.',action:'Ouvrir Défis & Boutique',cardClass:'rewardsCard'},
 {id:'bakery',label:'Boulangerie',homeLabel:'Boulangerie',subtitle:'Stock • Consulter • Gestion',url:'bakery.html',asset:'assets/logo-boulangerie.svg?v=2',roles:['admin'],home:true,userMenu:true,defaultHome:true,defaultUser:true,kicker:'ADMINISTRATION',description:'Gérer le stock, consulter les articles et administrer les catégories propres à la famille Boulangerie.',action:'Ouvrir la Boulangerie',cardClass:'bakeryCard'},
 {id:'test',label:'Vue test',homeLabel:'Vue stock groupée',subtitle:'Stock groupé par familles',url:'stock-test.html',icon:'◫',asset:'assets/logo-test.svg',roles:['admin'],home:true,userMenu:true,defaultHome:false,defaultUser:false,kicker:'ANALYSE',description:'Afficher le stock dans une vue groupée avancée par catégories et familles.',action:'Ouvrir la vue groupée',cardClass:'testCard'},
 {id:'accounts',label:'Gestion des comptes',homeLabel:'Gestion des comptes',subtitle:'Utilisateurs, accès et journal',url:'accounts.html',icon:'♙',asset:'assets/logo-accounts.svg',roles:['admin'],home:true,userMenu:true,defaultHome:false,defaultUser:false,kicker:'ADMINISTRATION',description:'Gérer les utilisateurs, leurs rôles, les demandes de mot de passe et le journal d’activité.',action:'Gérer les comptes',cardClass:'accountsCard'},
 {id:'portal_admin',label:'Éditeur du portail',homeLabel:'Éditeur du portail',subtitle:'Menus, couleurs et contenu',url:'admin-portal.html',icon:'✦',asset:'assets/logo-admin-portal.svg',roles:['admin'],home:true,userMenu:true,defaultHome:false,defaultUser:true,kicker:'ADMINISTRATION',description:'Créer les menus, personnaliser leur apparence, leurs accès et leur contenu depuis une interface unique.',action:'Configurer le portail',cardClass:'portalAdminCard'},
 {id:'settings',label:'Personnalisation',homeLabel:'Personnalisation',subtitle:'Mon accueil et mes raccourcis',url:'settings.html',icon:'⚙',asset:'assets/logo-settings.svg',roles:null,home:true,userMenu:false,defaultHome:false,kicker:'PRÉFÉRENCES',description:'Choisir les outils visibles sur ton accueil et dans ta barre utilisateur selon tes droits.',action:'Personnaliser mon portail',cardClass:'settingsCard'}
]);
let NAV_MODULES=[...BASE_MODULES];
const ALL_ROLES=Object.freeze(['admin','responsable','employe','lecture']);
function cleanColor(v,fallback=''){const s=String(v||'').trim();return /^#[0-9a-f]{6}$/i.test(s)?s:fallback}
function customModules(config){
 const list=Array.isArray(config?.customMenus)?config.customMenus:[];
 return list.filter(x=>x&&x.id&&x.enabled!==false).map((x,index)=>{
  const id=String(x.id).replace(/[^a-zA-Z0-9_-]/g,'').slice(0,64);
  return {
   id,
   custom:true,
   label:String(x.label||'Menu personnalisé'),
   homeLabel:String(x.label||'Menu personnalisé'),
   subtitle:String(x.subtitle||x.description||'Menu personnalisé'),
   description:String(x.description||''),
   url:'custom-menu.html?id='+encodeURIComponent(id),
   icon:String(x.icon||'◆').slice(0,8),
   asset:String(x.image_url||''),
   roles:null,
   configuredRoles:Array.isArray(x.roles)?x.roles.filter(r=>ALL_ROLES.includes(r)):ALL_ROLES,
   home:x.home!==false,
   userMenu:x.user_menu===true,
   defaultHome:x.default_home!==false,
   defaultUser:x.default_user===true,
   kicker:String(x.kicker||'ESPACE'),
   action:String(x.action||'Ouvrir'),
   cardClass:'portalThemeCard customPortalCard',
   menuColor:cleanColor(x.color,'#ff2f1f'),
   menuAccent:cleanColor(x.accent,'#ff8500'),
   order:Number(x.order)||1000+index
  }
 })
}
function rebuildModules(config={}){
 const pages=config?.pages&&typeof config.pages==='object'?config.pages:{};
 const base=BASE_MODULES.map(m=>{
  const p=pages[m.id]&&typeof pages[m.id]==='object'?pages[m.id]:{};
  const overrideImage=String(p.image_url||'').trim();
  return {...m,
   baseUrl:m.url,
   label:String(p.nav_label||p.label||m.label),
   homeLabel:String(p.label||m.homeLabel||m.label),
   subtitle:String(p.subtitle||m.subtitle||''),
   description:String(p.description||m.description||''),
   url:String(p.url||m.url||''),
   icon:String(p.icon||m.icon||'•'),
   asset:overrideImage||m.asset,
   home:typeof p.home==='boolean'?p.home:m.home,
   userMenu:typeof p.user_menu==='boolean'?p.user_menu:m.userMenu,
   defaultHome:typeof p.default_home==='boolean'?p.default_home:m.defaultHome,
   defaultUser:typeof p.default_user==='boolean'?p.default_user:m.defaultUser,
   kicker:String(p.kicker||m.kicker||'OUTIL'),
   action:String(p.action||m.action||'Ouvrir'),
   menuColor:cleanColor(p.color,''),
   menuAccent:cleanColor(p.accent,''),
   configuredRoles:Array.isArray(p.roles)?p.roles.filter(r=>ALL_ROLES.includes(r)):null
  }
 });
 NAV_MODULES=[...base,...customModules(config)];
 if(typeof api!=='undefined')api.modules=NAV_MODULES
}
function applyPortalTheme(config={}){
 const t=config?.theme||{},root=document.documentElement;
 const primary=cleanColor(t.primary,'#ff2f1f'),secondary=cleanColor(t.secondary,'#ff8500'),ink=cleanColor(t.ink,'#182235');
 root.style.setProperty('--netto-red',primary);root.style.setProperty('--netto-red-2',primary);
 root.style.setProperty('--netto-orange',secondary);root.style.setProperty('--netto-ink',ink);
 root.style.setProperty('--red',primary);root.style.setProperty('--red2',primary);root.style.setProperty('--orange',secondary);
 root.style.setProperty('--netto-gradient','linear-gradient(135deg,'+primary+' 0%,'+primary+' 44%,'+secondary+' 100%)')
}
function moduleMaxRoles(module){return Array.isArray(module?.roles)?module.roles.filter(r=>ALL_ROLES.includes(r)):ALL_ROLES}
function configuredRoles(module,config=api?.siteConfig){
 if(!module)return[];
 if(module.id==='settings')return [...ALL_ROLES];
 const max=moduleMaxRoles(module),page=config?.pages?.[module.id],raw=Array.isArray(page?.roles)?page.roles:module.configuredRoles;
 if(!Array.isArray(raw))return [...max];
 return [...new Set(raw.filter(r=>max.includes(r)))];
}
function moduleAllowed(module,profileOrRole,config=api?.siteConfig){
 const role=typeof profileOrRole==='string'?profileOrRole:profileOrRole?.role;
 if(!role)return false;
 if(module.id!=='settings'&&config?.pages?.[module.id]?.enabled===false)return false;
 return configuredRoles(module,config).includes(role)
}
function preferenceMap(profile){const p=profile?.ui_preferences;return p&&typeof p==='object'&&!Array.isArray(p)?p:{}}
function moduleVisible(area,module,profile,config=api?.siteConfig){if(!moduleAllowed(module,profile,config))return false;if(area==='home'&&!module.home)return false;if(area==='user_menu'&&!module.userMenu)return false;const v=preferenceMap(profile)?.[area]?.[module.id];if(typeof v==='boolean')return v;return area==='home'?module.defaultHome!==false:module.defaultUser!==false}
function visibleModules(area,profile,config=api?.siteConfig){return NAV_MODULES.filter(m=>moduleVisible(area,m,profile,config))}
function moduleIcon(module){return module?.asset?'<img src="'+esc(module.asset)+'" alt="">':esc(module?.icon||'•')}
const api={profile:null,siteConfig:{},avatarUrl:null,onlineIds:new Set(),channel:null,client:null,session:null,notifications:[],notifChannel:null,loginHistory:[],modules:NAV_MODULES,allRoles:ALL_ROLES,maxRoles:moduleMaxRoles,configuredRoles,canAccess:moduleAllowed,isVisible:moduleVisible,visibleModules,rebuildModules,refresh,loadNotifications,preferredTheme,applyProfileTheme,setThemePreference:saveThemePreference};
window.NettoProfileUI=api;

const SOUND_DEFS={
 tap:[[520,0,.055,.15,'sine',610]],
 menuOpen:[[330,0,.10,.16,'sine',430],[520,.045,.12,.09,'sine',620]],
 menuClose:[[520,0,.08,.13,'sine',420],[340,.045,.11,.10,'sine',290]],
 navigate:[[420,0,.065,.11,'sine',540],[680,.035,.075,.075,'sine',780]],
 switch:[[390,0,.08,.12,'triangle',650]],
 confirm:[[523.25,0,.13,.14,'sine'],[659.25,.075,.19,.13,'sine']],
 success:[[392,0,.20,.12,'sine'],[493.88,.085,.25,.14,'sine'],[659.25,.19,.34,.13,'sine']],
 loginSuccess:[[329.63,0,.29,.11,'sine'],[415.3,.085,.33,.13,'sine'],[493.88,.18,.39,.14,'sine'],[659.25,.30,.50,.11,'sine']],
 error:[[245,0,.11,.105,'square',218],[196,.115,.18,.095,'square',174]],
 warning:[[392,0,.10,.11,'triangle'],[392,.15,.12,.10,'triangle']],
 notification:[[783.99,0,.13,.105,'sine'],[1046.5,.105,.27,.09,'sine']],
 message:[[659.25,0,.11,.10,'sine'],[880,.085,.20,.09,'sine']],
 delete:[[370,0,.11,.11,'triangle',300],[246.94,.09,.21,.10,'sine',220]],
 logout:[[587.33,0,.19,.11,'sine'],[493.88,.085,.23,.12,'sine'],[392,.18,.31,.11,'sine'],[293.66,.29,.40,.08,'sine']]
};
let soundCtx=null;
function soundEnabled(){try{return localStorage.getItem('nettoSoundEnabled')!=='0'}catch(_){return true}}
function soundVolume(){try{const raw=localStorage.getItem('nettoSoundVolume');if(raw===null)return .72;const v=Number(raw);return Number.isFinite(v)&&v>=0&&v<=1?v:.72}catch(_){return .72}}
function unlockSound(){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;soundCtx=soundCtx||new A();if(soundCtx.state==='suspended')soundCtx.resume().catch(()=>{});return soundCtx}catch(_){return null}}
function playSound(name='tap'){if(!soundEnabled())return;const def=SOUND_DEFS[name]||SOUND_DEFS.tap,a=unlockSound();if(!a)return;const run=()=>{try{const now=a.currentTime,master=a.createGain(),filter=a.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(name==='error'?1350:name==='logout'?1750:2400,now);master.gain.setValueAtTime(Math.max(.0001,soundVolume()*.46),now);master.gain.exponentialRampToValueAtTime(.0001,now+Math.max(...def.map(t=>(t[1]||0)+(t[2]||.1)))+.08);filter.connect(master);master.connect(a.destination);def.forEach(t=>{const [freq,delay=0,dur=.1,gain=.1,type='sine',endFreq]=t,o=a.createOscillator(),g=a.createGain(),st=now+delay;o.type=type;o.frequency.setValueAtTime(freq,st);if(endFreq&&endFreq>0)o.frequency.exponentialRampToValueAtTime(endFreq,st+dur);g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(Math.max(.001,gain),st+Math.min(.035,dur*.3));g.gain.exponentialRampToValueAtTime(.0001,st+dur);o.connect(g);g.connect(filter);o.start(st);o.stop(st+dur+.025)})}catch(_){}};if(a.state==='suspended')a.resume().then(run).catch(()=>{});else run()}
const sounds={play:playSound,unlock:unlockSound,names:Object.freeze(Object.keys(SOUND_DEFS)),isEnabled:soundEnabled,getVolume:soundVolume,setEnabled(v){try{localStorage.setItem('nettoSoundEnabled',v?'1':'0')}catch(_){};window.dispatchEvent(new Event('netto:sound-settings'))},setVolume(v){const n=Math.max(0,Math.min(1,Number(v)||0));try{localStorage.setItem('nettoSoundVolume',String(n))}catch(_){};window.dispatchEvent(new Event('netto:sound-settings'))}};
window.NettoSounds=sounds;
document.addEventListener('pointerdown',()=>sounds.unlock(),{once:true,capture:true});

function initials(n){return String(n||'U').trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()).join('')}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function roleLabel(r){return ROLE[r]||r||'Compte'}
function addStyle(){
 if(document.getElementById('nettoGlobalUIStyle'))return;
 const s=document.createElement('style');s.id='nettoGlobalUIStyle';s.textContent=`
 #nMenu,.brandMenu,.nMenuWrap>#nMenu{display:none!important}
 .mobileNavBackdrop{display:none!important}
 .userMenuWrap{display:none!important}
 .nettoGlobalTools{display:flex;align-items:center;gap:8px;margin-left:auto;position:relative;z-index:1300;flex:none}
 .nettoBackBtn{height:42px;border:1px solid #dfe1e5;border-radius:12px;background:#fff;color:#2d3035;display:inline-flex;align-items:center;gap:7px;padding:0 12px;font-size:10px;font-weight:850;cursor:pointer;box-shadow:0 5px 15px #0000000b;flex:none;transition:transform .15s ease,background .15s ease,border-color .15s ease}.nettoBackBtn:hover{background:#f6f7f8;border-color:#cfd2d7}.nettoBackBtn:active{transform:scale(.96)}.nettoBackBtn .nettoBackArrow{font-size:18px;line-height:1}.nettoLegacyBackHidden{display:none!important}
 @media(max-width:650px){.nettoBackBtn{width:42px;padding:0;justify-content:center;border-radius:13px}.nettoBackBtn .nettoBackLabel{display:none}.nettoBackBtn .nettoBackArrow{font-size:20px}}

 .nettoLoginWrap,.nettoMobilePreviewWrap,.nettoBellWrap,.nettoUserWrap{position:relative}
 .nettoMobilePreviewOverlay{position:fixed;inset:0;background:#101214cc;backdrop-filter:blur(10px);z-index:10000;display:grid;place-items:center;padding:28px}.nettoMobilePreviewOverlay.hidden{display:none!important}.nettoMobilePreviewDevice{width:min(410px,calc(100vw - 28px));height:min(860px,calc(100vh - 56px));background:#0d0f11;border:7px solid #292d31;border-radius:38px;box-shadow:0 30px 100px #000b;position:relative;padding:11px;display:flex;flex-direction:column}.nettoMobilePreviewTop{height:23px;display:flex;align-items:center;justify-content:center;position:relative;flex:none}.nettoMobilePreviewNotch{width:92px;height:19px;border-radius:999px;background:#060708}.nettoMobilePreviewClose{position:absolute;right:0;top:-3px;width:28px;height:28px;border:0;border-radius:9px;background:#34393e;color:#fff;cursor:pointer;font-size:18px;line-height:1}.nettoMobilePreviewFrame{width:100%;height:100%;border:0;border-radius:25px;background:#fff;overflow:hidden}.nettoMobilePreviewBtn.active{background:#fff0ec;border-color:#ff8a6c;box-shadow:0 0 0 2px #ff5a2a1c}.nettoMobilePreviewBtn.active svg{fill:#e84827}:root[data-theme="dark"] .nettoMobilePreviewBtn.active{background:#3d2923;border-color:#784636}:root[data-theme="dark"] .nettoMobilePreviewFrame{background:#1b1d20}
 .nettoMobilePreviewNotice{position:fixed;left:50%;bottom:24px;transform:translate(-50%,12px);z-index:10050;display:flex;align-items:center;gap:8px;max-width:min(92vw,360px);padding:10px 14px;border:1px solid #e3e5e8;border-radius:999px;background:#ffffffef;color:#25282c;box-shadow:0 12px 36px #0002;backdrop-filter:blur(12px);font-size:11px;font-weight:850;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}.nettoMobilePreviewNotice.show{opacity:1;transform:translate(-50%,0)}.nettoMobilePreviewNotice i{width:8px;height:8px;border-radius:50%;background:#ff5a2a;box-shadow:0 0 0 4px #ff5a2a18}:root[data-theme="dark"] .nettoMobilePreviewNotice{background:#23262aee;border-color:#3a3d42;color:#f5f1ed;box-shadow:0 14px 40px #0008}
 @media(max-width:650px){.nettoMobilePreviewWrap{display:none!important}.nettoMobilePreviewOverlay{display:none!important}}
 .nettoBellBtn{width:42px;height:42px;border:1px solid #e0e2e6;border-radius:13px;background:#fff;display:grid;place-items:center;cursor:pointer;position:relative;box-shadow:0 5px 15px #0000000b}
 .nettoBellBtn svg{width:21px;height:21px;fill:#3d3f44}.nettoNotifBadge{position:absolute;right:-4px;top:-5px;min-width:19px;height:19px;padding:0 5px;border-radius:999px;background:#ff2438;color:#fff;border:2px solid #fff;display:grid;place-items:center;font-size:9px;font-weight:950;line-height:1}
 .nettoNotifBadge.hidden{display:none!important}
 .nettoNavBtn>span:first-child img{width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block}
 .nettoUserBtn{height:42px;min-width:142px;max-width:220px;border:1px solid #e0e2e6;border-radius:13px;background:#fff;display:grid;grid-template-columns:30px minmax(0,1fr) 14px;align-items:center;gap:7px;padding:5px 8px;cursor:pointer;box-shadow:0 5px 15px #0000000b;text-align:left}
 .nettoTopAvatar{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;background:var(--profile-accent,#ff5a2a);color:#fff;font-size:10px;font-weight:950;background-size:cover!important;background-position:center!important;overflow:hidden}.nettoTopAvatar.hasPhoto{color:transparent}
 .nettoUserText{min-width:0}.nettoUserText strong{display:block;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nettoUserText small{display:block;font-size:8px;color:#868a91;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nettoChevron{font-size:12px;color:#8b8e94}
 .nettoDrop{position:absolute;right:0;top:49px;width:290px;background:#fffffff8;border:1px solid #dfe1e5;border-radius:16px;box-shadow:0 20px 55px #0000002b;backdrop-filter:blur(18px);padding:8px;z-index:3000}.nettoDrop.hidden{display:none!important}
 .nettoUserHead{display:grid;grid-template-columns:40px minmax(0,1fr);gap:9px;align-items:center;padding:9px 10px 10px;border-bottom:1px solid #eceef1;margin-bottom:5px}.nettoUserHead .nettoTopAvatar{width:40px;height:40px;border-radius:12px}.nettoUserHead strong{display:block;font-size:12px}.nettoUserHead small{display:block;color:#8b8e94;font-size:9px;margin-top:2px}
 .nettoNavBtn{width:100%;display:grid;grid-template-columns:34px minmax(0,1fr);gap:9px;align-items:center;text-align:left;border:0;background:transparent;border-radius:11px;padding:8px 9px;cursor:pointer}.nettoNavBtn:hover{background:#f4f5f7}.nettoNavBtn>span:first-child{width:32px;height:32px;border-radius:9px;background:#f0f1f3;display:grid;place-items:center;color:#e54726;font-weight:850;overflow:hidden}.nettoNavBtn>span:first-child img{width:100%;height:100%;display:block;object-fit:cover}.nettoNavBtn strong{display:block;font-size:11px}.nettoNavBtn small{display:block;font-size:8.5px;color:#8b8e94;margin-top:1px}.nettoMenuSection{padding:8px 10px 4px;color:#9a7a70;font-size:7.5px;font-weight:900;letter-spacing:.9px;text-transform:uppercase}.nettoLogout{margin-top:5px;border-top:1px solid #eceef1;border-radius:0 0 10px 10px;color:#a52218}
 .nettoNotifDrop{width:min(390px,calc(100vw - 20px));padding:0;overflow:hidden}.nettoNotifHead{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:12px 13px;border-bottom:1px solid #eceef1}.nettoNotifHead strong{font-size:12px}.nettoNotifHeadActions{display:flex;gap:5px}.nettoNotifHead button{border:0;background:#f0f1f3;border-radius:8px;padding:6px 7px;font-size:8px;font-weight:800;cursor:pointer}.nettoNotifList{max-height:430px;overflow:auto;padding:7px}.nettoNotifEmpty{padding:28px 12px;text-align:center;color:#999;font-size:10px}
 .nettoLoginDrop{width:min(410px,calc(100vw - 20px));padding:0;overflow:hidden}.nettoLoginHeadTitle{min-width:0}.nettoLoginHeadTitle strong{display:block;font-size:12px}.nettoLoginHeadTitle small{display:block;font-size:8px;color:#92969d;margin-top:2px}.nettoLoginList{max-height:440px;overflow:auto;padding:7px}.nettoLoginItem{display:grid;grid-template-columns:34px minmax(0,1fr) 27px;gap:8px;align-items:center;padding:9px;border:1px solid #e8eaed;border-radius:11px;background:#fff;margin-bottom:6px}.nettoLoginItem:last-child{margin-bottom:0}.nettoLoginAvatar{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;background:var(--login-accent,#ff5a2a);color:#fff;font-size:9px;font-weight:950}.nettoLoginBody{min-width:0}.nettoLoginBody strong{display:block;font-size:10.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nettoLoginBody span{display:block;font-size:8.5px;color:#777c83;margin-top:1px}.nettoLoginBody small{display:block;font-size:8px;color:#999da3;margin-top:4px}.nettoLoginDelete{width:26px;height:26px;border:0;border-radius:8px;background:#f3f4f6;color:#92969c;cursor:pointer;font-size:15px;line-height:1}.nettoLoginDelete:hover{background:#fff0ee;color:#c33a2c}
 :root[data-theme="dark"] .nettoLoginHeadTitle small{color:#aaa5a0}:root[data-theme="dark"] .nettoLoginItem{background:#24282c;border-color:#393f45}:root[data-theme="dark"] .nettoLoginBody span{color:#b6b1ac}:root[data-theme="dark"] .nettoLoginBody small{color:#96918c}:root[data-theme="dark"] .nettoLoginDelete{background:#30353a;color:#aaa5a0}:root[data-theme="dark"] .nettoLoginDelete:hover{background:#442723;color:#ff9c8f}
 .nettoNotifItem{display:grid;grid-template-columns:34px minmax(0,1fr) 26px;gap:8px;align-items:start;padding:9px;border-radius:11px;border:1px solid transparent;cursor:pointer;margin-bottom:6px}.nettoNotifItem:last-child{margin-bottom:0}.nettoNotifItem.unread{box-shadow:0 4px 13px #00000008}.nettoNotifIcon{width:32px;height:32px;border-radius:9px;display:grid;place-items:center;font-weight:950}.nettoNotifBody{min-width:0}.nettoNotifBody strong{display:block;font-size:10.5px;line-height:1.25}.nettoNotifBody span{display:block;font-size:9px;line-height:1.35;color:#666;margin-top:2px}.nettoNotifBody small{display:block;font-size:8px;color:#999;margin-top:4px}.nettoNotifDelete{width:25px;height:25px;border:0;border-radius:8px;background:#ffffffaa;color:#999;cursor:pointer;font-size:15px;line-height:1}.nettoNotifDelete:hover{background:#fff0ee;color:#b52c20}
 .nettoNotifItem.manual_edit{background:#f2f6ff;border-color:#dce6fb}.nettoNotifItem.manual_edit .nettoNotifIcon{background:#e2ebff;color:#335fba}.nettoNotifItem.import_new{background:#eff9f2;border-color:#d5eedc}.nettoNotifItem.import_new .nettoNotifIcon{background:#dff3e5;color:#188443}.nettoNotifItem.import_replace{background:#fff6ea;border-color:#ffe0b5}.nettoNotifItem.import_replace .nettoNotifIcon{background:#ffead0;color:#c96a00}.nettoNotifItem.reset_day,.nettoNotifItem.reset_week{background:#fff1ef;border-color:#ffd8d1}.nettoNotifItem.reset_day .nettoNotifIcon,.nettoNotifItem.reset_week .nettoNotifIcon{background:#ffe1dc;color:#bd3022}.nettoNotifItem.password_reset_request{background:#fff8ec;border-color:#f3deb6}.nettoNotifItem.password_reset_request .nettoNotifIcon{background:#ffedc8;color:#b66a00}
 :root[data-theme="dark"] .nettoBackBtn{background:#24282b;border-color:#3c4247;color:#e9e4df;box-shadow:0 6px 18px #0004}:root[data-theme="dark"] .nettoBackBtn:hover{background:#2b3034;border-color:#50565b}
 :root[data-theme="dark"] .nettoBellBtn,:root[data-theme="dark"] .nettoUserBtn{background:#24282b;border-color:#3c4247;color:#e9e4df;box-shadow:0 7px 20px #0004}:root[data-theme="dark"] .nettoBellBtn:hover,:root[data-theme="dark"] .nettoUserBtn:hover{background:#2b3034;border-color:#55504b}:root[data-theme="dark"] .nettoBellBtn svg{fill:#e7e1dc}:root[data-theme="dark"] .nettoNotifBadge{border-color:#202225}:root[data-theme="dark"] .nettoDrop{background:#1d2022fa;border-color:#3b4145;color:#eeeae5;box-shadow:0 28px 78px #0008}:root[data-theme="dark"] .nettoNavBtn:hover{background:#2a2f33}:root[data-theme="dark"] .nettoNavBtn>span:first-child{background:#342720;color:#e79a78}:root[data-theme="dark"] .nettoNotifHead,:root[data-theme="dark"] .nettoUserHead{background:linear-gradient(180deg,#1f2124,#1b1d20);border-color:#34383d}:root[data-theme="dark"] .nettoNotifBody span,:root[data-theme="dark"] .nettoUserText small,:root[data-theme="dark"] .nettoUserHead small{color:#aaa5a0}:root[data-theme="dark"] .nettoNotifItem{border-color:#33373b}:root[data-theme="dark"] .nettoNotifItem.manual_edit{background:#1c2637;border-color:#314568}:root[data-theme="dark"] .nettoNotifItem.import_new{background:#183025;border-color:#2d503b}:root[data-theme="dark"] .nettoNotifItem.import_replace{background:#342819;border-color:#574225}:root[data-theme="dark"] .nettoNotifItem.reset_day,:root[data-theme="dark"] .nettoNotifItem.reset_week{background:#38221f;border-color:#5a332d}:root[data-theme="dark"] .nettoNotifItem.password_reset_request{background:#382c1d;border-color:#5b4728}:root[data-theme="dark"] .nettoNotifItem.password_reset_request .nettoNotifIcon{background:#49371f;color:#ffc66e}
 @media(max-width:700px){
   header{overflow:visible!important}.nettoGlobalTools{gap:6px}.nettoBellBtn{width:40px;height:40px;border-radius:12px}.nettoUserBtn{height:40px;min-width:105px;max-width:140px;grid-template-columns:28px minmax(0,1fr) 12px;padding:5px 6px}.nettoTopAvatar{width:28px;height:28px}.nettoUserText strong{font-size:9.5px}.nettoUserText small{font-size:7px}
   .nettoDrop{position:fixed!important;right:10px!important;left:10px!important;top:max(62px,calc(env(safe-area-inset-top) + 52px))!important;width:auto!important;max-height:calc(100dvh - 76px)!important;overflow:auto!important;border-radius:18px!important;z-index:5000!important}
   .nettoNotifList{max-height:calc(100dvh - 145px)}.nettoNavBtn{min-height:48px}.nettoNavBtn strong{font-size:11px}.nettoNavBtn small{font-size:8.5px}
   .backBtn,header>.top>.back,header .top>.back{display:none!important}
 }
 @media(max-width:430px){.nettoGlobalTools{gap:5px}.nettoUserBtn{width:38px;min-width:38px;max-width:38px;height:38px;grid-template-columns:28px;padding:5px}.nettoChevron,.nettoUserText{display:none}.nettoBellBtn{width:38px;height:38px}}
 `;document.head.appendChild(s)
}
function paint(el,url,name,color){if(!el)return;el.style.setProperty('--profile-accent',color||'#ff5a2a');if(url){el.classList.add('hasPhoto');el.style.backgroundImage='url("'+url.replace(/"/g,'%22')+'")';el.textContent=''}else{el.classList.remove('hasPhoto');el.style.backgroundImage='';el.textContent=initials(name)}}
function makeButton(icon,title,sub,url,cls=''){return '<button class="nettoNavBtn '+cls+'" data-url="'+esc(url||'')+'"><span>'+icon+'</span><span><strong>'+esc(title)+'</strong><small>'+esc(sub||'')+'</small></span></button>'}
function currentTheme(){return document.documentElement.dataset.theme==='dark'?'dark':'light'}
function validTheme(value){return value==='dark'||value==='light'?value:null}
function localTheme(theme){
 theme=validTheme(theme)||'light';
 if(typeof window.applyTheme==='function')window.applyTheme(theme);
 else{document.documentElement.dataset.theme=theme;try{localStorage.setItem('nettoTheme',theme)}catch(_){}}
 updateThemeText();
 return theme
}
function preferredTheme(profile=api.profile){return validTheme(preferenceMap(profile)?.theme)}
function profileThemeCacheKey(uid=api.session?.user?.id){return uid?'nettoProfileTheme:'+uid:null}
function cachedProfileTheme(uid=api.session?.user?.id){try{const k=profileThemeCacheKey(uid);return k?validTheme(localStorage.getItem(k)):null}catch(_){return null}}
function cacheProfileTheme(theme,uid=api.session?.user?.id){theme=validTheme(theme);if(!theme)return null;try{const k=profileThemeCacheKey(uid);if(k)localStorage.setItem(k,theme)}catch(_){}return theme}
async function saveThemePreference(theme){
 theme=localTheme(theme);cacheProfileTheme(theme);
 if(!api.profile)return theme;
 const prefs={...preferenceMap(api.profile),theme};
 api.profile={...api.profile,ui_preferences:prefs};
 saveGlobalCache();
 window.dispatchEvent(new CustomEvent('netto:theme-preference',{detail:{theme}}));
 if(api.client&&api.session){
  const {error}=await api.client.from('profiles').update({ui_preferences:prefs}).eq('id',api.session.user.id);
  if(error)console.warn('Préférence thème:',error)
 }
 return theme
}
function applyProfileTheme(profile=api.profile,persistMissing=false){
 const stored=preferredTheme(profile),theme=stored||cachedProfileTheme()||currentTheme();
 localTheme(theme);cacheProfileTheme(theme);
 if(!stored&&persistMissing&&api.client&&api.session)saveThemePreference(theme).catch(()=>{});
 return theme
}
function changeTheme(){
 const next=currentTheme()==='dark'?'light':'dark';
 if(typeof window.toggleTheme==='function')window.toggleTheme({stopPropagation(){}});
 else localTheme(next);
 saveThemePreference(next).catch(()=>{});
 updateThemeText()
}
function updateThemeText(){const dark=currentTheme()==='dark';document.querySelectorAll('.nettoThemeLabel').forEach(x=>x.textContent=dark?'Mode clair':'Mode sombre');document.querySelectorAll('.nettoThemeIcon').forEach(x=>x.textContent=dark?'☀':'☾')}
function bindHomeMark(){
 document.querySelectorAll('.mark,.brandMark,.nMenuBtn,.brandMenuBtn').forEach(b=>{if((b.textContent||'').trim()!=='N')return;b.removeAttribute('onclick');b.removeAttribute('aria-expanded');b.setAttribute('aria-label','Retour à l’accueil');b.onclick=e=>{e.preventDefault();e.stopPropagation();location.href='home.html'}})
 document.querySelectorAll('#nMenu,.brandMenu').forEach(x=>x.classList.add('hidden'))
 document.body.classList.remove('mobileNavOpen')
}
function findHeaderTop(){return document.querySelector('#site header .top')||document.querySelector('header .top')}
async function detachPushBeforeLogout(){
 try{
  if(!api.client||!api.session||!('serviceWorker' in navigator)||!('PushManager' in window))return;
  const reg=await navigator.serviceWorker.getRegistration();const sub=await reg?.pushManager?.getSubscription();if(!sub)return;
  try{await api.client.functions.invoke('planning-push',{body:{action:'unsubscribe',endpoint:sub.endpoint}})}catch(_){}
  await sub.unsubscribe()
 }catch(e){console.warn('Désabonnement Push:',e)}
}
function buildGlobalHeader(){
 const previous=document.getElementById('nettoGlobalTools');if(previous)previous.remove();bindHomeMark();
 const top=findHeaderTop();if(!top||!api.profile)return;
 const existing=top.querySelector('.userMenuWrap');if(existing)existing.style.display='none';
 const p=api.profile,name=p.display_name||'Utilisateur',role=roleLabel(p.role);
 const shortcuts=visibleModules('user_menu',p,api.siteConfig).map(m=>makeButton(moduleIcon(m),m.label,m.subtitle,m.url)).join('');
 const wrap=document.createElement('div');wrap.id='nettoGlobalTools';wrap.className='nettoGlobalTools';
 const adminLoginTool=p.role==='admin'?'<div class="nettoLoginWrap"><button id="nettoLoginBtn" class="nettoBellBtn nettoLoginBtn" aria-label="Historique des connexions" aria-expanded="false" title="Connexions"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm1 10.41 3.3 1.9-1 1.73L11 13.59V7h2Z"/></svg></button><div id="nettoLoginDrop" class="nettoDrop nettoLoginDrop hidden"><div class="nettoNotifHead"><div class="nettoLoginHeadTitle"><strong>Connexions</strong><small>Qui s’est connecté et à quelle heure</small></div><div class="nettoNotifHeadActions"><button id="nettoLoginDeleteAll">Tout supprimer</button></div></div><div id="nettoLoginList" class="nettoLoginList"><div class="nettoNotifEmpty">Chargement…</div></div></div></div>':'';
 const inMobilePreview=new URLSearchParams(location.search).get('mobile_preview')==='1';
 const adminMobileTool=p.role==='admin'&&!inMobilePreview?'<div class="nettoMobilePreviewWrap"><button id="nettoMobilePreviewBtn" class="nettoBellBtn nettoMobilePreviewBtn" aria-label="Vision mobile" aria-pressed="false" title="Vision mobile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 1.5h10A2.5 2.5 0 0 1 19.5 4v16A2.5 2.5 0 0 1 17 22.5H7A2.5 2.5 0 0 1 4.5 20V4A2.5 2.5 0 0 1 7 1.5Zm0 2A.5.5 0 0 0 6.5 4v16a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H7Zm3.5 14h3a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2Z"/></svg></button></div>':'';
 wrap.innerHTML=adminLoginTool+adminMobileTool+'<div class="nettoBellWrap"><button id="nettoBellBtn" class="nettoBellBtn" aria-label="Notifications" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a2.55 2.55 0 0 0 2.45-1.85h-4.9A2.55 2.55 0 0 0 12 22Zm7-5.1-1.75-2.05V9.5A5.26 5.26 0 0 0 13 4.34V3a1 1 0 1 0-2 0v1.34A5.26 5.26 0 0 0 6.75 9.5v5.35L5 16.9V18h14v-1.1Z"/></svg><b id="nettoNotifBadge" class="nettoNotifBadge hidden">0</b></button><div id="nettoNotifDrop" class="nettoDrop nettoNotifDrop hidden"><div class="nettoNotifHead"><strong>Notifications</strong><div class="nettoNotifHeadActions"><button id="nettoMarkRead">Tout lire</button><button id="nettoDeleteAll">Tout supprimer</button></div></div><div id="nettoNotifList" class="nettoNotifList"><div class="nettoNotifEmpty">Chargement…</div></div></div></div><div class="nettoUserWrap"><button id="nettoUserBtn" class="nettoUserBtn" aria-expanded="false"><span id="nettoTopAvatar" class="nettoTopAvatar">U</span><span class="nettoUserText"><strong>'+esc(name)+'</strong><small>'+esc(role)+'</small></span><span class="nettoChevron">⌄</span></button><div id="nettoUserDrop" class="nettoDrop hidden"><div class="nettoUserHead"><span id="nettoMenuAvatar" class="nettoTopAvatar">U</span><span><strong>'+esc(name)+'</strong><small>'+esc(role)+'</small></span></div>'+makeButton('⚙','Personnalisation','Mon accueil et mes raccourcis','settings.html')+(shortcuts?'<div class="nettoMenuSection">Raccourcis</div>'+shortcuts:'')+'<button id="nettoThemeBtn" class="nettoNavBtn"><span class="nettoThemeIcon">☾</span><span><strong class="nettoThemeLabel">Mode sombre</strong><small>Changer l’apparence</small></span></button><button id="nettoLogoutBtn" class="nettoNavBtn nettoLogout"><span>↪</span><span><strong>Déconnexion</strong><small>Quitter la session</small></span></button></div></div>';
 top.appendChild(wrap);
 paint(document.getElementById('nettoTopAvatar'),api.avatarUrl,name,p.profile_color);paint(document.getElementById('nettoMenuAvatar'),api.avatarUrl,name,p.profile_color);updateThemeText();
 wrap.querySelectorAll('.nettoNavBtn[data-url]').forEach(b=>b.onclick=()=>{sounds.play('navigate');const url=b.dataset.url;setTimeout(()=>location.href=url,55)});
 document.getElementById('nettoThemeBtn').onclick=e=>{e.stopPropagation();sounds.play('switch');changeTheme();updateThemeText()};
 document.getElementById('nettoLogoutBtn').onclick=async()=>{sounds.play('logout');await new Promise(r=>setTimeout(r,390));await detachPushBeforeLogout();await api.client.auth.signOut({scope:'local'});location.href='index.html'};
 document.getElementById('nettoUserBtn').onclick=e=>{e.stopPropagation();toggleDrop('user')};
 const loginBtn=document.getElementById('nettoLoginBtn');if(loginBtn)loginBtn.onclick=e=>{e.stopPropagation();toggleDrop('logins')};
 const mobilePreviewBtn=document.getElementById('nettoMobilePreviewBtn');if(mobilePreviewBtn)mobilePreviewBtn.onclick=e=>{e.stopPropagation();toggleMobilePreview()};
 const loginDeleteAll=document.getElementById('nettoLoginDeleteAll');if(loginDeleteAll)loginDeleteAll.onclick=e=>{e.stopPropagation();sounds.play('warning');deleteAllLoginHistory()};
 document.getElementById('nettoBellBtn').onclick=e=>{e.stopPropagation();toggleDrop('notifications')};
 document.getElementById('nettoMarkRead').onclick=e=>{e.stopPropagation();sounds.play('confirm');markAllRead()};
 document.getElementById('nettoDeleteAll').onclick=e=>{e.stopPropagation();sounds.play('warning');deleteAllNotifications()};
 if(!api.globalListenersBound){document.addEventListener('click',e=>{if(!e.target.closest('#nettoGlobalTools'))closeDrops()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrops()});api.globalListenersBound=true}
}
function mobilePreviewUrl(){const u=new URL(location.href);u.searchParams.set('mobile_preview','1');return u.href}
function setMobilePreviewButton(active){const btn=document.getElementById('nettoMobilePreviewBtn');if(!btn)return;btn.classList.toggle('active',!!active);btn.setAttribute('aria-pressed',String(!!active));btn.title=active?'Quitter la vision mobile':'Vision mobile'}
let mobilePreviewNoticeTimer=null;
function mobilePreviewNotice(message){document.getElementById('nettoMobilePreviewNotice')?.remove();clearTimeout(mobilePreviewNoticeTimer);const notice=document.createElement('div');notice.id='nettoMobilePreviewNotice';notice.className='nettoMobilePreviewNotice';notice.innerHTML='<i></i><span>'+esc(message)+'</span>';document.body.appendChild(notice);requestAnimationFrame(()=>notice.classList.add('show'));mobilePreviewNoticeTimer=setTimeout(()=>{notice.classList.remove('show');setTimeout(()=>notice.remove(),220)},1800)}
function closeMobilePreview(showNotice=true){const hadPreview=!!document.getElementById('nettoMobilePreviewOverlay');document.getElementById('nettoMobilePreviewOverlay')?.remove();setMobilePreviewButton(false);document.body.style.removeProperty('overflow');if(hadPreview&&showNotice)mobilePreviewNotice('Vision mobile désactivée')}
function toggleMobilePreview(){const existing=document.getElementById('nettoMobilePreviewOverlay');if(existing){closeMobilePreview(true);sounds.play('menuClose');return}closeDrops();const overlay=document.createElement('div');overlay.id='nettoMobilePreviewOverlay';overlay.className='nettoMobilePreviewOverlay';overlay.innerHTML='<div class="nettoMobilePreviewDevice" role="dialog" aria-label="Aperçu mobile Nethor"><div class="nettoMobilePreviewTop"><span class="nettoMobilePreviewNotch"></span><button class="nettoMobilePreviewClose" type="button" aria-label="Fermer la vision mobile">×</button></div><iframe class="nettoMobilePreviewFrame" title="Vision mobile Nethor" src="'+esc(mobilePreviewUrl())+'"></iframe></div>';overlay.addEventListener('click',e=>{if(e.target===overlay)closeMobilePreview(true)});overlay.querySelector('.nettoMobilePreviewClose').onclick=()=>closeMobilePreview(true);document.body.appendChild(overlay);document.body.style.overflow='hidden';setMobilePreviewButton(true);mobilePreviewNotice('Vision mobile activée');sounds.play('menuOpen')}
function toggleDrop(which){
 const n=document.getElementById('nettoNotifDrop'),u=document.getElementById('nettoUserDrop'),l=document.getElementById('nettoLoginDrop'),nb=document.getElementById('nettoBellBtn'),ub=document.getElementById('nettoUserBtn'),lb=document.getElementById('nettoLoginBtn');
 const drops={notifications:n,user:u,logins:l},buttons={notifications:nb,user:ub,logins:lb},target=drops[which];if(!target)return;
 const open=target.classList.contains('hidden');sounds.play(open?'menuOpen':'menuClose');
 Object.entries(drops).forEach(([key,el])=>{if(el)el.classList.toggle('hidden',key===which?!open:true)});
 Object.entries(buttons).forEach(([key,el])=>{if(el)el.setAttribute('aria-expanded',String(key===which&&open))});
 if(open&&which==='notifications')loadNotifications();
 if(open&&which==='logins')loadLoginHistory();
}
function closeDrops(){
 ['nettoNotifDrop','nettoUserDrop','nettoLoginDrop'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
 ['nettoBellBtn','nettoUserBtn','nettoLoginBtn'].forEach(id=>document.getElementById(id)?.setAttribute('aria-expanded','false'));
}
function loginDate(v){const d=new Date(v);return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'})+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
function renderLoginHistory(){
 const list=document.getElementById('nettoLoginList');if(!list)return;
 if(!api.loginHistory.length){list.innerHTML='<div class="nettoNotifEmpty">Aucune connexion enregistrée.</div>';return}
 list.innerHTML=api.loginHistory.map(x=>'<article class="nettoLoginItem" data-id="'+x.id+'"><span class="nettoLoginAvatar" style="--login-accent:'+esc(x.profile_color||'#ff5a2a')+'">'+esc(initials(x.display_name||'Utilisateur'))+'</span><div class="nettoLoginBody"><strong>'+esc(x.display_name||'Utilisateur')+'</strong><span>'+esc(roleLabel(x.role))+'</span><small>'+loginDate(x.signed_in_at)+'</small></div><button class="nettoLoginDelete" type="button" title="Supprimer" aria-label="Supprimer cette connexion">×</button></article>').join('');
 list.querySelectorAll('.nettoLoginDelete').forEach(b=>b.onclick=e=>{e.stopPropagation();deleteLoginHistoryRow(Number(b.closest('.nettoLoginItem').dataset.id))});
}
async function loadLoginHistory(){
 if(!api.client||api.profile?.role!=='admin')return;
 const list=document.getElementById('nettoLoginList');if(list)list.innerHTML='<div class="nettoNotifEmpty">Chargement…</div>';
 const [logsRes,profilesRes]=await Promise.all([
  api.client.from('login_history').select('id,user_id,signed_in_at,user_agent,source').order('signed_in_at',{ascending:false}).limit(250),
  api.client.from('profiles').select('id,display_name,role,profile_color')
 ]);
 if(logsRes.error){console.warn('Historique connexions:',logsRes.error);if(list)list.innerHTML='<div class="nettoNotifEmpty">Impossible de charger l’historique.</div>';return}
 const profiles=new Map((profilesRes.data||[]).map(p=>[p.id,p]));
 api.loginHistory=(logsRes.data||[]).map(x=>({...x,...(profiles.get(x.user_id)||{})}));renderLoginHistory();
}
async function deleteLoginHistoryRow(id){
 if(api.profile?.role!=='admin'||!Number.isFinite(Number(id)))return;
 const {data,error}=await api.client.rpc('admin_delete_login_history',{p_id:Number(id)});if(error){console.warn('Suppression connexion:',error);sounds.play('error');return}
 if(Number(data||0)<1){sounds.play('error');await loadLoginHistory();return}
 sounds.play('delete');api.loginHistory=api.loginHistory.filter(x=>Number(x.id)!==Number(id));renderLoginHistory();
}
async function deleteAllLoginHistory(){
 if(api.profile?.role!=='admin'||!api.loginHistory.length)return;
 if(!confirm('Supprimer tout l’historique des connexions ?'))return;
 const {data,error}=await api.client.rpc('admin_delete_login_history',{p_id:null});if(error){console.warn('Suppression historique connexions:',error);sounds.play('error');return}
 sounds.play('delete');api.loginHistory=[];renderLoginHistory();
}

function notificationIcon(k){return k==='admin_message'?'📣':k==='password_reset_request'?'🔑':k==='import_new'?'▦':k==='import_replace'?'↻':(k==='reset_day'||k==='reset_week')?'⌫':'✎'}
function notificationDate(v){const d=new Date(v);return d.toLocaleDateString('fr-FR')+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
function renderNotifications(){
 const list=document.getElementById('nettoNotifList'),badge=document.getElementById('nettoNotifBadge');if(!list||!badge)return;const unread=api.notifications.filter(n=>!n.read_at).length;badge.textContent=unread>99?'99+':String(unread);badge.classList.toggle('hidden',unread===0);
 if(!api.notifications.length){list.innerHTML='<div class="nettoNotifEmpty">Aucune notification pour le moment.</div>';return}
 list.innerHTML=api.notifications.map(n=>'<article class="nettoNotifItem '+esc(n.kind)+' '+(!n.read_at?'unread':'')+'" data-id="'+n.id+'" data-url="'+esc(n.target_url||'')+'"><span class="nettoNotifIcon">'+notificationIcon(n.kind)+'</span><div class="nettoNotifBody"><strong>'+esc(n.title)+'</strong><span>'+esc(n.message)+'</span><small>'+notificationDate(n.created_at)+'</small></div><button class="nettoNotifDelete" title="Supprimer" aria-label="Supprimer la notification">×</button></article>').join('');
 list.querySelectorAll('.nettoNotifItem').forEach(el=>{el.onclick=async e=>{if(e.target.closest('.nettoNotifDelete'))return;const id=Number(el.dataset.id),url=el.dataset.url;await markRead(id);if(url)location.href=url}});
 list.querySelectorAll('.nettoNotifDelete').forEach(b=>b.onclick=e=>{e.stopPropagation();deleteNotification(Number(b.closest('.nettoNotifItem').dataset.id))})
}
async function loadNotifications(){if(!api.client||!api.session)return;const {data,error}=await api.client.from('planning_notifications').select('id,kind,title,message,planning_date,week_start,target_url,read_at,created_at').eq('user_id',api.session.user.id).order('created_at',{ascending:false}).limit(80);if(error){console.warn('Notifications:',error);return}api.notifications=data||[];renderNotifications();window.dispatchEvent(new CustomEvent('netto:notifications',{detail:{notifications:api.notifications,unread:api.notifications.filter(n=>!n.read_at).length}}))}
async function markRead(id){const n=api.notifications.find(x=>x.id===id);if(!n||n.read_at)return;const now=new Date().toISOString(),{error}=await api.client.from('planning_notifications').update({read_at:now}).eq('id',id).eq('user_id',api.session.user.id);if(!error){n.read_at=now;renderNotifications()}}
async function markAllRead(){if(!api.notifications.some(n=>!n.read_at))return;const {error}=await api.client.from('planning_notifications').update({read_at:new Date().toISOString()}).eq('user_id',api.session.user.id).is('read_at',null);if(!error)loadNotifications()}
async function deleteNotification(id){const {error}=await api.client.from('planning_notifications').delete().eq('id',id).eq('user_id',api.session.user.id);if(!error){sounds.play('delete');api.notifications=api.notifications.filter(n=>n.id!==id);renderNotifications();window.dispatchEvent(new CustomEvent('netto:notifications',{detail:{notifications:api.notifications,unread:api.notifications.filter(n=>!n.read_at).length}}))}}
async function deleteAllNotifications(){if(!api.notifications.length)return;if(!confirm('Supprimer toutes tes notifications ?'))return;const ids=api.notifications.map(n=>n.id);const {error}=await api.client.from('planning_notifications').delete().eq('user_id',api.session.user.id).in('id',ids);if(!error){sounds.play('delete');api.notifications=[];renderNotifications();window.dispatchEvent(new CustomEvent('netto:notifications',{detail:{notifications:[],unread:0}}))}}
function startNotificationsRealtime(){if(!api.session||api.notifChannel)return;api.notifChannel=api.client.channel('planning-notifications-'+api.session.user.id).on('postgres_changes',{event:'*',schema:'public',table:'planning_notifications',filter:'user_id=eq.'+api.session.user.id},()=>{sounds.play('notification');loadNotifications()}).subscribe()}
function syncPresence(){if(!api.channel)return;const state=api.channel.presenceState(),ids=new Set();Object.values(state).flat().forEach(x=>{if(x?.user_id)ids.add(x.user_id)});api.onlineIds=ids;window.dispatchEvent(new CustomEvent('netto:presence',{detail:{ids:[...ids],count:ids.size}}))}
function startPresence(){if(!api.session||api.channel)return;api.channel=api.client.channel('team-presence',{config:{presence:{key:api.session.user.id}}}).on('presence',{event:'sync'},syncPresence).on('presence',{event:'join'},syncPresence).on('presence',{event:'leave'},syncPresence).subscribe(async status=>{if(status==='SUBSCRIBED'){const p=api.profile||{};await api.channel.track({user_id:api.session.user.id,display_name:p.display_name||'Utilisateur',page:location.pathname,online_at:new Date().toISOString()});syncPresence()}})}
function updateKnownUI(){const p=api.profile;if(!p)return;const name=p.display_name||'Utilisateur',role=roleLabel(p.role);['userName','userMenuName'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=name});['userRole','userMenuRole'].forEach(id=>{const e=document.getElementById(id);if(e)e.textContent=role});['userAvatar','userMenuAvatar'].forEach(id=>paint(document.getElementById(id),api.avatarUrl,name,p.profile_color));const status=document.getElementById('userStatus');if(status)status.textContent=p.status_text||'';buildGlobalHeader()}
function pageFile(){return (location.pathname.split('/').pop()||'home.html').toLowerCase()}
function backFallback(){return pageFile()==='stock-test.html'?'index.html':'home.html'}
function goBack(){
 sounds.play('navigate');
 const fallback=backFallback();
 let sameOriginRef=false;
 try{sameOriginRef=!!document.referrer&&new URL(document.referrer).origin===location.origin}catch(_){}
 setTimeout(()=>{if(sameOriginRef&&history.length>1)history.back();else location.href=fallback},45)
}
function addBackButton(){
 const p=pageFile();if(p==='home.html'||p==='')return;
 document.querySelectorAll('header .backBtn').forEach(x=>x.classList.add('nettoLegacyBackHidden'));
 if(document.getElementById('nettoGlobalBack'))return;
 const b=document.createElement('button');b.id='nettoGlobalBack';b.type='button';b.className='nettoBackBtn';b.setAttribute('aria-label','Retour');b.innerHTML='<span class="nettoBackArrow">←</span><span class="nettoBackLabel">Retour</span>';b.onclick=goBack;
 const top=document.querySelector('header .top');
 if(top)top.insertBefore(b,top.firstChild);
 else{b.style.position='fixed';b.style.left='12px';b.style.top='12px';b.style.zIndex='3500';document.body.appendChild(b)}
}
async function rememberSiteBase(){
 if(!api.client||!api.session||api.profile?.role!=='admin')return;
 try{
  const u=new URL(location.href);
  if(!['http:','https:'].includes(u.protocol))return;
  const base=u.origin+u.pathname.replace(/[^/]*$/,'');
  const {data:existing}=await api.client.from('app_settings').select('value').eq('key','site_base_url').maybeSingle();
  if(existing?.value?.url===base)return;
  await api.client.from('app_settings').upsert({key:'site_base_url',value:{url:base},updated_at:new Date().toISOString(),updated_by:api.session.user.id},{onConflict:'key'});
 }catch(e){console.warn('Enregistrement URL portail:',e)}
}
function pageArea(){const p=(location.pathname.split('/').pop()||'home.html').toLowerCase();const map={'home.html':'Accueil','index.html':'Stock F&L','planning.html':'Planning','chat.html':'Équipe','profile.html':'Mon profil','articles.html':'Fiches articles','bakery.html':'Boulangerie','settings.html':'Personnalisation du site','admin-portal.html':'Éditeur du portail','custom-menu.html':'Menu personnalisé','stock-test.html':'Vue stock groupée','rewards.html':'Défis & Boutique','accounts.html':'Gestion des comptes'};return map[p]||document.title||'Portail'}
async function logPageView(){if(!api.client||!api.session)return;try{await api.client.rpc('audit_page_view',{p_area:pageArea(),p_path:(location.pathname||'')+(location.search||''),p_title:document.title||pageArea()})}catch(e){console.warn('Journal consultation:',e)}}
function globalCacheKey(){return api.session?.user?.id?'nettoGlobalUI:'+api.session.user.id:null}
function hydrateGlobalCache(){
 try{
  const k=globalCacheKey();if(!k)return false;const x=JSON.parse(localStorage.getItem(k)||'null');if(!x||Date.now()-Number(x.saved_at||0)>120000)return false;
  if(!x.profile)return false;api.profile=x.profile;api.siteConfig=x.siteConfig||{};api.avatarUrl=x.avatarUrl||null;applyProfileTheme(api.profile,false);rebuildModules(api.siteConfig);applyPortalTheme(api.siteConfig);document.documentElement.style.setProperty('--profile-accent',api.profile.profile_color||'#ff5a2a');updateKnownUI();window.dispatchEvent(new CustomEvent('netto:profile',{detail:{profile:api.profile,avatarUrl:api.avatarUrl,siteConfig:api.siteConfig,cached:true}}));return true
 }catch(_){return false}
}
function saveGlobalCache(){try{const k=globalCacheKey();if(k&&api.profile)localStorage.setItem(k,JSON.stringify({saved_at:Date.now(),profile:api.profile,siteConfig:api.siteConfig,avatarUrl:api.avatarUrl}))}catch(_){}}
async function refresh(){if(!api.client||!api.session)return null;const [pr,sr]=await Promise.all([api.client.from('profiles').select('display_name,role,avatar_path,status_text,profile_color,ui_preferences').eq('id',api.session.user.id).maybeSingle(),api.client.from('app_settings').select('value').eq('key','site_config').maybeSingle()]);const p=pr.data;if(!p)return null;api.profile=p;api.siteConfig=sr.data?.value&&typeof sr.data.value==='object'?sr.data.value:{};applyProfileTheme(p,true);rebuildModules(api.siteConfig);applyPortalTheme(api.siteConfig);api.avatarUrl=null;if(p.avatar_path){const {data:a}=await api.client.storage.from('profile-avatars').createSignedUrl(p.avatar_path,3600);api.avatarUrl=a?.signedUrl||null}document.documentElement.style.setProperty('--profile-accent',p.profile_color||'#ff5a2a');updateKnownUI();saveGlobalCache();window.dispatchEvent(new CustomEvent('netto:profile',{detail:{profile:p,avatarUrl:api.avatarUrl,siteConfig:api.siteConfig}}));return p}
async function init(){addStyle();if(!window.supabase?.createClient)return;api.client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});const {data:{session}}=await api.client.auth.getSession();if(!session)return;api.session=session;const rememberedTheme=cachedProfileTheme(session.user.id);if(rememberedTheme)localTheme(rememberedTheme);const cached=hydrateGlobalCache(),fresh=refresh();if(!cached)await fresh;else fresh.catch(()=>{});rememberSiteBase();addBackButton();logPageView();bindHomeMark();loadNotifications();startNotificationsRealtime();startPresence();let lastFocusReload=0;const reload=()=>{const now=Date.now();if(now-lastFocusReload<15000)return;lastFocusReload=now;loadNotifications()};window.addEventListener('focus',reload);document.addEventListener('visibilitychange',()=>{if(!document.hidden)reload()})}
const rewardScript=document.createElement('script');rewardScript.src='reward-profile.js?v=2';rewardScript.defer=true;document.head.appendChild(rewardScript);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

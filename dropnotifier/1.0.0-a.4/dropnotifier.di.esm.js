var re=Object.defineProperty;var i=(t,e)=>re(t,"name",{value:e,configurable:!0});var A=[],E;function l(t){A.push(t),E&&t(E)}i(l,"register");function z(t){E=t||{};for(let e=0;e<A.length;e++)A[e](E)}i(z,"fillAll");var ie=i(t=>t&&new Proxy(t,{get:i((e,n)=>n==="$raw"?e:Reflect.get(e,n),"get")}),"__raw"),se,ae,ce,le,de,fe,p,ue,w,pe,ge,me,be,L,he,ye,xe,we,y,ke,Ee,ve,$,Ie,Se,Ce,Te,Pe,De,_e,Ne,Me,Ae,Le,$e,Re,R,Be,Fe;l(t=>{let e=t.libs&&t.libs["plugin-api"]||{};se=e.AIDriver,ae=e.Action,ce=e.Altitude,le=e.BGM,de=e.Background,fe=e.Camera,p=e.ChatBox,ue=e.Client,w=ie(e.Commands),pe=e.Configs,ge=e.DB,me=e.EffectManager,be=e.EffectTable,L=e.EntityManager,he=e.ItemInfo,ye=e.MapRenderer,xe=e.MiniMap,we=e.Network,y=e.PACKET,ke=e.PacketLength,Ee=e.PathFinding,ve=e.PluginManager,$=e.Preferences,Ie=e.Session,Se=e.ShortCut,Ce=e.SkillAction,Te=e.SkillConst,Pe=e.SkillDescription,De=e.SkillEffect,_e=e.SkillInfo,Ne=e.SkillTargetSelection,Me=e.SoundManager,Ae=e.Sprite,Le=e.StatusIcons,$e=e.StatusInfo,Re=e.Texture,R=t.LegacyUIComponent,Be=e.UIManager,Fe=e.WebGL});var Oe,v,Ue,Ye;l(t=>{let e=t.libs&&t.libs["packet-observer"]||{};Oe=e.default,v=e.observePacket,Ue=e.observePacketStatus,Ye=e.observeSendPacket});var I,qe,We,Ge,ze,He,Ve,Ke,S,je;l(t=>{let e=t.libs&&t.libs["event-bus"]||{};I=e.EVENTS,qe=e.createBus,We=e.default,Ge=e.emit,ze=e.getBus,He=e.off,Ve=e.on,Ke=e.onFirstListener,S=e.once,je=e.stats});var Ze,Xe,Je,Qe,et,tt,nt,ot,rt,it,B,st,at,ct,lt;l(t=>{let e=t.libs&&t.libs.lifecycle||{};Ze=e.cleanupCount,Xe=e.createLifecycle,Je=e.default,Qe=e.flushCleanup,et=e.getCount,tt=e.getLifecycle,nt=e.getState,ot=e.hasReached,rt=e.isWired,it=e.onInitCall,B=e.registerCleanup,st=e.setCurrentPlugin,at=e.setLogger,ct=e.stats,lt=e.transition});var dt,ft,ut,pt,gt,F,O,mt,bt;l(t=>{let e=t.libs&&t.libs.ui||{};dt=e.default,ft=e.find,ut=e.findAll,pt=e.makeDraggable,gt=e.on,F=e.purgeComponentCss,O=e.registerPlayerWindow,mt=e.registerWindow,bt=e.root});var C={name:"DropNotifier",version:"1.0.0-a.4",description:"Desktop notification + optional beep when an item drops on the ground, filtered by name substrings and base-drop-rate rarity tiers. Reads the ItemDb plugin for item names + droppedBy rates. Settings persist via Preferences.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["ItemDb"],pars:{}};var Y=6e4,xt=5e3,wt=Y+12e4,Z=400,kt=0,H=5,X={ultra:"Ultra-rare",rare:"Rare",uncommon:"Uncommon",common:"Common",unknown:"Unknown"},Et=["ITEM_FALL_ENTRY","ITEM_FALL_ENTRY2","ITEM_FALL_ENTRY3","ITEM_ENTRY"],vt="DropNotifier.settings";function q(){return{master:!0,desktop:!0,sound:!0,nameFilter:"",tiers:{ultra:!0,rare:!0,uncommon:!0,common:!0,unknown:!0}}}i(q,"defaults");var d=null,f=null,m=null,J=!1,P=null,g=null,W=0,D=0,_=[],T=[],x=new Map;function N(){if(!m){try{m=$.get(vt,q(),1)}catch{return q()}It(m)}return m}i(N,"getSettings");function It(t){let e=q();for(let n of Object.keys(e))n!=="tiers"&&typeof t[n]>"u"&&(t[n]=e[n]);(!t.tiers||typeof t.tiers!="object")&&(t.tiers=e.tiers);for(let n of Object.keys(e.tiers))typeof t.tiers[n]>"u"&&(t.tiers[n]=e.tiers[n])}i(It,"normalizeSettings");function k(){try{m&&m.save&&m.save()}catch(t){console.warn("[DropNotifier] Preferences.save failed:",t)}}i(k,"saveSettings");function Q(t){let e=t&&t.droppedBy;if(!Array.isArray(e)||!e.length)return"unknown";let n=0;for(let r of e)r&&typeof r.rate=="number"&&r.rate>n&&(n=r.rate);let o=n/100;return o<=.05?"ultra":o<=1?"rare":o<=10?"uncommon":"common"}i(Q,"tierOf");function St(t,e){let n=String(e||"").split(",").map(r=>r.trim().toLowerCase()).filter(Boolean);if(!n.length)return!0;let o=String(t||"").toLowerCase();return n.some(r=>o.includes(r))}i(St,"passesNameFilter");function Ct(t,e){return St(t.name,e.nameFilter)?!!e.tiers[Q(t)]:!1}i(Ct,"itemMatches");function V(t){try{p.addText(t,p.TYPE&&p.TYPE.ERROR||64)}catch{}}i(V,"chatErr");function Tt(t){try{p.addText(t,p.TYPE&&p.TYPE.INFO||128)}catch{}}i(Tt,"chatInfo");function Pt(){if(typeof Notification>"u"){V("[DropNotifier] Desktop notifications unavailable in this browser/context.");return}if(Notification.permission==="denied"){V("[DropNotifier] Desktop notifications are blocked \u2014 enable them in your browser settings.");return}if(Notification.permission!=="granted")try{let t=Notification.requestPermission();t&&typeof t.then=="function"&&t.then(e=>{e!=="granted"&&Tt("[DropNotifier] Desktop permission not granted.")})}catch{}}i(Pt,"requestDesktopPermission");function ee(t,e,n){if(!(typeof Notification>"u"||Notification.permission!=="granted"))try{new Notification(t,{body:e,tag:n})}catch{}}i(ee,"notifyDesktop");function te(){if(g)return g;let t=window.AudioContext||window.webkitAudioContext;if(!t)return null;try{g=new t}catch{g=null}return g}i(te,"ensureAudioCtx");function ne(){let t=te();if(t){t.state==="suspended"&&t.resume().catch(()=>{});try{let e=t.createGain();e.gain.value=.25,e.connect(t.destination);let n=t.createOscillator();n.type="square",n.frequency.value=880,n.connect(e);let o=t.currentTime;n.start(o),n.stop(o+.12)}catch{}}}i(ne,"beep");function Dt(t,e){for(let[n,o]of t)o.expiry<=e&&t.delete(n)}i(Dt,"pruneExpired");function _t(t){let e=N();if(e.master===!1)return;let n=t&&t.ITAID,o=t&&t.ITID;if(n==null||o==null)return;let r=Date.now();Dt(x,r);let a=x.get(n);if(a&&a.itid===o||!J)return;let c=P.get(o)||{id:o,name:`Item #${o}`,droppedBy:[]};if(!Ct(c,e))return;let s=Q(c),u=t.count>0?t.count:1,b=`@ (${t.xPos}, ${t.yPos})`,h=`Drop: ${c.name}`,M=`${c.name} \xD7${u} \u2014 ${X[s]||s} ${b}`,oe=`${n}|${o}`;e.desktop&&ee(h,M,oe),e.sound&&r-D>=Z&&(D=r,ne()),x.set(n,{itid:o,x:t.xPos,y:t.yPos,name:c.name,tier:s,qty:u,droppedAt:r,expiry:r+wt})}i(_t,"handleFall");function Nt(t,e){let n=null,o=null;try{L.forEach(r=>{if(!r||!r.position)return;let a=r.objecttype;if(!(a!==H&&a!==kt)&&!(typeof r.isDead=="function"&&r.isDead())&&!(Math.round(r.position[0])!==t||Math.round(r.position[1])!==e)){if(a===H)return o=r,!1;n||(n=r)}})}catch{}return o?{kind:"mob",entity:o}:n?{kind:"pc",entity:n}:null}i(Nt,"findCellActor");function Mt(t){let e=t&&t.ITAID;if(e==null)return;let n=x.get(e);if(!n)return;x.delete(e);let o=N();if(o.master===!1)return;let r=Date.now(),a=Nt(n.x,n.y),c=`${n.name} \xD7${n.qty} \u2014 ${X[n.tier]||n.tier}`,s=`@ (${n.x}, ${n.y})`,u=r-n.droppedAt,b,h;if(a&&a.kind==="mob"){let M=a.entity.display&&a.entity.display.name||"A monster";b=`Looted: ${n.name}`,h=`\u{1F43E} ${M} looted ${c} ${s}`}else a&&a.kind==="pc"?(b=`Picked up: ${n.name}`,h=`${c} \u2014 picked up by a player ${s}`):u>=Y-xt?(b=`Expired: ${n.name}`,h=`${c} \u2014 despawned (auto, ~${Math.round(Y/1e3)}s) ${s}`):(b=`Gone: ${n.name}`,h=`${c} \u2014 gone after ${Math.round(u/1e3)}s (taken or out of view) ${s}`);o.desktop&&ee(b,h,`gone|${e}`),o.sound&&r-D>=Z&&(D=r,ne())}i(Mt,"handleDisappear");function K(){let t=y&&y.ZC;if(t){for(let e of Et){let n=t[e];if(!n)continue;let o=v(n,_t);typeof o=="function"&&_.push(o)}if(t.ITEM_DISAPPEAR){let e=v(t.ITEM_DISAPPEAR,Mt);typeof e=="function"&&_.push(e)}}}i(K,"hookPackets");var At=`
<div class="dn-panel">
  <div class="dn-titlebar">
    <span class="dn-title">Drop Notifier <span class="dn-ver">v${C.version}</span></span>
    <button type="button" class="dn-btn dn-close" title="Close">x</button>
  </div>
  <div class="dn-body">
    <label class="dn-row dn-master-row"><input type="checkbox" class="dn-master"> <b>Enabled</b> (master)</label>

    <div class="dn-section">
      <div class="dn-section-title">Channels</div>
      <label class="dn-row"><input type="checkbox" class="dn-desktop"> Desktop notification</label>
      <label class="dn-row"><input type="checkbox" class="dn-sound"> Sound alert</label>
      <div class="dn-warning" hidden>\u26A0 Both channels off \u2014 you won't be notified.</div>
    </div>

    <div class="dn-section">
      <div class="dn-section-title">Name filter</div>
      <input type="text" class="dn-name" placeholder="e.g. card, savage (comma-separated)">
      <div class="dn-hint">Empty = every item. Matches any comma-separated substring.</div>
    </div>

    <div class="dn-section">
      <div class="dn-section-title">Rarity tiers (base drop rate)</div>
      <label class="dn-row"><input type="checkbox" class="dn-tier" data-tier="ultra"> Ultra-rare (\u2264 0.05%)</label>
      <label class="dn-row"><input type="checkbox" class="dn-tier" data-tier="rare"> Rare (0.05\u20131%)</label>
      <label class="dn-row"><input type="checkbox" class="dn-tier" data-tier="uncommon"> Uncommon (1\u201310%)</label>
      <label class="dn-row"><input type="checkbox" class="dn-tier" data-tier="common"> Common (&gt; 10%)</label>
      <label class="dn-row"><input type="checkbox" class="dn-tier" data-tier="unknown"> Unknown / other</label>
    </div>
  </div>
</div>`.trim(),Lt=`
.dn-panel {
  position: absolute; top: 80px; left: 80px;
  width: 280px;
  background: rgba(20, 20, 24, 0.92);
  border: 1px solid #555; border-radius: 4px;
  font-family: Arial, sans-serif; font-size: 11px; color: #ddd;
  display: flex; flex-direction: column; user-select: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
}
.dn-titlebar {
  background: linear-gradient(#3a3a44, #1e1e24);
  padding: 4px 8px; cursor: move; display: flex; align-items: center;
  border-bottom: 1px solid #555; flex: 0 0 auto;
}
.dn-title { flex: 1; font-weight: bold; color: #fff; }
.dn-ver { font-weight: normal; font-size: 9px; color: #888; margin-left: 4px; }
.dn-btn {
  width: 18px; height: 18px; line-height: 1; text-align: center;
  padding: 0; margin-left: 4px; border-radius: 2px;
  background: rgba(80, 80, 90, 0.9); border: 1px solid #777;
  color: #ddd; font-family: inherit; font-size: 11px; font-weight: bold;
  cursor: pointer; user-select: none;
  transition: background 80ms, border-color 80ms;
}
.dn-btn:hover { background: rgba(130, 130, 150, 0.95); border-color: #aac; color: #fff; }
.dn-body { padding: 8px 10px; display: flex; flex-direction: column; gap: 4px; }
.dn-row { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 1px 0; }
.dn-row input { cursor: pointer; }
.dn-master-row { padding-bottom: 4px; border-bottom: 1px solid #3a3a44; margin-bottom: 2px; }
.dn-section { margin-top: 6px; }
.dn-section-title { font-weight: bold; color: #9cf; margin-bottom: 3px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; }
.dn-name {
  width: 100%; box-sizing: border-box; padding: 4px 6px;
  background: rgba(0,0,0,0.4); border: 1px solid #555; border-radius: 2px;
  color: #fff; font-family: inherit; font-size: 11px;
}
.dn-name:focus { outline: none; border-color: #9cf; }
.dn-hint { color: #888; font-size: 9px; margin-top: 2px; }
.dn-warning {
  margin-top: 4px; padding: 4px 6px; border-radius: 2px;
  background: rgba(120, 60, 0, 0.4); border: 1px solid #a60;
  color: #fc8; font-size: 10px;
}
`.trim();function $t(){return document.querySelectorAll(".dn-panel").forEach(t=>t.remove()),d=new R("DropNotifierPanel",At,Lt),d}i($t,"buildPanel");function U(t){let e=t.querySelector(".dn-warning");if(!e)return;let n=N();e.hidden=!(!n.desktop&&!n.sound)}i(U,"renderWarning");function Rt(){let t=d&&d.ui&&d.ui[0];if(!t)return;let e=N();if(typeof d.draggable=="function"&&d.ui.find)try{d.draggable(d.ui.find(".dn-titlebar"))}catch{}let n=t.querySelector(".dn-close");n&&n.addEventListener("click",s=>{s.stopPropagation(),f&&f.hide()});let o=t.querySelector(".dn-master"),r=t.querySelector(".dn-desktop"),a=t.querySelector(".dn-sound");o&&(o.checked=!!e.master,o.addEventListener("change",()=>{e.master=o.checked,k()})),r&&(r.checked=!!e.desktop,r.addEventListener("change",()=>{e.desktop=r.checked,k(),r.checked&&Pt(),U(t)})),a&&(a.checked=!!e.sound,a.addEventListener("change",()=>{if(e.sound=a.checked,k(),a.checked){let s=te();s&&s.state==="suspended"&&s.resume().catch(()=>{})}U(t)}));let c=t.querySelector(".dn-name");c&&(c.value=e.nameFilter||"",c.addEventListener("input",()=>{let s=c.value;clearTimeout(W),W=setTimeout(()=>{e.nameFilter=s,k()},300)})),t.querySelectorAll(".dn-tier").forEach(s=>{let u=s.getAttribute("data-tier");s.checked=!!e.tiers[u],s.addEventListener("change",()=>{e.tiers[u]=s.checked,k()})}),U(t)}i(Rt,"bindPanel");function j(){w.add("dropnotifier","Toggle the Drop Notifier panel",function(){f&&(f.toggle(),this.addText(`[DropNotifier] ${f.isVisible()?"shown":"hidden"}`,this.TYPE.BLUE))},["dn"])}i(j,"registerChatCommand");function Bt(t,e){return console.log(`%c[RO][DropNotifier v${C.version}] loaded`,"color: #fc8; font-weight: bold"),P=e&&e.ItemDb||null,P?P.ready.then(()=>{J=!0}).catch(n=>{console.warn("[DropNotifier] item-db not ready:",n)}):console.warn("[DropNotifier] ItemDb plugin not loaded \u2014 drops are not notified"),y&&y.ZC&&y.ZC.ITEM_FALL_ENTRY?K():T.push(S(I.WIRE_COMPLETE,K)),f=O(()=>$t(),{persistKey:"DropNotifier",defaultVisible:!0,onMount:i(()=>Rt(),"onMount")}),w.$raw?j():T.push(S(I.MAP_ENTER,j)),B(({reason:n})=>{for(console.log(`[RO][DropNotifier] cleanup reason=${n}`);_.length;)try{_.pop()()}catch{}for(;T.length;)try{T.pop()()}catch{}try{w.remove("dropnotifier")}catch{}if(x.clear(),clearTimeout(W),g){try{g.close()}catch{}g=null}try{F("DropNotifierPanel")}catch{}try{f&&f.dispose&&f.dispose()}catch{}f=null,d=null,m=null}),!0}i(Bt,"Init");var G={...C,init:Bt};var un={...G,init(t,e){return z(e),G.init.call(this,t,e)}};export{un as default};

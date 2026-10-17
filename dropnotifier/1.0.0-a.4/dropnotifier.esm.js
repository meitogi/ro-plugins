var K=Object.defineProperty;var r=(e,n)=>K(e,"name",{value:n,configurable:!0});import{PACKET as x,ChatBox as h,UIComponent as Z,Preferences as X,Commands as P,EntityManager as J}from"@robrowser/plugin-api";import{observePacket as C}from"@robrowser/packet-observer";import{once as L,EVENTS as M}from"@robrowser/event-bus";import{registerCleanup as Q}from"@robrowser/lifecycle";import*as D from"@robrowser/ui";var w={name:"DropNotifier",version:"1.0.0-a.4",description:"Desktop notification + optional beep when an item drops on the ground, filtered by name substrings and base-drop-rate rarity tiers. Reads the ItemDb plugin for item names + droppedBy rates. Settings persist via Preferences.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["ItemDb","@robrowser/ui"],pars:{}};var $=6e4,ee=5e3,te=$+12e4,q=400,ne=0,R=5,U={ultra:"Ultra-rare",rare:"Rare",uncommon:"Uncommon",common:"Common",unknown:"Unknown"},oe=["ITEM_FALL_ENTRY","ITEM_FALL_ENTRY2","ITEM_FALL_ENTRY3","ITEM_ENTRY"],ie="DropNotifier.settings";function S(){return{master:!0,desktop:!0,sound:!0,nameFilter:"",tiers:{ultra:!0,rare:!0,uncommon:!0,common:!0,unknown:!0}}}r(S,"defaults");var d=null,l=null,p=null,B=!1,k=null,u=null,A=0,v=0,T=[],E=[],g=new Map;function I(){if(!p){try{p=X.get(ie,S(),1)}catch{return S()}re(p)}return p}r(I,"getSettings");function re(e){let n=S();for(let t of Object.keys(n))t!=="tiers"&&typeof e[t]>"u"&&(e[t]=n[t]);(!e.tiers||typeof e.tiers!="object")&&(e.tiers=n.tiers);for(let t of Object.keys(n.tiers))typeof e.tiers[t]>"u"&&(e.tiers[t]=n.tiers[t])}r(re,"normalizeSettings");function y(){try{p&&p.save&&p.save()}catch(e){console.warn("[DropNotifier] Preferences.save failed:",e)}}r(y,"saveSettings");function z(e){let n=e&&e.droppedBy;if(!Array.isArray(n)||!n.length)return"unknown";let t=0;for(let i of n)i&&typeof i.rate=="number"&&i.rate>t&&(t=i.rate);let o=t/100;return o<=.05?"ultra":o<=1?"rare":o<=10?"uncommon":"common"}r(z,"tierOf");function se(e,n){let t=String(n||"").split(",").map(i=>i.trim().toLowerCase()).filter(Boolean);if(!t.length)return!0;let o=String(e||"").toLowerCase();return t.some(i=>o.includes(i))}r(se,"passesNameFilter");function ae(e,n){return se(e.name,n.nameFilter)?!!n.tiers[z(e)]:!1}r(ae,"itemMatches");function O(e){try{h.addText(e,h.TYPE&&h.TYPE.ERROR||64)}catch{}}r(O,"chatErr");function ce(e){try{h.addText(e,h.TYPE&&h.TYPE.INFO||128)}catch{}}r(ce,"chatInfo");function de(){if(typeof Notification>"u"){O("[DropNotifier] Desktop notifications unavailable in this browser/context.");return}if(Notification.permission==="denied"){O("[DropNotifier] Desktop notifications are blocked \u2014 enable them in your browser settings.");return}if(Notification.permission!=="granted")try{let e=Notification.requestPermission();e&&typeof e.then=="function"&&e.then(n=>{n!=="granted"&&ce("[DropNotifier] Desktop permission not granted.")})}catch{}}r(de,"requestDesktopPermission");function H(e,n,t){if(!(typeof Notification>"u"||Notification.permission!=="granted"))try{new Notification(e,{body:n,tag:t})}catch{}}r(H,"notifyDesktop");function G(){if(u)return u;let e=window.AudioContext||window.webkitAudioContext;if(!e)return null;try{u=new e}catch{u=null}return u}r(G,"ensureAudioCtx");function V(){let e=G();if(e){e.state==="suspended"&&e.resume().catch(()=>{});try{let n=e.createGain();n.gain.value=.25,n.connect(e.destination);let t=e.createOscillator();t.type="square",t.frequency.value=880,t.connect(n);let o=e.currentTime;t.start(o),t.stop(o+.12)}catch{}}}r(V,"beep");function le(e,n){for(let[t,o]of e)o.expiry<=n&&e.delete(t)}r(le,"pruneExpired");function fe(e){let n=I();if(n.master===!1)return;let t=e&&e.ITAID,o=e&&e.ITID;if(t==null||o==null)return;let i=Date.now();le(g,i);let a=g.get(t);if(a&&a.itid===o||!B)return;let c=k.get(o)||{id:o,name:`Item #${o}`,droppedBy:[]};if(!ae(c,n))return;let s=z(c),f=e.count>0?e.count:1,m=`@ (${e.xPos}, ${e.yPos})`,b=`Drop: ${c.name}`,N=`${c.name} \xD7${f} \u2014 ${U[s]||s} ${m}`,j=`${t}|${o}`;n.desktop&&H(b,N,j),n.sound&&i-v>=q&&(v=i,V()),g.set(t,{itid:o,x:e.xPos,y:e.yPos,name:c.name,tier:s,qty:f,droppedAt:i,expiry:i+te})}r(fe,"handleFall");function ue(e,n){let t=null,o=null;try{J.forEach(i=>{if(!i||!i.position)return;let a=i.objecttype;if(!(a!==R&&a!==ne)&&!(typeof i.isDead=="function"&&i.isDead())&&!(Math.round(i.position[0])!==e||Math.round(i.position[1])!==n)){if(a===R)return o=i,!1;t||(t=i)}})}catch{}return o?{kind:"mob",entity:o}:t?{kind:"pc",entity:t}:null}r(ue,"findCellActor");function pe(e){let n=e&&e.ITAID;if(n==null)return;let t=g.get(n);if(!t)return;g.delete(n);let o=I();if(o.master===!1)return;let i=Date.now(),a=ue(t.x,t.y),c=`${t.name} \xD7${t.qty} \u2014 ${U[t.tier]||t.tier}`,s=`@ (${t.x}, ${t.y})`,f=i-t.droppedAt,m,b;if(a&&a.kind==="mob"){let N=a.entity.display&&a.entity.display.name||"A monster";m=`Looted: ${t.name}`,b=`\u{1F43E} ${N} looted ${c} ${s}`}else a&&a.kind==="pc"?(m=`Picked up: ${t.name}`,b=`${c} \u2014 picked up by a player ${s}`):f>=$-ee?(m=`Expired: ${t.name}`,b=`${c} \u2014 despawned (auto, ~${Math.round($/1e3)}s) ${s}`):(m=`Gone: ${t.name}`,b=`${c} \u2014 gone after ${Math.round(f/1e3)}s (taken or out of view) ${s}`);o.desktop&&H(m,b,`gone|${n}`),o.sound&&i-v>=q&&(v=i,V())}r(pe,"handleDisappear");function F(){let e=x&&x.ZC;if(e){for(let n of oe){let t=e[n];if(!t)continue;let o=C(t,fe);typeof o=="function"&&T.push(o)}if(e.ITEM_DISAPPEAR){let n=C(e.ITEM_DISAPPEAR,pe);typeof n=="function"&&T.push(n)}}}r(F,"hookPackets");var me=`
<div class="dn-panel">
  <div class="dn-titlebar">
    <span class="dn-title">Drop Notifier <span class="dn-ver">v${w.version}</span></span>
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
</div>`.trim(),be=`
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
`.trim();function he(){return document.querySelectorAll(".dn-panel").forEach(e=>e.remove()),d=new Z("DropNotifierPanel",me,be),d}r(he,"buildPanel");function _(e){let n=e.querySelector(".dn-warning");if(!n)return;let t=I();n.hidden=!(!t.desktop&&!t.sound)}r(_,"renderWarning");function ge(){let e=d&&d.ui&&d.ui[0];if(!e)return;let n=I();if(typeof d.draggable=="function"&&d.ui.find)try{d.draggable(d.ui.find(".dn-titlebar"))}catch{}let t=e.querySelector(".dn-close");t&&t.addEventListener("click",s=>{s.stopPropagation(),l&&l.hide()});let o=e.querySelector(".dn-master"),i=e.querySelector(".dn-desktop"),a=e.querySelector(".dn-sound");o&&(o.checked=!!n.master,o.addEventListener("change",()=>{n.master=o.checked,y()})),i&&(i.checked=!!n.desktop,i.addEventListener("change",()=>{n.desktop=i.checked,y(),i.checked&&de(),_(e)})),a&&(a.checked=!!n.sound,a.addEventListener("change",()=>{if(n.sound=a.checked,y(),a.checked){let s=G();s&&s.state==="suspended"&&s.resume().catch(()=>{})}_(e)}));let c=e.querySelector(".dn-name");c&&(c.value=n.nameFilter||"",c.addEventListener("input",()=>{let s=c.value;clearTimeout(A),A=setTimeout(()=>{n.nameFilter=s,y()},300)})),e.querySelectorAll(".dn-tier").forEach(s=>{let f=s.getAttribute("data-tier");s.checked=!!n.tiers[f],s.addEventListener("change",()=>{n.tiers[f]=s.checked,y()})}),_(e)}r(ge,"bindPanel");function Y(){P.add("dropnotifier","Toggle the Drop Notifier panel",function(){l&&(l.toggle(),this.addText(`[DropNotifier] ${l.isVisible()?"shown":"hidden"}`,this.TYPE.BLUE))},["dn"])}r(Y,"registerChatCommand");function ye(e,n){return console.log(`%c[RO][DropNotifier v${w.version}] loaded`,"color: #fc8; font-weight: bold"),k=n&&n.ItemDb||null,k?k.ready.then(()=>{B=!0}).catch(t=>{console.warn("[DropNotifier] item-db not ready:",t)}):console.warn("[DropNotifier] ItemDb plugin not loaded \u2014 drops are not notified"),x&&x.ZC&&x.ZC.ITEM_FALL_ENTRY?F():E.push(L(M.WIRE_COMPLETE,F)),l=D.registerPlayerWindow(()=>he(),{persistKey:"DropNotifier",defaultVisible:!0,onMount:r(()=>ge(),"onMount")}),P.$raw?Y():E.push(L(M.MAP_ENTER,Y)),Q(({reason:t})=>{for(console.log(`[RO][DropNotifier] cleanup reason=${t}`);T.length;)try{T.pop()()}catch{}for(;E.length;)try{E.pop()()}catch{}try{P.remove("dropnotifier")}catch{}if(g.clear(),clearTimeout(A),u){try{u.close()}catch{}u=null}try{D.purgeComponentCss("DropNotifierPanel")}catch{}try{l&&l.dispose&&l.dispose()}catch{}l=null,d=null,p=null}),!0}r(ye,"Init");var Ie={...w,init:ye};export{Ie as default};

var bt=Object.defineProperty;var r=(e,t)=>bt(e,"name",{value:t,configurable:!0});var W=[],E;function f(e){W.push(e),E&&e(E)}r(f,"register");function et(e){E=e||{};for(let t=0;t<W.length;t++)W[t](E)}r(et,"fillAll");var wt=r(e=>e&&new Proxy(e,{get:r((t,o)=>o==="$raw"?t:Reflect.get(t,o),"get")}),"__raw"),xt,vt,yt,St,Pt,Ct,T,kt,y,Et,Tt,Lt,Rt,_t,Mt,$t,Ht,Nt,u,Ot,At,It,j,S,Gt,Dt,Ut,Wt,jt,Bt,Kt,Yt,Ft,qt,zt,Vt,B,Zt,Jt;f(e=>{let t=e.libs&&e.libs["plugin-api"]||{};xt=t.AIDriver,vt=t.Action,yt=t.Altitude,St=t.BGM,Pt=t.Background,Ct=t.Camera,T=t.ChatBox,kt=t.Client,y=wt(t.Commands),Et=t.Configs,Tt=t.DB,Lt=t.EffectManager,Rt=t.EffectTable,_t=t.EntityManager,Mt=t.ItemInfo,$t=t.MapRenderer,Ht=t.MiniMap,Nt=t.Network,u=t.PACKET,Ot=t.PacketLength,At=t.PathFinding,It=t.PluginManager,j=t.Preferences,S=t.Session,Gt=t.ShortCut,Dt=t.SkillAction,Ut=t.SkillConst,Wt=t.SkillDescription,jt=t.SkillEffect,Bt=t.SkillInfo,Kt=t.SkillTargetSelection,Yt=t.SoundManager,Ft=t.Sprite,qt=t.StatusIcons,zt=t.StatusInfo,Vt=t.Texture,B=e.LegacyUIComponent,Zt=t.UIManager,Jt=t.WebGL});var Xt,L,Qt,te;f(e=>{let t=e.libs&&e.libs["packet-observer"]||{};Xt=t.default,L=t.observePacket,Qt=t.observePacketStatus,te=t.observeSendPacket});var R,ee,oe,ne,re,le,ae,ie,_,se;f(e=>{let t=e.libs&&e.libs["event-bus"]||{};R=t.EVENTS,ee=t.createBus,oe=t.default,ne=t.emit,re=t.getBus,le=t.off,ae=t.on,ie=t.onFirstListener,_=t.once,se=t.stats});var ce,de,ue,fe,ge,he,pe,me,be,we,K,xe,ve,ye,Se;f(e=>{let t=e.libs&&e.libs.lifecycle||{};ce=t.cleanupCount,de=t.createLifecycle,ue=t.default,fe=t.flushCleanup,ge=t.getCount,he=t.getLifecycle,pe=t.getState,me=t.hasReached,be=t.isWired,we=t.onInitCall,K=t.registerCleanup,xe=t.setCurrentPlugin,ve=t.setLogger,ye=t.stats,Se=t.transition});var Pe,Ce,ke,Ee,Te,Y,F,Le,Re;f(e=>{let t=e.libs&&e.libs.ui||{};Pe=t.default,Ce=t.find,ke=t.findAll,Ee=t.makeDraggable,Te=t.on,Y=t.purgeComponentCss,F=t.registerPlayerWindow,Le=t.registerWindow,Re=t.root});var v={name:"HomunGrowthLog",version:"1.0.0-a.1",description:"Records every homunculus level-up locally: the exact base-stat roll (hp/sp/str/agi/vit/int/dex/luk) read from the server's green 'Growth:' chat line, paired with the before/after ZC_PROPERTY_HOMUN snapshots so the derived-stat delta (atk, matk, hit, crit, def, mdef, flee) is captured too. Draggable panel with the per-level table + cumulative totals, Download JSON / Download CSV, and Clear. Passive: no packet is modified, nothing is sent to the server. Toggle with /homungrowth (alias /hgl).",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:[],pars:{maxRecords:500,pairWindowMs:5e3}};var P=["hp","sp","str","agi","vit","int","dex","luk"],M=[["atk","ATK"],["Matk","MATK"],["hit","HIT"],["critical","CRI"],["def","DEF"],["Mdef","MDEF"],["flee","FLEE"]],ot=["atk","Matk","hit","critical","def","Mdef","flee","maxHP","maxSP","ATKRange"],g=null,d=null,$=!1,H=null,$e=`
<div class="hgl-panel">
  <div class="hgl-titlebar">
    <span class="hgl-title">Homun Growth <span class="hgl-ver">v${v.version}</span></span>
    <button type="button" class="hgl-btn hgl-close" title="Close">x</button>
  </div>
  <div class="hgl-head">
    <select class="hgl-pick"></select>
    <span class="hgl-count"></span>
  </div>
  <div class="hgl-scroll">
    <table class="hgl-table">
      <thead>
        <tr>
          <th class="hgl-lv">Lv</th>
          <th>HP</th><th>SP</th>
          <th>STR</th><th>AGI</th><th>VIT</th><th>INT</th><th>DEX</th><th>LUK</th>
          ${M.map(([,e])=>`<th class="hgl-d">\u0394${e}</th>`).join("")}
        </tr>
      </thead>
      <tbody class="hgl-rows"></tbody>
      <tfoot>
        <tr class="hgl-totals"></tr>
      </tfoot>
    </table>
    <div class="hgl-empty" hidden>No level-up recorded yet.<br>The first row appears the next time your homunculus levels up.</div>
  </div>
  <div class="hgl-foot">
    <button type="button" class="hgl-action hgl-json">Download JSON</button>
    <button type="button" class="hgl-action hgl-csv">Download CSV</button>
    <button type="button" class="hgl-action hgl-clear">Clear</button>
  </div>
</div>`.trim(),He=`
.hgl-panel {
  position: absolute; top: 80px; left: 80px;
  width: 620px;
  background: rgba(20, 20, 24, 0.94);
  border: 1px solid #555; border-radius: 4px;
  font-family: Arial, sans-serif; font-size: 11px; color: #ddd;
  display: flex; flex-direction: column; user-select: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
}
.hgl-titlebar {
  background: linear-gradient(#3a3a44, #1e1e24);
  padding: 4px 8px; cursor: move; display: flex; align-items: center;
  border-bottom: 1px solid #555; flex: 0 0 auto;
}
.hgl-title { flex: 1; font-weight: bold; color: #fff; }
.hgl-ver { font-weight: normal; font-size: 9px; color: #888; margin-left: 4px; }
.hgl-btn {
  width: 18px; height: 18px; line-height: 1; text-align: center;
  padding: 0; margin-left: 4px; border-radius: 2px;
  background: rgba(80, 80, 90, 0.9); border: 1px solid #777;
  color: #ddd; font-family: inherit; font-size: 11px; font-weight: bold;
  cursor: pointer; user-select: none;
  transition: background 80ms, border-color 80ms;
}
.hgl-btn:hover { background: rgba(130, 130, 150, 0.95); border-color: #aac; color: #fff; }
.hgl-head {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 10px 4px; border-bottom: 1px solid #3a3a44;
}
.hgl-pick {
  background: rgba(0,0,0,0.4); border: 1px solid #555; border-radius: 2px;
  color: #fff; font-family: inherit; font-size: 11px; padding: 2px 4px;
}
.hgl-pick:focus { outline: none; border-color: #9cf; }
.hgl-count { color: #888; font-size: 10px; }
.hgl-scroll { max-height: 340px; overflow-y: auto; overflow-x: hidden; }
.hgl-table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.hgl-table th {
  position: sticky; top: 0; z-index: 1;
  background: #262630; color: #9cf;
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;
  padding: 4px 2px; text-align: right; border-bottom: 1px solid #444;
}
.hgl-table th.hgl-lv, .hgl-table td.hgl-lv { text-align: left; padding-left: 8px; }
.hgl-table th.hgl-d { color: #7a8; }
.hgl-table td { padding: 2px; text-align: right; border-bottom: 1px solid #2a2a32; }
.hgl-table tbody tr:hover { background: rgba(120, 140, 200, 0.12); }
.hgl-table td.hgl-d { color: #8b9; }
.hgl-zero { color: #4a4a52; }
.hgl-partial td { font-style: italic; color: #a98; }
.hgl-partial .hgl-lv::after { content: ' ?'; color: #c96; }
.hgl-totals td {
  border-top: 1px solid #555; border-bottom: none;
  font-weight: bold; color: #fff; padding: 4px 2px;
  position: sticky; bottom: 0; background: #262630;
}
.hgl-empty { padding: 24px 10px; text-align: center; color: #888; line-height: 1.6; }
.hgl-foot {
  display: flex; gap: 6px; padding: 6px 10px;
  border-top: 1px solid #3a3a44;
}
.hgl-action {
  padding: 3px 8px; border-radius: 2px;
  background: rgba(80, 80, 90, 0.9); border: 1px solid #777;
  color: #ddd; font-family: inherit; font-size: 11px; cursor: pointer;
  transition: background 80ms, border-color 80ms;
}
.hgl-action:hover { background: rgba(130, 130, 150, 0.95); border-color: #aac; color: #fff; }
.hgl-action:disabled { opacity: 0.4; cursor: default; }
.hgl-action.hgl-armed { background: rgba(140, 40, 40, 0.9); border-color: #d66; color: #fff; }
`.trim();function at(e){d=e}r(at,"initPanel");function it(){return document.querySelectorAll(".hgl-panel").forEach(e=>e.remove()),g=new B("HomunGrowthLogPanel",$e,He),g}r(it,"buildPanel");function z(){return g&&g.ui&&g.ui[0]}r(z,"el");function nt(e,t){return`<td class="${t}${e?"":" hgl-zero"}">${e||0}</td>`}r(nt,"cell");function Ne(e){let t=e.growth,o=e.delta||{},l=P.map(a=>nt(t?t[a]:0,"hgl-g")).join(""),n=M.map(([a])=>nt(o[a],"hgl-d")).join("");return`<tr class="${e.partial?"hgl-partial":""}"><td class="hgl-lv">${e.lv}</td>${l}${n}</tr>`}r(Ne,"rowHtml");function Oe(e){let t={};for(let n of e){let a=n.growth,i=n.delta;if(a)for(let s of P)t[s]=(t[s]||0)+(a[s]||0);if(i)for(let[s]of M)t[s]=(t[s]||0)+(i[s]||0)}let o=P.map(n=>`<td>+${t[n]||0}</td>`).join(""),l=M.map(([n])=>`<td>+${t[n]||0}</td>`).join("");return`<td class="hgl-lv">total</td>${o}${l}`}r(Oe,"totalsHtml");function b(){let e=z();if(!e||!d)return;let t=d.names(),o=d.selected(),l=e.querySelector(".hgl-pick");l&&(l.innerHTML=t.length?t.map(m=>`<option value="${m}"${m===o?" selected":""}>${m}</option>`).join(""):'<option value="">(no homunculus yet)</option>',l.disabled=t.length<2);let n=o?d.records(o):[],a=n.slice().reverse(),i=e.querySelector(".hgl-rows");i&&(i.innerHTML=a.map(Ne).join(""));let s=e.querySelector(".hgl-totals");s&&(s.innerHTML=n.length?Oe(n):"");let D=e.querySelector(".hgl-empty");D&&(D.hidden=n.length>0);let U=e.querySelector(".hgl-table");U&&(U.style.display=n.length?"":"none");let tt=e.querySelector(".hgl-count");if(tt){let m=n.length?n[0].lv:null,k=n.length?n[n.length-1].lv:null;tt.textContent=n.length?`${n.length} level-up${n.length>1?"s":""} recorded (Lv ${m} \u2192 ${k})`:""}for(let m of[".hgl-json",".hgl-csv",".hgl-clear"]){let k=e.querySelector(m);k&&(k.disabled=n.length===0)}q()}r(b,"render");function rt(){let e=new Date,t=r(o=>String(o).padStart(2,"0"),"p");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}-${t(e.getHours())}${t(e.getMinutes())}${t(e.getSeconds())}`}r(rt,"stamp");function lt(e,t,o){let l=URL.createObjectURL(new Blob([e],{type:t})),n=document.createElement("a");n.href=l,n.download=o,n.click(),URL.revokeObjectURL(l)}r(lt,"triggerDownload");function Ae(e,t){let l=[["datetime","homunculus","level",...P.map(n=>`growth_${n}`),...ot.map(n=>`delta_${n}`),"partial"].join(",")];for(let n of t){let a=n.growth||{},i=n.delta||{};l.push([new Date(n.ts).toISOString(),`"${String(e).replace(/"/g,'""')}"`,n.lv,...P.map(s=>n.growth?a[s]:""),...ot.map(s=>n.delta?i[s]||0:""),n.partial?"1":"0"].join(","))}return`${l.join(`
`)}
`}r(Ae,"csvOf");function q(){$=!1,clearTimeout(H);let e=z(),t=e&&e.querySelector(".hgl-clear");t&&(t.textContent="Clear",t.classList.remove("hgl-armed"))}r(q,"disarmClear");function st(){let e=z();if(!e||!d)return;if(typeof g.draggable=="function"&&g.ui.find)try{g.draggable(g.ui.find(".hgl-titlebar"))}catch{}let t=e.querySelector(".hgl-close");t&&t.addEventListener("click",i=>{i.stopPropagation(),d.close()});let o=e.querySelector(".hgl-pick");o&&o.addEventListener("change",()=>{d.select(o.value),b()});let l=e.querySelector(".hgl-json");l&&l.addEventListener("click",()=>{let i=d.selected();if(!i)return;let s={plugin:v.name,version:v.version,homunculus:i,exportedAt:new Date().toISOString(),records:d.records(i)};lt(JSON.stringify(s,null,"	"),"application/json",`homun-growth-${i}-${rt()}.json`)});let n=e.querySelector(".hgl-csv");n&&n.addEventListener("click",()=>{let i=d.selected();i&&lt(Ae(i,d.records(i)),"text/csv",`homun-growth-${i}-${rt()}.csv`)});let a=e.querySelector(".hgl-clear");a&&a.addEventListener("click",()=>{if(!$){$=!0,a.textContent="Confirm?",a.classList.add("hgl-armed"),H=setTimeout(q,3e3);return}q();let i=d.selected();i&&d.clear(i),b()}),b()}r(st,"bindPanel");function ct(){clearTimeout(H),H=null,$=!1,g=null,d=null}r(ct,"disposePanel");var Ie="1.0.0-a.1",Ge="HomunGrowthLog.data",De=1,Ue=/^Growth:\s*hp:(-?\d+)\s+sp:(-?\d+)\s+str\(([\d.]+)\)\s+agi\(([\d.]+)\)\s+vit\(([\d.]+)\)\s+int\(([\d.]+)\)\s+dex\(([\d.]+)\)\s+luk\(([\d.]+)\)/,ht=["atk","Matk","hit","critical","def","Mdef","flee","maxHP","maxSP","ATKRange"],We=["PROPERTY_HOMUN","PROPERTY_HOMUN2","PROPERTY_HOMUN3","PROPERTY_HOMUN4","PROPERTY_HOMUN5"],p=null,x="",h=null,O=null,w=null,C=null,c=null,Z=500,X=5e3,A=[],N=[];function dt(){return{version:1,homun:{}}}r(dt,"defaults");function G(){if(!p){try{p=j.get(Ge,dt(),De)}catch{return dt()}(!p.homun||typeof p.homun!="object")&&(p.homun={})}return p}r(G,"getData");function J(){try{p&&p.save&&p.save()}catch(e){console.warn("[HomunGrowthLog] save failed:",e)}}r(J,"save");function je(e){let t=G(),o=t.homun[e];return o||(o={charName:pt(),records:[]},t.homun[e]=o),Array.isArray(o.records)||(o.records=[]),o}r(je,"entryFor");function pt(){try{return S.Entity&&S.Entity.display&&S.Entity.display.name||""}catch{return""}}r(pt,"currentCharName");function ut(){let e=G(),t=[];for(let o in e.homun)t.push(o);return t}r(ut,"homunNames");function V(e){let o=G().homun[e];return o&&o.records||[]}r(V,"recordsOf");function Be(e){let t=G();t.homun[e]&&(t.homun[e].records=[]),J()}r(Be,"clearRecords");function Ke(e){let t=Ue.exec(e);return t?{hp:+t[1],sp:+t[2],str:+t[3],agi:+t[4],vit:+t[5],int:+t[6],dex:+t[7],luk:+t[8]}:null}r(Ke,"parseGrowth");function Ye(e){let t={};for(let o of ht)t[o]=e[o];return t}r(Ye,"snapshot");function Fe(e,t){if(!e||!t)return null;let o={};for(let l of ht){let n=(t[l]||0)-(e[l]||0);n&&(o[l]=n)}return o}r(Fe,"diff");function mt(e){c={lv:e.lv,ts:Date.now(),before:null,after:null,growth:null,timer:null,...e},c.timer=setTimeout(()=>{I()},X)}r(mt,"openPending");function I(){if(!c)return;let e=c;if(c=null,clearTimeout(e.timer),e.lv==null)return;let t=O||"unknown",o=je(t),l=Fe(e.before,e.after),n={lv:e.lv,ts:e.ts,growth:e.growth,before:e.before,after:e.after,delta:l};(!e.growth||!l)&&(n.partial=!0),o.charName=pt()||o.charName;let a=o.records[o.records.length-1];if(a&&a.lv===n.lv&&a.partial&&n.ts-a.ts<X*2){a.growth||(a.growth=n.growth),a.delta||(a.before=n.before,a.after=n.after,a.delta=n.delta),a.growth&&a.delta&&delete a.partial,J(),b();return}o.records.push(n),o.records.length>Z&&o.records.splice(0,o.records.length-Z),J(),x||(x=t),console.log(`[RO][HomunGrowthLog] ${t} reached Lv ${e.lv}`,n.growth||"(no growth line)"),b()}r(I,"commitPending");function qe(e){let t=e.szName,o=e.nLevel;if(typeof o!="number")return;let l=Ye(e);if(t!==O){O=t,w=o,C=l,x||(x=t,b());return}w!=null&&o>w&&(c&&c.lv===o&&c.after==null?(c.before=C,c.after=l,I()):(c&&I(),mt({lv:o,before:C,after:l}))),w=o,C=l}r(qe,"onProperty");function ze(e){let t=e&&e.msg;if(typeof t!="string"||t.charCodeAt(0)!==71)return;let o=Ke(t);if(o){if(c&&c.growth==null){c.growth=o,I();return}mt({lv:w==null?null:w+1,growth:o})}}r(ze,"onNpcChat");function ft(){let e=0;for(let o of We){let l=u&&u.ZC&&u.ZC[o];if(!l)continue;let n=L(l,qe);typeof n=="function"&&(A.push(n),e++)}let t=u&&u.ZC&&u.ZC.NPC_CHAT;if(t){let o=L(t,ze);typeof o=="function"&&A.push(o)}console.log(`[RO][HomunGrowthLog] hooked ${e} PROPERTY_HOMUN variant(s)${t?" + NPC_CHAT":" \u2014 NPC_CHAT MISSING"}`)}r(ft,"hookPackets");function gt(){y.add("homungrowth","Toggle the Homunculus Growth log panel",function(){h&&(h.toggle(),this.addText(`[HomunGrowthLog] ${h.isVisible()?"shown":"hidden"}`,this.TYPE.BLUE))},["hgl"])}r(gt,"registerChatCommand");function Ve(e){console.log(`%c[RO][HomunGrowthLog v${Ie}] loaded`,"color: #9cf; font-weight: bold"),e&&Number.isFinite(e.maxRecords)&&e.maxRecords>0&&(Z=e.maxRecords),e&&Number.isFinite(e.pairWindowMs)&&e.pairWindowMs>0&&(X=e.pairWindowMs);let t=ut();t.length&&(x=t.reduce((o,l)=>V(l).length>V(o).length?l:o,t[0])),at({names:ut,records:V,selected:r(()=>x,"selected"),select:r(o=>{x=o},"select"),clear:Be,close:r(()=>{h&&h.hide()},"close")}),u&&u.ZC&&u.ZC.NPC_CHAT?ft():N.push(_(R.WIRE_COMPLETE,ft)),h=F(()=>it(),{persistKey:"HomunGrowthLog",defaultVisible:!1,onMount:r(()=>st(),"onMount")}),y.$raw?gt():N.push(_(R.MAP_ENTER,gt)),K(({reason:o})=>{for(console.log(`[RO][HomunGrowthLog] cleanup reason=${o}`);A.length;)try{A.pop()()}catch{}for(;N.length;)try{N.pop()()}catch{}c&&(clearTimeout(c.timer),c=null);try{y.remove("homungrowth")}catch{}try{Y("HomunGrowthLogPanel")}catch{}try{h&&h.dispose&&h.dispose()}catch{}ct(),h=null,p=null,O=null,w=null,C=null});try{T.addText("[HomunGrowthLog] ready \u2014 /homungrowth (or /hgl) to open",T.TYPE.BLUE)}catch{}return!0}r(Ve,"Init");var Q={...v,init:Ve};var _o={...Q,init(e,t){return et(t),Q.init.call(this,e,t)}};export{_o as default};

var Ft=Object.defineProperty;var n=(e,t)=>Ft(e,"name",{value:t,configurable:!0});var rt=[],Y;function k(e){rt.push(e),Y&&e(Y)}n(k,"register");function kt(e){Y=e||{};for(let t=0;t<rt.length;t++)rt[t](Y)}n(kt,"fillAll");var Kt=n(e=>e&&new Proxy(e,{get:n((t,r)=>r==="$raw"?t:Reflect.get(t,r),"get")}),"__raw"),Yt,Gt,Vt,zt,Jt,Wt,G,Zt,j,Qt,it,te,ee,at,ne,V,se,oe,T,re,ie,ae,lt,O,le,ce,ue,pe,fe,de,xe,ge,me,be,he,ve,B,Se,ye;k(e=>{let t=e.libs&&e.libs["plugin-api"]||{};Yt=t.AIDriver,Gt=t.Action,Vt=t.Altitude,zt=t.BGM,Jt=t.Background,Wt=t.Camera,G=t.ChatBox,Zt=t.Client,j=Kt(t.Commands),Qt=t.Configs,it=t.DB,te=t.EffectManager,ee=t.EffectTable,at=t.EntityManager,ne=t.ItemInfo,V=t.MapRenderer,se=t.MiniMap,oe=t.Network,T=t.PACKET,re=t.PacketLength,ie=t.PathFinding,ae=t.PluginManager,lt=t.Preferences,O=t.Session,le=t.ShortCut,ce=t.SkillAction,ue=t.SkillConst,pe=t.SkillDescription,fe=t.SkillEffect,de=t.SkillInfo,xe=t.SkillTargetSelection,ge=t.SoundManager,me=t.Sprite,be=t.StatusIcons,he=t.StatusInfo,ve=t.Texture,B=e.LegacyUIComponent,Se=t.UIManager,ye=t.WebGL});var X,ke,we,_e,Ce,Ee,ct,Pe,z,Ie;k(e=>{let t=e.libs&&e.libs["event-bus"]||{};X=t.EVENTS,ke=t.createBus,we=t.default,_e=t.emit,Ce=t.getBus,Ee=t.off,ct=t.on,Pe=t.onFirstListener,z=t.once,Ie=t.stats});var Me,Te,Le,Ae,Ne,$e,Re,De,je,Oe,ut,Be,Xe,Ue,He;k(e=>{let t=e.libs&&e.libs.lifecycle||{};Me=t.cleanupCount,Te=t.createLifecycle,Le=t.default,Ae=t.flushCleanup,Ne=t.getCount,$e=t.getLifecycle,Re=t.getState,De=t.hasReached,je=t.isWired,Oe=t.onInitCall,ut=t.registerCleanup,Be=t.setCurrentPlugin,Xe=t.setLogger,Ue=t.stats,He=t.transition});var qe,pt,Fe;k(e=>{let t=e.libs&&e.libs["dev-log"]||{};qe=t.default,pt=t.devLog,Fe=t.devLogStatus});function wt(e,t){if(!e||typeof e.now!="function")throw new Error("[kill-tracker] required port missing: now");if(typeof e.self!="function")throw new Error("[kill-tracker] required port missing: self");let r=e.now,s=e.self,i=e.entities&&e.entities.get||(()=>null),c=t&&t.ttlMs||8e3,l={},g=0,b={};function d(u){if(!u)return!1;let f=s()||{};return u===f.gid||u===f.aid||u===f.sessionAid}n(d,"isMe");function v(u){if(!u)return!1;if(d(u))return!0;let f=s()||{};return u===f.homunId||u===f.mercId}n(v,"isMine");function S(u){let f={},y=0;for(let P in l)u-l[P].t<=c&&(f[P]=l[P],y++);l=f,g=y}n(S,"sweep");function w(u){return u?{job:u.job||null,name:u.display&&u.display.name||null,objecttype:u.objecttype||null}:null}n(w,"identity");function $(u){let f=r(),y=l[u];if(y){y.t=f,y.who||(y.who=w(i(u)));return}g++,l[u]={t:f,who:w(i(u))},g>256&&S(f)}n($,"stamp");function R(u,f){f&&v(u)&&$(f)}n(R,"noteHit");function nt(u,f){f&&(v(u)||b[u])&&$(f)}n(nt,"noteSkillHit");function q(u,f){f&&v(u)&&(b[f]=!0)}n(q,"noteSkillUnit");function F(u){delete b[u]}n(F,"forgetSkillUnit");function st(u,f){if(f!==1)return null;let y=l[u];if(y===void 0||(delete l[u],g--,r()-y.t>c))return null;let P=w(i(u))||y.who||{job:null,name:null,objecttype:null};return{gid:u,job:P.job,name:P.name,objecttype:P.objecttype}}n(st,"onVanish");function K(){l={},g=0,b={}}return n(K,"reset"),{isMe:d,isMine:v,noteHit:R,noteSkillHit:nt,noteSkillUnit:q,forgetSkillUnit:F,onVanish:st,reset:K}}n(wt,"createKillTracker");var U={name:"XpSessions",version:"0.1.0-a.1",description:"XP Sessions \u2014 base and job XP per hour, kills per hour and duration, per hunting session. Start / Stop, or let it stop by itself after a few minutes without XP or kill (the session then ends on its last gain). On Stop the name field takes the focus, pre-filled with a name read off the hunt: the mob (one mob \u2265 95 % of the kills), else the map, else the dungeon, else \xAB Mixte <date> \xBB. A typed name is kept, an auto one follows the rules. History with CSV export and a two-click Clear. Passive: nothing is sent to the server. Toggle with /xpsessions (alias /xps); /xps start, /xps stop.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:[]};var ft=n(()=>{},"noop");function _t(e){let t=[];function r(l){return t.push(l),()=>{let g=t.indexOf(l);g!==-1&&t.splice(g,1)}}n(r,"subscribe");function s(l,g){for(let b of t.slice())try{b(l,g)}catch(d){console.error(`[plugin-core ${l}]`,d)}}n(s,"dispatch");function i(l){s("change",l)}n(i,"emitChange");function c(l){s("tick",l)}return n(c,"emitTick"),{ports:e||{},subscribe:r,emitChange:i,emitTick:c}}n(_t,"createCore");function Pt(e){let t=Number(e.amount)||0,r=Number(e.amount2)||0;return r===0?t:(t>>>0)+r*4294967296}n(Pt,"expAmount");function J(e,t){return t>0?e*36e5/t:0}n(J,"perHour");var Ye=[["gl_","glast"],["glast_","glast"],["c_tower","clocktower"],["alde_dun","clocktower"],["tha_t","thanatos"],["thana_","thanatos"],["juperos_","juperos"],["jupe_","juperos"]],Ct={glast:"Glast Heim",clocktower:"Clock Tower",thanatos:"Thanatos Tower",juperos:"Juperos",gef_dun:"Geffen Dungeon",beach_dun:"Comodo Caves",mosk_dun:"Moscovia Dungeon",gon_dun:"Kunlun Dungeon",lou_dun:"Royal Tomb",ama_dun:"Amatsu Dungeon",ayo_dun:"Ayothaya Dungeon",um_dun:"Umbala Dungeon",tur_dun:"Turtle Island",xmas_dun:"Toy Factory"},Ge=/fild$|^mjolnir$/;function Et(e){if(!e)return null;for(let[r,s]of Ye)if(e.indexOf(r)===0)return s;let t=e.replace(/\d+$/,"").replace(/_$/,"");return!t||Ge.test(t)?null:t}n(Et,"dungeonKey");function Ve(e){return e.replace(/\s+(?:[FB]\d+|\d+(?:st|nd|rd|th) Basement)$/i,"").trim()}n(Ve,"stripFloor");function ze(e,t,r){if(Ct[e])return Ct[e];let s=null;for(let i of t){let c=r(i);if(!c)return e;let l=Ve(c);if(s===null)s=l;else if(s!==l)return e}return s||e}n(ze,"dungeonName");function Je(e){let t=new Date(e),r=n(s=>String(s).padStart(2,"0"),"p");return`${r(t.getDate())}/${r(t.getMonth()+1)}/${t.getFullYear()} ${r(t.getHours())}:${r(t.getMinutes())}`}n(Je,"formatDate");function W(e,t){let r=0,s=null;for(let c in e.kills){let l=e.kills[c];r+=l.n,(!s||l.n>s.n)&&(s=l)}if(s&&s.n*100>=95*r)return s.name;let i=[];for(let c in e.maps)i.push(c);if(i.length===1)return t(i[0])||i[0];if(i.length>1){let c=Et(i[0]),l=!!c;for(let g=1;l&&g<i.length;g++)l=Et(i[g])===c;if(l)return ze(c,i,t)}return`Mixte ${Je(e.start)}`}n(W,"autoName");function We(e){let t=String(e);return/[",\n]/.test(t)?`"${t.replace(/"/g,'""')}"`:t}n(We,"csvCell");function It(e){let r=[["name","auto_name","start","end","duration_s","base_exp","job_exp","quest_base_exp","quest_job_exp","kills","base_exp_per_h","job_exp_per_h","kills_per_h"].join(",")];for(let s of e)r.push([We(s.name),s.auto?"1":"0",new Date(s.start).toISOString(),new Date(s.end).toISOString(),Math.round(s.durationMs/1e3),s.base,s.job,s.questBase,s.questJob,s.kills,Math.round(s.baseRate),Math.round(s.jobRate),Math.round(s.killRate)].join(","));return`${r.join(`
`)}
`}n(It,"csvOf");var en=5,nn=2e3;function Mt(e){for(let o of["now","prefs","kills"])if(!e||!e[o])throw new Error(`[XpSessions] required port missing: ${o}`);let t=_t(e),{now:r,prefs:s,kills:i}=e,c=e.map&&e.map.current||(()=>null),l=e.mapName||(()=>null),g=e.timers||null,b=e.say||ft,d=e.log||ft,v=null;function S(){let o=s.get();return Array.isArray(o.sessions)||(o.sessions=[]),o.current===void 0&&(o.current=null),o.idleMin>0||(o.idleMin=en),o}n(S,"store");function w(){v!==null&&g&&g.clear(v),v=null,s.save()}n(w,"saveNow");function $(){if(!g){s.save();return}v===null&&(v=g.set(()=>{v=null,s.save()},nn))}n($,"saveSoon");function R(o){return l(o)||null}n(R,"mapName");function nt(o){return o.name||W(o,R)}n(nt,"nameOf");function q(o){let p=0;for(let a in o.kills)p+=o.kills[a].n;return p}n(q,"killCount");function F(o){o.lastGain=r();let p=c();p&&(o.maps[p]=(o.maps[p]||0)+1)}n(F,"noteGain");function st(){let o=S();if(o.current)return;let p=r();o.current={start:p,end:null,lastGain:p,base:0,job:0,questBase:0,questJob:0,kills:{},maps:{},name:null,stopReason:null},w(),t.emitChange({started:p})}n(st,"start");function K(o){let p=S(),a=p.current;if(!a)return null;p.current=null;let m=o==="idle"?"idle":"manual";if(a.base+a.job+a.questBase+a.questJob===0&&q(a)===0)return w(),b("[XP Sessions] session stopped \u2014 nothing gained, not kept"),t.emitChange({dropped:a.start}),null;a.end=m==="idle"?a.lastGain:r(),a.stopReason=m,p.sessions.push(a),w();let _=ot(a);return b(`[XP Sessions] ${m==="idle"?"auto-stopped (idle)":"stopped"}: ${_.name} \u2014 ${_.kills} kills, ${Math.round(_.baseRate)} base XP/h`),d("stop",_),t.emitChange({stopped:a.start,reason:m}),a.start}n(K,"stop");function u(o,p){let a=S().sessions.find(D=>D.start===o);if(!a)return;let m=String(p||"").trim(),_=!m||m===W(a,R)?null:m;_!==a.name&&(a.name=_,w(),t.emitChange({renamed:o}))}n(u,"rename");function f(){S().sessions=[],w(),t.emitChange({cleared:!0})}n(f,"clearHistory");function y(o){let p=Number(o);p>0&&(S().idleMin=p,w(),t.emitChange({idleMin:p}))}n(y,"setIdleMin");function P(o){let p=S().current;if(!p||!i.isMe(o.AID))return;let a=Pt(o);if(!(a>0))return;let m=o.expType===1;if(o.varID===1)m?p.questBase+=a:p.base+=a;else if(o.varID===2)m?p.questJob+=a:p.job+=a;else return;F(p),$(),t.emitTick()}n(P,"onExp");function Ot(o,p){let a=i.onVanish(o,p),m=S().current;if(!a||!m||a.objecttype!==null&&a.objecttype!==5)return;let _=a.job===null?"?":String(a.job),D=m.kills[_]||(m.kills[_]={name:a.name||(a.job===null?"Unknown":`#${a.job}`),n:0});a.name&&D.name!==a.name&&(D.name=a.name),D.n++,F(m),$(),t.emitChange({kill:_})}n(Ot,"onVanish");function Bt(){let o=S(),p=o.current;if(p){if(r()-p.lastGain>=o.idleMin*6e4){K("idle");return}t.emitTick()}}n(Bt,"heartbeat");function ot(o){let p=o.end===null?r():o.end,a=Math.max(0,p-o.start),m=q(o);return{id:o.start,name:nt(o),auto:!o.name,autoName:W(o,R),start:o.start,end:p,durationMs:a,base:o.base,job:o.job,questBase:o.questBase,questJob:o.questJob,kills:m,baseRate:J(o.base,a),jobRate:J(o.job,a),killRate:J(m,a),stopReason:o.stopReason}}n(ot,"rowOf");function Xt(){let o=S().current;return o?ot(o):null}n(Xt,"live");function Ut(){let o=[],p=S().sessions;for(let a=p.length-1;a>=0;a--)o.push(ot(p[a]));return o}n(Ut,"history");function Ht(){return S().idleMin}n(Ht,"idleMin");function qt(){v!==null&&w()}return n(qt,"flush"),{subscribe:t.subscribe,start:st,stop:K,rename:u,clearHistory:f,setIdleMin:y,onExp:P,onVanish:Ot,heartbeat:Bt,live:Xt,history:Ut,idleMin:Ht,flush:qt}}n(Mt,"createXpSessionsCore");var sn,dt,on,rn;k(e=>{let t=e.libs&&e.libs["packet-observer"]||{};sn=t.default,dt=t.observePacket,on=t.observePacketStatus,rn=t.observeSendPacket});function Tt(e,t){let r=[],s=T&&T.ZC;if(!s)return r;let i=n((d,v)=>{d&&r.push(dt(d,v))},"add"),c=n(d=>e.onExp(d),"onExp");i(s.NOTIFY_EXP,c),i(s.NOTIFY_EXP2,c);let l=n(d=>t.noteHit(d.GID,d.targetGID),"onAct");i(s.NOTIFY_ACT,l),i(s.NOTIFY_ACT2,l),i(s.NOTIFY_ACT3,l);let g=n(d=>t.noteSkillHit(d.AID,d.targetID),"onSkill");i(s.NOTIFY_SKILL,g),i(s.NOTIFY_SKILL2,g),i(s.NOTIFY_SKILL_POSITION,g);let b=n(d=>t.noteSkillUnit(d.creatorAID,d.AID),"onUnit");return i(s.SKILL_ENTRY,b),i(s.SKILL_ENTRY2,b),i(s.SKILL_ENTRY3,b),i(s.SKILL_ENTRY4,b),i(s.SKILL_ENTRY5,b),i(s.SKILL_DISAPPEAR,d=>t.forgetSkillUnit(d.AID)),i(s.NOTIFY_VANISH,d=>e.onVanish(d.GID,d.type)),r}n(Tt,"hookXpPackets");var an,ln,cn,un,pn,xt,gt,fn,dn;k(e=>{let t=e.libs&&e.libs.ui||{};an=t.default,ln=t.find,cn=t.findAll,un=t.makeDraggable,pn=t.on,xt=t.purgeComponentCss,gt=t.registerPlayerWindow,fn=t.registerWindow,dn=t.root});var gn=`
<div class="xps-panel">
  <div class="xps-titlebar">
    <span class="xps-title">XP Sessions <span class="xps-ver">v${U.version}</span></span>
    <button type="button" class="xps-btn xps-close" title="Close">\u2715</button>
  </div>
  <div class="xps-live">
    <button type="button" class="xps-action xps-toggle">Start</button>
    <span class="xps-state">Stopped</span>
    <span class="xps-dur"></span>
  </div>
  <div class="xps-stats">
    <div class="xps-stat"><span class="xps-k">Base XP/h</span><span class="xps-v xps-base-rate">\u2013</span></div>
    <div class="xps-stat"><span class="xps-k">Job XP/h</span><span class="xps-v xps-job-rate">\u2013</span></div>
    <div class="xps-stat"><span class="xps-k">Kills/h</span><span class="xps-v xps-kill-rate">\u2013</span></div>
    <div class="xps-stat"><span class="xps-k">Kills</span><span class="xps-v xps-kills">\u2013</span></div>
  </div>
  <div class="xps-totals"></div>
  <div class="xps-name-row">
    <span class="xps-k">Name</span>
    <input type="text" class="xps-name" maxlength="60" spellcheck="false" disabled>
    <span class="xps-auto-tag" hidden>auto</span>
  </div>
  <div class="xps-scroll">
    <table class="xps-table">
      <thead>
        <tr><th class="xps-l">Name</th><th>Duration</th><th>Base/h</th><th>Job/h</th><th>Kills/h</th></tr>
      </thead>
      <tbody class="xps-rows"></tbody>
    </table>
    <div class="xps-empty">No session yet \u2014 press Start, hunt, then Stop.<br>A session also stops by itself when nothing is gained for a while.</div>
  </div>
  <div class="xps-foot">
    <label class="xps-idle-label">Auto-stop after <input type="number" class="xps-idle" min="1" max="120" step="1"> min without XP or kill</label>
    <span class="xps-spacer"></span>
    <button type="button" class="xps-action xps-csv">Download CSV</button>
    <button type="button" class="xps-action xps-clear">Clear</button>
  </div>
</div>`.trim(),mn=`
.xps-panel {
  position: absolute; top: 90px; left: 90px; width: 440px;
  background: rgba(20, 20, 24, 0.94);
  border: 1px solid #555; border-radius: 4px;
  font-family: Arial, sans-serif; font-size: 11px; color: #ddd;
  display: flex; flex-direction: column; user-select: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
}
.xps-titlebar {
  background: linear-gradient(#3a3a44, #1e1e24);
  padding: 4px 8px; cursor: move; display: flex; align-items: center;
  border-bottom: 1px solid #555;
}
.xps-title { flex: 1; font-weight: bold; color: #fff; }
.xps-ver { font-weight: normal; font-size: 9px; color: #888; margin-left: 4px; }
.xps-btn {
  width: 18px; height: 18px; line-height: 1; text-align: center; padding: 0;
  border-radius: 2px; background: rgba(80, 80, 90, 0.9); border: 1px solid #777;
  color: #ddd; font-family: inherit; font-size: 11px; cursor: pointer;
}
.xps-btn:hover { background: rgba(130, 130, 150, 0.95); color: #fff; }
.xps-live { display: flex; align-items: center; gap: 8px; padding: 8px 10px 4px; }
.xps-state { color: #888; }
.xps-state.xps-on { color: #8c8; font-weight: bold; }
.xps-dur { margin-left: auto; font-variant-numeric: tabular-nums; color: #fff; font-size: 13px; }
.xps-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 4px 10px; }
.xps-stat { background: rgba(255,255,255,0.04); border: 1px solid #333; border-radius: 3px; padding: 4px 6px; }
.xps-k { display: block; color: #9cf; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px; }
.xps-name-row .xps-k { display: inline; }
.xps-v { display: block; color: #fff; font-size: 13px; font-variant-numeric: tabular-nums; margin-top: 2px; }
.xps-totals { padding: 2px 10px 6px; color: #888; font-size: 10px; font-variant-numeric: tabular-nums; }
.xps-name-row {
  display: flex; align-items: center; gap: 6px; padding: 6px 10px;
  border-top: 1px solid #3a3a44; border-bottom: 1px solid #3a3a44;
}
.xps-name {
  flex: 1; background: rgba(0,0,0,0.4); border: 1px solid #555; border-radius: 2px;
  color: #fff; font-family: inherit; font-size: 11px; padding: 3px 5px; user-select: text;
}
.xps-name:focus { outline: none; border-color: #9cf; }
.xps-name:disabled { opacity: 0.5; }
.xps-auto-tag { color: #888; font-style: italic; font-size: 10px; }
.xps-scroll { max-height: 220px; overflow-y: auto; }
.xps-table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.xps-table th {
  position: sticky; top: 0; background: #262630; color: #9cf;
  font-size: 9px; text-transform: uppercase; padding: 4px; text-align: right; border-bottom: 1px solid #444;
}
.xps-table td { padding: 3px 4px; text-align: right; border-bottom: 1px solid #2a2a32; }
.xps-table .xps-l { text-align: left; }
.xps-table tbody tr { cursor: pointer; }
.xps-table tbody tr:hover { background: rgba(120, 140, 200, 0.12); }
.xps-table tr.xps-sel { background: rgba(120, 160, 220, 0.22); }
.xps-table td.xps-auto { font-style: italic; color: #bbb; }
.xps-empty { padding: 18px 10px; text-align: center; color: #888; line-height: 1.6; }
.xps-foot { display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-top: 1px solid #3a3a44; }
.xps-idle-label { color: #aaa; font-size: 10px; }
.xps-idle {
  width: 36px; background: rgba(0,0,0,0.4); border: 1px solid #555; border-radius: 2px;
  color: #fff; font-family: inherit; font-size: 11px; padding: 1px 3px;
}
.xps-spacer { flex: 1; }
.xps-action {
  padding: 3px 8px; border-radius: 2px; background: rgba(80, 80, 90, 0.9); border: 1px solid #777;
  color: #ddd; font-family: inherit; font-size: 11px; cursor: pointer;
}
.xps-action:hover { background: rgba(130, 130, 150, 0.95); color: #fff; }
.xps-action:disabled { opacity: 0.4; cursor: default; }
.xps-action.xps-armed { background: rgba(140, 40, 40, 0.9); border-color: #d66; color: #fff; }
.xps-toggle.xps-on { background: rgba(140, 60, 40, 0.9); border-color: #c86; color: #fff; }
`.trim(),h=null,L=null,E=null,Z=null,I=null,Q=!1,bt=null;function C(e){return Math.round(e).toLocaleString("en-US")}n(C,"num");function At(e){let t=Math.floor(e/1e3),r=n(s=>String(s).padStart(2,"0"),"p");return`${Math.floor(t/3600)}:${r(Math.floor(t/60)%60)}:${r(t%60)}`}n(At,"dur");function bn(e){return String(e).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}n(bn,"esc");function et(){return L&&L.ui&&L.ui[0]}n(et,"root");function x(e){let t=et();return t?t.querySelector(e):null}n(x,"q");function mt(e){return e.find(t=>t.id===I)||null}n(mt,"selectedRow");function Nt(){if(!et())return;let e=h.live(),t=x(".xps-toggle");t.textContent=e?"Stop":"Start",t.classList.toggle("xps-on",!!e);let r=x(".xps-state");r.textContent=e?"Running":"Stopped",r.classList.toggle("xps-on",!!e),x(".xps-dur").textContent=e?At(e.durationMs):"",x(".xps-base-rate").textContent=e?C(e.baseRate):"\u2013",x(".xps-job-rate").textContent=e?C(e.jobRate):"\u2013",x(".xps-kill-rate").textContent=e?C(e.killRate):"\u2013",x(".xps-kills").textContent=e?C(e.kills):"\u2013",x(".xps-totals").textContent=e?`Base ${C(e.base)} \xB7 Job ${C(e.job)} \xB7 Quest ${C(e.questBase)} / ${C(e.questJob)} (not in the rates) \xB7 ${e.name}`:""}n(Nt,"patchLive");function tt(){if(!et())return;Nt();let e=h.history();(I===null||!mt(e))&&(I=e.length?e[0].id:null),x(".xps-rows").innerHTML=e.map(i=>`
		<tr data-id="${i.id}" class="${i.id===I?"xps-sel":""}">
			<td class="xps-l${i.auto?" xps-auto":""}">${bn(i.name)}</td>
			<td>${At(i.durationMs)}</td>
			<td>${C(i.baseRate)}</td>
			<td>${C(i.jobRate)}</td>
			<td>${C(i.killRate)}</td>
		</tr>`).join(""),x(".xps-table").style.display=e.length?"":"none",x(".xps-empty").hidden=e.length>0;let t=mt(e),r=x(".xps-name");r.disabled=!t,document.activeElement!==r&&(r.value=t?t.name:""),r.placeholder=t?t.autoName:"",x(".xps-auto-tag").hidden=!(t&&t.auto);let s=x(".xps-idle");document.activeElement!==s&&(s.value=String(h.idleMin())),x(".xps-csv").disabled=e.length===0,x(".xps-clear").disabled=e.length===0}n(tt,"render");function hn(e,t){I=e,E&&!E.isVisible()&&E.show(),tt();let r=x(".xps-name");if(!r)return;let s=document.activeElement&&/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);!t&&s||(r.focus(),r.select())}n(hn,"focusName");function vn(e,t){if(e==="tick"){Nt();return}if(t&&t.stopped){hn(t.stopped,t.reason==="manual");return}tt()}n(vn,"onCore");function Sn(){let e=new Date,t=n(r=>String(r).padStart(2,"0"),"p");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}-${t(e.getHours())}${t(e.getMinutes())}`}n(Sn,"stamp");function yn(e,t){let r=URL.createObjectURL(new Blob([e],{type:"text/csv"})),s=document.createElement("a");s.href=r,s.download=t,s.click(),URL.revokeObjectURL(r)}n(yn,"download");function Lt(){Q=!1,clearTimeout(bt);let e=x(".xps-clear");e&&(e.textContent="Clear",e.classList.remove("xps-armed"))}n(Lt,"disarmClear");function kn(e){if(L=e,!et())return;try{L.draggable(L.ui.find(".xps-titlebar"))}catch(c){}x(".xps-close").addEventListener("click",c=>{c.stopPropagation(),E.hide()}),x(".xps-toggle").addEventListener("click",()=>{h.live()?h.stop("manual"):h.start()});let r=x(".xps-name");r.addEventListener("keydown",c=>{if(c.stopPropagation(),c.key==="Enter")r.blur();else if(c.key==="Escape"){let l=mt(h.history());r.value=l?l.name:"",r.blur()}}),r.addEventListener("keyup",c=>c.stopPropagation()),r.addEventListener("change",()=>{I!==null&&h.rename(I,r.value)}),x(".xps-rows").addEventListener("click",c=>{let l=c.target&&c.target.closest&&c.target.closest("tr[data-id]");l&&(I=Number(l.getAttribute("data-id")),tt())});let s=x(".xps-idle");s.addEventListener("keydown",c=>c.stopPropagation()),s.addEventListener("keyup",c=>c.stopPropagation()),s.addEventListener("change",()=>{h.setIdleMin(Number(s.value)),s.value=String(h.idleMin())}),x(".xps-csv").addEventListener("click",()=>{yn(It(h.history().slice().reverse()),`xp-sessions-${Sn()}.csv`)});let i=x(".xps-clear");i.addEventListener("click",()=>{if(!Q){Q=!0,i.textContent="Confirm?",i.classList.add("xps-armed"),bt=setTimeout(Lt,3e3);return}Lt(),h.clearHistory()}),tt()}n(kn,"bind");function $t(e){return h=e,Z=h.subscribe(vn),E=gt(()=>(document.querySelectorAll(".xps-panel").forEach(t=>t.remove()),new B("XpSessionsPanel",gn,mn)),{persistKey:"XpSessions",defaultVisible:!1,onMount:kn}),E}n($t,"attachBrowser");function Rt(){clearTimeout(bt),Q=!1,Z&&Z(),Z=null;try{xt("XpSessionsPanel")}catch(e){}try{E&&E.dispose&&E.dispose()}catch(e){}E=null,L=null,h=null,I=null}n(Rt,"disposeBrowser");var wn="XpSessions.data",_n=1,M=null,ht={};function Cn(){if(M)return M;try{M=lt.get(wn,{},_n)}catch(e){return ht}for(let e in ht)M[e]===void 0&&(M[e]=ht[e]);return M}n(Cn,"prefsGet");function En(){try{M&&M.save&&M.save()}catch(e){console.warn("[XpSessions] save failed:",e)}}n(En,"prefsSave");function Pn(){let e=O&&O.Entity,t=O;return{gid:e&&e.GID,aid:e&&e.AID,sessionAid:t&&t.AID,homunId:t&&t.homunId,mercId:t&&t.mercId}}n(Pn,"selfIds");function In(){try{let e=V&&V.currentMap;return e?String(e).replace(/\.gat$/i,"").toLowerCase():null}catch(e){return null}}n(In,"currentMap");function Mn(e){let t=it;try{return t&&t.getMapName?t.getMapName(`${e}.gat`,null):null}catch(r){return null}}n(Mn,"mapName");function Tn(e){try{G.addText(e,G.TYPE.BLUE)}catch(t){}}n(Tn,"say");var St=wt({now:Date.now,self:Pn,entities:{get:n(e=>at.get(e),"get")}}),N=Mt({now:Date.now,prefs:{get:Cn,save:En},kills:St,map:{current:In},mapName:Mn,timers:{set:n((e,t)=>setTimeout(e,t),"set"),clear:n(e=>clearTimeout(e),"clear")},say:Tn,log:n((e,t)=>pt("info","xp-sessions",e,t,{file:"xp-sessions"}),"log")}),A=[],vt=null,H=null;function Ln(){return!!B&&typeof document<"u"}n(Ln,"hasUI");function Dt(){for(let e of Tt(N,St))A.push(e)}n(Dt,"hookPackets");function jt(){j.add("xpsessions","XP Sessions: toggle the panel, or `/xps start|stop`",function(e){let t=String(e||"").trim().split(/\s+/)[1];if(t==="start"){N.start();return}if(t==="stop"){N.stop("manual");return}H&&H.toggle()},["xps"])}n(jt,"registerCommand");function An(){return console.log(`%c[RO][XpSessions v${U.version}] loaded`,"color: #9cf; font-weight: bold"),T&&T.ZC&&T.ZC.NOTIFY_VANISH?Dt():A.push(z(X.WIRE_COMPLETE,Dt)),A.push(ct(X.MAP_ENTER,()=>St.reset())),Ln()&&(H=$t(N)),j.$raw?jt():A.push(z(X.MAP_ENTER,jt)),vt=setInterval(()=>N.heartbeat(),1e3),ut(({reason:e})=>{for(console.log(`[RO][XpSessions] cleanup reason=${e}`),clearInterval(vt),vt=null,N.flush();A.length;)try{A.pop()()}catch(t){}try{j.remove("xpsessions")}catch(t){}H&&Rt(),H=null}),!0}n(An,"Init");var yt={...U,init:An};var As={...yt,init(e,t){return kt(t),yt.init.call(this,e,t)}};export{As as default};

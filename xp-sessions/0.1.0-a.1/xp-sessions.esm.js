var Pt=Object.defineProperty;var n=(t,e)=>Pt(t,"name",{value:e,configurable:!0});import{PACKET as Q,Preferences as te,Session as tt,EntityManager as ee,MapRenderer as yt,DB as ne,ChatBox as kt,Commands as ot,UIComponent as se}from"@robrowser/plugin-api";import{on as oe,once as St,EVENTS as et}from"@robrowser/event-bus";import{registerCleanup as re}from"@robrowser/lifecycle";import{devLog as ie}from"@robrowser/dev-log";function it(t,e){if(!t||typeof t.now!="function")throw new Error("[kill-tracker] required port missing: now");if(typeof t.self!="function")throw new Error("[kill-tracker] required port missing: self");let r=t.now,s=t.self,i=t.entities&&t.entities.get||(()=>null),c=e&&e.ttlMs||8e3,l={},m=0,g={};function f(p){if(!p)return!1;let d=s()||{};return p===d.gid||p===d.aid||p===d.sessionAid}n(f,"isMe");function v(p){if(!p)return!1;if(f(p))return!0;let d=s()||{};return p===d.homunId||p===d.mercId}n(v,"isMine");function y(p){let d={},k=0;for(let T in l)p-l[T].t<=c&&(d[T]=l[T],k++);l=d,m=k}n(y,"sweep");function S(p){return p?{job:p.job||null,name:p.display&&p.display.name||null,objecttype:p.objecttype||null}:null}n(S,"identity");function j(p){let d=r(),k=l[p];if(k){k.t=d,k.who||(k.who=S(i(p)));return}m++,l[p]={t:d,who:S(i(p))},m>256&&y(d)}n(j,"stamp");function A(p,d){d&&v(p)&&j(d)}n(A,"noteHit");function G(p,d){d&&(v(p)||g[p])&&j(d)}n(G,"noteSkillHit");function R(p,d){d&&v(p)&&(g[d]=!0)}n(R,"noteSkillUnit");function O(p){delete g[p]}n(O,"forgetSkillUnit");function V(p,d){if(d!==1)return null;let k=l[p];if(k===void 0||(delete l[p],m--,r()-k.t>c))return null;let T=S(i(p))||k.who||{job:null,name:null,objecttype:null};return{gid:p,job:T.job,name:T.name,objecttype:T.objecttype}}n(V,"onVanish");function X(){l={},m=0,g={}}return n(X,"reset"),{isMe:f,isMine:v,noteHit:A,noteSkillHit:G,noteSkillUnit:R,forgetSkillUnit:O,onVanish:V,reset:X}}n(it,"createKillTracker");var $={name:"XpSessions",version:"0.1.0-a.1",description:"XP Sessions \u2014 base and job XP per hour, kills per hour and duration, per hunting session. Start / Stop, or let it stop by itself after a few minutes without XP or kill (the session then ends on its last gain). On Stop the name field takes the focus, pre-filled with a name read off the hunt: the mob (one mob \u2265 95 % of the kills), else the map, else the dungeon, else \xAB Mixte <date> \xBB. A typed name is kept, an auto one follows the rules. History with CSV export and a two-click Clear. Passive: nothing is sent to the server. Toggle with /xpsessions (alias /xps); /xps start, /xps stop.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/packet-observer","@robrowser/event-bus","@robrowser/lifecycle","@robrowser/ui","@robrowser/dev-log"]};var J=n(()=>{},"noop");function at(t){let e=[];function r(l){return e.push(l),()=>{let m=e.indexOf(l);m!==-1&&e.splice(m,1)}}n(r,"subscribe");function s(l,m){for(let g of e.slice())try{g(l,m)}catch(f){console.error(`[plugin-core ${l}]`,f)}}n(s,"dispatch");function i(l){s("change",l)}n(i,"emitChange");function c(l){s("tick",l)}return n(c,"emitTick"),{ports:t||{},subscribe:r,emitChange:i,emitTick:c}}n(at,"createCore");function pt(t){let e=Number(t.amount)||0,r=Number(t.amount2)||0;return r===0?e:(e>>>0)+r*4294967296}n(pt,"expAmount");function U(t,e){return e>0?t*36e5/e:0}n(U,"perHour");var At=[["gl_","glast"],["glast_","glast"],["c_tower","clocktower"],["alde_dun","clocktower"],["tha_t","thanatos"],["thana_","thanatos"],["juperos_","juperos"],["jupe_","juperos"]],lt={glast:"Glast Heim",clocktower:"Clock Tower",thanatos:"Thanatos Tower",juperos:"Juperos",gef_dun:"Geffen Dungeon",beach_dun:"Comodo Caves",mosk_dun:"Moscovia Dungeon",gon_dun:"Kunlun Dungeon",lou_dun:"Royal Tomb",ama_dun:"Amatsu Dungeon",ayo_dun:"Ayothaya Dungeon",um_dun:"Umbala Dungeon",tur_dun:"Turtle Island",xmas_dun:"Toy Factory"},Lt=/fild$|^mjolnir$/;function ct(t){if(!t)return null;for(let[r,s]of At)if(t.indexOf(r)===0)return s;let e=t.replace(/\d+$/,"").replace(/_$/,"");return!e||Lt.test(e)?null:e}n(ct,"dungeonKey");function $t(t){return t.replace(/\s+(?:[FB]\d+|\d+(?:st|nd|rd|th) Basement)$/i,"").trim()}n($t,"stripFloor");function Dt(t,e,r){if(lt[t])return lt[t];let s=null;for(let i of e){let c=r(i);if(!c)return t;let l=$t(c);if(s===null)s=l;else if(s!==l)return t}return s||t}n(Dt,"dungeonName");function Rt(t){let e=new Date(t),r=n(s=>String(s).padStart(2,"0"),"p");return`${r(e.getDate())}/${r(e.getMonth()+1)}/${e.getFullYear()} ${r(e.getHours())}:${r(e.getMinutes())}`}n(Rt,"formatDate");function B(t,e){let r=0,s=null;for(let c in t.kills){let l=t.kills[c];r+=l.n,(!s||l.n>s.n)&&(s=l)}if(s&&s.n*100>=95*r)return s.name;let i=[];for(let c in t.maps)i.push(c);if(i.length===1)return e(i[0])||i[0];if(i.length>1){let c=ct(i[0]),l=!!c;for(let m=1;l&&m<i.length;m++)l=ct(i[m])===c;if(l)return Dt(c,i,e)}return`Mixte ${Rt(t.start)}`}n(B,"autoName");function Ot(t){let e=String(t);return/[",\n]/.test(e)?`"${e.replace(/"/g,'""')}"`:e}n(Ot,"csvCell");function ut(t){let r=[["name","auto_name","start","end","duration_s","base_exp","job_exp","quest_base_exp","quest_job_exp","kills","base_exp_per_h","job_exp_per_h","kills_per_h"].join(",")];for(let s of t)r.push([Ot(s.name),s.auto?"1":"0",new Date(s.start).toISOString(),new Date(s.end).toISOString(),Math.round(s.durationMs/1e3),s.base,s.job,s.questBase,s.questJob,s.kills,Math.round(s.baseRate),Math.round(s.jobRate),Math.round(s.killRate)].join(","));return`${r.join(`
`)}
`}n(ut,"csvOf");var Ht=5,qt=2e3;function dt(t){for(let o of["now","prefs","kills"])if(!t||!t[o])throw new Error(`[XpSessions] required port missing: ${o}`);let e=at(t),{now:r,prefs:s,kills:i}=t,c=t.map&&t.map.current||(()=>null),l=t.mapName||(()=>null),m=t.timers||null,g=t.say||J,f=t.log||J,v=null;function y(){let o=s.get();return Array.isArray(o.sessions)||(o.sessions=[]),o.current===void 0&&(o.current=null),o.idleMin>0||(o.idleMin=Ht),o}n(y,"store");function S(){v!==null&&m&&m.clear(v),v=null,s.save()}n(S,"saveNow");function j(){if(!m){s.save();return}v===null&&(v=m.set(()=>{v=null,s.save()},qt))}n(j,"saveSoon");function A(o){return l(o)||null}n(A,"mapName");function G(o){return o.name||B(o,A)}n(G,"nameOf");function R(o){let u=0;for(let a in o.kills)u+=o.kills[a].n;return u}n(R,"killCount");function O(o){o.lastGain=r();let u=c();u&&(o.maps[u]=(o.maps[u]||0)+1)}n(O,"noteGain");function V(){let o=y();if(o.current)return;let u=r();o.current={start:u,end:null,lastGain:u,base:0,job:0,questBase:0,questJob:0,kills:{},maps:{},name:null,stopReason:null},S(),e.emitChange({started:u})}n(V,"start");function X(o){let u=y(),a=u.current;if(!a)return null;u.current=null;let b=o==="idle"?"idle":"manual";if(a.base+a.job+a.questBase+a.questJob===0&&R(a)===0)return S(),g("[XP Sessions] session stopped \u2014 nothing gained, not kept"),e.emitChange({dropped:a.start}),null;a.end=b==="idle"?a.lastGain:r(),a.stopReason=b,u.sessions.push(a),S();let w=z(a);return g(`[XP Sessions] ${b==="idle"?"auto-stopped (idle)":"stopped"}: ${w.name} \u2014 ${w.kills} kills, ${Math.round(w.baseRate)} base XP/h`),f("stop",w),e.emitChange({stopped:a.start,reason:b}),a.start}n(X,"stop");function p(o,u){let a=y().sessions.find(L=>L.start===o);if(!a)return;let b=String(u||"").trim(),w=!b||b===B(a,A)?null:b;w!==a.name&&(a.name=w,S(),e.emitChange({renamed:o}))}n(p,"rename");function d(){y().sessions=[],S(),e.emitChange({cleared:!0})}n(d,"clearHistory");function k(o){let u=Number(o);u>0&&(y().idleMin=u,S(),e.emitChange({idleMin:u}))}n(k,"setIdleMin");function T(o){let u=y().current;if(!u||!i.isMe(o.AID))return;let a=pt(o);if(!(a>0))return;let b=o.expType===1;if(o.varID===1)b?u.questBase+=a:u.base+=a;else if(o.varID===2)b?u.questJob+=a:u.job+=a;else return;O(u),j(),e.emitTick()}n(T,"onExp");function Et(o,u){let a=i.onVanish(o,u),b=y().current;if(!a||!b||a.objecttype!==null&&a.objecttype!==5)return;let w=a.job===null?"?":String(a.job),L=b.kills[w]||(b.kills[w]={name:a.name||(a.job===null?"Unknown":`#${a.job}`),n:0});a.name&&L.name!==a.name&&(L.name=a.name),L.n++,O(b),j(),e.emitChange({kill:w})}n(Et,"onVanish");function Tt(){let o=y(),u=o.current;if(u){if(r()-u.lastGain>=o.idleMin*6e4){X("idle");return}e.emitTick()}}n(Tt,"heartbeat");function z(o){let u=o.end===null?r():o.end,a=Math.max(0,u-o.start),b=R(o);return{id:o.start,name:G(o),auto:!o.name,autoName:B(o,A),start:o.start,end:u,durationMs:a,base:o.base,job:o.job,questBase:o.questBase,questJob:o.questJob,kills:b,baseRate:U(o.base,a),jobRate:U(o.job,a),killRate:U(b,a),stopReason:o.stopReason}}n(z,"rowOf");function It(){let o=y().current;return o?z(o):null}n(It,"live");function Ct(){let o=[],u=y().sessions;for(let a=u.length-1;a>=0;a--)o.push(z(u[a]));return o}n(Ct,"history");function Mt(){return y().idleMin}n(Mt,"idleMin");function Nt(){v!==null&&S()}return n(Nt,"flush"),{subscribe:e.subscribe,start:V,stop:X,rename:p,clearHistory:d,setIdleMin:k,onExp:T,onVanish:Et,heartbeat:Tt,live:It,history:Ct,idleMin:Mt,flush:Nt}}n(dt,"createXpSessionsCore");import{PACKET as ft}from"@robrowser/plugin-api";import{observePacket as Kt}from"@robrowser/packet-observer";function xt(t,e){let r=[],s=ft&&ft.ZC;if(!s)return r;let i=n((f,v)=>{f&&r.push(Kt(f,v))},"add"),c=n(f=>t.onExp(f),"onExp");i(s.NOTIFY_EXP,c),i(s.NOTIFY_EXP2,c);let l=n(f=>e.noteHit(f.GID,f.targetGID),"onAct");i(s.NOTIFY_ACT,l),i(s.NOTIFY_ACT2,l),i(s.NOTIFY_ACT3,l);let m=n(f=>e.noteSkillHit(f.AID,f.targetID),"onSkill");i(s.NOTIFY_SKILL,m),i(s.NOTIFY_SKILL2,m),i(s.NOTIFY_SKILL_POSITION,m);let g=n(f=>e.noteSkillUnit(f.creatorAID,f.AID),"onUnit");return i(s.SKILL_ENTRY,g),i(s.SKILL_ENTRY2,g),i(s.SKILL_ENTRY3,g),i(s.SKILL_ENTRY4,g),i(s.SKILL_ENTRY5,g),i(s.SKILL_DISAPPEAR,f=>e.forgetSkillUnit(f.AID)),i(s.NOTIFY_VANISH,f=>t.onVanish(f.GID,f.type)),r}n(xt,"hookXpPackets");import{UIComponent as Yt}from"@robrowser/plugin-api";import*as Y from"@robrowser/ui";var Ft=`
<div class="xps-panel">
  <div class="xps-titlebar">
    <span class="xps-title">XP Sessions <span class="xps-ver">v${$.version}</span></span>
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
</div>`.trim(),Gt=`
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
`.trim(),h=null,M=null,E=null,H=null,I=null,q=!1,Z=null;function _(t){return Math.round(t).toLocaleString("en-US")}n(_,"num");function bt(t){let e=Math.floor(t/1e3),r=n(s=>String(s).padStart(2,"0"),"p");return`${Math.floor(e/3600)}:${r(Math.floor(e/60)%60)}:${r(e%60)}`}n(bt,"dur");function Vt(t){return String(t).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}n(Vt,"esc");function F(){return M&&M.ui&&M.ui[0]}n(F,"root");function x(t){let e=F();return e?e.querySelector(t):null}n(x,"q");function W(t){return t.find(e=>e.id===I)||null}n(W,"selectedRow");function gt(){if(!F())return;let t=h.live(),e=x(".xps-toggle");e.textContent=t?"Stop":"Start",e.classList.toggle("xps-on",!!t);let r=x(".xps-state");r.textContent=t?"Running":"Stopped",r.classList.toggle("xps-on",!!t),x(".xps-dur").textContent=t?bt(t.durationMs):"",x(".xps-base-rate").textContent=t?_(t.baseRate):"\u2013",x(".xps-job-rate").textContent=t?_(t.jobRate):"\u2013",x(".xps-kill-rate").textContent=t?_(t.killRate):"\u2013",x(".xps-kills").textContent=t?_(t.kills):"\u2013",x(".xps-totals").textContent=t?`Base ${_(t.base)} \xB7 Job ${_(t.job)} \xB7 Quest ${_(t.questBase)} / ${_(t.questJob)} (not in the rates) \xB7 ${t.name}`:""}n(gt,"patchLive");function K(){if(!F())return;gt();let t=h.history();(I===null||!W(t))&&(I=t.length?t[0].id:null),x(".xps-rows").innerHTML=t.map(i=>`
		<tr data-id="${i.id}" class="${i.id===I?"xps-sel":""}">
			<td class="xps-l${i.auto?" xps-auto":""}">${Vt(i.name)}</td>
			<td>${bt(i.durationMs)}</td>
			<td>${_(i.baseRate)}</td>
			<td>${_(i.jobRate)}</td>
			<td>${_(i.killRate)}</td>
		</tr>`).join(""),x(".xps-table").style.display=t.length?"":"none",x(".xps-empty").hidden=t.length>0;let e=W(t),r=x(".xps-name");r.disabled=!e,document.activeElement!==r&&(r.value=e?e.name:""),r.placeholder=e?e.autoName:"",x(".xps-auto-tag").hidden=!(e&&e.auto);let s=x(".xps-idle");document.activeElement!==s&&(s.value=String(h.idleMin())),x(".xps-csv").disabled=t.length===0,x(".xps-clear").disabled=t.length===0}n(K,"render");function zt(t,e){I=t,E&&!E.isVisible()&&E.show(),K();let r=x(".xps-name");if(!r)return;let s=document.activeElement&&/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);!e&&s||(r.focus(),r.select())}n(zt,"focusName");function Jt(t,e){if(t==="tick"){gt();return}if(e&&e.stopped){zt(e.stopped,e.reason==="manual");return}K()}n(Jt,"onCore");function Wt(){let t=new Date,e=n(r=>String(r).padStart(2,"0"),"p");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}-${e(t.getHours())}${e(t.getMinutes())}`}n(Wt,"stamp");function Zt(t,e){let r=URL.createObjectURL(new Blob([t],{type:"text/csv"})),s=document.createElement("a");s.href=r,s.download=e,s.click(),URL.revokeObjectURL(r)}n(Zt,"download");function mt(){q=!1,clearTimeout(Z);let t=x(".xps-clear");t&&(t.textContent="Clear",t.classList.remove("xps-armed"))}n(mt,"disarmClear");function Qt(t){if(M=t,!F())return;try{M.draggable(M.ui.find(".xps-titlebar"))}catch(c){}x(".xps-close").addEventListener("click",c=>{c.stopPropagation(),E.hide()}),x(".xps-toggle").addEventListener("click",()=>{h.live()?h.stop("manual"):h.start()});let r=x(".xps-name");r.addEventListener("keydown",c=>{if(c.stopPropagation(),c.key==="Enter")r.blur();else if(c.key==="Escape"){let l=W(h.history());r.value=l?l.name:"",r.blur()}}),r.addEventListener("keyup",c=>c.stopPropagation()),r.addEventListener("change",()=>{I!==null&&h.rename(I,r.value)}),x(".xps-rows").addEventListener("click",c=>{let l=c.target&&c.target.closest&&c.target.closest("tr[data-id]");l&&(I=Number(l.getAttribute("data-id")),K())});let s=x(".xps-idle");s.addEventListener("keydown",c=>c.stopPropagation()),s.addEventListener("keyup",c=>c.stopPropagation()),s.addEventListener("change",()=>{h.setIdleMin(Number(s.value)),s.value=String(h.idleMin())}),x(".xps-csv").addEventListener("click",()=>{Zt(ut(h.history().slice().reverse()),`xp-sessions-${Wt()}.csv`)});let i=x(".xps-clear");i.addEventListener("click",()=>{if(!q){q=!0,i.textContent="Confirm?",i.classList.add("xps-armed"),Z=setTimeout(mt,3e3);return}mt(),h.clearHistory()}),K()}n(Qt,"bind");function ht(t){return h=t,H=h.subscribe(Jt),E=Y.registerPlayerWindow(()=>(document.querySelectorAll(".xps-panel").forEach(e=>e.remove()),new Yt("XpSessionsPanel",Ft,Gt)),{persistKey:"XpSessions",defaultVisible:!1,onMount:Qt}),E}n(ht,"attachBrowser");function vt(){clearTimeout(Z),q=!1,H&&H(),H=null;try{Y.purgeComponentCss("XpSessionsPanel")}catch(t){}try{E&&E.dispose&&E.dispose()}catch(t){}E=null,M=null,h=null,I=null}n(vt,"disposeBrowser");var ae="XpSessions.data",le=1,C=null,nt={};function ce(){if(C)return C;try{C=te.get(ae,{},le)}catch(t){return nt}for(let t in nt)C[t]===void 0&&(C[t]=nt[t]);return C}n(ce,"prefsGet");function pe(){try{C&&C.save&&C.save()}catch(t){console.warn("[XpSessions] save failed:",t)}}n(pe,"prefsSave");function ue(){let t=tt&&tt.Entity,e=tt;return{gid:t&&t.GID,aid:t&&t.AID,sessionAid:e&&e.AID,homunId:e&&e.homunId,mercId:e&&e.mercId}}n(ue,"selfIds");function de(){try{let t=yt&&yt.currentMap;return t?String(t).replace(/\.gat$/i,"").toLowerCase():null}catch(t){return null}}n(de,"currentMap");function fe(t){let e=ne;try{return e&&e.getMapName?e.getMapName(`${t}.gat`,null):null}catch(r){return null}}n(fe,"mapName");function xe(t){try{kt.addText(t,kt.TYPE.BLUE)}catch(e){}}n(xe,"say");var rt=it({now:Date.now,self:ue,entities:{get:n(t=>ee.get(t),"get")}}),P=dt({now:Date.now,prefs:{get:ce,save:pe},kills:rt,map:{current:de},mapName:fe,timers:{set:n((t,e)=>setTimeout(t,e),"set"),clear:n(t=>clearTimeout(t),"clear")},say:xe,log:n((t,e)=>ie("info","xp-sessions",t,e,{file:"xp-sessions"}),"log")}),N=[],st=null,D=null;function me(){return!!se&&typeof document<"u"}n(me,"hasUI");function wt(){for(let t of xt(P,rt))N.push(t)}n(wt,"hookPackets");function _t(){ot.add("xpsessions","XP Sessions: toggle the panel, or `/xps start|stop`",function(t){let e=String(t||"").trim().split(/\s+/)[1];if(e==="start"){P.start();return}if(e==="stop"){P.stop("manual");return}D&&D.toggle()},["xps"])}n(_t,"registerCommand");function be(){return console.log(`%c[RO][XpSessions v${$.version}] loaded`,"color: #9cf; font-weight: bold"),Q&&Q.ZC&&Q.ZC.NOTIFY_VANISH?wt():N.push(St(et.WIRE_COMPLETE,wt)),N.push(oe(et.MAP_ENTER,()=>rt.reset())),me()&&(D=ht(P)),ot.$raw?_t():N.push(St(et.MAP_ENTER,_t)),st=setInterval(()=>P.heartbeat(),1e3),re(({reason:t})=>{for(console.log(`[RO][XpSessions] cleanup reason=${t}`),clearInterval(st),st=null,P.flush();N.length;)try{N.pop()()}catch(e){}try{ot.remove("xpsessions")}catch(e){}D&&vt(),D=null}),!0}n(be,"Init");var Ge={...$,init:be};export{Ge as default};

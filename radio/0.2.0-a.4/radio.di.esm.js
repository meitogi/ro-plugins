var Se=Object.defineProperty;var n=(t,e)=>Se(t,"name",{value:e,configurable:!0});var z=[],N;function S(t){z.push(t),N&&t(N)}n(S,"register");function ee(t){N=t||{};for(let e=0;e<z.length;e++)z[e](N)}n(ee,"fillAll");var ve=n(t=>t&&new Proxy(t,{get:n((e,a)=>a==="$raw"?e:Reflect.get(e,a),"get")}),"__raw"),Re,Ee,Pe,m,ke,Me,Le,D,$,Ae,Te,_e,Be,Ie,Ne,$e,Fe,qe,x,Ge,Oe,Ue,W,F,ze,De,We,He,Ke,Ze,je,Qe,Ve,Ye,Xe,Je,H,et,tt;S(t=>{let e=t.libs&&t.libs["plugin-api"]||{};Re=e.AIDriver,Ee=e.Action,Pe=e.Altitude,m=e.BGM,ke=e.Background,Me=e.Camera,Le=e.ChatBox,D=e.Client,$=ve(e.Commands),Ae=e.Configs,Te=e.DB,_e=e.EffectManager,Be=e.EffectTable,Ie=e.EntityManager,Ne=e.ItemInfo,$e=e.MapRenderer,Fe=e.MiniMap,qe=e.Network,x=e.PACKET,Ge=e.PacketLength,Oe=e.PathFinding,Ue=e.PluginManager,W=e.Preferences,F=e.Session,ze=e.ShortCut,De=e.SkillAction,We=e.SkillConst,He=e.SkillDescription,Ke=e.SkillEffect,Ze=e.SkillInfo,je=e.SkillTargetSelection,Qe=e.SoundManager,Ve=e.Sprite,Ye=e.StatusIcons,Xe=e.StatusInfo,Je=e.Texture,H=t.LegacyUIComponent,et=e.UIManager,tt=e.WebGL});var E,rt,ot,nt,at,lt,q,it,L,st;S(t=>{let e=t.libs&&t.libs["event-bus"]||{};E=e.EVENTS,rt=e.createBus,ot=e.default,nt=e.emit,at=e.getBus,lt=e.off,q=e.on,it=e.onFirstListener,L=e.once,st=e.stats});var ct,G,ft,K;S(t=>{let e=t.libs&&t.libs["packet-observer"]||{};ct=e.default,G=e.observePacket,ft=e.observePacketStatus,K=e.observeSendPacket});var pt,dt,ut,gt,yt,mt,ht,bt,wt,xt,Z,Ct,St,vt,Rt;S(t=>{let e=t.libs&&t.libs.lifecycle||{};pt=e.cleanupCount,dt=e.createLifecycle,ut=e.default,gt=e.flushCleanup,yt=e.getCount,mt=e.getLifecycle,ht=e.getState,bt=e.hasReached,wt=e.isWired,xt=e.onInitCall,Z=e.registerCleanup,Ct=e.setCurrentPlugin,St=e.setLogger,vt=e.stats,Rt=e.transition});var Et,Pt,kt,Mt,Lt,At,j,Tt,_t;S(t=>{let e=t.libs&&t.libs.ui||{};Et=e.default,Pt=e.find,kt=e.findAll,Mt=e.makeDraggable,Lt=e.on,At=e.purgeComponentCss,j=e.registerPlayerWindow,Tt=e.registerWindow,_t=e.root});var Q={name:"RoRadio",version:"0.2.0-a.4",description:"In-game music player \u2014 plays BGM from the client's mp3nametable, manages a playlist with shuffle/repeat, mutes the map BGM while playing, and survives map changes uninterrupted via its own <audio> element.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:[],pars:{}};var Nt={},te=/_(in|fild\d*|dun\d*|cas\d*|gld|edq|tower|ant)\d*$/i,V=/^\d+@/;function $t(t){return String(t||"").replace(/\.rsw$/i,"")}n($t,"normalizeMap");function Ft(t,e){if(t.length===1)return t[0];let a=n(o=>{let s=e[`${o}.rsw`];return!!(s&&typeof s.name=="string"&&s.name.trim())},"hasName"),l=[t.filter(o=>a(o)&&!te.test(o)&&!V.test(o)),t.filter(o=>a(o)&&!V.test(o)),t.filter(o=>a(o)),t.filter(o=>!te.test(o)&&!V.test(o)),t];for(let o of l)if(o.length)return o.sort((s,f)=>s.length-f.length||s.localeCompare(f)),o[0];return t[0]}n(Ft,"pickPrincipal");function qt(t){return t.split(/[_\s]+/).map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}n(qt,"prettyMapName");function Y(t,e){if(typeof t!="string"||!t)return{};let l=`
${t}`.replace(/\n(\/\/[^\n]+)/g,"").split("#"),o={};for(let s=0;s+1<l.length;s+=2){let f=l[s].replace(/^\s+|\s+$/g,""),i=l[s+1].replace(/^\s+|\s+$/g,"");!f||!i||/\.rsw$/i.test(f)&&(o[f]={[e]:i})}return o}n(Y,"parseHashTable");function oe(t,e){let a={};for(let[l,o]of Object.entries(t||{}))a[l]={...o};for(let[l,o]of Object.entries(e||{}))a[l]={...a[l]||{},...o};return a}n(oe,"mergeTables");function ne(t){if(typeof t=="string")return t;if(!t)return"";let e=t instanceof Uint8Array?t:new Uint8Array(t);try{return new TextDecoder("utf-8").decode(e)}catch{let l="";for(let o=0;o<e.length;o++)l+=String.fromCharCode(e[o]);return l}}n(ne,"decodeBuffer");function re(t,e){let a=e[`${t}.rsw`];return a&&typeof a.name=="string"&&a.name.trim()?a.name.trim():qt(t)}n(re,"displayNameFor");function ae(t){if(!t||typeof t!="object")return[];let e=new Map;for(let l of Object.keys(t)){let o=t[l],s=o&&o.mp3;if(!s||typeof s!="string")continue;let f=s.toLowerCase(),i=$t(l);e.has(f)||e.set(f,new Set),e.get(f).add(i)}let a=[];for(let[l,o]of e){let s=[...o].sort(),f=Ft(s,t),i=re(f,t),p=s.map(v=>re(v,t)),y=Nt[l],h=y||(s.length===1?i:`${i} (+${s.length-1} maps)`);a.push({filename:l,label:h,principal:f,mapCount:s.length,maps:s,displayMaps:p})}return a.sort((l,o)=>l.label.toLowerCase().localeCompare(o.label.toLowerCase())),a}n(ae,"buildBgmCatalog");var Gt=`
<div class="ro-radio-window">
  <div class="rr-titlebar">
    <span class="rr-title">RO Radio <span class="rr-ver">v${Q.version}</span></span>
    <button type="button" class="rr-btn rr-min" title="Minimize">_</button>
    <button type="button" class="rr-btn rr-close" title="Close">x</button>
  </div>
  <div class="rr-now">
    <div class="rr-now-label">\u2014 stopped \u2014</div>
    <div class="rr-now-file"></div>
  </div>
  <div class="rr-controls">
    <button type="button" class="rr-ctrl rr-prev" title="Previous">\u23EE</button>
    <button type="button" class="rr-ctrl rr-play" title="Play / Pause">\u25B6</button>
    <button type="button" class="rr-ctrl rr-next" title="Next">\u23ED</button>
    <button type="button" class="rr-ctrl rr-stop" title="Stop">\u23F9</button>
    <button type="button" class="rr-toggle rr-shuffle" title="Shuffle">\u{1F500}</button>
  </div>
  <div class="rr-panes">
    <div class="rr-pane rr-library">
      <div class="rr-pane-head">
        <span>Library</span>
        <input type="search" class="rr-filter" placeholder="filter..." />
      </div>
      <ul class="rr-list rr-lib-list"></ul>
    </div>
    <div class="rr-pane rr-playlist">
      <div class="rr-pane-head">
        <span>Playlist <span class="rr-pl-count">(0)</span></span>
        <button type="button" class="rr-pl-clear" title="Clear playlist">clear</button>
      </div>
      <ul class="rr-list rr-pl-list"></ul>
    </div>
  </div>
</div>`.trim(),Ot=`
.ro-radio-window {
  position: absolute; top: 80px; left: 80px;
  width: 480px; height: 420px;
  background: rgba(20, 20, 24, 0.94);
  border: 1px solid #555; border-radius: 4px;
  font-family: Arial, sans-serif; font-size: 11px; color: #ddd;
  display: flex; flex-direction: column; user-select: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
}
.ro-radio-window.rr-min { height: auto !important; }
.ro-radio-window.rr-min .rr-now,
.ro-radio-window.rr-min .rr-controls,
.ro-radio-window.rr-min .rr-panes { display: none; }
.rr-titlebar {
  background: linear-gradient(#3a3a44, #1e1e24);
  padding: 4px 8px; cursor: move; display: flex; align-items: center;
  border-bottom: 1px solid #555; flex: 0 0 auto;
}
.rr-title { flex: 1; font-weight: bold; color: #fff; }
.rr-ver { font-weight: normal; font-size: 9px; color: #888; margin-left: 4px; }
.rr-btn {
  background: #444; border: 1px solid #666; color: #ddd; cursor: pointer;
  width: 18px; height: 16px; line-height: 14px; padding: 0; margin-left: 2px;
  font-family: monospace; font-size: 11px;
}
.rr-btn:hover { background: #555; }
.rr-now {
  padding: 6px 8px; border-bottom: 1px solid #333; flex: 0 0 auto;
  background: rgba(0,0,0,0.25);
}
.rr-now-label { font-weight: bold; color: #fff; font-size: 12px; }
.rr-now-file { color: #888; font-size: 10px; margin-top: 2px; font-family: monospace; }
.rr-controls {
  padding: 6px 8px; display: flex; gap: 4px; align-items: center;
  border-bottom: 1px solid #333; flex: 0 0 auto;
}
.rr-ctrl, .rr-toggle {
  background: #2a2a30; border: 1px solid #555; color: #ddd; cursor: pointer;
  height: 24px; padding: 0 8px; font-size: 13px; line-height: 22px;
}
.rr-ctrl:hover, .rr-toggle:hover { background: #3a3a44; }
.rr-toggle.rr-active { background: #4a6a8a; border-color: #6a8aaa; color: #fff; }
.rr-toggle.rr-mute[data-mode="auto"] { /* default */ }
.rr-toggle.rr-mute[data-mode="on"] { background: #8a4a4a; border-color: #aa6a6a; color: #fff; }
.rr-toggle.rr-mute[data-mode="off"] { background: #4a8a4a; border-color: #6aaa6a; color: #fff; }
.rr-panes {
  flex: 1 1 auto; display: flex; min-height: 0;
}
.rr-pane {
  flex: 1 1 50%; display: flex; flex-direction: column; min-width: 0;
  border-right: 1px solid #333;
}
.rr-pane:last-child { border-right: none; }
.rr-pane-head {
  padding: 4px 8px; background: rgba(0,0,0,0.3); border-bottom: 1px solid #333;
  display: flex; align-items: center; gap: 6px; flex: 0 0 auto;
}
.rr-pane-head > span { flex: 1; font-weight: bold; color: #aaa; }
.rr-filter {
  background: #1a1a1e; border: 1px solid #444; color: #ddd; padding: 1px 4px;
  font-size: 10px; width: 110px;
}
.rr-pl-clear {
  background: #3a2a2a; border: 1px solid #5a4040; color: #ccc; cursor: pointer;
  font-size: 10px; padding: 1px 6px;
}
.rr-pl-clear:hover { background: #4a3030; }
.rr-list {
  list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1 1 auto;
}
.rr-row {
  padding: 3px 8px; cursor: pointer; border-bottom: 1px solid #25252a;
  display: flex; align-items: center; gap: 6px;
}
.rr-row:hover { background: rgba(80, 100, 140, 0.25); }
.rr-row.rr-now-playing { background: rgba(80, 140, 80, 0.3); color: #fff; }
.rr-row-label { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rr-row-file { color: #777; font-size: 9px; font-family: monospace; }
.rr-row-rm {
  background: #3a2a2a; border: 1px solid #5a4040; color: #ccc; cursor: pointer;
  font-size: 9px; padding: 0 4px; line-height: 14px; height: 14px;
}
.rr-row-rm:hover { background: #5a3030; }
.rr-empty { padding: 12px; text-align: center; color: #666; font-style: italic; }`,Ut=1;function zt(){return`RoRadio:${F&&F.AID||"anon"}`}n(zt,"prefsKey");var Dt="RoRadio.window",X="RoRadio",P=[],U=new Map,c=null,u=(()=>{let t=-1,e=!1,a=null,l=null,o=!0,s=null,f=null;function i(){return m&&m.audio}n(i,"audio");function p(){if(!(a&&l))try{let r=m.play,d=m.stop;if(typeof r!="function"||typeof d!="function")throw new Error("BGM.play / BGM.stop not yet functions");a=r,l=d,typeof m.filename=="string"&&m.filename&&(s=m.filename),m.play=n(function(T){if(T&&(s=T),!e)return a.call(this,T)},"radioGatedBgmPlay"),m.stop=n(function(){if(!e)return l.call(this)},"radioGatedBgmStop")}catch(r){console.warn("[RoRadio] failed to patch BGM:",r),a=null,l=null}}n(p,"ensureBgmPatched");function y(){let r=i();if(!r||r.__roRadioAttached)return;r.__roRadioAttached=!0;let d=n(()=>{e&&console.warn("[RoRadio] BGM.audio error",r.error&&r.error.code,r.error&&r.error.message,"src:",r.src)},"onError");r.addEventListener("ended",w),r.addEventListener("error",d),f={audio:r,onEnded:w,onError:d}}n(y,"attachAudioListeners");function h(){if(!c.playlist.length)return-1;if(c.shuffle){if(c.playlist.length===1)return 0;let d=t;for(;d===t;)d=Math.floor(Math.random()*c.playlist.length);return d}let r=t+1;return r>=c.playlist.length?c.repeat==="all"?0:-1:r}n(h,"pickNextIndex");function v(){return c.playlist.length?c.shuffle?Math.floor(Math.random()*c.playlist.length):0:-1}n(v,"pickStartIndex");function g(){if(!c.playlist.length)return-1;let r=t-1;return r<0?c.repeat==="all"?c.playlist.length-1:0:r}n(g,"pickPrevIndex");function w(){if(!e||!c)return;if(c.repeat==="one"){let d=i();d&&(d.currentTime=0,d.play().catch(()=>{}));return}let r=h();if(r<0){M();return}k(r)}n(w,"onEnded");function I(r){let d=i();if(!d||!a){console.warn("[RoRadio] BGM not ready");return}d.loop!==!1&&(o=d.loop,d.loop=!1),console.log("[RoRadio] play",r);try{a.call(m,r)}catch(R){console.error("[RoRadio] bgmOriginalPlay threw:",R)}b()}n(I,"loadAndPlay");function k(r){c.playlist.length&&(p(),y(),t=Math.max(0,Math.min(r,c.playlist.length-1)),e=!0,I(c.playlist[t]))}n(k,"playAt");function fe(){if(t<0&&c.playlist.length){k(v());return}p(),y();let r=i();r&&r.src?(e=!0,r.play().catch(d=>{console.warn("[RoRadio] BGM.audio.play rejected:",d&&d.message)}),b()):c.playlist.length&&k(v())}n(fe,"play");function pe(){let r=i();r&&r.pause(),b()}n(pe,"pause");function M(r){let d=!r||r.restoreBundleBgm!==!1;if(!e){t=-1,b();return}e=!1,t=-1;let R=i();if(R&&(R.loop=o),d&&s&&a)try{a.call(m,s)}catch(T){console.warn("[RoRadio] failed to restore bundle BGM:",T)}else!d&&R&&R.pause();b()}n(M,"stop");function de(){let r=h();if(r<0){M();return}k(r)}n(de,"next");function ue(){let r=i();if(r&&r.currentTime>3){r.currentTime=0;return}let d=g();d<0||k(d)}n(ue,"prev");function A(){try{c.save()}catch(r){console.error("[RoRadio] save failed:",r)}}n(A,"savePrefs");function ge(r){c.shuffle=!!r,A(),b()}n(ge,"setShuffle");function ye(){let r=["off","all","one"],d=r.indexOf(c.repeat);c.repeat=r[(d+1)%r.length],A(),b()}n(ye,"cycleRepeat");function me(r){c.playlist.includes(r)||c.playlist.push(r),A(),b()}n(me,"addToPlaylist");function he(r){if(r<0||r>=c.playlist.length)return;let d=r===t;if(c.playlist.splice(r,1),r<t)t--;else if(d){if(t>=c.playlist.length&&(t=c.playlist.length?0:-1,t<0)){M();return}k(t)}A(),b()}n(he,"removeFromPlaylist");function be(){c.playlist=[],A(),M()}n(be,"clearPlaylist");function we(){let r=i();return{playing:!!(r&&!r.paused&&e),radioActive:e,index:t,currentFile:t>=0?c.playlist[t]:null,audio:r?{src:r.src,volume:r.volume,paused:r.paused,loop:r.loop,readyState:r.readyState,networkState:r.networkState,currentTime:r.currentTime,duration:r.duration,error:r.error?{code:r.error.code,message:r.error.message}:null}:null,bgmPatched:a!==null}}n(we,"getState");function xe(){let r=i();return!!(r&&!r.paused&&e)}n(xe,"isPlaying");function Ce(){try{M({restoreBundleBgm:!1})}catch(r){console.warn("[RoRadio] dispose stop:",r)}if(f){try{f.audio.removeEventListener("ended",f.onEnded),f.audio.removeEventListener("error",f.onError);try{delete f.audio.__roRadioAttached}catch{}}catch(r){console.warn("[RoRadio] dispose detach audio:",r)}f=null}if(a&&l){try{m.play=a,m.stop=l}catch(r){console.warn("[RoRadio] dispose restore BGM:",r)}a=null,l=null}}return n(Ce,"dispose"),{play:fe,pause:pe,stop:M,next:de,prev:ue,playAt:k,addToPlaylist:me,removeFromPlaylist:he,clearPlaylist:be,setShuffle:ge,cycleRepeat:ye,getState:we,isPlaying:xe,ensureBgmPatched:p,dispose:Ce}})(),B=null,ie=null,C=null,O=!1,se="";function Wt(){return B&&B.ui&&B.ui[0]}n(Wt,"rootEl");function b(){let t=Wt();if(!t)return;let e=u.getState(),a=t.querySelector(".rr-now-label"),l=t.querySelector(".rr-now-file");if(e.currentFile){let i=U.get(e.currentFile.toLowerCase());a.textContent=i?i.label:e.currentFile,l.textContent=e.currentFile+(e.playing?"":" (paused)")}else a.textContent="\u2014 stopped \u2014",l.textContent="";let o=t.querySelector(".rr-play");o&&(o.textContent=e.playing?"\u23F8":"\u25B6");let s=t.querySelector(".rr-shuffle");s&&s.classList.toggle("rr-active",!!c.shuffle);let f=t.querySelector(".rr-pl-count");f&&(f.textContent=`(${c.playlist.length})`),Ht(t),ce(t)}n(b,"refreshUI");function ce(t){let e=t.querySelector(".rr-lib-list");if(!e)return;if(e.innerHTML="",!P.length){let o=document.createElement("li");o.className="rr-empty",o.textContent=_?"Loading data/mp3nametable.txt...":"No BGM found \u2014 Client.loadFile returned an empty file?",e.appendChild(o);return}let a=se.toLowerCase().trim(),l=0;for(let o of P){if(a&&!o.label.toLowerCase().includes(a)&&!o.filename.includes(a)&&!o.maps.some(f=>f.toLowerCase().includes(a))&&!(o.displayMaps||[]).some(f=>f.toLowerCase().includes(a)))continue;let s=document.createElement("li");s.className="rr-row",s.dataset.filename=o.filename,s.title=`${o.label} \u2014 ${o.filename}
Maps: ${o.maps.slice(0,6).join(", ")}${o.maps.length>6?`, +${o.maps.length-6}`:""}`,s.innerHTML='<span class="rr-row-label"></span><span class="rr-row-file"></span>',s.querySelector(".rr-row-label").textContent=o.label,s.querySelector(".rr-row-file").textContent=o.filename,e.appendChild(s),l++}if(!l){let o=document.createElement("li");o.className="rr-empty",o.textContent="No match.",e.appendChild(o)}}n(ce,"renderLibrary");function Ht(t){let e=t.querySelector(".rr-pl-list");if(!e)return;e.innerHTML="";let a=u.getState();if(!c.playlist.length){let l=document.createElement("li");l.className="rr-empty",l.textContent="Empty \u2014 double-click a library entry to add.",e.appendChild(l);return}c.playlist.forEach((l,o)=>{let s=U.get(l.toLowerCase()),f=s?s.label:l,i=document.createElement("li");i.className="rr-row",i.dataset.plIndex=String(o),o===a.index&&i.classList.add("rr-now-playing"),i.innerHTML='<span class="rr-row-label"></span><span class="rr-row-file"></span><button type="button" class="rr-row-rm" title="Remove">\xD7</button>',i.querySelector(".rr-row-label").textContent=f,i.querySelector(".rr-row-file").textContent=l,e.appendChild(i)})}n(Ht,"renderPlaylist");var _=!1;function le(t){return new Promise(e=>{try{D.loadFile(t,a=>{if(!a){e(null);return}try{e(ne(a))}catch(l){console.warn(`[RoRadio] decode ${t} failed:`,l),e(null)}})}catch(a){console.warn(`[RoRadio] Client.loadFile(${t}) threw:`,a),e(null)}})}n(le,"loadDataText");function Kt(){P.length||_||(_=!0,Promise.all([le("data/mp3nametable.txt"),le("data/mapnametable.txt")]).then(([t,e])=>{try{if(!t){console.warn("[RoRadio] data/mp3nametable.txt empty or missing"),_=!1,b();return}let a=Y(t,"mp3"),l=e?Y(e,"name"):{},o=oe(a,l);P=ae(o),U.clear();for(let s of P)U.set(s.filename,{filename:s.filename,label:s.label});console.log(`[RoRadio] catalog built \u2014 ${P.length} BGM, display-names ${e?"on":"off (mapnametable.txt unavailable)"}`)}catch(a){console.error("[RoRadio] catalog build failed:",a)}finally{_=!1,b()}}))}n(Kt,"buildCatalog");function Zt(t){let e=t.querySelector(".rr-min");e&&e.addEventListener("click",g=>{g.stopPropagation(),O=!O,t.classList.toggle("rr-min",O)});let a=t.querySelector(".rr-close");a&&a.addEventListener("click",g=>{g.stopPropagation(),C&&C.hide()});let l=t.querySelector(".rr-prev");l&&l.addEventListener("click",()=>u.prev());let o=t.querySelector(".rr-next");o&&o.addEventListener("click",()=>u.next());let s=t.querySelector(".rr-stop");s&&s.addEventListener("click",()=>u.stop());let f=t.querySelector(".rr-play");f&&f.addEventListener("click",()=>{u.getState().playing?u.pause():u.play()});let i=t.querySelector(".rr-shuffle");i&&i.addEventListener("click",()=>u.setShuffle(!c.shuffle));let p=t.querySelector(".rr-lib-list");p&&p.addEventListener("dblclick",g=>{let w=g.target.closest(".rr-row[data-filename]");w&&u.addToPlaylist(w.dataset.filename)});let y=t.querySelector(".rr-filter");y&&y.addEventListener("input",g=>{se=g.target.value||"",ce(t)});let h=t.querySelector(".rr-pl-list");h&&(h.addEventListener("dblclick",g=>{let w=g.target.closest(".rr-row[data-pl-index]");w&&u.playAt(Number(w.dataset.plIndex))}),h.addEventListener("click",g=>{let w=g.target.closest(".rr-row-rm");if(!w)return;g.stopPropagation();let I=w.closest(".rr-row[data-pl-index]");I&&u.removeFromPlaylist(Number(I.dataset.plIndex))}));let v=t.querySelector(".rr-pl-clear");v&&v.addEventListener("click",()=>u.clearPlaylist())}n(Zt,"bindControls");function jt(){document.querySelectorAll(".ro-radio-window").forEach(e=>e.remove());let t=new H("RoRadio",Gt,Ot);return ie=n(function(){let e=t.ui&&t.ui[0];if(e){if(typeof t.draggable=="function"&&t.ui.find)try{t.draggable(t.ui.find(".rr-titlebar"))}catch{}e.classList.toggle("rr-min",O),Zt(e),P.length||Kt(),b()}},"bindPanel"),t}n(jt,"createWindow");function Qt(){let t=[],e=[];c={playlist:[],shuffle:!1,repeat:"all",muteMode:"auto",save(){}};function a(){try{let i=zt(),p={playlist:[],shuffle:!1,repeat:"all",muteMode:"auto"};try{let h=localStorage.getItem(X),v=localStorage.getItem(i);if(h&&!v){let g=JSON.parse(h);Array.isArray(g.playlist)&&(p.playlist=g.playlist),typeof g.shuffle=="boolean"&&(p.shuffle=g.shuffle),(g.repeat==="one"||g.repeat==="all"||g.repeat==="off")&&(p.repeat=g.repeat),["auto","on","off"].includes(g.muteMode)&&(p.muteMode=g.muteMode),console.log(`[RoRadio] migrated legacy '${X}' \u2192 '${i}' (${p.playlist.length} tracks)`),localStorage.removeItem(X)}}catch(h){console.warn("[RoRadio] legacy migration failed:",h)}let y=W.get(i,p,Ut);c&&Array.isArray(c.playlist)&&c.playlist.length&&!y.playlist?.length&&(y.playlist=c.playlist.slice()),Array.isArray(y.playlist)||(y.playlist=[]),typeof y.shuffle!="boolean"&&(y.shuffle=!1),y.repeat!=="one"&&(y.repeat="all"),["auto","on","off"].includes(y.muteMode)||(y.muteMode="auto"),c=y,b(),console.log(`[RoRadio] preferences loaded (key: ${i})`)}catch(i){console.warn("[RoRadio] Preferences.get still failing post-MAP_ENTER:",i)}}n(a,"upgradePrefs"),e.push(L(E.MAP_ENTER,a)),C=j(()=>(B=jt(),B),{persistKey:Dt,defaultVisible:!1,onMount:n(()=>ie?.(),"onMount")});function l(){$.add("radio","Toggle the RO Radio window",function(i){let p=(i||"").trim().split(/\s+/).slice(1).join(" ").toLowerCase();if(!p){C.toggle();return}if(p==="play"){C.show(),u.play();return}if(p==="pause"){u.pause();return}if(p==="stop"){u.stop();return}if(p==="next"){u.next();return}if(p==="prev"){u.prev();return}this.addText("[RoRadio] usage: /radio [play|pause|stop|next|prev]",this.TYPE.INFO,this.FILTER.PUBLIC_LOG)},[])}n(l,"registerChatCommand"),$.$raw?l():e.push(L(E.MAP_ENTER,l));let o=n(()=>u.stop({restoreBundleBgm:!1}),"lifecycleStop");function s(){if(!x||!x.ZC||!x.CZ){console.warn("[RoRadio] PACKET namespaces not found post-MAP_ENTER \u2014 exit hooks skipped");return}if(x.ZC.RESTART_ACK){let i=G(x.ZC.RESTART_ACK,p=>{p&&p.type&&o()});typeof i=="function"&&t.push(i)}if(x.ZC.ACCEPT_QUIT){let i=G(x.ZC.ACCEPT_QUIT,()=>o());typeof i=="function"&&t.push(i)}if(x.CZ.REQUEST_QUIT){let i=K(x.CZ.REQUEST_QUIT,()=>o());typeof i=="function"&&t.push(i)}}n(s,"registerExitHooks"),e.push(L(E.MAP_ENTER,s)),e.push(L(E.MAP_ENTER,()=>u.ensureBgmPatched())),e.push(q(E.CHAR_SELECT,o)),e.push(q(E.LOGOUT,o)),Z(({reason:i})=>{console.log(`[RoRadio] cleanup reason=${i}`);for(let p of t.splice(0))try{p()}catch(y){console.warn("[RoRadio] packet off:",y)}for(let p of e.splice(0))try{p()}catch(y){console.warn("[RoRadio] event off:",y)}try{u.dispose()}catch(p){console.warn("[RoRadio] engine.dispose:",p)}});let f=window;return f.RoRadio={show:n(()=>C&&C.show(),"show"),hide:n(()=>C&&C.hide(),"hide"),toggle:n(()=>C&&C.toggle(),"toggle"),play:n(()=>u.play(),"play"),pause:n(()=>u.pause(),"pause"),stop:n(()=>u.stop(),"stop"),next:n(()=>u.next(),"next"),prev:n(()=>u.prev(),"prev"),state:n(()=>({...u.getState(),prefs:{...c,save:void 0},catalogSize:P.length}),"state")},console.log("%c[RoRadio] ready \u2014 /radio toggles the window","color: #0af; font-weight: bold"),!0}n(Qt,"Init");var J={...Q,init:Qt};var Pr={...J,init(t,e){return ee(e),J.init.call(this,t,e)}};export{Pr as default};

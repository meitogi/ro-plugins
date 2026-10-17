var fe=Object.defineProperty;var n=(e,r)=>fe(e,"name",{value:r,configurable:!0});import{UIComponent as be,PACKET as R,Client as we,BGM as h,Preferences as xe,Commands as j,Session as K}from"@robrowser/plugin-api";import{on as Q,once as _,EVENTS as k}from"@robrowser/event-bus";import{observePacket as D,observeSendPacket as ve}from"@robrowser/packet-observer";import{registerCleanup as Re}from"@robrowser/lifecycle";import*as Y from"@robrowser/ui";var q={name:"RoRadio",version:"0.2.0-a.4",description:"In-game music player \u2014 plays BGM from the client's mp3nametable, manages a playlist with shuffle/repeat, mutes the map BGM while playing, and survives map changes uninterrupted via its own <audio> element.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/ui","@robrowser/packet-observer","@robrowser/lifecycle"],pars:{}};var ge={},G=/_(in|fild\d*|dun\d*|cas\d*|gld|edq|tower|ant)\d*$/i,F=/^\d+@/;function ye(e){return String(e||"").replace(/\.rsw$/i,"")}n(ye,"normalizeMap");function me(e,r){if(e.length===1)return e[0];let a=n(o=>{let s=r[`${o}.rsw`];return!!(s&&typeof s.name=="string"&&s.name.trim())},"hasName"),l=[e.filter(o=>a(o)&&!G.test(o)&&!F.test(o)),e.filter(o=>a(o)&&!F.test(o)),e.filter(o=>a(o)),e.filter(o=>!G.test(o)&&!F.test(o)),e];for(let o of l)if(o.length)return o.sort((s,d)=>s.length-d.length||s.localeCompare(d)),o[0];return e[0]}n(me,"pickPrincipal");function he(e){return e.split(/[_\s]+/).map(r=>r.charAt(0).toUpperCase()+r.slice(1)).join(" ")}n(he,"prettyMapName");function I(e,r){if(typeof e!="string"||!e)return{};let l=`
${e}`.replace(/\n(\/\/[^\n]+)/g,"").split("#"),o={};for(let s=0;s+1<l.length;s+=2){let d=l[s].replace(/^\s+|\s+$/g,""),i=l[s+1].replace(/^\s+|\s+$/g,"");!d||!i||/\.rsw$/i.test(d)&&(o[d]={[r]:i})}return o}n(I,"parseHashTable");function z(e,r){let a={};for(let[l,o]of Object.entries(e||{}))a[l]={...o};for(let[l,o]of Object.entries(r||{}))a[l]={...a[l]||{},...o};return a}n(z,"mergeTables");function H(e){if(typeof e=="string")return e;if(!e)return"";let r=e instanceof Uint8Array?e:new Uint8Array(e);try{return new TextDecoder("utf-8").decode(r)}catch{let l="";for(let o=0;o<r.length;o++)l+=String.fromCharCode(r[o]);return l}}n(H,"decodeBuffer");function U(e,r){let a=r[`${e}.rsw`];return a&&typeof a.name=="string"&&a.name.trim()?a.name.trim():he(e)}n(U,"displayNameFor");function Z(e){if(!e||typeof e!="object")return[];let r=new Map;for(let l of Object.keys(e)){let o=e[l],s=o&&o.mp3;if(!s||typeof s!="string")continue;let d=s.toLowerCase(),i=ye(l);r.has(d)||r.set(d,new Set),r.get(d).add(i)}let a=[];for(let[l,o]of r){let s=[...o].sort(),d=me(s,e),i=U(d,e),p=s.map(v=>U(v,e)),y=ge[l],m=y||(s.length===1?i:`${i} (+${s.length-1} maps)`);a.push({filename:l,label:m,principal:d,mapCount:s.length,maps:s,displayMaps:p})}return a.sort((l,o)=>l.label.toLowerCase().localeCompare(o.label.toLowerCase())),a}n(Z,"buildBgmCatalog");var Ce=`
<div class="ro-radio-window">
  <div class="rr-titlebar">
    <span class="rr-title">RO Radio <span class="rr-ver">v${q.version}</span></span>
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
</div>`.trim(),Se=`
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
.rr-empty { padding: 12px; text-align: center; color: #666; font-style: italic; }`,Ee=1;function Pe(){return`RoRadio:${K&&K.AID||"anon"}`}n(Pe,"prefsKey");var ke="RoRadio.window",O="RoRadio",S=[],$=new Map,c=null,u=(()=>{let e=-1,r=!1,a=null,l=null,o=!0,s=null,d=null;function i(){return h&&h.audio}n(i,"audio");function p(){if(!(a&&l))try{let t=h.play,f=h.stop;if(typeof t!="function"||typeof f!="function")throw new Error("BGM.play / BGM.stop not yet functions");a=t,l=f,typeof h.filename=="string"&&h.filename&&(s=h.filename),h.play=n(function(M){if(M&&(s=M),!r)return a.call(this,M)},"radioGatedBgmPlay"),h.stop=n(function(){if(!r)return l.call(this)},"radioGatedBgmStop")}catch(t){console.warn("[RoRadio] failed to patch BGM:",t),a=null,l=null}}n(p,"ensureBgmPatched");function y(){let t=i();if(!t||t.__roRadioAttached)return;t.__roRadioAttached=!0;let f=n(()=>{r&&console.warn("[RoRadio] BGM.audio error",t.error&&t.error.code,t.error&&t.error.message,"src:",t.src)},"onError");t.addEventListener("ended",w),t.addEventListener("error",f),d={audio:t,onEnded:w,onError:f}}n(y,"attachAudioListeners");function m(){if(!c.playlist.length)return-1;if(c.shuffle){if(c.playlist.length===1)return 0;let f=e;for(;f===e;)f=Math.floor(Math.random()*c.playlist.length);return f}let t=e+1;return t>=c.playlist.length?c.repeat==="all"?0:-1:t}n(m,"pickNextIndex");function v(){return c.playlist.length?c.shuffle?Math.floor(Math.random()*c.playlist.length):0:-1}n(v,"pickStartIndex");function g(){if(!c.playlist.length)return-1;let t=e-1;return t<0?c.repeat==="all"?c.playlist.length-1:0:t}n(g,"pickPrevIndex");function w(){if(!r||!c)return;if(c.repeat==="one"){let f=i();f&&(f.currentTime=0,f.play().catch(()=>{}));return}let t=m();if(t<0){P();return}E(t)}n(w,"onEnded");function B(t){let f=i();if(!f||!a){console.warn("[RoRadio] BGM not ready");return}f.loop!==!1&&(o=f.loop,f.loop=!1),console.log("[RoRadio] play",t);try{a.call(h,t)}catch(C){console.error("[RoRadio] bgmOriginalPlay threw:",C)}b()}n(B,"loadAndPlay");function E(t){c.playlist.length&&(p(),y(),e=Math.max(0,Math.min(t,c.playlist.length-1)),r=!0,B(c.playlist[e]))}n(E,"playAt");function ee(){if(e<0&&c.playlist.length){E(v());return}p(),y();let t=i();t&&t.src?(r=!0,t.play().catch(f=>{console.warn("[RoRadio] BGM.audio.play rejected:",f&&f.message)}),b()):c.playlist.length&&E(v())}n(ee,"play");function te(){let t=i();t&&t.pause(),b()}n(te,"pause");function P(t){let f=!t||t.restoreBundleBgm!==!1;if(!r){e=-1,b();return}r=!1,e=-1;let C=i();if(C&&(C.loop=o),f&&s&&a)try{a.call(h,s)}catch(M){console.warn("[RoRadio] failed to restore bundle BGM:",M)}else!f&&C&&C.pause();b()}n(P,"stop");function re(){let t=m();if(t<0){P();return}E(t)}n(re,"next");function oe(){let t=i();if(t&&t.currentTime>3){t.currentTime=0;return}let f=g();f<0||E(f)}n(oe,"prev");function L(){try{c.save()}catch(t){console.error("[RoRadio] save failed:",t)}}n(L,"savePrefs");function ne(t){c.shuffle=!!t,L(),b()}n(ne,"setShuffle");function ae(){let t=["off","all","one"],f=t.indexOf(c.repeat);c.repeat=t[(f+1)%t.length],L(),b()}n(ae,"cycleRepeat");function le(t){c.playlist.includes(t)||c.playlist.push(t),L(),b()}n(le,"addToPlaylist");function ie(t){if(t<0||t>=c.playlist.length)return;let f=t===e;if(c.playlist.splice(t,1),t<e)e--;else if(f){if(e>=c.playlist.length&&(e=c.playlist.length?0:-1,e<0)){P();return}E(e)}L(),b()}n(ie,"removeFromPlaylist");function se(){c.playlist=[],L(),P()}n(se,"clearPlaylist");function ce(){let t=i();return{playing:!!(t&&!t.paused&&r),radioActive:r,index:e,currentFile:e>=0?c.playlist[e]:null,audio:t?{src:t.src,volume:t.volume,paused:t.paused,loop:t.loop,readyState:t.readyState,networkState:t.networkState,currentTime:t.currentTime,duration:t.duration,error:t.error?{code:t.error.code,message:t.error.message}:null}:null,bgmPatched:a!==null}}n(ce,"getState");function de(){let t=i();return!!(t&&!t.paused&&r)}n(de,"isPlaying");function pe(){try{P({restoreBundleBgm:!1})}catch(t){console.warn("[RoRadio] dispose stop:",t)}if(d){try{d.audio.removeEventListener("ended",d.onEnded),d.audio.removeEventListener("error",d.onError);try{delete d.audio.__roRadioAttached}catch{}}catch(t){console.warn("[RoRadio] dispose detach audio:",t)}d=null}if(a&&l){try{h.play=a,h.stop=l}catch(t){console.warn("[RoRadio] dispose restore BGM:",t)}a=null,l=null}}return n(pe,"dispose"),{play:ee,pause:te,stop:P,next:re,prev:oe,playAt:E,addToPlaylist:le,removeFromPlaylist:ie,clearPlaylist:se,setShuffle:ne,cycleRepeat:ae,getState:ce,isPlaying:de,ensureBgmPatched:p,dispose:pe}})(),A=null,V=null,x=null,N=!1,X="";function Le(){return A&&A.ui&&A.ui[0]}n(Le,"rootEl");function b(){let e=Le();if(!e)return;let r=u.getState(),a=e.querySelector(".rr-now-label"),l=e.querySelector(".rr-now-file");if(r.currentFile){let i=$.get(r.currentFile.toLowerCase());a.textContent=i?i.label:r.currentFile,l.textContent=r.currentFile+(r.playing?"":" (paused)")}else a.textContent="\u2014 stopped \u2014",l.textContent="";let o=e.querySelector(".rr-play");o&&(o.textContent=r.playing?"\u23F8":"\u25B6");let s=e.querySelector(".rr-shuffle");s&&s.classList.toggle("rr-active",!!c.shuffle);let d=e.querySelector(".rr-pl-count");d&&(d.textContent=`(${c.playlist.length})`),Me(e),J(e)}n(b,"refreshUI");function J(e){let r=e.querySelector(".rr-lib-list");if(!r)return;if(r.innerHTML="",!S.length){let o=document.createElement("li");o.className="rr-empty",o.textContent=T?"Loading data/mp3nametable.txt...":"No BGM found \u2014 Client.loadFile returned an empty file?",r.appendChild(o);return}let a=X.toLowerCase().trim(),l=0;for(let o of S){if(a&&!o.label.toLowerCase().includes(a)&&!o.filename.includes(a)&&!o.maps.some(d=>d.toLowerCase().includes(a))&&!(o.displayMaps||[]).some(d=>d.toLowerCase().includes(a)))continue;let s=document.createElement("li");s.className="rr-row",s.dataset.filename=o.filename,s.title=`${o.label} \u2014 ${o.filename}
Maps: ${o.maps.slice(0,6).join(", ")}${o.maps.length>6?`, +${o.maps.length-6}`:""}`,s.innerHTML='<span class="rr-row-label"></span><span class="rr-row-file"></span>',s.querySelector(".rr-row-label").textContent=o.label,s.querySelector(".rr-row-file").textContent=o.filename,r.appendChild(s),l++}if(!l){let o=document.createElement("li");o.className="rr-empty",o.textContent="No match.",r.appendChild(o)}}n(J,"renderLibrary");function Me(e){let r=e.querySelector(".rr-pl-list");if(!r)return;r.innerHTML="";let a=u.getState();if(!c.playlist.length){let l=document.createElement("li");l.className="rr-empty",l.textContent="Empty \u2014 double-click a library entry to add.",r.appendChild(l);return}c.playlist.forEach((l,o)=>{let s=$.get(l.toLowerCase()),d=s?s.label:l,i=document.createElement("li");i.className="rr-row",i.dataset.plIndex=String(o),o===a.index&&i.classList.add("rr-now-playing"),i.innerHTML='<span class="rr-row-label"></span><span class="rr-row-file"></span><button type="button" class="rr-row-rm" title="Remove">\xD7</button>',i.querySelector(".rr-row-label").textContent=d,i.querySelector(".rr-row-file").textContent=l,r.appendChild(i)})}n(Me,"renderPlaylist");var T=!1;function W(e){return new Promise(r=>{try{we.loadFile(e,a=>{if(!a){r(null);return}try{r(H(a))}catch(l){console.warn(`[RoRadio] decode ${e} failed:`,l),r(null)}})}catch(a){console.warn(`[RoRadio] Client.loadFile(${e}) threw:`,a),r(null)}})}n(W,"loadDataText");function Te(){S.length||T||(T=!0,Promise.all([W("data/mp3nametable.txt"),W("data/mapnametable.txt")]).then(([e,r])=>{try{if(!e){console.warn("[RoRadio] data/mp3nametable.txt empty or missing"),T=!1,b();return}let a=I(e,"mp3"),l=r?I(r,"name"):{},o=z(a,l);S=Z(o),$.clear();for(let s of S)$.set(s.filename,{filename:s.filename,label:s.label});console.log(`[RoRadio] catalog built \u2014 ${S.length} BGM, display-names ${r?"on":"off (mapnametable.txt unavailable)"}`)}catch(a){console.error("[RoRadio] catalog build failed:",a)}finally{T=!1,b()}}))}n(Te,"buildCatalog");function Ae(e){let r=e.querySelector(".rr-min");r&&r.addEventListener("click",g=>{g.stopPropagation(),N=!N,e.classList.toggle("rr-min",N)});let a=e.querySelector(".rr-close");a&&a.addEventListener("click",g=>{g.stopPropagation(),x&&x.hide()});let l=e.querySelector(".rr-prev");l&&l.addEventListener("click",()=>u.prev());let o=e.querySelector(".rr-next");o&&o.addEventListener("click",()=>u.next());let s=e.querySelector(".rr-stop");s&&s.addEventListener("click",()=>u.stop());let d=e.querySelector(".rr-play");d&&d.addEventListener("click",()=>{u.getState().playing?u.pause():u.play()});let i=e.querySelector(".rr-shuffle");i&&i.addEventListener("click",()=>u.setShuffle(!c.shuffle));let p=e.querySelector(".rr-lib-list");p&&p.addEventListener("dblclick",g=>{let w=g.target.closest(".rr-row[data-filename]");w&&u.addToPlaylist(w.dataset.filename)});let y=e.querySelector(".rr-filter");y&&y.addEventListener("input",g=>{X=g.target.value||"",J(e)});let m=e.querySelector(".rr-pl-list");m&&(m.addEventListener("dblclick",g=>{let w=g.target.closest(".rr-row[data-pl-index]");w&&u.playAt(Number(w.dataset.plIndex))}),m.addEventListener("click",g=>{let w=g.target.closest(".rr-row-rm");if(!w)return;g.stopPropagation();let B=w.closest(".rr-row[data-pl-index]");B&&u.removeFromPlaylist(Number(B.dataset.plIndex))}));let v=e.querySelector(".rr-pl-clear");v&&v.addEventListener("click",()=>u.clearPlaylist())}n(Ae,"bindControls");function Be(){document.querySelectorAll(".ro-radio-window").forEach(r=>r.remove());let e=new be("RoRadio",Ce,Se);return V=n(function(){let r=e.ui&&e.ui[0];if(r){if(typeof e.draggable=="function"&&e.ui.find)try{e.draggable(e.ui.find(".rr-titlebar"))}catch{}r.classList.toggle("rr-min",N),Ae(r),S.length||Te(),b()}},"bindPanel"),e}n(Be,"createWindow");function _e(){let e=[],r=[];c={playlist:[],shuffle:!1,repeat:"all",muteMode:"auto",save(){}};function a(){try{let i=Pe(),p={playlist:[],shuffle:!1,repeat:"all",muteMode:"auto"};try{let m=localStorage.getItem(O),v=localStorage.getItem(i);if(m&&!v){let g=JSON.parse(m);Array.isArray(g.playlist)&&(p.playlist=g.playlist),typeof g.shuffle=="boolean"&&(p.shuffle=g.shuffle),(g.repeat==="one"||g.repeat==="all"||g.repeat==="off")&&(p.repeat=g.repeat),["auto","on","off"].includes(g.muteMode)&&(p.muteMode=g.muteMode),console.log(`[RoRadio] migrated legacy '${O}' \u2192 '${i}' (${p.playlist.length} tracks)`),localStorage.removeItem(O)}}catch(m){console.warn("[RoRadio] legacy migration failed:",m)}let y=xe.get(i,p,Ee);c&&Array.isArray(c.playlist)&&c.playlist.length&&!y.playlist?.length&&(y.playlist=c.playlist.slice()),Array.isArray(y.playlist)||(y.playlist=[]),typeof y.shuffle!="boolean"&&(y.shuffle=!1),y.repeat!=="one"&&(y.repeat="all"),["auto","on","off"].includes(y.muteMode)||(y.muteMode="auto"),c=y,b(),console.log(`[RoRadio] preferences loaded (key: ${i})`)}catch(i){console.warn("[RoRadio] Preferences.get still failing post-MAP_ENTER:",i)}}n(a,"upgradePrefs"),r.push(_(k.MAP_ENTER,a)),x=Y.registerPlayerWindow(()=>(A=Be(),A),{persistKey:ke,defaultVisible:!1,onMount:n(()=>V?.(),"onMount")});function l(){j.add("radio","Toggle the RO Radio window",function(i){let p=(i||"").trim().split(/\s+/).slice(1).join(" ").toLowerCase();if(!p){x.toggle();return}if(p==="play"){x.show(),u.play();return}if(p==="pause"){u.pause();return}if(p==="stop"){u.stop();return}if(p==="next"){u.next();return}if(p==="prev"){u.prev();return}this.addText("[RoRadio] usage: /radio [play|pause|stop|next|prev]",this.TYPE.INFO,this.FILTER.PUBLIC_LOG)},[])}n(l,"registerChatCommand"),j.$raw?l():r.push(_(k.MAP_ENTER,l));let o=n(()=>u.stop({restoreBundleBgm:!1}),"lifecycleStop");function s(){if(!R||!R.ZC||!R.CZ){console.warn("[RoRadio] PACKET namespaces not found post-MAP_ENTER \u2014 exit hooks skipped");return}if(R.ZC.RESTART_ACK){let i=D(R.ZC.RESTART_ACK,p=>{p&&p.type&&o()});typeof i=="function"&&e.push(i)}if(R.ZC.ACCEPT_QUIT){let i=D(R.ZC.ACCEPT_QUIT,()=>o());typeof i=="function"&&e.push(i)}if(R.CZ.REQUEST_QUIT){let i=ve(R.CZ.REQUEST_QUIT,()=>o());typeof i=="function"&&e.push(i)}}n(s,"registerExitHooks"),r.push(_(k.MAP_ENTER,s)),r.push(_(k.MAP_ENTER,()=>u.ensureBgmPatched())),r.push(Q(k.CHAR_SELECT,o)),r.push(Q(k.LOGOUT,o)),Re(({reason:i})=>{console.log(`[RoRadio] cleanup reason=${i}`);for(let p of e.splice(0))try{p()}catch(y){console.warn("[RoRadio] packet off:",y)}for(let p of r.splice(0))try{p()}catch(y){console.warn("[RoRadio] event off:",y)}try{u.dispose()}catch(p){console.warn("[RoRadio] engine.dispose:",p)}});let d=window;return d.RoRadio={show:n(()=>x&&x.show(),"show"),hide:n(()=>x&&x.hide(),"hide"),toggle:n(()=>x&&x.toggle(),"toggle"),play:n(()=>u.play(),"play"),pause:n(()=>u.pause(),"pause"),stop:n(()=>u.stop(),"stop"),next:n(()=>u.next(),"next"),prev:n(()=>u.prev(),"prev"),state:n(()=>({...u.getState(),prefs:{...c,save:void 0},catalogSize:S.length}),"state")},console.log("%c[RoRadio] ready \u2014 /radio toggles the window","color: #0af; font-weight: bold"),!0}n(_e,"Init");var Ze={...q,init:_e};export{Ze as default};

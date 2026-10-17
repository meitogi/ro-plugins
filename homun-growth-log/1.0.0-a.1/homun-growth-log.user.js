// ==UserScript==
// @name         RO Plugin v3 — HomunGrowthLog
// @namespace    robrowser
// @version      1.0.0-a.1
// @description  Records every homunculus level-up locally: the exact base-stat roll (hp/sp/str/agi/vit/int/dex/luk) read from the server's green 'Growth:' chat line, paired with the before/after ZC_PROPERTY_HOMUN snapshots so the derived-stat delta (atk, matk, hit, crit, def, mdef, flee) is captured too. Draggable panel with the per-level table + cumulative totals, Download JSON / Download CSV, and Clear. Passive: no packet is modified, nothing is sent to the server. Toggle with /homungrowth (alias /hgl).
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/homun-growth-log/1.0.0-a.1/homun-growth-log.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/homun-growth-log/1.0.0-a.1/homun-growth-log.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_HomunGrowthLog_v3'
	if (W[FLAG]) { return }
	W[FLAG] = true

	/* ============================================================
	 * Plugin source — real JS, inspectable in the Tampermonkey editor.
	 * Self-contained ES module body (esbuild bundle) ; `@robrowser/*`
	 * static imports have been rewritten to top-level
	 * `await import('@robrowser/*')` by the V3 builder so they fit
	 * inside an `async function` declaration. The source file itself
	 * stays plain ESM (consumable by Vite or any browser with the right
	 * import map).
	 *
	 * NOTE : this function is NEVER called. Its body is extracted via
	 * `.toString()`, reshaped from `return { qt }` into
	 * `export default qt`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var it=Object.defineProperty;var l=(t,e)=>it(t,"name",{value:e,configurable:!0});const { PACKET: g, Preferences: mt, Session: G, Commands: j, ChatBox: B } = await import("@robrowser/plugin-api");const { observePacket: X } = await import("@robrowser/packet-observer");const { once: Q, EVENTS: tt } = await import("@robrowser/event-bus");const { registerCleanup: bt } = await import("@robrowser/lifecycle");const H = await import("@robrowser/ui");var v={name:"HomunGrowthLog",version:"1.0.0-a.1",description:"Records every homunculus level-up locally: the exact base-stat roll (hp/sp/str/agi/vit/int/dex/luk) read from the server's green 'Growth:' chat line, paired with the before/after ZC_PROPERTY_HOMUN snapshots so the derived-stat delta (atk, matk, hit, crit, def, mdef, flee) is captured too. Draggable panel with the per-level table + cumulative totals, Download JSON / Download CSV, and Clear. Passive: no packet is modified, nothing is sent to the server. Toggle with /homungrowth (alias /hgl).",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/packet-observer","@robrowser/event-bus","@robrowser/lifecycle","@robrowser/ui"],pars:{maxRecords:500,pairWindowMs:5e3}};const { UIComponent: dt } = await import("@robrowser/plugin-api");var x=["hp","sp","str","agi","vit","int","dex","luk"],S=[["atk","ATK"],["Matk","MATK"],["hit","HIT"],["critical","CRI"],["def","DEF"],["Mdef","MDEF"],["flee","FLEE"]],K=["atk","Matk","hit","critical","def","Mdef","flee","maxHP","maxSP","ATKRange"],h=null,d=null,T=!1,E=null,ht=`
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
		          ${S.map(([,t])=>`<th class="hgl-d">\u0394${t}</th>`).join("")}
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
		</div>`.trim(),ut=`
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
		`.trim();function F(t){d=t}l(F,"initPanel");function V(){return document.querySelectorAll(".hgl-panel").forEach(t=>t.remove()),h=new dt("HomunGrowthLogPanel",ht,ut),h}l(V,"buildPanel");function M(){return h&&h.ui&&h.ui[0]}l(M,"el");function q(t,e){return`<td class="${e}${t?"":" hgl-zero"}">${t||0}</td>`}l(q,"cell");function ft(t){let e=t.growth,o=t.delta||{},r=x.map(a=>q(e?e[a]:0,"hgl-g")).join(""),n=S.map(([a])=>q(o[a],"hgl-d")).join("");return`<tr class="${t.partial?"hgl-partial":""}"><td class="hgl-lv">${t.lv}</td>${r}${n}</tr>`}l(ft,"rowHtml");function gt(t){let e={};for(let n of t){let a=n.growth,s=n.delta;if(a)for(let i of x)e[i]=(e[i]||0)+(a[i]||0);if(s)for(let[i]of S)e[i]=(e[i]||0)+(s[i]||0)}let o=x.map(n=>`<td>+${e[n]||0}</td>`).join(""),r=S.map(([n])=>`<td>+${e[n]||0}</td>`).join("");return`<td class="hgl-lv">total</td>${o}${r}`}l(gt,"totalsHtml");function m(){let t=M();if(!t||!d)return;let e=d.names(),o=d.selected(),r=t.querySelector(".hgl-pick");r&&(r.innerHTML=e.length?e.map(p=>`<option value="${p}"${p===o?" selected":""}>${p}</option>`).join(""):'<option value="">(no homunculus yet)</option>',r.disabled=e.length<2);let n=o?d.records(o):[],a=n.slice().reverse(),s=t.querySelector(".hgl-rows");s&&(s.innerHTML=a.map(ft).join(""));let i=t.querySelector(".hgl-totals");i&&(i.innerHTML=n.length?gt(n):"");let N=t.querySelector(".hgl-empty");N&&(N.hidden=n.length>0);let $=t.querySelector(".hgl-table");$&&($.style.display=n.length?"":"none");let Y=t.querySelector(".hgl-count");if(Y){let p=n.length?n[0].lv:null,P=n.length?n[n.length-1].lv:null;Y.textContent=n.length?`${n.length} level-up${n.length>1?"s":""} recorded (Lv ${p} \u2192 ${P})`:""}for(let p of[".hgl-json",".hgl-csv",".hgl-clear"]){let P=t.querySelector(p);P&&(P.disabled=n.length===0)}_()}l(m,"render");function W(){let t=new Date,e=l(o=>String(o).padStart(2,"0"),"p");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}-${e(t.getHours())}${e(t.getMinutes())}${e(t.getSeconds())}`}l(W,"stamp");function z(t,e,o){let r=URL.createObjectURL(new Blob([t],{type:e})),n=document.createElement("a");n.href=r,n.download=o,n.click(),URL.revokeObjectURL(r)}l(z,"triggerDownload");function pt(t,e){let r=[["datetime","homunculus","level",...x.map(n=>`growth_${n}`),...K.map(n=>`delta_${n}`),"partial"].join(",")];for(let n of e){let a=n.growth||{},s=n.delta||{};r.push([new Date(n.ts).toISOString(),`"${String(t).replace(/"/g,'""')}"`,n.lv,...x.map(i=>n.growth?a[i]:""),...K.map(i=>n.delta?s[i]||0:""),n.partial?"1":"0"].join(","))}return`${r.join(`
		`)}
		`}l(pt,"csvOf");function _(){T=!1,clearTimeout(E);let t=M(),e=t&&t.querySelector(".hgl-clear");e&&(e.textContent="Clear",e.classList.remove("hgl-armed"))}l(_,"disarmClear");function Z(){let t=M();if(!t||!d)return;if(typeof h.draggable=="function"&&h.ui.find)try{h.draggable(h.ui.find(".hgl-titlebar"))}catch{}let e=t.querySelector(".hgl-close");e&&e.addEventListener("click",s=>{s.stopPropagation(),d.close()});let o=t.querySelector(".hgl-pick");o&&o.addEventListener("change",()=>{d.select(o.value),m()});let r=t.querySelector(".hgl-json");r&&r.addEventListener("click",()=>{let s=d.selected();if(!s)return;let i={plugin:v.name,version:v.version,homunculus:s,exportedAt:new Date().toISOString(),records:d.records(s)};z(JSON.stringify(i,null,"	"),"application/json",`homun-growth-${s}-${W()}.json`)});let n=t.querySelector(".hgl-csv");n&&n.addEventListener("click",()=>{let s=d.selected();s&&z(pt(s,d.records(s)),"text/csv",`homun-growth-${s}-${W()}.csv`)});let a=t.querySelector(".hgl-clear");a&&a.addEventListener("click",()=>{if(!T){T=!0,a.textContent="Confirm?",a.classList.add("hgl-armed"),E=setTimeout(_,3e3);return}_();let s=d.selected();s&&d.clear(s),m()}),m()}l(Z,"bindPanel");function J(){clearTimeout(E),E=null,T=!1,h=null,d=null}l(J,"disposePanel");var wt="1.0.0-a.1",vt="HomunGrowthLog.data",xt=1,yt=/^Growth:\s*hp:(-?\d+)\s+sp:(-?\d+)\s+str\(([\d.]+)\)\s+agi\(([\d.]+)\)\s+vit\(([\d.]+)\)\s+int\(([\d.]+)\)\s+dex\(([\d.]+)\)\s+luk\(([\d.]+)\)/,lt=["atk","Matk","hit","critical","def","Mdef","flee","maxHP","maxSP","ATKRange"],Pt=["PROPERTY_HOMUN","PROPERTY_HOMUN2","PROPERTY_HOMUN3","PROPERTY_HOMUN4","PROPERTY_HOMUN5"],f=null,w="",u=null,k=null,b=null,y=null,c=null,D=500,U=5e3,L=[],C=[];function et(){return{version:1,homun:{}}}l(et,"defaults");function O(){if(!f){try{f=mt.get(vt,et(),xt)}catch{return et()}(!f.homun||typeof f.homun!="object")&&(f.homun={})}return f}l(O,"getData");function I(){try{f&&f.save&&f.save()}catch(t){console.warn("[HomunGrowthLog] save failed:",t)}}l(I,"save");function St(t){let e=O(),o=e.homun[t];return o||(o={charName:at(),records:[]},e.homun[t]=o),Array.isArray(o.records)||(o.records=[]),o}l(St,"entryFor");function at(){try{return G.Entity&&G.Entity.display&&G.Entity.display.name||""}catch{return""}}l(at,"currentCharName");function ot(){let t=O(),e=[];for(let o in t.homun)e.push(o);return e}l(ot,"homunNames");function A(t){let o=O().homun[t];return o&&o.records||[]}l(A,"recordsOf");function Tt(t){let e=O();e.homun[t]&&(e.homun[t].records=[]),I()}l(Tt,"clearRecords");function Et(t){let e=yt.exec(t);return e?{hp:+e[1],sp:+e[2],str:+e[3],agi:+e[4],vit:+e[5],int:+e[6],dex:+e[7],luk:+e[8]}:null}l(Et,"parseGrowth");function Ct(t){let e={};for(let o of lt)e[o]=t[o];return e}l(Ct,"snapshot");function kt(t,e){if(!t||!e)return null;let o={};for(let r of lt){let n=(e[r]||0)-(t[r]||0);n&&(o[r]=n)}return o}l(kt,"diff");function st(t){c={lv:t.lv,ts:Date.now(),before:null,after:null,growth:null,timer:null,...t},c.timer=setTimeout(()=>{R()},U)}l(st,"openPending");function R(){if(!c)return;let t=c;if(c=null,clearTimeout(t.timer),t.lv==null)return;let e=k||"unknown",o=St(e),r=kt(t.before,t.after),n={lv:t.lv,ts:t.ts,growth:t.growth,before:t.before,after:t.after,delta:r};(!t.growth||!r)&&(n.partial=!0),o.charName=at()||o.charName;let a=o.records[o.records.length-1];if(a&&a.lv===n.lv&&a.partial&&n.ts-a.ts<U*2){a.growth||(a.growth=n.growth),a.delta||(a.before=n.before,a.after=n.after,a.delta=n.delta),a.growth&&a.delta&&delete a.partial,I(),m();return}o.records.push(n),o.records.length>D&&o.records.splice(0,o.records.length-D),I(),w||(w=e),console.log(`[RO][HomunGrowthLog] ${e} reached Lv ${t.lv}`,n.growth||"(no growth line)"),m()}l(R,"commitPending");function Lt(t){let e=t.szName,o=t.nLevel;if(typeof o!="number")return;let r=Ct(t);if(e!==k){k=e,b=o,y=r,w||(w=e,m());return}b!=null&&o>b&&(c&&c.lv===o&&c.after==null?(c.before=y,c.after=r,R()):(c&&R(),st({lv:o,before:y,after:r}))),b=o,y=r}l(Lt,"onProperty");function Rt(t){let e=t&&t.msg;if(typeof e!="string"||e.charCodeAt(0)!==71)return;let o=Et(e);if(o){if(c&&c.growth==null){c.growth=o,R();return}st({lv:b==null?null:b+1,growth:o})}}l(Rt,"onNpcChat");function nt(){let t=0;for(let o of Pt){let r=g&&g.ZC&&g.ZC[o];if(!r)continue;let n=X(r,Lt);typeof n=="function"&&(L.push(n),t++)}let e=g&&g.ZC&&g.ZC.NPC_CHAT;if(e){let o=X(e,Rt);typeof o=="function"&&L.push(o)}console.log(`[RO][HomunGrowthLog] hooked ${t} PROPERTY_HOMUN variant(s)${e?" + NPC_CHAT":" \u2014 NPC_CHAT MISSING"}`)}l(nt,"hookPackets");function rt(){j.add("homungrowth","Toggle the Homunculus Growth log panel",function(){u&&(u.toggle(),this.addText(`[HomunGrowthLog] ${u.isVisible()?"shown":"hidden"}`,this.TYPE.BLUE))},["hgl"])}l(rt,"registerChatCommand");function Ht(t){console.log(`%c[RO][HomunGrowthLog v${wt}] loaded`,"color: #9cf; font-weight: bold"),t&&Number.isFinite(t.maxRecords)&&t.maxRecords>0&&(D=t.maxRecords),t&&Number.isFinite(t.pairWindowMs)&&t.pairWindowMs>0&&(U=t.pairWindowMs);let e=ot();e.length&&(w=e.reduce((o,r)=>A(r).length>A(o).length?r:o,e[0])),F({names:ot,records:A,selected:l(()=>w,"selected"),select:l(o=>{w=o},"select"),clear:Tt,close:l(()=>{u&&u.hide()},"close")}),g&&g.ZC&&g.ZC.NPC_CHAT?nt():C.push(Q(tt.WIRE_COMPLETE,nt)),u=H.registerPlayerWindow(()=>V(),{persistKey:"HomunGrowthLog",defaultVisible:!1,onMount:l(()=>Z(),"onMount")}),j.$raw?rt():C.push(Q(tt.MAP_ENTER,rt)),bt(({reason:o})=>{for(console.log(`[RO][HomunGrowthLog] cleanup reason=${o}`);L.length;)try{L.pop()()}catch{}for(;C.length;)try{C.pop()()}catch{}c&&(clearTimeout(c.timer),c=null);try{j.remove("homungrowth")}catch{}try{H.purgeComponentCss("HomunGrowthLogPanel")}catch{}try{u&&u.dispose&&u.dispose()}catch{}J(),u=null,f=null,k=null,b=null,y=null});try{B.addText("[HomunGrowthLog] ready \u2014 /homungrowth (or /hgl) to open",B.TYPE.BLUE)}catch{}return!0}l(Ht,"Init");var qt={...v,init:Ht};return { qt }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { qt }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { qt }` → nothing, then append
	//      `export default qt` so the module's default export is
	//      the manifest object PluginManager wants.
	//   3. Re-attach the sourcemap LAST so DevTools can map the bundle to
	//      original src/* files.
	const src = pluginCode.toString()
	const rawBody = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'))
	let body = rawBody
	let sourceMappingComment = ''
	const smMatch = body.match(/\n?[ \t]*\/\/# sourceMappingURL=[^\n]*/)
	if (smMatch) {
		sourceMappingComment = smMatch[0].trim()
		body = body.slice(0, smMatch.index) + body.slice(smMatch.index + smMatch[0].length)
	}
	// Match any identifier (not the literal EXPORT name) : minified export
	// names can contain `$`, a regex metachar that would break interpolation.
	// The reshaped body ends with exactly one trailing `return { … }`.
	body = body.replace(/\s*return\s*\{\s*[\w$]+\s*\}\s*$/, '')
	const moduleSource = body
		+ '\nexport default qt\n'
		+ '//# sourceURL=HomunGrowthLog.js\n'
		+ (sourceMappingComment ? sourceMappingComment + '\n' : '')

	const blob = new Blob([moduleSource], { type: 'application/javascript' })
	const blobUrl = URL.createObjectURL(blob)

	try {
		// Poll for the framework's TM_READY barrier to EXIST. Install order
		// safety : the plugin TM userscript may load before the framework
		// userscript, in which case W.__ROBROWSER_TM_READY is undefined and
		// `await undefined` resolves immediately — then the canonical
		// import of @robrowser/plugin-api would fail because the import map
		// hasn't been installed yet.
		let tries = 0
		while (!W.__ROBROWSER_TM_READY) {
			if (++tries > 100) {
				console.error(`[HomunGrowthLog] framework not present after 10s — install ro-framework.user.js first`)
				return
			}
			await new Promise(r => setTimeout(r, 100))
		}
		// Wait for the signal — forward-compat : we IGNORE its resolved
		// value (v0 resolves with the pluginApi module ; v1 may change or
		// remove that). Our code only relies on the "import map ready"
		// semantics that the await provides.
		await W.__ROBROWSER_TM_READY

		// Canonical import via the @robrowser/plugin-api specifier. The
		// ES module cache returns the same singleton bootstrap landed on
		// ROFramework.PluginManager (used by console / diagnose).
		const { PluginManager } = await import('@robrowser/plugin-api')
		const mod = await import(blobUrl)              // page context, body manifest
		PluginManager.register(mod.default)            // unified registration
	} catch (e) {
		console.error(`[HomunGrowthLog] PluginManager.register failed:`, e)
	}
})()

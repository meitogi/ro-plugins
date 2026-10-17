// ==UserScript==
// @name         RO Plugin v3 — EmperiumHP
// @namespace    robrowser
// @version      0.1.0-a.1
// @description  War of Emperium : an HP bar on the castle's Emperium, which the server never sends. Starts at the castle's maximum (168 430 at defense 100, pre-renewal) and follows every hit and every Sanctuary / Apple of Idun heal seen on it, on the client's own monster HP bar with « current / max · estimé » under it. Kept while that Emperium lives — out of sight, map change, death — and flagged « absent » when hits may have been missed meanwhile ; a new Emperium starts full. Real HP from the server replaces the estimate ; hidden WoE damage shows no bar. /emphp prints the estimate.
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/emperium-hp/0.1.0-a.1/emperium-hp.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/emperium-hp/0.1.0-a.1/emperium-hp.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_EmperiumHP_v3'
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
	 * `.toString()`, reshaped from `return { Ve }` into
	 * `export default Ve`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var J=Object.defineProperty;var n=(e,t)=>J(e,"name",{value:t,configurable:!0});const { PACKET: h, EntityManager: O, MapRenderer: ie, Session: se, ChatBox: G, Commands: C, UIComponent: le } = await import("@robrowser/plugin-api");const { observePacket: ce } = await import("@robrowser/packet-observer");const { once: Z, EVENTS: j } = await import("@robrowser/event-bus");const { registerCleanup: E } = await import("@robrowser/lifecycle");function I(){return Object.create(null)}n(I,"createStore");function f(e){return String(e||"").replace(/\.gat$/i,"")}n(f,"mapKey");function F(e){return/^(?:[a-z]+g_cas\d\d|nguild_[a-z]+)$/i.test(f(e))}n(F,"isCastleMap");function R(e,t,a,r,o){let i=f(t),l=e[i];return l&&l.gid===a?l.away&&(l.missedWhileAway=!0,l.away=!1):(l={map:i,gid:a,max:o,hp:o,source:"estimate",missedWhileAway:!r.fresh,away:!1,hidden:!1,streak:0},e[i]=l),r.hp>=0&&r.maxHp>0&&w(l,r.hp,r.maxHp),l}n(R,"sight");function V(e,t,a,r){let o=f(t),i=e[o];return!i||i.gid!==a?!1:(r?delete e[o]:i.away=!0,!0)}n(V,"lose");function g(e){for(let t in e)e[t].away=!0}n(g,"leaveAll");function Y(e,t,a){let r=e[f(t)];return r&&r.gid===a?r:null}n(Y,"find");function _(e,t,a,r){let o=t>0?t:0,i=a>0?a:0;if(o+i===0)return;let l=r>0?r:1;(o===0||o===l)&&(i===0||i===l)?(e.streak++,e.streak>=3&&(e.hidden=!0,e.missedWhileAway=!0)):(e.streak=0,e.hidden=!1),e.hp=Math.max(0,e.hp-o-i),e.source="estimate"}n(_,"applyDamage");function $(e,t){t>0&&(e.hp=Math.min(e.max,e.hp+t),e.source="estimate")}n($,"applyHeal");function w(e,t,a){e.max=a,e.hp=Math.max(0,Math.min(a,t)),e.source="server",e.missedWhileAway=!1}n(w,"applyServer");function T(e){return!e.hidden}n(T,"showBar");function K(e){return String(Math.round(e)).replace(/\B(?=(\d{3})+(?!\d))/g,"\xA0")}n(K,"formatHp");function v(e){let t=`${K(e.hp)} / ${K(e.max)}`;return e.source==="estimate"&&(t+=" \xB7 estim\xE9"),e.missedWhileAway&&(t+=" \xB7 absent"),t}n(v,"label");var Q="emphp-label",ee=["position:absolute","z-index:2","transform:translateX(-50%)","pointer-events:none","white-space:nowrap","font:10px Arial,sans-serif","color:#fff","text-shadow:-1px 0 #000,0 1px #000,1px 0 #000,0 -1px #000"].join(";"),c=null,u=null;function te(e){return c||(c=document.createElement("div"),c.className=Q,c.style.cssText=ee),c.parentNode!==e&&e.appendChild(c),c}n(te,"labelEl");function M(){c&&(c.style.display="none")}n(M,"hideLabel");function U(e,t,a){let r=e&&e.life;if(!r){M();return}if(!t){m(e);return}(r.hp!==t.hp||r.hp_max!==t.max)&&(r.hp=t.hp,r.hp_max=t.max,r.update(),u={life:r,hp:t.hp,max:t.max});let o=r.canvas;if(!r.display||!o||!o.parentNode){M();return}let i=te(o.parentNode);i.textContent=a,i.style.left=`${(parseInt(o.style.left,10)||0)+o.width/2}px`,i.style.top=`${(parseInt(o.style.top,10)||0)+o.height+1}px`,i.style.display=""}n(U,"paint");function m(e){M();let t=e&&e.life;u&&t&&u.life===t&&t.hp===u.hp&&t.hp_max===u.max&&(t.hp=-1,t.hp_max=-1,t.remove()),u=null}n(m,"clear");function W(){c&&(c.remove(),c=null),u=null}n(W,"unmount");var N={name:"EmperiumHP",version:"0.1.0-a.1",description:"War of Emperium : an HP bar on the castle's Emperium, which the server never sends. Starts at the castle's maximum (168 430 at defense 100, pre-renewal) and follows every hit and every Sanctuary / Apple of Idun heal seen on it, on the client's own monster HP bar with \xAB current / max \xB7 estim\xE9 \xBB under it. Kept while that Emperium lives \u2014 out of sight, map change, death \u2014 and flagged \xAB absent \xBB when hits may have been missed meanwhile ; a new Emperium starts full. Real HP from the server replaces the estimate ; hidden WoE damage shows no bar. /emphp prints the estimate.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/packet-observer","@robrowser/event-bus","@robrowser/lifecycle"],pars:{maxHp:168430}};var ue={maxHp:168430,...N.pars},z="emphp",pe="[EmperiumHP]",b="__emperiumHpStore",fe=1,me=["NOTIFY_ACT","NOTIFY_ACT2","NOTIFY_ACT3"],he=["NOTIFY_SKILL","NOTIFY_SKILL2","NOTIFY_SKILL_POSITION"],de=["USE_SKILL","USE_SKILL2"],xe=["NPCACK_MAPMOVE","NPCACK_SERVERMOVE","NPCACK_SERVERMOVE2"],s=I(),y="",p=0,H=Object.create(null);function S(e,t){G.addText(`${pe} ${e}`,t||G.TYPE.BLUE)}n(S,"say");function X(){return!!le&&typeof document<"u"&&typeof requestAnimationFrame=="function"}n(X,"hasUI");function D(e){if(F(e))return!0;let t=se.mapState;return!!(t&&(t.isGVG||t.isAgitZone))}n(D,"gvgMap");function d(){let e=f(ie.currentMap);return e!==y&&(g(s),y=e),e}n(d,"currentMap");function A(e){let t=d();return D(t)?Y(s,t,e):null}n(A,"entryFor");function x(e){e.hidden&&!H[e.map+e.gid]&&(H[e.map+e.gid]=!0,S("d\xE9g\xE2ts masqu\xE9s par le serveur, estimation impossible.")),L()}n(x,"changed");function Ee(e){return t=>{if(t.job!==1288)return;let a=d();D(a)&&x(R(s,a,t.GID,{fresh:e,hp:t.hp,maxHp:t.maxhp},ue.maxHp))}}n(Ee,"onSpawn");function Se(e){let t=e.type===fe;V(s,d(),e.GID,t)&&(t&&m(O.get(e.GID)),L())}n(Se,"onVanish");function ye(e){let t=A(e.targetGID);t&&(_(t,e.damage,e.leftDamage||0,e.count),x(t))}n(ye,"onAct");function Ae(e){let t=A(e.targetID);t&&(_(t,e.damage,0,e.count),x(t))}n(Ae,"onSkill");function Ie(e){if(e.SKID!==28||!e.result)return;let t=A(e.targetAID);t&&($(t,e.level),x(t))}n(Ie,"onUseSkill");function ge(e){let t=A(e.AID);t&&e.maxhp>0&&(w(t,e.hp,e.maxhp),x(t))}n(ge,"onMonsterHp");function _e(){g(s)}n(_e,"onMapMove");var P=!1;function q(){if(P)return;P=!0;let e=n((t,a)=>{let r=h.ZC[t],o=r&&r.id?ce(r,a):null;typeof o=="function"&&E(o)},"bind");for(let t in h.ZC){let a=/^NOTIFY_(NEW|STAND|MOVE)ENTRY\d*$/.exec(t);a&&e(t,Ee(a[1]==="NEW"))}e("NOTIFY_VANISH",Se);for(let t of me)e(t,ye);for(let t of he)e(t,Ae);for(let t of de)e(t,Ie);e("NOTIFY_MONSTER_HP",ge);for(let t of xe)e(t,_e)}n(q,"hookPackets");function L(){!p&&X()&&(p=requestAnimationFrame(k))}n(L,"schedule");function k(){p=0;let e=s[d()];if(!e)return;let t=e.away?null:O.get(e.gid);if(!T(e)){m(t);return}U(t,e,v(e)),p=requestAnimationFrame(k)}n(k,"frame");function we(){let e=d(),t=s[e];if(!t){S(D(e)?"aucun Emperium suivi sur cette carte.":"pas sur une carte de ch\xE2teau.");return}if(!T(t)){S("d\xE9g\xE2ts masqu\xE9s par le serveur, estimation impossible.");return}S(`Emperium ${t.gid} : ${v(t)}${t.away?" (hors de vue)":""}`)}n(we,"report");function B(){C.add(z,"Show the Emperium HP estimate of this castle",function(){we()})}n(B,"registerCommand");function Te(){let e=globalThis[b];if(delete globalThis[b],e){s=e;for(let t in s)s[t].away=!0}return h.ZC&&h.ZC.NOTIFY_VANISH&&h.ZC.NOTIFY_VANISH.id?q():E(Z(j.WIRE_COMPLETE,q)),C.$raw?B():E(Z(j.MAP_ENTER,B)),L(),E(()=>{p&&(cancelAnimationFrame(p),p=0);let t=s[y];t&&X()&&m(O.get(t.gid)),W(),globalThis[b]=s,s=I(),H=Object.create(null),y="",P=!1;try{C.remove(z)}catch{}}),!0}n(Te,"Init");var Ve={...N,init:Te};return { Ve }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { Ve }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { Ve }` → nothing, then append
	//      `export default Ve` so the module's default export is
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
		+ '\nexport default Ve\n'
		+ '//# sourceURL=EmperiumHP.js\n'
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
				console.error(`[EmperiumHP] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[EmperiumHP] PluginManager.register failed:`, e)
	}
})()

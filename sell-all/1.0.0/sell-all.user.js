// ==UserScript==
// @name         RO Plugin v3 — SellAll
// @namespace    robrowser
// @version      1.0.0
// @description  A « Sell all » button in the item list footer of the NPC sell window moves every listed stack to the selling list, as if each one was dropped with the quantity prompt skipped (NpcStore.receiveInventoryItemStack). Sends nothing : the player confirms with Sell. Favorites follow the favorite tab's deal lock (the engine leaves them out of the list while it is closed) ; on an inventory whose lock the player cannot see (InventoryV0, V1, V2) they always stay. No button on a bundle without receiveInventoryItemStack.
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/sell-all/1.0.0/sell-all.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/sell-all/1.0.0/sell-all.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_SellAll_v3'
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
	 * `.toString()`, reshaped from `return { te }` into
	 * `export default te`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var x=Object.defineProperty;var n=(e,t)=>x(e,"name",{value:t,configurable:!0});const { PACKET: p, UIManager: E } = await import("@robrowser/plugin-api");const { observePacket: V } = await import("@robrowser/packet-observer");const { once: $, EVENTS: q } = await import("@robrowser/event-bus");const { registerCleanup: m } = await import("@robrowser/lifecycle");function h(e){return e==="InventoryV3"}n(h,"dealLockShown");function b(e,t,r){let i=[];for(let o of e){let s=t(o);!s||!r&&s.PlaceETCTab||i.push(s)}return i}n(b,"sellAllPicks");const { Client: T, DB: v } = await import("@robrowser/plugin-api");var w="sa-sellall WinSell",C="Sell all",A="Move every item of the list to the selling list \u2014 nothing is sold before you press Sell",P="basic_interface/btn",d=["left","right","mid"],_="data/texture/\xC0\xAF\xC0\xFA\xC0\xCE\xC5\xCD\xC6\xE4\xC0\xCC\xBD\xBA/",N=["position:absolute","top:4px","right:16px","height:20px","padding:0 6px","margin:0","border:0","line-height:20px","font:inherit","color:inherit","white-space:nowrap","appearance:none","-webkit-appearance:none","background-color:transparent","background-repeat:no-repeat,no-repeat,repeat-x","background-position:left top,right top,left top","background-origin:border-box,border-box,content-box","background-clip:border-box,border-box,content-box"].join(";"),a={},l=null,f=!1,u=!1;function c(){if(!l)return;let e="out";u?e="press":f&&(e="over"),l.style.backgroundImage=a[e]||a.out||""}n(c,"paint");function B(e){if(e in a)return;a[e]="";let t=v&&v.INTERFACE_PATH||_,r=[],i=d.length;for(let o=0;o<d.length;o++)T.loadFile(`${t}${P}_${e}_${d[o]}.bmp`,s=>{r[o]=`url(${s})`,--i===0&&(a[e]=r.join(", "),c())})}n(B,"loadSkin");function R(e){let t=document.createElement("button");t.type="button",t.className=w,t.textContent=C,t.title=A,t.style.cssText=N,t.addEventListener("mouseover",()=>{f=!0,c()}),t.addEventListener("mouseout",()=>{f=!1,u=!1,c()}),t.addEventListener("mousedown",()=>{u=!0,c()}),t.addEventListener("mouseup",()=>{u=!1,c()}),t.addEventListener("click",e);for(let r of["out","over","press"])B(r);return t}n(R,"create");function y(e,t,r){let i=e.querySelector(".InputWindow .footer");if(i){for(let o of i.querySelectorAll(".sa-sellall"))o!==l&&o.remove();l||(l=R(r)),l.parentNode!==i&&(l.style.display=t?"":"none",i.appendChild(l))}}n(y,"mountButton");function g(){l&&l.remove(),l=null,f=!1,u=!1}n(g,"unmountButton");var S={name:"SellAll",version:"1.0.0",description:"A \xAB Sell all \xBB button in the item list footer of the NPC sell window moves every listed stack to the selling list, as if each one was dropped with the quantity prompt skipped (NpcStore.receiveInventoryItemStack). Sends nothing : the player confirms with Sell. Favorites follow the favorite tab's deal lock (the engine leaves them out of the list while it is closed) ; on an inventory whose lock the player cannot see (InventoryV0, V1, V2) they always stay. No button on a bundle without receiveInventoryItemStack.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/packet-observer","@robrowser/event-bus","@robrowser/lifecycle"],pars:{}};function k(){let e=null;try{e=E.getComponent("NpcStore")}catch{return null}return e&&typeof e.receiveInventoryItemStack=="function"&&e.getRoot?e:null}n(k,"store");function F(){let e=k(),t=null;try{t=E.getComponent("Inventory")}catch{return}if(!e||!t)return;let r=[];for(let o of e.getRoot().querySelectorAll(".InputWindow .content .item"))r.push(Number(o.dataset.index));let i=b(r,o=>t.getItemByIndex(o),h(t.name));for(let o of i)e.receiveInventoryItemStack(o)}n(F,"onSellAll");function L(){let e=k(),t=e&&e.getRoot();t&&y(t,e.getCurrentType()===e.Type.SELL,F)}n(L,"mount");function I(){let e=V(p.ZC.PC_SELL_ITEMLIST,()=>setTimeout(L,0));typeof e=="function"&&m(e)}n(I,"hookPackets");function W(){return p.ZC&&p.ZC.PC_SELL_ITEMLIST&&p.ZC.PC_SELL_ITEMLIST.id?I():m($(q.WIRE_COMPLETE,I)),L(),m(g),!0}n(W,"Init");var te={...S,init:W};return { te }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { te }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { te }` → nothing, then append
	//      `export default te` so the module's default export is
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
		+ '\nexport default te\n'
		+ '//# sourceURL=SellAll.js\n'
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
				console.error(`[SellAll] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[SellAll] PluginManager.register failed:`, e)
	}
})()

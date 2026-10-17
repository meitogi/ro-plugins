// ==UserScript==
// @name         RO Plugin v3 — ItemIconFallback
// @namespace    robrowser
// @version      0.1.0-a.2
// @description  Serve a placeholder icon when an item-icon texture (data/texture/<interface>/item/*.bmp) never resolves, so the inventory / cart / selection slot always paints and stays draggable + clickable. Wraps Client.loadFile for that path only : an explicit load error, or no callback at all within 3s, paints the client's own Apple icon (item/사과.bmp, the official clients' default for an unresolvable item), or a generated 24x24 '?' PNG when the Apple fails too. Covers the two upstream dead-ends — MemoryItem.onerror with an onload-only caller (nothing fires, blank forever) and Texture.load's missing img.onerror (the Memory slot stays pending forever, Memory.exist() keeps it from ever being re-requested). A real icon arriving late still overwrites the placeholder. Failing filenames are logged once each to the console and to the local dev-log server (file item-icon-fallback) so the underlying missing / undecodable assets can be identified.
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/item-icon-fallback/0.1.0-a.2/item-icon-fallback.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/item-icon-fallback/0.1.0-a.2/item-icon-fallback.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_ItemIconFallback_v3'
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
	 * `.toString()`, reshaped from `return { J }` into
	 * `export default J`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var L=Object.defineProperty;var n=(e,t)=>L(e,"name",{value:t,configurable:!0});const { Client: v } = await import("@robrowser/plugin-api");const { once: S, EVENTS: $ } = await import("@robrowser/event-bus");const { registerCleanup: A } = await import("@robrowser/lifecycle");var b={name:"ItemIconFallback",version:"0.1.0-a.2",description:"Serve a placeholder icon when an item-icon texture (data/texture/<interface>/item/*.bmp) never resolves, so the inventory / cart / selection slot always paints and stays draggable + clickable. Wraps Client.loadFile for that path only : an explicit load error, or no callback at all within 3s, paints the client's own Apple icon (item/\uC0AC\uACFC.bmp, the official clients' default for an unresolvable item), or a generated 24x24 '?' PNG when the Apple fails too. Covers the two upstream dead-ends \u2014 MemoryItem.onerror with an onload-only caller (nothing fires, blank forever) and Texture.load's missing img.onerror (the Memory slot stays pending forever, Memory.exist() keeps it from ever being re-requested). A real icon arriving late still overwrites the placeholder. Failing filenames are logged once each to the console and to the local dev-log server (file item-icon-fallback) so the underlying missing / undecodable assets can be identified.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:[],pars:{}};var T="\xBB\xE7\xB0\xFA",F="/item/";function R(e){let t=e.lastIndexOf(F)+F.length,l=`${e.slice(0,t)}${T}.bmp`;return e.toLowerCase()===l.toLowerCase()?null:l}n(R,"appleIconPath");function x({load:e,placeholder:t,timeoutMs:l}){let o="idle",c="",u=[];function r(){let p=u;u=[];let i=o==="ok"?c:t;for(let a of p)a(i)}return n(r,"flush"),n(function(i,a){let s=R(i);if(s===null){a(t);return}if(o==="ok"){a(c);return}if(o==="failed"){a(t);return}if(u.push(a),o==="loading")return;o="loading";let y=setTimeout(()=>{o==="loading"&&(o="failed",r())},l);e(s,C=>{clearTimeout(y),c=C,o="ok",r()},()=>{clearTimeout(y),o==="loading"&&(o="failed",r())})},"resolve")}n(x,"createFallbackSource");var g=3e3,h={},f=null,k=null,d=!1,m=null;function E(e){return typeof e=="string"&&e.indexOf("/item/")!==-1&&/\.bmp$/i.test(e)}n(E,"isItemIcon");function O(){let e=document.createElement("canvas");e.width=24,e.height=24;let t=e.getContext("2d");return t.fillStyle="rgba(48,48,58,0.55)",t.fillRect(0,0,24,24),t.strokeStyle="rgba(210,210,225,0.6)",t.lineWidth=1,t.setLineDash([3,2]),t.strokeRect(.5,.5,23,23),t.setLineDash([]),t.fillStyle="rgba(235,235,245,0.85)",t.font="bold 14px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("?",12,13),e.toDataURL("image/png")}n(O,"buildDummyIcon");function I(e,t){if(!h[e]){h[e]=1,console.warn(`[RO][ItemIconFallback] fallback served (${t}) : ${e}`);try{fetch("http://127.0.0.1:9876/log",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({ts:Date.now(),file:"item-icon-fallback",plugin:"item-icon-fallback",kind:"FALLBACK",cause:t,url:e}),keepalive:!0}).catch(()=>{})}catch{}}}n(I,"reportFallback");function w(){m=null;let e=v.$raw;if(!e||typeof e.loadFile!="function"){console.warn(`[RO][ItemIconFallback v${b.version}] Client.loadFile unavailable at install \u2014 aborting`);return}f=e.loadFile,k=x({load:n((l,o,c)=>f.call(e,l,o,c),"load"),placeholder:O(),timeoutMs:g}),d=!0;function t(l,o,c,u){if(!d||typeof o!="function"||!E(l))return f.call(this,l,o,c,u);let r=!1,p=!1,i=0,a=n(()=>{d&&k(l,s=>{!p&&d&&o(s)})},"paintFallback");return h[l]?(r=!0,a()):i=setTimeout(()=>{i=0,!(r||!d)&&(r=!0,I(l,"timeout"),a())},g),f.call(this,l,s=>{i&&(clearTimeout(i),i=0),r=!0,p=!0,h[l]&&delete h[l],o(s)},s=>{i&&(clearTimeout(i),i=0),r||(r=!0,I(l,"error"),a()),typeof c=="function"&&c(s)},u)}n(t,"patchedLoadFile"),t.__itemIconFallback=!0,e.loadFile=t,console.log(`%c[RO][ItemIconFallback v${b.version}] installed \u2014 item icons fall back to the Apple after ${g}ms`,"color:#8cf; font-weight:bold")}n(w,"install");function M(){if(d=!1,!f)return;let e=v.$raw;e&&e.loadFile&&e.loadFile.__itemIconFallback&&(e.loadFile=f),f=null,k=null}n(M,"restore");function D(){return typeof v.loadFile=="function"?w():m=S($.WIRE_COMPLETE,w),A(({reason:e}={})=>{if(typeof m=="function"){try{m()}catch{}m=null}M(),console.log(`[RO][ItemIconFallback] restored Client.loadFile (reason=${e})`)}),!0}n(D,"Init");var J={...b,init:D};return { J }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { J }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { J }` → nothing, then append
	//      `export default J` so the module's default export is
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
		+ '\nexport default J\n'
		+ '//# sourceURL=ItemIconFallback.js\n'
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
				console.error(`[ItemIconFallback] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[ItemIconFallback] PluginManager.register failed:`, e)
	}
})()

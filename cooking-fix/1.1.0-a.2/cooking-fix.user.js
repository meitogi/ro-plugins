// ==UserScript==
// @name         RO Plugin v3 — CookingFix
// @namespace    robrowser
// @version      1.1.0-a.2
// @description  Runtime shim for MakeItemSelection. (1) Fixes the Cooking (Manufacturing List) auto-select bug — upstream typo list[0].ITID → list[0]. (2) Silently no-ops the Ok button when no recipe is selected (mirrors native Ragexe hasSelection=0 guard). Temporary — remove after upstream fix merges + cyro redeploys. Note : the last-selected-ITID memory feature previously landed here in 1.1.0-a.1 has been moved to TabTargetNative for scope purity (autocraft UX = tab-target's domain).
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/cooking-fix/1.1.0-a.2/cooking-fix.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/cooking-fix/1.1.0-a.2/cooking-fix.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_CookingFix_v3'
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
	 * `.toString()`, reshaped from `return { b }` into
	 * `export default b`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var d=Object.defineProperty;var o=(e,i)=>d(e,"name",{value:i,configurable:!0});const { UIManager: g } = await import("@robrowser/plugin-api");const { once: p, EVENTS: u } = await import("@robrowser/event-bus");const { registerCleanup: f } = await import("@robrowser/lifecycle");var t={name:"CookingFix",version:"1.1.0-a.2",description:"Runtime shim for MakeItemSelection. (1) Fixes the Cooking (Manufacturing List) auto-select bug \u2014 upstream typo list[0].ITID \u2192 list[0]. (2) Silently no-ops the Ok button when no recipe is selected (mirrors native Ragexe hasSelection=0 guard). Temporary \u2014 remove after upstream fix merges + cyro redeploys. Note : the last-selected-ITID memory feature previously landed here in 1.1.0-a.1 has been moved to TabTargetNative for scope purity (autocraft UX = tab-target's domain).",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/lifecycle","@robrowser/event-bus","@robrowser/plugin-api"]};function h(){let e=g.components.MakeItemSelection;if(!e){console.warn(`[RO][CookingFix v${t.version}] MakeItemSelection not registered at WIRE_COMPLETE \u2014 shim not installed`);return}let i=e.setCookingList,s=e.selectIndex,l=o(function(r,c){i.call(this,r,c),r&&r.length>0&&this.index==null&&this.setIndex(r[0])},"wrappedSetCookingList"),a=o(function(){if(this.index==null){this.remove();return}return s.call(this)},"wrappedSelectIndex");e.setCookingList=l,e.selectIndex=a,f(({reason:n}={})=>{e.setCookingList===l&&(e.setCookingList=i),e.selectIndex===a&&(e.selectIndex=s),n==="reload"&&console.log(`[RO][CookingFix v${t.version}] shim removed (reason=${n})`)})}o(h,"installShim");function I(){return console.log(`%c[RO][CookingFix v${t.version}] Plugin loaded`,"color: #f80; font-weight: bold"),p(u.WIRE_COMPLETE,h),!0}o(I,"Init");var b={...t,init:I};return { b }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { b }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { b }` → nothing, then append
	//      `export default b` so the module's default export is
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
		+ '\nexport default b\n'
		+ '//# sourceURL=CookingFix.js\n'
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
				console.error(`[CookingFix] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[CookingFix] PluginManager.register failed:`, e)
	}
})()

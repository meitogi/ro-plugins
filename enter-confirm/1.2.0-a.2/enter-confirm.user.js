// ==UserScript==
// @name         RO Plugin v3 — EnterConfirm
// @namespace    robrowser
// @version      1.2.0-a.2
// @description  Press Enter to click the primary action button of the topmost whitelisted UI window (MakeItemSelection, ItemSelection, Refine). Mirrors NpcBox's native Enter handling for windows that don't have it. ItemSelection covers Sage Auto Spell (SA_AUTOSPELL), Skill Select (Fire Chain), and Item Identify.
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/enter-confirm/1.2.0-a.2/enter-confirm.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/enter-confirm/1.2.0-a.2/enter-confirm.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_EnterConfirm_v3'
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
	 * `.toString()`, reshaped from `return { E }` into
	 * `export default E`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var f=Object.defineProperty;var i=(t,n)=>f(t,"name",{value:n,configurable:!0});const { registerCleanup: d } = await import("@robrowser/lifecycle");var s={name:"EnterConfirm",version:"1.2.0-a.2",description:"Press Enter to click the primary action button of the topmost whitelisted UI window (MakeItemSelection, ItemSelection, Refine). Mirrors NpcBox's native Enter handling for windows that don't have it. ItemSelection covers Sage Auto Spell (SA_AUTOSPELL), Skill Select (Fire Chain), and Item Identify.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/lifecycle"],pars:{whitelist:["MakeItemSelection","ItemSelection","Refine"],buttonSelectors:[".ok",".refine_enabled",".back_button",".next",".close"]}};function m(t){let n=[];for(let r of t){let o=document.getElementById(r);if(!o||o.offsetParent===null)continue;let e=parseInt(getComputedStyle(o).zIndex,10)||0;n.push({el:o,z:e})}return n.length===0?null:(n.sort((r,o)=>o.z-r.z),n[0].el)}i(m,"findTopmostWhitelisted");function h(t,n){let r=t.shadowRoot||t;for(let o of n){let e=r.querySelector(o);if(e&&e.offsetParent!==null)return e}return null}i(h,"findFirstVisibleButton");function y(t){let n=t&&Array.isArray(t.whitelist)?t.whitelist:[],r=t&&Array.isArray(t.buttonSelectors)?t.buttonSelectors:[];if(n.length===0||r.length===0)return;let o=i(e=>{if(e.key!=="Enter"||e.ctrlKey||e.altKey||e.metaKey||e.shiftKey)return;let l=e.target;if(l&&(l.tagName==="INPUT"||l.tagName==="TEXTAREA"||l.isContentEditable))return;let c=m(n);if(!c)return;let a=h(c,r);a&&(a.click(),e.preventDefault(),e.stopPropagation())},"handler");window.addEventListener("keydown",o,!0),d(({reason:e})=>{window.removeEventListener("keydown",o,!0),e==="reload"&&console.log(`[EnterConfirm v${s.version}] keydown handler removed (reason=${e})`)})}i(y,"installKeydownCapture");function w(t){return console.log(`%c[RO][EnterConfirm v${s.version}] Plugin loaded`,"color: #0ff; font-weight: bold"),y(t),!0}i(w,"Init");var E={...s,init:w};return { E }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { E }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { E }` → nothing, then append
	//      `export default E` so the module's default export is
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
		+ '\nexport default E\n'
		+ '//# sourceURL=EnterConfirm.js\n'
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
				console.error(`[EnterConfirm] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[EnterConfirm] PluginManager.register failed:`, e)
	}
})()

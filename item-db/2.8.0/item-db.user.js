// ==UserScript==
// @name         RO Plugin v3 — ItemDb
// @namespace    robrowser
// @version      2.8.0
// @description  The pre-renewal item database as a plugin, for the native Plugin Manager: the gzipped bundles of the ro-item-db repo pinned to one commit (jsDelivr, then raw.githubusercontent, plain fetch), cached in IndexedDB (ROFW_items), or a bundle file loaded by the player (loadFile, kept until useOnline). Its init() return is deps.ItemDb for ItemInfo, DropNotifier and TabTarget. Same code as the @robrowser/item-db lib (libs/item-db/src/core.js).
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/item-db/2.8.0/item-db.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/item-db/2.8.0/item-db.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_ItemDb_v3'
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
	 * `.toString()`, reshaped from `return { be }` into
	 * `export default be`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var H=Object.defineProperty;var t=(e,n)=>H(e,"name",{value:n,configurable:!0});function P(e){let n=null,r=null;async function l(){let a=null;try{await e.readCache("mobsVersion")===e.version&&(a=await e.readCache("mobs"))}catch(c){console.warn("[ItemDB] mobs cache unreadable, refetching:",c)}if(a)return console.log(`[ItemDB] mobs cache hit (version ${e.version})`),a;let b=(await e.download()).mobs;try{await e.writeCache("mobs",b),await e.writeCache("mobsVersion",e.version)}catch(c){console.warn("[ItemDB] mobs cache write failed:",c)}return b}t(l,"fromCacheOrNetwork");function S(){return r||(r=l().then(a=>(n=a,console.log(`[ItemDB] ${Object.keys(a).length} mobs ready`),a)),r.catch(()=>{r=null})),r}t(S,"load");function k(a){return n&&n[String(a)]||null}t(k,"get");function y(a){n=a,r=Promise.resolve(a)}t(y,"put");function u(){n=null,r=null}return t(u,"forget"),{load:S,get:k,put:y,forget:u}}t(P,"createMobStore");var L="Stitchuuuu/ro-item-db",p="d4e42e6991454c61f6327e13720eddbab5085763",_="bundles/cyro.json.gz",A=_.replace(/\.json\.gz$/,".mobs.json.gz"),x=t(e=>`https://cdn.jsdelivr.net/gh/${L}@${p}/${e}`,"cdnUrl"),K=t(e=>`https://raw.githubusercontent.com/${L}/${p}/${e}`,"rawUrl");async function J(e){let n=new Response(e).body.pipeThrough(new DecompressionStream("gzip"));return await new Response(n).text()}t(J,"ungzip");async function E(e){let n=new Uint8Array(e,0,2),r=n[0]===31&&n[1]===139?await J(e):new TextDecoder().decode(e);return JSON.parse(r)}t(E,"parseBundle");async function G(e){let n=new Uint8Array(await globalThis.crypto.subtle.digest("SHA-256",e)),r="";for(let l=0;l<6;l++)r+=n[l].toString(16).padStart(2,"0");return`file:${r}`}t(G,"fileTag");function R({fetchBytes:e,store:n}){let r=null,l={},S={},k=null,y=null,u=null,a=p,m=p;async function b(o){try{return await e(x(o))}catch(s){return console.warn(`[ItemDB] ${x(o)} failed (${s.message}) \u2014 retrying via raw.githubusercontent`),await e(K(o))}}t(b,"fetchBundle");function c(o){r=o.items,l=o.skillNames??{},S=o.mobNames??{},k=o.manifest??null,y=null}t(c,"usePayload");async function f(o,s){await n.replaceItems(o.items),await n.writeMeta("version",s),await n.writeMeta("fetchedAt",new Date().toISOString()),await n.writeMeta("itemCount",Object.keys(o.items).length),await n.writeMeta("manifest",o.manifest),await n.writeMeta("skillNames",o.skillNames),await n.writeMeta("mobNames",o.mobNames),c(o),a=s}t(f,"populate");async function O(){console.log(`[ItemDB] fetching DB from ${x(_)}`);let o=await b(_);console.log(`[ItemDB] downloaded ${(o.byteLength/1024).toFixed(1)} KB, decompressing`),await f(await E(o),p),u={kind:"online",commit:p},await n.deleteMeta("source")}t(O,"fetchOnline");async function C(){let o=await n.readMeta("version"),s=await n.readMeta("source"),i=await n.readMeta("mobsSource");i&&(m=i.tag);let d=s?s.tag:p;return o!==d?await O():(console.log(`[ItemDB] cache hit (version ${o}), loading from IndexedDB`),c({items:await n.loadItems(),skillNames:await n.readMeta("skillNames"),mobNames:await n.readMeta("mobNames"),manifest:await n.readMeta("manifest")}),a=o,u=s||{kind:"online",commit:p}),console.log(`%c[ItemDB] ready \u2014 ${Object.keys(r).length} items (${a})`,"color: #0af; font-weight: bold"),r}t(C,"bootstrap");let B=P({get version(){return m},async download(){if(m!==p)throw new Error("the mobs file loaded earlier is gone from the cache \u2014 load it again");return console.log(`[ItemDB] fetching mobs from ${x(A)}`),E(await b(A))},readCache:t(o=>n.readMeta(o),"readCache"),writeCache:t((o,s)=>n.writeMeta(o,s),"writeCache")});async function v(o){let s=await o.arrayBuffer(),i;try{i=await E(s)}catch{throw new Error(`${o.name||"this file"} is not an item DB bundle (cyro.json.gz)`)}let d=await G(s),w={kind:"file",name:o.name||"file",loadedAt:new Date().toISOString(),builtAt:i?.manifest?.builtAt??null,tag:d};if(i&&i.items)return await f(i,d),await n.writeMeta("source",w),u=w,{kind:"items",count:Object.keys(i.items).length};if(i&&i.mobs)return await n.writeMeta("mobs",i.mobs),await n.writeMeta("mobsVersion",d),await n.writeMeta("mobsSource",w),m=d,B.put(i.mobs),{kind:"mobs",count:Object.keys(i.mobs).length};throw new Error(`${o.name||"this file"} is not an item DB bundle (no items, no mobs)`)}t(v,"loadFile");async function U(){await O(),await n.deleteMeta("mobsSource"),m=p,B.forget()}t(U,"useOnline");function $(o){return r&&(r[String(o)]||r[Number(o)])||null}t($,"get");function V(o){if(!r)return[];let s=String(o||"").toLowerCase();if(!s)return[];let i=[],d=[],w=[];for(let h in r){let g=r[h],M=(g.name||"").toLowerCase();if(!M)continue;let N={id:Number(h),name:g.name};M===s?i.push(N):M.startsWith(s)?d.push(N):M.includes(s)&&w.push(N)}let j=t((h,g)=>h.name.length-g.name.length||h.id-g.id,"byNameLen");return d.sort(j),w.sort(j),[...i,...d,...d.length?[]:w]}t(V,"search");function q(o){let s=String(o||"").toLowerCase();if(!s)return[];let i=[],d=[],w=[];for(let h in S){let g=S[h],M=g.toLowerCase(),N={id:Number(h),name:g};M===s?i.push(N):M.startsWith(s)?d.push(N):M.includes(s)&&w.push(N)}let j=t((h,g)=>h.name.length-g.name.length||h.id-g.id,"byNameLen");return d.sort(j),w.sort(j),[...i,...d,...d.length?[]:w]}t(q,"searchMobs");function W(o){if(!y){y={};for(let s in l){let i=l[s];y[i.id]={aegis:s,desc:i.desc}}}return y[o]||null}return t(W,"skillById"),{start:C,get:$,search:V,all:t(()=>r,"all"),usedBy:t(o=>$(o)?.consumedBy||null,"usedBy"),producedBy:t(o=>$(o)?.producedBy||null,"producedBy"),unlocks:t(o=>$(o)?.unlocks||null,"unlocks"),count:t(()=>r?Object.keys(r).length:0,"count"),skillName:t(o=>l[o]||null,"skillName"),mobName:t(o=>S[String(o)]||null,"mobName"),manifest:t(()=>k,"manifest"),searchMobs:q,skillById:W,loadMobs:t(()=>B.load(),"loadMobs"),mob:t(o=>B.get(o),"mob"),version:t(()=>a,"version"),source:t(()=>u,"source"),loadFile:v,useOnline:U}}t(R,"createItemDb");var Q="ROFW_items";var D="items",I="meta";function X(){return new Promise((e,n)=>{let r=indexedDB.open(Q,1);r.onupgradeneeded=()=>{let l=r.result;l.objectStoreNames.contains(D)||l.createObjectStore(D),l.objectStoreNames.contains(I)||l.createObjectStore(I)},r.onsuccess=()=>e(r.result),r.onerror=()=>n(r.error)})}t(X,"openDb");function T(e){return new Promise((n,r)=>{e.oncomplete=()=>n(),e.onerror=()=>r(e.error),e.onabort=()=>r(e.error||new Error("tx aborted"))})}t(T,"txPromise");function z(){let e=null;function n(){return e||(e=X(),e.catch(()=>{e=null})),e}t(n,"getDb");async function r(u){let a=await n();return new Promise((m,b)=>{let c=a.transaction(I,"readonly").objectStore(I).get(u);c.onsuccess=()=>m(c.result),c.onerror=()=>b(c.error)})}t(r,"readMeta");async function l(u,a){let m=(await n()).transaction(I,"readwrite");return m.objectStore(I).put(a,u),T(m)}t(l,"writeMeta");async function S(u){let a=(await n()).transaction(I,"readwrite");return a.objectStore(I).delete(u),T(a)}t(S,"deleteMeta");async function k(u){let a=await n(),m=a.transaction(D,"readwrite");m.objectStore(D).clear(),await T(m);let b=Object.keys(u),c=1e3;for(let f=0;f<b.length;f+=c){let O=a.transaction(D,"readwrite"),C=O.objectStore(D);for(let B=f;B<Math.min(f+c,b.length);B++){let v=b[B];C.put(u[v],Number(v))}await T(O)}}t(k,"replaceItems");async function y(){let u=await n();return new Promise((a,m)=>{let b={},c=u.transaction(D,"readonly").objectStore(D).openCursor();c.onsuccess=()=>{let f=c.result;f?(b[String(f.key)]=f.value,f.continue()):a(b)},c.onerror=()=>m(c.error)})}return t(y,"loadItems"),{readMeta:r,writeMeta:l,deleteMeta:S,replaceItems:k,loadItems:y}}t(z,"createIdbStore");var F={name:"ItemDb",version:"2.8.0",description:"The pre-renewal item database as a plugin, for the native Plugin Manager: the gzipped bundles of the ro-item-db repo pinned to one commit (jsDelivr, then raw.githubusercontent, plain fetch), cached in IndexedDB (ROFW_items), or a bundle file loaded by the player (loadFile, kept until useOnline). Its init() return is deps.ItemDb for ItemInfo, DropNotifier and TabTarget. Same code as the @robrowser/item-db lib (libs/item-db/src/core.js).",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:[],pars:{}};async function Z(e){let n=await globalThis.fetch(e);if(!n.ok)throw new Error(`HTTP ${n.status}`);return n.arrayBuffer()}t(Z,"fetchBytes");function ee(){let e=R({fetchBytes:Z,store:z()}),n=e.start().catch(r=>(console.error("[ItemDB] init failed:",r),e.all()||{}));return{get:e.get,search:e.search,all:e.all,usedBy:e.usedBy,producedBy:e.producedBy,unlocks:e.unlocks,count:e.count,get version(){return e.version()},mobName:e.mobName,searchMobs:e.searchMobs,skillById:e.skillById,loadMobs:e.loadMobs,mob:e.mob,loadFile:e.loadFile,useOnline:e.useOnline,source:e.source,ready:n}}t(ee,"Init");var be={...F,init:ee};return { be }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { be }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { be }` → nothing, then append
	//      `export default be` so the module's default export is
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
		+ '\nexport default be\n'
		+ '//# sourceURL=ItemDb.js\n'
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
				console.error(`[ItemDb] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[ItemDb] PluginManager.register failed:`, e)
	}
})()

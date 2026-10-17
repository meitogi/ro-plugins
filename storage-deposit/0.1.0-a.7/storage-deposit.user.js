// ==UserScript==
// @name         RO Plugin v3 — StorageDeposit
// @namespace    robrowser
// @version      0.1.0-a.7
// @description  /deposit, or the Quick stack button at the bottom right of the inventory — while the personal storage is open, moves to it every inventory stack whose item the storage already holds. Stackables matched by item id ; equipment, equipped ammo, favorites and rentals stay put. One deposit at a time, each waiting for the server's answer plus a short human-like pause ; stops with a chat line when the storage is full. Refuses to run on the guild storage.
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/storage-deposit/0.1.0-a.7/storage-deposit.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/storage-deposit/0.1.0-a.7/storage-deposit.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_StorageDeposit_v3'
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
		var se=Object.defineProperty;var n=(e,t)=>se(e,"name",{value:t,configurable:!0});const { PACKET: O, UIManager: Se, ChatBox: f, Commands: U } = await import("@robrowser/plugin-api");const { observePacket: _e } = await import("@robrowser/packet-observer");const { on: ge, once: j, EVENTS: k } = await import("@robrowser/event-bus");const { registerCleanup: y } = await import("@robrowser/lifecycle");var ue={4:!0,5:!0,7:!0,8:!0,12:!0};function q(e,t){let o={};for(let r of t)r.ITID in o||(o[r.ITID]=3e4-r.count);let s=[];for(let r of e){if(!(r.ITID in o)||ue[r.type]||r.WearState||r.PlaceETCTab||r.HireExpireDate)continue;let g=Math.min(r.count,o[r.ITID]);g<1||(o[r.ITID]-=g,s.push({index:r.index,count:g}))}return s}n(q,"selectDeposits");var N="Guild Storage";function K(e,t,o){return!e||t===N?"hidden":o?"busy":"ready"}n(K,"buttonState");const { Client: ae, DB: Z, UIManager: ce } = await import("@robrowser/plugin-api");var z="sd-deposit",le="Quick stack",fe="Add to existing stacks: moves every item the storage already holds",de="basic_interface/btn",P=["left","right","mid"],Te="data/texture/\xC0\xAF\xC0\xFA\xC0\xCE\xC5\xCD\xC6\xE4\xC0\xCC\xBD\xBA/",Ie=["position:absolute","right:16px","bottom:0","z-index:1","height:16px","padding:0 5px","margin:0","border:0","line-height:16px","font:inherit","font-size:11px","color:inherit","white-space:nowrap","cursor:pointer","appearance:none","-webkit-appearance:none","background-color:transparent","background-repeat:no-repeat,no-repeat,repeat-x","background-position:left top,right top,left top","background-origin:border-box,border-box,content-box","background-clip:border-box,border-box,content-box","background-size:6px 16px,6px 16px,auto 16px"].join(";"),M={},i=null,m="hidden",L=!1,b=!1,c=null;function Ee(e){if(e in M)return;M[e]="";let t=Z&&Z.INTERFACE_PATH||Te,o=[],s=P.length;for(let r=0;r<P.length;r++)ae.loadFile(`${t}${de}_${e}_${P[r]}.bmp`,g=>{o[r]=`url(${g})`,--s===0&&(M[e]=o.join(", "),l())})}n(Ee,"loadSkin");function l(){if(!i)return;i.style.display=m==="hidden"?"none":"",i.disabled=m==="busy";let e="out";!i.disabled&&b?e="press":!i.disabled&&L&&(e="over"),i.style.backgroundImage=M[e]||M.out||"",i.style.opacity=i.disabled?"0.5":"",i.style.cursor=i.disabled?"default":"pointer"}n(l,"paint");function pe(e){let t=document.createElement("button");t.type="button",t.className=z,t.textContent=le,t.title=fe,t.style.cssText=Ie,t.addEventListener("mouseover",()=>{L=!0,l()}),t.addEventListener("mouseout",()=>{L=!1,b=!1,l()}),t.addEventListener("mousedown",o=>{o.stopPropagation(),b=!0,l()}),t.addEventListener("mouseup",()=>{b=!1,l()}),t.addEventListener("click",o=>{o.stopPropagation(),t.disabled||e()});for(let o of["out","over","press"])Ee(o);return t}n(pe,"create");function H(e){if(i&&i.isConnected)return!0;let t=null;try{t=ce.getComponent("Inventory")}catch{return!1}let o=t&&(t.getRoot?t.getRoot():t.ui&&t.ui[0]),s=o&&o.querySelector(".footer");if(!s)return!1;for(let r of s.querySelectorAll(`.${z}`))r!==i&&r.remove();return i||(i=pe(e)),s.appendChild(i),!0}n(H,"attach");function C(){c&&(c.disconnect(),c=null)}n(C,"stopWaiting");function me(e){if(c)return;let t=n(()=>{(m==="hidden"||H(e))&&(C(),l())},"retry");c=new MutationObserver(()=>{t(),requestAnimationFrame(()=>c&&t())}),c.observe(document.body,{childList:!0})}n(me,"waitForInventory");function V(e,t){m=e,m==="hidden"?C():H(t)||me(t),l()}n(V,"setButtonState");function W(){C(),i&&i.remove(),i=null,m="hidden",L=!1,b=!1}n(W,"unmountButton");var w={name:"StorageDeposit",version:"0.1.0-a.7",description:"/deposit, or the Quick stack button at the bottom right of the inventory \u2014 while the personal storage is open, moves to it every inventory stack whose item the storage already holds. Stackables matched by item id ; equipment, equipped ammo, favorites and rentals stay put. One deposit at a time, each waiting for the server's answer plus a short human-like pause ; stops with a chat line when the storage is full. Refuses to run on the guild storage.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:["@robrowser/packet-observer","@robrowser/event-bus","@robrowser/lifecycle"],pars:{humanMinMs:180,humanMaxMs:520,ackTimeoutMs:3e3}};var v={humanMinMs:180,humanMaxMs:520,ackTimeoutMs:3e3,...w.pars},ee="deposit",$="__storageDepositMirror",Me="[Deposit]",te=2,be=["STORE_NORMAL_ITEMLIST","STORE_NORMAL_ITEMLIST2","STORE_NORMAL_ITEMLIST3","STORE_NORMAL_ITEMLIST4","STORE_EQUIPMENT_ITEMLIST","STORE_EQUIPMENT_ITEMLIST2","STORE_EQUIPMENT_ITEMLIST3","STORE_EQUIPMENT_ITEMLIST4","STORE_EQUIPMENT_ITEMLIST5"],ye=["SPLIT_SEND_ITEMLIST_NORMAL","SPLIT_SEND_ITEMLIST_EQUIP","SPLIT_SEND_ITEMLIST_EQUIP2"],xe=["ADD_ITEM_TO_STORE","ADD_ITEM_TO_STORE2","ADD_ITEM_TO_STORE3","ADD_ITEM_TO_STORE4"],h=!1,T="",u={},S=0,d=0;function Q(){h=!1,T="",u={},S=0,d=0}n(Q,"resetStorage");function ne(e){if(e)for(let t of e)u[t.index]={ITID:t.ITID,count:t.count}}n(ne,"addList");function Re(){let e=[];for(let t in u)e.push(u[t]);return e}n(Re,"storageList");var D=[],I=null,E=null,_=0,x=0;function a(e,t){f.addText(`${Me} ${e}`,t||f.TYPE.BLUE)}n(a,"say");function A(e){return Se.getComponent(e)}n(A,"engineUI");function oe(e){let t=null;try{t=A("Inventory")}catch{return null}return t.getItemByIndex(e)}n(oe,"inventoryItem");function Le(){return v.humanMinMs+Math.floor(Math.random()*Math.max(1,v.humanMaxMs-v.humanMinMs))}n(Le,"humanDelay");function G(){return I!==null||E!==null}n(G,"running");function p(){V(K(h,T,G()),re)}n(p,"refresh");function R(e,t){clearTimeout(E),E=null,I=null,D=[],p(),e&&a(e,t)}n(R,"stop");function F(){E=null;let e=D.shift();if(!e){R(`done \u2014 ${_} stack(s) stored${x?`, ${x} skipped`:""}.`);return}let t=oe(e.index);if(!t||t.ITID!==e.ITID||t.count<1){x++,F();return}try{A("Storage").reqAddItem(e.index,Math.min(e.count,t.count))}catch{R(`storage window not found \u2014 stopped after ${_} stack(s).`,f.TYPE.ERROR);return}I={ITID:t.ITID},E=setTimeout(Y,v.ackTimeoutMs,!1)}n(F,"sendNext");function Y(e){if(clearTimeout(E),I=null,e)_++;else if(d&&S>=d){R(`storage full (${S}/${d}) \u2014 stopped after ${_} stack(s).`,f.TYPE.ERROR);return}else x++;E=setTimeout(F,Le())}n(Y,"onAnswer");function re(){if(G()){a("already depositing.");return}if(!h){a("open your storage first.",f.TYPE.ERROR);return}if(T===N){a("works on your own storage only, not the guild storage.",f.TYPE.ERROR);return}let e=null;try{e=A("Inventory").list}catch{e=null}if(!e){a("inventory not ready.",f.TYPE.ERROR);return}let t=q(e,Re());if(!t.length){a("nothing in your inventory is already in storage.");return}D=[];for(let o of t)D.push({index:o.index,count:o.count,ITID:oe(o.index).ITID});_=0,x=0,a(`storing ${t.length} stack(s)\u2026`),F(),p()}n(re,"run");function Oe(e){e.invType===te&&(Q(),T=String(e.name||"").replace(/\0.*$/,""),p())}n(Oe,"onListStart");function ve(e){e.invType===te&&ne(e.ItemInfo||e.itemInfo)}n(ve,"onSplitList");function De(e){e.Name&&(T=e.Name),ne(e.ItemInfo||e.itemInfo),p()}n(De,"onStoreList");function Ae(e){h=!0,S=e.curCount,d=e.maxCount,p()}n(Ae,"onCount");function Ne(e){let t=u[e.index];t?t.count+=e.count:u[e.index]={ITID:e.ITID,count:e.count},I&&e.ITID===I.ITID&&Y(!0)}n(Ne,"onAdded");function Pe(e){if(e.count===0){I&&Y(!1);return}let t=u[e.index];t&&(t.count-=e.count,t.count<=0&&delete u[e.index])}n(Pe,"onRemoved");function ie(){G()&&R(`storage closed \u2014 stopped after ${_} stack(s).`),Q(),p()}n(ie,"onClose");var B=!1;function X(){if(B)return;B=!0;let e=n((t,o)=>{let s=O.ZC[t],r=s&&s.id?_e(s,o):null;typeof r=="function"&&y(r)},"bind");e("SPLIT_SEND_ITEMLIST_SET",Oe);for(let t of ye)e(t,ve);for(let t of be)e(t,De);for(let t of xe)e(t,Ne);e("NOTIFY_STOREITEM_COUNTINFO",Ae),e("DELETE_ITEM_FROM_STORE",Pe),e("CLOSE_STORE",ie)}n(X,"hookPackets");function J(){U.add(ee,"Store every inventory item the open storage already holds",function(){re()})}n(J,"registerCommand");function Ce(){O.ZC&&O.ZC.CLOSE_STORE&&O.ZC.CLOSE_STORE.id?X():y(j(k.WIRE_COMPLETE,X)),U.$raw?J():y(j(k.MAP_ENTER,J));let e=globalThis[$];delete globalThis[$];let t=!1;try{t=!!A("Storage").__active}catch{}return t&&e?(h=!0,T=e.storeName,u=e.items,S=e.cur,d=e.max,p()):t&&a("reopen your storage to use Quick stack."),y(ge(k.MAP_LEAVE,ie)),y(()=>{R(),h&&(globalThis[$]={storeName:T,items:u,cur:S,max:d}),Q(),W(),B=!1;try{U.remove(ee)}catch{}}),!0}n(Ce,"Init");var Ve={...w,init:Ce};return { Ve }
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
		+ '//# sourceURL=StorageDeposit.js\n'
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
				console.error(`[StorageDeposit] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[StorageDeposit] PluginManager.register failed:`, e)
	}
})()

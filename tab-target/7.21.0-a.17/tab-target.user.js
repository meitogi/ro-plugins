// ==UserScript==
// @name         RO Plugin v3 — TabTargetNative
// @namespace    robrowser
// @version      7.21.0-a.17
// @description  Tab / Shift+Tab / Enter targeting with native UIComponent panel; the lock key (default: the key above Tab — ² on Windows AZERTY, @ on Mac AZERTY — rebindable from the panel) or /focus locks the target (nothing moves it — Tab, list or world click, manual attack/skill, homun/merc — Space and skill keys keep hitting it ; survives leaving sight, released on death or toggling it again) and auto-focus on manual attack. Optional per-character checkbox auto-focuses the mob the player's own homunculus/mercenary attacks (melee or skill), with owner-priority: the player's last manual target holds focus for a few seconds so a minion hit won't yank it away. /tt and /tabtarget chat commands toggle the panel. Digit row 1-9 (layout-agnostic) auto-targets the locked mob on native skillbar F2 slots 1-9, shown as two panel rows (5 + 4) of split buttons: the number (left) casts, the right segment is a tri-state per-slot mode (off / A=auto-craft (hold) / S=self-cast), persisted per character. A holds a key to loop cast → confirm MakeItemSelection → re-cast (Prepare Potion, Arrow Making, Cooking…) and remembers the last confirmed ITID to re-select it on subsequent cycles (uniform across crafts, falls back to list[0] if the memory isn't in the new list, resets on page reload); S auto-casts the skill on the player (PLACE/TRAP under-foot, others on player GID); Ctrl+digit falls through to the native skillbar. Triple-click the titlebar to toggle the legacy Prev/Attack/Next debug buttons at runtime.
// @match        *://*.cyro.live/*
// @match        *://cyro.live/*
// @run-at       document-start
// @grant        unsafeWindow
// @updateURL    https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/tab-target/7.21.0-a.17/tab-target.user.js
// @downloadURL  https://cdn.jsdelivr.net/gh/meitogi/ro-plugins@main/tab-target/7.21.0-a.17/tab-target.user.js
// ==/UserScript==

(async function () {
	'use strict'
	const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

	// Bootstrap-level dedup — same flag scheme as legacy plugins so a v2/v3
	// install of the same plugin never double-runs.
	const FLAG = '__RO_plugin_loaded_TabTargetNative_v3'
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
	 * `.toString()`, reshaped from `return { ao }` into
	 * `export default ao`, and loaded via Blob URL so the module
	 * runs in PAGE context (same realm as PluginManager and libs).
	 * ============================================================ */
	async function pluginCode() {
		var ee=Object.defineProperty;var i=(t,e)=>ee(t,"name",{value:e,configurable:!0});const { EntityManager: T, UIComponent: ne, ChatBox: ft, PACKET: f, Session: b, PathFinding: se, Network: at, SkillTargetSelection: Y, ShortCut: O, Camera: ie, Commands: yt, SkillConst: z, Preferences: L, MapRenderer: ae, UIManager: re } = await import("@robrowser/plugin-api");const { observePacket: le, observeSendPacket: ce } = await import("@robrowser/packet-observer");const { on: vt, once: Pt, EVENTS: Q } = await import("@robrowser/event-bus");const { registerCleanup: Bt } = await import("@robrowser/lifecycle");const Zt = await import("@robrowser/ui");var et={name:"TabTargetNative",version:"7.21.0-a.17",description:"Tab / Shift+Tab / Enter targeting with native UIComponent panel; the lock key (default: the key above Tab \u2014 \xB2 on Windows AZERTY, @ on Mac AZERTY \u2014 rebindable from the panel) or /focus locks the target (nothing moves it \u2014 Tab, list or world click, manual attack/skill, homun/merc \u2014 Space and skill keys keep hitting it ; survives leaving sight, released on death or toggling it again) and auto-focus on manual attack. Optional per-character checkbox auto-focuses the mob the player's own homunculus/mercenary attacks (melee or skill), with owner-priority: the player's last manual target holds focus for a few seconds so a minion hit won't yank it away. /tt and /tabtarget chat commands toggle the panel. Digit row 1-9 (layout-agnostic) auto-targets the locked mob on native skillbar F2 slots 1-9, shown as two panel rows (5 + 4) of split buttons: the number (left) casts, the right segment is a tri-state per-slot mode (off / A=auto-craft (hold) / S=self-cast), persisted per character. A holds a key to loop cast \u2192 confirm MakeItemSelection \u2192 re-cast (Prepare Potion, Arrow Making, Cooking\u2026) and remembers the last confirmed ITID to re-select it on subsequent cycles (uniform across crafts, falls back to list[0] if the memory isn't in the new list, resets on page reload); S auto-casts the skill on the player (PLACE/TRAP under-foot, others on player GID); Ctrl+digit falls through to the native skillbar. Triple-click the titlebar to toggle the legacy Prev/Attack/Next debug buttons at runtime.",match:["*://*.cyro.live/*","*://cyro.live/*"],deps:[],pars:{showDebugButtons:!1}};var gt=5,p=null,v=null,_t=0,de=3e3,k=!1,ue=["Backquote","IntlBackslash"],jt="M7 11V7a5 5 0 0 1 10 0v4",Gt=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="${jt}"/></svg>`,fe="#ffc6c6",kt=null,rt=!1,U=null,g=null,Vt=null,K=null,h={OFF:0,SELF:1,AUTO:2},C=Array(9).fill(0),A=null,G=!1,N=null,qt=!1,lt=!1,tt=new Map,X=new Map,w=new Map,pe=5e3,Rt=361;var ge=1,me=3,B=new Set,he=1e4,I=new Set,ct=null,x=null,Et=!1;function Z(){Et||!g||!g.ui||!g.ui[0]||(Et=!0,setTimeout(()=>{Et=!1,D()},0))}i(Z,"scheduleUpdateUI");var J=!1,j=0,It=[],F=[],$t=[],ot=0,nt=0,E={spawn:0,vanish:0,map:0,act:0};function St(){Ct(v),p=null,v=null,k=!1,_t=0,U=null,w.clear(),B.clear()}i(St,"resetSessionState");function be(t,e,o,n,s){let r=o-t,a=n-e;return r===0&&a===0?0:-(Math.atan2(a,r)*180/Math.PI-90)+s}i(be,"computeArrowDeg");function mt(){let t=b?.Entity;if(!t||tt.size===0)return;let e=Number(ie?.angleFinal?.[1])||0;for(let[o,n]of tt){let s=T.get(o),r,a;if(s&&s.position&&(s.position[0]||s.position[1]))r=s.position[0],a=s.position[1];else{let c=w.get(o);if(!c)continue;r=c.x,a=c.y}let l=be(t.position?.[0]||0,t.position?.[1]||0,r,a,e);n.style.transform=`rotate(${l.toFixed(1)}deg)`}}i(mt,"refreshArrowsOnly");function dt(){j||(j=requestAnimationFrame(()=>{j=0,mt(),J&&dt()}))}i(dt,"scheduleArrowFrame");function Wt(){if(!b||!b.Entity)return[];let t=b.Entity,e=t.position||[0,0],o=[],n=new Set,s=new Set,r=Date.now();T.forEach(a=>{if(a===t||a.objecttype!==gt||!a.GID||a.GID<=0||(s.add(a.GID),B.has(a.GID)))return;let l=a.position?.[0]||0,c=a.position?.[1]||0;if(l||c){let S=w.get(a.GID);w.set(a.GID,{x:l,y:c,name:a.display&&a.display.name||null,job:a.job,seenAt:r,reason:S?.reason||"drift"})}if(n.add(a.GID),a.job)for(let[S,R]of w){if(S===a.GID||R.reason!=="teleport"||R.job!==a.job)continue;let V=R.x-l,q=R.y-c;V*V+q*q<100&&w.delete(S)}let u=l-e[0],d=c-e[1],y=u*u+d*d;y>Rt||o.push({entity:a,stale:!1,dist:y})});for(let[a,l]of w){if(n.has(a))continue;if(r-l.seenAt>pe){w.delete(a);continue}let c=l.x-e[0],u=l.y-e[1],d=c*c+u*u;if(d>Rt){w.delete(a);continue}o.push({entity:{GID:a,position:[l.x,l.y],job:l.job,display:l.name?{name:l.name}:null},stale:!0,reason:l.reason,dist:d})}return o.sort((a,l)=>{let c=I.has(a.entity?.job)?1:0,u=I.has(l.entity?.job)?1:0;return c!==u?u-c:a.dist-l.dist}),o}i(Wt,"getSortedMobs");function ye(t){if(!t?.display)return;let e=t.display;if(e.load===e.TYPE.COMPLETE){try{e.add()}catch{}return}if(e.load===e.TYPE.NONE){e.load=e.TYPE.LOADING;let o=f.CZ.REQNAME2||f.CZ.REQNAME;if(o)try{let n=new o;n.AID=t.GID,at.sendPacket(n)}catch{}}U=t.GID}i(ye,"_showName");function Ct(t){if(t?.display){Xt(t),t.display.display=!1;try{t.display.remove()}catch{}}}i(Ct,"_hideName");var ke=10,ut=[];function Ee(t,e,o){ut.push({t:new Date().toLocaleTimeString(),origin:t,fromMinion:o,gid:e?.GID??null,name:e?.display?.name??null}),ut.length>ke&&ut.shift()}i(Ee,"_pushFocusLog");function P(t,e=!1,o="unknown"){if(e||(_t=Date.now()),Ee(o,t,e),v&&v!==t){if(v.attachments?.remove)try{v.attachments.remove("lockon")}catch{}Ct(v)}if(t.attachments?.add)try{t.attachments.add({uid:"lockon",spr:"data/sprite/cursors.spr",act:"data/sprite/cursors.act",frame:3,repeat:!0,depth:10})}catch{}v=t,p=t.GID,ye(t)}i(P,"setTarget");function Lt(t){return t?t.GID??t.AID??t.srcGID??t.srcAID??t.SrcAID??null:null}i(Lt,"_extractSrcGID");function Ht(t){if(!t||!b?.Entity)return!1;let e=b.Entity,o=e.GID,n=e.AID,s=Lt(t);return s==null?!1:s===o||n!=null&&s===n}i(Ht,"_isLocalActor");function zt(t){return t==null||!G?!1:t===b?.homunId||t===b?.mercId}i(zt,"_isOwnMinion");function Te(t){return t==null?!1:t>(z?.HOMUN_BEGIN??8e3)&&t<(z?.HOMUN_LAST??8061)||t>(z?.MERCENARY_BEGIN??8200)&&t<(z?.MERCENARY_LAST??8242)}i(Te,"_isMinionSkill");function Nt(){return p!=null&&Date.now()-_t<de}i(Nt,"_minionFocusBlocked");function we(t){if(E.act++,k)return;let e=Ht(t),o=!e&&zt(Lt(t));if(!e&&!o)return;let n=t.targetGID??t.targetAID??t.dstGID;if(!n)return;let s=T.get(n);!s||s.objecttype!==gt||s.GID!==p&&(o&&Nt()||(P(s,o,"attack-pkt"),Z()))}i(we,"onNativeAttack");function ve(t){if(E.skill=(E.skill||0)+1,k)return;let e=Te(t?.SKID);if(e&&!G)return;let o=t?.targetID;if(!o)return;let n=T.get(o);!n||n.objecttype!==gt||n.GID!==p&&(e&&Nt()||(P(n,e,"send-skill"),Z()))}i(ve,"onSendSkill");function Ie(t){if(E.skill=(E.skill||0)+1,k)return;let e=Ht(t),o=!e&&zt(Lt(t));if(!e&&!o)return;let n=t.targetGID??t.targetAID??t.targetID??t.dstGID??t.TargetAID;if(!n)return;let s=T.get(n);!s||s.objecttype!==gt||s.GID!==p&&(o&&Nt()||(P(s,o,"skill-pkt"),Z()))}i(Ie,"onNativeSkill");function Tt(t){let e=Wt().filter(n=>!n.stale).map(n=>n.entity);if(e.length===0){p=null,D();return}let o=-1;p!==null&&(o=e.findIndex(n=>n.GID===p)),o=((o+t)%e.length+e.length)%e.length,P(e[o],!1,"tab"),D()}i(Tt,"cycleTarget");function Qt(){k=!k&&p!==null,k||Xt(v),D()}i(Qt,"toggleLock");function Se(t){let e=t?.display,o=e?.ctx?.canvas;if(!o||e.load!==e.TYPE.COMPLETE||e._ttLockWidth===o.width)return;let n=window.devicePixelRatio||1,s=document.createElement("canvas");s.width=o.width,s.height=o.height,s.getContext("2d").drawImage(o,0,0),o.width+=16*n;let r=e.ctx;r.drawImage(s,16*n,0);let a=new window.Path2D(jt);a.rect(3,11,18,11),r.save(),r.translate(4*n,4*n),r.scale(.55*n,.55*n),r.lineCap="round",r.lineJoin="round",r.strokeStyle="black",r.lineWidth=5,r.stroke(a),r.strokeStyle=fe,r.lineWidth=2.5,r.stroke(a),r.restore(),e._ttLockWidth=o.width}i(Se,"_drawLockBadge");function Xt(t){let e=t?.display;if(e?._ttLockWidth){e._ttLockWidth=0;try{e.refresh(t)}catch{}}}i(Xt,"_clearLockBadge");function Mt(){return kt||(kt=L.get("TabTargetNative.lockKey",{code:null,label:null},1)),kt}i(Mt,"_lockKeyPrefs");function xe(t){if(t.ctrlKey||t.altKey||t.metaKey)return!1;let e=Mt().code;return e?t.code===e:ue.includes(t.code)}i(xe,"_isLockKey");function xt(){let t=g?.ui?.[0]?.querySelector(".tt-lockkey");t&&(t.textContent=rt?"\u2026":Mt().label||"\xB2 / @")}i(xt,"refreshLockKeyButton");function Ae(t){if(t.key==="Tab"||t.key==="Enter"||t.key===" "||t.code.startsWith("Digit"))return"Tab Target";let e=null;try{e=JSON.parse(window.localStorage.getItem("ShortCutControls"))?.ShortCuts}catch{}for(let o in e){let n=e[o].cust||e[o].init;if(n?.key===t.which&&!n.shift&&!n.alt&&!n.ctrl)return o}return null}i(Ae,"_lockKeyConflict");function De(){if(rt)return;rt=!0;let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;t&&t.blur&&t.blur(),xt();let e=i(o=>{if(["Shift","Control","Alt","Meta"].includes(o.key))return;o.preventDefault(),o.stopImmediatePropagation();let n=o.key==="Escape"?null:Ae(o);if(n){ft.addText(`[TabTarget] ${o.key.toUpperCase()} is already used (${n}) \u2014 press another key, Esc cancels`,ft.TYPE.ERROR);return}if(window.removeEventListener("keydown",e,!0),rt=!1,o.key!=="Escape"){let s=Mt();s.code=o.code,s.label=o.key.length===1?o.key.toUpperCase():o.key,s.save()}xt()},"onKey");window.addEventListener("keydown",e,!0)}i(De,"startLockKeyRebind");function At(){if(!p)return;let t=T.get(p);if(!t||!b?.Entity)return;let e=b.Entity;T.setFocusEntity&&T.setFocusEntity(t);let o=[],n=se.search(e.position[0]|0,e.position[1]|0,t.position[0]|0,t.position[1]|0,(e.attack_range||2)+1,o),s=f.CZ.REQUEST_ACT2||f.CZ.REQUEST_ACT,r=new s;if(r.action=7,r.targetGID=t.GID,n&&n<2){at.sendPacket(r);return}b.moveAction=r;let a=f.CZ.REQUEST_MOVE2||f.CZ.REQUEST_MOVE;if(a&&n){let l=new a;l.dest=[o[(n-1)*2],o[(n-1)*2+1]],at.sendPacket(l)}else at.sendPacket(r)}i(At,"attackSelected");var _e=`
		<div class="tt-panel">
			<div class="tt-header">
				<span class="tt-title">Tab Target <span class="tt-version">v${et.version}</span></span>
				<button type="button" class="tt-win-btn tt-min" title="Minimize">_</button>
				<button type="button" class="tt-win-btn tt-close" title="Close">x</button>
			</div>
			<div class="tt-body">
				<div class="tt-current tt-debug-only" hidden>No target</div>
				<div class="tt-actions tt-debug-only" hidden>
					<button class="tt-btn tt-prev">\u25C0 Prev</button>
					<button class="tt-btn tt-attack">Attack</button>
					<button class="tt-btn tt-next">Next \u25B6</button>
				</div>
				<div class="tt-skills">
					<div class="tt-skill-row">
						<button class="tt-btn tt-skill" data-slot="0"><span class="tt-skill-num">1</span><span class="tt-skill-mode" title="Slot 1 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="1"><span class="tt-skill-num">2</span><span class="tt-skill-mode" title="Slot 2 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="2"><span class="tt-skill-num">3</span><span class="tt-skill-mode" title="Slot 3 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="3"><span class="tt-skill-num">4</span><span class="tt-skill-mode" title="Slot 4 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="4"><span class="tt-skill-num">5</span><span class="tt-skill-mode" title="Slot 5 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
					</div>
					<div class="tt-skill-row">
						<button class="tt-btn tt-skill" data-slot="5"><span class="tt-skill-num">6</span><span class="tt-skill-mode" title="Slot 6 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="6"><span class="tt-skill-num">7</span><span class="tt-skill-mode" title="Slot 7 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="7"><span class="tt-skill-num">8</span><span class="tt-skill-mode" title="Slot 8 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
						<button class="tt-btn tt-skill" data-slot="8"><span class="tt-skill-num">9</span><span class="tt-skill-mode" title="Slot 9 mode: off / A=auto-craft (hold) / S=self-cast"></span></button>
					</div>
				</div>
				<label class="tt-opt"><input type="checkbox" class="tt-autofocus-minion"> Auto-focus homun/merc</label>
				<div class="tt-opt">Lock key <button type="button" class="tt-btn tt-lockkey" title="Click, then press the new key (Esc cancels)">\xB2 / @</button></div>
				<div class="tt-hint">Tab / Shift+Tab / Enter \xB7 lock key or /focus = lock</div>
				<div class="tt-mob-list"></div>
			</div>
		</div>
		`.trim(),Ce=`
		.tt-panel { position: absolute; top: 80px; right: 10px; background: rgba(20,22,28,0.96); border: 1px solid #445; border-radius: 6px; color: #fff; font-family: Arial, sans-serif; font-size: 11px; width: 260px; text-shadow: 1px 1px 0 #000; box-shadow: 0 2px 8px rgba(0,0,0,0.6); display: flex; flex-direction: column; user-select: none; }
		.tt-header { background: rgba(40,44,54,0.97); border-bottom: 1px solid #334; padding: 4px 6px 4px 8px; font-weight: bold; border-radius: 5px 5px 0 0; user-select: none; cursor: move; display: flex; align-items: center; flex: 0 0 auto; }
		.tt-title { flex: 1; }
		.tt-version { font-size: 9px; opacity: 0.7; font-weight: normal; margin-left: 4px; }
		.tt-win-btn {
		  width: 18px; height: 18px; line-height: 1; text-align: center;
		  padding: 0; margin-left: 4px; border-radius: 4px;
		  background: #2a2f3a; border: 1px solid #556;
		  color: #fff; font-family: inherit; font-size: 11px; font-weight: bold;
		  cursor: pointer; user-select: none; text-shadow: 1px 1px 0 #000;
		  transition: background 80ms, border-color 80ms;
		}
		.tt-win-btn:hover { background: #39414f; border-color: #9ab; }
		.tt-win-btn:active { background: #454e5e; border-color: #bcd; }
		.tt-close:hover { background: rgba(200,60,60,0.95); border-color: #e88; }
		.tt-close:active { background: rgba(230,80,80,1); border-color: #fbb; }
		.tt-body { padding: 8px; }
		.tt-panel.tt-min .tt-body { display: none; }
		.tt-current { background: rgba(0,0,0,0.5); padding: 5px 7px; margin-bottom: 6px; border-left: 3px solid #556; min-height: 16px; }
		.tt-current.has-target { border-left-color: #f80; }
		/* Keyboard focus: the accent on the control's own border, not the browser's outer ring. */
		.tt-panel button:focus-visible, .tt-panel input:focus-visible { outline: none; border-color: #8fb8e8; }
		.tt-panel input[type=checkbox]:focus-visible { outline: 1px solid #8fb8e8; outline-offset: 0; }
		.tt-actions { display: flex; gap: 3px; margin-bottom: 4px; }
		/* '.tt-actions { display: flex }' outranks the UA's '[hidden] { display: none }'
		   so a bare 'hidden' attribute fails to hide the debug row. Author-rule with
		   matching specificity wins back. Same rule covers .tt-current (extra defense
		   in case future CSS adds a 'display' property on it). */
		.tt-debug-only[hidden] { display: none; }
		/* Skill bar : 2 rows (5 + 4) of split buttons. Each button = number (left,
		   casts) | mode segment (right, cycles off/A/S), divided by a full-height
		   border. The rows are a 5-column grid so all 9 buttons share one width \u2014 the
		   bottom row fills 4 of the 5 cells, last cell empty (buttons don't stretch). */
		.tt-skills { display: flex; flex-direction: column; gap: 3px; margin-bottom: 6px; }
		.tt-skill-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px; }
		/* The compound selector .tt-skill.tt-btn (specificity 0,2,0) beats the base
		   .tt-btn padding rule so the split children reach the button edges \u2014
		   otherwise the 4px .tt-btn frame insets the mode segment and its background /
		   separator border stop short of full height. The number's own padding sets
		   the button height. */
		.tt-skill.tt-btn { display: flex; align-items: stretch; padding: 0; overflow: hidden; line-height: 1.2; }
		.tt-skill-num { flex: 1; padding: 4px 6px; text-align: center; }
		/* Empty slot (no skill assigned) : greyed number + dim button, still clickable
		   and brightens on hover \u2014 signals the slot is there and interactive. */
		.tt-skill.tt-empty { opacity: 0.45; }
		.tt-skill.tt-empty.on { opacity: 1; } /* a mode set on it still has to read as on */
		/* The mode segment is a full-height slice of the button (no padding, centred
		   glyph, border spans the whole height) so it reads as an "option" on the
		   button. OFF : dimmed, empty. SELF/AUTO : highlighted, letter shown (the
		   letter, not the colour, distinguishes the two \u2014 same active style for both). */
		.tt-skill-mode { flex: 0 0 15px; display: flex; align-items: center; justify-content: center; font-size: 9px; border-left: 1px solid #556; opacity: 0.4; }
		.tt-skill-mode:hover { background: rgba(255,255,255,0.12); opacity: 1; }
		.tt-skill-mode.active { background: #5a6579; color: #fff; font-weight: bold; opacity: 1; }
		/* A slot with a mode reads as a pressed button, number and letter alike. */
		.tt-btn.tt-skill.on { background: #4a5568; border-color: #9ab; color: #fff; }
		.tt-btn.tt-skill.on:hover { background: #56627a; }
		.tt-btn { flex: 1; background: #2a2f3a; border: 1px solid #556; color: #fff; font-family: inherit; font-size: 10px; padding: 4px 6px; border-radius: 4px; text-shadow: 1px 1px 0 #000; }
		.tt-btn:hover { background: #39414f; border-color: #9ab; }
		.tt-btn:active { background: #454e5e; }
		/* Auto-focus opt-in : lock the mob the player's homun/merc attacks. */
		.tt-opt { display: flex; align-items: center; gap: 5px; font-size: 10px; color: #cde; margin-bottom: 6px; cursor: pointer; }
		.tt-opt input { cursor: pointer; margin: 0; }
		.tt-hint { color: #aaa; font-size: 9px; text-align: center; margin-bottom: 6px; }
		.tt-mob-list { max-height: 200px; overflow-y: auto; font-size: 10px; }
		.tt-mob-entry { display: flex; align-items: center; gap: 6px; padding: 3px 6px; border-bottom: 1px solid rgba(255,255,255,0.08); user-select: none; }
		.tt-mob-entry:hover { background: rgba(255,255,255,0.08); }
		.tt-mob-entry.active { background: rgba(180,60,30,0.55); border-left: 2px solid #f80; padding-left: 4px; }
		.tt-arrow { display: inline-block; width: 14px; text-align: center; color: #4af; transform-origin: center; transition: transform 0.12s linear; font-size: 15px; font-weight: bold; line-height: 1; flex: 0 0 auto; }
		.tt-mob-entry.active .tt-arrow { color: #f80; }
		.tt-mob-entry.locked { background: rgba(160,120,20,0.6); border-left-color: gold; }
		.tt-mob-entry.locked .tt-arrow { color: gold; }
		.tt-mob-entry.locked .tt-arrow-text::before { content: ''; display: inline-block; width: 1em; height: 1em; margin-right: 3px; vertical-align: -0.125em; background-color: currentColor; -webkit-mask: url("data:image/svg+xml,${encodeURIComponent(Gt)}") no-repeat center/contain; mask: url("data:image/svg+xml,${encodeURIComponent(Gt)}") no-repeat center/contain; }
		.tt-mob-entry.stale { font-style: italic; cursor: default; overflow: hidden; animation: tt-stale-fade 5s linear forwards; }
		.tt-mob-entry.stale .tt-arrow { color: #888; }
		/* Collapse height/padding/border in the last 1% of the fade so a stale
		   row that is already invisible ALSO stops taking ~8px of blank space.
		   animation-fill-mode forwards keeps these end-state values until the
		   500ms cleanup tick removes the DOM node \u2014 without this, the empty
		   rectangle persisted visibly between fade-end and the next render. */
		@keyframes tt-stale-fade {
			0%  { opacity: 0.6; }
			99% { opacity: 0; max-height: 30px; padding-top: 3px; padding-bottom: 3px; border-bottom-width: 1px; }
			100%{ opacity: 0; max-height: 0;  padding-top: 0;  padding-bottom: 0;  border-bottom-width: 0; }
		}
		.tt-arrow-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
		/* Pin-icon wrapper. The .ro-icon class (size, mask, currentColor) is
		   injected globally by @robrowser/icons at boot \u2014 this rule only
		   controls visibility (hover-only) and color. */
		.tt-pin-icon { font-size: 12px; cursor: pointer; color: #ccc; opacity: 0; transition: opacity 120ms ease; flex: 0 0 auto; margin-left: auto; }
		.tt-mob-entry:hover .tt-pin-icon { opacity: 0.45; }
		.tt-mob-entry:hover .tt-pin-icon:hover { opacity: 0.85; }
		/* Pinned : icon stays visible and goes gold even when the row is not hovered. */
		.tt-mob-entry.pinned .tt-pin-icon { opacity: 1; color: gold; }
		/* Dim non-pinned rows when the current map has at least one pin defined. */
		.tt-mob-entry.dim:not(.pinned) { opacity: 0.5; filter: grayscale(0.6); }
		.tt-mob-entry.dim:not(.pinned) .tt-arrow,
		.tt-mob-entry.dim:not(.pinned) .tt-arrow-text { color: #888; }
		`,st=!1;function Ft(){let t=b?.GID;if(!t)return;A||(A=L.get("TabTargetNative.slotModes",{},1));let e=Array.isArray(A[t])?A[t]:null;if(!e){let o=Le(t);o&&(e=o,A[t]=o.slice(),A.save())}C=Array.from({length:9},(o,n)=>{let s=e&&e[n]|0;return s===h.SELF||s===h.AUTO?s:h.OFF}),pt()}i(Ft,"loadSlotModesForChar");function Le(t){let e=L.get("TabTargetNative.selfToggles",{},1),o=L.get("TabTargetNative.autoToggles",{},1),n=Array.isArray(e?.[t])?e[t]:null,s=Array.isArray(o?.[t])?o[t]:null;return!n&&!s?null:Array.from({length:9},(r,a)=>s&&s[a]?h.AUTO:n&&n[a]?h.SELF:h.OFF)}i(Le,"migrateLegacyToggles");function Ne(){let t=b?.GID;t&&(A||(A=L.get("TabTargetNative.slotModes",{},1)),A[t]=C.slice(),A.save())}i(Ne,"saveSlotModes");function Yt(){let t=b?.GID;t&&(N||(N=L.get("TabTargetNative.autoFocusMinion",{},1)),G=!!N[t],Ot())}i(Yt,"loadAutoFocusForChar");function Me(){let t=b?.GID;t&&(N||(N=L.get("TabTargetNative.autoFocusMinion",{},1)),N[t]=G,N.save())}i(Me,"saveAutoFocusMinion");function Jt(){try{let t=ae?.currentMap;return t?String(t).replace(/\.gat$/i,"").toLowerCase():null}catch{return null}}i(Jt,"getCurrentMapName");function Oe(){let t=b?.GID;if(!t||(x||(x=L.get("TabTargetNative.pinnedMobs",{},1)),ct=Jt(),I.clear(),!ct))return;let e=x[t];if(!e)return;let o=e[ct];if(Array.isArray(o))for(let n of o)I.add(n)}i(Oe,"loadPinnedMobsForMap");function Pe(){let t=b?.GID;if(!t)return;let e=Jt();e&&(ct=e,x||(x=L.get("TabTargetNative.pinnedMobs",{},1)),x[t]||(x[t]={}),I.size===0?delete x[t][e]:x[t][e]=Array.from(I),x.save())}i(Pe,"savePinnedMobs");function Ge(t){t&&(I.has(t)?I.delete(t):I.add(t),Pe(),D())}i(Ge,"togglePin");function pt(){!g||!g.ui||!g.ui[0]||g.ui[0].querySelectorAll(".tt-skill").forEach(t=>{let e=parseInt(t.getAttribute("data-slot"),10),o=t.querySelector(".tt-skill-mode");if(!o)return;let n=C[e];o.textContent=n===h.AUTO?"A":n===h.SELF?"S":"",o.classList.toggle("active",n!==h.OFF),t.classList.toggle("on",n!==h.OFF)})}i(pt,"refreshModeButtons");function Ot(){if(!g||!g.ui||!g.ui[0])return;let t=g.ui[0].querySelector(".tt-autofocus-minion");t&&(t.checked=G)}i(Ot,"refreshAutoFocusCheckbox");function Re(){if(!g||!g.ui||!g.ui[0])return;let t=O.getList?.()||[];g.ui[0].querySelectorAll(".tt-skill").forEach(e=>{let o=parseInt(e.getAttribute("data-slot"),10),n=t[o+9],s=!n||!n.isSkill&&!n.ID;e.classList.toggle("tt-empty",s)})}i(Re,"refreshSkillButtons");function Ut(){if(!g||!g.ui||!g.ui[0])return;let t=!!(qt||lt);g.ui[0].querySelectorAll(".tt-debug-only").forEach(e=>{e.hidden=!t})}i(Ut,"applyDebugRow");function Fe(){document.querySelectorAll(".tt-panel").forEach(e=>e.remove()),X.clear(),tt.clear(),g=new ne("TabTargetPanel",_e,Ce);let t=g;return g.onKeyDown=function(e){let o=document.activeElement;for(;o?.shadowRoot?.activeElement;)o=o.shadowRoot.activeElement;if(o&&(o.tagName==="INPUT"||o.tagName==="TEXTAREA"||o.isContentEditable)||!!o&&o!==document.body&&o!==document.documentElement&&o.tagName!=="CANVAS"&&(e.key==="Tab"||e.key==="Enter"||e.key===" "))return;if(xe(e)){e.preventDefault(),Qt();return}if(e.key==="Tab"){e.preventDefault(),k||Tt(e.shiftKey?-1:1);return}if((e.key==="Enter"||e.key===" ")&&p){e.preventDefault(),At();return}let s=te.find(r=>r.key===e.key);s&&(e.preventDefault(),Dt(s.slot))},Vt=i(function(){let e=t.ui&&t.ui[0];if(!e)return;e.querySelectorAll("button, input").forEach(l=>{l.tabIndex=-1}),e.addEventListener("mousedown",l=>{l.target.closest("button, input")&&l.preventDefault()});let o=i((l,c)=>{let u=e.querySelector(l);u&&u.addEventListener("click",d=>{d.preventDefault(),c()})},"bind");o(".tt-prev",()=>Tt(-1)),o(".tt-next",()=>Tt(1)),o(".tt-attack",()=>At()),o(".tt-lockkey",()=>De()),e.querySelectorAll(".tt-skill").forEach(l=>{let c=parseInt(l.getAttribute("data-slot"),10),u=c+9,d=l.querySelector(".tt-skill-mode");d&&d.addEventListener("click",y=>{y.preventDefault(),y.stopPropagation(),C[c]=C[c]===h.OFF?h.AUTO:C[c]===h.AUTO?h.SELF:h.OFF,pt(),Ne()}),l.addEventListener("click",y=>{y.preventDefault(),Dt(u,c)})});let n=e.querySelector(".tt-autofocus-minion");n&&n.addEventListener("change",()=>{G=n.checked,Me()});let s=e.querySelector(".tt-min"),r=e.querySelector(".tt-close");s&&s.addEventListener("click",l=>{l.stopPropagation(),st=!st,e.classList.toggle("tt-min",st)}),r&&r.addEventListener("click",l=>{l.stopPropagation(),K&&K.hide()});let a=e.querySelector(".tt-header");if(a){let l=0,c=0;a.addEventListener("click",u=>{let d=u.target;d&&(d.classList.contains("tt-min")||d.classList.contains("tt-close"))||(l++,clearTimeout(c),c=setTimeout(()=>{l=0},500),l>=3&&(l=0,lt=!lt,Ut(),ft.addText(`[TabTarget] debug buttons ${lt?"shown":"hidden"}`,ft.TYPE.BLUE)))})}t.draggable&&t.ui.find&&t.draggable(t.ui.find(".tt-header")),e.classList.toggle("tt-min",st),Ut(),pt(),Ot(),xt(),D()},"bindPanel"),g}i(Fe,"buildPanel");function D(){if(!g)return;let t=g.ui&&g.ui[0];if(!t)return;k&&Se(v),Re();let e=Wt(),o=e.filter(r=>!r.stale).length,n=t.querySelector(".tt-current");if(n)if(p!==null){let r=e.find(l=>l.entity.GID===p),a=r&&!r.stale?r.entity:T.get(p);if(a){let l=a.display&&a.display.name||`mob ${a.job}`;n.textContent=`\u{1F3AF} ${l} (job=${a.job})`,n.classList.add("has-target")}else n.textContent=`Target lost \u2014 ${o} mob(s)`,n.classList.remove("has-target")}else n.textContent=`No target \u2014 ${o} mob(s) visible`,n.classList.remove("has-target");let s=t.querySelector(".tt-mob-list");if(s)try{Ye(s,e.slice(0,20))}catch(r){for(console.error("[RO][TabTarget] renderMobList crashed \u2014 full reset to recover",r),St();s.firstChild;)s.removeChild(s.firstChild)}}i(D,"updateUI");function Ye(t,e){let o=new Set(e.map(r=>r.entity.GID)),n=I.size>0;for(let[r,a]of X)o.has(r)||(a.entry.remove(),X.delete(r),tt.delete(r));let s=null;for(let r of e){let a=r.entity,l=a.GID,c=a.job,u=a.display&&a.display.name||`mob ${a.job}`,d=X.get(l);if(!d){let _=document.createElement("div");_.className="tt-mob-entry";let $=document.createElement("span");$.className="tt-arrow",$.textContent="\u2191",_.appendChild($);let ht=document.createElement("span");ht.className="tt-arrow-text",_.appendChild(ht);let bt=document.createElement("span");bt.className="tt-pin-icon ro-icon ro-icon-crosshair",bt.addEventListener("click",W=>{W.stopPropagation(),Ge(r.entity?.job)}),_.appendChild(bt),_.addEventListener("click",W=>{if(_.classList.contains("stale")||k)return;W.preventDefault();let H=T.get(l);H&&(P(H,!1,"list"),D())}),_.addEventListener("dblclick",W=>{if(_.classList.contains("stale")||k)return;W.preventDefault();let H=T.get(l);H&&(P(H,!1,"list-dbl"),At())}),d={entry:_,label:ht,arrow:$,stale:!1},X.set(l,d),tt.set(l,$)}d.entry.classList.toggle("active",l===p),d.entry.classList.toggle("locked",k&&l===p);let y=!!c&&I.has(c);d.entry.classList.toggle("pinned",y),d.entry.classList.toggle("dim",n&&!y),r.stale!==d.stale&&(d.entry.classList.toggle("stale",r.stale),d.stale=r.stale);let S=r.stale?r.reason==="teleport"?" \xB7 teleported":" \xB7 hors vue":"",R=String(l).slice(-4),V=`${u} #${R}${S}`;d.label.textContent!==V&&(d.label.textContent=V);let q=s?s.nextSibling:t.firstChild;q!==d.entry&&t.insertBefore(d.entry,q),s=d.entry}mt()}i(Ye,"renderMobList");var Ue=new Set([z?.AL_HEAL??28]);function Ke(t){let e=b?.Entity;if(!e||!e.position)return!1;let o=O.getSkillById(t.ID),n=o&&o.type?o.type|0:0,s=Y.TYPE?.PLACE??2,r=Y.TYPE?.TRAP??32;return n&(s|r)?Y.onUseSkillToPos(t.ID,t.count,e.position[0]|0,e.position[1]|0):Y.onUseSkillToId(t.ID,t.count,e.GID),!0}i(Ke,"castSkillOnSelf");function Dt(t,e=t){let n=O.getList()[t];if(!(!n||!n.isSkill&&!n.ID)){if(n.isSkill){if(C[e]===h.SELF&&Ke(n))return;if(p){let s=O.getSkillById(n.ID),r=Y.TYPE?.ENEMY||1,a=s&&s.type&&s.type&r,l=s&&Ue.has(n.ID);if(a||l){Y.onUseSkillToId(n.ID,n.count,p);return}}}O.onShortCut({cmd:`EXECUTE${t}`})}}i(Dt,"triggerShortCutSlot");var Be=["MakeItemSelection"],Ze=40,je=450,Ve=150,m={active:!1,slotIdx:-1,timer:0,nextAt:0},it=null;function qe(){for(let t of Be){let e=document.getElementById(t);if(e&&e.offsetParent!==null)return e}return null}i(qe,"findCraftWindow");function $e(){if(!m.active){M();return}let t=Date.now();if(t<m.nextAt)return;let e=qe();if(e){let o=re.components.MakeItemSelection;if(it!=null&&o&&typeof o.setIndex=="function"){let s=e.querySelector(".list");s&&s.querySelector(`div[data-index="${it}"]`)&&o.setIndex(it)}o&&o.index!=null&&o.index!==-1&&(it=o.index);let n=e.querySelector(".ok");n&&n.offsetParent!==null&&n.click(),m.nextAt=t+Ve}else O.onShortCut({cmd:`EXECUTE${m.slotIdx}`}),m.nextAt=t+je}i($e,"autoCraftTick");function We(t){m.active&&m.slotIdx===t||(M(),m.active=!0,m.slotIdx=t,m.nextAt=0,m.timer=setInterval($e,Ze))}i(We,"startAutoCraft");function M(){m.timer&&(clearInterval(m.timer),m.timer=0),m.active=!1,m.slotIdx=-1}i(M,"stopAutoCraft");function He(t){return!t||!Array.isArray(t)?[]:t.map(e=>({key:e.key,slot:e.slot|0}))}i(He,"parseShortcutBindings");var wt=!1;function ze(){if(wt)return;wt=!0;let t=i(s=>{if(s.altKey||s.ctrlKey||s.metaKey||!s.code||!s.code.startsWith("Digit"))return;let r=parseInt(s.code.slice(5),10);if(r<1||r>9)return;let a=document.activeElement;for(;a?.shadowRoot?.activeElement;)a=a.shadowRoot.activeElement;if(a&&(a.tagName==="INPUT"||a.tagName==="TEXTAREA"||a.isContentEditable))return;let l=r-1,c=r+8,d=O.getList()?.[c]?.isSkill?C[l]:h.OFF,y=d===h.SELF,S=d===h.AUTO;if(!(!p&&!y&&!S)){if(s.preventDefault(),s.stopImmediatePropagation(),S){We(c);return}Dt(c,l)}},"onKeyDown"),e=i(s=>{if(!m.active||!s.code||!s.code.startsWith("Digit"))return;let r=parseInt(s.code.slice(5),10);m.slotIdx===r+8&&M()},"onKeyUp"),o=i(()=>{m.active&&M()},"onBlur"),n=i(()=>{document.hidden&&m.active&&M()},"onVisibility");window.addEventListener("keydown",t,!0),window.addEventListener("keyup",e,!0),window.addEventListener("blur",o),document.addEventListener("visibilitychange",n),Bt(()=>{window.removeEventListener("keydown",t,!0),window.removeEventListener("keyup",e,!0),window.removeEventListener("blur",o),document.removeEventListener("visibilitychange",n),M(),wt=!1})}i(ze,"installDigitCapture");function Kt(){if(!f||!f.ZC)return;let t=i((c,u)=>{let d=le(c,u);typeof d=="function"&&It.push(d)},"trackPacket"),e=i((c,u)=>{let d=ce(c,u);typeof d=="function"&&It.push(d)},"trackSend"),o=i(()=>{mt(),Z()},"onMove");["NOTIFY_MOVE","NOTIFY_MOVE2","NOTIFY_PLAYERMOVE"].forEach(c=>{f.ZC[c]&&t(f.ZC[c],o)});let s=i(()=>{E.map++,St()},"onMapChange");f.ZC.NPCACK_MAPMOVE&&t(f.ZC.NPCACK_MAPMOVE,s),f.ZC.NPCACK_SERVERMOVE&&t(f.ZC.NPCACK_SERVERMOVE,s),F.push(vt(Q.CHAR_SELECT,()=>{E.spawn=0,E.vanish=0,E.map=0,E.act=0,E.skill=0,St(),M(),C=Array(9).fill(0),pt(),G=!1,Ot()}));let r=i(c=>{E.spawn++;let u=c?.GID;u&&B.has(u)&&(B.delete(u),w.delete(u)),k&&u===p&&setTimeout(()=>{let d=T.get(u);k&&u===p&&d&&P(d,!1,"relock")},0),Z()},"onEntitySpawn");["NOTIFY_STANDENTRY","NOTIFY_STANDENTRY2","NOTIFY_STANDENTRY3","NOTIFY_STANDENTRY4","NOTIFY_STANDENTRY5","NOTIFY_STANDENTRY6","NOTIFY_STANDENTRY9","NOTIFY_STANDENTRY10","NOTIFY_STANDENTRY11","NOTIFY_NEWENTRY","NOTIFY_NEWENTRY11","NOTIFY_MOVEENTRY","NOTIFY_MOVEENTRY11"].forEach(c=>{f.ZC[c]&&t(f.ZC[c],r)}),f.ZC.NOTIFY_VANISH&&t(f.ZC.NOTIFY_VANISH,c=>{E.vanish++;let u=c?.GID;if(u===p&&(!k||c.type===ge)&&(Ct(v),v=null,p=null,k=!1,U=null),u)if(B.add(u),setTimeout(()=>{B.delete(u)},he),c.type===me){let d=w.get(u);d&&(d.reason="teleport")}else w.delete(u);Z()});for(let c of["NOTIFY_ACT3","NOTIFY_ACT2","NOTIFY_ACT"])f.ZC[c]&&t(f.ZC[c],we);for(let c of["USESKILL_ACK","USESKILL_ACK2","USESKILL_ACK3","NOTIFY_SKILL","NOTIFY_SKILL2","USE_SKILL","USE_SKILL2"])f.ZC[c]&&t(f.ZC[c],Ie);if(f.CZ)for(let c of["USE_SKILL","USE_SKILL2"])f.CZ[c]&&e(f.CZ[c],ve);let l=i(c=>{if(U==null)return;let u=c?.GID??c?.AID;if(u!==U)return;U=null;let d=p;queueMicrotask(()=>{if(u!==d||u!==p)return;let y=T.get(u);if(y?.display&&y.display.load===y.display.TYPE.COMPLETE)try{y.display.add()}catch{}})},"onAckName");for(let c of["ACK_REQNAME2","ACK_REQNAME","ACK_REQNAMEALL","ACK_REQNAMEALL2"])f.ZC[c]&&t(f.ZC[c],l)}i(Kt,"hookPackets");function Qe(){let t=i(n=>{n.button===2&&(J=!0,dt())},"onDown"),e=i(n=>{n.button===2&&(J=!1,dt())},"onUp"),o=i(()=>{J&&dt()},"onMove");document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",e,!0),document.addEventListener("mousemove",o,!0),$t.push(()=>document.removeEventListener("mousedown",t,!0),()=>document.removeEventListener("mouseup",e,!0),()=>document.removeEventListener("mousemove",o,!0))}i(Qe,"hookCameraRotation");var te=[];function Xe(t){console.log(`%c[RO][TabTarget v${et.version}] Plugin loaded`,"color: #0ff; font-weight: bold"),te=He(t&&t.shortcuts),qt=!!(t&&t.showDebugButtons),F.push(vt(Q.MAP_ENTER,()=>{Ft(),Yt(),D()})),F.push(vt(Q.MAP_READY,()=>{Oe(),D()})),f&&f.ZC&&f.ZC.NOTIFY_VANISH?Kt():F.push(Pt(Q.WIRE_COMPLETE,()=>Kt())),Qe(),ze(),K=Zt.registerPlayerWindow(()=>Fe(),{persistKey:"TabTargetNative",defaultVisible:!0,onMount:i(()=>{Vt?.(),Ft(),Yt()},"onMount")});function e(){yt.add("tabtarget","Toggle the Tab Target panel",function(){K.isVisible()?(K.hide(),this.addText("[TabTarget] hidden",this.TYPE.BLUE)):(K.show(),this.addText("[TabTarget] shown",this.TYPE.BLUE))},["tt"]),yt.add("focus","Lock / unlock the Tab Target target",function(){Qt(),this.addText(`[TabTarget] target ${k?"locked":"unlocked"}`,this.TYPE.BLUE)})}return i(e,"registerChatCommand"),yt.$raw?e():F.push(Pt(Q.MAP_ENTER,e)),ot=setInterval(D,500),nt=setInterval(mt,250),window.__TT_focusLog=ut,Bt(({reason:o})=>{console.log(`[RO][TabTarget] cleanup reason=${o}`);for(let n of It.splice(0))try{n()}catch{}for(let n of F.splice(0))try{n()}catch{}for(let n of $t.splice(0))try{n()}catch{}j&&(cancelAnimationFrame(j),j=0),J=!1,ot&&(clearInterval(ot),ot=0),nt&&(clearInterval(nt),nt=0)}),!0}i(Xe,"Init");var ao={...et,init:Xe};return { ao }
	}

	// Reshape body to a self-contained ES module string.
	//   1. Detach the inline sourcemap if present (esbuild puts it at the
	//      end of the bundle, AFTER our `return { ao }`). If we
	//      leave it in place the next regex would never see `}` at end of
	//      string and the swap would silently fail — module would have a
	//      top-level `return` and crash with SyntaxError on Blob import.
	//   2. Swap `return { ao }` → nothing, then append
	//      `export default ao` so the module's default export is
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
		+ '\nexport default ao\n'
		+ '//# sourceURL=TabTargetNative.js\n'
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
				console.error(`[TabTargetNative] framework not present after 10s — install ro-framework.user.js first`)
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
		console.error(`[TabTargetNative] PluginManager.register failed:`, e)
	}
})()

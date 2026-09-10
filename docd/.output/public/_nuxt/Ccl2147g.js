const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CcDGePAt.js","./BJp7270K.js","./CyRprE5p.js","./80F2Wr_P.js"])))=>i.map(i=>d[i]);
import{t as e}from"./uBIymjUX.js";import{S as t,_ as n,a as r,b as i,c as a,d as o,f as s,g as c,h as l,l as u,p as d,y as f}from"./TaW9hdCO.js";import{B as p,C as m,D as h,F as g,H as _,I as ee,L as te,M as v,N as ne,O as y,P as b,R as re,S as x,T as ie,U as S,V as ae,W as C,_ as oe,a as se,b as ce,c as le,d as ue,f as de,g as fe,h as pe,i as me,k as w,l as he,m as ge,n as _e,o as ve,p as ye,r as be,s as xe,t as Se,u as Ce,v as we,x as Te,y as Ee,z as De}from"./Djk0Lqqu.js";import{i as Oe,n as ke,o as Ae,s as je,t as T}from"./C2VvAmt_.js";import{a as E,i as Me,n as Ne}from"./B-SxJArU.js";import{t as Pe}from"./Ch0IHcOP.js";import{t as Fe}from"./sGIaghwZ.js";function Ie(e,t){let n=[];for(let r=0;r<e.children.length;r++){let i=e.children.item(r);i&&t(i,r)&&n.push(i)}return n}function Le(e,t){for(let n=0;n<e.children.length;n++){let r=e.children.item(n);if(r&&t(r,n))return r}return null}function Re(e){let t=e.closest(`[dir]`)?.getAttribute(`dir`)?.toLowerCase();return t===`rtl`||t===`ltr`?t===`rtl`:getComputedStyle(e).direction===`rtl`}function ze(e){return e instanceof Node&&e.nodeType===9}function Be(e){return e instanceof Node&&e.nodeType===11&&`host`in e}function Ve(e,t,n={}){if(!e||typeof document>`u`)return;let r=e;for(;r;){let e=t(r);if(!c(e))return e;r=n.composed?He(r):r.parentElement}}function He(e){if(e.assignedSlot)return e.assignedSlot;if(e.parentElement)return e.parentElement;let t=e.getRootNode();return Be(t)?t.host:null}var Ue=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`audio[controls]`,`video[controls]`,`iframe`,`[contenteditable]:not([contenteditable="false"])`,`[tabindex]:not([tabindex="-1"])`].join(`,`);function We(e=document){let t=e.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}function Ge(e){let t=[],n=new Set;return r(e),t;function r(e){for(let t of e.children)i(t)}function i(e){if(!n.has(e)){if(n.add(e),e instanceof HTMLElement&&Ke(e)&&t.push(e),e instanceof HTMLSlotElement){let t=e.assignedElements({flatten:!0});if(t.length>0)for(let e of t)i(e);else r(e);return}e.shadowRoot?r(e.shadowRoot):r(e)}}}function Ke(e){return!e.matches(Ue)||e.tabIndex<0||e.matches(`:disabled`)?!1:!Ve(e,e=>{if(e instanceof HTMLElement&&(e.hidden||e.hasAttribute(`inert`)||e.getAttribute(`aria-hidden`)===`true`))return!0},{composed:!0})}function qe(){return typeof CSS<`u`&&CSS.supports(`anchor-name: --a`)}function Je(e){return e.startsWith(`--`)?e:r(e)}function Ye(e){let t=e.style.getPropertyValue(`anchor-name`).trim();return!t||t===`none`?[]:t.split(`,`).map(e=>e.trim()).filter(Boolean)}function D(e,t){for(let[n,r]of Object.entries(t))typeof r==`string`&&e.style.setProperty(Je(n),r)}function Xe(e,t){return[...t].map(t=>{let n=Je(t);return{property:n,value:e.style.getPropertyValue(n),priority:e.style.getPropertyPriority(n)}})}function Ze(e,t){for(let{property:n,value:r,priority:i}of t)r?e.style.setProperty(n,r,i):e.style.removeProperty(n)}function Qe(e,t,n){let r=Xe(e,Object.keys(t));try{return D(e,t),n()}finally{Ze(e,r)}}function $e(e,t,{source:n=`inline-or-computed`}={}){let r=Je(t),i=n!==`computed`&&e instanceof HTMLElement?e.style.getPropertyValue(r):``;return!i&&n!==`inline`&&(i=getComputedStyle(e).getPropertyValue(r)),i.trim()?et(e,i):null}function et(e,t){let n=t.trim();if(!n)return 0;let r=Number.parseFloat(n);if(!Number.isNaN(r)&&(/^-?\d*\.?\d+$/.test(n)||n.endsWith(`px`)))return r;let i=e.ownerDocument,a=i?.documentElement;if(!Number.isNaN(r)&&n.endsWith(`rem`))return r*(a&&Number.parseFloat(getComputedStyle(a).fontSize)||16);if(!Number.isNaN(r)&&n.endsWith(`em`))return r*(e instanceof HTMLElement&&Number.parseFloat(getComputedStyle(e).fontSize)||16);if(!i)return Number.isNaN(r)?0:r;let o=i.createElement(`div`);if(o.style.position=`absolute`,o.style.visibility=`hidden`,o.style.pointerEvents=`none`,o.style.inlineSize=n,!o.style.inlineSize)return 0;o.style.blockSize=`0`,o.style.padding=`0`,o.style.border=`0`,o.style.inset=`0`;let s=getComputedStyle(e);o.style.fontSize=s.fontSize;for(let e=0;e<s.length;e++){let t=s.item(e);t.startsWith(`--`)&&o.style.setProperty(t,s.getPropertyValue(t))}let c=i.body??i.documentElement;if(!c)return Number.isNaN(r)?0:r;if(c.appendChild(o),getComputedStyle(o).inlineSize===`auto`)return o.remove(),0;let l=o.getBoundingClientRect().width;return o.remove(),Number.isFinite(l)?l:Number.isNaN(r)?0:r}function tt(e,{box:t=`bounding`,overflow:n=`none`}={}){let r=e.getBoundingClientRect(),i=t===`layout`&&e.offsetWidth||r.width,a=t===`layout`&&e.offsetHeight||r.height;return(n===`width`||n===`both`)&&(i=Math.max(i,e.scrollWidth)),(n===`height`||n===`both`)&&(a=Math.max(a,e.scrollHeight)),{width:i,height:a}}function nt(e,t={}){let{styles:n,...r}=t,i=()=>tt(e,r);return n?Qe(e,n,i):i()}function rt(e){let t=getComputedStyle(e);return{inlineStart:Number.parseFloat(t.paddingInlineStart)||0,inlineEnd:Number.parseFloat(t.paddingInlineEnd)||0,blockStart:Number.parseFloat(t.paddingBlockStart)||0,blockEnd:Number.parseFloat(t.paddingBlockEnd)||0}}function it(e){return e.inlineStart+e.inlineEnd}function at(e){return e.blockStart+e.blockEnd}function ot(e){let t=getComputedStyle(e);return{x:Number.parseFloat(t.paddingLeft)||0,y:Number.parseFloat(t.paddingTop)||0}}function st(e){if(e.length===0)return{width:0,height:0};let t=Math.max(...e.map(({offsetLeft:e,size:t})=>e+t.width)),n=e[0].offsetTop;return{width:t,height:e.some(({offsetTop:e})=>e!==n)?Math.max(...e.map(({offsetTop:e,size:t})=>e+t.height)):e.reduce((e,{size:t})=>e+t.height,0)}}function ct(e,{children:t,includePadding:n=!1,maxWidth:r=null,measure:i=(e,t)=>nt(e,t===void 0?void 0:{styles:{width:`${t}px`}}),resolveSize:a=st}={}){let o=[...t??Array.from(e.children).filter(e=>e instanceof HTMLElement)].filter(e=>!e.hidden),s=n?rt(e):{inlineStart:0,inlineEnd:0,blockStart:0,blockEnd:0},c=it(s),l=at(s),u=n?ot(e):{x:0,y:0};if(o.length===0)return{width:c,height:l};let d=e=>o.map(t=>({element:t,size:i(t,e),offsetLeft:t.offsetLeft-u.x,offsetTop:t.offsetTop-u.y})),f=d(),p=a(f).width+c,m=r===null?p:Math.min(p,Math.max(0,r));return m<p&&(f=d(Math.max(0,m-c))),{width:m,height:a(f).height+l}}var lt=new Set([`Adlm`,`Arab`,`Hebr`,`Mand`,`Mend`,`Nkoo`,`Rohg`,`Samr`,`Syrc`,`Thaa`,`Yezi`]);function ut(e){try{let t=new Intl.Locale(e).maximize().script;return t&&lt.has(t)?`rtl`:`ltr`}catch{return`ltr`}}function dt(e,t,n=`en`){return!c(e)&&e.trim()!==``?e:!c(t)&&t.trim()!==``?t:n}function ft(e){let t=e.getAttribute(`lang`)?.trim();if(t)return t;if(`lang`in e&&typeof e.lang==`string`){let t=e.lang.trim();if(t)return t}}function pt(e){return Ve(e,ft)}async function mt(e,t,n){let r=n(e),i=await Promise.all(r.map(e=>t(e))),a=[],o={};for(let e=0;e<r.length;e++){let t=i[e];t&&Object.keys(t).length>0&&a.push(r[e])}for(let e=r.length-1;e>=0;e--){let t=i[e];t&&Object.assign(o,t)}return{merged:o,loadedTags:a}}function ht(e){if(!(c(e)||e.trim()===``))return e.trim()}var gt=new Set,_t,vt=!1,yt=()=>{vt=!1;for(let e of gt)e()},bt=()=>{vt||(vt=!0,queueMicrotask(yt))};function xt(){_t||typeof document>`u`||(_t=new MutationObserver(bt),_t.observe(document.documentElement,{subtree:!0,attributes:!0,attributeFilter:[`lang`],childList:!0}))}function St(){!gt.size&&_t&&(_t.disconnect(),_t=void 0,vt=!1)}function Ct(e){return typeof document>`u`?()=>{}:(gt.add(e),xt(),()=>{gt.delete(e),St()})}function wt(e,t){if(typeof ResizeObserver>`u`)return Pe;let n=new ResizeObserver(t),r=Symbol.iterator in Object(e)?e:[e];for(let e of r)n.observe(e);return()=>n.disconnect()}function Tt({getElements:e,onChange:t,root:n,mutations:r}){let i=Pe,a=()=>{i(),i=wt(e(),t)};a();let o=null;return n&&r!==!1&&typeof MutationObserver<`u`&&(o=new MutationObserver(()=>{a(),t()}),o.observe(n,r??{childList:!0})),()=>{o?.disconnect(),i()}}function Et(){return typeof navigator<`u`&&/mac/i.test(navigator.userAgent)}var Dt={sideOffset:0,boundaryOffset:0},Ot={top:`bottom`,bottom:`top`,left:`right`,right:`left`};function kt(e,t,n,r){let i=r.boundaryOffset??0;switch(n){case`top`:return e.top-t.top-i-r.sideOffset;case`bottom`:return t.bottom-e.bottom-i-r.sideOffset;case`left`:return e.left-t.left-i-r.sideOffset;case`right`:return t.right-e.right-i-r.sideOffset}}function At(e,t,n,r,i=Dt){let a=r.side,o=Ot[a],s=a===`top`||a===`bottom`?t.height:t.width,c=kt(e,n,a,i);return c>=s?a:kt(e,n,o,i)>c?o:a}function jt(e){try{e?.showPopover?.()}catch{}}function Mt(e){try{e?.hidePopover?.()}catch{}}function Nt(e){let t=null,n,r=(...r)=>{n=r,t===null&&(t=requestAnimationFrame(()=>{t=null,e(...n)}))};return r.cancel=()=>{t!==null&&(cancelAnimationFrame(t),t=null)},r}function Pt(e,t){let n=globalThis.document;if(!n||n.getElementById(e))return;let r=n.createElement(`style`);r.id=e,r.textContent=t,n.head.appendChild(r)}function Ft(e){return globalThis.CSSStyleSheet!==void 0&&e instanceof globalThis.CSSStyleSheet}function It(e){return typeof e==`string`?e:Array.from(e.cssRules).map(e=>e.cssText).join(`
`)}function Lt(e){if(globalThis.CSSStyleSheet===void 0)return e;let t=new globalThis.CSSStyleSheet;return t.replaceSync(e),t}function Rt(e,t){if(t.every(Ft)&&`adoptedStyleSheets`in e){e.adoptedStyleSheets=t;return}let n=e.ownerDocument;for(let r of t.map(It)){let t=n.createElement(`style`);t.textContent=r,e.appendChild(t)}}function zt(e){let t=globalThis.document;if(!t)return null;let n=t.createElement(`template`);return n.innerHTML=e,n}function Bt(e){for(let t of e.children)if(t.localName===`template`&&`content`in t)return t;return null}function Vt(e){let t=e.content.firstElementChild;return t&&!t.nextElementSibling?t:null}function Ht(e,t=e.ownerDocument){return t.importNode(e,!0)}function Ut(e,t){e.appendChild(e.ownerDocument.importNode(t.content,!0))}function Wt(e,t){let n=t;for(;n;){if(n===e||e.contains(n))return!0;let t=n.getRootNode();n=Be(t)?t.host:n.parentNode}return!1}function O(e,t){let n={...t};for(let r of Object.keys(t)){let t=e[r];c(t)||(n[r]=t)}return n}function Gt(e,t,n){let r=n?.leading??!1,i=null,a,o=!1;function s(){i=setTimeout(()=>{i=null,o&&(o=!1,e(...a),s())},t)}let c=(...n)=>{if(a=n,r)i===null?(e(...a),s()):o=!0;else{if(i!==null)return;i=setTimeout(()=>{i=null,e(...a)},t)}};return c.cancel=()=>{i!==null&&(clearTimeout(i),i=null),o=!1},c}var Kt=ie({name:`live`,state:()=>({liveEdgeStart:NaN,targetLiveWindow:NaN}),attach({target:e,signal:t,set:n}){let{media:r}=e;if(!te(r))return;let i=()=>n({liveEdgeStart:r.liveEdgeStart,targetLiveWindow:r.targetLiveWindow});i(),E(r,`targetlivewindowchange`,i,{signal:t}),E(r,`streamtypechange`,i,{signal:t}),E(r,`loadedmetadata`,i,{signal:t}),E(r,`canplay`,i,{signal:t}),E(r,`progress`,i,{signal:t}),E(r,`durationchange`,i,{signal:t}),E(r,`timeupdate`,i,{signal:t}),E(r,`emptied`,i,{signal:t})}}),qt=ie({name:`streamType`,state:()=>({streamType:Fe.UNKNOWN}),attach({target:e,signal:t,set:n}){let{media:r}=e;if(De(r)){let e=()=>n({streamType:r.streamType});e(),E(r,`streamtypechange`,e,{signal:t});return}if(!re(r))return;let i=()=>{let{duration:e}=r;return e===1/0?Fe.LIVE:Number.isFinite(e)&&e>0?Fe.ON_DEMAND:Fe.UNKNOWN},a=()=>n({streamType:i()});a(),E(r,`durationchange`,a,{signal:t}),E(r,`loadedmetadata`,a,{signal:t}),E(r,`emptied`,a,{signal:t}),ee(r)&&E(r,`progress`,a,{signal:t})}}),Jt={buttons:{play:`Play`,pause:`Pause`,replay:`Replay`,mute:`Mute`,unmute:`Unmute`},seek:{forward:`Seek forward {seconds} seconds`,backward:`Seek backward {seconds} seconds`},fullscreen:{enter:`Enter fullscreen`,exit:`Exit fullscreen`},captions:{enable:`Enable captions`,disable:`Disable captions`},pip:{enter:`Enter picture-in-picture`,exit:`Exit picture-in-picture`},live:{playing:`Playing live`,seekToEdge:`Seek to live edge`,badge:`Live`},cast:{start:`Start casting`,stop:`Stop casting`,connecting:`Connecting`},airplay:{start:`Start AirPlay`,stop:`Stop AirPlay`},slider:{seek:`Seek`},time:{current:`Current time`,duration:`Duration`,remaining:`Remaining`,elapsedSuffix:`{duration} elapsed`,durationSuffix:`{duration} duration`,remainingSuffix:`{duration} remaining`,showElapsed:`Show elapsed time, {duration}.`,showDuration:`Show duration, {duration}.`,showRemaining:`Show remaining time, {duration}.`,toggleElapsed:`Toggle between elapsed and remaining time.`,toggleDuration:`Toggle between duration and remaining time.`,position:`{current} of {duration}`},playback:{rate:`Playback rate {rate}`},volume:{mutedValue:`{percent}, muted`,muted:`Muted`,label:`Volume`,value:`Volume {value}`},status:{captionsOn:`Captions on`,captionsOff:`Captions off`,paused:`Paused`,playing:`Playing`,fullscreen:`Fullscreen`,pip:`Picture in picture`,exitPip:`Exit picture in picture`,seekedTo:`Seeked to {time}`},container:{label:`Media player`},errors:{aborted:`You stopped media playback before it finished.`,network:`This media could not be loaded due to a network or server issue.`,decode:`This media could not be played. It may be corrupted, or your browser may not support its format.`,source:`This media could not be loaded. It may be unavailable, or your browser may not support its format.`,encrypted:`This media could not be played because it could not be decrypted.`,unplayable:`This media is unsupported by the player.`,title:`Something went wrong.`,unexpected:`An unexpected error occurred.`},common:{empty:``,ok:`OK`},menu:{settings:`Settings`,quality:`Quality`,audio:`Audio`,default:`Default`,speed:`Speed`,captions:`Captions`,playbackRate:`Playback rate`,back:`Back`,off:`Off`,auto:`Auto`,autoWithLabel:`Auto ({label})`,subtitles:`Subtitles`}},Yt=/\{([^{}]+)\}/g,Xt=/\{\s*(\d+)\s*\}/g;function Zt(e){let t=[];return{masked:e.replace(Yt,(e,n)=>(t.push(n),`{${t.length-1}}`)),slots:t}}function Qt(e,t){return e.replace(Xt,(e,n)=>{let r=t[Number(n)];return r===void 0?e:`{${r}}`})}async function $t(e,t){let{masked:n,slots:r}=Zt(t);return r.length===0?e.translate(t):Qt(await e.translate(n),r)}var en=new Map;function tn(){if(`Translator`in globalThis)return globalThis.Translator}function nn(e){for(let t of me(e))if(!p(t))return t}function rn(e,t,n){return nn(e)?t.some(e=>!p(e))?n!==void 0&&an(n):!me(e).some(e=>!p(e)&&xe(e)):!1}function an(e){let t=Ce(Jt);return Object.keys(t).some(t=>e[t]===void 0)}async function on(e,t){let n=nn(e);if(!n)return{};let r=en.get(n);if(r)return r;let i=tn();if(!i)return{};let a=t?.downloadIfNeeded??!1,o=await i.availability({sourceLanguage:`en`,targetLanguage:n});if(o===`unavailable`||!a&&o!==`available`)return{};let s=a&&(o===`downloadable`||o===`downloading`),c=!1,l=()=>{s&&!c&&(c=!0,t?.onModelDownload?.start?.(n))};l();let u=Ce(Jt),d=Object.keys(u),f=await i.create({sourceLanguage:`en`,targetLanguage:n,...a?{monitor(e){e.addEventListener(`downloadprogress`,l)}}:{}});c&&t?.onModelDownload?.finish?.(n);let p=await Promise.all(d.map(async e=>{let t=u[e];return t?[e,await $t(f,t)]:[e,``]})),m=Object.fromEntries(p);return en.set(n,m),m}var sn={ar:()=>e(()=>import(`./Bvr36Fx2.js`),[],import.meta.url),az:()=>e(()=>import(`./BJTDR9eo.js`),[],import.meta.url),bs:()=>e(()=>import(`./MDrlDyLa.js`),[],import.meta.url),bg:()=>e(()=>import(`./DKKKRCTk.js`),[],import.meta.url),bn:()=>e(()=>import(`./1clniTQ2.js`),[],import.meta.url),ca:()=>e(()=>import(`./HQMe2V4Q.js`),[],import.meta.url),cs:()=>e(()=>import(`./BQDwXS-P.js`),[],import.meta.url),cy:()=>e(()=>import(`./DB78Mz8k.js`),[],import.meta.url),da:()=>e(()=>import(`./Cl0F1DZk.js`),[],import.meta.url),de:()=>e(()=>import(`./DgpO6A9v.js`),[],import.meta.url),el:()=>e(()=>import(`./DiLBTW_B.js`),[],import.meta.url),es:()=>e(()=>import(`./DY8EPWk0.js`),[],import.meta.url),et:()=>e(()=>import(`./CGpmmndP.js`),[],import.meta.url),eu:()=>e(()=>import(`./CRzLNrdG.js`),[],import.meta.url),fa:()=>e(()=>import(`./CleU-Bq8.js`),[],import.meta.url),fi:()=>e(()=>import(`./B3537eTu.js`),[],import.meta.url),fr:()=>e(()=>import(`./CabejNpg.js`),[],import.meta.url),gd:()=>e(()=>import(`./SC_ybzQl.js`),[],import.meta.url),gl:()=>e(()=>import(`./DXTUDcVY.js`),[],import.meta.url),he:()=>e(()=>import(`./DmHXIYye.js`),[],import.meta.url),hi:()=>e(()=>import(`./BXsZwN1O.js`),[],import.meta.url),hr:()=>e(()=>import(`./BbwOwaHI.js`),[],import.meta.url),hu:()=>e(()=>import(`./DOdodkWv.js`),[],import.meta.url),id:()=>e(()=>import(`./B3ROWnBj.js`),[],import.meta.url),it:()=>e(()=>import(`./DOrp-iSh.js`),[],import.meta.url),ja:()=>e(()=>import(`./D9Ushs-y.js`),[],import.meta.url),ko:()=>e(()=>import(`./DmWPgRW3.js`),[],import.meta.url),lt:()=>e(()=>import(`./DYAeuX7V.js`),[],import.meta.url),lv:()=>e(()=>import(`./Dk0PAR8n.js`),[],import.meta.url),mr:()=>e(()=>import(`./CvbgZSda.js`),[],import.meta.url),nb:()=>e(()=>import(`./DW8hZaLG.js`),[],import.meta.url),nl:()=>e(()=>import(`./CU7uOEB8.js`),[],import.meta.url),nn:()=>e(()=>import(`./RCYkIH0e.js`),[],import.meta.url),ne:()=>e(()=>import(`./Bb-nTZSP.js`),[],import.meta.url),oc:()=>e(()=>import(`./Cxf03Iqh.js`),[],import.meta.url),pl:()=>e(()=>import(`./BOB6lkU_.js`),[],import.meta.url),"pt-br":()=>e(()=>import(`./BJp7270K.js`),[],import.meta.url),"pt-pt":()=>e(()=>import(`./B1lVu04q.js`),[],import.meta.url),ro:()=>e(()=>import(`./GNq3z2ps.js`),[],import.meta.url),ru:()=>e(()=>import(`./BAZ1cc9m.js`),[],import.meta.url),sk:()=>e(()=>import(`./BIuGqWqO.js`),[],import.meta.url),sl:()=>e(()=>import(`./BEHBe9P2.js`),[],import.meta.url),sr:()=>e(()=>import(`./N5y0dgcK.js`),[],import.meta.url),sv:()=>e(()=>import(`./Bm9egNiH.js`),[],import.meta.url),te:()=>e(()=>import(`./CO9ICkIo.js`),[],import.meta.url),th:()=>e(()=>import(`./Dq497Zqz.js`),[],import.meta.url),tr:()=>e(()=>import(`./BWggT1yt.js`),[],import.meta.url),uk:()=>e(()=>import(`./DmCq0KDT.js`),[],import.meta.url),vi:()=>e(()=>import(`./Dt2rf5tU.js`),[],import.meta.url),"zh-cn":()=>e(()=>import(`./80F2Wr_P.js`),[],import.meta.url),"zh-tw":()=>e(()=>import(`./CesZ6hOp.js`),[],import.meta.url),pt:()=>e(()=>import(`./CcDGePAt.js`),__vite__mapDeps([0,1]),import.meta.url),zh:()=>e(()=>import(`./CyRprE5p.js`),__vite__mapDeps([2,3]),import.meta.url)};async function cn(e){if(!xe(e))for(let t of me(e)){if(xe(t))return;let e=sn[se(t)];if(e)return Ce((await e()).default)}}function k(e){return typeof e==`string`?e:e.text}function ln(e){return d(e)&&`key`in e&&`text`in e}var un=/\{([^{}]+)\}/g;function dn(e,t){return t?e.replace(un,(e,n)=>Object.hasOwn(t,n)?String(t[n]):e):e}function A(e,t,n){return typeof e==`string`?e:typeof t==`function`?t(e,n):dn(k(e),t??n)}function fn(e,t){return(t,n)=>{let r=n,i=typeof t!=`string`,a=i?t.key:t,o=e[a],s=r?.default,c=r?{...r}:void 0;return c&&delete c.default,dn(o??(i?t.text:s)??String(a),c)}}var pn={target:ne,signals:new b,get:ne,set:ne};function j(e){let t=e.state(pn),n=[...Object.keys(t),...Object.keys(e.derived??{})],r=n[0];return Object.assign(r?e=>{if(r in e)return ke(e,n)}:()=>void 0,{displayName:e.name})}var mn=j(m),hn=j(x),gn=j(ce),_n=j(Ee),vn=j(we),yn=j(Kt),bn=j(oe),xn=j(fe),Sn=j(pe),Cn=j(ge),wn=j(ye),Tn=j(de);j(ue),j(qt);var En=j(be),M=j(_e),Dn=j(Se),N={seekStep({store:e,value:t}){if(c(t))return;let n=M(e.state);n&&n.seek(n.currentTime+t)},volumeStep({store:e,value:t}){if(c(t))return;let n=Dn(e.state);n&&n.setVolume(n.volume+t)},speedUp({store:e}){let t=Cn(e.state);if(!t)return;let{playbackRates:n,playbackRate:r}=t,i=n.indexOf(r),a=i<0||i>=n.length-1?0:i+1;t.setPlaybackRate(n[a])},speedDown({store:e}){let t=Cn(e.state);if(!t)return;let{playbackRates:n,playbackRate:r}=t,i=n.indexOf(r),a=i<=0?n.length-1:i-1;t.setPlaybackRate(n[a])}},On={seekStep:N.seekStep,volumeStep:N.volumeStep,speedUp:N.speedUp,speedDown:N.speedDown};function kn(e){return On[e]||(({store:t})=>{let n=t.state[e];u(n)&&n()})}var An=200,jn=class{#e=0;#t=null;handleUp(e,t){if(e.resolve(`doubletap`).length>0){let n=Date.now();if(n-this.#e<An){this.#n(),this.#e=0,e.resolve(`doubletap`)[0]?.onActivate(t);return}this.#e=n,this.#n(),this.#t=setTimeout(()=>{this.#t=null,this.#e=0,e.resolve(`tap`)[0]?.onActivate(t)},An);return}e.resolve(`tap`)[0]?.onActivate(t)}#n(){this.#t!==null&&(clearTimeout(this.#t),this.#t=null)}reset(){this.#n(),this.#e=0}},Mn=new WeakMap;function Nn(e){let t=Mn.get(e);return t||(t=new jn,Mn.set(e,t),t)}function Pn(e,t,n){return Te(e).add({type:`tap`,recognizer:Nn(e),onActivate:t,pointer:n?.pointer,region:n?.region,disabled:n?.disabled,action:n?.action,value:n?.value})}function Fn(e,t,n){return Te(e).add({type:`doubletap`,recognizer:Nn(e),onActivate:t,pointer:n?.pointer,region:n?.region,disabled:n?.disabled,action:n?.action,value:n?.value})}function In(e){return e.startsWith(`toggle`)}var Ln={togglePaused({store:e}){let t=Sn(e.state);t&&(t.paused?t.play():t.pause())},toggleMuted({store:e}){Dn(e.state)?.toggleMuted()},toggleFullscreen({store:e}){let t=vn(e.state);t&&(t.fullscreen?t.exitFullscreen():t.requestFullscreen())},toggleSubtitles({store:e}){En(e.state)?.toggleSubtitles()},togglePictureInPicture({store:e}){let t=xn(e.state);t&&(t.pip?t.exitPictureInPicture():t.requestPictureInPicture())},seekStep:N.seekStep,volumeStep:N.volumeStep,speedUp:N.speedUp,speedDown:N.speedDown,seekToPercent({store:e,value:t,key:n}){let r=M(e.state);if(!r||r.duration<=0)return;let i;if(!c(t))i=t;else if(n>=`0`&&n<=`9`)i=Number(n)*10;else return;r.seek(i/100*r.duration)}};function Rn(e){return Ln[e]}var zn={shift:`Shift`,ctrl:`Control`,alt:`Alt`,meta:`Meta`},Bn={shift:`Shift`,ctrl:`Ctrl`,alt:`Alt`,meta:`Meta`},Vn=[`ctrl`,`shift`,`alt`,`meta`];function Hn(e){return e.map(e=>{let t=[];for(let n of Vn)e.modifiers.has(n)&&t.push(zn[n]);return t.push(e.originalKey),t.join(`+`)}).join(` `)}function Un(e){let t=[];for(let n of Vn)e.modifiers.has(n)&&t.push(Bn[n]);return t.push(Wn(e.originalKey)),t.join(`+`)}function Wn(e){return e.length===1?e.toUpperCase():e}var Gn=class{#e;#t=[];#n=0;#r=null;#i=null;#a=new Set;#o=new Set;#s=!1;constructor(e){this.#e=e}subscribe(e){return this.#a.add(e),()=>this.#a.delete(e)}subscribeShortcutChanges(e){return this.#o.add(e),()=>this.#o.delete(e)}add(e){let t={parsed:qn(e.keys),options:e,id:this.#n++};this.#t.push(t),this.#c(),e.target===`document`?this.#u():this.#l(),this.#h();let n=!1;return()=>{if(n)return;n=!0;let e=this.#t.indexOf(t);e!==-1&&this.#t.splice(e,1),this.#d(),this.#h()}}getAriaKeys(e){return this.getShortcut(e).aria}getShortcut(e,t){let n=this.#p(e,t);if(!n.length)return{};let r=n.flatMap(e=>e.parsed),i=n[n.length-1];return{aria:Hn(r),shortcut:this.#m(i)}}destroy(){this.#s||(this.#s=!0,this.#r?.abort(),this.#r=null,this.#i?.abort(),this.#i=null,this.#t=[],this.#h(),this.#a.clear(),this.#o.clear())}#c(){this.#t.sort((e,t)=>{let n=t.parsed[0].modifiers.size-e.parsed[0].modifiers.size;return n===0?e.id-t.id:n})}#l(){this.#r||(this.#r=new AbortController,E(this.#e,`keydown`,this.#f,{signal:this.#r.signal}))}#u(){this.#i||(this.#i=new AbortController,E(document,`keydown`,this.#f,{signal:this.#i.signal}))}#d(){let e=this.#t.some(e=>e.options.target!==`document`),t=this.#t.some(e=>e.options.target===`document`);e||(this.#r?.abort(),this.#r=null),t||(this.#i?.abort(),this.#i=null)}#f=e=>{if(e.key===`Unidentified`||_(e)||e.defaultPrevented)return;let t=ae(e);for(let n of this.#t){let{options:r,parsed:i}=n;if(!r.disabled&&!(e.repeat&&r.repeatable===!1)&&r.target===`document`==(e.currentTarget===document)){for(let n of i)if(Yn(n,e)&&!(t&&n.modifiers.size===0)){if(this.#a.size>0){let t={source:`hotkey`,action:r.action,value:r.value,event:e};for(let e of this.#a)try{e(t)}catch{}}e.preventDefault(),r.onActivate(e,n.originalKey);return}}}};#p(e,t){return this.#t.filter(n=>n.options.disabled||n.options.action!==e?!1:c(t)?!0:n.options.value===t).sort((e,t)=>e.id-t.id)}#m(e){return e.options.keys===`0-9`?e.options.keys:Un(e.parsed[0])}#h(){for(let e of this.#o)e()}},Kn=new Set([`shift`,`ctrl`,`alt`,`meta`]);function qn(e){if(e===`0-9`)return Array.from({length:10},(e,t)=>({modifiers:new Set,key:String(t),originalKey:String(t)}));let t=e.split(`+`),n=t.pop(),r=new Set;for(let e of t){let t=e.toLowerCase();t===`mod`?r.add(Et()?`meta`:`ctrl`):Kn.has(t)&&r.add(t)}return[{modifiers:r,key:n===`Space`?` `:n.toLowerCase(),originalKey:n}]}function Jn(e){return e.length===1&&!/[a-z]/i.test(e)}function Yn(e,t){if(t.key===`Unidentified`||t.key.toLowerCase()!==e.key)return!1;let n=Jn(t.key),r=n?t.shiftKey&&e.modifiers.has(`shift`):t.shiftKey,i=n?t.altKey&&e.modifiers.has(`alt`):t.altKey;return r===e.modifiers.has(`shift`)&&t.ctrlKey===e.modifiers.has(`ctrl`)&&i===e.modifiers.has(`alt`)&&t.metaKey===e.modifiers.has(`meta`)}var Xn=new WeakMap;function Zn(e){let t=Xn.get(e);return t||(t=new Gn(e),Xn.set(e,t)),t}function Qn(e,t){return Zn(e).add(t)}var $n=`hotkey-shortcut-change`;function er(e){let{onActivate:t,isDisabled:n}=e;return{role:`button`,tabIndex:0,onClick(e){if(n()){e.preventDefault();return}t(e)},onPointerDown(e){n()&&e.preventDefault()},onMouseDown(e){n()&&e.preventDefault()},onKeyDown(e){if(e.target===e.currentTarget){if(n()){e.key!==`Tab`&&e.preventDefault();return}e.key===`Enter`?(e.preventDefault(),t(e)):e.key===` `&&e.preventDefault()}},onKeyUp(e){e.target===e.currentTarget&&(n()||e.key===` `&&t(e))}}}var tr=`group`;function nr(e){e.hasAttribute(`role`)||e.setAttribute(`role`,tr),e.hasAttribute(`tabindex`)||e.setAttribute(`tabindex`,`0`)}function rr(e){let t=We(e.ownerDocument);(!t||t===e.ownerDocument.body||!Wt(e,t))&&e.focus({preventScroll:!0})}function ir(e){let{transition:t}=e,n=t.state,r=new AbortController,i=null;function a(e){if(r.signal.aborted)return null;let{active:i,status:a}=n.current;return i&&a!==`ending`?null:(a===`ending`&&t.cancel(),t.open(e))}function o(e){let{active:i,status:a}=n.current;return r.signal.aborted||!i||a===`ending`?null:t.close(e)}function s(){if(c(),typeof document>`u`)return;i=new AbortController;let{signal:t}=i;E(document,`keydown`,l,{signal:t}),e.onDocumentActive?.(t)}function c(){i?.abort(),i=null}function l(t){t.key===`Escape`&&(t.defaultPrevented||n.current.active&&(e.closeOnEscape?.()??!0)&&e.onEscapeDismiss(t))}let u=n.subscribe(()=>{n.current.active&&n.current.status!==`ending`?s():c()});r.signal.addEventListener(`abort`,()=>{u(),t.destroy(),c()});function d(){r.signal.aborted||r.abort()}return{input:n,open:a,close:o,signal:r.signal,destroy:d}}function ar(e){let t=null,n=null,r=null,i=0,a=new Map,o=ir({transition:e.transition,closeOnEscape:e.closeOnEscape,onEscapeDismiss(e){e.preventDefault(),e.stopPropagation(),l()},onDocumentActive(e){E(document,`keydown`,d,{capture:!0,signal:e}),E(document,`focusin`,f,{signal:e})}}),s=o.input;function c(){r=We();let n=o.open(()=>t);n&&(h(),e.onOpenChange(!0),u(),n.then(()=>{!o.signal.aborted&&s.current.active&&s.current.status===`idle`&&e.onOpenChangeComplete?.(!0)}))}function l(){let a=o.close(t);a&&(cancelAnimationFrame(i),i=0,e.onOpenChange(!1),a.then(()=>{if(o.signal.aborted||s.current.active)return;_();let t=n?.isConnected?n:r;t?.isConnected&&t.focus(),r=null,e.onOpenChangeComplete?.(!1)}))}function u(){cancelAnimationFrame(i),i=requestAnimationFrame(()=>{i=0,!o.signal.aborted&&s.current.active&&t&&(t.querySelector(`[autofocus]`)??Ge(t)[0]??t).focus()})}function d(e){if(e.key!==`Tab`||!s.current.active||!t)return;let n=Ge(t);if(n.length===0){e.preventDefault(),t.focus();return}let r=We(),i=n[0],a=n[n.length-1];e.shiftKey&&(r===i||!r||!Wt(t,r))?(e.preventDefault(),a.focus()):!e.shiftKey&&(r===a||!r||!Wt(t,r))&&(e.preventDefault(),i.focus())}function f(e){s.current.active&&t&&(e.target instanceof Element&&Wt(t,e.target)||(Ge(t)[0]??t).focus())}function p(e){n=e}function m(e){t!==e&&_(),t=e,e&&s.current.active&&h();let n=We();e&&s.current.active&&(!n||!Wt(e,n))&&u()}return o.signal.addEventListener(`abort`,()=>{cancelAnimationFrame(i),i=0,_(),t=null,n=null,r=null}),{input:s,triggerProps:{onClick(){c()}},open:c,close:l,setTriggerElement:p,setPopupElement:m,destroy:o.destroy};function h(){!t?.isConnected||a.size>0||Ve(t,e=>{if(e===document.body)return!0;if(e.assignedSlot){for(let t of e.assignedSlot.assignedElements({flatten:!0}))t!==e&&t instanceof HTMLElement&&g(t);return}let t=e.parentElement;if(t){for(let n of t.children)n!==e&&n instanceof HTMLElement&&g(n);return}let n=e.getRootNode();if(n instanceof ShadowRoot)for(let t of n.children)t!==e&&t instanceof HTMLElement&&g(t)},{composed:!0})}function g(e){a.set(e,e.hasAttribute(`inert`)),e.setAttribute(`inert`,``)}function _(){for(let[e,t]of a)t||e.removeAttribute(`inert`);a.clear()}}var or={transitionStarting:`data-starting-style`,transitionEnding:`data-ending-style`};function sr(e){return{transitionStarting:e===`starting`,transitionEnding:e===`ending`}}var cr=class{#e=null;#t;#n;constructor(e,t){this.#t=e,this.#n=t}arm(){this.clear(),this.#e=setTimeout(()=>{this.#e=null,this.#t()},this.#n())}clear(){this.#e!==null&&(clearTimeout(this.#e),this.#e=null)}close(){this.clear(),this.#t()}destroy(){this.clear()}},lr=class{#e=new Set;register(e){return this.#e.add(e),()=>this.#e.delete(e)}show(e){for(let t of this.#e)t!==e&&t.close()}};function ur(e){return e.closeDelay??800}function dr(e,t){return e.open||t.active}function fr(e,t,n){let r=e.open?e:t;return{...r,open:e.open&&n.active,generation:e.open?e.generation:r.generation,...sr(n.status)}}function pr(e){return{action:e.action,value:e.value,source:e.source,key:`key`in e.event?e.event.key:void 0}}function mr(e){if(!e)return{};let t=e.state,n=M(t),r=En(t);return{paused:Sn(t)?.paused,volume:Dn(t)?.volume,muted:Dn(t)?.muted,playbackRate:Cn(t)?.playbackRate,fullscreen:vn(t)?.fullscreen,subtitlesShowing:r?.subtitlesShowing,subtitlesAvailable:r?(r.textTrackList??[]).some(Me):void 0,pip:xn(t)?.pip,currentTime:n?.currentTime,duration:n?.duration,seeking:n?.seeking}}function hr(e,t){let n=e=>t(pr(e)),r=Te(e).subscribe(n),i=Zn(e).subscribe(n);return()=>{r(),i()}}var gr=new WeakMap;function _r(e){let t=gr.get(e);return t||(t=new lr,gr.set(e,t)),t}function vr(e){e?.getBoundingClientRect()}function yr(e,t,n,r){let i=e+n,a=t+r;return{x:e,y:t,width:n,height:r,top:t,right:i,bottom:a,left:e,toJSON(){return{x:e,y:t,width:n,height:r,top:t,right:i,bottom:a,left:e}}}}function br(e,t){let n=Math.max(e.left,t.left),r=Math.max(e.top,t.top),i=Math.min(e.right,t.right),a=Math.min(e.bottom,t.bottom);return yr(n,r,Math.max(0,i-n),Math.max(0,a-r))}function xr(e){let t=document.documentElement.getBoundingClientRect();return e?br(t,e.getBoundingClientRect()):t}function Sr(e,t={}){if(!e)return null;if(!l(e))return e;if(e===`viewport`)return null;if(e===`container`)return t.container??null;try{return(t.root??document).querySelector(e)}catch{return null}}function Cr(e){let{onOpenChange:t,closeOnOutsideClick:n}=e,r=null,i=null,a=null,o=new Set,s=!1,c=null,l=ir({transition:e.transition,closeOnEscape:e.closeOnEscape,onEscapeDismiss(e){e.preventDefault(),b(`escape`,e)},onDocumentActive(e){E(document,`pointerdown`,S,{capture:!0,signal:e})}}),u=l.input,d={close(e){b(e)},get triggerElement(){return r}};function f(){a!==null&&(clearTimeout(a),a=null)}function p(){return globalThis.matchMedia?.(`(hover: hover)`)?.matches??!1}function m(){return p()?globalThis.matchMedia?.(`(pointer: fine)`)?.matches??!1:!1}function h(){return!e.openOnHover?.()||p()}function g(){s=!1,c!==null&&(clearTimeout(c),c=null)}function _(){s=!0,c!==null&&clearTimeout(c),c=setTimeout(g,500)}function ee(){return s?(g(),!0):!1}function te(){return r?r.hasAttribute(`disabled`)?!0:r.getAttribute(`aria-disabled`)===`true`:!1}function v(){let t=l.open(()=>i);t&&(e.group?.()?.open(d),t.then(()=>{!l.signal.aborted&&u.current.active&&u.current.status===`idle`&&e.onOpenChangeComplete?.(!0)}))}function ne(){let t=l.close(i);t&&(e.group?.()?.close(d),t.then(()=>{l.signal.aborted||u.current.active||(Mt(i),e.onOpenChangeComplete?.(!1))}))}function y(n,r){if(l.signal.aborted)return;let{active:i,status:a}=u.current;i&&a!==`ending`||(t(!0,r?{reason:n,event:r}:{reason:n}),e.deferOpenChanges||v())}function b(n,r){if(l.signal.aborted)return;let{active:i,status:a}=u.current;i&&a!==`ending`&&(t(!1,r?{reason:n,event:r}:{reason:n}),e.deferOpenChanges||ne())}function re(e=`click`){y(e)}function x(e=`click`){f(),b(e)}function ie(t){e.deferOpenChanges&&(t?v():ne())}function S(e){if(!n()||!u.current.active)return;let t=e.composedPath();if(r&&t.includes(r)||i&&t.includes(i)){_();return}g(),b(`outside-click`,e)}l.signal.addEventListener(`abort`,()=>{e.group?.()?.close(d),f(),g(),o.clear(),r=null,i=null});let ae={onClick(e){h()&&(te()||(u.current.active&&u.current.status!==`ending`?b(`click`,e):y(`click`,e)))},onPointerEnter(t){if(!e.openOnHover?.()||!p()||(f(),u.current.active))return;let n=e.delay?.()??300;a=setTimeout(()=>y(`hover`),n)},onPointerLeave(t){if(!e.openOnHover?.()||!p()||(f(),!u.current.active))return;let n=e.closeDelay?.()??0;a=setTimeout(()=>b(`hover`),n)},onFocusIn(t){if(e.openOnHover?.()){if(!m())return;y(`focus`)}},onFocusOut(t){let n=t.relatedTarget;n&&(r?.contains(n)||i?.contains(n))||e.openOnHover?.()&&b(`blur`)}},C={onPointerEnter(t){e.openOnHover?.()&&f()},onPointerLeave(t){if(!e.openOnHover?.()||o.size>0||(f(),!u.current.active))return;let n=e.closeDelay?.()??0;a=setTimeout(()=>b(`hover`),n)},onGotPointerCapture(e){o.add(e.pointerId)},onLostPointerCapture(e){o.delete(e.pointerId)},onFocusOut(e){let t=e.relatedTarget;if(!(t&&(r?.contains(t)||i?.contains(t)))&&!ee()){if(t!==null){b(`blur`);return}requestAnimationFrame(()=>{requestAnimationFrame(()=>{if(!u.current.active||u.current.status===`ending`||u.current.status===`starting`)return;let e=We(i?.ownerDocument);e&&(r?.contains(e)||i?.contains(e))||b(`blur`)})})}}};function oe(e){r=e}function se(e){!e&&i&&u.current.active&&Mt(i),i=e,e&&u.current.active&&jt(e)}return{input:u,triggerProps:ae,popupProps:C,get triggerElement(){return r},setTriggerElement:oe,setPopupElement:se,open:re,close:x,syncOpen:ie,destroy:l.destroy}}var wr={item:`data-item`,highlighted:`data-highlighted`},Tr={width:`--media-menu-width`,height:`--media-menu-height`,availableWidth:`--media-menu-available-width`,availableHeight:`--media-menu-available-height`},P={sideOffset:`--media-popover-side-offset`,alignOffset:`--media-popover-align-offset`,boundaryOffset:`--media-popover-boundary-offset`,anchorWidth:`--media-popover-anchor-width`,anchorHeight:`--media-popover-anchor-height`,availableWidth:`--media-popover-available-width`,availableHeight:`--media-popover-available-height`};function Er(e){let{key:t}=e;return t===`ArrowDown`||t===`ArrowUp`||t===`ArrowLeft`||t===`ArrowRight`||t===`Home`||t===`End`||t===`Enter`||t===` `||t===`Escape`||t.length===1&&!e.ctrlKey&&!e.altKey&&!e.metaKey}function Dr(e,t){return!e||!t?null:{side:e,align:t}}var Or={...P,availableWidth:Tr.availableWidth,availableHeight:Tr.availableHeight},kr=new WeakMap;function Ar(e){e.close()}function jr(e){let t=[],n=null,r=null,i=null,a=null,o=new Set,s=new Map,c=``,l=null,u=null,d=0,f=null,p;function m(e){let t=e.getAttribute(`data-availability`);return!!(e.hidden||e.hasAttribute(`data-hidden`)||e.getAttribute(`aria-hidden`)===`true`||t===`unavailable`||t===`unsupported`)}function h(){return t.filter(e=>!m(e))}function g(e){if(t.length===0)return null;let r=n?t.indexOf(n):e===1?-1:0;for(let n=1;n<=t.length;n++){let i=(r+e*n+t.length)%t.length,a=t[i];if(a&&!m(a))return a}return null}function _(t,r){if(!t&&d&&(cancelAnimationFrame(d),d=0),t&&m(t)){t===n&&_(g(1),r);return}if(n===t){t?.setAttribute(wr.highlighted,r?.pointer===!0?`pointer`:``);return}let i=n;i&&(i.tabIndex=-1),n=t,t?(t.tabIndex=0,t.setAttribute(wr.highlighted,r?.pointer===!0?`pointer`:``),i&&se(t,i)<0&&r?.pointer&&vr(t.parentElement),i?.removeAttribute(wr.highlighted),r?.focus!==!1&&(r?.preventScroll?t.focus({preventScroll:!0}):t.focus())):i?.removeAttribute(wr.highlighted),e.onHighlightChange?.(t)}function ee(){n&&(n.tabIndex=-1,n.removeAttribute(wr.highlighted),n=null,e.onHighlightChange?.(null))}function te(e){_(h()[0]??null,e)}function v(e){f!==`imperative-action`&&f!==`group-open`&&f!==`blur`&&f!==`outside-click`&&(e?r?.focus(e):r?.focus())}function ne(){let e=h();return e.find(e=>e.matches(`[role="menuitemradio"][aria-checked="true"], [aria-selected="true"]`))??e[0]??null}function y(){l!==null&&(clearTimeout(l),l=null),c=``}function b(){cancelAnimationFrame(d),d=requestAnimationFrame(()=>{d=0,x.input.current.active&&x.input.current.status!==`ending`&&!n&&_(ne(),{preventScroll:!0})})}function re(e){c=c.length===1&&c.toLowerCase()===e.toLowerCase()?e:c+e,l!==null&&clearTimeout(l),l=setTimeout(y,500);let t=h(),r=(n?t.indexOf(n):-1)+1,i=[...t.slice(r),...t.slice(0,r)],a=c.toLowerCase(),o=i.find(e=>(e.textContent?.trim().toLowerCase()??``).startsWith(a));o&&_(o)}let x=Cr({transition:e.transition,deferOpenChanges:!0,onOpenChange(t,n){f=t?null:n.reason,e.onOpenChange(t,n),t?b():(ee(),y())},onOpenChangeComplete(t){e.onOpenChangeComplete?.(t),t||v()},closeOnEscape:e.closeOnEscape,closeOnOutsideClick:e.closeOnOutsideClick,...e.group?{group:e.group}:{}}),ie={onFocusOut(e){if(e.relatedTarget===null&&ue()){u=e;return}x.popupProps.onFocusOut(e)},onKeyDown(e){let{key:t}=e,r=h();if(t!==`Escape`&&Er(e)&&!e.defaultPrevented&&e.preventDefault(),r.length!==0)switch(t){case`ArrowDown`:e.preventDefault(),_(g(1));break;case`ArrowUp`:e.preventDefault(),_(g(-1));break;case`Home`:e.preventDefault(),_(r[0]??null);break;case`End`:e.preventDefault(),_(r[r.length-1]??null);break;case`Enter`:case` `:e.preventDefault(),n&&r.includes(n)&&n.click();break;default:t.length===1&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&re(t)}}};function S(e){let t=x.input.current;t.active&&t.status!==`ending`&&e.key!==`Escape`&&Er(e)&&(ie.onKeyDown(e),e.stopPropagation())}function ae(e){r=e,x.setTriggerElement(e)}function C(e){i=e}function oe(e){a=e,x.setPopupElement(e)}function se(e,t){if(e===t)return 0;let n=e.compareDocumentPosition(t);return n&Node.DOCUMENT_POSITION_FOLLOWING?-1:n&Node.DOCUMENT_POSITION_PRECEDING?1:0}function ce(e){let r=()=>_(e,{focus:!1});return e.tabIndex=-1,e.setAttribute(wr.item,``),e.addEventListener(`focus`,r),t.push(e),t.sort(se),x.input.current.active&&x.input.current.status!==`ending`&&!n&&b(),()=>{e.removeEventListener(`focus`,r);let i=t.indexOf(e);i!==-1&&t.splice(i,1),n===e&&ee()}}function le(e){o.add(e),kr.set(e,p);let t=e.input.subscribe(de);return s.set(e,t),()=>{o.delete(e),kr.get(e)===p&&kr.delete(e),s.get(e)?.(),s.delete(e),de()}}function ue(){return[...o].some(({input:e})=>e.current.status===`ending`)}function de(){if(!u||ue())return;let e=u;u=null,x.popupProps.onFocusOut(e)}function fe(e){if(e)kr.get(p)?.highlight(null);else for(let e of o)e.close(`imperative-action`);x.syncOpen(e)}function pe(){cancelAnimationFrame(d),d=0,y();for(let e of s.values())e();for(let e of o)kr.get(e)===p&&kr.delete(e);s.clear(),o.clear(),kr.delete(p),u=null,x.destroy()}return p={input:x.input,triggerProps:{onClick:x.triggerProps.onClick,onKeyDown:S},contentProps:ie,get triggerElement(){return r},get contentElement(){return i},get popupElement(){return a},setTriggerElement:ae,setContentElement:C,setPopupElement:oe,registerItem:ce,registerSubmenu:le,highlight:_,highlightFirstItem:te,restoreFocus:v,open:x.open,close:x.close,syncOpen:fe,destroy:pe},p}var Mr={open:`data-open`,side:`data-side`,align:`data-align`,...or},Nr={open:`data-open`,isSubmenu:`data-submenu`,childOpen:`data-child-open`,...or};({...Mr,...Nr});function Pr(){let e=new Set,t=null,n=0;function r(){cancelAnimationFrame(n),u(),n=requestAnimationFrame(u)}function i(t){return[...e].filter(e=>e.parent===t)}function a(e){return i(e).find(({menu:e})=>{let t=e.input.current;return t.active&&t.status!==`ending`})??null}function o(){let t=[...e].find(e=>e.parent===null)??null;for(;t;){let e=a(t.menu);if(!e)return t;t=e}return null}function s(e,t){t?(e.element.setAttribute(`aria-hidden`,`true`),e.element.setAttribute(`inert`,``)):Oe(e.element,e.accessibility)}function c(e){return Ve(e,e=>{let t=$e(e,Tr.availableWidth);return t!==null&&t>0?t:void 0})??null}function l(e,t){let n=Ie(e,e=>e instanceof HTMLElement&&!e.hidden);return n.length===0?nt(e,{overflow:`both`,styles:{width:`max-content`,height:`auto`,minWidth:`0px`,maxWidth:`none`}}):ct(e,{children:n,includePadding:!0,maxWidth:t,measure:(e,t)=>nt(e,{overflow:`both`,styles:{insetInlineStart:`0px`,insetInlineEnd:`auto`,width:t===void 0?`max-content`:`${t}px`,height:`auto`,minWidth:`0px`,maxWidth:`none`}})})}function u(){if(!t)return;for(let t of e){let e=a(t.menu);e?(t.menu.highlight(null),t.element.setAttribute(Nr.childOpen,``)):t.element.removeAttribute(Nr.childOpen);let n=t.menu.input.current,r=t.parent!==null&&n.active&&n.status===`ending`;s(t,e!==null||r)}let n=o();if(!n)return;let r=n.parent===null?rt(t):null,i=r?it(r):0,u=r?at(r):0,d=c(t),f=d===null?null:Math.max(0,d-i),p=l(n.element,f);t.style.setProperty(Tr.width,`${Math.ceil(p.width+i)}px`),t.style.setProperty(Tr.height,`${Math.ceil(p.height+u)}px`)}function d(e){t=e,r()}function f(t){let n={...t,accessibility:Ae(t.element,[`aria-hidden`,`inert`]),stopObserving:()=>{},unsubscribe:()=>{}};return n.unsubscribe=t.menu.input.subscribe(r),n.stopObserving=Tt({root:t.element,getElements:()=>[t.element],mutations:{childList:!0,subtree:!0,characterData:!0},onChange:r}),e.add(n),t.menu.setContentElement(t.element),r(),()=>{e.delete(n),n.unsubscribe(),n.stopObserving(),Oe(t.element,n.accessibility),t.element.removeAttribute(Nr.childOpen),t.menu.contentElement===t.element&&t.menu.setContentElement(null),r()}}function p(){cancelAnimationFrame(n);for(let t of e)t.unsubscribe(),t.stopObserving(),Oe(t.element,t.accessibility),t.element.removeAttribute(Nr.childOpen),t.menu.contentElement===t.element&&t.menu.setContentElement(null);e.clear(),t=null}return{get element(){return t},setElement:d,registerContent:f,sync:u,destroy:p}}function Fr(){let e=null,t=new Set;function n(){for(let e of t)e()}return{open(t){if(e===t)return;let r=e;e=t,r?.close(`group-open`),n()},close(t){e===t&&(e=null,n())},isOpenFor(t){return t!==null&&e?.triggerElement===t},subscribe(e){return t.add(e),()=>t.delete(e)}}}function Ir(e,t){if(!t)return!1;if(u(e.composedPath))return e.composedPath().includes(t);let n=e.target;return n instanceof Node&&t.contains(n)}function F(e,t,n){return Math.max(t,Math.min(n,e))}function Lr(e,t,n){let r=n-t;return!Number.isFinite(r)||r<=0?0:F((e-t)/r*100,0,100)}function Rr(e,t,n){let r=Math.round((e-n)/t)*t+n,i=`${t}`.indexOf(`.`);return i===-1?r:Number(r.toFixed(`${t}`.length-i-1))}var zr={sideOffset:0,alignOffset:0,boundaryOffset:0},Br={top:`bottom`,bottom:`top`,left:`right`,right:`left`};function Vr(e){return`${F(e,0,1/0)}px`}function Hr(e,t,n,r){let i=n-r;return i<t?t:F(e,t,i)}function Ur({align:e,direction:t=`ltr`}){return t===`rtl`?e===`start`?`end`:e===`end`?`start`:e:e}function Wr(e,t,n,r,i,a,o,s,c,l){let u=a===`start`?e+o:a===`end`?t+o:e+n/2+o,d=c===`horizontal`?`left`:`top`,f=Br[d],p=a===`start`?d:a===`end`?f:`center`,m=a===`start`?`0px`:a===`end`?`-100%`:`-50%`;return{base:`calc(anchor(${p}) + ${l})`,translate:`clamp(${r+s-u}px, ${m}, calc(${i-s-u}px - 100%))`}}function Gr(e,t,n,r,i,a,o=P){if(qe())return{...Kr(e,t,o,n,i,a),...n&&i?qr(n,i,t,a,o):{}};if(n&&r){let e=a??zr;return{position:`fixed`,margin:`0`,...Jr(n,r,t,e,i),...i?qr(n,i,t,e,o):{}}}return{}}function Kr(e,t,n=P,r,i,a=zr){let o=`var(${n.sideOffset}, 0px)`,s=`var(${n.alignOffset}, 0px)`,{side:c,align:l}=t,u=a.boundaryOffset??0,d={positionAnchor:`--${e}`,position:`fixed`,inset:`auto`,margin:`0`,justifySelf:`normal`,alignSelf:`normal`,marginInlineStart:`0`,marginBlockStart:`0`,translate:`none`},f=Br[c];if(c===`top`||c===`bottom`){let e=Ur(t);if(d[f]=`calc(anchor(${c}) + ${o})`,r&&i){let{base:t,translate:n}=Wr(r.left,r.right,r.width,i.left,i.right,e,a.alignOffset,u,`horizontal`,s);return d.left=t,d.translate=`${n} 0`,d}e===`start`?d.left=`calc(anchor(left) + ${s})`:e===`end`?d.right=`calc(anchor(right) + ${s})`:(d.justifySelf=`anchor-center`,d.marginInlineStart=s)}else{if(d[f]=`calc(anchor(${c}) + ${o})`,r&&i){let{base:e,translate:t}=Wr(r.top,r.bottom,r.height,i.top,i.bottom,l,a.alignOffset,u,`vertical`,s);return d.top=e,d.translate=`0 ${t}`,d}l===`start`?d.top=`calc(anchor(top) + ${s})`:l===`end`?d.bottom=`calc(anchor(bottom) + ${s})`:(d.alignSelf=`anchor-center`,d.marginBlockStart=s)}return d}function qr(e,t,n,r=zr,i=P){let a={},{side:o}=n,s=r.boundaryOffset??0,c=t.left+s,l=t.right-s,u=t.top+s,d=t.bottom-s;if(a[i.anchorWidth]=`${e.width}px`,a[i.anchorHeight]=`${e.height}px`,o===`top`||o===`bottom`){let t=o===`top`?e.top-u:d-e.bottom;a[i.availableHeight]=Vr(t-r.sideOffset),a[i.availableWidth]=Vr(l-c)}else{let t=o===`left`?e.left-c:l-e.right;a[i.availableWidth]=Vr(t-r.sideOffset),a[i.availableHeight]=Vr(d-u)}return a}function Jr(e,t,n,r={sideOffset:0,alignOffset:0},i){let{side:a,align:o}=n,{sideOffset:s,alignOffset:c}=r,l=0,u,d=0,f;if(a===`top`?u=`calc(100% - ${e.top}px + ${s}px)`:a===`bottom`?l=e.bottom+s:a===`left`?f=`calc(100% - ${e.left}px + ${s}px)`:d=e.right+s,a===`top`||a===`bottom`){let r=Ur(n);d=r===`start`?e.left+c:r===`end`?e.right-t.width+c:e.left+(e.width-t.width)/2+c}else l=o===`start`?e.top+c:o===`end`?e.bottom-t.height+c:e.top+(e.height-t.height)/2+c;if(i){let e=r.boundaryOffset??0;a===`top`||a===`bottom`?d=Hr(d,i.left+e,i.right-e,t.width):l=Hr(l,i.top+e,i.bottom-e,t.height)}return{top:a===`top`?`auto`:`${l}px`,bottom:u??`auto`,left:a===`left`?`auto`:`${d}px`,right:f??`auto`}}function Yr(e,t=P){let n=getComputedStyle(e);return{sideOffset:et(e,n.getPropertyValue(t.sideOffset)),alignOffset:et(e,n.getPropertyValue(t.alignOffset)),boundaryOffset:et(e,n.getPropertyValue(t.boundaryOffset))}}function Xr(e,t){let n=e.getBoundingClientRect(),r=tt(e,{box:`layout`,overflow:t===`left`||t===`right`?`width`:`height`});return yr(n.left,n.top,r.width,r.height)}var Zr=[`position`,`inset`,`margin`,`margin-top`,`margin-right`,`margin-bottom`,`margin-left`,`justify-self`,`align-self`,`margin-inline-start`,`margin-block-start`,`translate`,`top`,`right`,`bottom`,`left`],Qr=class{#e=null;#t=null;#n=null;#r=null;#i=null;#a=!1;#o=null;#s=null;#c=Nt(()=>this.#f());sync(e){let{anchorName:t,position:n,trigger:r,popup:i,boundary:a,container:o,cssVars:s=P}=e;if(!n||!r||!i){this.cleanup();return}let c=Sr(a,{container:o??null,root:i.getRootNode()}),l=this.#e;!l||l.anchorName!==t||l.trigger!==r||l.popup!==i||(l.cssVars??P)!==s||l.trackResize!==e.trackResize||this.#t!==c?(l?.popup&&this.#m(l.popup),this.#u(),this.#e={...e,cssVars:s},this.#t=c,this.#l()):this.#e={...e,cssVars:s},this.#f()}cleanup(){this.#e&&(this.#e.popup&&this.#m(this.#e.popup),this.#u(),this.#e=null,this.#t=null)}#l(){let e=this.#e;if(!e?.trigger||!e.popup)return;this.#h(e.trigger,e.popup,e.anchorName),this.#n=new AbortController;let{signal:t}=this.#n;window.addEventListener(`scroll`,this.#d,{capture:!0,passive:!0,signal:t}),window.addEventListener(`resize`,this.#d,{signal:t});let n=[e.trigger];e.trackResize!==!1&&n.push(e.popup),this.#t&&n.push(this.#t),this.#r=wt(n,()=>this.#d())}#u(){this.#n?.abort(),this.#n=null,this.#r?.(),this.#r=null,this.#c.cancel(),this.#g()}#d=e=>{let t=this.#e?.popup;!t||e&&Ir(e,t)||this.#c()};#f(){let e=this.#e;if(!e?.position||!e.trigger||!e.popup)return;let t=e.trigger,n=t.getBoundingClientRect(),r=xr(this.#t),i=Yr(e.popup,e.cssVars),a=e.position,o=qe(),s=s=>{let c=At(n,s,r,a,i),{positionAnchor:l,...u}=Gr(e.anchorName,{...a,side:c,direction:Re(t)?`rtl`:`ltr`},n,o?void 0:s,r,i,e.cssVars);return{popupRect:s,side:c,style:u}},c=s(Xr(e.popup,a.side));if(this.#p(e.popup,e.cssVars??P),D(e.popup,c.style),e.onSideChange?.(c.side),o||!e.onSideChange)return;let l=Xr(e.popup,a.side);if(l.width===c.popupRect.width&&l.height===c.popupRect.height)return;let u=s(l);D(e.popup,u.style),u.side!==c.side&&e.onSideChange(u.side)}#p(e,t){if(this.#s)return;let n=[...Zr,t.anchorWidth,t.anchorHeight,t.availableWidth,t.availableHeight];this.#s=Xe(e,n)}#m(e){this.#s&&=(Ze(e,this.#s),null)}#h(e,t,n){if(!qe())return;let r=`--${n}`,i=this.#_(e,`anchor-name`);this.#o=this.#_(t,`position-anchor`);let a=Ye(e);this.#i=r,this.#a=!a.includes(r),this.#a&&a.push(r),e.style.setProperty(`anchor-name`,a.join(`, `),i.priority),t.style.setProperty(`position-anchor`,r)}#g(){let e=this.#e;if(e?.trigger&&e.popup){if(this.#i&&this.#a){let t=this.#_(e.trigger,`anchor-name`),n=Ye(e.trigger).filter(e=>e!==this.#i);this.#v(e.trigger,`anchor-name`,{value:n.join(`, `),priority:t.priority})}this.#o&&this.#v(e.popup,`position-anchor`,this.#o),this.#i=null,this.#a=!1,this.#o=null}}#_(e,t){let n=t.startsWith(`--`)?t:r(t);return{value:e.style.getPropertyValue(n),priority:e.style.getPropertyPriority(n)}}#v(e,t,n){let i=t.startsWith(`--`)?t:r(t);n.value?e.style.setProperty(i,n.value,n.priority):e.style.removeProperty(i)}};function $r(e,t,n){let r;return r=n===`vertical`?1-(e.clientY-t.top)/t.height:(e.clientX-t.left)/t.width,Number.isFinite(r)?F(r*100,0,100):0}var ei=3;function ti(e){let t=v({pointerPercent:0,dragPercent:0,dragging:!1,pointing:!1,focused:!1}),n=new AbortController,r=e.changeThrottle??0,i=!1,a=null,s=null,c=0,l=0,u=0,d=!1,f=!1,p=r>0?Gt(t=>e.onValueChange?.(t),r,{leading:!0}):null;function m(t,n){n&&p?p(t):e.onValueChange?.(t)}function h(){if(o(s))return;let t=s;s=null;try{e.getElement().releasePointerCapture(t)}catch{}}function g(){if(!i)return;let n=d&&f,r=t.current.dragging;d||e.onValueCommit?.(u),i=!1,t.patch({dragging:!1,pointing:n}),r&&e.onDragEnd?.(),d=!1,f=!1,_()}function _(){p?.cancel(),s=null,a=null}let ee={onPointerDown(n){if(e.isDisabled())return;n.stopPropagation(),n.preventDefault();let r=e.getElement();a=r.getBoundingClientRect(),d=!1,f=!1,h(),s=n.pointerId,r.setPointerCapture(n.pointerId);let o=$r(n,a,e.getOrientation());i=!0,c=n.clientX,l=n.clientY,u=o,t.patch({pointing:!0,pointerPercent:o,dragPercent:o}),e.onValueChange?.(o),e.getThumbElement?.()?.focus({preventScroll:!0,focusVisible:!1})},onPointerMove(n){if(e.isDisabled())return;if(!o(s)){if(n.pointerType!==`touch`&&n.buttons===0){g();return}let r=$r(n,a,e.getOrientation()),i=!t.current.dragging;if(i&&Math.hypot(n.clientX-c,n.clientY-l)<ei)return;u=r,t.patch({dragging:!0,dragPercent:r,pointerPercent:r}),i&&e.onDragStart?.(),m(r,!0);return}let r=$r(n,e.getElement().getBoundingClientRect(),e.getOrientation());t.patch({pointing:!0,pointerPercent:r})},onPointerUp(t){if(e.isDisabled()||(t.stopPropagation(),o(s)))return;let n=$r(t,a,e.getOrientation()),r=e.getElement().getBoundingClientRect();f=t.pointerType!==`touch`&&t.clientX>=r.left&&t.clientX<=r.right&&t.clientY>=r.top&&t.clientY<=r.bottom,p?.cancel(),e.onValueChange?.(n),e.onValueCommit?.(n),d=!0},onPointerLeave(){o(s)&&t.patch({pointing:!1})},onLostPointerCapture(){g()}},te={onKeyDown(n){if(e.isDisabled()){n.key!==`Tab`&&n.preventDefault();return}let r=e.getStepPercent(),i=e.getLargeStepPercent(),a=Rr(e.getPercent(),r,0),o=n.shiftKey?i:r,s=null;switch(n.key){case`ArrowRight`:s=a+o;break;case`ArrowLeft`:s=a-o;break;case`ArrowUp`:s=a+o;break;case`ArrowDown`:s=a-o;break;case`PageUp`:s=a+i;break;case`PageDown`:s=a-i;break;case`Home`:s=0;break;case`End`:s=100}s!==null&&(n.preventDefault(),s=F(s,0,100),t.patch({pointerPercent:s,dragPercent:s,pointing:!1}),e.onValueChange?.(s),e.onValueCommit?.(s))},onFocus(){t.patch({focused:!0})},onBlur(){t.patch({focused:!1})}};function ne(t){if(!e.adjustPercent||t.thumbAlignment!==`edge`)return t;let n=e.getElement(),r=e.getThumbElement?.();if(!r)return t;let i=t.orientation===`horizontal`,a=i?r.offsetWidth:r.offsetHeight,o=i?n.offsetWidth:n.offsetHeight;return{...t,fillPercent:e.adjustPercent(t.fillPercent,a,o),pointerPercent:e.adjustPercent(t.pointerPercent,a,o)}}let y=null;return e.onResize&&(y=wt(e.getElement(),()=>e.onResize())),{input:t,rootProps:ee,rootStyle:{touchAction:`none`,userSelect:`none`},thumbProps:te,adjustForAlignment:ne,destroy(){n.signal.aborted||(n.abort(),y?.(),h(),_())}}}var ni={fill:`--media-slider-fill`,pointer:`--media-slider-pointer`,buffer:`--media-slider-buffer`};function ri(e){return{[ni.fill]:`${e.fillPercent.toFixed(3)}%`,[ni.pointer]:`${e.pointerPercent.toFixed(3)}%`}}function ii(e){return{...ri(e),[ni.buffer]:`${e.bufferPercent.toFixed(3)}%`}}function ai(e,t){let n=e/2;return{position:`absolute`,left:t===`visible`?`calc(var(${ni.pointer}) - ${n}px)`:`min(max(0px, calc(var(${ni.pointer}) - ${n}px)), calc(100% - ${e}px))`,width:`max-content`,pointerEvents:`none`}}function oi(e=document){let t=We(ze(e)?e:e.ownerDocument);return t?.getAttribute(`role`)===`slider`?ze(e)||Wt(e,t):!1}function si(e,t){let n=!0,r=!1,i=e.target,a=0,o=()=>{i=e.target,r=!0;let o=++a;t.resetSnapshot(),queueMicrotask(()=>{n&&o===a&&(r=!1,i=e.target,i&&t.processSnapshot(mr(e)))})},s=e.subscribe(()=>{let n=e.target;if(n!==i){o();return}n&&!r&&t.processSnapshot(mr(e))});return o(),()=>{n=!1,s()}}function ci(e){return!e||!oi(e)}function li(e,t,n){let r=0,i=e.length-1,a=-1;for(;r<=i;){let o=r+i>>>1;n(e[o])<=t?(a=o,r=o+1):i=o-1}return a}function ui(e,t,n){let r=li(e,t,n);return r<0?void 0:e[r]}function di(e,t,n,r){let i=li(e,t,n);if(i<0)return;let a=e[i],o=r(a),s=i===e.length-1;return t<o||s&&t===o?a:void 0}var fi=class{findActiveThumbnail(e,t){return ui(e,t,e=>e.startTime)}parseConstraints(e){let t=parseFloat(e.minWidth),n=parseFloat(e.maxWidth),r=parseFloat(e.minHeight),i=parseFloat(e.maxHeight);return{minWidth:Number.isFinite(t)?t:0,maxWidth:Number.isFinite(n)?n:1/0,minHeight:Number.isFinite(r)?r:0,maxHeight:Number.isFinite(i)?i:1/0}}calculateScale(e,t,n){let{minWidth:r,maxWidth:i,minHeight:a,maxHeight:o}=n,s=Math.min(i/e,o/t),c=Math.max(r/e,a/t);return Number.isFinite(s)&&s<1?s:Number.isFinite(c)&&c>1?c:1}resize(e,t,n,r){let i=e.width??t,a=e.height??n;if(!i||!a)return;let o=this.calculateScale(i,a,r),s=e.coords?.x??0,c=e.coords?.y??0,l=o===1?0:1;return{scale:o,containerWidth:Math.max(0,Math.floor(i*o)-l*2),containerHeight:Math.max(0,Math.floor(a*o)-l*2),imageWidth:Math.ceil(t*o),imageHeight:Math.ceil(n*o),offsetX:Math.ceil(s*o)+l,offsetY:Math.ceil(c*o)+l}}getState(e,t,n){return{loading:e,error:t,hidden:!e&&!n}}getAttrs(e){return{dir:`ltr`,role:`img`,"aria-hidden":`true`}}};function pi(e){let{getContainer:t,getImg:n,onStateChange:r}=e,i=new fi,a=new AbortController,o=a.signal,s=!1,c=!1,l=0,u=0,d=``,f=!1,p=null;function m(){let e=n();e&&(l=e.naturalWidth,u=e.naturalHeight),s=!1,c=!1,r()}function h(){s=!1,c=!0,r()}function g(e){E(e,`load`,m,{signal:o}),E(e,`error`,h,{signal:o})}function _(){if(!f){let e=n();e&&(g(e),f=!0)}if(!p){let e=t();e&&(p=wt(e,r))}}function ee(e){_();let t=e??``;t!==d&&(d=t,t?(s=!0,c=!1):(s=!1,c=!1,l=0,u=0))}function te(){_();let e=n();e?.complete&&d&&(e.naturalWidth>0?(l=e.naturalWidth,u=e.naturalHeight,s=!1,c=!1):(s=!1,c=!0),r())}function v(){a.abort(),p?.(),p=null}return{get loading(){return s},get error(){return c},get naturalWidth(){return l},get naturalHeight(){return u},readConstraints(){let e=t();return e?i.parseConstraints(getComputedStyle(e)):{minWidth:0,maxWidth:1/0,minHeight:0,maxHeight:1/0}},updateSrc:ee,connect:te,destroy:v}}var mi={hover:`hover`,focus:`focus`,escape:`escape`,blur:`blur`,"imperative-action":`imperative-action`};function hi(e){let t={transition:e.transition,onOpenChange(t,n){let r=mi[n.reason];if(!r)return;let i=e.group?.();t?i?.notifyOpen():i?.notifyClose();let a=n.event?{reason:r,event:n.event}:{reason:r};e.onOpenChange(t,a)},closeOnEscape:()=>!0,closeOnOutsideClick:()=>!1,openOnHover:()=>!0,delay:()=>{let t=e.group?.();return t?.shouldSkipDelay()?0:e.delay?.()??t?.delay??600},closeDelay:()=>{let t=e.group?.();return e.closeDelay?.()??t?.closeDelay??0}};e.onOpenChangeComplete&&(t.onOpenChangeComplete=e.onOpenChangeComplete);let n=Cr(t),r=!1,i,a;function o(){return i?.isOpenFor(n.triggerElement)??!1}function s(){return e.sticky?.()??!1}function c(){let t=e.popupGroup?.();t!==i&&(a?.(),i=t,a=i?.subscribe(()=>{o()&&!s()&&n.close(`imperative-action`)}))}function l(e){n.setTriggerElement(e),c(),o()&&!s()&&n.close(`imperative-action`)}let{onClick:u,...d}=n.triggerProps,f={...d,onPointerDown(){c(),r=!0,s()||n.close(`imperative-action`)},onPointerEnter(t){c(),!e.disabled?.()&&(!o()||s())&&t.pointerType!==`touch`&&d.onPointerEnter(t)},onFocusIn(t){if(c(),!e.disabled?.()&&(!o()||s())){if(r){r=!1;return}d.onFocusIn(t)}}},p={...n.popupProps,onPointerEnter(t){e.disableHoverablePopup?.()||n.popupProps.onPointerEnter(t)}};return{...n,triggerProps:f,popupProps:p,get triggerElement(){return n.triggerElement},setTriggerElement:l,open:()=>{c(),(!o()||s())&&n.open(`hover`)},close:(e=`hover`)=>n.close(e),destroy(){a?.(),n.destroy()}}}function I(){let e=v({active:!1,status:`idle`}),t=!1,n=0,r=0,i=0,a=null;function o(){cancelAnimationFrame(n),cancelAnimationFrame(r),n=0,r=0}function s(){return i++,o(),a?.(),a=null,i}function c(e){if(e!==i)return;let t=a;a=null,t?.()}function l(o=null){if(t)return Promise.resolve();let l=s(),u=e.current.active;return u&&e.patch({status:`idle`}),e.patch({active:!0,status:`starting`}),new Promise(s=>{a=s,n=requestAnimationFrame(()=>{if(n=0,u){let e=gi(o);vi(e),_i(e)}r=requestAnimationFrame(()=>{if(r=0,t||l!==i||!e.current.active)return c(l);e.patch({status:`idle`}),n=requestAnimationFrame(()=>{if(n=0,t||l!==i||!e.current.active)return c(l);yi(gi(o)).finally(()=>c(l))})})})})}function u(o){if(t)return Promise.resolve();let l=s();return e.patch({status:`ending`}),new Promise(s=>{a=s,n=requestAnimationFrame(()=>{n=0,r=requestAnimationFrame(()=>{if(r=0,t||l!==i)return c(l);yi(o).finally(()=>{if(t||l!==i||e.current.status!==`ending`)return c(l);e.patch({active:!1,status:`idle`}),c(l)})})})})}function d(){i++,o(),a?.(),a=null,e.current.status!==`idle`&&e.patch({status:`idle`})}return{state:e,open:l,close:u,cancel:d,destroy(){t||(t=!0,d())}}}function gi(e){return typeof e==`function`?e():e}function _i(e){e&&e.offsetHeight}function vi(e){let t=e?.getAnimations?.({subtree:!0})??[];for(let e of t)e.cancel()}function yi(e){if(!e)return Promise.resolve();let t=e.getAnimations?.()??[];return t.length===0?Promise.resolve():Promise.all(t.map(e=>e.finished)).then(Pe,Pe)}function bi(e){return{onWheel(t){if(e.isDisabled())return;let n=Math.sign(t.deltaY);if(n===0)return;t.preventDefault();let r=e.getStepPercent(),i=F(e.getPercent()-n*r,0,100);e.onValueChange?.(i)}}}function L(e,t,n){let r=n?.signal;for(let[n,i]of Object.entries(t))if(u(i)&&n.startsWith(`on`)){let t=n.slice(2).toLowerCase();E(e,t,i,r?{signal:r}:void 0)}else c(i)||i===!1?e.removeAttribute(n):i===!0?e.setAttribute(n,``):e.setAttribute(n,String(i))}function R(e,t,n){for(let r in t){if(n&&!(r in n))continue;let i=n?.[r]??xi(r),a=t[r];a===!0?e.setAttribute(i,``):a?e.setAttribute(i,String(a)):e.removeAttribute(i)}}function xi(e){return`data-${e.toLowerCase()}`}var z=i(Symbol.for(`@videojs/i18n`)),Si;function Ci(){return Si??=fn(ve(`en`),`en`),Si}var B=class{#e;#t;#n;constructor(e,t){this.#e=e,this.#t=new C(e,{context:t,callback:()=>this.#e.requestUpdate(),subscribe:!0}),e.addController(this)}get value(){return this.#t.value?.translator??Ci()}get locale(){return this.#t.value?.locale??`en`}hostConnected(){Si=void 0,this.#n=le(()=>{Si=void 0,this.#t.value||this.#e.requestUpdate()})}hostDisconnected(){this.#n?.(),this.#n=void 0}};function wi(e,t){return dt(e,t)}function Ti(e){return wi(ht(e.lang),ht(pt(e.parentElement??(typeof document<`u`?document.documentElement:null))))}function Ei({context:e,loader:t=cn}){return n=>{class r extends n{constructor(...t){super(...t),this.lang=``,this.dir=``,this.#e=new S(this,{context:e,initialValue:{translator:Ci(),locale:`en`}}),this.#r=0,this.#i={},this.#a=0,this.#c={translator:Ci(),locale:`en`},this.#u=-1}static{this.properties={...n.properties,lang:{type:String,reflect:!0},dir:{type:String,reflect:!0}}}#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;#d;#f;get i18nValue(){return this.#c}connectedCallback(){super.connectedCallback(),this.#t=le(()=>{this.#r+=1,this.requestUpdate()}),this.#n=Ct(()=>this.requestUpdate()),this.#p(),this.#g(),this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this.#t?.(),this.#t=void 0,this.#n?.(),this.#n=void 0,this.#a+=1,this.#i={},this.#o=void 0,this.#s=void 0}willUpdate(e){super.willUpdate(e);let t=Ti(this);if(this.#o!==t){let e=this.#o!==void 0;this.#o=t;let n=!e&&this.#s!==void 0&&t!==this.#s;(e||n)&&this.#p()}this.#h(t),this.#g()}#p(){let e=Ti(this);this.#s=e,this.#a+=1;let n=this.#a;this.#i={},(async()=>{let{merged:r,loadedTags:i}=await mt(e,t,me);if(n===this.#a){if(rn(e,i,r)){let t=await on(e);if(n!==this.#a)return;Object.keys(t).length&&he(e,t)}n===this.#a&&(this.#i=r,this.requestUpdate())}})()}#m(){return Ti(this)}#h(e){let t=this.dir.trim().toLowerCase(),n=this.#f!==void 0&&t===this.#f;if(!this.lang.trim()){n&&(this.dir=``),this.#f=void 0;return}if(t&&!n){this.#f=void 0;return}let r=ut(e);this.#f=r,this.dir!==r&&(this.dir=r)}#g(){let e=this.#m();if(this.#l===e&&this.#u===this.#r&&this.#d===this.#i)return;let t=ve(e),n=fn({...this.#i,...t},e);this.#c={translator:n,locale:e},this.#l=e,this.#u=this.#r,this.#d=this.#i,this.#e.setValue(this.#c)}}return r}}var Di=Ei({context:z}),Oi=class extends Di(y){static{this.tagName=`media-i18n`}};function ki({context:e}){return t=>{class n extends t{constructor(...t){super(...t),this.#e=new B(this,e),this.token=``}static{this.properties={token:{type:String}}}#e;#t;connectedCallback(){this.#t??=this.textContent?.trim()??``,super.connectedCallback()}updated(e){if(super.updated(e),!this.#t){this.textContent=``;return}let t=this.token?{key:this.token,text:this.#t}:this.#t;this.textContent=typeof t==`string`?t:A(t,this.#e.value)}}return n}}var Ai=ki({context:z}),ji=class extends Ai(y){static{this.tagName=`media-text`}},Mi=class{#e;#t;#n;#r;#i=null;constructor(e,t,r={}){this.#e=e,this.#t=t,this.#n=r.value,this.#r=new C(e,{context:n,callback:e=>this.#a(e?.container),subscribe:!0}),e.addController(this)}get value(){return this.aria}get aria(){return this.details.aria}get shortcut(){return this.details.shortcut}get details(){let e=this.#r.value?.container;return e?Zn(e).getShortcut(this.#t,this.#n?.()):{}}hostConnected(){this.#a(this.#r.value?.container)}hostDisconnected(){this.#o()}#a(e){if(this.#o(),!e)return;let t=Zn(e),n=()=>{this.#e.requestUpdate()};this.#i=t.subscribeShortcutChanges(n),n()}#o(){this.#i?.(),this.#i=null}};function Ni(e,t){return e.getLabelParams?.(t)}var V=class extends h{constructor(...e){super(...e),this.disabled=!1,this.label=``,this.hotkeyAction=void 0,this.#e=null,this.#t=null,this.#r=new B(this,z)}static{this.properties={label:{type:String},disabled:{type:Boolean}}}getIsButtonDisabled(){return this.disabled||!this.mediaState.value}handleActivate(e){Promise.resolve(this.activate(this.mediaState.value,e)).catch(e=>{})}get hotkeyValue(){}get $state(){return this.core.state}#e;#t;#n;#r;connectedCallback(){if(super.connectedCallback(),this.destroyed)return;this.hotkeyAction&&!this.#t&&(this.#t=new Mi(this,this.hotkeyAction,{value:()=>this.hotkeyValue})),this.#e=new AbortController;let e=er({onActivate:e=>this.handleActivate(e),isDisabled:()=>this.getIsButtonDisabled()});L(this,e,{signal:this.#e.signal})}disconnectedCallback(){super.disconnectedCallback(),this.#e?.abort(),this.#e=null}getLabel(){return this.core.state.current.label?k(this.core.state.current.label):void 0}getShortcut(){return this.#t?.shortcut}getResolvedLabel(){let e=this.mediaState.value;if(!e)return;this.core.setMedia(e);let t=this.core.getState();return A(this.core.getLabel(t),this.#r.value,Ni(this.core,t))}willUpdate(e){super.willUpdate(e),this.core.setProps?.(this)}update(e){super.update(e);let t=this.mediaState.value;if(this.#i(),!t)return;this.core.setMedia(t);let n=this.core.getState(),r=this.core.getAttrs?.(n)??{};ln(r[`aria-label`])&&(r[`aria-label`]=A(r[`aria-label`],this.#r.value,Ni(this.core,n))),L(this,{...r,"aria-keyshortcuts":this.#t?.aria,...Pi(n)&&{hidden:n.hidden?``:void 0}}),R(this,n,this.stateAttrMap)}#i(){let e=this.getShortcut();e!==this.#n&&(this.#n=e,this.dispatchEvent(new CustomEvent($n)))}};function Pi(e){return d(e)&&a(e.hidden)}var Fi=`airplay.`,Ii={key:`${Fi}start`,text:`Start AirPlay`},Li={key:`${Fi}stop`,text:`Stop AirPlay`},Ri=`cast.`,zi={key:`${Ri}start`,text:`Start casting`},Bi={key:`${Ri}stop`,text:`Stop casting`},Vi={key:`${Ri}connecting`,text:`Connecting`};function H(e,t){return u(e)?e(t)||void 0:e||void 0}var Hi=class e{static defaultProps={label:``,disabled:!1};state=v({state:`disconnected`,availability:`unsupported`,disabled:!0,hidden:!0,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.state===`connected`?Li:e.state===`connecting`?Vi:Ii)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=Ne()?e.remotePlaybackAvailability:`unsupported`;return this.state.patch({state:e.remotePlaybackState,availability:t,disabled:this.#e.disabled||t!==`available`,hidden:t!==`available`}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async toggle(e){if(this.setMedia(e),!this.getState().disabled)try{await e.toggleRemotePlayback()}catch{}}},Ui={state:`data-airplay-state`,availability:`data-availability`,disabled:`data-disabled`,hidden:`data-hidden`},Wi=class{static defaultProps={open:!1,defaultOpen:!1,closeOnEscape:!0};#e;#t=null;#n=void 0;#r=void 0;constructor(e=`dialog`){this.#e=e}setProps(e){}setInput(e){this.#t=e}setTitleId(e){this.#n=e}setDescriptionId(e){this.#r=e}getState(){let e=this.#t;return{open:e.active,status:e.status,titleId:this.#n,descriptionId:this.#r,...sr(e.status)}}getTriggerAttrs(e,t){return{"aria-expanded":e.open&&e.status!==`ending`?`true`:`false`,"aria-haspopup":`dialog`,"aria-controls":t}}getPopupAttrs(e){return{role:this.#e,"aria-modal":`true`,"aria-labelledby":e.titleId,"aria-describedby":e.descriptionId}}},Gi=class extends Wi{constructor(){super(`alertdialog`)}},Ki={open:`data-open`,transitionStarting:`data-starting-style`,transitionEnding:`data-ending-style`},U=`menu.`,qi={key:`${U}settings`,text:`Settings`},Ji={key:`${U}quality`,text:`Quality`},Yi={key:`${U}audio`,text:`Audio`};`${U}`;var Xi={key:`${U}speed`,text:`Speed`},Zi={key:`${U}captions`,text:`Captions`},Qi={key:`${U}playbackRate`,text:`Playback rate`};`${U}`;var $i={key:`${U}off`,text:`Off`},ea={key:`${U}auto`,text:`Auto`},ta={key:`${U}autoWithLabel`,text:`Auto ({label})`},na={key:`${U}subtitles`,text:`Subtitles`};function ra(e){return e.label?e.label:e.language?e.language:e.kind?e.kind:Yi}function ia(e,t){return e.id||String(t)}var aa=class e{static defaultProps={label:``,formatTrack:ra,disabled:!1};state=v({options:[],value:``,disabled:!0,hidden:!0,availability:`unavailable`,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||Yi}getTrackLabel(e){return this.#e.formatTrack(e)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.audioTrackList.findIndex(e=>e.enabled),n=e.audioTrackList.map((e,t)=>({value:ia(e,t),label:this.getTrackLabel(e),disabled:!1})),r=n.length>1?`available`:`unavailable`;return this.state.patch({options:n,value:t===-1?``:ia(e.audioTrackList[t],t),disabled:this.#e.disabled||r===`unavailable`,hidden:r===`unavailable`,availability:r}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}select(e,t){this.#e.disabled||e.audioTrackList.some((e,n)=>ia(e,n)===t)&&e.selectAudioTrack(t)}selectValue(e,t){this.select(e,t)}},oa={value:`data-audio-track`,disabled:`data-disabled`,hidden:`data-hidden`,availability:`data-availability`},sa=class e{static defaultProps={delay:500};state=v({visible:!1});#e={...e.defaultProps};#t=null;setProps(t){this.#e=O(t,e.defaultProps)}destroy(){this.#n()}update(e){let t=e.waiting&&!e.paused;t&&!this.state.current.visible&&!this.#t?this.#t=setTimeout(()=>{this.#t=null,this.state.patch({visible:!0})},this.#e.delay):t||(this.#n(),this.state.patch({visible:!1}))}#n(){this.#t!==null&&(clearTimeout(this.#t),this.#t=null)}},ca={visible:`data-visible`},la=`captions.`,ua={key:`${la}enable`,text:`Enable captions`},da={key:`${la}disable`,text:`Disable captions`},fa=class e{static defaultProps={label:``,disabled:!1,menuTrigger:!1};state=v({subtitlesShowing:!1,availability:`unavailable`,disabled:!0,hidden:!0,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.subtitlesShowing?da:ua)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.textTrackList.some(Me)?`available`:`unavailable`;return this.state.patch({subtitlesShowing:e.subtitlesShowing,availability:t,disabled:this.#e.disabled||t!==`available`,hidden:t===`unavailable`}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}toggle(e){this.setMedia(e),!this.getState().disabled&&(this.#e.menuTrigger&&pa(e)>1||e.toggleSubtitles())}};function pa(e){return e.textTrackList.filter(Me).length}var ma={subtitlesShowing:`data-active`,availability:`data-availability`,disabled:`data-disabled`,hidden:`data-hidden`};function ha(e){return e.label?e.label:e.language?e.language:e.kind===`captions`?Zi:na}function ga(e,t){return e.kind>t.kind?1:e.kind<t.kind?-1:0}function _a(e){return e.filter(Me).sort(ga)}var va=class e{static defaultProps={label:``,formatTrack:ha,disabled:!1};state=v({options:[{value:`off`,label:$i,disabled:!1}],value:`off`,subtitlesShowing:!1,disabled:!0,hidden:!0,availability:`unavailable`,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||Zi}getTrackLabel(e){return this.#e.formatTrack(e)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=_a(e.textTrackList),n=t.findIndex(e=>e.mode===`showing`),r=[{value:`off`,label:$i,disabled:!1},...t.map((e,t)=>({value:e.id||String(t),label:this.getTrackLabel(e),disabled:!1}))],i=t.length>0?`available`:`unavailable`;return this.state.patch({options:r,value:n===-1?`off`:t[n].id||String(n),subtitlesShowing:e.subtitlesShowing,disabled:this.#e.disabled||t.length===0,hidden:i===`unavailable`,availability:i}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}select(e,t){if(this.#e.disabled)return;let n=_a(e.textTrackList);if(n.length){if(t===`off`){e.selectSubtitlesTrack(`off`);return}n.some((e,n)=>(e.id||String(n))===t)&&e.selectSubtitlesTrack(t)}}selectValue(e,t){this.select(e,t)}},ya={subtitlesShowing:`data-active`,disabled:`data-disabled`,hidden:`data-hidden`,availability:`data-availability`},ba=class e{static defaultProps={label:``,disabled:!1};state=v({connection:`disconnected`,availability:`unsupported`,disabled:!0,hidden:!0,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.connection===`connected`?Bi:e.connection===`connecting`?Vi:zi)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=globalThis.chrome?e.remotePlaybackAvailability:`unsupported`;return this.state.patch({connection:e.remotePlaybackState,availability:t,disabled:this.#e.disabled||t!==`available`,hidden:t===`unsupported`}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async toggle(e){if(this.setMedia(e),!this.getState().disabled)return e.toggleRemotePlayback()}},xa={connection:`data-cast-state`,availability:`data-availability`,disabled:`data-disabled`,hidden:`data-hidden`},Sa=class{#e=null;setMedia(e){this.#e=e}getState(){return{controlsVisible:this.#e.controlsVisible}}},Ca={controlsVisible:`data-controls-visible`},wa=class{#e=null;setMedia(e){this.#e=e}getState(){let e=this.#e;return{visible:e.controlsVisible,userActive:e.userActive}}},Ta={visible:`data-visible`,userActive:`data-user-active`},Ea=class extends Gi{setProps(){}},Da={...Ki},Oa=`common.`,ka={key:`${Oa}empty`,text:``},Aa={key:`${Oa}ok`,text:`OK`},W=`errors.`,ja={key:`${W}aborted`,text:`You stopped media playback before it finished.`},Ma={key:`${W}network`,text:`This media could not be loaded due to a network or server issue.`},Na={key:`${W}decode`,text:`This media could not be played. It may be corrupted, or your browser may not support its format.`},Pa={key:`${W}source`,text:`This media could not be loaded. It may be unavailable, or your browser may not support its format.`},Fa={key:`${W}encrypted`,text:`This media could not be played because it could not be decrypted.`},Ia={key:`${W}unplayable`,text:`This media is unsupported by the player.`},La={key:`${W}title`,text:`Something went wrong.`},Ra={key:`${W}unexpected`,text:`An unexpected error occurred.`},za=99001,Ba={[T.MEDIA_ERR_ABORTED]:ja,[T.MEDIA_ERR_NETWORK]:Ma,[T.MEDIA_ERR_DECODE]:Na,[T.MEDIA_ERR_SRC_NOT_SUPPORTED]:Pa,[T.MEDIA_ERR_ENCRYPTED]:Fa,[T.MEDIA_ERR_CUSTOM]:ka,[za]:Ia},Va={[T.MEDIA_ERR_SRC_NOT_SUPPORTED]:[`Failed to open media`]};function Ha(e){return e>=T.MEDIA_ERR_ABORTED&&e<=T.MEDIA_ERR_ENCRYPTED}function Ua(){return La}function Wa(){return Aa}function Ga(){return Ra}function Ka(e,t){if(e){let t=Ba[e.code],n=e.message?.trim();if(n){let r=T.defaultMessages[e.code];if(t&&r&&n===r)return t;let i=Va[e.code];return t&&Ha(e.code)&&!e.context&&i?.includes(n)?t:n}if(t)return t}return t?.trim()||Ra}var qa=`fullscreen.`,Ja={key:`${qa}enter`,text:`Enter fullscreen`},Ya={key:`${qa}exit`,text:`Exit fullscreen`},Xa=class e{static defaultProps={label:``,disabled:!1};state=v({fullscreen:!1,availability:`unavailable`,disabled:!0,hidden:!0,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.fullscreen?Ya:Ja)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.fullscreenAvailability;return this.state.patch({fullscreen:e.fullscreen,availability:t,disabled:this.#e.disabled||t!==`available`,hidden:t!==`available`}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async toggle(e){if(this.setMedia(e),!this.getState().disabled)return e.fullscreen?e.exitFullscreen():e.requestFullscreen()}},Za={fullscreen:`data-fullscreen`,availability:`data-availability`,disabled:`data-disabled`,hidden:`data-hidden`},G=`status.`,Qa={key:`${G}captionsOn`,text:`Captions on`},$a={key:`${G}captionsOff`,text:`Captions off`},eo={key:`${G}paused`,text:`Paused`},to={key:`${G}playing`,text:`Playing`},no={key:`${G}fullscreen`,text:`Fullscreen`},ro={key:`${G}pip`,text:`Picture in picture`},io={key:`${G}exitPip`,text:`Exit picture in picture`},ao={key:`${G}seekedTo`,text:`Seeked to {time}`},oo=`volume.`,so={key:`${oo}mutedValue`,text:`{percent}, muted`},co={key:`${oo}muted`,text:`Muted`},lo={key:`${oo}label`,text:`Volume`},uo={key:`${oo}value`,text:`Volume {value}`},fo={muted:A(co),volume:A(lo),captionsOn:A(Qa),captionsOff:A($a),paused:A(eo),playing:A(to),fullscreen:A(no),exitFullscreen:A(Ya),pictureInPicture:A(ro),exitPictureInPicture:A(io)};function po(e){return{muted:e(co),volume:e(lo),captionsOn:e(Qa),captionsOff:e($a),paused:e(eo),playing:e(to),fullscreen:e(no),exitFullscreen:e(Ya),pictureInPicture:e(ro),exitPictureInPicture:e(io)}}function mo(e,t){return e?!t||t.includes(e):!1}var ho=`live.`,go={key:`${ho}playing`,text:`Playing live`},_o={key:`${ho}seekToEdge`,text:`Seek to live edge`},vo={key:`${ho}badge`,text:`Live`},yo=10,bo=5,xo=class e{static defaultText=vo;static defaultProps={label:``,disabled:!1};state=v({live:!1,liveEdge:!1,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.liveEdge?go:_o)}getAttrs(e){let t=this.#e.disabled||e.liveEdge;return{"aria-label":this.getLabel(e),"aria-disabled":t?`true`:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=So(e),n=t&&this.#n(e);return this.state.patch({live:t,liveEdge:n}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async seekToLive(e){if(this.#e.disabled||!So(e)||this.#n(e))return;let t=Co(e);t!=null&&await e.seek(t)}#n(e){let{currentTime:t,liveEdgeStart:n}=e;if(Number.isFinite(n))return t>=n-bo;let r=Co(e);return r!=null&&t>=r-yo}};function So(e){return!Number.isNaN(e.targetLiveWindow)}function Co(e){let{seekable:t}=e;if(t.length===0)return null;let n=t[t.length-1][1];return Number.isFinite(n)?n:null}var wo={live:`data-live`,liveEdge:`data-live-edge`},To=class e{static defaultProps={side:`bottom`,align:`start`,open:!1,defaultOpen:!1,closeOnEscape:!0,closeOnOutsideClick:!0};#e={...e.defaultProps};#t=null;get props(){return this.#e}constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}setInput(e){this.#t=e}getState(){let e=this.#t,t=e.isSubmenu;return{open:e.active,status:e.status,side:t?void 0:this.#e.side,align:t?void 0:this.#e.align,isSubmenu:t,...sr(e.status)}}getTriggerAttrs(e,t){return{...!e.isSubmenu&&{tabIndex:0},"aria-haspopup":`menu`,"aria-expanded":e.open&&e.status!==`ending`?`true`:`false`,"aria-controls":t}}getContentAttrs(){return{role:`menu`,tabIndex:-1}}getPopupAttrs(){return{popover:`manual`}}},Eo=`buttons.`,Do={key:`${Eo}play`,text:`Play`},Oo={key:`${Eo}pause`,text:`Pause`},ko={key:`${Eo}replay`,text:`Replay`},Ao={key:`${Eo}mute`,text:`Mute`},jo={key:`${Eo}unmute`,text:`Unmute`},Mo=class e{static defaultProps={label:``,disabled:!1};state=v({muted:!1,volumeLevel:`off`,availability:`unavailable`,hidden:!0,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.muted?jo:Ao)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":this.#e.disabled?`true`:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.mutedAvailability;return this.state.patch({muted:e.muted||e.volume===0,volumeLevel:No(e),availability:t,hidden:t!==`available`}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}toggle(e){this.#e.disabled||e.mutedAvailability!==`available`||e.toggleMuted()}};function No(e){return e.muted||e.volume===0?`off`:e.volume<.5?`low`:e.volume<.75?`medium`:`high`}var Po={muted:`data-muted`,volumeLevel:`data-volume-level`,availability:`data-availability`,hidden:`data-hidden`},Fo=`pip.`,Io={key:`${Fo}enter`,text:`Enter picture-in-picture`},Lo={key:`${Fo}exit`,text:`Exit picture-in-picture`},Ro=class e{static defaultProps={label:``,disabled:!1};state=v({pip:!1,availability:`unavailable`,disabled:!0,hidden:!0,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.pip?Lo:Io)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.pipAvailability;return this.state.patch({pip:e.pip,availability:t,disabled:this.#e.disabled||t!==`available`,hidden:t!==`available`}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async toggle(e){if(this.setMedia(e),!this.getState().disabled)return e.pip?e.exitPictureInPicture():e.requestPictureInPicture()}},zo={pip:`data-pip`,availability:`data-availability`,disabled:`data-disabled`,hidden:`data-hidden`},Bo=class e{static defaultProps={label:``,disabled:!1};state=v({paused:!0,ended:!1,started:!1,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||(e.ended?ko:e.paused?Do:Oo)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":this.#e.disabled?`true`:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t;return this.state.patch({paused:e.paused,ended:e.ended,started:e.started}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async toggle(e){if(!this.#e.disabled){if(e.paused||e.ended)return e.play();e.pause()}}},Vo={paused:`data-paused`,ended:`data-ended`,started:`data-started`},Ho={key:`playback.rate`,text:`Playback rate {rate}`},Uo=class e{static defaultProps={label:``,disabled:!1,menuTrigger:!1};state=v({rate:1,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){let t=H(this.#e.label,e);return t===void 0?Ho:t}getLabelParams(e){if(H(this.#e.label,e)===void 0)return{rate:e.rate}}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":this.#e.disabled?`true`:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t;return this.state.patch({rate:e.playbackRate}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}cycle(e){if(this.#e.disabled||this.#e.menuTrigger)return;let{playbackRates:t,playbackRate:n}=e;if(t.length===0)return;let r=t.indexOf(n),i=r===-1?t.find(e=>e>n)??t[0]:t[(r+1)%t.length];e.setPlaybackRate(i)}},Wo={rate:`data-rate`};function Go(e){return`${e}×`}var Ko=class e{static defaultProps={label:``,formatRate:Go,disabled:!1};state=v({rate:1,value:`1`,options:[],disabled:!0,hidden:!0,availability:`unavailable`,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){let t=H(this.#e.label,e);return t===void 0?Qi:t}getLabelParams(e){}getRateLabel(e){return this.#e.formatRate(e)}getRateValue(e){return String(e)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.playbackRates.length>0?`available`:`unavailable`;return this.state.patch({rate:e.playbackRate,value:this.getRateValue(e.playbackRate),options:e.playbackRates.map(e=>({rate:e,value:this.getRateValue(e),label:this.getRateLabel(e),disabled:!1})),disabled:this.#e.disabled||e.playbackRates.length===0,hidden:t===`unavailable`,availability:t}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}select(e,t){this.#e.disabled||e.playbackRates.includes(t)&&e.setPlaybackRate(t)}selectValue(e,t){let n=e.playbackRates.find(e=>this.getRateValue(e)===t);c(n)||this.select(e,n)}},qo={rate:`data-rate`,disabled:`data-disabled`,hidden:`data-hidden`,availability:`data-availability`},K=class e{static defaultProps={side:`top`,align:`center`,modal:!1,closeOnEscape:!0,closeOnOutsideClick:!0,open:!1,defaultOpen:!1,openOnHover:!1,delay:300,closeDelay:0};#e={...e.defaultProps};constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}#t=null;setInput(e){this.#t=e}getState(){let e=this.#t;return{open:e.active,status:e.status,side:this.#e.side,align:this.#e.align,modal:this.#e.modal,...sr(e.status)}}getTriggerAttrs(e,t){return{"aria-expanded":e.open&&e.status!==`ending`?`true`:`false`,"aria-haspopup":`dialog`,"aria-controls":t}}getPopupAttrs(e){return{popover:`manual`,role:`dialog`,"aria-modal":e.modal===!0?`true`:void 0}}},Jo={open:`data-open`,side:`data-side`,align:`data-align`,...or},Yo=`data-popup`,Xo=`[${Yo}]`,Zo=class{#e=null;#t=`none`;setMedia(e){this.#e=e}setImageLoadState(e){this.#t=e}getState(){let e=this.#e;return{visible:!e.started,src:e.poster,loading:this.#t===`loading`,loaded:this.#t===`loaded`,error:this.#t===`error`}}},Qo={visible:`data-visible`,loading:`data-loading`,loaded:`data-loaded`,error:`data-error`},$o=`auto`,es=[4320,2160,1440,1080,720,480,360,240];function ts(e){return e>=1e6?`${Math.round(e/1e5)/10} Mbps`:`${Math.round(e/1e3)} kbps`}function ns(e){let t=Math.round(e*9/16);return es.includes(t)?t:void 0}function rs(e){let{width:t,height:n}=e;if(t&&n)return t>n&&t*9>n*16?ns(t)??n:Math.min(t,n);if(n)return n;if(t)return ns(t)??t}function is(e,t){let n=rs(e);return!!(n&&t.some(t=>t!==e&&rs(t)===n))}function as(e){let t=rs(e);return t?`${t}p`:e.bitrate?ts(e.bitrate):Ji}function os(e,t=[]){if(rs(e)&&e.bitrate&&is(e,t))return ts(e.bitrate)}function ss(e){let t=rs(e);if(t){if(t>=4320)return`8K`;if(t>=2160)return`4K`;if(t>=1080)return`HD`}}function cs(e,t){return e.id||String(t)}function ls(e,t){return e.id!==void 0||t.id!==void 0?e.id===t.id:e.width===t.width&&e.height===t.height&&e.bitrate===t.bitrate&&e.frameRate===t.frameRate&&e.codec===t.codec}var us=class e{static defaultProps={label:``,formatRendition:as,disabled:!1};state=v({options:[{value:$o,label:ea,disabled:!1}],value:$o,disabled:!0,hidden:!0,availability:`unavailable`,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){return H(this.#e.label,e)||Ji}getRenditionLabel(t){return this.#e.formatRendition===e.defaultProps.formatRendition?as(t):this.#e.formatRendition(t)}getRenditionBadge(t,n=[]){if(this.#e.formatRendition===e.defaultProps.formatRendition)return os(t,n)}getRenditionTier(t){if(this.#e.formatRendition===e.defaultProps.formatRendition)return ss(t)}getRenditionValue(e,t){return cs(e,t)}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=e.videoRenditionList.findIndex(e=>e.selected),n=e.videoRenditionList.length>1?`available`:`unavailable`,r=(t,n)=>{let r=this.getRenditionTier(t),i=this.getRenditionBadge(t,e.videoRenditionList);return{value:this.getRenditionValue(t,n),label:this.getRenditionLabel(t),disabled:!1,...r&&{tier:r},...i&&{badge:i}}},i=e.activeVideoRendition===null?-1:e.videoRenditionList.findIndex(t=>ls(t,e.activeVideoRendition)),a=e.activeVideoRendition&&i!==-1?r(e.activeVideoRendition,i):void 0,o={value:$o,label:t===-1&&a?ta:ea,disabled:!1,...t===-1&&a&&{labelParams:{label:k(a.label)}}};return this.state.patch({options:[o,...e.videoRenditionList.map(r)],value:t===-1?$o:this.getRenditionValue(e.videoRenditionList[t],t),disabled:this.#e.disabled||n===`unavailable`,hidden:n===`unavailable`,availability:n}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}select(e,t){if(!this.#e.disabled){if(t===`auto`){e.selectVideoRendition(t);return}e.videoRenditionList.some((e,n)=>this.getRenditionValue(e,n)===t)&&e.selectVideoRendition(t)}}selectValue(e,t){this.select(e,t)}},ds={value:`data-quality`,disabled:`data-disabled`,hidden:`data-hidden`,availability:`data-availability`},fs=`seek.`,ps={key:`${fs}forward`,text:`Seek forward {seconds} seconds`},ms={key:`${fs}backward`,text:`Seek backward {seconds} seconds`},hs=class e{static defaultProps={seconds:30,label:``,disabled:!1};state=v({seeking:!1,direction:`forward`,label:``});#e={...e.defaultProps};#t=null;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}getLabel(e){let t=H(this.#e.label,e);return t===void 0?e.direction===`backward`?ms:ps:t}getLabelParams(e){if(H(this.#e.label,e)===void 0)return{seconds:Math.abs(this.#e.seconds)}}getAttrs(e){return{"aria-label":this.getLabel(e),"aria-disabled":this.#e.disabled?`true`:void 0}}setMedia(e){this.#t=e}getState(){let e=this.#t,t=this.#e.seconds<0?`backward`:`forward`;return this.state.patch({seeking:e.seeking,direction:t}),this.state.patch({label:k(this.getLabel(this.state.current))}),this.state.current}async seek(e){this.#e.disabled||await e.seek(e.currentTime+this.#e.seconds)}},gs={seeking:`data-seeking`,direction:`data-direction`},_s=new Map;function vs(e,t,n){if(e===`digital`){let e=new Intl.NumberFormat(n,{useGrouping:!1}),r=new Intl.NumberFormat(n,{minimumIntegerDigits:2,useGrouping:!1});return{format:n=>{let i=`${r.format(n.minutes??0)}:${r.format(n.seconds??0)}`;return t===`always`||n.hours!==void 0?`${e.format(n.hours??0)}:${i}`:i}}}let r=[[`hours`,new Intl.NumberFormat(n,{style:`unit`,unit:`hour`,unitDisplay:e})],[`minutes`,new Intl.NumberFormat(n,{style:`unit`,unit:`minute`,unitDisplay:e})],[`seconds`,new Intl.NumberFormat(n,{style:`unit`,unit:`second`,unitDisplay:e})]],i=new Intl.ListFormat(n,{type:`unit`,style:e});return{format:e=>i.format(r.filter(([t])=>e[t]!==void 0).map(([t,n])=>n.format(e[t]??0)))}}function ys(e){return e===void 0?``:Array.isArray(e)?e.join(`:`):e}function bs(e,t=`long`,n){let r=`${ys(e)}:${t}:${n??``}`,i=_s.get(r);return i||(i=vs(t,n,e),_s.set(r,i)),i}function xs(e){return s(e)&&Number.isFinite(e)}function Ss(e,t,n){if(!xs(e))return`0:00`;let r=e<0,i=Math.floor(Math.abs(e)),a=Math.floor(i/3600),o=Math.floor(i%3600/60),s=i%60,c=xs(t??0)?Math.abs(t??0):0,l=Math.floor(c/3600),u=Math.floor(c/60%60),d=a>0||l>0,f=d||u>=10,p=d?{hours:a,minutes:o,seconds:s}:{minutes:o,seconds:s},{locale:m=`en`}=n??{},h=bs(m,`digital`,d?`always`:`auto`).format(p);if(!f){let e=new Intl.NumberFormat(m,{useGrouping:!1}).format(0);h=h.replace(RegExp(`^${e}(?=\\p{Nd}\\D)`,`u`),``)}return`${r?`-`:``}${h}`}function Cs(e){if(!xs(e))return`PT0S`;let t=Math.abs(e),n=Math.floor(t/3600),r=Math.floor(t/60%60),i=Math.floor(t%60),a=`PT`;return n>0&&(a+=`${n}H`),r>0&&(a+=`${r}M`),(i>0||a===`PT`)&&(a+=`${i}S`),a}function ws(e,t){if(!xs(e))return``;let{locale:n=`en`,style:r=`long`,formatRemaining:i}=t??{},a=e<0,o=Math.floor(Math.abs(e)),s=Math.floor(o/3600),c=Math.floor(o%3600/60),l=o%60,u={};s>0&&(u.hours=s),c>0&&(u.minutes=c),(l>0||s===0&&c===0)&&(u.seconds=l);let d=bs(n,r).format(u);return a?i?i(d):p(n)?`${d} remaining`:d:d}function Ts(e){return e===`seekStep`||e===`seekToPercent`}function Es(e){return Ss(e.currentTime??0,e.duration)}function Ds(e){return e.value??e.currentTime}function Os(e){return e.value===void 0?!e.key||e.key<`0`||e.key>`9`?null:Number(e.key)*10:F(e.value,0,100)}function ks(e,t){if(e.action===`seekStep`&&e.value!==void 0){if(e.value>0)return`forward`;if(e.value<0)return`backward`}if(e.action===`seekToPercent`){let n=Os(e);if(n===null||t.duration===void 0||t.duration<=0)return null;let r=n/100*t.duration,i=t.currentTime??0;if(r>i)return`forward`;if(r<i)return`backward`}return null}var As={open:!1,generation:0,direction:null,count:0,seekTotal:0,value:null,currentTime:`0:00`,transitionStarting:!1,transitionEnding:!1},js=class{state=v({...As});#e={};#t=null;#n=new cr(()=>{this.#t=null,this.state.patch({open:!1,direction:null,count:0,seekTotal:0,value:null})},()=>ur(this.#e));setProps(e){this.#e=e}destroy(){this.#n.destroy()}close(){this.#n.close()}processEvent(e,t){if(!Ts(e.action))return!1;let n=this.state.current,r=ks(e,t),i=n.open&&e.action===`seekStep`&&n.direction===r;i||(this.#t=t.currentTime??null);let a=this.#r(e,t,i),o=i?n.seekTotal+Math.abs(a):Math.abs(a);return this.state.patch({open:!0,generation:n.generation+1,direction:r,count:i?n.count+1:1,seekTotal:o,value:e.action===`seekStep`&&o>0?`${o}s`:null,currentTime:Es(t)}),this.#n.arm(),!0}#r(e,t,n){if(e.action!==`seekStep`||e.value===void 0)return 0;if(!n||this.#t===null)return e.value;let r=this.#t,i=t.duration??1/0,a=this.state.current.seekTotal,o=Math.abs(e.value);return(e.value<0?Math.max(0,r-a):Math.max(0,i-r-a))>=o?e.value:0}},Ms={open:`data-open`,direction:`data-direction`,transitionStarting:`data-starting-style`,transitionEnding:`data-ending-style`},Ns=class e{static defaultProps={label:``,step:1,largeStep:10,orientation:`horizontal`,disabled:!1,thumbAlignment:`center`,value:0,min:0,max:100};static defaultInput={pointerPercent:0,dragPercent:0,dragging:!1,pointing:!1,focused:!1};#e={...e.defaultProps};#t={...e.defaultInput};get props(){return this.#e}get input(){return this.#t}constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}setInput(e){this.#t=e}getSliderState(e){let{orientation:t,disabled:n,thumbAlignment:r}=this.#e,{pointerPercent:i,dragging:a,pointing:o,focused:s}=this.#t;return{value:e,fillPercent:this.percentFromValue(e),pointerPercent:i,dragging:a,pointing:o,interactive:a||o||s,orientation:t,disabled:n,thumbAlignment:r}}getLabel(e){return H(this.#e.label,e)||``}getAttrs(e){return{role:`slider`,tabIndex:e.disabled?-1:0,autoComplete:`off`,"aria-label":this.getLabel(e),"aria-valuemin":this.#e.min,"aria-valuemax":this.#e.max,"aria-valuenow":e.value,"aria-orientation":e.orientation,"aria-disabled":e.disabled?`true`:void 0}}valueFromPercent(e){let{min:t,max:n,step:r}=this.#e;return Rr(F(t+e/100*(n-t),t,n),r,t)}rawValueFromPercent(e){let{min:t,max:n}=this.#e;return F(t+e/100*(n-t),t,n)}percentFromValue(e){let{min:t,max:n}=this.#e;return Lr(e,t,n)}getStepPercent(){let{step:e,min:t,max:n}=this.#e,r=n-t;return r>0?e/r*100:0}getLargeStepPercent(){let{largeStep:e,min:t,max:n}=this.#e,r=n-t;return r>0?e/r*100:0}adjustPercentForAlignment(e,t,n){if(this.#e.thumbAlignment===`center`||n===0)return e;let r=t/n*100/2,i=r,a=100-r;return i+e/100*(a-i)}},Ps={dragging:`data-dragging`,pointing:`data-pointing`,interactive:`data-interactive`,orientation:`data-orientation`,disabled:`data-disabled`},Fs=class{getGeometry(e){let{ranges:t,min:n,max:r,orientation:i}=e,a=r-n;if(!Number.isFinite(a)||a<=0)return[];let o=t.filter(e=>{let t=(e.end-e.start)/a,r=(e.start-n)/a;return Number.isFinite(t)&&Number.isFinite(r)&&t>0});return o.map((e,t)=>{let r=(e.start-n)/a,s=(e.end-e.start)/a,c=`${s*100}%`;return{...e,index:t,last:t===o.length-1,orientation:i,width:i===`horizontal`?c:void 0,height:i===`vertical`?c:void 0,startPercent:`${r*100}%`,endPercent:`${(r+s)*100}%`}})}getState(e,t,n){let{last:r,...i}=e,a=t=>t>=e.start&&(t<e.end||r&&t===e.end),o=a(t.value),s=t.pointing&&a(n),c=t.dragging&&a(n),l=t.interactive&&!t.pointing&&!t.dragging;return{...i,fillPercent:Lr(t.value,e.start,e.end),active:o,pointing:s,dragging:c,highlighted:e.highlight!==!1&&s,interactive:s||c||l&&o}}},Is={...fo,volumeWithValue:e=>A(uo,{value:e}),seekedTo:e=>A(ao,{time:ws(e)}),playbackRate:e=>A(Ho,{rate:e})};function Ls(e,t=`en`){return{...po(e),volumeWithValue:t=>e(uo,{value:t}),seekedTo:n=>e(ao,{time:ws(n,{locale:t})}),playbackRate:t=>e(Ho,{rate:t})}}function Rs(e){return e===`toggleMuted`||e===`volumeStep`}function zs(e){return e<=0?`off`:e<=.5?`low`:`high`}function Bs(e){return`${Math.round(F(e,0,1)*100)}%`}function Vs(e){return e.value??``}function Hs(e,t){let n=t.muted===!0,r=t.volume??0;if(e.action===`toggleMuted`)return{snapshotVolume:r,nextMuted:!n,nextVolume:r};if(e.action===`volumeStep`){let t=F(r+(e.value??0),0,1);return{snapshotVolume:r,nextMuted:n&&t<=0,nextVolume:t}}return{snapshotVolume:r,nextMuted:n,nextVolume:r}}function Us(e,t,n=fo,r){let i=r??Hs(e,t),a=i.nextMuted?`off`:zs(i.nextVolume),o=i.nextMuted?`0%`:Bs(i.nextVolume);return{status:a===`off`?`volume-off`:a===`low`?`volume-low`:`volume-high`,label:a===`off`?n.muted:n.volume,value:o,volumeLevel:a}}function Ws(e,t,n=Is){let r=[];return Ks(e.paused,t.paused)&&r.push(t.paused?n.paused:n.playing),Ks(e.subtitlesShowing,t.subtitlesShowing)&&t.subtitlesAvailable!==!1&&r.push(t.subtitlesShowing?n.captionsOn:n.captionsOff),Ks(e.fullscreen,t.fullscreen)&&r.push(t.fullscreen?n.fullscreen:n.exitFullscreen),Ks(e.pip,t.pip)&&r.push(t.pip?n.pictureInPicture:n.exitPictureInPicture),Ks(e.playbackRate,t.playbackRate)&&r.push(n.playbackRate(`${t.playbackRate}×`)),r.length>0?r.join(`. `):null}function Gs(e,t,n=Is){if(!Ks(e.volume,t.volume)&&!Ks(e.muted,t.muted))return null;let r=t.volume??e.volume,i=t.muted??e.muted;return r===void 0&&i===void 0?null:i||(r??0)<=0?n.muted:n.volumeWithValue(Bs(r??0))}function Ks(e,t){return e!==void 0&&t!==void 0&&!Object.is(e,t)}var qs=200,Js=class{state=v({generation:0,label:null});#e={};#t=null;#n=null;#r=null;#i=null;#a=new cr(()=>this.state.patch({label:null}),()=>ur(this.#e));setProps(e){this.#e=e}resetSnapshot(){this.#t=null,this.#n=null,this.#r=null,this.#f(),this.#a.close()}destroy(){this.#f(),this.#a.destroy()}processSnapshot(e){let t=this.#t;if(this.#t=e,!t)return!1;let n=this.#o(),r=Ws(t,e,n),i=r!==null&&this.#s(r),a=this.#l(t,e,n,i),o=this.#c(t,e,n,i||a);return i||a||o}#o(){return{...Is,...this.#e.labels}}#s(e){return this.#f(),this.state.patch({generation:this.state.current.generation+1,label:e}),this.#a.arm(),!0}#c(e,t,n,r){let i=Gs(e,t,n);return i===null||r||!this.#d()?!1:(this.#u(i),!0)}#l(e,t,n,r){if(e.seeking!==!0&&t.seeking===!0)return this.#n=e.currentTime??null,this.#r=t.currentTime??null,this.#f(),!1;if(t.seeking===!0)return this.#r=t.currentTime??this.#r,!1;if(e.seeking!==!0||t.seeking!==!1)return!1;let i=t.currentTime??this.#r,a=this.#n;return this.#n=null,this.#r=null,i==null||Object.is(i,a)||r||!this.#d()?!1:(this.#u(n.seekedTo(i)),!0)}#u(e){this.#f(),this.#i=setTimeout(()=>{this.#i=null,this.#d()&&this.#s(e)},qs)}#d(){return this.#e.shouldAnnounce?.()!==!1}#f(){this.#i!==null&&(clearTimeout(this.#i),this.#i=null)}};function Ys(e,t,n=fo){switch(e.action){case`togglePaused`:{let e=t.paused===void 0||!t.paused;return{status:e?`pause`:`play`,label:e?n.paused:n.playing,value:null}}case`toggleMuted`:case`volumeStep`:return Us(e,t,n);case`toggleSubtitles`:{if(t.subtitlesAvailable===!1)return null;let e=t.subtitlesShowing===void 0||!t.subtitlesShowing;return{status:e?`captions-on`:`captions-off`,label:e?n.captionsOn:n.captionsOff,value:null}}case`toggleFullscreen`:{let e=t.fullscreen===void 0||!t.fullscreen;return{status:e?`fullscreen`:`exit-fullscreen`,label:e?n.fullscreen:n.exitFullscreen,value:null}}case`togglePictureInPicture`:{let e=t.pip===void 0||!t.pip;return{status:e?`pip`:`exit-pip`,label:e?n.pictureInPicture:n.exitPictureInPicture,value:null}}default:return null}}function Xs(e){return e.value??e.label??``}var Zs={open:!1,generation:0,status:null,label:null,value:null,transitionStarting:!1,transitionEnding:!1},Qs=class{state=v({...Zs});#e={};#t=new cr(()=>this.state.patch({open:!1,status:null,label:null,value:null}),()=>ur(this.#e));setProps(e){this.#e=e}destroy(){this.#t.destroy()}close(){this.#t.close()}processEvent(e,t){if(!mo(e.action,this.#e.actions))return!1;let n=Ys(e,t,{...fo,...this.#e.labels});return n?(this.state.patch({open:!0,generation:this.state.current.generation+1,status:n.status,label:n.label,value:n.value}),this.#t.arm(),!0):!1}},$s={open:`data-open`,status:`data-status`,transitionStarting:`data-starting-style`,transitionEnding:`data-ending-style`},ec={loading:`data-loading`,error:`data-error`,hidden:`data-hidden`};function tc(e,t){let n=e.trim().split(`#`),r=n[0]??``,i=n[1],a=t?new URL(r,t).href:r;if(!i)return{url:a};let o=i.indexOf(`=`);if(o===-1)return{url:a};let c=i.slice(0,o),l=i.slice(o+1).split(`,`).map(Number),u={};for(let e=0;e<c.length;e++){let t=c[e],n=l[e];t&&s(n)&&!Number.isNaN(n)&&(u[t]=n)}let d={url:a};return s(u.w)&&(d.width=u.w),s(u.h)&&(d.height=u.h),s(u.x)&&s(u.y)&&(d.coords={x:u.x,y:u.y}),d}function nc(e,t){let n=[];for(let r of e){let e=tc(r.text,t),i={url:e.url,startTime:r.startTime,endTime:r.endTime};e.width&&(i.width=e.width),e.height&&(i.height=e.height),e.coords&&(i.coords=e.coords),n.push(i)}return n}var q=`time.`,rc={key:`${q}current`,text:`Current time`},ic={key:`${q}duration`,text:`Duration`},ac={key:`${q}remaining`,text:`Remaining`},oc={key:`${q}elapsedSuffix`,text:`{duration} elapsed`},sc={key:`${q}durationSuffix`,text:`{duration} duration`},cc={key:`${q}remainingSuffix`,text:`{duration} remaining`},lc={key:`${q}showElapsed`,text:`Show elapsed time, {duration}.`},uc={key:`${q}showDuration`,text:`Show duration, {duration}.`},dc={key:`${q}showRemaining`,text:`Show remaining time, {duration}.`},fc={key:`${q}toggleElapsed`,text:`Toggle between elapsed and remaining time.`},pc={key:`${q}toggleDuration`,text:`Toggle between duration and remaining time.`},mc={key:`${q}position`,text:`{current} of {duration}`},hc={current:lc,duration:uc,remaining:dc},gc={current:rc,duration:ic,remaining:ac},_c={current:fc,duration:pc,remaining:pc},vc=class e{static defaultProps={type:`current`,negativeSign:`-`,label:``,toggle:!1};#e={...e.defaultProps};#t=null;#n;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}setMedia(e){this.#t=e}setFormatLocale(e){this.#n=e}#r(){let e=this.#t,{type:t}=this.#e;switch(t){case`current`:return e.currentTime;case`duration`:return e.duration;case`remaining`:return e.currentTime-e.duration;default:return 0}}#i(){let e=this.#t,t=this.#r(),n=this.#n===void 0?void 0:{locale:this.#n};return Ss(Math.abs(t),e.duration,n)}#a(){let{type:e}=this.#e,t=this.#r();return ws(e===`remaining`?t<0?t:-Math.abs(t):t)}#o(){let e=this.#r();return Cs(Math.abs(e))}#s(e,t){return e===`current`?t===`remaining`?`current`:`remaining`:t===`duration`?`remaining`:`duration`}getLabel(e,t=this.#e.type){let n=H(this.#e.label,e);return n===void 0?this.#e.toggle?hc[this.#s(t,e.type)]:gc[this.#e.type]:n}getLabelParams(e){if(H(this.#e.label,e)!==void 0||!this.#e.toggle)return;let t=this.#n===void 0?void 0:{locale:this.#n},n=ws(Math.abs(e.seconds),t);switch(e.type){case`current`:return{duration:`${n} elapsed`};case`duration`:return{duration:`${n} duration`};case`remaining`:return{duration:`${n} remaining`}}}getDescription(e=this.#e.type){return this.#e.toggle?_c[e]:void 0}getAttrs(e,t=this.#e.type){return{"aria-label":this.getLabel(e,t),"aria-description":this.getDescription(t),role:this.#e.toggle?`button`:void 0,tabIndex:this.#e.toggle?0:void 0}}getState(){let e=this.#r();return{type:this.#e.type,seconds:e,negative:this.#e.type===`remaining`&&e<0,text:this.#i(),phrase:this.#a(),datetime:this.#o()}}},yc={type:`data-type`},bc={key:`slider.seek`,text:`Seek`},xc=class e extends Ns{static defaultProps={...Ns.defaultProps,label:``,changeThrottle:100,pauseOnDrag:!1};#e={...e.defaultProps};#t=null;#n;#r=!1;constructor(e){super(),e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps),super.setProps({...t,min:0})}setMedia(e){this.#t=e}setFormatLocale(e){this.#n=e}getState(){let{duration:e,currentTime:t,seeking:n,buffered:r}=this.#t;super.setProps({...this.#e,min:0,max:e});let i=super.getSliderState(t),a=Lr(r.length>0?r[r.length-1][1]:0,0,e);return{...i,currentTime:t,duration:e,seeking:n,bufferPercent:a}}getLabel(e){return super.getLabel(e)||bc}#i(e){return e.dragging?this.rawValueFromPercent(e.pointerPercent):e.value}#a(e){return this.#n===void 0?ws(e):ws(e,{locale:this.#n})}getValueText(e){return Number.isFinite(e.duration)?mc:this.getValueTextParams(e).current}getValueTextParams(e){let t=this.#a(this.#i(e));return Number.isFinite(e.duration)?{current:t,duration:this.#a(e.duration)}:{current:t}}startDrag(e){this.#r=!1,this.#e.pauseOnDrag&&e&&!e.paused&&(this.#r=!0,e.pause())}endDrag(e){this.#r&&e?.play().catch(()=>{}),this.#r=!1}getAttrs(e){let t=super.getAttrs(e),n=this.#i(e);return{...t,"aria-valuenow":n,"aria-valuetext":this.getValueText(e)}}},Sc={...Ps,seeking:`data-seeking`},Cc=new WeakMap,wc=0;function Tc(e){let t=Cc.get(e);if(!t){let n=e.id;t=`cue-${typeof n==`string`&&n?`${n}-`:``}${wc++}`,Cc.set(e,t)}return t}function Ec(e,t,n){if(!Number.isFinite(t)||!Number.isFinite(n)||n<=t)return[];let r=e.map((e,t)=>({cue:e,index:t,key:Tc(e)})).filter(({cue:e})=>Number.isFinite(e.startTime)&&Number.isFinite(e.endTime)).sort((e,t)=>e.cue.startTime-t.cue.startTime||e.index-t.index),i=[],a=t,o=`start`;for(let{cue:e,key:s}of r){let r=Math.max(t,e.startTime),c=Math.min(n,e.endTime);if(c<=r)continue;r>a&&i.push({key:`gap-${o}-${s}`,start:a,end:r,cue:null});let l=Math.max(r,a);c<=l||(i.push({key:s,start:l,end:c,cue:e}),a=c,o=s)}return i.length===0?[{key:`gap-start-end`,start:t,end:n,cue:null}]:(a<n&&i.push({key:`gap-${o}-end`,start:a,end:n,cue:null}),i)}var Dc=class{#e=null;#t=0;#n=0;#r=null;getRanges(e,t,n){if(this.#r&&(this.#e===e||this.#e?.length===0&&e.length===0)&&this.#t===t&&this.#n===n)return this.#r;let r=n>t,i=r?n:t+1,a=Ec(r?e:[],t,i),o=a.map(({key:e,start:t,end:n,cue:r})=>({key:e,start:t,end:n,highlight:r!==null}));return this.#e=e,this.#t=t,this.#n=n,this.#r={chapters:a,ranges:o,max:i},this.#r}findChapter(e,t){return di(e,t,e=>e.start,e=>e.end)}getState(e,t,n){return{...e,cue:t[e.index]?.cue??null,bufferPercent:Lr(n,e.start,e.end)}}},Oc={active:`data-active`,highlighted:`data-highlighted`},kc={start:`--media-slider-chapter-start`,end:`--media-slider-chapter-end`,width:`--media-slider-chapter-width`,fill:`--media-slider-chapter-fill`,buffer:`--media-slider-chapter-buffer`},J=class e{static defaultProps={side:`top`,align:`center`,open:!1,defaultOpen:!1,delay:600,closeDelay:0,disableHoverablePopup:!0,disabled:!1,sticky:!1};#e={...e.defaultProps};constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}#t=null;setInput(e){this.#t=e}getState(){let e=this.#t;return{open:e.active,status:e.status,side:this.#e.side,align:this.#e.align,...sr(e.status)}}getPopupAttrs(e){return{popover:`manual`,role:`presentation`}}},Ac={open:`data-open`,side:`data-side`,align:`data-align`,...or},jc=class e{static defaultProps={delay:600,closeDelay:0,timeout:400};#e={...e.defaultProps};#t=0;#n=!1;constructor(e){e&&this.setProps(e)}setProps(t){this.#e=O(t,e.defaultProps)}get delay(){return this.#e.delay}get closeDelay(){return this.#e.closeDelay}shouldSkipDelay(){return this.#n?!0:Date.now()-this.#t<this.#e.timeout}notifyOpen(){this.#n=!0}notifyClose(){this.#n=!1,this.#t=Date.now()}},Mc={sideOffset:`--media-tooltip-side-offset`,alignOffset:`--media-tooltip-align-offset`,boundaryOffset:`--media-tooltip-boundary-offset`,anchorWidth:`--media-tooltip-anchor-width`,anchorHeight:`--media-tooltip-anchor-height`,availableWidth:`--media-tooltip-available-width`,availableHeight:`--media-tooltip-available-height`},Nc=300,Pc={open:!1,generation:0,level:null,value:null,fill:null,min:!1,max:!1,transitionStarting:!1,transitionEnding:!1},Fc=class{state=v({...Pc});#e={};#t=null;#n=null;#r=new cr(()=>this.state.patch({open:!1,level:null,value:null,fill:null,min:!1,max:!1}),()=>ur(this.#e));setProps(e){this.#e=e}destroy(){this.#r.destroy(),this.#c()}close(){this.#c(),this.#r.close()}processEvent(e,t){if(!Rs(e.action))return!1;let n=this.state.current,r=Hs(e,t),i=Us(e,t,{...fo,...this.#e.labels},r),a=Ic(e,r.snapshotVolume,r.nextVolume),o=a!==null&&n[a]===!0;return a||this.#c(),this.state.patch({open:!0,generation:n.generation+1,level:i.volumeLevel,value:i.value,fill:i.value,min:a===`min`&&!o,max:a===`max`&&!o}),a&&(o?this.#a(a):this.#i()),this.#r.arm(),!0}#i(){this.#o(),this.#t=setTimeout(()=>{this.#t=null,this.state.patch({min:!1,max:!1})},Nc)}#a(e){this.#c(),this.state.patch({min:!1,max:!1}),this.#n=setTimeout(()=>{this.#n=null,this.state.patch({[e]:!0}),this.#i()},0)}#o(){this.#t!==null&&(clearTimeout(this.#t),this.#t=null)}#s(){this.#n!==null&&(clearTimeout(this.#n),this.#n=null)}#c(){this.#o(),this.#s()}};function Ic(e,t,n){return e.action!==`volumeStep`||e.value===void 0||e.value===0||n!==t?null:e.value<0?`min`:`max`}var Lc={open:`data-open`,level:`data-level`,min:`data-min`,max:`data-max`,transitionStarting:`data-starting-style`,transitionEnding:`data-ending-style`},Rc={fill:`--media-volume-fill`},zc=new Map;function Bc(e){return e===void 0?``:Array.isArray(e)?e.join(`:`):e}function Vc(e){let t=Bc(e),n=zc.get(t);if(!n)try{n=new Intl.NumberFormat(e,{style:`percent`,maximumFractionDigits:0}),zc.set(t,n)}catch{return}return n}function Hc(e){return`${Math.round(Math.min(1,Math.max(0,e))*100)}%`}function Uc(e,t){let n=!s(e)||!Number.isFinite(e)?0:Math.min(1,Math.max(0,e));try{let e=Vc(t)??Vc(void 0);if(e)return e.format(n)}catch{}return Hc(n)}var Wc=class e extends Ns{static defaultProps={...Ns.defaultProps,label:``,wheelStep:5};#e=null;#t;constructor(e){super(),e&&this.setProps(e)}setProps(t){super.setProps(O(t,e.defaultProps))}setMedia(e){this.#e=e}setFormatLocale(e){this.#t=e}getState(){let e=this.#e,{volume:t,muted:n}=e,r=n||t===0,{dragging:i,dragPercent:a}=this.input,o=t*100,s=i?this.valueFromPercent(a):o,c=super.getSliderState(s),l=e.volumeAvailability;return{...c,disabled:c.disabled||l!==`available`,fillPercent:r?0:c.fillPercent,volume:t,muted:r,availability:l,hidden:l!==`available`}}getWheelStepPercent(){let e=this.props,t=e.max-e.min;return t>0?e.wheelStep/t*100:0}getLabel(e){return super.getLabel(e)||lo}getValueText(e){return e.muted?so:this.getValueTextParams(e).percent}getValueTextParams(e){return{percent:Uc(e.value/100,this.#t)}}getAttrs(e){return{...super.getAttrs(e),"aria-valuetext":this.getValueText(e)}}},Gc={...Ps,availability:`data-availability`,hidden:`data-hidden`},Kc=class extends V{constructor(...e){super(...e),this.core=new Hi,this.stateAttrMap=Ui,this.mediaState=new w(this,f,Tn)}static{this.tagName=`media-airplay-button`}activate(e){this.core.toggle(e)}},qc=i(Symbol(`@videojs/radio-group`)),Jc=class extends h{constructor(...e){super(...e),this.value=``,this.#e=new S(this,{context:qc})}static{this.properties={value:{type:String}}}#e;update(e){super.update(e),this.#e.setValue({value:this.value,onValueChange:e=>{this.value=e,this.dispatchEvent(new CustomEvent(`value-change`,{detail:{value:e},bubbles:!0}))}})}},Yc=Symbol(`@videojs/menu`),Xc=Symbol(`@videojs/menu-group`),Zc=i(Yc),Qc=i(Xc),$c=class{#e;#t;#n={registerLabel:e=>this.#a(e)};#r;#i;constructor(e){this.#e=e,this.#t=new S(e,{context:Qc,initialValue:this.#n})}applyProps(){let e=this.#e.getAttribute(`aria-labelledby`)??void 0,t=e!==void 0&&e!==this.#i;if(this.#e.hasAttribute(`aria-label`)||t){this.#i&&e===this.#i&&this.#e.removeAttribute(`aria-labelledby`),this.#i=void 0,L(this.#e,{role:`group`});return}this.#i=this.#r,L(this.#e,{role:`group`,"aria-labelledby":this.#r})}#a(e){return this.#r=e,this.#t.setValue(this.#n),this.#e.requestUpdate(),()=>{this.#r===e&&(this.#r=void 0,this.#e.requestUpdate())}}},el=class extends h{constructor(...e){super(...e),this.value=``,this.disabled=!1,this.#e=new C(this,{context:Zc,subscribe:!0}),this.#t=new C(this,{context:qc,subscribe:!0}),this.#n=null,this.#r=!1,this.#i=null}static{this.tagName=`media-menu-radio-item`}static{this.properties={value:{type:String},disabled:{type:Boolean}}}#e;#t;#n;#r;#i;connectedCallback(){super.connectedCallback(),this.#n=new AbortController,this.#r=!1}disconnectedCallback(){super.disconnectedCallback(),this.#i?.(),this.#i=null,this.#n?.abort(),this.#n=null,this.#r=!1}update(e){super.update(e);let t=this.#e.value,n=this.#t.value;if(!t||!n||!this.#n)return;this.#r||(this.#r=!0,this.#i=t.menu.registerItem(this),L(this,{onClick:()=>{let e=this.#e.value,t=this.#t.value;e&&t&&!this.disabled&&(t.onValueChange(this.value),Ar(e.menu))},onPointerenter:()=>{let e=this.#e.value;this.disabled||e?.menu.highlight(this,{focus:!1,pointer:!0})}},{signal:this.#n.signal}));let r=n.value===this.value;L(this,{role:`menuitemradio`,"aria-checked":String(r),"aria-disabled":this.disabled?`true`:void 0})}},Y=class extends Jc{static{this.tagName=`media-menu-radio-group`}#e=new $c(this);#t=new C(this,{context:Zc,subscribe:!0});#n=null;#r=null;#i=null;disconnectedCallback(){this.#a(),super.disconnectedCallback()}update(e){super.update(e),this.#e.applyProps()}setItemLabel(e,t){let n=e.querySelector(`[data-part~="label"]`);n?n.textContent=t:e.textContent=t}applyDefaultAriaLabel(e){if(this.hasAttribute(`aria-labelledby`))return;let t=this.getAttribute(`aria-label`);(t===null||t===this.#n)&&(this.#n=e,this.setAttribute(`aria-label`,e))}publishMenuTriggerState(e,t){let n=this.#t.value??null;if(n?.menu!==this.#r&&(this.#a(),this.#r=n?.menu??null,this.#i=n?.setTriggerState??null),!this.#i)return;let r=Le(this,e=>e instanceof el&&e.value===this.value),i=r?.querySelector(`[data-part~="label"]`)?.textContent??r?.textContent?.trim()??``;this.#i({hint:i,disabled:e,availability:t})}#a(){this.#i?.({hint:``,disabled:!1}),this.#r=null,this.#i=null}};function tl(e,t){return JSON.stringify([e,t])}var nl=class extends h{constructor(...e){super(...e),this.checked=!1,this.forceMount=!1}static{this.tagName=`media-menu-item-indicator`}static{this.properties={checked:{type:Boolean},forceMount:{type:Boolean,attribute:`force-mount`}}}update(e){super.update(e);let t=!this.checked&&!this.forceMount;L(this,{"aria-hidden":`true`,hidden:t})}},rl=class{#e;#t;#n=``;#r=null;#i=null;constructor(e,t){this.#e=e,this.#t=t,e.addController(this)}hostConnected(){this.#i=new AbortController,this.#e.addEventListener(`value-change`,this.#a,{signal:this.#i.signal})}hostDisconnected(){this.#i?.abort(),this.#i=null}hostDestroyed(){this.hostDisconnected()}sync(e,t,n){this.#e.value=e.value,L(this.#e,{"aria-disabled":e.disabled?`true`:void 0,hidden:e.hidden?``:void 0});let r=Bt(this.#e),i=r?Vt(r):null,a=i?.localName===el.tagName?i:null,o=`${e.options.map(e=>`${e.value}:${tl(e.label,e.labelParams)}:${this.#t.getOptionCacheKey?.(e)??``}`).join(`|`)}::${n}::${r?.innerHTML??``}`;if(o!==this.#n||t!==this.#r){this.#n=o,this.#r=t;for(let e of[...this.#e.children])e!==r&&e.remove();let n=e.options.map(e=>{let n=a?Ht(a,this.#e.ownerDocument):this.#e.ownerDocument.createElement(el.tagName);n.value=e.value,this.#t.setItemAttributes?.(n,e);let r=A(e.label,t,e.labelParams);return this.#t.renderItem?this.#t.renderItem(n,r,e):this.#o(n,r),n});this.#e.append(...n)}let s=new Map(e.options.map(e=>[e.value,e]));for(let t of this.#e.querySelectorAll(el.tagName)){let n=t.value===e.value,r=s.get(t.value);t.disabled=e.disabled||r?.disabled===!0;for(let e of t.querySelectorAll(nl.tagName))e.checked=n}}#a=e=>{if(e.target!==this.#e)return;let{value:t}=e.detail;this.#t.onValueChange(t)};#o(e,t){let n=e.querySelector(`[data-part~="label"]`);n?n.textContent=t:e.textContent=t}},il=class extends Y{constructor(...e){super(...e),this.disabled=!1,this.label=``,this.formatTrack=aa.defaultProps.formatTrack,this.#e=new aa,this.#t=new B(this,z),this.#n=new w(this,f,mn),this.#r=new rl(this,{setItemAttributes:(e,t)=>e.setAttribute(`data-track`,t.value),onValueChange:e=>{let t=this.#n.value;t&&this.#e.selectValue(t,e)}})}static{this.tagName=`media-audio-track-radio-group`}static{this.properties={...Y.properties,disabled:{type:Boolean},label:{type:String}}}#e;#t;#n;#r;connectedCallback(){super.connectedCallback(),this.destroyed}update(e){let t=this.#n.value,n=null;t&&(this.#e.setProps({formatTrack:this.formatTrack,disabled:this.disabled,label:this.label}),this.#e.setMedia(t),n=this.#e.getState(),this.applyDefaultAriaLabel(A(this.#e.getLabel(n),this.#t.value)),this.#r.sync(n,this.#t.value,this.#t.locale),this.publishMenuTriggerState(n.disabled,n.availability)),super.update(e),n&&R(this,n,oa)}},al=class extends h{constructor(...e){super(...e),this.delay=sa.defaultProps.delay,this.#e=new sa,this.#t=new w(this,f,Sn),this.#n=null}static{this.tagName=`media-buffering-indicator`}static{this.properties={delay:{type:Number}}}#e;#t;#n;connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.#n=new AbortController,this.#e.state.subscribe(()=>this.requestUpdate(),{signal:this.#n.signal}))}disconnectedCallback(){super.disconnectedCallback(),this.#n?.abort(),this.#n=null}willUpdate(e){super.willUpdate(e),this.#e.setProps(this)}update(e){super.update(e);let t=this.#t.value;t&&(this.#e.update(t),R(this,this.#e.state.current,ca))}};function ol(e,t){let n=e.getRootNode(),r=(`getElementById`in n?n.getElementById(t):null)??n.querySelector(`#${CSS.escape(t)}`);if(!r||!(`open`in r))return;let i=r;i.open=!i.open}function sl(e){return e.textTrackList.filter(Me).length}var cl=class extends V{constructor(...e){super(...e),this.commandfor=void 0,this.menuFor=void 0,this.#e=void 0,this.core=new fa,this.stateAttrMap=ma,this.mediaState=new w(this,f,En),this.hotkeyAction=`toggleSubtitles`}static{this.tagName=`media-captions-button`}static{this.properties={label:{type:String},disabled:{type:Boolean},commandfor:{type:String},menuFor:{type:String,attribute:`menu-for`}}}#e;connectedCallback(){super.connectedCallback(),this.commandfor&&this.commandfor!==this.menuFor&&(this.#e=this.commandfor)}activate(e,t){if(this.menuFor&&sl(e)>1){t instanceof KeyboardEvent&&ol(this,this.menuFor);return}this.core.toggle(e)}getIsButtonDisabled(){let e=this.mediaState.value;return!!(super.getIsButtonDisabled()||e&&sl(e)===0)}willUpdate(e){super.willUpdate(e),e.has(`commandfor`)&&this.commandfor!==this.menuFor&&(this.#e=this.commandfor),(e.has(`commandfor`)||e.has(`menuFor`))&&this.#t()}update(e){super.update(e);let t=this.mediaState.value;t&&(this.#t(t),this.menuFor&&sl(t)>1&&L(this,{"aria-disabled":this.getIsButtonDisabled()?`true`:void 0}))}#t(e){let t=e??this.mediaState.value,n=t&&this.menuFor&&sl(t)>1?this.menuFor:this.#e;n?this.setAttribute(`commandfor`,n):this.removeAttribute(`commandfor`)}},ll=class extends Y{constructor(...e){super(...e),this.disabled=!1,this.label=``,this.formatTrack=va.defaultProps.formatTrack,this.#e=new va,this.#t=new B(this,z),this.#n=new w(this,f,En),this.#r=new rl(this,{setItemAttributes:(e,t)=>e.setAttribute(`data-track`,t.value),onValueChange:e=>{let t=this.#n.value;t&&this.#e.selectValue(t,e)}})}static{this.tagName=`media-captions-radio-group`}static{this.properties={...Y.properties,disabled:{type:Boolean},label:{type:String}}}#e;#t;#n;#r;connectedCallback(){super.connectedCallback(),this.destroyed}update(e){let t=this.#n.value,n=null;t&&(this.#e.setProps({formatTrack:this.formatTrack,disabled:this.disabled,label:this.label}),this.#e.setMedia(t),n=this.#e.getState(),this.applyDefaultAriaLabel(A(this.#e.getLabel(n),this.#t.value)),this.#r.sync(n,this.#t.value,this.#t.locale),this.publishMenuTriggerState(n.disabled,n.availability)),super.update(e),n&&R(this,n,ya)}},ul=class extends V{constructor(...e){super(...e),this.core=new ba,this.stateAttrMap=xa,this.mediaState=new w(this,f,Tn)}static{this.tagName=`media-cast-button`}activate(e){return this.core.toggle(e)}},dl=i(Symbol.for(`@videojs/popup-group`)),fl={key:`container.label`,text:`Media player`},pl=class extends h{static{this.tagName=`media-container`}#e=null;#t=null;#n=null;#r=new Sa;#i=new w(this,f,gn);#a=new B(this,z);#o=Fr();#s=new S(this,{context:dl,initialValue:this.#o});#c=new C(this,{context:n,callback:e=>this.#l(e)});connectedCallback(){super.connectedCallback(),this.#s.setValue(this.#o),this.#l(this.#c.value),nr(this),this.#u(),this.#t=new AbortController,E(this,`pointerup`,this.#d,{signal:this.#t.signal})}disconnectedCallback(){this.#e?.(),this.#e=null,this.#t?.abort(),this.#t=null,super.disconnectedCallback()}update(e){super.update(e),this.#u();let t=this.#i.value;t?(this.#r.setMedia(t),R(this,this.#r.getState(),Ca)):this.removeAttribute(Ca.controlsVisible)}#l(e){this.#e?.(),this.#e=null,this.isConnected&&e&&(this.#e=e.registerContainer(this))}#u(){let e=this.getAttribute(`aria-label`);if(e&&e!==this.#n)return;if(this.hasAttribute(`aria-labelledby`)){e===this.#n&&(this.removeAttribute(`aria-label`),this.#n=null);return}let t=this.#a.value(fl);this.setAttribute(`aria-label`,t),this.#n=t}#d=()=>{rr(this)}},ml=class extends V{constructor(...e){super(...e),this.core=new Xa,this.stateAttrMap=Za,this.mediaState=new w(this,f,vn),this.hotkeyAction=`toggleFullscreen`}static{this.tagName=`media-fullscreen-button`}activate(e){return this.core.toggle(e)}},hl=class extends h{constructor(...e){super(...e),this.type=``,this.action=``,this.value=void 0,this.pointer=void 0,this.region=void 0,this.disabled=!1,this.#e=new w(this,f),this.#t=new C(this,{context:n,callback:()=>this.requestUpdate(),subscribe:!0}),this.#n=null}static{this.tagName=`media-gesture`}static{this.properties={type:{type:String},action:{type:String},value:{type:Number},pointer:{type:String},region:{type:String},disabled:{type:Boolean}}}#e;#t;#n;connectedCallback(){super.connectedCallback(),this.style.display=`none`,this.#r()}disconnectedCallback(){super.disconnectedCallback(),this.#i()}update(e){super.update(e),this.isConnected&&(this.#i(),this.#r())}#r(){let e=this.#e.value,t=this.#t.value?.container;if(!this.type||!this.action||!e||!t)return;let n=kn(this.action);if(!n)return;let{value:r}=this,i=t=>{n({store:e,value:r,event:t})},a={pointer:this.pointer,region:this.region,disabled:this.disabled,action:this.action,value:this.value};this.#n=this.type===`doubletap`?Fn(t,i,a):Pn(t,i,a)}#i(){this.#n?.(),this.#n=null}},gl=class extends h{constructor(...e){super(...e),this.keys=``,this.action=``,this.value=void 0,this.disabled=!1,this.target=`player`,this.#e=new w(this,f),this.#t=new C(this,{context:n,callback:()=>this.requestUpdate(),subscribe:!0}),this.#n=null}static{this.tagName=`media-hotkey`}static{this.properties={keys:{type:String},action:{type:String},value:{type:Number},disabled:{type:Boolean},target:{type:String}}}#e;#t;#n;connectedCallback(){super.connectedCallback(),this.style.display=`none`,this.#r()}disconnectedCallback(){super.disconnectedCallback(),this.#i()}update(e){super.update(e),this.isConnected&&(this.#i(),this.#r())}#r(){let e=this.#e.value,t=this.#t.value?.container;if(!this.keys||!this.action||!e||!t)return;let n=Rn(this.action);if(!n)return;let{value:r,action:i}=this;this.#n=Qn(t,{keys:this.keys,action:i,value:r,target:this.target,disabled:this.disabled,repeatable:!In(i),onActivate:(t,i)=>{n({store:e,key:i,value:r})}})}#i(){this.#n?.(),this.#n=null}},_l=class extends h{constructor(...e){super(...e),this.disabled=!1,this.label=``,this.core=new xo,this.live=new w(this,f,yn),this.time=new w(this,f,M),this.buffer=new w(this,f,hn),this.#e=new B(this,z),this.#t=!1,this.#n=null}static{this.tagName=`media-live-button`}static{this.properties={label:{type:String},disabled:{type:Boolean}}}#e;get $state(){return this.core.state}#t;#n;connectedCallback(){if(super.connectedCallback(),this.destroyed)return;this.#t||=!this.textContent?.trim(),this.#t&&(this.textContent=A(xo.defaultText,this.#e.value)),this.#n=new AbortController;let e=er({onActivate:()=>{let e=this.#r();e&&this.core.seekToLive(e)},isDisabled:()=>this.disabled||!this.#r()});L(this,e,{signal:this.#n.signal})}disconnectedCallback(){super.disconnectedCallback(),this.#n?.abort(),this.#n=null}getLabel(){return this.core.state.current.label?k(this.core.state.current.label):void 0}getResolvedLabel(){if(!this.#r())return;let e=this.core.getState();return A(this.core.getLabel(e),this.#e.value)}willUpdate(e){super.willUpdate(e),this.core.setProps(this)}update(e){super.update(e),this.#t&&(this.textContent=A(xo.defaultText,this.#e.value));let t=this.#r();if(!t)return;this.core.setMedia(t);let n=this.core.getState(),r=this.core.getAttrs(n);L(this,{...r,"aria-label":A(r[`aria-label`],this.#e.value)}),R(this,n,wo)}#r(){let e=this.live.value,t=this.time.value,n=this.buffer.value;return!e||!t||!n?null:{currentTime:t.currentTime,seek:t.seek,seekable:n.seekable,liveEdgeStart:e.liveEdgeStart,targetLiveWindow:e.targetLiveWindow}}},vl=class extends V{constructor(...e){super(...e),this.core=new Mo,this.stateAttrMap=Po,this.mediaState=new w(this,f,Dn),this.hotkeyAction=`toggleMuted`}static{this.tagName=`media-mute-button`}activate(e){this.core.toggle(e)}},yl=class extends V{constructor(...e){super(...e),this.core=new Ro,this.stateAttrMap=zo,this.mediaState=new w(this,f,xn),this.hotkeyAction=`togglePictureInPicture`}static{this.tagName=`media-pip-button`}activate(e){return this.core.toggle(e)}},bl=class extends V{constructor(...e){super(...e),this.core=new Bo,this.stateAttrMap=Vo,this.mediaState=new w(this,f,Sn),this.hotkeyAction=`togglePaused`}static{this.tagName=`media-play-button`}activate(e){this.core.toggle(e)}},xl=class extends V{constructor(...e){super(...e),this.commandfor=void 0,this.core=new Uo,this.stateAttrMap=Wo,this.mediaState=new w(this,f,Cn),this.hotkeyAction=`speedUp`}static{this.tagName=`media-playback-rate-button`}static{this.properties={label:{type:String},disabled:{type:Boolean},commandfor:{type:String}}}activate(e,t){if(this.commandfor){t instanceof KeyboardEvent&&this.click();return}this.core.cycle(e)}getIsButtonDisabled(){let e=this.mediaState.value;return!!(super.getIsButtonDisabled()||this.commandfor&&e&&e.playbackRates.length===0)}willUpdate(e){super.willUpdate(e),e.has(`commandfor`)&&(this.commandfor?this.setAttribute(`commandfor`,this.commandfor):this.removeAttribute(`commandfor`))}update(e){super.update(e),this.mediaState.value&&this.commandfor&&L(this,{"aria-disabled":this.getIsButtonDisabled()?`true`:void 0})}},Sl=class extends Y{constructor(...e){super(...e),this.disabled=!1,this.formatRate=Ko.defaultProps.formatRate,this.#e=new Ko,this.#t=new B(this,z),this.#n=new w(this,f,Cn),this.#r=new rl(this,{setItemAttributes:(e,t)=>e.setAttribute(`data-rate`,t.value),onValueChange:e=>{let t=this.#n.value;t&&this.#e.selectValue(t,e)}})}static{this.tagName=`media-playback-rate-radio-group`}static{this.properties={...Y.properties,disabled:{type:Boolean}}}#e;#t;#n;#r;connectedCallback(){super.connectedCallback(),this.destroyed}update(e){let t=this.#n.value,n=null;t&&(this.#e.setProps({formatRate:this.formatRate,disabled:this.disabled}),this.#e.setMedia(t),n=this.#e.getState(),this.applyDefaultAriaLabel(A(this.#e.getLabel(n),this.#t.value,this.#e.getLabelParams(n))),this.#r.sync(n,this.#t.value,this.#t.locale),this.publishMenuTriggerState(n.disabled,n.availability)),super.update(e),n&&R(this,n,qo)}},Cl=0,wl=class{#e;#t=new Qr;#n=null;constructor(e){this.#e=e,e.addController(this)}findTrigger(e){let t=this.#e.getRootNode();if(t.nodeType!==Node.DOCUMENT_NODE&&t.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return this.#r(),null;let n=t;if(e)return this.#r(),n.getElementById(e);if(this.#n){let{id:e,trigger:t}=this.#n;if(this.#e.id===e&&t.getAttribute(`commandfor`)===e&&this.#e.previousElementSibling===t)return t;this.#r()}if(this.#e.id)return n.querySelector(`[commandfor="${this.#e.id}"]`);let r=this.#e.previousElementSibling;if(!(r instanceof HTMLElement)||r.getAttribute(`commandfor`))return null;let i=Tl(n);return this.#e.id=i,r.setAttribute(`commandfor`,i),this.#n={id:i,trigger:r},r}sync(e){this.#t.sync({...e,popup:this.#e})}cleanup(){this.#t.cleanup()}hostDisconnected(){this.cleanup(),this.#r()}hostDestroyed(){this.cleanup(),this.#r()}#r(){let e=this.#n;e&&(e.trigger.getAttribute(`commandfor`)===e.id&&e.trigger.removeAttribute(`commandfor`),this.#e.id===e.id&&this.#e.removeAttribute(`id`),this.#n=null)}};function Tl(e){let t;do t=`vjs-popup-${++Cl}`;while(e.getElementById(t));return t}var El=class extends h{constructor(...e){super(...e),this.open=K.defaultProps.open,this.defaultOpen=K.defaultProps.defaultOpen,this.side=K.defaultProps.side,this.align=K.defaultProps.align,this.modal=K.defaultProps.modal,this.closeOnEscape=K.defaultProps.closeOnEscape,this.closeOnOutsideClick=K.defaultProps.closeOnOutsideClick,this.openOnHover=K.defaultProps.openOnHover,this.delay=K.defaultProps.delay,this.closeDelay=K.defaultProps.closeDelay,this.boundary=`container`,this.#e=new K,this.#t=new C(this,{context:n,subscribe:!0}),this.#n=new C(this,{context:dl}),this.#r=new wl(this),this.#i=null,this.#a=null,this.#o=null,this.#s=null,this.#c=null}static{this.tagName=`media-popover`}static{this.properties={open:{type:Boolean},defaultOpen:{type:Boolean,attribute:`default-open`},side:{type:String},align:{type:String},modal:{type:Boolean},closeOnEscape:{type:Boolean,attribute:`close-on-escape`},closeOnOutsideClick:{type:Boolean,attribute:`close-on-outside-click`},openOnHover:{type:Boolean,attribute:`open-on-hover`},delay:{type:Number},closeDelay:{type:Number,attribute:`close-delay`},boundary:{type:String}}}#e;#t;#n;#r;#i;#a;#o;#s;#c;connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.setAttribute(Yo,``),this.#o=new AbortController,this.#i=Cr({transition:I(),onOpenChange:(e,t)=>{this.open=e,this.dispatchEvent(new CustomEvent(`open-change`,{detail:{open:e,...t}}))},closeOnEscape:()=>this.closeOnEscape,closeOnOutsideClick:()=>this.closeOnOutsideClick,openOnHover:()=>this.openOnHover,delay:()=>this.delay,closeDelay:()=>this.closeDelay,group:()=>this.#n.value}),this.#i.setPopupElement(this),L(this,this.#i.popupProps,{signal:this.#o.signal}),this.#a?this.#a.track(this.#i.input):this.#a=new g(this,this.#i.input))}firstUpdated(e){super.firstUpdated(e),this.defaultOpen&&!this.open&&this.#i?.open()}disconnectedCallback(){super.disconnectedCallback(),this.#o?.abort(),this.#o=null}destroyCallback(){this.#u(),this.#i?.destroy(),super.destroyCallback()}close(e=`imperative-action`){this.#i?.close(e)}get triggerElement(){return this.#c}willUpdate(e){if(super.willUpdate(e),this.#e.setProps(this),this.#i&&e.has(`open`)){let{active:e}=this.#i.input.current;this.open!==e&&(this.open?this.#i.open():this.#i.close())}}update(e){if(super.update(e),!this.#i)return;let t=this.#r.findTrigger();this.#l(t);let n=this.#i.input.current;this.#e.setInput(n);let r=this.#e.getState();if(L(this,this.#e.getPopupAttrs(r)),R(this,r,Jo),r.open?jt(this):Mt(this),this.#c&&L(this.#c,this.#e.getTriggerAttrs(r,this.id)),!r.open){this.#r.cleanup();return}this.#r.sync({anchorName:this.id,position:{side:r.side,align:r.align},trigger:this.#c,boundary:this.boundary,container:this.#t.value?.container??null,onSideChange:e=>this.setAttribute(Jo.side,e)})}#l(e){e!==this.#c&&(this.#r.cleanup(),this.#u(),this.#c=e,this.#i?.setTriggerElement(e),e&&this.#i&&(this.#s=new AbortController,L(e,this.#i.triggerProps,{signal:this.#s.signal})))}#u(){this.#c&&L(this.#c,{"aria-expanded":void 0,"aria-haspopup":void 0,"aria-controls":void 0}),this.#s?.abort(),this.#s=null,this.#c=null}};function Dl(e){if(e instanceof HTMLSlotElement){let t=e.assignedElements();if(t.length>0)return t}return[...e.children]}function Ol(e){for(let t of Dl(e)){if(t instanceof HTMLImageElement)return t;let e=Ol(t);if(e)return e}return null}function kl(e){if(e.hasAttribute(`src`)||e.hasAttribute(`srcset`))return!0;let t=e.parentElement;return t?.localName===`picture`&&t.querySelector(`source`)!==null}function Al(e){return!!e.getAttribute(`src`)||e.hasAttribute(`srcset`)}var jl=class extends h{static{this.tagName=`media-poster`}#e=new Zo;#t=new MutationObserver(()=>this.requestUpdate());#n=new w(this,f,Sn);#r=new w(this,f,bn);#i=null;#a=!1;#o=`pending`;#s=null;#c=null;connectedCallback(){if(super.connectedCallback(),this.destroyed)return;this.#c=new AbortController;let{signal:e}=this.#c;this.addEventListener(`slotchange`,()=>this.requestUpdate(),{signal:e}),this.#t.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){super.disconnectedCallback(),this.#u(null),this.#t.disconnect(),this.#c?.abort(),this.#c=null}get#l(){return!this.#i||!kl(this.#i)?`none`:this.#o===`pending`?`loading`:this.#o}update(e){super.update(e);let t=this.#n.value;if(!t)return;this.#e.setMedia({started:t.started,poster:this.#r.value?.poster??``});let{src:n}=this.#e.getState();this.#u(Ol(this)),this.#d(n),this.#e.setImageLoadState(this.#l),R(this,this.#e.getState(),Qo)}#u(e){if(e===this.#i||(this.#a&&this.#i?.removeAttribute(`src`),this.#s?.abort(),this.#s=null,this.#i=e,this.#a=e!==null&&!kl(e),this.#o=`pending`,!e))return;e.naturalWidth>0?this.#o=`loaded`:e.complete&&Al(e)&&(this.#o=`error`),this.#s=new AbortController;let{signal:t}=this.#s,n=e=>()=>{this.#o=e,this.requestUpdate()};e.addEventListener(`load`,n(`loaded`),{signal:t}),e.addEventListener(`error`,n(`error`),{signal:t})}#d(e){let t=this.#i;t&&this.#a&&(e?t.getAttribute(`src`)!==e&&(this.#o=`pending`,t.setAttribute(`src`,e)):(this.#o=`pending`,t.removeAttribute(`src`)))}},Ml=class extends Y{constructor(...e){super(...e),this.disabled=!1,this.label=``,this.formatRendition=us.defaultProps.formatRendition,this.#e=new us,this.#t=new B(this,z),this.#n=new w(this,f,wn),this.#r=new rl(this,{renderItem:(e,t,n)=>this.#i(e,t,n.tier,n.badge),setItemAttributes:(e,t)=>e.setAttribute(`data-rendition`,t.value),getOptionCacheKey:e=>`${e.tier??``}:${e.badge??``}`,onValueChange:e=>{let t=this.#n.value;t&&this.#e.selectValue(t,e)}})}static{this.tagName=`media-quality-radio-group`}static{this.properties={...Y.properties,disabled:{type:Boolean},label:{type:String}}}#e;#t;#n;#r;connectedCallback(){super.connectedCallback(),this.destroyed}update(e){let t=this.#n.value,n=null;t&&(this.#e.setProps({formatRendition:this.formatRendition,disabled:this.disabled,label:this.label}),this.#e.setMedia(t),n=this.#e.getState(),this.applyDefaultAriaLabel(A(this.#e.getLabel(n),this.#t.value)),this.#r.sync(n,this.#t.value,this.#t.locale),this.publishMenuTriggerState(n.disabled,n.availability)),super.update(e),n&&R(this,n,ds)}#i(e,t,n,r){let i=e.querySelector(`[data-part~="label"]`),a=e.querySelector(`[data-part~="tier"]`),o=e.querySelector(`[data-part~="badge"]`);i&&(i.textContent=t),a&&(a.textContent=n??``,a.hidden=!n),o&&(o.textContent=r??``,o.hidden=!r),!i&&!a&&!o&&(e.textContent=[t,n,r].filter(Boolean).join(` `))}},Nl=class extends V{constructor(...e){super(...e),this.seconds=hs.defaultProps.seconds,this.core=new hs,this.stateAttrMap=gs,this.mediaState=new w(this,f,M),this.hotkeyAction=`seekStep`}static{this.tagName=`media-seek-button`}static{this.properties={...V.properties,seconds:{type:Number}}}get hotkeyValue(){return this.seconds}activate(e){this.core.seek(e)}},X=i(Symbol(`@videojs/slider`)),Pl=class extends h{static{this.tagName=`media-time-slider-chapter-title`}#e=new Dc;#t=new C(this,{context:X,subscribe:!0});#n=new w(this,f,En);#r=new w(this,f,M);update(e){super.update(e);let t=this.#t.value;if(!t)return;let n=this.#r.value?.duration??0,{chapters:r}=this.#e.getRanges(this.#n.value?.chaptersCues??[],0,n),i=t.state.interactive&&!t.state.pointing&&!t.state.dragging,a=t.state.pointing||t.state.dragging?t.pointerValue:t.state.value,o=this.#e.findChapter(r,a);this.textContent=o?.cue?.text??``,i?(this.removeAttribute(`aria-hidden`),this.setAttribute(`aria-live`,`polite`)):(this.setAttribute(`aria-hidden`,`true`),this.removeAttribute(`aria-live`))}},Fl=class extends h{static{this.tagName=`media-time-slider-chapters`}#e=new Fs;#t=new Dc;#n=new C(this,{context:X,subscribe:!0});#r=new w(this,f,En);#i=new w(this,f,hn);#a=new w(this,f,M);#o=new Map;#s=null;#c=!1;connectedCallback(){super.connectedCallback(),this.setAttribute(`aria-hidden`,`true`)}update(e){super.update(e);let t=this.#n.value,n=this.#a.value?.duration??0,r=this.#l();if(!t||(R(this,t.state,t.stateAttrMap),!r))return;let{chapters:i,ranges:a,max:o}=this.#t.getRanges(this.#r.value?.chaptersCues??[],0,n),s=this.#e.getGeometry({ranges:a,min:0,max:o,orientation:t.state.orientation}),c=this.#i.value?.buffered??[],l=c.length?c[c.length-1][1]:0,u=new Map;for(let e of s){let n=this.#t.getState(this.#e.getState(e,t.state,t.pointerValue),i,l),a=this.#o.get(n.key);a||=Ht(r,this.ownerDocument),this.#u(a,`pointer-events`,n.cue?void 0:`none`),this.#u(a,kc.start,n.startPercent),this.#u(a,kc.end,n.endPercent),this.#u(a,kc.width,n.width??n.height),this.#u(a,kc.fill,`${n.fillPercent}%`),this.#u(a,kc.buffer,`${n.bufferPercent}%`),R(a,t.state,t.stateAttrMap),R(a,n,Oc),u.set(n.key,a)}for(let[e,t]of this.#o)u.has(e)||t.remove();let d=null;for(let e of[...u.values()].reverse())(e.parentNode!==this||e.nextSibling!==d)&&this.insertBefore(e,d),d=e;this.#o.clear();for(let[e,t]of u)this.#o.set(e,t)}#l(){if(this.#c)return this.#s;let e=Bt(this);if(!e){for(let e of[...this.childNodes])e.remove();return null}this.#c=!0;let t=Vt(e);for(let t of[...this.childNodes])t!==e&&t.remove();return t?.namespaceURI===`http://www.w3.org/1999/xhtml`?(this.#s=t,this.#s):null}#u(e,t,n){n===void 0?e.style.removeProperty(t):e.style.setProperty(t,n)}},Il=i(Symbol(`@videojs/dialog`)),Z=class extends h{connectedCallback(){super.connectedCallback(),this.#e()}update(e){super.update(e),this.#e()}#e(){let e=this.consumer.value;e&&R(this,e.state,e.stateAttrMap)}},Ll=i(Symbol(`@videojs/controls`)),Rl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Ll,subscribe:!0})}static{this.tagName=`media-controls-backdrop`}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`presentation`),this.setAttribute(`aria-hidden`,`true`)}},zl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Ll,subscribe:!0})}static{this.tagName=`media-controls-content`}connectedCallback(){super.connectedCallback(),this.setAttribute(`data-interactive`,``)}},Bl=class extends h{static{this.tagName=`media-controls`}#e=new wa;#t=new w(this,f,gn);#n=new S(this,{context:Ll});#r=!0;connectedCallback(){super.connectedCallback()}update(e){super.update(e);let t=this.#t.value;if(!t)return;this.#e.setMedia(t);let n=this.#e.getState();R(this,n,Ta),this.#n.setValue({state:n,stateAttrMap:Ta});let r=this.#r;this.#r=n.visible,r&&!n.visible&&this.#i()}#i(){for(let e of this.querySelectorAll(Xo)){let t=e;u(t.close)&&t.close(`imperative-action`)}}},Vl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Ll,subscribe:!0})}static{this.tagName=`media-controls-group`}connectedCallback(){super.connectedCallback(),(this.hasAttribute(`aria-label`)||this.hasAttribute(`aria-labelledby`))&&this.setAttribute(`role`,`group`)}},Hl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Il,subscribe:!0})}static{this.tagName=`media-dialog-backdrop`}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`presentation`),this.setAttribute(`aria-hidden`,`true`)}},Ul=class extends h{constructor(...e){super(...e),this.disabled=!1,this.#e=new C(this,{context:Il,subscribe:!0}),this.#t=null}static{this.tagName=`media-dialog-close`}static{this.properties={disabled:{type:Boolean}}}#e;#t;connectedCallback(){super.connectedCallback(),this.#t=new AbortController;let e=er({onActivate:()=>this.#e.value?.close(),isDisabled:()=>this.disabled});L(this,e,{signal:this.#t.signal})}disconnectedCallback(){super.disconnectedCallback(),this.#t?.abort(),this.#t=null}update(e){super.update(e);let t=this.#e.value;t&&R(this,t.state,t.stateAttrMap)}},Wl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Il,subscribe:!0})}static{this.tagName=`media-dialog-description`}update(e){super.update(e);let t=this.consumer.value?.state.descriptionId;t&&(this.id=t)}},Gl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Il,subscribe:!0}),this.#e=null}static{this.tagName=`media-dialog-popup`}#e;disconnectedCallback(){this.#e?.setPopupElement(null),this.#e=null,super.disconnectedCallback()}update(e){super.update(e);let t=this.consumer.value;t&&(this.#e!==t.dialog&&(this.#e?.setPopupElement(null),this.#e=t.dialog,this.#e.setPopupElement(this)),L(this,{id:t.popupId,tabIndex:-1,...t.popupAttrs}))}},Kl=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:Il,subscribe:!0})}static{this.tagName=`media-dialog-title`}update(e){super.update(e);let t=this.consumer.value?.state.titleId;t&&(this.id=t)}},ql=0;function Jl(e){return Array.from(e.childNodes).some(e=>!!e.textContent?.trim())}var Yl=class extends h{static{this.tagName=`media-error-dialog`}#e=new Ea;#t=new S(this,{context:Il});#n=`vjs-error-dialog-popup-${ql++}`;#r=`vjs-error-dialog-title-${ql++}`;#i=`vjs-error-dialog-desc-${ql++}`;#a=new w(this,f,_n);#o=new B(this,z);#s=null;#c=null;#l=null;#u=null;#d=new WeakSet;#f=new WeakSet;constructor(){super(),this.#e.setTitleId(this.#r),this.#e.setDescriptionId(this.#i)}connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.#s=ar({transition:I(),onOpenChange:e=>{e||this.#a.value?.dismissError()}}),this.#c?this.#c.track(this.#s.input):this.#c=new g(this,this.#s.input))}disconnectedCallback(){super.disconnectedCallback(),this.#s?.destroy(),this.#s=null}willUpdate(e){if(super.willUpdate(e),!this.#s)return;let t=this.#a.value,n=!!t?.error,{active:r}=this.#s.input.current;t?.error&&(this.#l=t.error);let i=t?.error??(r?this.#l:null);this.#p(i),!n&&!r&&(this.#l=null,this.#u=null),n&&!r?this.#s.open():!n&&r&&this.#s.close()}update(e){if(super.update(e),!this.#s)return;let t=this.#s.input.current;this.#e.setInput(t);let n=this.#e.getState();R(this,n,Da),this.#t.setValue({state:n,stateAttrMap:Da,dialog:this.#s,popupId:this.#n,popupAttrs:this.#e.getPopupAttrs(n),close:()=>this.#s?.close()})}#p(e){let t=this.#o.value,n=this.querySelector(`media-dialog-title`);n&&!this.#m(n)&&(n.textContent=A(Ua(),t));let r=this.querySelector(`media-dialog-description`);if(r&&!this.#m(r)){let n=e?Ka(e):null;n&&(this.#u=n),r.textContent=A((n??this.#u)||Ga(),t)}let i=this.querySelector(`media-dialog-close`);i&&!this.#m(i)&&(i.textContent=A(Wa(),t))}#m(e){return this.#d.has(e)||(this.#d.add(e),Jl(e)&&this.#f.add(e)),this.#f.has(e)}},Xl=class extends h{constructor(...e){super(...e),this.checked=!1,this.disabled=!1,this.#e=new C(this,{context:Zc,subscribe:!0}),this.#t=null,this.#n=!1,this.#r=null}static{this.tagName=`media-menu-checkbox-item`}static{this.properties={checked:{type:Boolean},disabled:{type:Boolean}}}#e;#t;#n;#r;connectedCallback(){super.connectedCallback(),this.#t=new AbortController,this.#n=!1}disconnectedCallback(){super.disconnectedCallback(),this.#r?.(),this.#r=null,this.#t?.abort(),this.#t=null,this.#n=!1}update(e){super.update(e);let t=this.#e.value;t&&this.#t&&(this.#n||(this.#n=!0,this.#r=t.menu.registerItem(this),L(this,{onClick:()=>{this.#e.value&&!this.disabled&&(this.checked=!this.checked,this.dispatchEvent(new CustomEvent(`checked-change`,{detail:{checked:this.checked},bubbles:!0})))},onPointerenter:()=>{let e=this.#e.value;this.disabled||e?.menu.highlight(this,{focus:!1,pointer:!0})}},{signal:this.#t.signal})),L(this,{role:`menuitemcheckbox`,"aria-checked":String(this.checked),"aria-disabled":this.disabled?`true`:void 0}))}},Zl={hint:``,disabled:!1},Ql=0,$l=class e extends h{constructor(...e){super(...e),this.open=!1,this.defaultOpen=!1,this.#e=new C(this,{context:Zc,subscribe:!0}),this.#t=new S(this,{context:Zc}),this.#n=new To,this.#r=`vjs-menu-content-${Ql++}`,this.#i=null,this.#a=null,this.#o=null,this.#s=null,this.#c=!1,this.#l=null,this.#u=null,this.#d=null,this.#f=Zl,this.#p=null,this.#m=!1,this.#h=!1,this.#b=e=>{let t=Er(e),n=e.defaultPrevented;this.#a?.contentProps.onKeyDown(e),this.#o&&(e.key===`ArrowLeft`||e.key===`Escape`)&&!n&&(e.preventDefault(),this.#a?.close(`escape`)),e.key!==`Escape`&&t&&e.stopPropagation()},this.#x=e=>{this.#a?.contentProps.onFocusOut(e)},this.#S=e=>{this.#f=e,e.disabled&&this.open&&this.#o&&this.close(`imperative-action`),this.#C(this.#v())}}static{this.tagName=`media-menu-content`}static{this.properties={open:{type:Boolean},defaultOpen:{type:Boolean,attribute:`default-open`}}}#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;#d;#f;#p;#m;#h;get context(){return this.#i}connectedCallback(){super.connectedCallback(),!this.#h&&(this.#l=new AbortController,L(this,{onKeyDown:this.#b,onFocusOut:this.#x},{signal:this.#l.signal}))}disconnectedCallback(){super.disconnectedCallback(),!this.#h&&(this.#_(),this.#l?.abort(),this.#l=null)}openMenu(e=`imperative-action`){this.#a?.open(e)}close(e=`imperative-action`){this.#a?.close(e)}willUpdate(e){super.willUpdate(e),!this.hasUpdated&&this.defaultOpen&&!this.open&&(this.open=!0),this.#c&&this.#a&&e.has(`open`)&&this.#a.syncOpen(this.open)}update(t){super.update(t);let n=this.#e.value??null;if(!n)return;this.id||=this.#r;let r=this.#v(),i=r?.closest(e.tagName)??null;if(i&&!i.context){this.hidden=!0,requestAnimationFrame(()=>this.requestUpdate());return}let a=i?.context?.menu??null,o=a!==null;(n.menu!==this.#s||a!==this.#o)&&(this.#_(),this.#s=n.menu,this.#o=a,this.#g(n,a));let s=this.#a;if(!s)return;let c=s.input.current;this.#n.setInput({...c,isSubmenu:o});let l=this.#n.getState(),u=!o||l.open||l.status===`ending`;L(this,{...this.#n.getContentAttrs(),hidden:!u}),R(this,l,Nr),r&&(s.setTriggerElement(r),L(r,this.#n.getTriggerAttrs(l,u?this.id:void 0)),this.#C(r)),o&&u&&!this.#m&&s.highlightFirstItem({preventScroll:!0}),this.#m=u,this.#i={core:this.#n,menu:s,popup:n.popup,state:l,setTriggerState:this.#S},this.#t.setValue(this.#i),n.popup.sync(),this.#y()}#g(e,t){if(t!==null){this.#c=!0,this.#a=jr({transition:I(),onOpenChange:(e,t)=>{this.dispatchEvent(new CustomEvent(`open-change`,{bubbles:!0,cancelable:!0,composed:!0,detail:{open:e,...t}}))&&(this.open=e)},closeOnEscape:()=>!0,closeOnOutsideClick:()=>!1}),this.#a.setPopupElement(this),this.#d=t.registerSubmenu(this.#a);let e=this.#l?.signal;e&&this.#a.input.subscribe(()=>this.requestUpdate(),{signal:e}),this.#a.syncOpen(this.open)}else this.#c=!1,this.#a=e.menu;this.#u=e.popup.registerContent({menu:this.#a,parent:t,element:this})}#_(){this.#u?.(),this.#u=null,this.#d?.(),this.#d=null,this.#w(),this.#c&&this.#a?.destroy(),this.#a=null,this.#i=null,this.#s=null,this.#o=null,this.#c=!1,this.#m=!1}#v(){return this.id?[...this.getRootNode().querySelectorAll(`[commandfor], media-menu-item`)].find(e=>e.getAttribute(`commandfor`)===this.id||e.commandfor===this.id)??null:null}#y(){let e=this.closest(`media-menu`);e&&this.parentElement!==e&&(this.#h=!0,e.append(this),this.#h=!1)}#b;#x;#S;#C(e){if(e!==this.#p&&(this.#w(),this.#p=e),!e)return;L(e,{"aria-disabled":this.#f.disabled||eu(e)?`true`:void 0,"data-availability":this.#f.availability});let t=e.querySelector(`[data-part~="hint"]`);t&&t.textContent!==this.#f.hint&&(t.textContent=this.#f.hint)}#w(){let e=this.#p;if(!e)return;L(e,{"aria-disabled":eu(e)?`true`:void 0,"data-availability":void 0});let t=e.querySelector(`[data-part~="hint"]`);t?.textContent&&(t.textContent=``),this.#p=null}};function eu(e){return e.hasAttribute(`disabled`)||`disabled`in e&&e.disabled===!0}var tu=class extends h{constructor(...e){super(...e),this.open=To.defaultProps.open,this.defaultOpen=To.defaultProps.defaultOpen,this.side=To.defaultProps.side,this.align=To.defaultProps.align,this.closeOnEscape=To.defaultProps.closeOnEscape,this.closeOnOutsideClick=To.defaultProps.closeOnOutsideClick,this.boundary=`container`,this.#e=new To,this.#t=new S(this,{context:Zc}),this.#n=new wl(this),this.#r=new w(this,f,gn),this.#i=new C(this,{context:n,subscribe:!0}),this.#a=new C(this,{context:dl}),this.#o=null,this.#s=null,this.#c=null,this.#l=null,this.#u=null,this.#d=null,this.#f=null,this.#m=e=>{this.#o?.contentProps.onFocusOut(e)}}static{this.tagName=`media-menu`}static{this.properties={open:{type:Boolean},defaultOpen:{type:Boolean,attribute:`default-open`},side:{type:String},align:{type:String},closeOnEscape:{type:Boolean,attribute:`close-on-escape`},closeOnOutsideClick:{type:Boolean,attribute:`close-on-outside-click`},boundary:{type:String}}}#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;#d;#f;get menu(){return this.#o}get popup(){return this.#s}connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.setAttribute(Yo,``),this.#l=new AbortController,this.#s=Pr(),this.#s.setElement(this),this.#o=jr({transition:I(),onOpenChange:(e,t)=>{this.dispatchEvent(new CustomEvent(`open-change`,{bubbles:!0,cancelable:!0,composed:!0,detail:{open:e,...t}}))&&(this.open=e)},closeOnEscape:()=>this.closeOnEscape,closeOnOutsideClick:()=>this.closeOnOutsideClick,group:()=>this.#a.value}),this.#o.setPopupElement(this),L(this,{onFocusOut:this.#m},{signal:this.#l.signal}),this.#c?this.#c.track(this.#o.input):this.#c=new g(this,this.#o.input))}disconnectedCallback(){this.#p(),super.disconnectedCallback(),this.#n.cleanup(),this.#g(),this.#s?.destroy(),this.#s=null,this.#o?.destroy(),this.#o=null,this.#l?.abort(),this.#l=null}close(e=`imperative-action`){this.#o?.close(e)}openMenu(e=`imperative-action`){this.#o?.open(e)}willUpdate(e){super.willUpdate(e),!this.hasUpdated&&this.defaultOpen&&!this.open&&(this.open=!0),this.#e.setProps({open:this.open,defaultOpen:this.defaultOpen,side:this.side,align:this.align,closeOnEscape:this.closeOnEscape,closeOnOutsideClick:this.closeOnOutsideClick}),this.#o&&e.has(`open`)&&this.#o.syncOpen(this.open)}update(e){if(super.update(e),!this.#o||!this.#s)return;let t=this.#o.input.current;this.#e.setInput({...t,isSubmenu:!1});let n=this.#e.getState();n.open?this.#f??=this.#r.value?.requestControlsLock()??null:this.#p();let r=this.#n.findTrigger();if(this.#h(r),L(this,this.#e.getPopupAttrs()),R(this,n,Mr),n.open?jt(this):Mt(this),this.#d&&L(this.#d,this.#e.getTriggerAttrs(n,this.#o.contentElement?.id)),!n.open)this.#n.cleanup();else{this.#s.sync();let e=Dr(n.side,n.align);e&&this.#d&&this.#n.sync({anchorName:this.id,position:e,trigger:this.#d,boundary:this.boundary,container:this.#i.value?.container??null,cssVars:Or,trackResize:!1,onSideChange:e=>this.setAttribute(Mr.side,e)})}this.#t.setValue({core:this.#e,menu:this.#o,popup:this.#s,state:n,setTriggerState:()=>{}})}#p(){this.#f?.(),this.#f=null}#m;#h(e){e!==this.#d&&(this.#n.cleanup(),this.#g(),this.#d=e,this.#o?.setTriggerElement(e),e&&this.#o&&(this.#u=new AbortController,L(e,this.#o.triggerProps,{signal:this.#u.signal})))}#g(){this.#d&&L(this.#d,{"aria-expanded":void 0,"aria-haspopup":void 0,"aria-controls":void 0}),this.#u?.abort(),this.#u=null,this.#d=null}},nu=class extends h{static{this.tagName=`media-menu-group`}#e=new $c(this);update(e){super.update(e),this.#e.applyProps()}},ru=0,iu=class extends h{static{this.tagName=`media-menu-group-label`}#e=new C(this,{context:Qc,subscribe:!0});#t=`vjs-menu-group-label-${ru++}`;#n=null;#r=null;disconnectedCallback(){super.disconnectedCallback(),this.#n?.(),this.#n=null,this.#r=null}update(e){super.update(e),this.id||=this.#t,this.#i()}#i(){let e=this.#e.value;if(!e){this.#n?.(),this.#n=null,this.#r=null;return}this.#r!==this.id&&(this.#n?.(),this.#r=this.id,this.#n=e.registerLabel(this.id))}},au=class extends h{constructor(...e){super(...e),this.disabled=!1,this.commandfor=void 0,this.#e=new C(this,{context:Zc,subscribe:!0}),this.#t=null,this.#n=null,this.#r=null}static{this.tagName=`media-menu-item`}static{this.properties={disabled:{type:Boolean},commandfor:{type:String}}}#e;#t;#n;#r;connectedCallback(){super.connectedCallback(),this.#t=new AbortController}disconnectedCallback(){super.disconnectedCallback(),this.#r?.(),this.#r=null,this.#n=null,this.#t?.abort(),this.#t=null}update(e){super.update(e);let t=this.#e.value;if(!t||!this.#t)return;this.#n!==t.menu&&(this.#r?.(),this.#n=t.menu,this.#r=t.menu.registerItem(this),L(this,{onClick:e=>{let t=this.#e.value;if(!t||this.#a())return;let n=this.commandfor;if(n)this.#i(n);else{let n=new CustomEvent(`select`,{bubbles:!0,cancelable:!0});if(!this.dispatchEvent(n)){e.preventDefault();return}Ar(t.menu)}e.preventDefault()},onKeyDown:e=>{if(!this.#e.value||this.#a()||e.key!==`ArrowRight`)return;let t=this.commandfor;t&&(this.#i(t),e.preventDefault())},onPointerenter:()=>{let e=this.#e.value;this.#a()||e?.menu.highlight(this,{focus:!1,pointer:!0})}},{signal:this.#t.signal}));let n=!!this.commandfor;L(this,{role:`menuitem`,"aria-disabled":this.#a()?`true`:void 0,...n&&{"aria-haspopup":`menu`,"aria-expanded":`false`,"data-has-submenu":``}})}#i(e){this.getRootNode().querySelector(`#${CSS.escape(e)}`)?.openMenu?.(`click`)}#a(){return this.disabled||this.getAttribute(`aria-disabled`)===`true`}},ou=class extends h{static{this.tagName=`media-menu-separator`}update(e){super.update(e),L(this,{role:`separator`})}},su=class extends h{constructor(...e){super(...e),this.player=new w(this,f),this.container=new C(this,{context:n,callback:()=>this.#l(),subscribe:!0}),this.#e=null,this.#t=null,this.#n=null,this.#r=null,this.#i=0,this.#a=null}get options(){return{}}#e;#t;#n;#r;#i;#a;#o(){return this.#r??={close:()=>this.core.close()}}#s(){return this.#a??this.core.state.current}connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.#a=this.core.state.current,this.#e=new AbortController,this.core.state.subscribe(()=>this.requestUpdate(),{signal:this.#e.signal}),this.transition.state.subscribe(()=>this.requestUpdate(),{signal:this.#e.signal}),this.hidden=!0,this.#l())}disconnectedCallback(){super.disconnectedCallback(),this.#t?.(),this.#n?.(),this.#t=null,this.#n=null,this.#e?.abort(),this.#e=null}destroyCallback(){this.#t?.(),this.#n?.(),this.core.destroy(),this.transition.destroy(),this.liveIndicator.remove(),super.destroyCallback()}willUpdate(e){super.willUpdate(e),this.syncCoreProps()}update(e){super.update(e),this.#c();let t=this.core.state.current,n=this.transition.state.current;if(!dr(t,n)){this.liveIndicator.remove();return}let r=fr(t,this.#s(),n);this.liveIndicator.render(r)}#c(){let e=this.core.state.current;if(e.open){if(this.#a=e,this.#i!==e.generation){this.#i=e.generation;let t=this.transition.state.current;!t.active||this.options.replayOnUpdate!==!1?this.transition.open(this.liveIndicator.element):t.status===`ending`&&this.transition.cancel()}return}let{active:t,status:n}=this.transition.state.current;t&&n!==`ending`&&this.transition.close(this.liveIndicator.element)}#l(){if(!this.container)return;this.#t?.(),this.#n?.(),this.#t=null,this.#n=null;let e=this.container.value?.container;if(!e)return;let t=_r(e),n=this.#o();this.#n=t.register(n),this.#t=hr(e,e=>{this.core.processEvent(e,mr(this.player.value))&&t.show(n)})}},cu=class{#e;#t;#n;constructor(e){this.#e=e.host,this.#t=e.dataAttrs,this.#n=e.render}get element(){return this.#e}render(e){return this.#e.hidden=!1,R(this.#e,e,this.#t),this.#n(this.#e,e),this.#e}remove(){this.#e.hidden=!0;for(let e in this.#t){let t=this.#t[e];t&&this.#e.removeAttribute(t)}}},lu=class extends su{static{this.tagName=`media-seek-indicator`}static{this.properties={closeDelay:{type:Number,attribute:`close-delay`}}}#e=new js;#t=I();#n=new cu({host:this,dataAttrs:Ms,render:uu});get core(){return this.#e}get transition(){return this.#t}get liveIndicator(){return this.#n}syncCoreProps(){this.#e.setProps({closeDelay:this.closeDelay})}};function uu(e,t){let n=e.querySelector(`media-seek-indicator-value`);n&&(n.textContent=Ds(t))}var du=class extends h{static{this.tagName=`media-seek-indicator-value`}},fu=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:X,subscribe:!0})}static{this.tagName=`media-slider-buffer`}},pu=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:X,subscribe:!0})}static{this.tagName=`media-slider-fill`}},mu=class extends h{constructor(...e){super(...e),this.overflow=`clamp`,this.#e=new C(this,{context:X,subscribe:!0}),this.#t=null,this.#n=0}static{this.tagName=`media-slider-preview`}static{this.properties={overflow:{type:String}}}#e;#t;#n;connectedCallback(){super.connectedCallback(),this.#t=wt(this,([e])=>{this.#n=e.contentRect.width,this.#r()})}disconnectedCallback(){super.disconnectedCallback(),this.#t?.(),this.#t=null}#r(){D(this,ai(this.#n,this.overflow))}update(e){super.update(e);let t=this.#e.value;t&&R(this,t.state,t.stateAttrMap),this.#r()}},hu=class extends h{static{this.tagName=`media-slider-thumb`}#e=new C(this,{context:X,subscribe:!0});#t=null;#n=!1;connectedCallback(){super.connectedCallback(),this.#t=new AbortController,this.#n=!1}disconnectedCallback(){super.disconnectedCallback(),this.#t?.abort(),this.#t=null,this.#n=!1}update(e){super.update(e);let t=this.#e.value;t&&(!this.#n&&this.#t&&(L(this,t.thumbProps,{signal:this.#t.signal}),this.#n=!0),L(this,t.thumbAttrs),R(this,t.state,t.stateAttrMap))}},gu=`:host {
  display: inline-block;
  overflow: hidden;
}
img {
  display: block;
}`,_u=class extends h{static{this.tagName=`media-thumbnail`}static{this.properties={time:{type:Number},crossOrigin:{type:String,attribute:`crossorigin`},loading:{type:String},fetchPriority:{type:String,attribute:`fetchpriority`}}}#e;#t;#n;#r;#i;#a;#o;constructor(){super(),this.time=0,this.#e=new fi,this.#t=document.createElement(`img`),this.#n=new w(this,f,En),this.#r=[],this.#o=null;let e=this.attachShadow({mode:`open`}),t=document.createElement(`style`);t.textContent=gu,e.appendChild(t),this.#t.alt=``,this.#t.setAttribute(`part`,`img`),this.#t.setAttribute(`aria-hidden`,`true`),this.#t.setAttribute(`decoding`,`async`),e.appendChild(this.#t)}get thumbnails(){return this.#i}set thumbnails(e){this.#i=e,this.requestUpdate()}connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.#o=pi({getContainer:()=>this,getImg:()=>this.#t,onStateChange:()=>this.requestUpdate()}))}disconnectedCallback(){super.disconnectedCallback()}destroyCallback(){this.#o?.destroy(),super.destroyCallback()}update(e){super.update(e);let t=this.#n.value;this.#i?this.#r=this.#i:t!==this.#a&&(this.#a=t,this.#r=t&&t.thumbnailCues.length>0?nc(t.thumbnailCues,t.thumbnailTrackSrc??void 0):[]);let n=this.#e.findActiveThumbnail(this.#r,this.time);if(L(this.#t,{crossorigin:this.#s(t),loading:this.loading,fetchpriority:this.fetchPriority}),this.#o?.updateSrc(n?.url),!n){this.#t.removeAttribute(`src`),this.#l();let e=this.#e.getState(!1,!1,void 0);L(this,this.#e.getAttrs(e)),R(this,e,ec);return}this.#t.getAttribute(`src`)!==n.url&&(this.#t.src=n.url);let r=this.#o,i=this.#e.getState(r?.loading??!1,r?.error??!1,n);if(L(this,this.#e.getAttrs(i)),R(this,i,ec),r?.naturalWidth&&r.naturalHeight){let e=r.readConstraints(),t=this.#e.resize(n,r.naturalWidth,r.naturalHeight,e);t&&this.#c(t)}}#s(e){if(!o(this.crossOrigin)){if(!c(this.crossOrigin))return this.crossOrigin;if(!this.#i)return e?.thumbnailTrackCrossOrigin??void 0}}#c(e){this.style.width=`${e.containerWidth}px`,this.style.height=`${e.containerHeight}px`;let t=this.#t.style;t.width=`${e.imageWidth}px`,t.height=`${e.imageHeight}px`,t.maxWidth=`none`,t.transform=e.offsetX||e.offsetY?`translate(-${e.offsetX}px, -${e.offsetY}px)`:``}#l(){this.style.width=``,this.style.height=``;let e=this.#t.style;e.width=``,e.height=``,e.maxWidth=``,e.transform=``}},vu=class extends _u{static{this.tagName=`media-slider-thumbnail`}#e=new C(this,{context:X,subscribe:!0});update(e){let t=this.#e.value;t&&(this.time=t.pointerValue),super.update(e)}},yu=class extends Z{constructor(...e){super(...e),this.consumer=new C(this,{context:X,subscribe:!0})}static{this.tagName=`media-slider-track`}},bu=class extends h{constructor(...e){super(...e),this.type=`current`,this.#e=new C(this,{context:X,subscribe:!0})}static{this.tagName=`media-slider-value`}static{this.properties={type:{type:String}}}#e;connectedCallback(){super.connectedCallback(),this.setAttribute(`aria-live`,`off`)}update(e){super.update(e);let t=this.#e.value;if(!t)return;let n=this.type===`pointer`?t.pointerValue:t.state.value;this.textContent=t.formatValue?t.formatValue(n,this.type):String(Math.round(n)),R(this,t.state,t.stateAttrMap)}},xu=class extends h{static{this.tagName=`media-status-announcer`}static{this.properties={closeDelay:{type:Number,attribute:`close-delay`}}}#e=new B(this,z);#t=new Js;#n=null;#r=new C(this,{context:f,callback:e=>this.#s(e),subscribe:!0});#i=new C(this,{context:n,subscribe:!0});#a=null;#o=null;connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.setAttribute(`role`,`status`),this.#c(),this.#a=new AbortController,this.#t.state.subscribe(()=>this.requestUpdate(),{signal:this.#a.signal}),this.#s())}disconnectedCallback(){super.disconnectedCallback(),this.#n?.(),this.#n=null,this.#a?.abort(),this.#a=null}destroyCallback(){this.#n?.(),this.#t.destroy(),super.destroyCallback()}willUpdate(e){super.willUpdate(e),this.#t.setProps({closeDelay:this.closeDelay,labels:Ls(this.#e.value,this.#e.locale),shouldAnnounce:()=>ci(this.#i.value?.container)})}update(e){super.update(e);let t=this.#t.state.current.label,n=this.#c();t===null?n.replaceChildren():n.replaceChildren(document.createTextNode(t))}#s(e=this.#r.value){if(this.#n?.(),this.#n=null,!e){this.#t.resetSnapshot();return}this.#n=si(e,this.#t)}#c(){if(this.#o?.isConnected)return this.#o;let e=this.querySelector(`[data-status-announcer-content]`);return this.#o=e??document.createElement(`span`),this.#o.setAttribute(`data-status-announcer-content`,``),e||this.append(this.#o),this.#o}},Su=class extends su{static{this.tagName=`media-status-indicator`}static{this.properties={actions:{type:String},closeDelay:{type:Number,attribute:`close-delay`}}}#e=new B(this,z);#t=new Qs;#n=I();#r=new cu({host:this,dataAttrs:$s,render:wu});#i={replayOnUpdate:!1};get core(){return this.#t}get transition(){return this.#n}get liveIndicator(){return this.#r}get options(){return this.#i}syncCoreProps(){this.#t.setProps({actions:Cu(this.actions),closeDelay:this.closeDelay,labels:po(this.#e.value)})}};function Cu(e){return e?.split(/[\s,]+/).filter(Boolean)}function wu(e,t){let n=e.querySelector(`media-status-indicator-value`);n&&(n.textContent=Xs(t))}var Tu=class extends h{static{this.tagName=`media-status-indicator-value`}},Eu=class extends h{constructor(...e){super(...e),this.type=vc.defaultProps.type,this.negativeSign=vc.defaultProps.negativeSign,this.label=``,this.toggle=vc.defaultProps.toggle,this.#e=new vc,this.#t=new w(this,f,M),this.#n=new B(this,z),this.#r=document.createElement(`span`),this.#i=new Text,this.#a=null,this.#o=!1,this.#s=vc.defaultProps.type,this.#l=e=>{!e.defaultPrevented&&this.toggle&&this.#t.value&&this.#d()},this.#u=e=>{!e.defaultPrevented&&_(e)&&this.toggle&&this.#t.value&&(e.preventDefault(),!e.repeat&&this.#d())}}static{this.tagName=`media-time`}static{this.properties={type:{type:String},negativeSign:{type:String,attribute:`negative-sign`},label:{type:String},toggle:{type:Boolean}}}#e;#t;#n;#r;#i;#a;#o;#s;connectedCallback(){super.connectedCallback(),this.#a=new AbortController,this.#f(),this.#r.parentNode||(this.#r.setAttribute(`aria-hidden`,`true`),this.#r.hidden=!0,this.append(this.#r,this.#i))}disconnectedCallback(){super.disconnectedCallback(),this.#a?.abort(),this.#a=null,this.#o=!1}willUpdate(e){super.willUpdate(e),(e.has(`type`)||e.has(`toggle`))&&(this.#s=this.type)}update(e){super.update(e),e.has(`toggle`)&&this.#f();let t=this.#t.value;if(!t){this.#p();return}this.#e.setProps({type:this.toggle?this.#s:this.type,negativeSign:this.negativeSign,label:this.label,toggle:this.toggle}),this.#e.setMedia(t),this.#e.setFormatLocale(this.#n.locale);let n=this.#e.getState();this.#r.hidden=!n.negative,this.#r.textContent=n.negative?this.negativeSign:``,this.#i.textContent=n.text;let r=this.#e.getAttrs(n,this.type),i=A(r[`aria-label`],this.#n.value,this.#c(n)),a=r[`aria-description`]?A(r[`aria-description`],this.#n.value):void 0;L(this,{"aria-label":i,"aria-description":a,role:this.toggle?r.role:`time`,tabIndex:r.tabIndex,datetime:this.toggle?void 0:n.datetime}),R(this,n,yc)}#c(e){if(!this.#e.getLabelParams(e))return;let t=ws(Math.abs(e.seconds),{locale:this.#n.locale}),n={current:oc,duration:sc,remaining:cc}[e.type];return{duration:A(n,this.#n.value,{duration:t})}}#l;#u;#d(){this.#s=this.type===`current`?this.#s===`remaining`?`current`:`remaining`:this.#s===`duration`?`remaining`:`duration`,this.requestUpdate()}#f(){!this.toggle||!this.#a||this.#o||(this.#o=!0,L(this,{onClick:this.#l,onKeyDown:this.#u},{signal:this.#a.signal}))}#p(){L(this,{"aria-label":void 0,"aria-description":void 0,role:void 0,tabIndex:void 0,datetime:void 0,"data-type":void 0})}},Du=class extends h{static{this.tagName=`media-time-group`}},Ou=class extends h{static{this.tagName=`media-time-separator`}connectedCallback(){super.connectedCallback(),this.setAttribute(`aria-hidden`,`true`),this.textContent?.trim()||(this.textContent=`/`)}},ku=class extends h{constructor(...e){super(...e),this.label=``,this.changeThrottle=xc.defaultProps.changeThrottle,this.step=xc.defaultProps.step,this.largeStep=xc.defaultProps.largeStep,this.orientation=xc.defaultProps.orientation,this.disabled=xc.defaultProps.disabled,this.thumbAlignment=xc.defaultProps.thumbAlignment,this.pauseOnDrag=xc.defaultProps.pauseOnDrag,this.#e=new xc,this.#t=new w(this,f,gn),this.#n=new S(this,{context:X}),this.#r=new w(this,f,M),this.#i=new w(this,f,hn),this.#a=new w(this,f,Sn),this.#o=new B(this,z),this.#s=null,this.#c=null,this.#l=null}static{this.tagName=`media-time-slider`}static{this.properties={label:{type:String},changeThrottle:{type:Number,attribute:`change-throttle`},step:{type:Number},largeStep:{type:Number,attribute:`large-step`},orientation:{type:String},disabled:{type:Boolean},thumbAlignment:{type:String,attribute:`thumb-alignment`},pauseOnDrag:{type:Boolean,attribute:`pause-on-drag`}}}#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;connectedCallback(){if(super.connectedCallback(),this.destroyed)return;this.#c=new AbortController;let e=this.#c.signal;this.#s=ti({getElement:()=>this,getThumbElement:()=>this.querySelector(`media-slider-thumb`),getOrientation:()=>this.orientation,isDisabled:()=>this.disabled||!this.#r.value,getPercent:()=>{let e=this.#r.value;return e?this.#e.percentFromValue(e.currentTime):0},getStepPercent:()=>this.#e.getStepPercent(),getLargeStepPercent:()=>this.#e.getLargeStepPercent(),onValueCommit:e=>{let t=this.#r.value;t&&t.seek(this.#e.rawValueFromPercent(e))},changeThrottle:this.changeThrottle,onDragStart:()=>{this.#l??=this.#t.value?.requestControlsLock()??null,this.#e.startDrag(this.#a.value),this.dispatchEvent(new CustomEvent(`drag-start`,{bubbles:!0}))},onDragEnd:()=>{this.#d(),this.#e.endDrag(this.#a.value),this.dispatchEvent(new CustomEvent(`drag-end`,{bubbles:!0}))},adjustPercent:(e,t,n)=>this.#e.adjustPercentForAlignment(e,t,n),onResize:()=>this.requestUpdate()}),L(this,this.#s.rootProps,{signal:e}),D(this,this.#s.rootStyle),this.#s.input.subscribe(()=>this.requestUpdate(),{signal:e})}disconnectedCallback(){this.#d(),this.#u(),super.disconnectedCallback(),this.#c?.abort(),this.#c=null}destroyCallback(){this.#d(),this.#u(),this.#s?.destroy(),super.destroyCallback()}#u(){this.#e.endDrag(this.#a.value)}#d(){this.#l?.(),this.#l=null}willUpdate(e){super.willUpdate(e),this.#e.setProps({label:this.label,changeThrottle:this.changeThrottle,step:this.step,largeStep:this.largeStep,orientation:this.orientation,disabled:this.disabled,thumbAlignment:this.thumbAlignment,pauseOnDrag:this.pauseOnDrag}),this.#e.setFormatLocale(this.#o.locale)}update(e){if(super.update(e),!this.#s)return;let t=this.#r.value,n=this.#i.value;if(!t)return;this.#e.setInput(this.#s.input.current);let r={...t,...n??{buffered:[],seekable:[]}};this.#e.setMedia(r);let i=this.#e.getState(),a=ii(this.#s.adjustForAlignment(i)),o=this.#e.getAttrs(i);D(this,a),R(this,i,Sc),this.#n.setValue({state:i,stateAttrMap:Sc,pointerValue:this.#e.rawValueFromPercent(i.pointerPercent),thumbAttrs:{...o,"aria-label":A(o[`aria-label`],this.#o.value),"aria-valuetext":A(o[`aria-valuetext`],this.#o.value,this.#e.getValueTextParams(i))},thumbProps:this.#s.thumbProps,formatValue:e=>Ss(e,i.duration,{locale:this.#o.locale})})}};function Au(e){return Array.from(e.childNodes).some(e=>!!e.textContent?.trim())}var ju=class e extends h{static{this.tagName=`media-tooltip-label`}#e=!1;static findIn(t){return t.querySelector(e.tagName)}static create(){return document.createElement(e.tagName)}connectedCallback(){this.#e||=Au(this),super.connectedCallback()}setSyncedText(e){this.#e||(this.textContent=e)}},Mu=class e extends h{static{this.tagName=`media-tooltip-shortcut`}static findIn(t){return t.querySelector(e.tagName)}static create(){return document.createElement(e.tagName)}setSyncedShortcut(e){e?(this.textContent=e,this.hidden=!1):(this.textContent=``,this.hidden=!0)}},Nu=i(Symbol(`@videojs/tooltip-group`));function Pu(e){return`$state`in e}var Fu=class extends h{constructor(...e){super(...e),this.open=J.defaultProps.open,this.defaultOpen=J.defaultProps.defaultOpen,this.side=J.defaultProps.side,this.align=J.defaultProps.align,this.delay=J.defaultProps.delay,this.closeDelay=J.defaultProps.closeDelay,this.disableHoverablePopup=J.defaultProps.disableHoverablePopup,this.disabled=J.defaultProps.disabled,this.sticky=J.defaultProps.sticky,this.boundary=`container`,this.trigger=``,this.#e=new J,this.#t=new B(this,z),this.#n=new C(this,{context:Nu}),this.#r=new C(this,{context:n,subscribe:!0}),this.#i=new C(this,{context:dl}),this.#a=new wl(this),this.#o=null,this.#s=null,this.#c=null,this.#l=null,this.#u=null}static{this.tagName=`media-tooltip`}static{this.properties={open:{type:Boolean},defaultOpen:{type:Boolean,attribute:`default-open`},side:{type:String},align:{type:String},delay:{type:Number},closeDelay:{type:Number,attribute:`close-delay`},disableHoverablePopup:{type:Boolean,attribute:`disable-hoverable-popup`},disabled:{type:Boolean},sticky:{type:Boolean},boundary:{type:String},trigger:{type:String}}}#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;connectedCallback(){super.connectedCallback(),!this.destroyed&&(this.setAttribute(Yo,``),this.#c=new AbortController,this.#o=hi({transition:I(),onOpenChange:(e,t)=>{this.open=e,this.dispatchEvent(new CustomEvent(`open-change`,{detail:{open:e,...t}}))},delay:()=>this.delay,closeDelay:()=>this.closeDelay,disableHoverablePopup:()=>this.disableHoverablePopup,disabled:()=>this.disabled,sticky:()=>this.sticky,group:()=>this.#n.value,popupGroup:()=>this.#i.value}),this.#o.setPopupElement(this),L(this,this.#o.popupProps,{signal:this.#c.signal}),this.#s?this.#s.track(this.#o.input):this.#s=new g(this,this.#o.input))}firstUpdated(e){super.firstUpdated(e),this.defaultOpen&&!this.open&&this.#o?.open()}disconnectedCallback(){super.disconnectedCallback(),this.#m(),this.#o?.destroy(),this.#o=null,this.#c?.abort(),this.#c=null}close(e=`imperative-action`){this.#o?.close(e)}willUpdate(e){if(super.willUpdate(e),this.#e.setProps(this),this.#o&&e.has(`open`)){let{active:e}=this.#o.input.current;this.open!==e&&(this.open?this.#o.open():this.#o.close())}}update(e){if(super.update(e),!this.#o)return;let t=this.#a.findTrigger(this.trigger);this.#d(t),this.#u&&Pu(this.#u)&&this.#f(this.#u);let n=this.#o.input.current;this.#e.setInput(n);let r=this.#e.getState();if(L(this,this.#e.getPopupAttrs(r)),R(this,r,Ac),r.open?jt(this):Mt(this),!r.open){this.#a.cleanup();return}this.#a.sync({anchorName:this.id,position:{side:r.side,align:r.align},trigger:this.#u,boundary:this.boundary,container:this.#r.value?.container??null,cssVars:Mc,onSideChange:e=>this.setAttribute(Ac.side,e)})}#d(e){e!==this.#u&&(this.#a.cleanup(),this.#m(),this.#u=e,this.#o?.setTriggerElement(e),e&&this.#o&&(this.#l=new AbortController,L(e,this.#o.triggerProps,{signal:this.#l.signal}),Pu(e)&&(this.#f(e),e.$state.subscribe(()=>this.#f(e),{signal:this.#l.signal}),E(e,$n,()=>this.#f(e),{signal:this.#l.signal}))))}#f(e){let t=e.getLabel(),n=u(e.getResolvedLabel)?e.getResolvedLabel():void 0;n===void 0&&t&&(n=A(t,this.#t.value));let r=e.getShortcut?.(),i=ju.findIn(this),a=Mu.findIn(this);if(!i&&!a){if(this.#p())return;i=ju.create(),a=Mu.create(),this.replaceChildren(i,a)}i?.setSyncedText(n??``),a?.setSyncedShortcut(r)}#p(){return Array.from(this.childNodes).some(e=>!!e.textContent?.trim())}#m(){this.#l?.abort(),this.#l=null,this.#u=null}},Iu=class extends h{constructor(...e){super(...e),this.delay=jc.defaultProps.delay,this.closeDelay=jc.defaultProps.closeDelay,this.timeout=jc.defaultProps.timeout,this.#e=new jc,this.#t=new S(this,{context:Nu,initialValue:this.#e})}static{this.tagName=`media-tooltip-group`}static{this.properties={delay:{type:Number},closeDelay:{type:Number,attribute:`close-delay`},timeout:{type:Number}}}#e;#t;update(e){super.update(e),this.#e.setProps(this),this.#t.setValue(this.#e)}},Lu=class extends su{static{this.tagName=`media-volume-indicator`}static{this.properties={closeDelay:{type:Number,attribute:`close-delay`}}}#e=new B(this,z);#t=new Fc;#n=I();#r=new cu({host:this,dataAttrs:Lc,render:Ru});#i={replayOnUpdate:!1};get core(){return this.#t}get transition(){return this.#n}get liveIndicator(){return this.#r}get options(){return this.#i}syncCoreProps(){this.#t.setProps({closeDelay:this.closeDelay,labels:po(this.#e.value)})}};function Ru(e,t){let n=e.querySelector(`media-volume-indicator-fill`),r=e.querySelector(`media-volume-indicator-value`);t.fill?n?.style.setProperty(Rc.fill,t.fill):n?.style.removeProperty(Rc.fill),r&&(r.textContent=Vs(t))}var zu=class extends h{static{this.tagName=`media-volume-indicator-fill`}},Bu=class extends h{static{this.tagName=`media-volume-indicator-value`}},Vu=class extends h{constructor(...e){super(...e),this.label=``,this.step=Wc.defaultProps.step,this.largeStep=Wc.defaultProps.largeStep,this.wheelStep=Wc.defaultProps.wheelStep,this.orientation=Wc.defaultProps.orientation,this.disabled=Wc.defaultProps.disabled,this.thumbAlignment=Wc.defaultProps.thumbAlignment,this.#e=new Wc,this.#t=new w(this,f,gn),this.#n=new S(this,{context:X}),this.#r=new w(this,f,Dn),this.#i=new B(this,z),this.#a=null,this.#o=null,this.#s=null}static{this.tagName=`media-volume-slider`}static{this.properties={label:{type:String},step:{type:Number},largeStep:{type:Number,attribute:`large-step`},wheelStep:{type:Number,attribute:`wheel-step`},orientation:{type:String},disabled:{type:Boolean},thumbAlignment:{type:String,attribute:`thumb-alignment`}}}#e;#t;#n;#r;#i;#a;#o;#s;connectedCallback(){if(super.connectedCallback(),this.destroyed)return;this.#o=new AbortController;let e=this.#o.signal,t=()=>{let e=this.#r.value;return this.disabled||!e||e.volumeAvailability!==`available`},n=()=>(this.#r.value?.volume??0)*100,r=()=>this.#e.getStepPercent(),i=e=>this.#l(e);this.#a=ti({getElement:()=>this,getThumbElement:()=>this.querySelector(`media-slider-thumb`),getOrientation:()=>this.orientation,isDisabled:t,getPercent:n,getStepPercent:r,getLargeStepPercent:()=>this.#e.getLargeStepPercent(),onValueChange:i,onValueCommit:i,onDragStart:()=>{this.#s??=this.#t.value?.requestControlsLock()??null,this.dispatchEvent(new CustomEvent(`drag-start`,{bubbles:!0}))},onDragEnd:()=>{this.#c(),this.dispatchEvent(new CustomEvent(`drag-end`,{bubbles:!0}))},adjustPercent:(e,t,n)=>this.#e.adjustPercentForAlignment(e,t,n),onResize:()=>this.requestUpdate()});let a=bi({isDisabled:t,getPercent:n,getStepPercent:()=>this.#e.getWheelStepPercent(),onValueChange:i});L(this,this.#a.rootProps,{signal:e}),L(this,a,{signal:e}),D(this,this.#a.rootStyle),this.#a.input.subscribe(()=>this.requestUpdate(),{signal:e})}disconnectedCallback(){this.#c(),super.disconnectedCallback(),this.#o?.abort(),this.#o=null}destroyCallback(){this.#c(),this.#a?.destroy(),super.destroyCallback()}#c(){this.#s?.(),this.#s=null}willUpdate(e){super.willUpdate(e),this.#e.setProps(this),this.#e.setFormatLocale(this.#i.locale)}update(e){if(super.update(e),!this.#a)return;let t=this.#r.value;if(!t)return;this.#e.setInput(this.#a.input.current),this.#e.setMedia(t);let n=this.#e.getState(),r=ri(this.#a.adjustForAlignment(n)),i=this.#e.getAttrs(n);D(this,r),R(this,n,Gc),L(this,{hidden:n.hidden?``:void 0}),this.#n.setValue({state:n,stateAttrMap:Gc,pointerValue:this.#e.valueFromPercent(n.pointerPercent),thumbAttrs:{...i,"aria-label":A(i[`aria-label`],this.#i.value),"aria-valuetext":A(i[`aria-valuetext`],this.#i.value,this.#e.getValueTextParams(n))},thumbProps:this.#a.thumbProps,formatValue:e=>`${Math.round(e)}%`})}#l(e){this.#r.value?.setVolume(this.#e.valueFromPercent(e)/100)}};function Hu(){t(tu),t($l),t(au),t(iu),t(ou),t(nu),t(Y),t(el),t(Xl),t(nl)}function Uu(){t(Bl),t(Rl),t(zl),t(Vl)}function Wu(){t(Hl),t(Gl),t(Ul),t(Wl),t(Kl)}function Gu(){t(Yl),Wu()}function Ku(){t(xu),t(Su),t(Tu),t(Lu),t(zu),t(Bu),t(lu),t(du)}function qu(){t(pu),t(mu),t(hu),t(yu),t(bu)}function Ju(){t(Eu),t(Du),t(Ou)}function Yu(){t(Iu),t(ju),t(Mu),t(Fu)}function Xu(){t(ku),t(Vu),qu(),t(fu),t(vu)}t(pl),t(Oi),Uu(),Gu(),Ku(),Xu(),t(Fl),t(Pl),Ju(),Hu(),Yu(),t(Kc),t(il),t(al),t(cl),t(ul),t(ml),t(hl),t(gl),t(_l),t(vl),t(yl),t(bl),t(xl),t(Sl),t(ll),t(El),t(jl),t(Ml),t(Nl),t(ji);function Q(e,t){let n=Object.entries(t??{}).map(([e,t])=>` ${e}="${je(t)}"`).join(``);return`<media-text token="${je(e.key)}"${n}>${je(e.text)}</media-text>`}var Zu=`video-player, live-video-player, media-i18n, media-dialog, media-alert-dialog, media-error-dialog, media-controls {
  display: contents;
}

media-container video, media-container [slot="poster"] {
  width: 100%;
  height: 100%;
  display: block;
}

media-container video::-webkit-media-text-track-container {
  z-index: 1;
  scale: .98;
  translate: 0 var(--media-caption-track-y, 0);
  transition: translate var(--media-caption-track-duration, 0) ease-out;
  transition-delay: var(--media-caption-track-delay, 0);
  font-family: inherit;
}
`,Qu=`media-tooltip-group, media-dialog, media-alert-dialog, media-error-dialog, media-controls {
  display: contents;
}

:host {
  width: 100%;
  display: grid;
}

media-container {
  min-width: 0;
  min-height: 0;
}

.media-popover--volume:has(media-volume-slider[data-hidden]) {
  display: none;
}
`,$u=`__media-styles`,ed=Lt(Qu),td=class extends y{static{this.shadowRootOptions={mode:`open`}}constructor(){if(super(),Pt($u,Zu),!this.shadowRoot){let e=this.constructor;this.attachShadow(e.shadowRootOptions),e.template&&Ut(this.shadowRoot,e.template);let t=[ed];e.styles&&t.push(e.styles),Rt(this.shadowRoot,t)}}},nd={"airplay-enter":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5v5l-.005.18a3.5 3.5 0 0 1-3.027 3.288L13 12h1.5a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 14.5 4h-11A1.5 1.5 0 0 0 2 5.5v5A1.5 1.5 0 0 0 3.5 12H5l-1.968 1.967A3.5 3.5 0 0 1 0 10.5v-5A3.5 3.5 0 0 1 3.5 2z"/><path d="M8.631 10.902a.5.5 0 0 1 .738 0l4.363 4.76a.5.5 0 0 1-.369.838H4.637a.5.5 0 0 1-.369-.838z"/></svg>`,"airplay-exit":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><style>@keyframes media-icon-airplay-triangle{0%{translate:0 0}to{translate:0-2px}}@keyframes media-icon-airplay-fill{0%{opacity:0}to{opacity:.2}}@media (prefers-reduced-motion:reduce){:root{--media-icon-airplay-fill-animation:none;--media-icon-airplay-triangle-animation:none}}</style><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5v5a3.5 3.5 0 0 1-3.032 3.468L9.354 8.354a.5.5 0 0 0-.708 0l-5.615 5.614A3.5 3.5 0 0 1 0 10.5v-5A3.5 3.5 0 0 1 3.5 2z" style="animation:var(--media-icon-airplay-fill-animation, media-icon-airplay-fill 1s ease-in-out infinite alternate)"/><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5v5l-.005.18a3.5 3.5 0 0 1-3.027 3.288L13 12h1.5a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 14.5 4h-11A1.5 1.5 0 0 0 2 5.5v5A1.5 1.5 0 0 0 3.5 12H5l-1.968 1.967A3.5 3.5 0 0 1 0 10.5v-5A3.5 3.5 0 0 1 3.5 2z"/><path d="M8.631 10.902a.5.5 0 0 1 .738 0l4.363 4.76a.5.5 0 0 1-.369.838H4.637a.5.5 0 0 1-.369-.838z" style="animation:var(--media-icon-airplay-triangle-animation, media-icon-airplay-triangle 1s ease-in-out infinite alternate)"/></svg>`,"captions-off":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" aria-hidden="true" viewBox="0 0 18 18"><rect width="16" height="12" x="1" y="3" stroke="currentColor" stroke-width="2" rx="3"/><rect width="3" height="2" x="3" y="8" fill="currentColor" fill-opacity=".5" rx="1"/><rect width="2" height="2" x="13" y="8" fill="currentColor" fill-opacity=".5" rx="1"/><rect width="4" height="2" x="11" y="11" fill="currentColor" fill-opacity=".5" rx="1"/><rect width="5" height="2" x="7" y="8" fill="currentColor" fill-opacity=".5" rx="1"/><rect width="7" height="2" x="3" y="11" fill="currentColor" fill-opacity=".5" rx="1"/></svg>`,"captions-on":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M15 2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM4 11a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zM4 8a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm4 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>`,"cast-enter":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5v7l-.005.18a3.5 3.5 0 0 1-3.315 3.315L14.5 16h-7c0-.693-.096-1.363-.271-2H14.5a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 4h-11A1.5 1.5 0 0 0 2 5.5v3.271A7.5 7.5 0 0 0 0 8.5v-3A3.5 3.5 0 0 1 3.5 2zM0 12a4 4 0 0 1 4 4H2.5A2.5 2.5 0 0 0 0 13.5z"/><path d="M0 9.5A6.5 6.5 0 0 1 6.5 16H5a5 5 0 0 0-5-5zm0 5A1.5 1.5 0 0 1 1.5 16h-1a.5.5 0 0 1-.5-.5z"/></svg>`,"cast-exit":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M14.5 2A3.5 3.5 0 0 1 18 5.5v7a3.5 3.5 0 0 1-3.5 3.5h-7c0-.693-.096-1.363-.271-2H14.5a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 4h-11A1.5 1.5 0 0 0 2 5.5v3.271A7.5 7.5 0 0 0 0 8.5v-3A3.5 3.5 0 0 1 3.5 2z"/><path d="M13.5 5.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H6.634A7.53 7.53 0 0 0 3.5 9.366V6.5a1 1 0 0 1 1-1zM0 12a4 4 0 0 1 4 4H2.5A2.5 2.5 0 0 0 0 13.5z"/><path d="M0 9.5A6.5 6.5 0 0 1 6.5 16H5a5 5 0 0 0-5-5zm0 5A1.5 1.5 0 0 1 1.5 16h-1a.5.5 0 0 1-.5-.5z"/></svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" aria-hidden="true" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10.455 6.5 13 14 5"/></svg>`,chevron:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" aria-hidden="true" viewBox="0 0 18 18"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m11.964 9.014-4.95-4.95m0 9.9 4.95-4.95"/></svg>`,"fullscreen-enter":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M9.57 3.617A1 1 0 0 0 8.646 3H4c-.552 0-1 .449-1 1v4.646a.996.996 0 0 0 1.001 1 1 1 0 0 0 .706-.293l4.647-4.647a1 1 0 0 0 .216-1.089m4.812 4.812a1 1 0 0 0-1.089.217l-4.647 4.647a.998.998 0 0 0 .708 1.706H14c.552 0 1-.449 1-1V9.353a1 1 0 0 0-.618-.924"/></svg>`,"fullscreen-exit":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M7.883 1.93a.99.99 0 0 0-1.09.217L2.146 6.793A.998.998 0 0 0 2.853 8.5H7.5c.551 0 1-.449 1-1V2.854a1 1 0 0 0-.617-.924m7.263 7.57H10.5c-.551 0-1 .449-1 1v4.646a.996.996 0 0 0 1.001 1.001 1 1 0 0 0 .706-.293l4.646-4.646a.998.998 0 0 0-.707-1.707z"/></svg>`,gear:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M7.519 2.184c.357-1.578 2.605-1.579 2.962 0a1.518 1.518 0 0 0 2.292.949c1.368-.864 2.957.727 2.094 2.096-.56.886-.074 2.06.949 2.292 1.579.356 1.578 2.606 0 2.962a1.52 1.52 0 0 0-.95 2.293c.864 1.369-.725 2.96-2.093 2.095a1.52 1.52 0 0 0-2.292.95c-.357 1.578-2.606 1.578-2.962 0a1.52 1.52 0 0 0-2.292-.95c-1.368.864-2.957-.726-2.094-2.095a1.52 1.52 0 0 0-.949-2.293c-1.579-.356-1.579-2.606 0-2.962a1.52 1.52 0 0 0 .95-2.292c-.864-1.369.725-2.96 2.093-2.096.887.56 2.061.074 2.292-.95m1.48 3.474a3.343 3.343 0 1 0 .002 6.687 3.343 3.343 0 0 0-.002-6.687"/></svg>`,pause:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><rect width="5" height="14" x="2" y="2" rx="1.75"/><rect width="5" height="14" x="11" y="2" rx="1.75"/></svg>`,"pip-enter":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M13 2a4 4 0 0 1 4 4v2.036A3.5 3.5 0 0 0 16.5 8H15V6.273C15 5.018 13.96 4 12.679 4H4.32C3.04 4 2 5.018 2 6.273v5.454C2 12.982 3.04 14 4.321 14H6v1.5q0 .255.036.5H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"/><rect width="10" height="7" x="8" y="10" rx="2"/><path d="M7.129 5.547a.6.6 0 0 0-.656.13L3.677 8.473A.6.6 0 0 0 4.102 9.5h2.796c.332 0 .602-.27.602-.602V6.103a.6.6 0 0 0-.371-.556"/></svg>`,"pip-exit":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M13 2a4 4 0 0 1 4 4v2.036A3.5 3.5 0 0 0 16.5 8H15V6.273C15 5.018 13.96 4 12.679 4H4.32C3.04 4 2 5.018 2 6.273v5.454C2 12.982 3.04 14 4.321 14H6v1.5q0 .255.036.5H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"/><rect width="10" height="7" x="8" y="10" rx="2"/><path d="M4.871 10.454a.6.6 0 0 0 .656-.131l2.796-2.796A.6.6 0 0 0 7.898 6.5H5.102a.603.603 0 0 0-.602.602v2.795a.6.6 0 0 0 .371.556"/></svg>`,play:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="m14.051 10.723-7.985 4.964a1.98 1.98 0 0 1-2.758-.638A2.06 2.06 0 0 1 3 13.964V4.036C3 2.91 3.895 2 5 2c.377 0 .747.109 1.066.313l7.985 4.964a2.057 2.057 0 0 1 .627 2.808c-.16.257-.373.475-.627.637"/></svg>`,quality:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M11 3c2.828 0 4.243 0 5.121.878.879.879.88 2.294.88 5.122 0 2.829-.001 4.243-.88 5.121-.878.879-2.293.88-5.12.88H7c-2.83 0-4.243-.001-5.122-.88C1 13.243 1 11.828 1 9.001c0-2.83 0-4.244.879-5.123C2.758 3 4.172 3 7 3zM3.25 6v6h1.556V9.564h2.45V12h1.556V6H7.256v2.331h-2.45v-2.33zm6.396 6h2.39q.99 0 1.71-.367a2.65 2.65 0 0 0 1.11-1.043q.393-.672.394-1.59 0-.918-.397-1.59a2.65 2.65 0 0 0-1.116-1.04Q13.017 6 12.035 6h-2.39zm2.294-4.792q.89 0 1.318.455.428.452.428 1.337 0 .886-.424 1.341-.42.45-1.305.451h-.756V7.208z"/></svg>`,restart:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M9 1a7.98 7.98 0 0 0-6.132 2.867l-1.441-1.44A.25.25 0 0 0 1 2.604V6.75c0 .138.112.25.25.25h4.146a.25.25 0 0 0 .177-.427L4.29 5.29A5.99 5.99 0 0 1 9 3a6 6 0 1 1-6 6H1a8 8 0 1 0 8-8"/><path d="m11.61 9.639-3.331 2.07a.826.826 0 0 1-1.15-.266.86.86 0 0 1-.129-.452V6.849C7 6.38 7.374 6 7.834 6c.158 0 .312.045.445.13l3.331 2.071a.858.858 0 0 1 0 1.438"/></svg>`,seek:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M9 1a7.98 7.98 0 0 1 6.132 2.867l1.441-1.44a.25.25 0 0 1 .427.177V6.75a.25.25 0 0 1-.25.25h-4.146a.25.25 0 0 1-.177-.427L13.71 5.29A5.99 5.99 0 0 0 9 3a6 6 0 0 0-4.242 10.242l-1.415 1.415A8 8 0 0 1 9 1"/></svg>`,speech:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M6 12a5 5 0 0 1 4.511 2.843c.273.57-.203 1.157-.835 1.157H2.325c-.633 0-1.109-.587-.836-1.157A5 5 0 0 1 6.001 12M8.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path fill-opacity=".5" d="M14.5 2A1.5 1.5 0 0 1 16 3.5v2A1.5 1.5 0 0 1 14.5 7H12l-1.146 1.146A.5.5 0 0 1 10 7.793v-.88A1.5 1.5 0 0 1 9 5.5v-2A1.5 1.5 0 0 1 10.5 2z"/></svg>`,speed:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M9 18q-.213 0-.424-.012h.85Q9.214 18 9 18M9 2a8 8 0 0 1 8 8c0 1.975-.719 3.78-1.905 5.175a.75.75 0 0 1-1.204.018l-1.509-1.971a.75.75 0 0 1 .596-1.206h1.674a6 6 0 1 0-11.304 0h1.68a.75.75 0 0 1 .596 1.206l-1.507 1.971a.75.75 0 0 1-1.133.07l-.003.004A8 8 0 0 1 9 2"/><rect width="6" height="2" x="6" y="14" fill-opacity=".5" rx="1"/><path d="M8.3 6.318c.246-.64 1.154-.64 1.4 0L10.732 9h-.002a2 2 0 1 1-3.46 0h-.001z"/><g fill-opacity=".5"><circle cx="5" cy="10.25" r=".75"/><circle cx="13" cy="10.25" r=".75"/><circle cx="6" cy="7.25" r=".75"/><circle cx="12" cy="7.25" r=".75"/></g></svg>`,spinner:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" aria-hidden="true" viewBox="0 0 18 18"><style>@keyframes media-spinner-fade{0%{opacity:1}to{opacity:0}}.media-spinner__segment{animation:var(--media-spinner-animation, media-spinner-fade 1s steps(8, end) infinite);animation-delay:var(--media-spinner-delay)}@media (prefers-reduced-motion:reduce){.media-spinner__segment{animation:none}}</style><path d="M9 1.5v3" class="media-spinner__segment" opacity=".5" style="--media-spinner-delay:0s"/><path d="m14.5 3.5-2 2" class="media-spinner__segment" opacity=".45" style="--media-spinner-delay:0.125s"/><path d="M16.5 9h-3" class="media-spinner__segment" opacity=".4" style="--media-spinner-delay:0.25s"/><path d="m14.5 14.5-2-2" class="media-spinner__segment" opacity=".35" style="--media-spinner-delay:0.375s"/><path d="M9 16.5v-3" class="media-spinner__segment" opacity=".3" style="--media-spinner-delay:0.5s"/><path d="m3.5 14.5 2-2" class="media-spinner__segment" opacity=".25" style="--media-spinner-delay:0.625s"/><path d="M1.5 9h3" class="media-spinner__segment" opacity=".15" style="--media-spinner-delay:0.75s"/><path d="m3.5 3.5 2 2" class="media-spinner__segment" opacity=".1" style="--media-spinner-delay:0.875s"/></svg>`,switches:`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M12.5 9.5a3.5 3.5 0 1 1 0 7h-7a3.5 3.5 0 1 1 0-7zm-2 1.5a2 2 0 1 0 0 4h2a2 2 0 1 0 0-4z"/><path fill-opacity=".5" d="M12.5 1.5a3.5 3.5 0 1 1 0 7h-7a3.5 3.5 0 1 1 0-7zM5.5 3a2 2 0 1 0 0 4h2a2 2 0 1 0 0-4z"/></svg>`,"volume-high":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M15.6 3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4C15.4 5.9 16 7.4 16 9s-.6 3.1-1.8 4.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3.3 0 .5-.1.7-.3C17.1 13.2 18 11.2 18 9s-.9-4.2-2.4-5.7"/><path d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402"/></svg>`,"volume-low":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402"/></svg>`,"volume-off":`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" aria-hidden="true" viewBox="0 0 18 18"><path d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752M14.5 7.586l-1.768-1.768a1 1 0 1 0-1.414 1.414L13.085 9l-1.767 1.768a1 1 0 0 0 1.414 1.414l1.768-1.768 1.768 1.768a1 1 0 0 0 1.414-1.414L15.914 9l1.768-1.768a1 1 0 0 0-1.414-1.414z"/></svg>`};function $(e,t){let n=nd[e];if(!n)return``;if(!t)return n;let r=Object.entries(t).map(([e,t])=>` ${e}="${je(String(t))}"`).join(``);return n.replace(`<svg`,`<svg${r}`)}var rd=`video-player, live-video-player, media-i18n, media-dialog, media-alert-dialog, media-error-dialog, media-controls {
  display: contents;
}

media-container video, media-container [slot="poster"] {
  width: 100%;
  height: 100%;
  display: block;
}

media-container video::-webkit-media-text-track-container {
  z-index: 1;
  scale: .98;
  translate: 0 var(--media-caption-track-y, 0);
  transition: translate var(--media-caption-track-duration, 0) ease-out;
  transition-delay: var(--media-caption-track-delay, 0);
  font-family: inherit;
}

media-tooltip-group, media-dialog, media-alert-dialog, media-error-dialog, media-controls {
  display: contents;
}

:host {
  width: 100%;
  display: grid;
}

media-container {
  min-width: 0;
  min-height: 0;
}

.media-popover--volume:has(media-volume-slider[data-hidden]) {
  display: none;
}

.media-sr-only {
  white-space: nowrap;
  clip: rect(0, 0, 0, 0);
  border: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

.media-default-skin *, .media-default-skin :before, .media-default-skin :after {
  box-sizing: border-box;
}

.media-default-skin img, .media-default-skin video, .media-default-skin svg {
  max-width: 100%;
  display: block;
}

.media-default-skin button {
  font: inherit;
}

.media-default-skin [hidden][hidden] {
  display: none;
}

@media (prefers-reduced-motion: no-preference) {
  .media-default-skin {
    interpolate-size: allow-keywords;
  }
}

.media-default-skin {
  --media-internal-accent-color: var(--media-accent-color, var(--media-default-accent-color));
  --media-accent-contrast-color: contrast-color(var(--media-internal-accent-color));
  --media-accent-background-color: var(--media-accent-color, oklch(from var(--media-default-accent-color) l c h / calc(alpha * .1)));
  --media-internal-accent-text-color: var(--media-accent-text-color, contrast-color(var(--media-accent-color, oklch(0% 0 0))));
  --media-shadow-current-color: oklch(from currentColor 0 0 0 / clamp(0, calc((l - .5) * .5), .15));
  --media-shadow-subtle-current-color: oklch(from var(--media-shadow-current-color) l c h / calc(alpha * .4));
  --media-scrollbar-thumb-color: oklch(from currentColor l c h / .3);
  --media-scale: 1;
  --media-internal-scale-unit: var(--media-scale-unit, 16px);
  --media-size: calc(var(--media-internal-scale-unit) * var(--media-scale));
  --media-spacing: calc(var(--media-size) / 4);
  --media-font-size-medium: calc(.9375 * var(--media-size));
  --media-font-size-base: calc(.8125 * var(--media-size));
  --media-font-size-small: calc(.6875 * var(--media-size));
  --media-font-size-tiny: calc(.5625 * var(--media-size));
  --media-icon-size: calc(1.125 * var(--media-size));
  --media-container-border-radius: var(--media-border-radius, 1.75rem);
  width: 100%;
  height: 100%;
  font-family: Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif;
  font-size: var(--media-font-size-base);
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
  letter-spacing: normal;
  outline-offset: -4px;
  scrollbar-color: var(--media-scrollbar-thumb-color) transparent;
  scrollbar-width: thin;
  border-radius: var(--media-container-border-radius, 1.75rem);
  isolation: isolate;
  outline: 2px solid #0000;
  line-height: 1.5;
  transition-property: outline-offset, outline-color;
  transition-duration: .1s;
  transition-timing-function: ease-out;
  display: block;
  position: relative;
  container: media-root / inline-size;

  &:focus-visible {
    outline-color: var(--media-focus-ring-color);
    outline-offset: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--media-scrollbar-thumb-color);
    border-radius: 9999px;
  }

  @media (prefers-reduced-transparency: reduce) or (prefers-contrast: more) {
    --media-scrollbar-thumb-color: oklch(from currentColor l c h / .8);
    scrollbar-width: auto;
  }
}

.media-default-skin .media-surface {
  background-color: var(--media-surface-background-color);
  box-shadow: 0 0 0 1px var(--media-surface-outer-border-color),
    0 1px 3px 0 var(--media-surface-shadow-color),
    0 1px 2px -1px var(--media-surface-shadow-color);
  backdrop-filter: var(--media-surface-backdrop-filter);

  &:after {
    z-index: 10;
    pointer-events: none;
    content: "";
    border-radius: inherit;
    box-shadow: inset 0 1px 0 0 var(--media-surface-inner-border-color),
      inset 0 0 0 1px oklch(from var(--media-surface-inner-border-color) l c h / calc(alpha * .5));
    position: absolute;
    inset: 0;
  }
}

.media-default-skin ::slotted(video), .media-default-skin video {
  object-fit: var(--media-object-fit, contain);
  object-position: var(--media-object-position, center);
  width: 100%;
  height: 100%;
  display: block;
}

.media-default-skin ::slotted(video) {
  border-radius: var(--media-container-border-radius);
}

.media-default-skin video {
  border-radius: inherit;
}

.media-default-skin:fullscreen ::slotted(video), .media-default-skin:fullscreen video {
  object-fit: contain;
}

.media-default-skin .media-controls__backdrop {
  z-index: 10;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  transition-timing-function: ease-out;
  transition-duration: var(--media-controls-transition-duration);
  background-image: linear-gradient(to top, oklch(0% 0 0 / .5), oklch(0% 0 0 / .3) 25%, oklch(0% 0 0 / 0));
  transition-property: opacity;
  position: absolute;
  inset: 0;

  &[data-visible] {
    opacity: 1;
  }
}

.media-default-skin .media-buffering-indicator {
  z-index: 10;
  color: oklch(100% 0 0);
  pointer-events: none;
  place-content: center;
  display: none;
  position: absolute;
  inset: 0;

  &:before {
    content: "";
    backdrop-filter: blur(8px);
    background: oklch(0% 0 0 / .35);
    position: absolute;
    inset: 0;
  }

  & > * {
    z-index: 20;
    position: relative;
  }

  &:not([data-visible]) {
    --media-spinner-animation: none;
  }

  &[data-visible] {
    display: grid;
  }

  @media (prefers-reduced-motion: reduce) {
    --media-spinner-animation: none;
  }
}

.media-default-skin {
  & media-error-dialog {
    z-index: 20;
    outline: none;
    justify-content: center;
    align-items: center;
    display: flex;
    position: absolute;
    inset: 0;

    &:not([data-open]) {
      display: none;
    }
  }

  & .media-dialog__backdrop {
    z-index: 10;
    pointer-events: none;
    backdrop-filter: blur(16px) saturate(1.5);
    opacity: 1;
    transition-timing-function: var(--media-dialog-transition-timing-function);
    transition-duration: var(--media-dialog-transition-duration);
    transition-property: opacity;
    transition-delay: var(--media-dialog-transition-delay);
    background: oklch(0% 0 0 / .2);
    position: absolute;
    inset: 0;

    &[data-starting-style], &[data-ending-style] {
      opacity: 0;
    }

    &[data-ending-style] {
      transition-delay: 0s;
    }

    &:not([data-open]) {
      display: none;
    }
  }

  & .media-dialog__popup {
    outline: none;
  }

  & .media-dialog__title {
    font-weight: 600;
    line-height: 1.25;
  }

  & .media-dialog__description {
    overflow-wrap: anywhere;
    opacity: .7;
  }

  & .media-dialog__actions {
    gap: calc(var(--media-spacing) * 2);
    display: flex;

    & > * {
      flex: 1;
    }
  }
}

.media-default-skin .media-controls {
  --media-popover-side-offset: calc(var(--media-spacing) * (var(--media-base-side-offset, 2) + 1));
  --media-tooltip-side-offset: var(--media-popover-side-offset);
  --media-popover-boundary-offset: calc(var(--media-spacing) * var(--media-base-boundary-offset, 2));
  --media-tooltip-boundary-offset: var(--media-popover-boundary-offset);
  padding: calc(var(--media-spacing) * 1);
  text-shadow: 0 1px 0 var(--media-shadow-current-color);
  border-radius: 3.40282e38px;
  align-items: center;
  display: flex;
  container: media-controls / inline-size;

  &:dir(rtl) {
    flex-direction: row-reverse;
  }
}

.media-default-skin .media-time-controls {
  gap: calc(var(--media-spacing) * 2.5);
  flex: 1;
  align-items: center;
  display: flex;
  container: media-time-controls / inline-size;

  &:dir(rtl) {
    flex-direction: row-reverse;
  }

  & > .media-time:last-child {
    @container media-time-controls (width < 16rem) {
      display: none;
    }
  }
}

.media-default-skin .media-time {
  font-variant-numeric: tabular-nums;
}

.media-default-skin .media-time[role="button"] {
  cursor: pointer;
  outline-offset: -2px;
  border-radius: calc(var(--media-spacing) * 1);
  outline: 2px solid #0000;
  transition-property: outline-color, outline-offset;
  transition-duration: .1s;
  transition-timing-function: ease-out;

  &:focus-visible {
    outline-color: var(--media-focus-ring-color);
    outline-offset: 2px;
  }
}

.media-default-skin .media-button {
  height: calc(var(--media-spacing) * 9);
  min-height: 0;
  padding: calc(var(--media-spacing) * 2) calc(var(--media-spacing) * 4);
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  outline-offset: -2px;
  will-change: scale;
  border: none;
  border-radius: 3.40282e38px;
  outline: 2px solid #0000;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  transition-property: background-color, color, outline-offset, scale;
  transition-duration: .15s;
  transition-timing-function: ease-out;
  display: flex;

  &:focus-visible {
    outline-color: var(--media-focus-ring-color);
    outline-offset: 2px;
  }

  &:active:not([aria-disabled="true"]) {
    scale: .97;
  }

  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: .5;
  }
}

.media-default-skin .media-button--primary {
  color: var(--media-accent-contrast-color);
  text-shadow: none;
  background: var(--media-internal-accent-color);
  font-weight: 500;
}

.media-default-skin .media-button--subtle {
  color: inherit;
  text-shadow: inherit;
  background: none;

  &:not([aria-disabled="true"]) {
    &:hover, &:focus-visible, &[aria-expanded="true"] {
      color: var(--media-internal-accent-text-color);
      background-color: var(--media-accent-background-color);
      text-decoration: none;
    }
  }
}

.media-default-skin .media-button--icon {
  aspect-ratio: 1;
  padding: 0;
  display: grid;

  &:active:not([aria-disabled="true"]) {
    scale: .97;
  }

  & .media-icon__container {
    display: grid;
  }

  & .media-icon {
    filter: drop-shadow(0 1px 0 var(--media-shadow-current-color));
    grid-area: 1 / 1;
    transition-property: opacity, scale;
    transition-duration: .15s;
    transition-timing-function: ease-out;
  }
}

.media-default-skin .media-button--seek {
  & .media-icon__label {
    font-variant-numeric: tabular-nums;
    letter-spacing: -.05em;
    font-size: .715em;
    font-weight: 500;
    position: absolute;
    bottom: -3px;
    right: -1px;
  }

  &:has(.media-icon--flipped) .media-icon__label {
    right: unset;
    left: -1px;
  }
}

.media-default-skin .media-button--playback-rate {
  font-variant-numeric: tabular-nums;
  padding: 0;

  &:after {
    content: attr(data-rate) "×";
    width: 4ch;
  }

  &[data-inline-rate-label]:after {
    content: none;
  }
}

.media-default-skin .media-button--settings {
  & .media-icon--settings {
    transition: transform .15s ease-in-out;

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  }

  &[aria-expanded="true"] .media-icon--settings {
    transform: rotate(90deg);
  }
}

.media-default-skin .media-button--live {
  gap: calc(var(--media-spacing) * 1.5);
  aspect-ratio: auto;
  width: auto;
  padding: calc(var(--media-spacing) * 2) calc(var(--media-spacing) * 3);
  font-size: var(--media-font-size-small);
  text-transform: uppercase;
  letter-spacing: .05em;
  align-items: center;
  font-weight: 600;
  line-height: 1;
  display: inline-flex;

  &:before {
    width: calc(var(--media-spacing) * 2);
    height: calc(var(--media-spacing) * 2);
    content: "";
    background-color: oklch(from currentColor l c h / .4);
    border-radius: 50%;
    flex-shrink: 0;
    transition: background-color .15s ease-out;
    display: inline-block;
  }

  &[data-live-edge]:before {
    background-color: oklch(65% .22 27);
  }
}

@media (prefers-reduced-motion: reduce) {
  .media-default-skin .media-button {
    will-change: auto;
    transition-property: background-color, color;
    scale: 1;
  }
}

.media-default-skin .media-button-group {
  align-items: center;
  gap: 1px;
  display: flex;

  &:dir(rtl) {
    flex-direction: row-reverse;
  }
}

.media-default-skin .media-badge {
  padding: calc(var(--media-spacing) * .5) calc(var(--media-spacing) * 1.5);
  font-size: var(--media-font-size-small);
  color: oklch(from currentColor l c h / .85);
  white-space: nowrap;
  background-color: oklch(from currentColor l c h / .1);
  border-radius: 3.40282e38px;
  font-weight: 500;
  line-height: 1;
}

.media-default-skin .media-icon__container {
  position: relative;
}

.media-default-skin .media-icon {
  width: var(--media-icon-size);
  height: var(--media-icon-size);
  flex-shrink: 0;
}

.media-default-skin .media-icon--flipped, .media-default-skin:dir(rtl) .media-menu__chevron {
  scale: -1 1;
}

.media-default-skin:dir(rtl) .media-menu__chevron.media-icon--flipped {
  scale: 1;
}

.media-default-skin media-poster, .media-default-skin > img {
  pointer-events: none;
  width: 100%;
  height: 100%;
  transition: opacity .25s;
  position: absolute;
  inset: 0;
}

.media-default-skin media-poster:not([data-visible]), .media-default-skin > img:not([data-visible]) {
  opacity: 0;
}

.media-default-skin media-poster ::slotted(img), .media-default-skin media-poster img {
  object-fit: var(--media-object-fit, contain);
  object-position: var(--media-object-position, center);
  border-radius: var(--media-container-border-radius);
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.media-default-skin > img {
  object-fit: var(--media-object-fit, contain);
  object-position: var(--media-object-position, center);
  border-radius: inherit;
}

.media-default-skin:fullscreen media-poster ::slotted(img), .media-default-skin:fullscreen media-poster img, .media-default-skin:fullscreen > img {
  object-fit: contain;
}

.media-default-skin .media-thumbnail {
  pointer-events: none;
  border-radius: calc(var(--media-spacing) * 3);
  background-color: oklch(0% 0 0 / .9);
  position: relative;

  & .media-thumbnail__image {
    max-width: var(--media-thumbnail-max-width);
    max-height: var(--media-thumbnail-max-height);
    border-radius: inherit;
    display: block;
    position: relative;
    overflow: clip;

    &:after {
      content: "";
      border-radius: inherit;
      background-image: linear-gradient(to top, oklch(0% 0 0 / .5), oklch(0% 0 0 / .1), oklch(0% 0 0 / 0));
      position: absolute;
      inset: 0;
    }
  }

  & .media-thumbnail__spinner {
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
  }

  & .media-thumbnail__image, & .media-thumbnail__spinner {
    transition: opacity .15s ease-out;
  }

  &:not(:has(.media-thumbnail__image[data-loading])) {
    & .media-thumbnail__spinner {
      --media-spinner-animation: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    --media-spinner-animation: none;
  }

  &:has(.media-thumbnail__image[data-loading]) {
    width: var(--media-thumbnail-max-width);
    aspect-ratio: 16 / 9;
    max-width: 100%;
    overflow: hidden;

    & .media-thumbnail__image {
      opacity: 0;
    }

    & .media-thumbnail__spinner {
      opacity: 1;
    }
  }
}

.media-default-skin .media-slider {
  --media-track-size: calc(var(--media-spacing) * 1);
  --media-track-highlighted-size: calc(var(--media-spacing) * 1.75);
  --media-track-border-radius: 99px;
  --media-track-transition-duration: .1s;
  --media-thumb-size: calc(var(--media-spacing) * 3);
  --media-chapter-gap: calc(var(--media-spacing) * 1);
  --media-internal-chapter-inset-start: calc(var(--media-chapter-gap) / 2);
  --media-internal-chapter-inset-end: calc(var(--media-chapter-gap) / 2);
  cursor: pointer;
  outline: none;
  flex: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;

  &[data-orientation="horizontal"] {
    width: var(--media-slider-width, 100%);
    min-width: calc(var(--media-spacing) * 20);
    height: var(--media-slider-height, calc(var(--media-spacing) * 8));
  }

  &[data-orientation="vertical"] {
    width: var(--media-slider-width, calc(var(--media-spacing) * 8));
    height: var(--media-slider-height, calc(var(--media-spacing) * 20));
  }

  & .media-slider__track {
    user-select: none;
    background-color: oklch(from currentColor l c h / .2);
    border-radius: var(--media-track-border-radius);
    isolation: isolate;
    position: relative;
    overflow: hidden;

    &[data-orientation="horizontal"] {
      width: 100%;
      height: var(--media-track-size);
    }

    &[data-orientation="vertical"] {
      width: var(--media-track-size);
      height: 100%;
    }
  }

  & .media-slider__buffer, & .media-slider__fill {
    pointer-events: none;
    border-radius: inherit;
    position: absolute;

    &[data-orientation="horizontal"] {
      inset-block: 0;
      width: 100%;
      left: 0;
    }

    &[data-orientation="vertical"] {
      inset-inline: 0;
      height: 100%;
      bottom: 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      transition: clip-path var(--media-track-transition-duration) ease-out;
    }
  }

  &[data-dragging] {
    & .media-slider__fill, & .media-slider__buffer {
      transition-duration: 0s;
    }
  }

  & .media-slider__buffer {
    background-color: oklch(from currentColor l c h / .2);

    &[data-orientation="horizontal"] {
      clip-path: inset(0 calc(100% - var(--media-slider-buffer)) 0 0 round var(--media-track-border-radius));
    }

    &[data-orientation="vertical"] {
      clip-path: inset(calc(100% - var(--media-slider-buffer)) 0 0 0 round var(--media-track-border-radius));
    }
  }

  & .media-slider__fill {
    background-color: var(--media-internal-accent-color);

    &[data-orientation="horizontal"] {
      clip-path: inset(0 calc(100% - var(--media-slider-fill)) 0 0 round var(--media-track-border-radius));
    }

    &[data-orientation="vertical"] {
      clip-path: inset(calc(100% - var(--media-slider-fill)) 0 0 0 round var(--media-track-border-radius));
    }
  }

  &[data-dragging] {
    & .media-slider__fill[data-orientation="horizontal"] {
      clip-path: inset(0 calc(100% - var(--media-slider-pointer)) 0 0 round var(--media-track-border-radius));
    }

    & .media-slider__fill[data-orientation="vertical"] {
      clip-path: inset(calc(100% - var(--media-slider-pointer)) 0 0 0 round var(--media-track-border-radius));
    }
  }

  & .media-slider__chapters {
    border-radius: inherit;
    flex: 1;
    align-items: center;
    min-width: 0;
    min-height: 0;
    display: flex;
    position: relative;

    &[data-orientation="horizontal"] {
      width: 100%;
      height: 100%;
    }

    &[data-orientation="vertical"] {
      flex-direction: column-reverse;
      width: 100%;
      height: 100%;
    }
  }

  & .media-slider__chapter {
    border-radius: inherit;
    justify-content: center;
    align-items: center;
    min-width: 0;
    min-height: 0;
    display: flex;
    position: absolute;
    inset: 0;

    &:first-child {
      --media-internal-chapter-inset-start: 0px;
    }

    &:last-child {
      --media-internal-chapter-inset-end: 0px;
    }

    & .media-slider__chapter-track {
      border-radius: inherit;

      @media (prefers-reduced-motion: no-preference) {
        transition: height .2s ease-out, width .2s ease-out;
      }
    }

    &[data-orientation="horizontal"] {
      clip-path: inset(0 calc(100% - var(--media-slider-chapter-end)) 0 var(--media-slider-chapter-start));

      & .media-slider__chapter-track {
        height: var(--media-track-size);
        clip-path: inset(0 calc(100% - var(--media-slider-chapter-end) + var(--media-internal-chapter-inset-end)) 0
            calc(var(--media-slider-chapter-start) + var(--media-internal-chapter-inset-start)) round
            var(--media-track-border-radius));
      }

      &[data-highlighted] .media-slider__chapter-track {
        height: var(--media-track-highlighted-size);
      }
    }

    &[data-orientation="vertical"] {
      clip-path: inset(calc(100% - var(--media-slider-chapter-end)) 0 var(--media-slider-chapter-start) 0);

      & .media-slider__chapter-track {
        width: var(--media-track-size);
        clip-path: inset(calc(100% - var(--media-slider-chapter-end) + var(--media-internal-chapter-inset-end)) 0
            calc(var(--media-slider-chapter-start) + var(--media-internal-chapter-inset-start)) 0 round
            var(--media-track-border-radius));
      }

      &[data-highlighted] .media-slider__chapter-track {
        width: var(--media-track-highlighted-size);
      }
    }
  }

  & .media-slider__thumb {
    z-index: 10;
    width: var(--media-thumb-size);
    height: var(--media-thumb-size);
    user-select: none;
    outline-offset: -4px;
    box-shadow: 0 0 0 1px var(--media-shadow-current-color, oklch(0% 0 0 / .1)),
      0 1px 3px 0 oklch(0% 0 0 / .35),
      0 1px 2px -1px oklch(0% 0 0 / .35);
    opacity: 0;
    background-color: currentColor;
    border-radius: 3.40282e38px;
    outline: 4px solid #0000;
    position: absolute;
    translate: -50% -50%;
    scale: .8;

    &[data-orientation="horizontal"] {
      top: 50%;
      left: var(--media-slider-fill);
    }

    &[data-orientation="vertical"] {
      top: calc(100% - var(--media-slider-fill));
      left: 50%;
    }

    &:focus-visible {
      outline-color: oklch(from currentColor l c h / .15);
      outline-offset: 0;
      opacity: 1;
    }

    &:after {
      content: "";
      border-radius: inherit;
      position: absolute;
      inset: -4px;
      box-shadow: 0 0 0 2px;
    }

    &:not(:focus-visible):after {
      opacity: 0;
      scale: .5;
    }

    &.media-slider__thumb--persistent {
      opacity: 1;
      scale: 1;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        outline-color: oklch(from currentColor l c h / .15);
        outline-offset: 0;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      transition-timing-function: ease-out;
      transition-duration: var(--media-track-transition-duration);
      transition-property: opacity, outline-offset, left, top, scale;

      &:after {
        transition-property: opacity, scale;
        transition-duration: .15s;
        transition-timing-function: ease-out;
      }
    }
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover .media-slider__thumb {
      opacity: 1;
      scale: 1;
    }
  }

  &[data-dragging] .media-slider__thumb {
    opacity: 1;
    scale: .9;

    @media (prefers-reduced-motion: no-preference) {
      transition-property: opacity, outline-offset, scale;
    }

    &[data-orientation="horizontal"] {
      left: var(--media-slider-pointer);
    }

    &[data-orientation="vertical"] {
      top: calc(100% - var(--media-slider-pointer));
    }
  }

  & .media-slider__preview {
    --media-max-size-factor: 36;
    --media-max-size: min(calc(var(--media-spacing) * var(--media-max-size-factor)), 100cqi);
    min-width: var(--media-max-size);
    height: calc(var(--media-spacing) * 1);

    @container media-root (width > 42rem) {
      --media-max-size-factor: 48;
    }

    & .media-slider__thumbnail, & .media-slider__value {
      max-width: var(--media-max-size);
      opacity: 0;
      filter: blur(8px);
      transform-origin: bottom;
      scale: .8;
      translate: -50% calc(var(--media-spacing) * 2);
      transition-duration: .15s;
      transition-timing-function: ease-out;
      position: absolute;
      left: 50%;
    }

    & .media-slider__thumbnail {
      --media-thumbnail-max-width: var(--media-max-size);
      --media-thumbnail-max-height: var(--media-max-size);
      bottom: calc(100% + (var(--media-spacing) * 9));
    }

    & .media-slider__value {
      bottom: calc(100% + (var(--media-spacing) * 10.5));
      flex-direction: column;
      align-items: center;
      display: flex;
    }

    & .media-slider__chapter-title {
      min-width: 0;
      max-width: var(--media-max-size);
      padding-inline: calc(var(--media-spacing) * 6);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &:empty {
        display: none;
      }
    }

    &:before {
      z-index: 1;
      width: calc(var(--media-spacing) * 1);
      height: calc(var(--media-spacing) * 1);
      pointer-events: none;
      content: "";
      box-shadow: 0 0 0 1px var(--media-shadow-current-color, oklch(0% 0 0 / .15)),
        0 1px 2px 0 oklch(0% 0 0 / .35);
      opacity: 0;
      background-color: currentColor;
      border-radius: 100%;
      transition-property: opacity, scale;
      transition-duration: .2s;
      transition-timing-function: ease-out;
      position: absolute;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      scale: .5;
    }
  }

  &:is([data-pointing], :has(:focus-visible)) .media-slider__preview :is(.media-slider__value, .media-slider__thumbnail), & .media-slider__preview[data-pointing]:not([data-dragging]):before {
    opacity: 1;
    filter: blur();
    scale: 1;
  }
}

.media-default-skin {
  --media-popup-transition: opacity var(--media-popup-transition-timing-function) var(--media-popup-transition-duration),
    filter var(--media-popup-transition-timing-function) var(--media-popup-transition-duration),
    transform var(--media-popup-transition-timing-function) var(--media-popup-transition-duration),
    scale var(--media-popup-transition-timing-function) var(--media-popup-transition-duration);
}

.media-default-skin .media-popover, .media-default-skin .media-tooltip {
  --media-popup-translate-distance: calc(.5 * var(--media-internal-scale-unit));
  color: inherit;
  transition: var(--media-popup-transition);
  border: 0;
  margin: 0;
  overflow: visible;

  &[data-starting-style], &[data-ending-style] {
    opacity: 0;
    filter: blur(4px);
    transform: translate(var(--media-popup-translate-x-distance, 0), var(--media-popup-translate-y-distance, 0));
    scale: .95;
  }

  &[data-ending-style] {
    transition-duration: max(0s, calc(var(--media-popup-transition-duration) - 50ms));
    transform: none;
  }

  &[data-side="top"] {
    --media-popup-translate-y-distance: var(--media-popup-translate-distance);
    transform-origin: bottom;
  }

  &[data-side="bottom"] {
    --media-popup-translate-y-distance: calc(var(--media-popup-translate-distance) * -1);
    transform-origin: top;
  }

  &[data-side="left"] {
    --media-popup-translate-x-distance: var(--media-popup-translate-distance);
    transform-origin: 100%;
  }

  &[data-side="right"] {
    --media-popup-translate-x-distance: calc(var(--media-popup-translate-distance) * -1);
    transform-origin: 0;
  }

  &:before {
    pointer-events: inherit;
    content: "";
    position: absolute;
  }

  &[data-side="top"]:before, &[data-side="bottom"]:before {
    width: 100%;
    inset-inline: 0;
  }

  &[data-side="top"]:before {
    top: 100%;
  }

  &[data-side="bottom"]:before {
    bottom: 100%;
  }

  &[data-side="left"]:before, &[data-side="right"]:before {
    height: 100%;
    inset-block: 0;
  }

  &[data-side="left"]:before {
    left: 100%;
  }

  &[data-side="right"]:before {
    right: 100%;
  }
}

.media-default-skin .media-popover {
  &[data-side="top"]:before, &[data-side="bottom"]:before {
    height: var(--media-popover-side-offset);
  }

  &[data-side="left"]:before, &[data-side="right"]:before {
    width: var(--media-popover-side-offset);
  }
}

.media-default-skin .media-popover--volume {
  padding: calc(var(--media-spacing) * 3) 0;
  border-radius: 3.40282e38px;

  &:has(media-volume-slider[data-hidden]) {
    display: none;
  }
}

.media-default-skin .media-tooltip {
  padding: calc(var(--media-spacing) * 1) calc(var(--media-spacing) * 2.5);
  font-size: var(--media-font-size-base);
  white-space: nowrap;
  border-radius: 3.40282e38px;

  &[data-open] {
    column-gap: calc(var(--media-spacing) * 1);
    align-items: center;
    display: flex;
  }

  &[data-side="top"]:before, &[data-side="bottom"]:before {
    height: var(--media-tooltip-side-offset);
  }

  &[data-side="left"]:before, &[data-side="right"]:before {
    width: var(--media-tooltip-side-offset);
  }

  & .media-tooltip__kbd {
    min-width: 1.5em;
    font-family: inherit;
    font-size: var(--media-font-size-small);
    text-align: center;
    background-color: oklch(from currentColor l c h / .3);
    border-radius: calc(var(--media-spacing) * 1);
    padding: .1em;
    font-weight: 600;
    line-height: 1.25;
  }
}

.media-default-skin .media-menu {
  --media-menu-transition-duration: .25s;
  --media-menu-max-height: calc(var(--media-spacing) * 56);
  --media-menu-padding: calc(var(--media-spacing) * 1);
  --media-menu-border-radius: calc(var(--media-spacing) * 3);
  --media-menu-item-border-radius: calc(var(--media-menu-border-radius) - var(--media-menu-padding));
  box-sizing: border-box;
  min-width: max-content;
  max-width: var(--media-menu-available-width, none);
  max-height: min(var(--media-menu-available-height, var(--media-menu-max-height)), var(--media-menu-max-height));
  padding: var(--media-menu-padding);
  overscroll-behavior: none;
  border-radius: var(--media-menu-border-radius);
  overflow: auto;

  @media (prefers-reduced-motion: reduce) {
    --media-menu-transition-duration: 0s;
  }

  & > .media-menu__panel {
    --media-menu-content-enter-translate: 100%;
    inset-inline: 0;
    z-index: 10;
    max-height: inherit;
    padding: var(--media-menu-padding);
    overscroll-behavior: none;
    transition-timing-function: ease-out;
    transition-duration: var(--media-menu-transition-duration);
    outline: none;
    transition-property: translate, filter;
    position: absolute;
    top: 0;
    overflow: auto;
    translate: 0;

    &:where([data-starting-style], [data-ending-style]) {
      pointer-events: none;
      filter: blur(8px);
      translate: var(--media-menu-content-enter-translate) 0;
      overflow: hidden;
    }

    &:dir(rtl):where([data-starting-style], [data-ending-style]) {
      --media-menu-content-enter-translate: -100%;
    }
  }

  & .media-menu__separator {
    margin-block: calc(var(--media-spacing) * 1);
    border-bottom: 1px solid oklch(0% 0 0 / .1);
    box-shadow: 0 1px oklch(100% 0 0 / .075);
  }

  & .media-menu__content, & .media-menu__group {
    anchor-scope: --menu-item-highlight-anchor;
    gap: calc(var(--media-spacing) * .5);
    flex-direction: column;
    display: flex;

    @supports (top: anchor(top)) {
      &:before {
        position-anchor: --menu-item-highlight-anchor;
        inset: anchor(inside);
        overflow-anchor: none;
        pointer-events: none;
        content: "";
        background-color: var(--media-accent-background-color);
        border-radius: var(--media-menu-item-border-radius);
        transition: inset .1s ease-in-out;
        position: absolute;
      }

      &:has([data-highlighted=""]):before {
        transition-duration: 0s;
      }
    }
  }

  & .media-menu__item, & .media-menu__back {
    gap: calc(var(--media-spacing) * 1.5);
    padding: calc(var(--media-spacing) * 1.5) calc(var(--media-spacing) * 2);
    text-align: start;
    white-space: nowrap;
    text-shadow: 0 1px 0 var(--media-shadow-current-color);
    cursor: pointer;
    user-select: none;
    outline-offset: -2px;
    border-radius: var(--media-menu-item-border-radius);
    outline: 2px solid #0000;
    align-items: center;
    transition: background-color .1s ease-in-out, color .1s ease-in-out;
    display: flex;
    position: relative;

    & .media-icon {
      color: oklch(from currentColor l c h / .65);
      filter: drop-shadow(0 1px 0 var(--media-shadow-current-color));
      flex-shrink: 0;
    }

    &:focus-visible {
      outline-color: var(--media-focus-ring-color);
      outline-offset: 2px;
    }

    &:hover, &[data-highlighted] {
      color: var(--media-internal-accent-text-color);
      background-color: var(--media-accent-background-color);

      & .media-icon {
        color: inherit;
      }
    }

    @supports (top: anchor(top)) {
      transition-duration: 50ms;

      &:hover, &[data-highlighted] {
        transition-duration: .2s;
      }
    }
  }

  & .media-menu__indicator {
    margin-inline: auto calc(var(--media-spacing) * -1);
    opacity: 0;
    flex-shrink: 0;

    & .media-icon {
      filter: drop-shadow(0 1px 0 var(--media-shadow-current-color));
    }
  }

  & .media-menu__item {
    font-variant-numeric: tabular-nums;
    color: inherit;
    justify-content: space-between;

    &[aria-disabled="true"] {
      pointer-events: none;
      cursor: not-allowed;
      opacity: .5;
    }

    &[aria-checked="true"] .media-menu__indicator {
      opacity: 1;
    }

    &[data-availability="unavailable"], &[data-availability="unsupported"] {
      display: none;
    }

    &[data-highlighted] {
      @supports (top: anchor(top)) {
        anchor-name: --menu-item-highlight-anchor;
        background-color: #0000;
      }
    }
  }

  & .media-menu__tier {
    padding-inline-start: calc(var(--media-spacing) * .5);
    font-size: var(--media-font-size-tiny);
    color: oklch(from currentColor l c h / .7);
    padding-top: 1px;
    font-weight: 600;
    line-height: 1;
  }

  & .media-menu__back {
    width: 100%;
    margin-bottom: calc(var(--media-spacing) * .5);
  }

  & .media-menu__hint {
    gap: calc(var(--media-spacing) * 1);
    min-width: 0;
    color: oklch(from currentColor l c h / .65);
    align-items: center;
    margin-inline-start: auto;
    padding-inline-start: calc(var(--media-spacing) * 2);
    display: inline-flex;
  }

  & .media-menu__hint-label {
    max-width: calc(var(--media-spacing) * 24);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  & .media-menu__chevron {
    width: calc(var(--media-spacing) * 3.5);
    height: calc(var(--media-spacing) * 3.5);
  }

  &.media-menu--settings {
    width: var(--media-menu-width);
    min-width: calc(var(--media-spacing) * 44);
    height: var(--media-menu-height);
    transition: var(--media-popup-transition),
      width var(--media-popup-transition-timing-function) var(--media-menu-transition-duration),
      height var(--media-popup-transition-timing-function) var(--media-menu-transition-duration);
    overflow: hidden;

    & > .media-menu__content {
      --media-menu-content-exit-translate: -100%;
      transition: translate var(--media-menu-transition-duration) ease-out,
        filter var(--media-menu-transition-duration) ease-out;
      translate: 0;

      &:dir(rtl) {
        --media-menu-content-exit-translate: 100%;
      }
    }

    & > .media-menu__content[data-child-open] {
      filter: blur(8px);
      translate: var(--media-menu-content-exit-translate) 0;
    }

    & > .media-menu__content[data-child-open]:before, &:has( > .media-menu__panel[data-ending-style]) > .media-menu__content:before {
      display: none;
    }

    &[data-starting-style], &[data-ending-style] {
      transition: var(--media-popup-transition);
    }
  }
}

.media-default-skin {
  --media-caption-track-duration: var(--media-controls-transition-duration);
  --media-caption-track-delay: 25ms;
  --media-caption-track-y: calc(var(--media-spacing) * -2);

  &:has(.media-controls[data-visible]) {
    --media-caption-track-y: calc(var(--media-spacing) * -14);
  }
}

.media-default-skin video::-webkit-media-text-track-container {
  z-index: 1;
  scale: .98;
  translate: 0 var(--media-caption-track-y);
  transition: translate var(--media-caption-track-duration) ease-out;
  transition-delay: var(--media-caption-track-delay);
  font-family: inherit;
}

.media-default-skin .media-input-indicator {
  color: oklch(100% 0 0);
  pointer-events: none;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
  display: grid;
  position: absolute;
  inset: 0;
}

.media-default-skin {
  & .media-volume-indicator, & .media-status-indicator--state {
    --media-surface-background-color: oklch(0% 0 0 / .25);
    top: calc(var(--media-spacing) * 3);
    color: inherit;
    pointer-events: none;
    transform-origin: top;
    border-radius: 3.40282e38px;
    font-weight: 500;
    transition-duration: .1s;
    transition-timing-function: ease-out;
    position: absolute;

    & .media-volume-indicator__content, & .media-status-indicator__content {
      gap: calc(var(--media-spacing) * 2);
      width: 100%;
      padding: calc(var(--media-spacing) * 1) calc(var(--media-spacing) * 2.5);
      justify-content: space-between;
      align-items: center;
      display: flex;

      & * {
        mix-blend-mode: difference;
      }
    }

    & .media-icon {
      flex-shrink: 0;
      display: none;
    }

    & .media-volume-indicator__value, & .media-status-indicator__value {
      margin-left: auto;
    }

    @media (pointer: coarse) {
      will-change: scale, translate, opacity;
      transition-property: scale, translate, opacity;
    }

    @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
      will-change: scale, translate, filter, opacity;
      transition-property: scale, translate, filter, opacity;
    }

    @media (prefers-reduced-transparency: reduce) or (prefers-contrast: more) {
      --media-surface-background-color: oklch(0% 0 0);
    }

    &[data-starting-style], &[data-ending-style] {
      opacity: 0;
      transition-duration: .25s;
      transition-timing-function: ease-in;

      @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
        filter: blur(8px);
        scale: .9;
      }
    }

    &[data-ending-style] {
      @media (prefers-reduced-motion: no-preference) {
        translate: 0 -25%;
      }
    }
  }

  & .media-seek-indicator, & .media-status-indicator--playback {
    padding: calc(var(--media-spacing) * 4);
    text-align: center;
    grid-area: 1 / 2;
    place-content: center;
    display: grid;
  }
}

.media-default-skin .media-volume-indicator {
  width: min(80%, calc(var(--media-spacing) * 48));
  transform: translateX(0);

  & .media-volume-indicator__content {
    background-image: linear-gradient(currentColor, currentColor);
    background-position: 0;
    background-repeat: no-repeat;
    background-size: var(--media-volume-fill, 0%) 100%;
    border-radius: inherit;
    transition: background-size .2s linear;
  }

  &[data-level="high"] .media-icon--volume-high, &[data-level="low"] .media-icon--volume-low, &[data-level="off"] .media-icon--volume-off {
    display: block;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-min]:not([data-starting-style], [data-ending-style]), &[data-max]:not([data-starting-style], [data-ending-style]) {
      transition: transform .3s linear(0, -24 20%, 16 40%, -8 60%, 4 80%, 1);
      transform: translateX(.25px);
    }
  }
}

.media-default-skin .media-status-indicator--state {
  &[data-status="captions-on"] .media-icon--captions-on, &[data-status="captions-off"] .media-icon--captions-off, &[data-status="fullscreen"] .media-icon--fullscreen-enter, &[data-status="exit-fullscreen"] .media-icon--fullscreen-exit, &[data-status="pip"] .media-icon--pip-enter, &[data-status="exit-pip"] .media-icon--pip-exit {
    display: block;
  }
}

.media-default-skin .media-status-indicator--playback {
  backdrop-filter: blur(8px);
  background: oklch(0% 0 0 / .35);
  border-radius: 100%;
  transition-property: opacity, scale;
  transition-duration: .2s;
  transition-timing-function: ease-out;

  & .media-icon {
    width: calc(var(--media-icon-size) * 1.5);
    height: calc(var(--media-icon-size) * 1.5);
    opacity: 0;
    grid-area: 1 / 1;
    transition-property: opacity, scale;
    transition-duration: .15s;
    transition-timing-function: ease-out;
    scale: 0;

    &.media-icon--play {
      translate: 1px;
    }
  }

  &[data-status="pause"] .media-icon--pause, &[data-status="play"] .media-icon--play {
    opacity: 1;
    scale: 1;
  }

  &[data-starting-style], &[data-ending-style] {
    opacity: 0;
    scale: .85;
  }

  &[data-ending-style] {
    transition-duration: .1s;
    transition-timing-function: ease-in;
  }

  @media (prefers-reduced-motion: reduce) {
    transition-property: opacity;
    transition-duration: 50ms;

    &[data-starting-style], &[data-ending-style], & .media-icon {
      scale: 1;
    }

    & .media-icon {
      transition-property: opacity;
      transition-duration: 50ms;
    }
  }
}

.media-default-skin .media-seek-indicator {
  gap: calc(var(--media-spacing) * 1);

  & .media-seek-indicator__value {
    font-variant-numeric: tabular-nums;
  }

  @container media-root (width > 24rem) {
    padding: calc(var(--media-spacing) * 6);
  }

  &[data-direction="backward"] {
    grid-column: 1;
    justify-self: left;
  }

  &[data-direction="forward"] {
    grid-column: 3;
    justify-self: right;
  }

  & .media-icon--seek {
    width: calc(var(--media-icon-size) * 1.5);
    height: calc(var(--media-icon-size) * 1.5);
    display: block;
  }

  &[data-direction="backward"] .media-icon--seek {
    scale: -1 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    & .media-icon--seek {
      transition-property: translate, opacity;
      transition-duration: .2s;
      transition-timing-function: ease-in-out;
    }

    &[data-starting-style] .media-icon--seek, &[data-ending-style] .media-icon--seek {
      opacity: 0;
    }

    &[data-direction="forward"][data-starting-style] .media-icon--seek {
      translate: -60%;
    }

    &[data-direction="backward"][data-starting-style] .media-icon--seek {
      translate: 60%;
    }
  }
}

.media-button--play .media-icon, .media-button--mute .media-icon, .media-button--fullscreen .media-icon, .media-button--pip .media-icon, .media-button--cast .media-icon, .media-button--airplay .media-icon, .media-button--captions .media-icon {
  opacity: 0;
}

.media-button--play .media-icon {
  scale: 0;
}

.media-button--play[data-ended] .media-icon--restart, .media-button--play:not([data-ended])[data-paused] .media-icon--play, .media-button--play:not([data-ended]):not([data-started]) .media-icon--play, .media-button--play[data-started]:not([data-paused]):not([data-ended]) .media-icon--pause, .media-button--mute[data-muted] .media-icon--volume-off, .media-button--mute:not([data-muted])[data-volume-level="low"] .media-icon--volume-low, .media-button--mute:not([data-muted]):not([data-volume-level="low"]) .media-icon--volume-high, .media-button--fullscreen:not([data-fullscreen]) .media-icon--fullscreen-enter, .media-button--fullscreen[data-fullscreen] .media-icon--fullscreen-exit, .media-button--pip:not([data-pip]) .media-icon--pip-enter, .media-button--pip[data-pip] .media-icon--pip-exit, .media-button--cast:not([data-cast-state="connected"]) .media-icon--cast-enter, .media-button--cast[data-cast-state="connected"] .media-icon--cast-exit, .media-button--airplay:not([data-airplay-state="connected"]) .media-icon--airplay-enter, .media-button--airplay[data-airplay-state="connected"] .media-icon--airplay-exit, .media-button--captions:not([data-active]) .media-icon--captions-off, .media-button--captions[data-active] .media-icon--captions-on {
  opacity: 1;
  scale: 1;
}

.media-button--airplay:not([data-airplay-state="connected"]) {
  --media-icon-airplay-fill-animation: none;
  --media-icon-airplay-triangle-animation: none;
}

@media (prefers-reduced-motion: reduce) {
  .media-button--airplay {
    --media-icon--airplay__fill-animation: none;
    --media-icon--airplay__triangle-animation: none;
  }
}

.media-default-skin--video {
  --media-default-accent-color: oklch(100% 0 0);
  --media-border-color: light-dark(oklch(0% 0 0 / .1), oklch(100% 0 0 / .15));
  --media-focus-ring-color: light-dark(oklch(0% 0 0), oklch(100% 0 0));
  --media-video-border-radius: var(--media-container-border-radius);
  --media-surface-background-color: oklch(100% 0 0 / .1);
  --media-surface-inner-border-color: oklch(100% 0 0 / .1);
  --media-surface-outer-border-color: oklch(0% 0 0 / .1);
  --media-surface-shadow-color: oklch(0% 0 0 / .15);
  --media-surface-backdrop-filter: blur(16px) saturate(1.5);
  --media-controls-transition-duration: .1s;
  --media-controls-transition-timing-function: ease-out;
  --media-dialog-transition-duration: .35s;
  --media-dialog-transition-delay: .1s;
  --media-dialog-transition-timing-function: ease-out;
  --media-popup-transition-duration: .1s;
  --media-popup-transition-timing-function: ease-out;
  background: oklch(0% 0 0);
  overflow: clip;

  @media (prefers-reduced-motion: reduce) {
    --media-dialog-transition-duration: 50ms;
    --media-dialog-transition-delay: 0s;
    --media-popup-transition-duration: 0s;

    & .media-dialog__popup {
      transition-property: opacity;
      scale: 1;
    }
  }

  @media (prefers-reduced-transparency: reduce) or (prefers-contrast: more) {
    --media-surface-background-color: oklch(0% 0 0);
    --media-surface-inner-border-color: oklch(100% 0 0 / .25);
    --media-surface-outer-border-color: transparent;
  }

  &:has(.media-controls--root:not([data-visible])) {
    @media (pointer: fine) {
      --media-controls-transition-duration: .3s;
    }

    @media (pointer: coarse) {
      --media-controls-transition-duration: .15s;
    }

    @media (prefers-reduced-motion: reduce) {
      --media-controls-transition-duration: 50ms;
    }
  }

  &:after {
    z-index: 10;
    pointer-events: none;
    content: "";
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px var(--media-border-color);
    position: absolute;
    inset: 0;
  }

  &:fullscreen {
    --media-container-border-radius: 0;

    &:after {
      display: none;
    }

    @media (width >= 1280px) {
      --media-scale: 1.25;
    }

    @media (width >= 1536px) {
      --media-scale: 1.5;
    }

    @media (width >= 1920px) {
      --media-scale: 1.75;
    }
  }

  & * {
    --media-focus-ring-color: oklch(100% 0 0);
  }
}

.media-default-skin--video .media-dialog__popup {
  z-index: 20;
  gap: calc(var(--media-spacing) * 3);
  width: 100%;
  max-width: calc(var(--media-spacing) * 72);
  padding: calc(var(--media-spacing) * 3);
  color: oklch(100% 0 0);
  text-shadow: 0 1px oklch(0% 0 0 / .25);
  border-radius: calc(var(--media-spacing) * 7);
  transition-delay: var(--media-dialog-transition-delay);
  transition-timing-function: var(--media-dialog-transition-timing-function);
  transition-duration: var(--media-dialog-transition-duration);
  flex-direction: column;
  transition-property: opacity, scale;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}

.media-default-skin--video .media-dialog__popup[data-starting-style], .media-default-skin--video .media-dialog__popup[data-ending-style], .media-default-skin--video media-error-dialog[data-starting-style] .media-dialog__popup, .media-default-skin--video media-error-dialog[data-ending-style] .media-dialog__popup {
  opacity: 0;
  scale: .95;
}

.media-default-skin--video .media-dialog__popup[data-ending-style], .media-default-skin--video media-error-dialog[data-ending-style] .media-dialog__popup {
  transition-delay: 0s;
}

.media-default-skin--video .media-dialog__content {
  gap: calc(var(--media-spacing) * 2);
  padding: calc(var(--media-spacing) * 2) calc(var(--media-spacing) * 2) calc(var(--media-spacing) * 1.5);
  text-shadow: inherit;
  flex-direction: column;
  display: flex;
}

.media-default-skin--video .media-dialog__title {
  font-size: var(--media-font-size-medium);
}

.media-default-skin--video .media-slider__value {
  text-shadow: 0 1px 0 var(--media-shadow-current-color);
}

.media-default-skin--video .media-controls--root {
  --media-inset-factor: 2;
  --media-inset: calc(var(--media-spacing) * var(--media-inset-factor));
  --media-base-boundary-offset: var(--media-inset-factor);
  z-index: 10;
  color: oklch(100% 0 0);
  transition-timing-function: var(--media-controls-transition-timing-function);
  transition-duration: calc(var(--media-controls-transition-duration) / 2);
  display: contents;

  & .media-controls--primary, & .media-controls--secondary {
    position: absolute;
  }

  & .media-controls--primary {
    z-index: 20;
  }

  & .media-controls--secondary {
    z-index: 10;
  }

  & .media-controls--primary {
    inset-inline: var(--media-inset);
    bottom: var(--media-inset);
    transform-origin: bottom;
  }

  & .media-controls--secondary {
    top: var(--media-inset);
    right: var(--media-inset);
    transform-origin: top;
    container-type: normal;
  }

  & .media-time-controls {
    padding-inline: calc(var(--media-spacing) * 2);
    flex: 1;
  }

  @container media-root (width < 32rem) {
    & .media-controls--primary, & .media-controls--secondary {
      transition-timing-function: inherit;
      transition-duration: inherit;

      @media (pointer: fine) {
        transition-property: filter, opacity, scale, translate;
      }

      @media (pointer: coarse) {
        transition-property: opacity, scale, translate;
      }
    }

    &:after {
      display: none;
    }

    &:not([data-visible]) {
      & .media-controls--primary, & .media-controls--secondary {
        pointer-events: none;
        opacity: 0;
        transition-duration: var(--media-controls-transition-duration);
        scale: .95;

        @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
          filter: blur(8px);
        }

        @media (prefers-reduced-motion: reduce) {
          scale: 1;
        }
      }

      & .media-controls--primary {
        @media (prefers-reduced-motion: no-preference) {
          translate: 0 4px;
        }
      }

      & .media-controls--secondary {
        @media (prefers-reduced-motion: no-preference) {
          translate: 0 -4px;
        }
      }
    }

    & .media-button--captions {
      display: none;
    }
  }

  @container media-root (width >= 32rem) {
    inset-inline: var(--media-inset);
    bottom: var(--media-inset);
    transform-origin: bottom;
    display: flex;
    position: absolute;

    & .media-controls--primary, & .media-controls--secondary {
      display: contents;

      &:after {
        display: none;
      }
    }

    &:not([data-visible]) {
      pointer-events: none;
      opacity: 0;
      transition-duration: var(--media-controls-transition-duration);
      scale: .95;

      @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
        filter: blur(8px);
      }

      @media (prefers-reduced-motion: reduce) {
        scale: 1;
      }

      @media (prefers-reduced-motion: no-preference) {
        translate: 0 4px;
      }
    }

    & .media-time-controls {
      padding-inline: calc(var(--media-spacing) * 3);
    }
  }

  @media (pointer: fine) {
    transition-property: filter, opacity, scale, translate;
  }

  @media (pointer: coarse) {
    transition-property: opacity, scale, translate;
  }

  @container media-root (width > 42rem) {
    --media-inset-factor: 3;
  }
}

.media-default-skin--video:has(.media-controls--root:not([data-visible])) {
  cursor: none;
}

.media-default-skin--video .media-slider__track {
  background-color: oklch(100% 0 0 / .2);
}
`;function id(){return`<media-container class="media-default-skin media-default-skin--video"><slot name="media"></slot><slot></slot><media-poster><slot name="poster"><img alt="" decoding="async"></slot></media-poster><media-buffering-indicator class="media-buffering-indicator"> ${$(`spinner`,{class:`media-icon`})} </media-buffering-indicator><media-error-dialog><media-dialog-backdrop class="media-dialog__backdrop"></media-dialog-backdrop><media-dialog-popup class="media-dialog__popup media-surface"><div class="media-dialog__content"><media-dialog-title class="media-dialog__title"></media-dialog-title><media-dialog-description class="media-dialog__description"></media-dialog-description></div><div class="media-dialog__actions"><media-dialog-close class="media-button media-button--primary"></media-dialog-close></div></media-dialog-popup></media-error-dialog><media-controls><media-controls-backdrop class="media-controls__backdrop"></media-controls-backdrop><media-controls-content class="media-surface media-controls media-controls--root"><media-tooltip-group><media-controls-group class="media-surface media-controls media-controls--primary"><div class="media-button-group"><media-play-button commandfor="play-tooltip" class="media-button media-button--subtle media-button--icon media-button--play"> ${$(`restart`,{class:`media-icon media-icon--restart`})} ${$(`play`,{class:`media-icon media-icon--play`})} ${$(`pause`,{class:`media-icon media-icon--pause`})} </media-play-button><media-tooltip id="play-tooltip" side="top" class="media-surface media-tooltip"><media-tooltip-label></media-tooltip-label><media-tooltip-shortcut class="media-tooltip__kbd"></media-tooltip-shortcut></media-tooltip><media-mute-button commandfor="video-volume-popover" class="media-button media-button--subtle media-button--icon media-button--mute"> ${$(`volume-off`,{class:`media-icon media-icon--volume-off`})} ${$(`volume-low`,{class:`media-icon media-icon--volume-low`})} ${$(`volume-high`,{class:`media-icon media-icon--volume-high`})} </media-mute-button><media-popover id="video-volume-popover" open-on-hover delay="200" close-delay="100" side="top" class="media-surface media-popover media-popover--volume"><media-volume-slider class="media-slider" orientation="vertical" thumb-alignment="edge"><media-slider-track class="media-slider__track"><media-slider-fill class="media-slider__fill"></media-slider-fill></media-slider-track><media-slider-thumb class="media-slider__thumb media-slider__thumb--persistent"></media-slider-thumb></media-volume-slider></media-popover></div><div class="media-time-controls"><media-time type="current" class="media-time"></media-time><media-time-slider class="media-slider"><media-time-slider-chapters class="media-slider__chapters"><template><div class="media-slider__chapter"><media-slider-track class="media-slider__track media-slider__chapter-track"><media-slider-buffer class="media-slider__buffer"></media-slider-buffer><media-slider-fill class="media-slider__fill"></media-slider-fill></media-slider-track></div></template></media-time-slider-chapters><media-slider-thumb class="media-slider__thumb"></media-slider-thumb><media-slider-preview overflow="visible" class="media-slider__preview"><div class="media-surface media-thumbnail media-slider__thumbnail"><media-slider-thumbnail class="media-thumbnail__image"></media-slider-thumbnail> ${$(`spinner`,{class:`media-thumbnail__spinner media-icon`})} </div><div class="media-slider__value"><media-time-slider-chapter-title class="media-slider__chapter-title"></media-time-slider-chapter-title><media-slider-value type="pointer" class="media-time"></media-slider-value></div></media-slider-preview></media-time-slider><media-time toggle type="remaining" class="media-time"></media-time></div><div class="media-button-group"><media-captions-button commandfor="captions-tooltip" class="media-button media-button--subtle media-button--icon media-button--captions"> ${$(`captions-off`,{class:`media-icon media-icon--captions-off`})} ${$(`captions-on`,{class:`media-icon media-icon--captions-on`})} </media-captions-button><media-tooltip id="captions-tooltip" side="top" class="media-surface media-tooltip"><media-tooltip-label></media-tooltip-label><media-tooltip-shortcut class="media-tooltip__kbd"></media-tooltip-shortcut></media-tooltip><button id="settings-trigger" commandfor="settings-menu" aria-labelledby="settings-label" class="media-button media-button--subtle media-button--icon media-button--settings"> ${$(`gear`,{class:`media-icon media-icon--settings`})} ${Q(qi,{id:`settings-label`,class:`media-sr-only`})} </button><media-menu id="settings-menu" side="top" align="center" class="media-surface media-popover media-menu media-menu--settings"><media-menu-content class="media-menu__content"><media-menu-item commandfor="settings-quality-menu" class="media-menu__item media-menu__item--submenu"> ${$(`switches`,{class:`media-icon`})} ${Q(Ji)} <span class="media-menu__hint"><bdi data-part="hint" dir="auto" class="media-menu__hint-label"></bdi> ${$(`chevron`,{class:`media-icon media-menu__chevron`})} </span></media-menu-item><media-menu-item commandfor="settings-audio-menu" class="media-menu__item media-menu__item--submenu"> ${$(`speech`,{class:`media-icon`})} ${Q(Yi)} <span class="media-menu__hint"><bdi data-part="hint" dir="auto" class="media-menu__hint-label"></bdi> ${$(`chevron`,{class:`media-icon media-menu__chevron`})} </span></media-menu-item><media-menu-item commandfor="settings-speed-menu" class="media-menu__item media-menu__item--submenu"> ${$(`speed`,{class:`media-icon`})} ${Q(Xi)} <span class="media-menu__hint"><bdi data-part="hint" dir="auto" class="media-menu__hint-label"></bdi> ${$(`chevron`,{class:`media-icon media-menu__chevron`})} </span></media-menu-item><media-menu-item commandfor="settings-captions-menu" class="media-menu__item media-menu__item--submenu"> ${$(`captions-off`,{class:`media-icon`})} ${Q(Zi)} <span class="media-menu__hint"><bdi data-part="hint" dir="auto" class="media-menu__hint-label"></bdi> ${$(`chevron`,{class:`media-icon media-menu__chevron`})} </span></media-menu-item></media-menu-content><media-menu-content id="settings-quality-menu" class="media-menu__panel"><media-menu-item class="media-menu__back"> ${$(`chevron`,{class:`media-icon media-menu__chevron media-icon--flipped`})} ${Q(Ji)} </media-menu-item><div class="media-menu__separator"></div><media-quality-radio-group class="media-menu__group"><template><media-menu-radio-item class="media-menu__item"><span><bdi data-part="label" dir="auto"></bdi><sup data-part="tier" class="media-menu__tier"></sup></span><span data-part="badge" class="media-badge"></span><media-menu-item-indicator force-mount class="media-menu__indicator"> ${$(`check`,{class:`media-icon`})} </media-menu-item-indicator></media-menu-radio-item></template></media-quality-radio-group></media-menu-content><media-menu-content id="settings-audio-menu" class="media-menu__panel"><media-menu-item class="media-menu__back"> ${$(`chevron`,{class:`media-icon media-menu__chevron media-icon--flipped`})} ${Q(Yi)} </media-menu-item><div class="media-menu__separator"></div><media-audio-track-radio-group class="media-menu__group"><template><media-menu-radio-item class="media-menu__item"><bdi data-part="label" dir="auto"></bdi><media-menu-item-indicator force-mount class="media-menu__indicator"> ${$(`check`,{class:`media-icon`})} </media-menu-item-indicator></media-menu-radio-item></template></media-audio-track-radio-group></media-menu-content><media-menu-content id="settings-speed-menu" class="media-menu__panel"><media-menu-item class="media-menu__back"> ${$(`chevron`,{class:`media-icon media-menu__chevron media-icon--flipped`})} ${Q(Xi)} </media-menu-item><div class="media-menu__separator"></div><media-playback-rate-radio-group class="media-menu__group"><template><media-menu-radio-item class="media-menu__item"><bdi data-part="label" dir="auto"></bdi><media-menu-item-indicator force-mount class="media-menu__indicator"> ${$(`check`,{class:`media-icon`})} </media-menu-item-indicator></media-menu-radio-item></template></media-playback-rate-radio-group></media-menu-content><media-menu-content id="settings-captions-menu" class="media-menu__panel"><media-menu-item class="media-menu__back"> ${$(`chevron`,{class:`media-icon media-menu__chevron media-icon--flipped`})} ${Q(Zi)} </media-menu-item><div class="media-menu__separator"></div><media-captions-radio-group class="media-menu__group"><template><media-menu-radio-item class="media-menu__item"><bdi data-part="label" dir="auto"></bdi><media-menu-item-indicator force-mount class="media-menu__indicator"> ${$(`check`,{class:`media-icon`})} </media-menu-item-indicator></media-menu-radio-item></template></media-captions-radio-group></media-menu-content></media-menu><media-tooltip id="settings-tooltip" trigger="settings-trigger" side="top" class="media-surface media-tooltip"> ${Q(qi)} </media-tooltip></div></media-controls-group><media-controls-group class="media-surface media-controls media-controls--secondary"><div class="media-button-group"><media-cast-button commandfor="cast-tooltip" class="media-button media-button--subtle media-button--icon media-button--cast"> ${$(`cast-enter`,{class:`media-icon media-icon--cast-enter`})} ${$(`cast-exit`,{class:`media-icon media-icon--cast-exit`})} </media-cast-button><media-tooltip id="cast-tooltip" side="top" class="media-surface media-tooltip"><media-tooltip-label></media-tooltip-label><media-tooltip-shortcut class="media-tooltip__kbd"></media-tooltip-shortcut></media-tooltip><media-airplay-button commandfor="airplay-tooltip" class="media-button media-button--subtle media-button--icon media-button--airplay"> ${$(`airplay-enter`,{class:`media-icon media-icon--airplay-enter`})} ${$(`airplay-exit`,{class:`media-icon media-icon--airplay-exit`})} </media-airplay-button><media-tooltip id="airplay-tooltip" side="top" class="media-surface media-tooltip"><media-tooltip-label></media-tooltip-label><media-tooltip-shortcut class="media-tooltip__kbd"></media-tooltip-shortcut></media-tooltip><media-pip-button commandfor="pip-tooltip" class="media-button media-button--subtle media-button--icon media-button--pip"> ${$(`pip-enter`,{class:`media-icon media-icon--pip-enter`})} ${$(`pip-exit`,{class:`media-icon media-icon--pip-exit`})} </media-pip-button><media-tooltip id="pip-tooltip" side="top" class="media-surface media-tooltip"><media-tooltip-label></media-tooltip-label><media-tooltip-shortcut class="media-tooltip__kbd"></media-tooltip-shortcut></media-tooltip><media-fullscreen-button commandfor="fullscreen-tooltip" class="media-button media-button--subtle media-button--icon media-button--fullscreen"> ${$(`fullscreen-enter`,{class:`media-icon media-icon--fullscreen-enter`})} ${$(`fullscreen-exit`,{class:`media-icon media-icon--fullscreen-exit`})} </media-fullscreen-button><media-tooltip id="fullscreen-tooltip" side="top" class="media-surface media-tooltip"><media-tooltip-label></media-tooltip-label><media-tooltip-shortcut class="media-tooltip__kbd"></media-tooltip-shortcut></media-tooltip></div></media-controls-group></media-tooltip-group></media-controls-content></media-controls><media-hotkey keys="Space" action="togglePaused"></media-hotkey><media-hotkey keys="k" action="togglePaused"></media-hotkey><media-hotkey keys="m" action="toggleMuted"></media-hotkey><media-hotkey keys="f" action="toggleFullscreen"></media-hotkey><media-hotkey keys="c" action="toggleSubtitles"></media-hotkey><media-hotkey keys="i" action="togglePictureInPicture"></media-hotkey><media-hotkey keys="ArrowRight" action="seekStep" value="5"></media-hotkey><media-hotkey keys="ArrowLeft" action="seekStep" value="-5"></media-hotkey><media-hotkey keys="l" action="seekStep" value="10"></media-hotkey><media-hotkey keys="j" action="seekStep" value="-10"></media-hotkey><media-hotkey keys="ArrowUp" action="volumeStep" value="0.05"></media-hotkey><media-hotkey keys="ArrowDown" action="volumeStep" value="-0.05"></media-hotkey><media-hotkey keys="0-9" action="seekToPercent"></media-hotkey><media-hotkey keys="Home" action="seekToPercent" value="0"></media-hotkey><media-hotkey keys="End" action="seekToPercent" value="100"></media-hotkey><media-hotkey keys=">" action="speedUp"></media-hotkey><media-hotkey keys="<" action="speedDown"></media-hotkey><media-gesture type="tap" action="togglePaused" pointer="mouse" region="center"></media-gesture><media-gesture type="tap" action="toggleControls" pointer="touch"></media-gesture><media-gesture type="doubletap" action="seekStep" value="-10" region="left"></media-gesture><media-gesture type="doubletap" action="toggleFullscreen" region="center"></media-gesture><media-gesture type="doubletap" action="seekStep" value="10" region="right"></media-gesture><media-status-announcer class="media-sr-only"></media-status-announcer><div class="media-input-indicator"><media-volume-indicator hidden class="media-surface media-volume-indicator"><media-volume-indicator-fill class="media-volume-indicator__content"> ${$(`volume-high`,{class:`media-icon media-icon--volume-high`})} ${$(`volume-low`,{class:`media-icon media-icon--volume-low`})} ${$(`volume-off`,{class:`media-icon media-icon--volume-off`})} <media-volume-indicator-value class="media-volume-indicator__value"></media-volume-indicator-value></media-volume-indicator-fill></media-volume-indicator><media-status-indicator hidden actions="toggleSubtitles toggleFullscreen togglePictureInPicture" class="media-surface media-status-indicator media-status-indicator--state" ><div class="media-status-indicator__content"> ${$(`captions-on`,{class:`media-icon media-icon--captions-on`})} ${$(`captions-off`,{class:`media-icon media-icon--captions-off`})} ${$(`fullscreen-enter`,{class:`media-icon media-icon--fullscreen-enter`})} ${$(`fullscreen-exit`,{class:`media-icon media-icon--fullscreen-exit`})} ${$(`pip-enter`,{class:`media-icon media-icon--pip-enter`})} ${$(`pip-exit`,{class:`media-icon media-icon--pip-exit`})} <media-status-indicator-value class="media-status-indicator__value"></media-status-indicator-value></div></media-status-indicator><media-seek-indicator hidden class="media-seek-indicator"> ${$(`chevron`,{class:`media-icon media-icon--seek`})} <media-seek-indicator-value class="media-seek-indicator__value"></media-seek-indicator-value></media-seek-indicator><media-status-indicator hidden actions="togglePaused" class="media-status-indicator media-status-indicator--playback"> ${$(`play`,{class:`media-icon media-icon--play`})} ${$(`pause`,{class:`media-icon media-icon--pause`})} </media-status-indicator></div></media-container>`}var ad=class extends td{static{this.tagName=`video-skin`}static{this.styles=Lt(rd)}static{this.template=zt(id())}};t(ad);
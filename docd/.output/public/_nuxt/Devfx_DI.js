import{a as e,g as t,m as n,v as r,x as i}from"./TaW9hdCO.js";import{a,n as o,r as s}from"./C2VvAmt_.js";function c(e){return t=>{class n extends t{#e=null;#t=null;getMediaTarget(){return this}connectedCallback(){super.connectedCallback?.(),this.dispatchEvent(new i(e,this,(e,t)=>{t&&(this.#t=t),this.#e?.(),this.#e=null;let n=this.getMediaTarget();this.isConnected&&e&&n&&(this.#e=e.registerMedia(n))},!1))}disconnectedCallback(){this.#e?.(),this.#e=null,this.#t?.(),this.#t=null,super.disconnectedCallback?.()}}return n}}var l=c(r);function u(e,r){if(Object.is(e,r))return!0;if(Array.isArray(e)||Array.isArray(r))return Array.isArray(e)&&Array.isArray(r)&&e.length===r.length&&e.every((e,t)=>u(e,r[t]));if(!n(e)||!n(r))return!1;let i=Object.keys(e).filter(n=>!t(e[n])),a=Object.keys(r).filter(e=>!t(r[e]));return i.length===a.length&&i.every(t=>u(e[t],r[t]))}function d(e,t){let n={};for(let r in e)t.includes(r)||(n[r]=e[r]);return n}var f={borderRadius:`--media-video-border-radius`,objectFit:`--media-object-fit`,objectPosition:`--media-object-position`,captionTrackDuration:`--media-caption-track-duration`,captionTrackDelay:`--media-caption-track-delay`,captionTrackY:`--media-caption-track-y`};function p(e){return`
    <style>
      :host {
        display: contents;
      }

      video {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: var(${f.borderRadius});
        object-fit: var(${f.objectFit}, contain);
        object-position: var(${f.objectPosition}, center);
      }

      video::-webkit-media-text-track-container {
        transition: translate var(${f.captionTrackDuration}, 0) ease-out;
        transition-delay: var(${f.captionTrackDelay}, 0);
        translate: 0 var(${f.captionTrackY}, 0);
        scale: 0.98;
        z-index: 1;
        font-family: inherit;
      }
    </style>
    <slot name="media">
      <video${a(e)}></video>
    </slot>
    <slot></slot>
  `}function m(e){return t=>`
      <style>
        :host {
          display: inline-flex;
          line-height: 0;
          flex-direction: column;
          justify-content: end;
        }

        ${e} {
          width: 100%;
        }
      </style>
      <slot name="media">
        <${e}${a(t)}></${e}>
      </slot>
      <slot></slot>
    `}var h=[`attach`,`detach`,`destroy`];function g(t,n){let r=t!==`iframe`,i=new Map,a=!1;class c extends (globalThis.HTMLElement??class{}){static getTemplateHTML=t.endsWith(`video`)?p:m(t);static shadowRootOptions={mode:`open`};static properties={autoPictureInPicture:{type:Boolean},autoplay:{type:Boolean},controls:{type:Boolean},controlsList:{type:String},crossOrigin:{type:String},defaultMuted:{type:Boolean,attribute:`muted`},disablePictureInPicture:{type:Boolean},disableRemotePlayback:{type:Boolean},loading:{type:String},loop:{type:Boolean},playsInline:{type:Boolean},poster:{type:String,empty:``},preload:{type:String,empty:null},src:{type:String,empty:``},streamType:{type:String,attribute:`stream-type`,empty:`unknown`}};static get observedAttributes(){return c.#e(this),[..._(this.properties)]}static#e(t){if(a)return;a=!0;let r=t.properties;for(let a=n.prototype;a&&a!==Object.prototype;a=Object.getPrototypeOf(a))for(let n of Object.getOwnPropertyNames(a)){if(n in c.prototype||h.includes(n))continue;let o=r[n];if(o&&(o.attribute??n.toLowerCase())!==e(n))continue;let s=Object.getOwnPropertyDescriptor(a,n);if(!s)continue;let l={enumerable:!0,configurable:!0};if(typeof s.value==`function`)l.value=function(...e){return this.#t[n](...e)};else if(s.get&&(l.get=function(){return this.#t[n]},s.set)){let r=e(n);t.observedAttributes.includes(r)?(i.set(r,n),l.set=function(e){e===!0||e===!1||e==null?this.toggleAttribute(r,!!e):this.setAttribute(r,String(e))}):l.set=function(e){this.#t[n]=e}}Object.defineProperty(c.prototype,n,l)}for(let[e,{type:t,attribute:n}]of Object.entries(r)){if(e in c.prototype)continue;let r=n??e.toLowerCase();Object.defineProperty(c.prototype,e,{get:function(){return t===Boolean?this.hasAttribute(r):this.getAttribute(r)},set:function(e){t===Boolean?this.toggleAttribute(r,!!e):this.setAttribute(r,e)},enumerable:!0,configurable:!0})}}#t;#n=new Set;#r=new Map;#i;constructor(){if(super(),!this.shadowRoot){let e=this.constructor;this.attachShadow(e.shadowRootOptions);let n=_(e.properties),a=[...i.keys()],c=o(s(this.attributes),n),l=r?d(c,a):c;t&&!l.part&&(l.part=t),this.shadowRoot.innerHTML=e.getTemplateHTML(l)}this.#t=new n,this.#a(),this.#i=new MutationObserver(this.#c.bind(this)),this.shadowRoot.addEventListener(`slotchange`,()=>{this.#a(),this.#s()}),this.#s()}#a(){let e=this.target;e!==this.#t.target&&(this.#t.target&&this.#t.detach(),this.#t.attach(e))}get host(){return this.#t}get target(){return this.querySelector(`:scope > [slot=media]`)??this.querySelector(t)??this.shadowRoot?.querySelector(t)??null}connectedCallback(){t===`iframe`&&(this.hasAttribute(`data-cross-origin-frame`)||this.setAttribute(`data-cross-origin-frame`,``))}disconnectedCallback(){this.hasAttribute(`keep-alive`)||queueMicrotask(()=>{this.isConnected||this.#t.destroy()})}addEventListener(e,t,n){super.addEventListener(e,t,n),this.#n.has(e)||(this.#n.add(e),this.#t.addEventListener(e,this.#o))}removeEventListener(e,t,n){super.removeEventListener(e,t,n)}#o=e=>{e.composed||this.dispatchEvent(new e.constructor(e.type,e))};attributeChangedCallback(e,t,n){let a=i.get(e);if(a){if(t!==n){let e=typeof this.#t[a],t=this.constructor.properties[a],r=t&&`empty`in t?t.empty:``;this.#t[a]=e===`boolean`?n!==null:e===`number`?Number(n):n??r}return}(c.observedAttributes.includes(e)||!this.constructor.observedAttributes.includes(e))&&r&&(n===null?this.target?.removeAttribute(e):this.target?.getAttribute(e)!==n&&this.target?.setAttribute(e,n))}#s(){if(t===`iframe`)return;let e=this.shadowRoot?.querySelector(`slot:not([name])`),n=new Set(e?.assignedElements({flatten:!0}).filter(e=>e.localName===`track`||e.localName===`source`));for(let[e,t]of this.#r)n.has(e)||(t.remove(),this.#r.delete(e));for(let e of n){let t=this.#r.get(e);t||(t=e.cloneNode(),this.#r.set(e,t),this.#i?.observe(e,{attributes:!0})),this.target?.append(t),this.#l(t)}}#c(e){for(let t of e)if(t.type===`attributes`){let{target:e,attributeName:n}=t,r=this.#r.get(e);r&&n&&(r.setAttribute(n,e.getAttribute(n)??``),this.#l(r))}}#l(e){e&&e.localName===`track`&&e.default&&(e.kind===`chapters`||e.kind===`metadata`)&&e.track.mode===`disabled`&&(e.track.mode=`hidden`)}}return c}function _(e){return Object.keys(e).map(t=>e[t]?.attribute??t.toLowerCase())}export{u as n,l as r,g as t};
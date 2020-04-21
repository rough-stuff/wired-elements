var WiredElements=function(e){"use strict";const t=new WeakMap,i=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,r=(e,t,i=null)=>{for(;t!==i;){const i=t.nextSibling;e.removeChild(t),t=i}},o={},n={},a=`{{lit-${String(Math.random()).slice(2)}}}`,d=`\x3c!--${a}--\x3e`,l=new RegExp(`${a}|${d}`);class h{constructor(e,t){this.parts=[],this.element=t;const i=[],s=[],r=document.createTreeWalker(t.content,133,null,!1);let o=0,n=-1,d=0;const{strings:h,values:{length:p}}=e;for(;d<p;){const e=r.nextNode();if(null!==e){if(n++,1===e.nodeType){if(e.hasAttributes()){const t=e.attributes,{length:i}=t;let s=0;for(let e=0;e<i;e++)c(t[e].name,"$lit$")&&s++;for(;s-- >0;){const t=h[d],i=f.exec(t)[2],s=i.toLowerCase()+"$lit$",r=e.getAttribute(s);e.removeAttribute(s);const o=r.split(l);this.parts.push({type:"attribute",index:n,name:i,strings:o}),d+=o.length-1}}"TEMPLATE"===e.tagName&&(s.push(e),r.currentNode=e.content)}else if(3===e.nodeType){const t=e.data;if(t.indexOf(a)>=0){const s=e.parentNode,r=t.split(l),o=r.length-1;for(let t=0;t<o;t++){let i,o=r[t];if(""===o)i=u();else{const e=f.exec(o);null!==e&&c(e[2],"$lit$")&&(o=o.slice(0,e.index)+e[1]+e[2].slice(0,-"$lit$".length)+e[3]),i=document.createTextNode(o)}s.insertBefore(i,e),this.parts.push({type:"node",index:++n})}""===r[o]?(s.insertBefore(u(),e),i.push(e)):e.data=r[o],d+=o}}else if(8===e.nodeType)if(e.data===a){const t=e.parentNode;null!==e.previousSibling&&n!==o||(n++,t.insertBefore(u(),e)),o=n,this.parts.push({type:"node",index:n}),null===e.nextSibling?e.data="":(i.push(e),n--),d++}else{let t=-1;for(;-1!==(t=e.data.indexOf(a,t+1));)this.parts.push({type:"node",index:-1}),d++}}else r.currentNode=s.pop()}for(const e of i)e.parentNode.removeChild(e)}}const c=(e,t)=>{const i=e.length-t.length;return i>=0&&e.slice(i)===t},p=e=>-1!==e.index,u=()=>document.createComment(""),f=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class g{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this.__parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],i=this.template.parts,r=document.createTreeWalker(e,133,null,!1);let o,n=0,a=0,d=r.nextNode();for(;n<i.length;)if(o=i[n],p(o)){for(;a<o.index;)a++,"TEMPLATE"===d.nodeName&&(t.push(d),r.currentNode=d.content),null===(d=r.nextNode())&&(r.currentNode=t.pop(),d=r.nextNode());if("node"===o.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(d.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(d,o.name,o.strings,this.options));n++}else this.__parts.push(void 0),n++;return s&&(document.adoptNode(e),customElements.upgrade(e)),e}}const y=` ${a} `;class b{constructor(e,t,i,s){this.strings=e,this.values=t,this.type=i,this.processor=s}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let s=0;s<e;s++){const e=this.strings[s],r=e.lastIndexOf("\x3c!--");i=(r>-1||i)&&-1===e.indexOf("--\x3e",r+1);const o=f.exec(e);t+=null===o?e+(i?y:d):e.substr(0,o.index)+o[1]+o[2]+"$lit$"+o[3]+a}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}const v=e=>null===e||!("object"==typeof e||"function"==typeof e),m=e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]);class w{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let e=0;e<i.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new x(this)}_getValue(){const e=this.strings,t=e.length-1;let i="";for(let s=0;s<t;s++){i+=e[s];const t=this.parts[s];if(void 0!==t){const e=t.value;if(v(e)||!m(e))i+="string"==typeof e?e:String(e);else for(const t of e)i+="string"==typeof t?t:String(t)}}return i+=e[t],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===o||v(e)&&e===this.value||(this.value=e,i(e)||(this.committer.dirty=!0))}commit(){for(;i(this.value);){const e=this.value;this.value=o,e(this)}this.value!==o&&this.committer.commit()}}class k{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(u()),this.endNode=e.appendChild(u())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=u()),e.__insert(this.endNode=u())}insertAfterPart(e){e.__insert(this.startNode=u()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;i(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=o,e(this)}const e=this.__pendingValue;e!==o&&(v(e)?e!==this.value&&this.__commitText(e):e instanceof b?this.__commitTemplateResult(e):e instanceof Node?this.__commitNode(e):m(e)?this.__commitIterable(e):e===n?(this.value=n,this.clear()):this.__commitText(e))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,i="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof g&&this.value.template===t)this.value.update(e.values);else{const i=new g(t,e.processor,this.options),s=i._clone();i.update(e.values),this.__commitNode(s),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,s=0;for(const r of e)i=t[s],void 0===i&&(i=new k(this.options),t.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(t[s-1])),i.setValue(r),i.commit(),s++;s<t.length&&(t.length=s,this.clear(i&&i.endNode))}clear(e=this.startNode){r(this.startNode.parentNode,e.nextSibling,this.endNode)}}class S{constructor(e,t,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this.__pendingValue=e}commit(){for(;i(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=o,e(this)}if(this.__pendingValue===o)return;const e=!!this.__pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=e),this.__pendingValue=o}}class R extends w{constructor(e,t,i){super(e,t,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new _(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class _ extends x{}let C=!1;try{const e={get capture(){return C=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}class O{constructor(e,t,i){this.value=void 0,this.__pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this.__boundHandleEvent=e=>this.handleEvent(e)}setValue(e){this.__pendingValue=e}commit(){for(;i(this.__pendingValue);){const e=this.__pendingValue;this.__pendingValue=o,e(this)}if(this.__pendingValue===o)return;const e=this.__pendingValue,t=this.value,s=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),r=null!=e&&(null==t||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),r&&(this.__options=z(e),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=e,this.__pendingValue=o}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const z=e=>e&&(C?{capture:e.capture,passive:e.passive,once:e.once}:e.capture);const M=new class{handleAttributeExpressions(e,t,i,s){const r=t[0];if("."===r){return new R(e,t.slice(1),i).parts}return"@"===r?[new O(e,t.slice(1),s.eventContext)]:"?"===r?[new S(e,t.slice(1),i)]:new w(e,t,i).parts}handleTextExpression(e){return new k(e)}};function W(e){let t=N.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},N.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const s=e.strings.join(a);return i=t.keyString.get(s),void 0===i&&(i=new h(e,e.getTemplateElement()),t.keyString.set(s,i)),t.stringsArray.set(e.strings,i),i}const N=new Map,$=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const P=(e,...t)=>new b(e,t,"html",M);function j(e,t){const{element:{content:i},parts:s}=e,r=document.createTreeWalker(i,133,null,!1);let o=T(s),n=s[o],a=-1,d=0;const l=[];let h=null;for(;r.nextNode();){a++;const e=r.currentNode;for(e.previousSibling===h&&(h=null),t.has(e)&&(l.push(e),null===h&&(h=e)),null!==h&&d++;void 0!==n&&n.index===a;)n.index=null!==h?-1:n.index-d,o=T(s,o),n=s[o]}l.forEach(e=>e.parentNode.removeChild(e))}const A=e=>{let t=11===e.nodeType?0:1;const i=document.createTreeWalker(e,133,null,!1);for(;i.nextNode();)t++;return t},T=(e,t=-1)=>{for(let i=t+1;i<e.length;i++){const t=e[i];if(p(t))return i}return-1};const I=(e,t)=>`${e}--${t}`;let E=!0;void 0===window.ShadyCSS?E=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),E=!1);const D=e=>t=>{const i=I(t.type,e);let s=N.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},N.set(i,s));let r=s.stringsArray.get(t.strings);if(void 0!==r)return r;const o=t.strings.join(a);if(r=s.keyString.get(o),void 0===r){const i=t.getTemplateElement();E&&window.ShadyCSS.prepareTemplateDom(i,e),r=new h(t,i),s.keyString.set(o,r)}return s.stringsArray.set(t.strings,r),r},L=["html","svg"],B=new Set,V=(e,t,i)=>{B.add(e);const s=i?i.element:document.createElement("template"),r=t.querySelectorAll("style"),{length:o}=r;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(s,e);const n=document.createElement("style");for(let e=0;e<o;e++){const t=r[e];t.parentNode.removeChild(t),n.textContent+=t.textContent}(e=>{L.forEach(t=>{const i=N.get(I(t,e));void 0!==i&&i.keyString.forEach(e=>{const{element:{content:t}}=e,i=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{i.add(e)}),j(e,i)})})})(e);const a=s.content;i?function(e,t,i=null){const{element:{content:s},parts:r}=e;if(null==i)return void s.appendChild(t);const o=document.createTreeWalker(s,133,null,!1);let n=T(r),a=0,d=-1;for(;o.nextNode();){for(d++,o.currentNode===i&&(a=A(t),i.parentNode.insertBefore(t,i));-1!==n&&r[n].index===d;){if(a>0){for(;-1!==n;)r[n].index+=a,n=T(r,n);return}n=T(r,n)}}}(i,n,a.firstChild):a.insertBefore(n,a.firstChild),window.ShadyCSS.prepareTemplateStyles(s,e);const d=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==d)t.insertBefore(d.cloneNode(!0),t.firstChild);else if(i){a.insertBefore(n,a.firstChild);const e=new Set;e.add(n),j(i,e)}};window.JSCompiler_renameProperty=(e,t)=>e;const H={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},U=(e,t)=>t!==e&&(t==t||e==e),F={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:U},q=Promise.resolve(!0);class Y extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=q,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,i)=>{const s=this._attributeNameForProperty(i,t);void 0!==s&&(this._attributeToPropertyMap.set(s,i),e.push(s))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=F){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const i="symbol"==typeof e?Symbol():`__${e}`;Object.defineProperty(this.prototype,e,{get(){return this[i]},set(t){const s=this[e];this[i]=t,this._requestUpdate(e,s)},configurable:!0,enumerable:!0})}static finalize(){const e=Object.getPrototypeOf(this);if(e.hasOwnProperty("finalized")||e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const i of t)this.createProperty(i,e[i])}}static _attributeNameForProperty(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=U){return i(e,t)}static _propertyValueFromAttribute(e,t){const i=t.type,s=t.converter||H,r="function"==typeof s?s:s.fromAttribute;return r?r(e,i):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const i=t.type,s=t.converter;return(s&&s.toAttribute||H.toAttribute)(e,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this._updateState=32|this._updateState,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=F){const s=this.constructor,r=s._attributeNameForProperty(e,i);if(void 0!==r){const e=s._propertyValueToAttribute(t,i);if(void 0===e)return;this._updateState=8|this._updateState,null==e?this.removeAttribute(r):this.setAttribute(r,e),this._updateState=-9&this._updateState}}_attributeToProperty(e,t){if(8&this._updateState)return;const i=this.constructor,s=i._attributeToPropertyMap.get(e);if(void 0!==s){const e=i._classProperties.get(s)||F;this._updateState=16|this._updateState,this[s]=i._propertyValueFromAttribute(t,e),this._updateState=-17&this._updateState}}_requestUpdate(e,t){let i=!0;if(void 0!==e){const s=this.constructor,r=s._classProperties.get(e)||F;s._valueHasChanged(this[e],t,r.hasChanged)?(this._changedProperties.has(e)||this._changedProperties.set(e,t),!0!==r.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,r))):i=!1}!this._hasRequestedUpdate&&i&&this._enqueueUpdate()}requestUpdate(e,t){return this._requestUpdate(e,t),this.updateComplete}async _enqueueUpdate(){let e,t;this._updateState=4|this._updateState;const i=this._updatePromise;this._updatePromise=new Promise((i,s)=>{e=i,t=s});try{await i}catch(e){}this._hasConnected||await new Promise(e=>this._hasConnectedResolver=e);try{const e=this.performUpdate();null!=e&&await e}catch(e){t(e)}e(!this._hasRequestedUpdate)}get _hasConnected(){return 32&this._updateState}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let e=!1;const t=this._changedProperties;try{e=this.shouldUpdate(t),e&&this.update(t)}catch(t){throw e=!1,t}finally{this._markUpdated()}e&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(t)),this.updated(t))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0)}updated(e){}firstUpdated(e){}}Y.finalized=!0;const X=e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:s}=t;return{kind:i,elements:s,finisher(t){window.customElements.define(e,t)}}})(e,t),G=(e,t)=>"method"!==t.kind||!t.descriptor||"value"in t.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}}:Object.assign({},t,{finisher(i){i.createProperty(t.key,e)}});function J(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):G(e,t)}function K(e){return(t,i)=>{const s={get(){return this.renderRoot.querySelector(e)},enumerable:!0,configurable:!0};return void 0!==i?Q(s,t,i):Z(s,t)}}const Q=(e,t,i)=>{Object.defineProperty(t,i,e)},Z=(e,t)=>({kind:"method",placement:"prototype",key:t.key,descriptor:e}),ee="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol();class ie{constructor(e,t){if(t!==te)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(ee?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const se=(e,...t)=>{const i=t.reduce((t,i,s)=>t+(e=>{if(e instanceof ie)return e.cssText;if("number"==typeof e)return e;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+e[s+1],e[0]);return new ie(i,te)};(window.litElementVersions||(window.litElementVersions=[])).push("2.2.1");const re=e=>e.flat?e.flat(1/0):function e(t,i=[]){for(let s=0,r=t.length;s<r;s++){const r=t[s];Array.isArray(r)?e(r,i):i.push(r)}return i}(e);class oe extends Y{static finalize(){super.finalize.call(this),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const e=this.styles,t=[];if(Array.isArray(e)){re(e).reduceRight((e,t)=>(e.add(t),e),new Set).forEach(e=>t.unshift(e))}else e&&t.push(e);return t}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?ee?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){super.update(e);const t=this.render();t instanceof b&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){}}oe.finalized=!0,oe.render=(e,t,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const s=i.scopeName,o=$.has(t),n=E&&11===t.nodeType&&!!t.host,a=n&&!B.has(s),d=a?document.createDocumentFragment():t;if(((e,t,i)=>{let s=$.get(t);void 0===s&&(r(t,t.firstChild),$.set(t,s=new k(Object.assign({templateFactory:W},i))),s.appendInto(t)),s.setValue(e),s.commit()})(e,d,Object.assign({templateFactory:D(s)},i)),a){const e=$.get(d);$.delete(d);const i=e.value instanceof g?e.value.template:void 0;V(s,d,i),r(t,t.firstChild),t.appendChild(d),$.set(t,e)}!o&&n&&window.ShadyCSS.styleElement(t.host)};var ne=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};const ae=se`
:host {
  opacity: 0;
}
:host(.wired-rendered) {
  opacity: 1;
}
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
svg {
  display: block;
}
path {
  stroke: currentColor;
  stroke-width: 0.7;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;class de extends oe{constructor(){super(...arguments),this.lastSize=[0,0]}updated(e){this.wiredRender()}wiredRender(e=!1){if(this.svg){const t=this.canvasSize();if(!e&&t[0]===this.lastSize[0]&&t[1]===this.lastSize[1])return;for(;this.svg.hasChildNodes();)this.svg.removeChild(this.svg.lastChild);this.svg.setAttribute("width",`${t[0]}`),this.svg.setAttribute("height",`${t[1]}`),this.draw(this.svg,t),this.lastSize=t,this.classList.add("wired-rendered")}}}(function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);o>3&&n&&Object.defineProperty(t,i,n)})([K("svg"),ne("design:type",SVGSVGElement)],de.prototype,"svg",void 0);class le{constructor(e,t){this.xi=Number.MAX_VALUE,this.yi=Number.MAX_VALUE,this.px1=e[0],this.py1=e[1],this.px2=t[0],this.py2=t[1],this.a=this.py2-this.py1,this.b=this.px1-this.px2,this.c=this.px2*this.py1-this.px1*this.py2,this._undefined=0===this.a&&0===this.b&&0===this.c}isUndefined(){return this._undefined}intersects(e){if(this.isUndefined()||e.isUndefined())return!1;let t=Number.MAX_VALUE,i=Number.MAX_VALUE,s=0,r=0;const o=this.a,n=this.b,a=this.c;return Math.abs(n)>1e-5&&(t=-o/n,s=-a/n),Math.abs(e.b)>1e-5&&(i=-e.a/e.b,r=-e.c/e.b),t===Number.MAX_VALUE?i===Number.MAX_VALUE?-a/o==-e.c/e.a&&(this.py1>=Math.min(e.py1,e.py2)&&this.py1<=Math.max(e.py1,e.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.py2>=Math.min(e.py1,e.py2)&&this.py2<=Math.max(e.py1,e.py2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=this.px1,this.yi=i*this.xi+r,!((this.py1-this.yi)*(this.yi-this.py2)<-1e-5||(e.py1-this.yi)*(this.yi-e.py2)<-1e-5)&&(!(Math.abs(e.a)<1e-5)||!((e.px1-this.xi)*(this.xi-e.px2)<-1e-5))):i===Number.MAX_VALUE?(this.xi=e.px1,this.yi=t*this.xi+s,!((e.py1-this.yi)*(this.yi-e.py2)<-1e-5||(this.py1-this.yi)*(this.yi-this.py2)<-1e-5)&&(!(Math.abs(o)<1e-5)||!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5))):t===i?s===r&&(this.px1>=Math.min(e.px1,e.px2)&&this.px1<=Math.max(e.py1,e.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.px2>=Math.min(e.px1,e.px2)&&this.px2<=Math.max(e.px1,e.px2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=(r-s)/(t-i),this.yi=t*this.xi+s,!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5||(e.px1-this.xi)*(this.xi-e.px2)<-1e-5))}}class he{constructor(e,t,i,s,r,o,n,a){this.deltaX=0,this.hGap=0,this.top=e,this.bottom=t,this.left=i,this.right=s,this.gap=r,this.sinAngle=o,this.tanAngle=a,Math.abs(o)<1e-4?this.pos=i+r:Math.abs(o)>.9999?this.pos=e+r:(this.deltaX=(t-e)*Math.abs(a),this.pos=i-Math.abs(this.deltaX),this.hGap=Math.abs(r/n),this.sLeft=new le([i,t],[i,e]),this.sRight=new le([s,t],[s,e]))}nextLine(){if(Math.abs(this.sinAngle)<1e-4){if(this.pos<this.right){const e=[this.pos,this.top,this.pos,this.bottom];return this.pos+=this.gap,e}}else if(Math.abs(this.sinAngle)>.9999){if(this.pos<this.bottom){const e=[this.left,this.pos,this.right,this.pos];return this.pos+=this.gap,e}}else{let e=this.pos-this.deltaX/2,t=this.pos+this.deltaX/2,i=this.bottom,s=this.top;if(this.pos<this.right+this.deltaX){for(;e<this.left&&t<this.left||e>this.right&&t>this.right;)if(this.pos+=this.hGap,e=this.pos-this.deltaX/2,t=this.pos+this.deltaX/2,this.pos>this.right+this.deltaX)return null;const r=new le([e,i],[t,s]);this.sLeft&&r.intersects(this.sLeft)&&(e=r.xi,i=r.yi),this.sRight&&r.intersects(this.sRight)&&(t=r.xi,s=r.yi),this.tanAngle>0&&(e=this.right-(e-this.left),t=this.right-(t-this.left));const o=[e,i,t,s];return this.pos+=this.hGap,o}}return null}}function ce(e,t){const i=[],s=new le([e[0],e[1]],[e[2],e[3]]);for(let e=0;e<t.length;e++){const r=new le(t[e],t[(e+1)%t.length]);s.intersects(r)&&i.push([s.xi,s.yi])}return i}function pe(e,t,i,s,r,o,n){return[-i*o-s*r+i+o*e+r*t,n*(i*r-s*o)+s+-n*r*e+n*o*t]}class ue{constructor(){this.p=""}get value(){return this.p.trim()}moveTo(e,t){this.p=`${this.p}M ${e} ${t} `}bcurveTo(e,t,i,s,r,o){this.p=`${this.p}C ${e} ${t}, ${i} ${s}, ${r} ${o} `}}function fe(e,t){const i=document.createElementNS("http://www.w3.org/2000/svg",e);if(t)for(const e in t)i.setAttributeNS(null,e,t[e]);return i}function ge(e,t){return 1*(Math.random()*(t-e)+e)}function ye(e,t,i,s,r){const o=Math.pow(e-i,2)+Math.pow(t-s,2);let n=2;n*n*100>o&&(n=Math.sqrt(o)/10);const a=n/2,d=.2+.2*Math.random();let l=1.7*(s-t)/200,h=1.7*(e-i)/200;l=ge(-l,l),h=ge(-h,h);const c=r||new ue;return c.moveTo(e+ge(-n,n),t+ge(-n,n)),c.bcurveTo(l+e+(i-e)*d+ge(-n,n),h+t+(s-t)*d+ge(-n,n),l+e+2*(i-e)*d+ge(-n,n),h+t+2*(s-t)*d+ge(-n,n),i+ge(-n,n),s+ge(-n,n)),c.moveTo(e+ge(-a,a),t+ge(-a,a)),c.bcurveTo(l+e+(i-e)*d+ge(-a,a),h+t+(s-t)*d+ge(-a,a),l+e+2*(i-e)*d+ge(-a,a),h+t+2*(s-t)*d+ge(-a,a),i+ge(-a,a),s+ge(-a,a)),c}function be(e,t,i,s,r=!1,o=!1,n){n=n||new ue;const a=Math.pow(e-i,2)+Math.pow(t-s,2);let d=2;d*d*100>a&&(d=Math.sqrt(a)/10);const l=d/2,h=.2+.2*Math.random();let c=1.7*(s-t)/200,p=1.7*(e-i)/200;return c=ge(-c,c),p=ge(-p,p),r&&n.moveTo(e+ge(-d,d),t+ge(-d,d)),o?n.bcurveTo(c+e+(i-e)*h+ge(-l,l),p+t+(s-t)*h+ge(-l,l),c+e+2*(i-e)*h+ge(-l,l),p+t+2*(s-t)*h+ge(-l,l),i+ge(-l,l),s+ge(-l,l)):n.bcurveTo(c+e+(i-e)*h+ge(-d,d),p+t+(s-t)*h+ge(-d,d),c+e+2*(i-e)*h+ge(-d,d),p+t+2*(s-t)*h+ge(-d,d),i+ge(-d,d),s+ge(-d,d)),n}function ve(e,t,i,s,r,o,n,a){const d=ge(-.5,.5)-Math.PI/2,l=[];l.push([ge(-o,o)+t+.9*s*Math.cos(d-e),ge(-o,o)+i+.9*r*Math.sin(d-e)]);for(let n=d;n<2*Math.PI+d-.01;n+=e)l.push([ge(-o,o)+t+s*Math.cos(n),ge(-o,o)+i+r*Math.sin(n)]);return l.push([ge(-o,o)+t+s*Math.cos(d+2*Math.PI+.5*n),ge(-o,o)+i+r*Math.sin(d+2*Math.PI+.5*n)]),l.push([ge(-o,o)+t+.98*s*Math.cos(d+n),ge(-o,o)+i+.98*r*Math.sin(d+n)]),l.push([ge(-o,o)+t+.9*s*Math.cos(d+.5*n),ge(-o,o)+i+.9*r*Math.sin(d+.5*n)]),function(e,t){const i=e.length;let s=t||new ue;if(i>3){const t=[],r=1;s.moveTo(e[1][0],e[1][1]);for(let o=1;o+2<i;o++){const i=e[o];t[0]=[i[0],i[1]],t[1]=[i[0]+(r*e[o+1][0]-r*e[o-1][0])/6,i[1]+(r*e[o+1][1]-r*e[o-1][1])/6],t[2]=[e[o+1][0]+(r*e[o][0]-r*e[o+2][0])/6,e[o+1][1]+(r*e[o][1]-r*e[o+2][1])/6],t[3]=[e[o+1][0],e[o+1][1]],s.bcurveTo(t[1][0],t[1][1],t[2][0],t[2][1],t[3][0],t[3][1])}}else 3===i?(s.moveTo(e[0][0],e[0][1]),s.bcurveTo(e[1][0],e[1][1],e[2][0],e[2][1],e[2][0],e[2][1])):2===i&&(s=ye(e[0][0],e[0][1],e[1][0],e[1][1],s));return s}(l,a)}function me(e,t,i,s,r){const o=fe("path",{d:ye(t,i,s,r).value});return e.appendChild(o),o}function we(e,t,i,s,r){r-=4;let o=ye(t+=2,i+=2,t+(s-=4),i);o=ye(t+s,i,t+s,i+r,o),o=ye(t+s,i+r,t,i+r,o),o=ye(t,i+r,t,i,o);const n=fe("path",{d:o.value});return e.appendChild(n),n}function xe(e,t,i,s,r){s=Math.max(s>10?s-4:s-1,1),r=Math.max(r>10?r-4:r-1,1);const o=2*Math.PI/9;let n=Math.abs(s/2),a=Math.abs(r/2);n+=ge(.05*-n,.05*n),a+=ge(.05*-a,.05*a);let d=ve(o,t,i,n,a,1,o*ge(.1,ge(.4,1)));d=ve(o,t,i,n,a,1.5,0,d);const l=fe("path",{d:d.value});return e.appendChild(l),l}function ke(e){const t=fe("g");let i=null;return e.forEach(e=>{me(t,e[0][0],e[0][1],e[1][0],e[1][1]),i&&me(t,i[0],i[1],e[0][0],e[0][1]),i=e[1]}),t}const Se={bowing:.85,curveStepCount:9,curveTightness:0,dashGap:0,dashOffset:0,fill:"#000",fillStyle:"hachure",fillWeight:1,hachureAngle:-41,hachureGap:5,maxRandomnessOffset:2,roughness:1,simplification:1,stroke:"#000",strokeWidth:2,zigzagOffset:0};function Re(e){return ke(function(e,t){const i=[];if(e&&e.length){let s=e[0][0],r=e[0][0],o=e[0][1],n=e[0][1];for(let t=1;t<e.length;t++)s=Math.min(s,e[t][0]),r=Math.max(r,e[t][0]),o=Math.min(o,e[t][1]),n=Math.max(n,e[t][1]);const a=t.hachureAngle;let d=t.hachureGap;d<0&&(d=4*t.strokeWidth),d=Math.max(d,.1);const l=a%180*(Math.PI/180),h=Math.cos(l),c=Math.sin(l),p=Math.tan(l),u=new he(o-1,n+1,s-1,r+1,d,c,h,p);let f;for(;null!=(f=u.nextLine());){const t=ce(f,e);for(let e=0;e<t.length;e++)if(e<t.length-1){const s=t[e],r=t[e+1];i.push([s,r])}}}return i}(e,Se))}function _e(e,t,i,s){return ke(function(e,t,i,s,r,o){const n=[];let a=Math.abs(s/2),d=Math.abs(r/2);a+=e.randOffset(.05*a,o),d+=e.randOffset(.05*d,o);const l=o.hachureAngle;let h=o.hachureGap;h<=0&&(h=4*o.strokeWidth);let c=o.fillWeight;c<0&&(c=o.strokeWidth/2);const p=l%180*(Math.PI/180),u=Math.tan(p),f=d/a,g=Math.sqrt(f*u*f*u+1),y=f*u/g,b=1/g,v=h/(a*d/Math.sqrt(d*b*(d*b)+a*y*(a*y))/a);let m=Math.sqrt(a*a-(t-a+v)*(t-a+v));for(let e=t-a+v;e<t+a;e+=v){m=Math.sqrt(a*a-(t-e)*(t-e));const s=pe(e,i-m,t,i,y,b,f),r=pe(e,i+m,t,i,y,b,f);n.push([s,r])}return n}({randOffset:(e,t)=>ge(-e,e)},e,t,i,s,Se))}function Ce(e,t,i,s=!0,r=!0){if(t){const o={bubbles:"boolean"!=typeof s||s,composed:"boolean"!=typeof r||r};i&&(o.detail=i);const n=window.SlickCustomEvent||CustomEvent;e.dispatchEvent(new n(t,o))}}var Oe=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},ze=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredButton=class extends de{constructor(){super(),this.elevation=1,this.disabled=!1,window.ResizeObserver&&(this.resizeObserver=new window.ResizeObserver(()=>{this.svg&&this.wiredRender(!0)}))}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          font-size: 14px;
        }
        path {
          transition: transform 0.05s ease;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px;
          color: inherit;
          outline: none;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button:active path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        button:focus path {
          stroke-width: 1.5;
        }
        button::-moz-focus-inner {
          border: 0;
        }
      `]}render(){return P`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `}focus(){this.button?this.button.focus():super.focus()}canvasSize(){if(this.button){const e=this.button.getBoundingClientRect(),t=Math.min(Math.max(1,this.elevation),5);return[e.width+2*(t-1),e.height+2*(t-1)]}return this.lastSize}draw(e,t){const i=Math.min(Math.max(1,this.elevation),5),s={width:t[0]-2*(i-1),height:t[1]-2*(i-1)};we(e,0,0,s.width,s.height);for(let t=1;t<i;t++)me(e,2*t,s.height+2*t,s.width+2*t,s.height+2*t).style.opacity=`${(75-10*t)/100}`,me(e,s.width+2*t,s.height+2*t,s.width+2*t,2*t).style.opacity=`${(75-10*t)/100}`,me(e,2*t,s.height+2*t,s.width+2*t,s.height+2*t).style.opacity=`${(75-10*t)/100}`,me(e,s.width+2*t,s.height+2*t,s.width+2*t,2*t).style.opacity=`${(75-10*t)/100}`}updated(){super.updated(),this.attachResizeListener()}disconnectedCallback(){this.detachResizeListener()}attachResizeListener(){this.button&&this.resizeObserver&&this.resizeObserver.observe&&this.resizeObserver.observe(this.button)}detachResizeListener(){this.button&&this.resizeObserver&&this.resizeObserver.unobserve&&this.resizeObserver.unobserve(this.button)}},Oe([J({type:Number}),ze("design:type",Object)],e.WiredButton.prototype,"elevation",void 0),Oe([J({type:Boolean,reflect:!0}),ze("design:type",Object)],e.WiredButton.prototype,"disabled",void 0),Oe([K("button"),ze("design:type",HTMLButtonElement)],e.WiredButton.prototype,"button",void 0),e.WiredButton=Oe([X("wired-button"),ze("design:paramtypes",[])],e.WiredButton);var Me=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},We=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCalendar=class extends oe{constructor(){super(...arguments),this.elevation=3,this.disabled=!1,this.initials=!1,this.format=e=>this.months_short[e.getMonth()]+" "+e.getDate()+", "+e.getFullYear(),this.weekdays_short=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],this.months=["January","February","March","April","May","June","July","August","September","October","November","December"],this.months_short=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],this.firstOfMonthDate=new Date,this.fDate=void 0,this.lDate=void 0,this.calendarRefSize={width:0,height:0},this.tblColWidth=0,this.tblRowHeight=0,this.tblHeadHeight=0,this.monthYear="",this.weeks=[[]]}connectedCallback(){super.connectedCallback(),this.resizeHandler||(this.resizeHandler=this.debounce(this.resized.bind(this),200,!1,this),window.addEventListener("resize",this.resizeHandler)),this.localizeCalendarHeaders(),this.setInitialConditions(),this.computeCalendar(),this.refreshSelection(),setTimeout(()=>this.updated())}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.resizeHandler&&(window.removeEventListener("resize",this.resizeHandler),delete this.resizeHandler)}static get styles(){return se`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      outline: none;
      opacity: 0;
    }

    :host(.wired-disabled) {
      opacity: 0.5 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.02);
    }

    :host(.wired-rendered) {
      opacity: 1;
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    svg {
      display: block;
    }

    .calendar path {
      stroke: var(--wired-calendar-color, black);
      stroke-width: 0.7;
      fill: transparent;
    }

    .selected path {
      stroke: var(--wired-calendar-selected-color, red);
      stroke-width: 2.5;
      fill: transparent;
      transition: transform 0.05s ease;
    }

    table {
      position: relative;
      background: var(--wired-calendar-bg, white);
      border-collapse: collapse;
      font-size: inherit;
      text-transform: capitalize;
      line-height: unset;
      cursor: default;
      overflow: hidden;
    }

    table:focus {
      outline: none !important;
    }

    td,
    th {
      border-radius: 4px;
      text-align: center;
    }

    td.disabled {
      color: var(--wired-calendar-disabled-color, lightgray);
      cursor: not-allowed;
    }

    td.dimmed {
      color: var(--wired-calendar-dimmed-color, gray);
    }

    td.selected {
      position: absolute;
    }

    td:not(.disabled):not(.selected):hover {
      background-color: #d0d0d0;
      cursor: pointer;
    }

    .pointer {
      cursor: pointer;
    }

    `}render(){return P`
    <table style="width:${this.calendarRefSize.width}px;height:${this.calendarRefSize.height}px;border:${8}px solid transparent"
            @mousedown="${this.onItemClick}"
            @touchstart="${this.onItemClick}">
      ${""}
      <tr class="top-header" style="height:${this.tblHeadHeight}px;">
        <th id="prevCal" class="pointer" @click="${this.onPrevClick}"><<</th>
        <th colSpan="5">${this.monthYear}</th>
        <th id="nextCal" class="pointer" @click="${this.onNextClick}">>></th>
      </tr>
      ${""}
      <tr class="header" style="height:${this.tblHeadHeight}px;">
        ${this.weekdays_short.map(e=>P`<th style="width: ${this.tblColWidth};">${this.initials?e[0]:e}</th>
            `)}
      </tr>
      ${""}
      ${this.weeks.map(e=>P`<tr style="height:${this.tblRowHeight}px;">
              ${""}
              ${e.map(e=>P`${e.selected?P`
                            <td class="selected" value="${e.value}">
                            <div style="width: ${this.tblColWidth}px; line-height:${this.tblRowHeight}px;">${e.text}</div>
                            <div class="overlay">
                              <svg id="svgTD" class="selected"></svg>
                            </div></td>
                        `:P`
                            <td .className="${e.disabled?"disabled":e.dimmed?"dimmed":""}"
                                value="${e.disabled?"":e.value}">${e.text}</td>
                        `}
                    `)}${""}
            </tr>`)}${""}
    </table>
    <div class="overlay">
      <svg id="svg" class="calendar"></svg>
    </div>
    `}firstUpdated(){this.setAttribute("role","dialog")}updated(e){e&&e instanceof Map&&(e.has("disabled")&&this.refreshDisabledState(),e.has("selected")&&this.refreshSelection());const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=this.getCalendarSize(),s=Math.min(Math.max(1,this.elevation),5),r=i.width+2*(s-1),o=i.height+2*(s-1);t.setAttribute("width",`${r}`),t.setAttribute("height",`${o}`),we(t,2,2,i.width-4,i.height-4);for(let e=1;e<s;e++)me(t,2*e,i.height-4+2*e,i.width-4+2*e,i.height-4+2*e).style.opacity=`${(85-10*e)/100}`,me(t,i.width-4+2*e,i.height-4+2*e,i.width-4+2*e,2*e).style.opacity=`${(85-10*e)/100}`,me(t,2*e,i.height-4+2*e,i.width-4+2*e,i.height-4+2*e).style.opacity=`${(85-10*e)/100}`,me(t,i.width-4+2*e,i.height-4+2*e,i.width-4+2*e,2*e).style.opacity=`${(85-10*e)/100}`;const n=this.shadowRoot.getElementById("svgTD");if(n){for(;n.hasChildNodes();)n.removeChild(n.lastChild);const e=Math.max(1*this.tblColWidth,20),t=Math.max(.9*this.tblRowHeight,18),i=xe(n,this.tblColWidth/2,this.tblRowHeight/2,e,t);n.appendChild(i)}this.classList.add("wired-rendered")}setSelectedDate(e){if(this.selected=e,this.selected){const e=new Date(this.selected);this.firstOfMonthDate=new Date(e.getFullYear(),e.getMonth(),1),this.computeCalendar(),this.requestUpdate(),this.fireSelected()}}localizeCalendarHeaders(){if(!this.locale){const e=navigator;e.hasOwnProperty("systemLanguage")?this.locale=e.systemLanguage:e.hasOwnProperty("browserLanguage")?this.locale=e.browserLanguage:this.locale=(navigator.languages||["en"])[0]}const e=(this.locale||"").toLowerCase();if("en-us"!==e&&"en"!==e){const e=new Date,t=e.getUTCDay(),i=new Date(e.getTime()-864e5*t),s=new Date(i);for(let e=0;e<7;e++)s.setDate(i.getDate()+e),this.weekdays_short[e]=s.toLocaleString(this.locale,{weekday:"short"});e.setDate(1);for(let t=0;t<12;t++)e.setMonth(t),this.months[t]=e.toLocaleString(this.locale,{month:"long"})}}setInitialConditions(){let e;this.calendarRefSize=this.getCalendarSize(),this.selected?(e=new Date(this.selected),this.value={date:new Date(this.selected),text:this.selected}):e=new Date,this.firstOfMonthDate=new Date(e.getFullYear(),e.getMonth(),1),this.firstdate&&(this.fDate=new Date(this.firstdate)),this.lastdate&&(this.lDate=new Date(this.lastdate))}refreshSelection(){this.weeks.forEach(e=>e.forEach(e=>{e.selected=this.selected&&e.value===this.selected||!1})),this.requestUpdate()}resized(){this.calendarRefSize=this.getCalendarSize(),this.computeCalendar(),this.refreshSelection()}getCalendarSize(){const e=this.getBoundingClientRect();return{width:e.width>180?e.width:320,height:e.height>180?e.height:320}}computeCellsizes(e,t){this.tblColWidth=e.width/7-2,this.tblHeadHeight=.25*e.height/2-2,this.tblRowHeight=.75*e.height/t-2}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}onItemClick(e){e.stopPropagation();const t=e.target;t&&t.hasAttribute("value")&&""!==t.getAttribute("value")&&(this.selected=t.getAttribute("value")||void 0,this.refreshSelection(),this.fireSelected())}fireSelected(){this.selected&&(this.value={date:new Date(this.selected),text:this.selected},Ce(this,"selected",{selected:this.selected}))}computeCalendar(){this.monthYear=this.months[this.firstOfMonthDate.getMonth()]+" "+this.firstOfMonthDate.getFullYear();const e=new Date(this.firstOfMonthDate.getFullYear(),this.firstOfMonthDate.getMonth(),1);let t=0-e.getDay();const i=Math.ceil((new Date(this.firstOfMonthDate.getFullYear(),this.firstOfMonthDate.getMonth()+1,0).getDate()-t)/7);this.weeks=[];for(let s=0;s<i;s++){this.weeks[s]=[];for(let i=0;i<7;i++){const r=new Date(e.getTime()+864e5*t),o=this.format(r);this.weeks[s][i]={value:o,text:r.getDate().toString(),selected:o===this.selected,dimmed:r.getMonth()!==e.getMonth(),disabled:this.isDateOutOfRange(r)},t++}}this.computeCellsizes(this.calendarRefSize,i)}onPrevClick(){void 0!==this.fDate&&new Date(this.fDate.getFullYear(),this.fDate.getMonth()-1,1).getMonth()===new Date(this.firstOfMonthDate.getFullYear(),this.firstOfMonthDate.getMonth()-1,1).getMonth()||(this.firstOfMonthDate=new Date(this.firstOfMonthDate.getFullYear(),this.firstOfMonthDate.getMonth()-1,1),this.computeCalendar(),this.refreshSelection())}onNextClick(){void 0!==this.lDate&&new Date(this.lDate.getFullYear(),this.lDate.getMonth()+1,1).getMonth()===new Date(this.firstOfMonthDate.getFullYear(),this.firstOfMonthDate.getMonth()+1,1).getMonth()||(this.firstOfMonthDate=new Date(this.firstOfMonthDate.getFullYear(),this.firstOfMonthDate.getMonth()+1,1),this.computeCalendar(),this.refreshSelection())}isDateOutOfRange(e){return this.fDate&&this.lDate?e<this.fDate||this.lDate<e:this.fDate?e<this.fDate:!!this.lDate&&this.lDate<e}debounce(e,t,i,s){let r=0;return()=>{const o=arguments,n=i&&!r;clearTimeout(r),r=window.setTimeout(()=>{r=0,i||e.apply(s,o)},t),n&&e.apply(s,o)}}},Me([J({type:Number}),We("design:type",Object)],e.WiredCalendar.prototype,"elevation",void 0),Me([J({type:String}),We("design:type",String)],e.WiredCalendar.prototype,"selected",void 0),Me([J({type:String}),We("design:type",String)],e.WiredCalendar.prototype,"firstdate",void 0),Me([J({type:String}),We("design:type",String)],e.WiredCalendar.prototype,"lastdate",void 0),Me([J({type:String}),We("design:type",String)],e.WiredCalendar.prototype,"locale",void 0),Me([J({type:Boolean,reflect:!0}),We("design:type",Object)],e.WiredCalendar.prototype,"disabled",void 0),Me([J({type:Boolean,reflect:!0}),We("design:type",Object)],e.WiredCalendar.prototype,"initials",void 0),Me([J({type:Object}),We("design:type",Object)],e.WiredCalendar.prototype,"value",void 0),Me([J({type:Function}),We("design:type",Function)],e.WiredCalendar.prototype,"format",void 0),e.WiredCalendar=Me([X("wired-calendar")],e.WiredCalendar);var Ne=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},$e=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCard=class extends de{constructor(){super(),this.elevation=1,window.ResizeObserver&&(this.resizeObserver=new window.ResizeObserver(()=>{this.svg&&this.wiredRender()}))}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
        .cardFill path {
          stroke-width: 3.5;
          stroke: var(--wired-card-background-fill);
        }
        path {
          stroke: var(--wired-card-background-fill, currentColor);
        }
      `]}render(){return P`
    <div id="overlay"><svg></svg></div>
    <div style="position: relative;">
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
    `}updated(e){const t=e.has("fill");this.wiredRender(t),this.attachResizeListener()}disconnectedCallback(){this.detachResizeListener()}attachResizeListener(){this.resizeObserver&&this.resizeObserver.observe?this.resizeObserver.observe(this):this.windowResizeHandler||(this.windowResizeHandler=()=>this.wiredRender(),window.addEventListener("resize",this.windowResizeHandler,{passive:!0}))}detachResizeListener(){this.resizeObserver&&this.resizeObserver.unobserve&&this.resizeObserver.unobserve(this),this.windowResizeHandler&&window.removeEventListener("resize",this.windowResizeHandler)}canvasSize(){const e=this.getBoundingClientRect(),t=Math.min(Math.max(1,this.elevation),5);return[e.width+2*(t-1),e.height+2*(t-1)]}draw(e,t){const i=Math.min(Math.max(1,this.elevation),5),s=t[0]-2*(i-1),r=t[1]-2*(i-1);if(this.fill&&this.fill.trim()){const t=Re([[2,2],[s-4,2],[s-2,r-4],[2,r-4]]);t.classList.add("cardFill"),e.style.setProperty("--wired-card-background-fill",this.fill.trim()),e.appendChild(t)}we(e,2,2,s-4,r-4);for(let t=1;t<i;t++)me(e,2*t,r-4+2*t,s-4+2*t,r-4+2*t).style.opacity=`${(85-10*t)/100}`,me(e,s-4+2*t,r-4+2*t,s-4+2*t,2*t).style.opacity=`${(85-10*t)/100}`,me(e,2*t,r-4+2*t,s-4+2*t,r-4+2*t).style.opacity=`${(85-10*t)/100}`,me(e,s-4+2*t,r-4+2*t,s-4+2*t,2*t).style.opacity=`${(85-10*t)/100}`}},Ne([J({type:Number}),$e("design:type",Object)],e.WiredCard.prototype,"elevation",void 0),Ne([J({type:String}),$e("design:type",String)],e.WiredCard.prototype,"fill",void 0),e.WiredCard=Ne([X("wired-card"),$e("design:paramtypes",[])],e.WiredCard);var Pe=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},je=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCheckbox=class extends de{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.focused=!1}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: var(--wired-checkbox-icon-color, currentColor);
        stroke-width: var(--wired-checkbox-default-swidth, 0.7);
      }
      g path {
        stroke-width: 2.5;
      }
      #container.focused {
        --wired-checkbox-default-swidth: 1.5;
      }
      `]}focus(){this.input?this.input.focus():super.focus()}wiredRender(e=!1){super.wiredRender(e),this.refreshCheckVisibility()}render(){return P`
    <label id="container" class="${this.focused?"focused":""}">
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}"
        @change="${this.onChange}"
        @focus="${()=>this.focused=!0}"
        @blur="${()=>this.focused=!1}">
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `}onChange(){this.checked=this.input.checked,this.refreshCheckVisibility(),Ce(this,"change",{checked:this.checked})}canvasSize(){return[24,24]}draw(e,t){we(e,0,0,t[0],t[1]),this.svgCheck=fe("g"),e.appendChild(this.svgCheck),me(this.svgCheck,.3*t[0],.4*t[1],.5*t[0],.7*t[1]),me(this.svgCheck,.5*t[0],.7*t[1],t[0]+5,-5)}refreshCheckVisibility(){this.svgCheck&&(this.svgCheck.style.display=this.checked?"":"none")}},Pe([J({type:Boolean}),je("design:type",Object)],e.WiredCheckbox.prototype,"checked",void 0),Pe([J({type:Boolean,reflect:!0}),je("design:type",Object)],e.WiredCheckbox.prototype,"disabled",void 0),Pe([J(),je("design:type",Object)],e.WiredCheckbox.prototype,"focused",void 0),Pe([K("input"),je("design:type",HTMLInputElement)],e.WiredCheckbox.prototype,"input",void 0),e.WiredCheckbox=Pe([X("wired-checkbox")],e.WiredCheckbox);var Ae=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Te=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCombo=class extends oe{constructor(){super(...arguments),this.disabled=!1,this.cardShowing=!1,this.itemNodes=[]}static get styles(){return se`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
        opacity: 0;
      }

      :host(.wired-disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }

      :host(.wired-rendered) {
        opacity: 1;
      }

      :host(:focus) path {
        stroke-width: 1.5;
      }

      #container {
        white-space: nowrap;
        position: relative;
      }

      .inline {
        display: inline-block;
        vertical-align: top
      }

      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }

      #dropPanel {
        width: 34px;
        cursor: pointer;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      svg {
        display: block;
      }

      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }

      #card {
        display: block;
        position: absolute;
        background: var(--wired-combo-popup-bg, white);
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
        padding: 8px;
      }

      ::slotted(wired-item) {
        display: block;
      }
    `}render(){return P`
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value&&this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg></svg>
      </div>
    </div>
    <wired-card id="card" tabindex="-1" role="listbox" @mousedown="${this.onItemClick}" @touchstart="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){this.setAttribute("role","combobox"),this.setAttribute("aria-haspopup","listbox"),this.refreshSelection(),this.addEventListener("blur",()=>{this.cardShowing&&this.setCardShowing(!1)}),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext();break;case 27:e.preventDefault(),this.cardShowing&&this.setCardShowing(!1);break;case 13:e.preventDefault(),this.setCardShowing(!this.cardShowing);break;case 32:e.preventDefault(),this.cardShowing||this.setCardShowing(!0)}})}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.svg;for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=this.shadowRoot.getElementById("container").getBoundingClientRect();t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`);const s=this.shadowRoot.getElementById("textPanel").getBoundingClientRect();this.shadowRoot.getElementById("dropPanel").style.minHeight=s.height+"px",we(t,0,0,s.width,s.height);const r=s.width-4;we(t,r,0,34,s.height);const o=Math.max(0,Math.abs((s.height-24)/2)),n=function(e,t){let i;const s=t.length;if(s>2)for(let e=0;e<2;e++){let r=!0;for(let e=1;e<s;e++)i=be(t[e-1][0],t[e-1][1],t[e][0],t[e][1],r,e>0,i),r=!1;i=be(t[s-1][0],t[s-1][1],t[0][0],t[0][1],r,e>0,i)}else i=2===s?ye(t[0][0],t[0][1],t[1][0],t[1][1]):new ue;const r=fe("path",{d:i.value});return e.appendChild(r),r}(t,[[r+8,5+o],[r+26,5+o],[r+17,o+Math.min(s.height,18)]]);if(n.style.fill="currentColor",n.style.pointerEvents=this.disabled?"none":"auto",n.style.cursor="pointer",this.classList.add("wired-rendered"),this.setAttribute("aria-expanded",`${this.cardShowing}`),!this.itemNodes.length){this.itemNodes=[];const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e&&e.length)for(let t=0;t<e.length;t++){const i=e[t];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.selected=!1,this.lastSelectedItem.removeAttribute("aria-selected"));const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e){let t=null;for(let i=0;i<e.length;i++){const s=e[i];if("WIRED-ITEM"===s.tagName){const e=s.value||s.getAttribute("value")||"";if(this.selected&&e===this.selected){t=s;break}}}this.lastSelectedItem=t||void 0,this.lastSelectedItem&&(this.lastSelectedItem.selected=!0,this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=t?{value:t.value||"",text:t.textContent||""}:void 0}}setCardShowing(e){this.card&&(this.cardShowing=e,this.card.style.display=e?"":"none",e&&setTimeout(()=>{this.shadowRoot.getElementById("slot").assignedNodes().filter(e=>e.nodeType===Node.ELEMENT_NODE).forEach(e=>{const t=e;t.requestUpdate&&t.requestUpdate()})},10),this.setAttribute("aria-expanded",`${this.cardShowing}`))}onItemClick(e){e.stopPropagation(),this.selected=e.target.value,this.refreshSelection(),this.fireSelected(),setTimeout(()=>{this.setCardShowing(!1)})}fireSelected(){Ce(this,"selected",{selected:this.selected})}selectPrevious(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0?t=0:0===t?t=e.length-1:t--,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0||t>=e.length-1?t=0:t++,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}onCombo(e){e.stopPropagation(),this.setCardShowing(!this.cardShowing)}},Ae([J({type:Object}),Te("design:type",Object)],e.WiredCombo.prototype,"value",void 0),Ae([J({type:String}),Te("design:type",String)],e.WiredCombo.prototype,"selected",void 0),Ae([J({type:Boolean,reflect:!0}),Te("design:type",Object)],e.WiredCombo.prototype,"disabled",void 0),Ae([K("svg"),Te("design:type",SVGSVGElement)],e.WiredCombo.prototype,"svg",void 0),Ae([K("#card"),Te("design:type",HTMLDivElement)],e.WiredCombo.prototype,"card",void 0),e.WiredCombo=Ae([X("wired-combo")],e.WiredCombo);var Ie=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Ee=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredDialog=class extends oe{constructor(){super(...arguments),this.elevation=5,this.open=!1}static get styles(){return se`
      #container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: var(--wired-dialog-z-index, 100);
      }
      #container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.4);
        opacity: 0;
        transition: opacity 0.5s ease;
      }
      #overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transform: translateY(150px);
        transition: transform 0.5s ease, opacity 0.5s ease;
      }
      .layout.vertical {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
      }
      .flex {
        -ms-flex: 1 1 0.000000001px;
        -webkit-flex: 1;
        flex: 1;
        -webkit-flex-basis: 0.000000001px;
        flex-basis: 0.000000001px;
      }
      wired-card {
        display: inline-block;
        background: white;
        text-align: left;
      }

      :host([open]) #container {
        pointer-events: auto;
      }
      :host([open]) #container::before {
        opacity: 1;
      }
      :host([open]) #overlay {
        opacity: 1;
        transform: none;
      }
    `}render(){return P`
    <div id="container">
      <div id="overlay" class="vertical layout">
        <div class="flex"></div>
        <div style="text-align: center; padding: 5px;">
          <wired-card .elevation="${this.elevation}"><slot></slot></wired-card>
        </div>
        <div class="flex"></div>
      </div>
    </div>
    `}updated(){this.card&&this.card.wiredRender(!0)}},Ie([J({type:Number}),Ee("design:type",Object)],e.WiredDialog.prototype,"elevation",void 0),Ie([J({type:Boolean,reflect:!0}),Ee("design:type",Object)],e.WiredDialog.prototype,"open",void 0),Ie([K("wired-card"),Ee("design:type",e.WiredCard)],e.WiredDialog.prototype,"card",void 0),e.WiredDialog=Ie([X("wired-dialog")],e.WiredDialog);var De=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Le=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredDivider=class extends de{constructor(){super(...arguments),this.elevation=1}static get styles(){return[ae,se`
        :host {
          display: block;
          position: relative;
        }
      `]}render(){return P`<svg></svg>`}canvasSize(){const e=this.getBoundingClientRect(),t=Math.min(Math.max(1,this.elevation),5);return[e.width,6*t]}draw(e,t){const i=Math.min(Math.max(1,this.elevation),5);for(let s=0;s<i;s++)me(e,0,6*s+3,t[0],6*s+3)}},De([J({type:Number}),Le("design:type",Object)],e.WiredDivider.prototype,"elevation",void 0),e.WiredDivider=De([X("wired-divider")],e.WiredDivider);var Be=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Ve=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredFab=class extends de{constructor(){super(...arguments),this.disabled=!1}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          font-size: 14px;
          color: #fff;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 16px;
          color: inherit;
          outline: none;
          border-radius: 50%;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button::-moz-focus-inner {
          border: 0;
        }
        button ::slotted(*) {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
          transition: transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.85;
        }
        path {
          stroke: var(--wired-fab-bg-color, #018786);
          stroke-width: 3;
          fill: transparent;
        }

        button:focus ::slotted(*) {
          opacity: 1;
        }
        button:active ::slotted(*) {
          opacity: 1;
          transform: scale(1.15);
        }
      `]}render(){return P`
    <button ?disabled="${this.disabled}">
      <div id="overlay">
        <svg></svg>
      </div>
      <slot @slotchange="${this.wiredRender}"></slot>
    </button>
    `}canvasSize(){if(this.button){const e=this.button.getBoundingClientRect();return[e.width,e.height]}return this.lastSize}draw(e,t){const i=Math.min(t[0],t[1]),s=_e(i/2,i/2,i,i);e.appendChild(s)}},Be([J({type:Boolean,reflect:!0}),Ve("design:type",Object)],e.WiredFab.prototype,"disabled",void 0),Be([K("button"),Ve("design:type",HTMLButtonElement)],e.WiredFab.prototype,"button",void 0),e.WiredFab=Be([X("wired-fab")],e.WiredFab);var He=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Ue=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredIconButton=class extends de{constructor(){super(...arguments),this.disabled=!1}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          font-size: 14px;
        }
        path {
          transition: transform 0.05s ease;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px;
          color: inherit;
          outline: none;
          border-radius: 50%;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button:active path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        button:focus path {
          stroke-width: 1.5;
        }
        button::-moz-focus-inner {
          border: 0;
        }
        button ::slotted(*) {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
        }
      `]}render(){return P`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `}canvasSize(){if(this.button){const e=this.button.getBoundingClientRect();return[e.width,e.height]}return this.lastSize}draw(e,t){const i=Math.min(t[0],t[1]);e.setAttribute("width",`${i}`),e.setAttribute("height",`${i}`),xe(e,i/2,i/2,i,i)}},He([J({type:Boolean,reflect:!0}),Ue("design:type",Object)],e.WiredIconButton.prototype,"disabled",void 0),He([K("button"),Ue("design:type",HTMLButtonElement)],e.WiredIconButton.prototype,"button",void 0),e.WiredIconButton=He([X("wired-icon-button")],e.WiredIconButton);var Fe=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},qe=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredImage=class extends de{constructor(){super(),this.elevation=1,this.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",window.ResizeObserver&&(this.resizeObserver=new window.ResizeObserver(()=>{this.svg&&this.wiredRender()}))}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          line-height: 1;
          padding: 3px;
        }
        img {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
      `]}render(){return P`
    <img src="${this.src}">
    <div id="overlay"><svg></svg></div>
    `}updated(){super.updated(),this.attachResizeListener()}disconnectedCallback(){this.detachResizeListener()}attachResizeListener(){this.resizeObserver&&this.resizeObserver.observe?this.resizeObserver.observe(this):this.windowResizeHandler||(this.windowResizeHandler=()=>this.wiredRender(),window.addEventListener("resize",this.windowResizeHandler,{passive:!0}))}detachResizeListener(){this.resizeObserver&&this.resizeObserver.unobserve&&this.resizeObserver.unobserve(this),this.windowResizeHandler&&window.removeEventListener("resize",this.windowResizeHandler)}canvasSize(){const e=this.getBoundingClientRect(),t=Math.min(Math.max(1,this.elevation),5);return[e.width+2*(t-1),e.height+2*(t-1)]}draw(e,t){const i=Math.min(Math.max(1,this.elevation),5),s=t[0]-2*(i-1),r=t[1]-2*(i-1);we(e,2,2,s-4,r-4);for(let t=1;t<i;t++)me(e,2*t,r-4+2*t,s-4+2*t,r-4+2*t).style.opacity=`${(85-10*t)/100}`,me(e,s-4+2*t,r-4+2*t,s-4+2*t,2*t).style.opacity=`${(85-10*t)/100}`,me(e,2*t,r-4+2*t,s-4+2*t,r-4+2*t).style.opacity=`${(85-10*t)/100}`,me(e,s-4+2*t,r-4+2*t,s-4+2*t,2*t).style.opacity=`${(85-10*t)/100}`}},Fe([J({type:Number}),qe("design:type",Object)],e.WiredImage.prototype,"elevation",void 0),Fe([J({type:String}),qe("design:type",String)],e.WiredImage.prototype,"src",void 0),e.WiredImage=Fe([X("wired-image"),qe("design:paramtypes",[])],e.WiredImage);var Ye=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Xe=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredInput=class extends de{constructor(){super(...arguments),this.disabled=!1,this.placeholder="",this.type="text",this.autocomplete="",this.autocapitalize="",this.autocorrect="",this.required=!1,this.autofocus=!1,this.readonly=!1}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: sans-serif;
          width: 150px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }
      `]}render(){return P`
    <input name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}"
      @change="${this.refire}" @input="${this.refire}">
    <div id="overlay">
      <svg></svg>
    </div>
    `}get input(){return this.textInput}get value(){const e=this.input;return e&&e.value||""}set value(e){if(this.shadowRoot){const t=this.input;t&&(t.value=e)}else this.pendingValue=e}firstUpdated(){this.value=this.pendingValue||this.value||this.getAttribute("value")||"",delete this.pendingValue}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,2,2,t[0]-2,t[1]-2)}refire(e){e.stopPropagation(),Ce(this,e.type,{sourceEvent:e})}},Ye([J({type:Boolean,reflect:!0}),Xe("design:type",Object)],e.WiredInput.prototype,"disabled",void 0),Ye([J({type:String}),Xe("design:type",Object)],e.WiredInput.prototype,"placeholder",void 0),Ye([J({type:String}),Xe("design:type",String)],e.WiredInput.prototype,"name",void 0),Ye([J({type:String}),Xe("design:type",String)],e.WiredInput.prototype,"min",void 0),Ye([J({type:String}),Xe("design:type",String)],e.WiredInput.prototype,"max",void 0),Ye([J({type:String}),Xe("design:type",String)],e.WiredInput.prototype,"step",void 0),Ye([J({type:String}),Xe("design:type",Object)],e.WiredInput.prototype,"type",void 0),Ye([J({type:String}),Xe("design:type",Object)],e.WiredInput.prototype,"autocomplete",void 0),Ye([J({type:String}),Xe("design:type",Object)],e.WiredInput.prototype,"autocapitalize",void 0),Ye([J({type:String}),Xe("design:type",Object)],e.WiredInput.prototype,"autocorrect",void 0),Ye([J({type:Boolean}),Xe("design:type",Object)],e.WiredInput.prototype,"required",void 0),Ye([J({type:Boolean}),Xe("design:type",Object)],e.WiredInput.prototype,"autofocus",void 0),Ye([J({type:Boolean}),Xe("design:type",Object)],e.WiredInput.prototype,"readonly",void 0),Ye([J({type:Number}),Xe("design:type",Number)],e.WiredInput.prototype,"minlength",void 0),Ye([J({type:Number}),Xe("design:type",Number)],e.WiredInput.prototype,"maxlength",void 0),Ye([J({type:Number}),Xe("design:type",Number)],e.WiredInput.prototype,"size",void 0),Ye([K("input"),Xe("design:type",HTMLInputElement)],e.WiredInput.prototype,"textInput",void 0),e.WiredInput=Ye([X("wired-input")],e.WiredInput);var Ge=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Je=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredItem=class extends de{constructor(){super(...arguments),this.value="",this.name="",this.selected=!1}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        font-size: 14px;
        text-align: left;
      }
      button {
        cursor: pointer;
        outline: none;
        overflow: hidden;
        color: inherit;
        user-select: none;
        position: relative;
        font-family: inherit;
        text-align: inherit;
        font-size: inherit;
        letter-spacing: 1.25px;
        padding: 1px 10px;
        min-height: 36px;
        text-transform: inherit;
        background: none;
        border: none;
        transition: background-color 0.3s ease, color 0.3s ease;
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
      }
      button.selected {
        color: var(--wired-item-selected-color, #fff);
      }
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        opacity: 0;
      }
      button span {
        display: inline-block;
        transition: transform 0.2s ease;
        position: relative;
      }
      button:active span {
        transform: scale(1.02);
      }
      #overlay {
        display: none;
      }
      button.selected #overlay {
        display: block;
      }
      svg path {
        stroke: var(--wired-item-selected-bg, #000);
        stroke-width: 2.75;
        fill: transparent;
        transition: transform 0.05s ease;
      }
      @media (hover: hover) {
        button:hover::before {
          opacity: 0.05;
        }
      }
      `]}render(){return P`
    <button class="${this.selected?"selected":""}">
      <div id="overlay"><svg></svg></div>
      <span><slot></slot></span>
    </button>`}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){const i=Re([[0,0],[t[0],0],[t[0],t[1]],[0,t[1]]]);e.appendChild(i)}},Ge([J(),Je("design:type",Object)],e.WiredItem.prototype,"value",void 0),Ge([J(),Je("design:type",Object)],e.WiredItem.prototype,"name",void 0),Ge([J({type:Boolean}),Je("design:type",Object)],e.WiredItem.prototype,"selected",void 0),e.WiredItem=Ge([X("wired-item")],e.WiredItem);var Ke=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Qe=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredLink=class extends de{constructor(){super(...arguments),this.elevation=1}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
        }
        a, a:hover, a:visited {
          color: inherit;
          outline: none;
          display: inline-block;
          white-space: nowrap;
          text-decoration: none;
          border: none;
        }
        path {
          stroke: var(--wired-link-decoration-color, blue);
          stroke-opacity: 0.45;
        }
        a:focus path {
          stroke-opacity: 1;
        }
      `]}render(){return P`
    <a href="${this.href}" target="${this.target||""}">
      <slot></slot>
      <div id="overlay"><svg></svg></div>
    </a>
    `}focus(){this.anchor?this.anchor.focus():super.focus()}canvasSize(){if(this.anchor){const e=this.anchor.getBoundingClientRect(),t=Math.min(Math.max(1,this.elevation),5);return[e.width,e.height+2*(t-1)]}return this.lastSize}draw(e,t){const i=Math.min(Math.max(1,this.elevation),5),s={width:t[0],height:t[1]-2*(i-1)};for(let t=0;t<i;t++)me(e,0,s.height+2*t-2,s.width,s.height+2*t-2),me(e,0,s.height+2*t-2,s.width,s.height+2*t-2)}},Ke([J({type:Number}),Qe("design:type",Object)],e.WiredLink.prototype,"elevation",void 0),Ke([J({type:String}),Qe("design:type",String)],e.WiredLink.prototype,"href",void 0),Ke([J({type:String}),Qe("design:type",String)],e.WiredLink.prototype,"target",void 0),Ke([K("a"),Qe("design:type",HTMLAnchorElement)],e.WiredLink.prototype,"anchor",void 0),e.WiredLink=Ke([X("wired-link")],e.WiredLink);var Ze=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},et=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredListbox=class extends de{constructor(){super(...arguments),this.horizontal=!1,this.itemNodes=[],this.itemClickHandler=this.onItemClick.bind(this)}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        padding: 5px;
        outline: none;
      }
      :host(:focus) path {
        stroke-width: 1.5;
      }
      ::slotted(wired-item) {
        display: block;
      }
      :host(.wired-horizontal) ::slotted(wired-item) {
        display: inline-block;
      }
      `]}render(){return P`
    <slot id="slot" @slotchange="${()=>this.requestUpdate()}"></slot>
    <div id="overlay">
      <svg id="svg"></svg>
    </div>
    `}firstUpdated(){this.setAttribute("role","listbox"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.refreshSelection(),this.addEventListener("click",this.itemClickHandler),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext()}})}updated(){if(super.updated(),this.horizontal?this.classList.add("wired-horizontal"):this.classList.remove("wired-horizontal"),!this.itemNodes.length){this.itemNodes=[];const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e&&e.length)for(let t=0;t<e.length;t++){const i=e[t];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}onItemClick(e){e.stopPropagation(),this.selected=e.target.value,this.refreshSelection(),this.fireSelected()}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.selected=!1,this.lastSelectedItem.removeAttribute("aria-selected"));const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e){let t=null;for(let i=0;i<e.length;i++){const s=e[i];if("WIRED-ITEM"===s.tagName){const e=s.value||"";if(this.selected&&e===this.selected){t=s;break}}}this.lastSelectedItem=t||void 0,this.lastSelectedItem&&(this.lastSelectedItem.selected=!0,this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=t?{value:t.value||"",text:t.textContent||""}:void 0}}fireSelected(){Ce(this,"selected",{selected:this.selected})}selectPrevious(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0?t=0:0===t?t=e.length-1:t--,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0||t>=e.length-1?t=0:t++,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,0,0,t[0],t[1])}},Ze([J({type:Object}),et("design:type",Object)],e.WiredListbox.prototype,"value",void 0),Ze([J({type:String}),et("design:type",String)],e.WiredListbox.prototype,"selected",void 0),Ze([J({type:Boolean}),et("design:type",Object)],e.WiredListbox.prototype,"horizontal",void 0),e.WiredListbox=Ze([X("wired-listbox")],e.WiredListbox);var tt=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},it=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredProgress=class extends de{constructor(){super(...arguments),this.value=0,this.min=0,this.max=100,this.percentage=!1}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        position: relative;
        width: 400px;
        height: 42px;
        font-family: sans-serif;
      }
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .progressLabel {
        color: var(--wired-progress-label-color, #000);
        font-size: var(--wired-progress-font-size, 14px);
        background: var(--wired-progress-label-background, rgba(255,255,255,0.9));
        padding: 2px 6px;
        border-radius: 4px;
        letter-spacing: 1.25px;
      }
      .progbox path {
        stroke: var(--wired-progress-color, rgba(0, 0, 200, 0.8));
        stroke-width: 2.75;
        fill: none;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
      `]}render(){return P`
    <div id="overlay" class="overlay">
      <svg></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `}getProgressLabel(){if(this.percentage){if(this.max===this.min)return"%";return Math.floor((this.value-this.min)/(this.max-this.min)*100)+"%"}return""+this.value}wiredRender(e=!1){super.wiredRender(e),this.refreshProgressFill()}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,2,2,t[0]-2,t[1]-2)}refreshProgressFill(){if(this.progBox&&(this.progBox.parentElement&&this.progBox.parentElement.removeChild(this.progBox),this.progBox=void 0),this.svg){let e=0;const t=this.getBoundingClientRect();if(this.max>this.min){e=(this.value-this.min)/(this.max-this.min);const i=t.width*Math.max(0,Math.min(e,100));this.progBox=Re([[0,0],[i,0],[i,t.height],[0,t.height]]),this.svg.appendChild(this.progBox),this.progBox.classList.add("progbox")}}}},tt([J({type:Number}),it("design:type",Object)],e.WiredProgress.prototype,"value",void 0),tt([J({type:Number}),it("design:type",Object)],e.WiredProgress.prototype,"min",void 0),tt([J({type:Number}),it("design:type",Object)],e.WiredProgress.prototype,"max",void 0),tt([J({type:Boolean}),it("design:type",Object)],e.WiredProgress.prototype,"percentage",void 0),e.WiredProgress=tt([X("wired-progress")],e.WiredProgress);var st=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},rt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredRadio=class extends de{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.focused=!1}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: var(--wired-radio-icon-color, currentColor);
        stroke-width: var(--wired-radio-default-swidth, 0.7);
      }
      g path {
        stroke-width: 0;
        fill: var(--wired-radio-icon-color, currentColor);
      }
      #container.focused {
        --wired-radio-default-swidth: 1.5;
      }
      `]}focus(){this.input?this.input.focus():super.focus()}wiredRender(e=!1){super.wiredRender(e),this.refreshCheckVisibility()}render(){return P`
    <label id="container" class="${this.focused?"focused":""}">
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}"
        @change="${this.onChange}"
        @focus="${()=>this.focused=!0}"
        @blur="${()=>this.focused=!1}">
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `}onChange(){this.checked=this.input.checked,this.refreshCheckVisibility(),Ce(this,"change",{checked:this.checked})}canvasSize(){return[24,24]}draw(e,t){xe(e,t[0]/2,t[1]/2,t[0],t[1]),this.svgCheck=fe("g"),e.appendChild(this.svgCheck);const i=Math.max(.6*t[0],5),s=Math.max(.6*t[1],5);xe(this.svgCheck,t[0]/2,t[1]/2,i,s)}refreshCheckVisibility(){this.svgCheck&&(this.svgCheck.style.display=this.checked?"":"none")}},st([J({type:Boolean}),rt("design:type",Object)],e.WiredRadio.prototype,"checked",void 0),st([J({type:Boolean,reflect:!0}),rt("design:type",Object)],e.WiredRadio.prototype,"disabled",void 0),st([J({type:String}),rt("design:type",String)],e.WiredRadio.prototype,"name",void 0),st([J(),rt("design:type",Object)],e.WiredRadio.prototype,"focused",void 0),st([K("input"),rt("design:type",HTMLInputElement)],e.WiredRadio.prototype,"input",void 0),e.WiredRadio=st([X("wired-radio")],e.WiredRadio);var ot=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},nt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredRadioGroup=class extends oe{constructor(){super(...arguments),this.radioNodes=[],this.checkListener=this.handleChecked.bind(this)}static get styles(){return se`
      :host {
        display: inline-block;
        font-family: inherit;
        outline: none;
      }
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    `}render(){return P`<slot id="slot" @slotchange="${this.slotChange}"></slot>`}connectedCallback(){super.connectedCallback(),this.addEventListener("change",this.checkListener)}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.removeEventListener("change",this.checkListener)}handleChecked(e){const t=e.detail.checked,i=e.target,s=i.name||"";t?(this.selected=t&&s||"",this.fireSelected()):i.checked=!0}slotChange(){this.requestUpdate()}firstUpdated(){this.setAttribute("role","radiogroup"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext()}})}updated(){const e=this.shadowRoot.getElementById("slot").assignedNodes();if(this.radioNodes=[],e&&e.length)for(let t=0;t<e.length;t++){const i=e[t];if("WIRED-RADIO"===i.tagName){this.radioNodes.push(i);const e=i.name||"";this.selected&&e===this.selected?i.checked=!0:i.checked=!1}}}selectPrevious(){const e=this.radioNodes;if(e.length){let t=null,i=-1;if(this.selected){for(let t=0;t<e.length;t++){if(e[t].name===this.selected){i=t;break}}i<0?t=e[0]:(i--,i<0&&(i=e.length-1),t=e[i])}else t=e[0];t&&(t.focus(),this.selected=t.name,this.fireSelected())}}selectNext(){const e=this.radioNodes;if(e.length){let t=null,i=-1;if(this.selected){for(let t=0;t<e.length;t++){if(e[t].name===this.selected){i=t;break}}i<0?t=e[0]:(i++,i>=e.length&&(i=0),t=e[i])}else t=e[0];t&&(t.focus(),this.selected=t.name,this.fireSelected())}}fireSelected(){Ce(this,"selected",{selected:this.selected})}},ot([J({type:String}),nt("design:type",String)],e.WiredRadioGroup.prototype,"selected",void 0),e.WiredRadioGroup=ot([X("wired-radio-group")],e.WiredRadioGroup);var at=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},dt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredSearchInput=class extends de{constructor(){super(...arguments),this.disabled=!1,this.placeholder="",this.autocomplete="",this.autocorrect="",this.autofocus=!1}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px 40px 10px 5px;
          font-family: sans-serif;
          width: 180px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }

        input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
        input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration {
          display: none;
        }

        .thicker path {
          stroke-width: 1.5;
        }

        button {
          position: absolute;
          top: 0;
          right: 2px;
          width: 32px;
          height: 100%;
          box-sizing: border-box;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          opacity: 0;
        }
      `]}render(){return P`
    <input type="search" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}"
      autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}"
      @change="${this.refire}" @input="${this.refire}">
    <div id="overlay">
      <svg></svg>
    </div>
    <button @click="${()=>this.value=""}"></button>
    `}get input(){return this.textInput}get value(){const e=this.input;return e&&e.value||""}set value(e){if(this.shadowRoot){const t=this.input;t&&(t.value=e),this.refreshIconState()}else this.pendingValue=e}wiredRender(e=!1){super.wiredRender(e),this.refreshIconState()}firstUpdated(){this.value=this.pendingValue||this.value||this.getAttribute("value")||"",delete this.pendingValue}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,2,2,t[0]-2,t[1]-2),this.searchIcon=fe("g"),this.searchIcon.classList.add("thicker"),e.appendChild(this.searchIcon),xe(this.searchIcon,t[0]-30,(t[1]-30)/2+10,20,20),me(this.searchIcon,t[0]-10,(t[1]-30)/2+30,t[0]-25,(t[1]-30)/2+15),this.closeIcon=fe("g"),this.closeIcon.classList.add("thicker"),e.appendChild(this.closeIcon),me(this.closeIcon,t[0]-33,(t[1]-30)/2+2,t[0]-7,(t[1]-30)/2+28),me(this.closeIcon,t[0]-7,(t[1]-30)/2+2,t[0]-33,(t[1]-30)/2+28)}refreshIconState(){this.searchIcon&&this.closeIcon&&(this.searchIcon.style.display=this.value.trim()?"none":"",this.closeIcon.style.display=this.value.trim()?"":"none")}refire(e){this.refreshIconState(),e.stopPropagation(),Ce(this,e.type,{sourceEvent:e})}},at([J({type:Boolean,reflect:!0}),dt("design:type",Object)],e.WiredSearchInput.prototype,"disabled",void 0),at([J({type:String}),dt("design:type",Object)],e.WiredSearchInput.prototype,"placeholder",void 0),at([J({type:String}),dt("design:type",Object)],e.WiredSearchInput.prototype,"autocomplete",void 0),at([J({type:String}),dt("design:type",Object)],e.WiredSearchInput.prototype,"autocorrect",void 0),at([J({type:Boolean}),dt("design:type",Object)],e.WiredSearchInput.prototype,"autofocus",void 0),at([K("input"),dt("design:type",HTMLInputElement)],e.WiredSearchInput.prototype,"textInput",void 0),e.WiredSearchInput=at([X("wired-search-input")],e.WiredSearchInput);var lt=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},ht=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredSlider=class extends de{constructor(){super(...arguments),this.min=0,this.max=100,this.step=1,this.disabled=!1,this.canvasWidth=300}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        position: relative;
        width: 300px;
        box-sizing: border-box;
      }
      :host([disabled]) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 5px;
      }
      input[type=range] {
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        margin: 0;
        -webkit-appearance: none;
        background: transparent;
        outline: none;
        position: relative;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-ms-track {
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      input[type=range]::-moz-focus-outer {
        outline: none;
        border: 0;
      }
      input[type=range]::-moz-range-thumb {
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        margin: 0;
        height: 20px;
        width: 20px;
        line-height: 1;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border-radius: 50px;
        background: none;
        cursor: pointer;
        border: none;
        height: 20px;
        width: 20px;
        margin: 0;
        line-height: 1;
      }
      .knob{
        fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
        stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
      }
      .bar {
        stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
      }
      input:focus + div svg .knob {
        stroke: var(--wired-slider-knob-outline-color, #000);
        fill-opacity: 0.8;
      }
      `]}get value(){return this.input?+this.input.value:this.min}set value(e){this.input?this.input.value=`${e}`:this.pendingValue=e,this.updateThumbPosition()}firstUpdated(){this.value=this.pendingValue||this.value||+(this.getAttribute("value")||this.min),delete this.pendingValue}render(){return P`
    <div id="container">
      <input type="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        ?disabled="${this.disabled}"
        @input="${this.onInput}">
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `}focus(){this.input?this.input.focus():super.focus()}onInput(e){e.stopPropagation(),this.updateThumbPosition(),this.input&&Ce(this,"change",{value:+this.input.value})}wiredRender(e=!1){super.wiredRender(e),this.updateThumbPosition()}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){this.canvasWidth=t[0];const i=Math.round(t[1]/2);me(e,0,i,t[0],i).classList.add("bar"),this.knob=xe(e,10,i,20,20),this.knob.classList.add("knob")}updateThumbPosition(){if(this.input){const e=+this.input.value,t=Math.max(this.step,this.max-this.min),i=(e-this.min)/t;this.knob&&(this.knob.style.transform=`translateX(${i*(this.canvasWidth-20)}px)`)}}},lt([J({type:Number}),ht("design:type",Object)],e.WiredSlider.prototype,"min",void 0),lt([J({type:Number}),ht("design:type",Object)],e.WiredSlider.prototype,"max",void 0),lt([J({type:Number}),ht("design:type",Object)],e.WiredSlider.prototype,"step",void 0),lt([J({type:Boolean,reflect:!0}),ht("design:type",Object)],e.WiredSlider.prototype,"disabled",void 0),lt([K("input"),ht("design:type",HTMLInputElement)],e.WiredSlider.prototype,"input",void 0),e.WiredSlider=lt([X("wired-slider")],e.WiredSlider);var ct=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},pt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredSpinner=class extends de{constructor(){super(...arguments),this.spinning=!1,this.duration=1500,this.value=0,this.timerstart=0,this.frame=0}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
        }
        path {
          stroke: currentColor;
          stroke-opacity: 0.65;
          stroke-width: 1.5;
          fill: none;
        }
        .knob {
          stroke-width: 2.8 !important;
          stroke-opacity: 1;
        }
      `]}render(){return P`<svg></svg>`}canvasSize(){return[76,76]}draw(e,t){xe(e,t[0]/2,t[1]/2,Math.floor(.8*t[0]),Math.floor(.8*t[1])),this.knob=_e(0,0,20,20),this.knob.classList.add("knob"),e.appendChild(this.knob),this.updateCursor()}updateCursor(){if(this.knob){const e=[Math.round(38+25*Math.cos(this.value*Math.PI*2)),Math.round(38+25*Math.sin(this.value*Math.PI*2))];this.knob.style.transform=`translate3d(${e[0]}px, ${e[1]}px, 0) rotateZ(${Math.round(360*this.value*2)}deg)`}}updated(){super.updated(),this.spinning?this.startSpinner():this.stopSpinner()}startSpinner(){this.stopSpinner(),this.value=0,this.timerstart=0,this.nextTick()}stopSpinner(){this.frame&&(window.cancelAnimationFrame(this.frame),this.frame=0)}nextTick(){this.frame=window.requestAnimationFrame(e=>this.tick(e))}tick(e){this.spinning?(this.timerstart||(this.timerstart=e),this.value=Math.min(1,(e-this.timerstart)/this.duration),this.updateCursor(),this.value>=1&&(this.value=0,this.timerstart=0),this.nextTick()):this.frame=0}},ct([J({type:Boolean}),pt("design:type",Object)],e.WiredSpinner.prototype,"spinning",void 0),ct([J({type:Number}),pt("design:type",Object)],e.WiredSpinner.prototype,"duration",void 0),e.WiredSpinner=ct([X("wired-spinner")],e.WiredSpinner);var ut=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},ft=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredTab=class extends de{constructor(){super(),this.name="",this.label="",window.ResizeObserver&&(this.resizeObserver=new window.ResizeObserver(()=>{this.svg&&this.wiredRender()}))}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
      `]}render(){return P`
    <div>
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
    <div id="overlay"><svg></svg></div>
    `}updated(){super.updated(),this.attachResizeListener()}disconnectedCallback(){this.detachResizeListener()}attachResizeListener(){this.resizeObserver&&this.resizeObserver.observe?this.resizeObserver.observe(this):this.windowResizeHandler||(this.windowResizeHandler=()=>this.wiredRender(),window.addEventListener("resize",this.windowResizeHandler,{passive:!0}))}detachResizeListener(){this.resizeObserver&&this.resizeObserver.unobserve&&this.resizeObserver.unobserve(this),this.windowResizeHandler&&window.removeEventListener("resize",this.windowResizeHandler)}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,2,2,t[0]-4,t[1]-4)}},ut([J({type:String}),ft("design:type",Object)],e.WiredTab.prototype,"name",void 0),ut([J({type:String}),ft("design:type",Object)],e.WiredTab.prototype,"label",void 0),e.WiredTab=ut([X("wired-tab"),ft("design:paramtypes",[])],e.WiredTab);const gt=new WeakMap,yt=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,bt=(e,t,i=null)=>{for(;t!==i;){const i=t.nextSibling;e.removeChild(t),t=i}},vt={},mt={},wt=`{{lit-${String(Math.random()).slice(2)}}}`,xt=`\x3c!--${wt}--\x3e`,kt=e=>-1!==e.index,St=()=>document.createComment(""),Rt=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class _t{constructor(e,t,i){this.__parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this.__parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this.__parts)void 0!==e&&e.commit()}_clone(){const e=yt?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=[],i=this.template.parts,s=document.createTreeWalker(e,133,null,!1);let r,o=0,n=0,a=s.nextNode();for(;o<i.length;)if(r=i[o],kt(r)){for(;n<r.index;)n++,"TEMPLATE"===a.nodeName&&(t.push(a),s.currentNode=a.content),null===(a=s.nextNode())&&(s.currentNode=t.pop(),a=s.nextNode());if("node"===r.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(a.previousSibling),this.__parts.push(e)}else this.__parts.push(...this.processor.handleAttributeExpressions(a,r.name,r.strings,this.options));o++}else this.__parts.push(void 0),o++;return yt&&(document.adoptNode(e),customElements.upgrade(e)),e}}const Ct=` ${wt} `;class Ot{constructor(e){this.value=void 0,this.__pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(St()),this.endNode=e.appendChild(St())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e.__insert(this.startNode=St()),e.__insert(this.endNode=St())}insertAfterPart(e){e.__insert(this.startNode=St()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this.__pendingValue=e}commit(){for(;"function"==typeof(e=this.__pendingValue)&&gt.has(e);){const e=this.__pendingValue;this.__pendingValue=vt,e(this)}var e;const t=this.__pendingValue;t!==vt&&((e=>null===e||!("object"==typeof e||"function"==typeof e))(t)?t!==this.value&&this.__commitText(t):t instanceof class{constructor(e,t,i,s){this.strings=e,this.values=t,this.type=i,this.processor=s}getHTML(){const e=this.strings.length-1;let t="",i=!1;for(let s=0;s<e;s++){const e=this.strings[s],r=e.lastIndexOf("\x3c!--");i=(r>-1||i)&&-1===e.indexOf("--\x3e",r+1);const o=Rt.exec(e);t+=null===o?e+(i?Ct:xt):e.substr(0,o.index)+o[1]+o[2]+"$lit$"+o[3]+wt}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):(e=>Array.isArray(e)||!(!e||!e[Symbol.iterator]))(t)?this.__commitIterable(t):t===mt?(this.value=mt,this.clear()):this.__commitText(t))}__insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}__commitNode(e){this.value!==e&&(this.clear(),this.__insert(e),this.value=e)}__commitText(e){const t=this.startNode.nextSibling,i="string"==typeof(e=null==e?"":e)?e:String(e);t===this.endNode.previousSibling&&3===t.nodeType?t.data=i:this.__commitNode(document.createTextNode(i)),this.value=e}__commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof _t&&this.value.template===t)this.value.update(e.values);else{const i=new _t(t,e.processor,this.options),s=i._clone();i.update(e.values),this.__commitNode(s),this.value=i}}__commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,s=0;for(const r of e)i=t[s],void 0===i&&(i=new Ot(this.options),t.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(t[s-1])),i.setValue(r),i.commit(),s++;s<t.length&&(t.length=s,this.clear(i&&i.endNode))}clear(e=this.startNode){bt(this.startNode.parentNode,e.nextSibling,this.endNode)}}let zt=!1;try{const e={get capture(){return zt=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.1.2");const Mt=(e,t)=>{const i=e.startNode.parentNode,s=void 0===t?e.endNode:t.startNode,r=i.insertBefore(St(),s);i.insertBefore(St(),s);const o=new Ot(e.options);return o.insertAfterNode(r),o},Wt=(e,t)=>(e.setValue(t),e.commit(),e),Nt=(e,t,i)=>{const s=e.startNode.parentNode,r=i?i.startNode:e.endNode,o=t.endNode.nextSibling;o!==r&&((e,t,i=null,s=null)=>{for(;t!==i;){const i=t.nextSibling;e.insertBefore(t,s),t=i}})(s,t.startNode,o,r)},$t=e=>{bt(e.startNode.parentNode,e.startNode,e.endNode.nextSibling)},Pt=(e,t,i)=>{const s=new Map;for(let r=t;r<=i;r++)s.set(e[r],r);return s},jt=new WeakMap,At=new WeakMap,Tt=(It=(e,t,i)=>{let s;return void 0===i?i=t:void 0!==t&&(s=t),t=>{if(!(t instanceof Ot))throw new Error("repeat can only be used in text bindings");const r=jt.get(t)||[],o=At.get(t)||[],n=[],a=[],d=[];let l,h,c=0;for(const t of e)d[c]=s?s(t,c):c,a[c]=i(t,c),c++;let p=0,u=r.length-1,f=0,g=a.length-1;for(;p<=u&&f<=g;)if(null===r[p])p++;else if(null===r[u])u--;else if(o[p]===d[f])n[f]=Wt(r[p],a[f]),p++,f++;else if(o[u]===d[g])n[g]=Wt(r[u],a[g]),u--,g--;else if(o[p]===d[g])n[g]=Wt(r[p],a[g]),Nt(t,r[p],n[g+1]),p++,g--;else if(o[u]===d[f])n[f]=Wt(r[u],a[f]),Nt(t,r[u],r[p]),u--,f++;else if(void 0===l&&(l=Pt(d,f,g),h=Pt(o,p,u)),l.has(o[p]))if(l.has(o[u])){const e=h.get(d[f]),i=void 0!==e?r[e]:null;if(null===i){const e=Mt(t,r[p]);Wt(e,a[f]),n[f]=e}else n[f]=Wt(i,a[f]),Nt(t,i,r[p]),r[e]=null;f++}else $t(r[u]),u--;else $t(r[p]),p++;for(;f<=g;){const e=Mt(t,n[g+1]);Wt(e,a[f]),n[f++]=e}for(;p<=u;){const e=r[p++];null!==e&&$t(e)}jt.set(t,n),At.set(t,d)}},(...e)=>{const t=It(...e);return gt.set(t,!0),t});var It,Et=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Dt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredTabs=class extends oe{constructor(){super(...arguments),this.pages=[],this.pageMap=new Map}static get styles(){return[ae,se`
        :host {
          display: block;
          opacity: 1;
        }
        ::slotted(.hidden) {
          display: none !important;
        }

        :host ::slotted(.hidden) {
          display: none !important;
        }
        #bar {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
        }
      `]}render(){return P`
    <div id="bar">
      ${Tt(this.pages,e=>e.name,e=>P`
      <wired-item role="tab" .value="${e.name}" .selected="${e.name===this.selected}" ?aria-selected="${e.name===this.selected}"
        @click="${()=>this.selected=e.name}">${e.label||e.name}</wired-item>
      `)}
    </div>
    <div>
      <slot @slotchange="${this.mapPages}"></slot>
    </div>
    `}mapPages(){if(this.pages=[],this.pageMap.clear(),this.slotElement){const e=this.slotElement.assignedNodes();if(e&&e.length){for(let t=0;t<e.length;t++){const i=e[t];if(i.nodeType===Node.ELEMENT_NODE&&"wired-tab"===i.tagName.toLowerCase()){const e=i;this.pages.push(e);const t=e.getAttribute("name")||"";t&&t.trim().split(" ").forEach(t=>{t&&this.pageMap.set(t,e)})}}this.selected||this.pages.length&&(this.selected=this.pages[0].name),this.requestUpdate()}}}firstUpdated(){this.mapPages(),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext()}})}updated(){const e=this.getElement();for(let t=0;t<this.pages.length;t++){const i=this.pages[t];i===e?i.classList.remove("hidden"):i.classList.add("hidden")}this.current=e||void 0,this.current&&this.current.wiredRender&&requestAnimationFrame(()=>requestAnimationFrame(()=>this.current.wiredRender()))}getElement(){let e=void 0;return this.selected&&(e=this.pageMap.get(this.selected)),e||(e=this.pages[0]),e||null}selectPrevious(){const e=this.pages;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.current){t=i;break}t<0?t=0:0===t?t=e.length-1:t--,this.selected=e[t].name||""}}selectNext(){const e=this.pages;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.current){t=i;break}t<0||t>=e.length-1?t=0:t++,this.selected=e[t].name||""}}},Et([J({type:String}),Dt("design:type",String)],e.WiredTabs.prototype,"selected",void 0),Et([K("slot"),Dt("design:type",HTMLSlotElement)],e.WiredTabs.prototype,"slotElement",void 0),e.WiredTabs=Et([X("wired-tabs")],e.WiredTabs);var Lt=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Bt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredTextarea=class extends de{constructor(){super(...arguments),this.disabled=!1,this.rows=2,this.maxrows=0,this.autocomplete="",this.autofocus=!1,this.inputmode="",this.placeholder="",this.required=!1,this.readonly=!1}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          font-family: sans-serif;
          width: 400px;
          outline: none;
          padding: 4px;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        textarea {
          position: relative;
          outline: none;
          border: none;
          resize: none;
          background: inherit;
          color: inherit;
          width: 100%;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
          text-align: inherit;
          padding: 10px;
          box-sizing: border-box;
        }
      `]}render(){return P`
    <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}"
      placeholder="${this.placeholder}" ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}"
      rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}"
      @change="${this.refire}" @input="${this.refire}"></textarea>
    <div id="overlay">
      <svg></svg>
    </div>
    `}get textarea(){return this.textareaInput}get value(){const e=this.textarea;return e&&e.value||""}set value(e){if(this.shadowRoot){const t=this.textarea;t&&(t.value=e)}else this.pendingValue=e}firstUpdated(){this.value=this.pendingValue||this.value||this.getAttribute("value")||"",delete this.pendingValue}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,4,4,t[0]-4,t[1]-4)}refire(e){e.stopPropagation(),Ce(this,e.type,{sourceEvent:e})}},Lt([J({type:Boolean,reflect:!0}),Bt("design:type",Object)],e.WiredTextarea.prototype,"disabled",void 0),Lt([J({type:Number}),Bt("design:type",Object)],e.WiredTextarea.prototype,"rows",void 0),Lt([J({type:Number}),Bt("design:type",Object)],e.WiredTextarea.prototype,"maxrows",void 0),Lt([J({type:String}),Bt("design:type",Object)],e.WiredTextarea.prototype,"autocomplete",void 0),Lt([J({type:Boolean}),Bt("design:type",Object)],e.WiredTextarea.prototype,"autofocus",void 0),Lt([J({type:String}),Bt("design:type",Object)],e.WiredTextarea.prototype,"inputmode",void 0),Lt([J({type:String}),Bt("design:type",Object)],e.WiredTextarea.prototype,"placeholder",void 0),Lt([J({type:Boolean}),Bt("design:type",Object)],e.WiredTextarea.prototype,"required",void 0),Lt([J({type:Boolean}),Bt("design:type",Object)],e.WiredTextarea.prototype,"readonly",void 0),Lt([J({type:Number}),Bt("design:type",Number)],e.WiredTextarea.prototype,"minlength",void 0),Lt([J({type:Number}),Bt("design:type",Number)],e.WiredTextarea.prototype,"maxlength",void 0),Lt([K("textarea"),Bt("design:type",HTMLTextAreaElement)],e.WiredTextarea.prototype,"textareaInput",void 0),e.WiredTextarea=Lt([X("wired-textarea")],e.WiredTextarea);var Vt=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Ht=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredToggle=class extends de{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}static get styles(){return[ae,se`
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
      }
      :host([disabled]) {
        opacity: 0.4 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        opacity: 0;
      }
      .knob {
        transition: transform 0.3s ease;
      }
      .knob path {
        stroke-width: 0.7;
      }
      .knob.checked {
        transform: translateX(48px);
      }
      .knobfill path {
        stroke-width: 3 !important;
        fill: transparent;
      }
      .knob.unchecked .knobfill path {
        stroke: var(--wired-toggle-off-color, gray);
      }
      .knob.checked .knobfill path {
        stroke: var(--wired-toggle-on-color, rgb(63, 81, 181));
      }
      `]}render(){return P`
    <div style="position: relative;">
      <svg></svg>
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}"  @change="${this.onChange}">
    </div>
    `}focus(){this.input?this.input.focus():super.focus()}wiredRender(e=!1){super.wiredRender(e),this.refreshKnob()}onChange(){this.checked=this.input.checked,this.refreshKnob(),Ce(this,"change",{checked:this.checked})}canvasSize(){return[80,34]}draw(e,t){we(e,16,8,t[0]-32,18),this.knob=fe("g"),this.knob.classList.add("knob"),e.appendChild(this.knob);const i=_e(16,16,32,32);i.classList.add("knobfill"),this.knob.appendChild(i),xe(this.knob,16,16,32,32)}refreshKnob(){if(this.knob){const e=this.knob.classList;this.checked?(e.remove("unchecked"),e.add("checked")):(e.remove("checked"),e.add("unchecked"))}}},Vt([J({type:Boolean}),Ht("design:type",Object)],e.WiredToggle.prototype,"checked",void 0),Vt([J({type:Boolean,reflect:!0}),Ht("design:type",Object)],e.WiredToggle.prototype,"disabled",void 0),Vt([K("input"),Ht("design:type",HTMLInputElement)],e.WiredToggle.prototype,"input",void 0),e.WiredToggle=Vt([X("wired-toggle")],e.WiredToggle);var Ut=function(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n},Ft=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};return e.WiredVideo=class extends de{constructor(){super(),this.src="",this.autoplay=!1,this.loop=!1,this.muted=!1,this.playsinline=!1,this.playing=!1,this.timeDisplay="",window.ResizeObserver&&(this.resizeObserver=new window.ResizeObserver(()=>{this.svg&&this.wiredRender()}))}static get styles(){return[ae,se`
        :host {
          display: inline-block;
          position: relative;
          line-height: 1;
          padding: 3px 3px 68px;
          --wired-progress-color: var(--wired-video-highlight-color, rgb(51, 103, 214));
          --wired-slider-knob-color: var(--wired-video-highlight-color, rgb(51, 103, 214));
        }
        video {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
        #controls {
          position: absolute;
          pointer-events: auto;
          left: 0;
          bottom: 0;
          width: 100%;
          box-sizing: border-box;
          height: 70px;
        }
        .layout.horizontal {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          padding: 5px 10px;
        }
        .flex {
          -ms-flex: 1 1 0.000000001px;
          -webkit-flex: 1;
          flex: 1;
          -webkit-flex-basis: 0.000000001px;
          flex-basis: 0.000000001px;
        }
        wired-progress {
          display: block;
          width: 100%;
          box-sizing: border-box;
          height: 20px;
          --wired-progress-label-color: transparent;
          --wired-progress-label-background: transparent;
        }
        wired-icon-button span {
          font-size: 16px;
          line-height: 16px;
          width: 16px;
          height: 16px;
          padding: 0px;
          font-family: sans-serif;
          display: inline-block;
        }
        #timeDisplay {
          padding: 0 20px 0 8px;
          font-size: 13px;
        }
        wired-slider {
          display: block;
          max-width: 200px;
          margin: 0 6px 0 auto;
        }
      `]}render(){return P`
    <video
      .autoplay="${this.autoplay}"
      .loop="${this.loop}"
      .muted="${this.muted}"
      .playsinline="${this.playsinline}"
      src="${this.src}"
      @play="${()=>this.playing=!0}"
      @pause="${()=>this.playing=!1}"
      @canplay="${this.canPlay}"
      @timeupdate="${this.updateTime}">
    </video>
    <div id="overlay">
      <svg></svg>
    </div>
    <div id="controls">
      <wired-progress></wired-progress>
      <div class="horizontal layout center">
        <wired-icon-button @click="${this.togglePause}">
          <span>${this.playing?"||":"▶"}</span>
        </wired-icon-button>
        <div id="timeDisplay">${this.timeDisplay}</div>
        <div class="flex">
          <wired-slider @change="${this.volumeChange}"></wired-slider>
        </div>
        <div style="width: 24px; height: 24px;">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path style="stroke: none; fill: currentColor;" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></g></svg>
        </div>
      </div>
    </div>
    `}updated(){super.updated(),this.attachResizeListener()}disconnectedCallback(){this.detachResizeListener()}attachResizeListener(){this.resizeObserver&&this.resizeObserver.observe?this.resizeObserver.observe(this):this.windowResizeHandler||(this.windowResizeHandler=()=>this.wiredRender(),window.addEventListener("resize",this.windowResizeHandler,{passive:!0}))}detachResizeListener(){this.resizeObserver&&this.resizeObserver.unobserve&&this.resizeObserver.unobserve(this),this.windowResizeHandler&&window.removeEventListener("resize",this.windowResizeHandler)}wiredRender(){super.wiredRender(),this.progressBar&&this.progressBar.wiredRender(!0)}canvasSize(){const e=this.getBoundingClientRect();return[e.width,e.height]}draw(e,t){we(e,2,2,t[0]-4,t[1]-4)}updateTime(){this.video&&this.progressBar&&(this.progressBar.value=this.video.duration?Math.round(this.video.currentTime/this.video.duration*100):0,this.timeDisplay=`${this.getTimeDisplay(this.video.currentTime)} / ${this.getTimeDisplay(this.video.duration)}`)}getTimeDisplay(e){const t=Math.floor(e/60);return`${t}:${Math.round(e-60*t)}`}togglePause(){this.video&&(this.playing?this.video.pause():this.video.play())}volumeChange(){this.video&&this.slider&&(this.video.volume=this.slider.value/100)}canPlay(){this.slider&&this.video&&(this.slider.value=100*this.video.volume)}},Ut([J({type:String}),Ft("design:type",Object)],e.WiredVideo.prototype,"src",void 0),Ut([J({type:Boolean}),Ft("design:type",Object)],e.WiredVideo.prototype,"autoplay",void 0),Ut([J({type:Boolean}),Ft("design:type",Object)],e.WiredVideo.prototype,"loop",void 0),Ut([J({type:Boolean}),Ft("design:type",Object)],e.WiredVideo.prototype,"muted",void 0),Ut([J({type:Boolean}),Ft("design:type",Object)],e.WiredVideo.prototype,"playsinline",void 0),Ut([J(),Ft("design:type",Object)],e.WiredVideo.prototype,"playing",void 0),Ut([J(),Ft("design:type",Object)],e.WiredVideo.prototype,"timeDisplay",void 0),Ut([K("wired-progress"),Ft("design:type",e.WiredProgress)],e.WiredVideo.prototype,"progressBar",void 0),Ut([K("wired-slider"),Ft("design:type",e.WiredSlider)],e.WiredVideo.prototype,"slider",void 0),Ut([K("video"),Ft("design:type",HTMLVideoElement)],e.WiredVideo.prototype,"video",void 0),e.WiredVideo=Ut([X("wired-video"),Ft("design:paramtypes",[])],e.WiredVideo),e}({});

var WiredElements=function(e){"use strict";const t=new WeakMap,i=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,o=(e,t,i=null)=>{let s=t;for(;s!==i;){const t=s.nextSibling;e.removeChild(s),s=t}},n={},r={},a=`{{lit-${String(Math.random()).slice(2)}}}`,d=`\x3c!--${a}--\x3e`,l=new RegExp(`${a}|${d}`),h="$lit$";class c{constructor(e,t){this.parts=[],this.element=t;let i=-1,s=0;const o=[],n=t=>{const r=t.content,d=document.createTreeWalker(r,133,null,!1);let c=0;for(;d.nextNode();){i++;const t=d.currentNode;if(1===t.nodeType){if(t.hasAttributes()){const o=t.attributes;let n=0;for(let e=0;e<o.length;e++)o[e].value.indexOf(a)>=0&&n++;for(;n-- >0;){const o=e.strings[s],n=f.exec(o)[2],r=n.toLowerCase()+h,a=t.getAttribute(r).split(l);this.parts.push({type:"attribute",index:i,name:n,strings:a}),t.removeAttribute(r),s+=a.length-1}}"TEMPLATE"===t.tagName&&n(t)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(a)>=0){const n=t.parentNode,r=e.split(l),a=r.length-1;for(let e=0;e<a;e++)n.insertBefore(""===r[e]?u():document.createTextNode(r[e]),t),this.parts.push({type:"node",index:++i});""===r[a]?(n.insertBefore(u(),t),o.push(t)):t.data=r[a],s+=a}}else if(8===t.nodeType)if(t.data===a){const e=t.parentNode;null!==t.previousSibling&&i!==c||(i++,e.insertBefore(u(),t)),c=i,this.parts.push({type:"node",index:i}),null===t.nextSibling?t.data="":(o.push(t),i--),s++}else{let e=-1;for(;-1!==(e=t.data.indexOf(a,e+1));)this.parts.push({type:"node",index:-1})}}};n(t);for(const e of o)e.parentNode.removeChild(e)}}const p=e=>-1!==e.index,u=()=>document.createComment(""),f=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class g{constructor(e,t,i){this._parts=[],this.template=e,this.processor=t,this.options=i}update(e){let t=0;for(const i of this._parts)void 0!==i&&i.setValue(e[t]),t++;for(const e of this._parts)void 0!==e&&e.commit()}_clone(){const e=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),t=this.template.parts;let i=0,o=0;const n=e=>{const s=document.createTreeWalker(e,133,null,!1);let r=s.nextNode();for(;i<t.length&&null!==r;){const e=t[i];if(p(e))if(o===e.index){if("node"===e.type){const e=this.processor.handleTextExpression(this.options);e.insertAfterNode(r.previousSibling),this._parts.push(e)}else this._parts.push(...this.processor.handleAttributeExpressions(r,e.name,e.strings,this.options));i++}else o++,"TEMPLATE"===r.nodeName&&n(r.content),r=s.nextNode();else this._parts.push(void 0),i++}};return n(e),s&&(document.adoptNode(e),customElements.upgrade(e)),e}}class m{constructor(e,t,i,s){this.strings=e,this.values=t,this.type=i,this.processor=s}getHTML(){const e=this.strings.length-1;let t="";for(let i=0;i<e;i++){const e=this.strings[i],s=f.exec(e);t+=s?e.substr(0,s.index)+s[1]+s[2]+h+s[3]+a:e+d}return t+this.strings[e]}getTemplateElement(){const e=document.createElement("template");return e.innerHTML=this.getHTML(),e}}const v=e=>null===e||!("object"==typeof e||"function"==typeof e);class y{constructor(e,t,i){this.dirty=!0,this.element=e,this.name=t,this.strings=i,this.parts=[];for(let e=0;e<i.length-1;e++)this.parts[e]=this._createPart()}_createPart(){return new b(this)}_getValue(){const e=this.strings,t=e.length-1;let i="";for(let s=0;s<t;s++){i+=e[s];const t=this.parts[s];if(void 0!==t){const e=t.value;if(null!=e&&(Array.isArray(e)||"string"!=typeof e&&e[Symbol.iterator]))for(const t of e)i+="string"==typeof t?t:String(t);else i+="string"==typeof e?e:String(e)}}return i+=e[t]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class b{constructor(e){this.value=void 0,this.committer=e}setValue(e){e===n||v(e)&&e===this.value||(this.value=e,i(e)||(this.committer.dirty=!0))}commit(){for(;i(this.value);){const e=this.value;this.value=n,e(this)}this.value!==n&&this.committer.commit()}}class w{constructor(e){this.value=void 0,this._pendingValue=void 0,this.options=e}appendInto(e){this.startNode=e.appendChild(u()),this.endNode=e.appendChild(u())}insertAfterNode(e){this.startNode=e,this.endNode=e.nextSibling}appendIntoPart(e){e._insert(this.startNode=u()),e._insert(this.endNode=u())}insertAfterPart(e){e._insert(this.startNode=u()),this.endNode=e.endNode,e.endNode=this.startNode}setValue(e){this._pendingValue=e}commit(){for(;i(this._pendingValue);){const e=this._pendingValue;this._pendingValue=n,e(this)}const e=this._pendingValue;e!==n&&(v(e)?e!==this.value&&this._commitText(e):e instanceof m?this._commitTemplateResult(e):e instanceof Node?this._commitNode(e):Array.isArray(e)||e[Symbol.iterator]?this._commitIterable(e):e===r?(this.value=r,this.clear()):this._commitText(e))}_insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}_commitNode(e){this.value!==e&&(this.clear(),this._insert(e),this.value=e)}_commitText(e){const t=this.startNode.nextSibling;e=null==e?"":e,t===this.endNode.previousSibling&&3===t.nodeType?t.data=e:this._commitNode(document.createTextNode("string"==typeof e?e:String(e))),this.value=e}_commitTemplateResult(e){const t=this.options.templateFactory(e);if(this.value instanceof g&&this.value.template===t)this.value.update(e.values);else{const i=new g(t,e.processor,this.options),s=i._clone();i.update(e.values),this._commitNode(s),this.value=i}}_commitIterable(e){Array.isArray(this.value)||(this.value=[],this.clear());const t=this.value;let i,s=0;for(const o of e)void 0===(i=t[s])&&(i=new w(this.options),t.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(t[s-1])),i.setValue(o),i.commit(),s++;s<t.length&&(t.length=s,this.clear(i&&i.endNode))}clear(e=this.startNode){o(this.startNode.parentNode,e.nextSibling,this.endNode)}}class k{constructor(e,t,i){if(this.value=void 0,this._pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=e,this.name=t,this.strings=i}setValue(e){this._pendingValue=e}commit(){for(;i(this._pendingValue);){const e=this._pendingValue;this._pendingValue=n,e(this)}if(this._pendingValue===n)return;const e=!!this._pendingValue;this.value!==e&&(e?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)),this.value=e,this._pendingValue=n}}class x extends y{constructor(e,t,i){super(e,t,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new S(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class S extends b{}let C=!1;try{const e={get capture(){return C=!0,!1}};window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){}class R{constructor(e,t,i){this.value=void 0,this._pendingValue=void 0,this.element=e,this.eventName=t,this.eventContext=i,this._boundHandleEvent=(e=>this.handleEvent(e))}setValue(e){this._pendingValue=e}commit(){for(;i(this._pendingValue);){const e=this._pendingValue;this._pendingValue=n,e(this)}if(this._pendingValue===n)return;const e=this._pendingValue,t=this.value,s=null==e||null!=t&&(e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive),o=null!=e&&(null==t||s);s&&this.element.removeEventListener(this.eventName,this._boundHandleEvent,this._options),o&&(this._options=_(e),this.element.addEventListener(this.eventName,this._boundHandleEvent,this._options)),this.value=e,this._pendingValue=n}handleEvent(e){"function"==typeof this.value?this.value.call(this.eventContext||this.element,e):this.value.handleEvent(e)}}const _=e=>e&&(C?{capture:e.capture,passive:e.passive,once:e.once}:e.capture);const E=new class{handleAttributeExpressions(e,t,i,s){const o=t[0];return"."===o?new x(e,t.slice(1),i).parts:"@"===o?[new R(e,t.slice(1),s.eventContext)]:"?"===o?[new k(e,t.slice(1),i)]:new y(e,t,i).parts}handleTextExpression(e){return new w(e)}};function P(e){let t=N.get(e.type);void 0===t&&(t={stringsArray:new WeakMap,keyString:new Map},N.set(e.type,t));let i=t.stringsArray.get(e.strings);if(void 0!==i)return i;const s=e.strings.join(a);return void 0===(i=t.keyString.get(s))&&(i=new c(e,e.getTemplateElement()),t.keyString.set(s,i)),t.stringsArray.set(e.strings,i),i}const N=new Map,O=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.0.0");const A=(e,...t)=>new m(e,t,"html",E),T=133;function L(e,t){const{element:{content:i},parts:s}=e,o=document.createTreeWalker(i,T,null,!1);let n=j(s),r=s[n],a=-1,d=0;const l=[];let h=null;for(;o.nextNode();){a++;const e=o.currentNode;for(e.previousSibling===h&&(h=null),t.has(e)&&(l.push(e),null===h&&(h=e)),null!==h&&d++;void 0!==r&&r.index===a;)r.index=null!==h?-1:r.index-d,r=s[n=j(s,n)]}l.forEach(e=>e.parentNode.removeChild(e))}const W=e=>{let t=11===e.nodeType?0:1;const i=document.createTreeWalker(e,T,null,!1);for(;i.nextNode();)t++;return t},j=(e,t=-1)=>{for(let i=t+1;i<e.length;i++){const t=e[i];if(p(t))return i}return-1};const I=(e,t)=>`${e}--${t}`;let M=!0;void 0===window.ShadyCSS?M=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."),M=!1);const $=e=>t=>{const i=I(t.type,e);let s=N.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},N.set(i,s));let o=s.stringsArray.get(t.strings);if(void 0!==o)return o;const n=t.strings.join(a);if(void 0===(o=s.keyString.get(n))){const i=t.getTemplateElement();M&&window.ShadyCSS.prepareTemplateDom(i,e),o=new c(t,i),s.keyString.set(n,o)}return s.stringsArray.set(t.strings,o),o},B=["html","svg"],D=new Set,V=(e,t,i)=>{D.add(i);const s=e.querySelectorAll("style");if(0===s.length)return void window.ShadyCSS.prepareTemplateStyles(t.element,i);const o=document.createElement("style");for(let e=0;e<s.length;e++){const t=s[e];t.parentNode.removeChild(t),o.textContent+=t.textContent}if((e=>{B.forEach(t=>{const i=N.get(I(t,e));void 0!==i&&i.keyString.forEach(e=>{const{element:{content:t}}=e,i=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{i.add(e)}),L(e,i)})})})(i),function(e,t,i=null){const{element:{content:s},parts:o}=e;if(null==i)return void s.appendChild(t);const n=document.createTreeWalker(s,T,null,!1);let r=j(o),a=0,d=-1;for(;n.nextNode();)for(d++,n.currentNode===i&&(a=W(t),i.parentNode.insertBefore(t,i));-1!==r&&o[r].index===d;){if(a>0){for(;-1!==r;)o[r].index+=a,r=j(o,r);return}r=j(o,r)}}(t,o,t.element.content.firstChild),window.ShadyCSS.prepareTemplateStyles(t.element,i),window.ShadyCSS.nativeShadow){const i=t.element.content.querySelector("style");e.insertBefore(i.cloneNode(!0),e.firstChild)}else{t.element.content.insertBefore(o,t.element.content.firstChild);const e=new Set;e.add(o),L(t,e)}};window.JSCompiler_renameProperty=((e,t)=>e);const z={toAttribute(e,t){switch(t){case Boolean:return e?"":null;case Object:case Array:return null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){switch(t){case Boolean:return null!==e;case Number:return null===e?null:Number(e);case Object:case Array:return JSON.parse(e)}return e}},H=(e,t)=>t!==e&&(t==t||e==e),U={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:H},q=Promise.resolve(!0),F=1,X=4,Y=8,G=16,J=32;class K extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=q,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const e=[];return this._classProperties.forEach((t,i)=>{const s=this._attributeNameForProperty(i,t);void 0!==s&&(this._attributeToPropertyMap.set(s,i),e.push(s))}),e}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const e=Object.getPrototypeOf(this)._classProperties;void 0!==e&&e.forEach((e,t)=>this._classProperties.set(t,e))}}static createProperty(e,t=U){if(this._ensureClassProperties(),this._classProperties.set(e,t),t.noAccessor||this.prototype.hasOwnProperty(e))return;const i="symbol"==typeof e?Symbol():`__${e}`;Object.defineProperty(this.prototype,e,{get(){return this[i]},set(t){const s=this[e];this[i]=t,this.requestUpdate(e,s)},configurable:!0,enumerable:!0})}static finalize(){if(this.hasOwnProperty(JSCompiler_renameProperty("finalized",this))&&this.finalized)return;const e=Object.getPrototypeOf(this);if("function"==typeof e.finalize&&e.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const e=this.properties,t=[...Object.getOwnPropertyNames(e),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e):[]];for(const i of t)this.createProperty(i,e[i])}}static _attributeNameForProperty(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}static _valueHasChanged(e,t,i=H){return i(e,t)}static _propertyValueFromAttribute(e,t){const i=t.type,s=t.converter||z,o="function"==typeof s?s:s.fromAttribute;return o?o(e,i):e}static _propertyValueToAttribute(e,t){if(void 0===t.reflect)return;const i=t.type,s=t.converter;return(s&&s.toAttribute||z.toAttribute)(e,i)}initialize(){this._saveInstanceProperties()}_saveInstanceProperties(){this.constructor._classProperties.forEach((e,t)=>{if(this.hasOwnProperty(t)){const e=this[t];delete this[t],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(t,e)}})}_applyInstanceProperties(){this._instanceProperties.forEach((e,t)=>this[t]=e),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|J,this._hasConnectedResolver?(this._hasConnectedResolver(),this._hasConnectedResolver=void 0):this.requestUpdate()}disconnectedCallback(){}attributeChangedCallback(e,t,i){t!==i&&this._attributeToProperty(e,i)}_propertyToAttribute(e,t,i=U){const s=this.constructor,o=s._attributeNameForProperty(e,i);if(void 0!==o){const e=s._propertyValueToAttribute(t,i);if(void 0===e)return;this._updateState=this._updateState|Y,null==e?this.removeAttribute(o):this.setAttribute(o,e),this._updateState=this._updateState&~Y}}_attributeToProperty(e,t){if(this._updateState&Y)return;const i=this.constructor,s=i._attributeToPropertyMap.get(e);if(void 0!==s){const e=i._classProperties.get(s)||U;this._updateState=this._updateState|G,this[s]=i._propertyValueFromAttribute(t,e),this._updateState=this._updateState&~G}}requestUpdate(e,t){let i=!0;if(void 0!==e&&!this._changedProperties.has(e)){const s=this.constructor,o=s._classProperties.get(e)||U;s._valueHasChanged(this[e],t,o.hasChanged)?(this._changedProperties.set(e,t),!0!==o.reflect||this._updateState&G||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(e,o))):i=!1}return!this._hasRequestedUpdate&&i&&this._enqueueUpdate(),this.updateComplete}async _enqueueUpdate(){let e;this._updateState=this._updateState|X;const t=this._updatePromise;this._updatePromise=new Promise(t=>e=t),await t,this._hasConnected||await new Promise(e=>this._hasConnectedResolver=e);const i=this.performUpdate();null!=i&&"function"==typeof i.then&&await i,e(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&J}get _hasRequestedUpdate(){return this._updateState&X}get hasUpdated(){return this._updateState&F}performUpdate(){if(this._instanceProperties&&this._applyInstanceProperties(),this.shouldUpdate(this._changedProperties)){const e=this._changedProperties;this.update(e),this._markUpdated(),this._updateState&F||(this._updateState=this._updateState|F,this.firstUpdated(e)),this.updated(e)}else this._markUpdated()}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~X}get updateComplete(){return this._updatePromise}shouldUpdate(e){return!0}update(e){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((e,t)=>this._propertyToAttribute(t,this[t],e)),this._reflectingProperties=void 0)}updated(e){}firstUpdated(e){}}K.finalized=!0;const Q=e=>t=>"function"==typeof t?((e,t)=>(window.customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:s}=t;return{kind:i,elements:s,finisher(t){window.customElements.define(e,t)}}})(e,t),Z=(e,t)=>"method"!==t.kind||!t.descriptor||"value"in t.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}}:Object.assign({},t,{finisher(i){i.createProperty(t.key,e)}}),ee=(e,t,i)=>{t.constructor.createProperty(i,e)};function te(e){return(t,i)=>void 0!==i?ee(e,t,i):Z(e,t)}const ie="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol();class oe{constructor(e,t){if(t!==se)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return void 0===this._styleSheet&&(ie?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const ne=(e,...t)=>{const i=t.reduce((t,i,s)=>t+(e=>{if(e instanceof oe)return e.cssText;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${e}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+e[s+1],e[0]);return new oe(i,se)};(window.litElementVersions||(window.litElementVersions=[])).push("2.0.1");const re=e=>e.flat?e.flat(1/0):function e(t,i=[]){for(let s=0,o=t.length;s<o;s++){const o=t[s];Array.isArray(o)?e(o,i):i.push(o)}return i}(e);class ae extends K{static finalize(){super.finalize(),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const e=this.styles,t=[];if(Array.isArray(e)){re(e).reduceRight((e,t)=>(e.add(t),e),new Set).forEach(e=>t.unshift(e))}else e&&t.push(e);return t}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const e=this.constructor._styles;0!==e.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?ie?this.renderRoot.adoptedStyleSheets=e.map(e=>e.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e.map(e=>e.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(e){super.update(e);const t=this.render();t instanceof m&&this.constructor.render(t,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(e=>{const t=document.createElement("style");t.textContent=e.cssText,this.renderRoot.appendChild(t)}))}render(){}}ae.finalized=!0,ae.render=((e,t,i)=>{const s=i.scopeName,n=O.has(t),r=t instanceof ShadowRoot&&M&&e instanceof m,a=r&&!D.has(s),d=a?document.createDocumentFragment():t;if(((e,t,i)=>{let s=O.get(t);void 0===s&&(o(t,t.firstChild),O.set(t,s=new w(Object.assign({templateFactory:P},i))),s.appendInto(t)),s.setValue(e),s.commit()})(e,d,Object.assign({templateFactory:$(s)},i)),a){const e=O.get(d);O.delete(d),e.value instanceof g&&V(d,e.value.template,s),o(t,t.firstChild),t.appendChild(d),O.set(t,e)}!n&&r&&window.ShadyCSS.styleElement(t.host)});const de=2,le=1,he=.85,ce=0,pe=9;class ue{constructor(){this.p=""}get value(){return this.p.trim()}moveTo(e,t){this.p=`${this.p}M ${e} ${t} `}bcurveTo(e,t,i,s,o,n){this.p=`${this.p}C ${e} ${t}, ${i} ${s}, ${o} ${n} `}}function fe(e,t){const i=document.createElementNS("http://www.w3.org/2000/svg",e);if(t)for(const e in t)i.setAttributeNS(null,e,t[e]);return i}function ge(e,t){return le*(Math.random()*(t-e)+e)}function me(e,t,i,s,o){const n=Math.pow(e-i,2)+Math.pow(t-s,2);let r=de;r*r*100>n&&(r=Math.sqrt(n)/10);const a=r/2,d=.2+.2*Math.random();let l=he*de*(s-t)/200,h=he*de*(e-i)/200;l=ge(-l,l),h=ge(-h,h);const c=o||new ue;return c.moveTo(e+ge(-r,r),t+ge(-r,r)),c.bcurveTo(l+e+(i-e)*d+ge(-r,r),h+t+(s-t)*d+ge(-r,r),l+e+2*(i-e)*d+ge(-r,r),h+t+2*(s-t)*d+ge(-r,r),i+ge(-r,r),s+ge(-r,r)),c.moveTo(e+ge(-a,a),t+ge(-a,a)),c.bcurveTo(l+e+(i-e)*d+ge(-a,a),h+t+(s-t)*d+ge(-a,a),l+e+2*(i-e)*d+ge(-a,a),h+t+2*(s-t)*d+ge(-a,a),i+ge(-a,a),s+ge(-a,a)),c}function ve(e,t,i,s,o=!1,n=!1,r){r=r||new ue;const a=Math.pow(e-i,2)+Math.pow(t-s,2);let d=de;d*d*100>a&&(d=Math.sqrt(a)/10);const l=d/2,h=.2+.2*Math.random();let c=he*de*(s-t)/200,p=he*de*(e-i)/200;return c=ge(-c,c),p=ge(-p,p),o&&r.moveTo(e+ge(-d,d),t+ge(-d,d)),n?r.bcurveTo(c+e+(i-e)*h+ge(-l,l),p+t+(s-t)*h+ge(-l,l),c+e+2*(i-e)*h+ge(-l,l),p+t+2*(s-t)*h+ge(-l,l),i+ge(-l,l),s+ge(-l,l)):r.bcurveTo(c+e+(i-e)*h+ge(-d,d),p+t+(s-t)*h+ge(-d,d),c+e+2*(i-e)*h+ge(-d,d),p+t+2*(s-t)*h+ge(-d,d),i+ge(-d,d),s+ge(-d,d)),r}function ye(e,t,i,s,o,n,r,a){const d=ge(-.5,.5)-Math.PI/2,l=[];l.push([ge(-n,n)+t+.9*s*Math.cos(d-e),ge(-n,n)+i+.9*o*Math.sin(d-e)]);for(let r=d;r<2*Math.PI+d-.01;r+=e)l.push([ge(-n,n)+t+s*Math.cos(r),ge(-n,n)+i+o*Math.sin(r)]);return l.push([ge(-n,n)+t+s*Math.cos(d+2*Math.PI+.5*r),ge(-n,n)+i+o*Math.sin(d+2*Math.PI+.5*r)]),l.push([ge(-n,n)+t+.98*s*Math.cos(d+r),ge(-n,n)+i+.98*o*Math.sin(d+r)]),l.push([ge(-n,n)+t+.9*s*Math.cos(d+.5*r),ge(-n,n)+i+.9*o*Math.sin(d+.5*r)]),function(e,t){const i=e.length;let s=t||new ue;if(i>3){const t=[],o=1-ce;s.moveTo(e[1][0],e[1][1]);for(let n=1;n+2<i;n++){const i=e[n];t[0]=[i[0],i[1]],t[1]=[i[0]+(o*e[n+1][0]-o*e[n-1][0])/6,i[1]+(o*e[n+1][1]-o*e[n-1][1])/6],t[2]=[e[n+1][0]+(o*e[n][0]-o*e[n+2][0])/6,e[n+1][1]+(o*e[n][1]-o*e[n+2][1])/6],t[3]=[e[n+1][0],e[n+1][1]],s.bcurveTo(t[1][0],t[1][1],t[2][0],t[2][1],t[3][0],t[3][1])}}else 3===i?(s.moveTo(e[0][0],e[0][1]),s.bcurveTo(e[1][0],e[1][1],e[2][0],e[2][1],e[2][0],e[2][1])):2===i&&(s=me(e[0][0],e[0][1],e[1][0],e[1][1],s));return s}(l,a)}function be(e,t,i,s,o){const n=fe("path",{d:me(t,i,s,o).value});return e.appendChild(n),n}function we(e,t,i,s,o){o-=4;let n=me(t+=2,i+=2,t+(s-=4),i);n=me(t+s,i,t+s,i+o,n),n=me(t+s,i+o,t,i+o,n);const r=fe("path",{d:(n=me(t,i+o,t,i,n)).value});return e.appendChild(r),r}function ke(e,t){let i;const s=t.length;if(s>2)for(let e=0;e<2;e++){let o=!0;for(let e=1;e<s;e++)i=ve(t[e-1][0],t[e-1][1],t[e][0],t[e][1],o,e>0,i),o=!1;i=ve(t[s-1][0],t[s-1][1],t[0][0],t[0][1],o,e>0,i)}else i=2===s?me(t[0][0],t[0][1],t[1][0],t[1][1]):new ue;const o=fe("path",{d:i.value});return e.appendChild(o),o}function xe(e,t,i,s,o){s=Math.max(s>10?s-4:s-1,1),o=Math.max(o>10?o-4:o-1,1);const n=2*Math.PI/pe;let r=Math.abs(s/2),a=Math.abs(o/2),d=ye(n,t,i,r+=ge(.05*-r,.05*r),a+=ge(.05*-a,.05*a),1,n*ge(.1,ge(.4,1)));const l=fe("path",{d:(d=ye(n,t,i,r,a,1.5,0,d)).value});return e.appendChild(l),l}var Se=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Ce=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredButton=class extends ae{constructor(){super(...arguments),this.elevation=1,this.disabled=!1}static get styles(){return ne`
    :host {
      display: inline-block;
      font-family: inherit;
      cursor: pointer;
      padding: 8px 10px;
      position: relative;
      text-align: center;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      display: inline-flex;
      outline: none;
    }

    :host(.wired-pending) {
      opacity: 0;
    }

    :host(:active) path {
      transform: scale(0.97) translate(1.5%, 1.5%);
    }

    :host(.wired-disabled) {
      opacity: 0.6 !important;
      background: rgba(0, 0, 0, 0.07);
      cursor: default;
      pointer-events: none;
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

    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
      transition: transform 0.05s ease;
    }
    `}render(){return A`
    <slot></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}firstUpdated(){this.addEventListener("keydown",e=>{13!==e.keyCode&&32!==e.keyCode||(e.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText)}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=this.getBoundingClientRect(),s=Math.min(Math.max(1,this.elevation),5),o=i.width+2*(s-1),n=i.height+2*(s-1);t.setAttribute("width",`${o}`),t.setAttribute("height",`${n}`),we(t,0,0,i.width,i.height);for(let e=1;e<s;e++)be(t,2*e,i.height+2*e,i.width+2*e,i.height+2*e).style.opacity=`${(75-10*e)/100}`,be(t,i.width+2*e,i.height+2*e,i.width+2*e,2*e).style.opacity=`${(75-10*e)/100}`,be(t,2*e,i.height+2*e,i.width+2*e,i.height+2*e).style.opacity=`${(75-10*e)/100}`,be(t,i.width+2*e,i.height+2*e,i.width+2*e,2*e).style.opacity=`${(75-10*e)/100}`;this.classList.remove("wired-pending")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}},Se([te({type:Number}),Ce("design:type",Object)],e.WiredButton.prototype,"elevation",void 0),Se([te({type:Boolean,reflect:!0}),Ce("design:type",Object)],e.WiredButton.prototype,"disabled",void 0),e.WiredButton=Se([Q("wired-button")],e.WiredButton);var Re=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},_e=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCard=class extends ae{constructor(){super(...arguments),this.elevation=1}static get styles(){return ne`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
    }
  
    :host(.wired-pending) {
      opacity: 0;
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
    `}render(){return A`
    <div>
      <slot @slotchange="${()=>this.requestUpdate()}"></slot>
    </div>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}connectedCallback(){super.connectedCallback(),this.resizeHandler||(this.resizeHandler=this.debounce(this.updated.bind(this),200,!1,this),window.addEventListener("resize",this.resizeHandler)),setTimeout(()=>this.updated())}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.resizeHandler&&(window.removeEventListener("resize",this.resizeHandler),delete this.resizeHandler)}debounce(e,t,i,s){let o=0;return()=>{const n=arguments,r=i&&!o;clearTimeout(o),o=window.setTimeout(()=>{o=0,i||e.apply(s,n)},t),r&&e.apply(s,n)}}updated(){const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const t=this.getBoundingClientRect(),i=Math.min(Math.max(1,this.elevation),5),s=t.width+2*(i-1),o=t.height+2*(i-1);e.setAttribute("width",`${s}`),e.setAttribute("height",`${o}`),we(e,0,0,t.width,t.height);for(let s=1;s<i;s++)be(e,2*s,t.height+2*s,t.width+2*s,t.height+2*s).style.opacity=`${(85-10*s)/100}`,be(e,t.width+2*s,t.height+2*s,t.width+2*s,2*s).style.opacity=`${(85-10*s)/100}`,be(e,2*s,t.height+2*s,t.width+2*s,t.height+2*s).style.opacity=`${(85-10*s)/100}`,be(e,t.width+2*s,t.height+2*s,t.width+2*s,2*s).style.opacity=`${(85-10*s)/100}`;this.classList.remove("wired-pending")}},Re([te({type:Number}),_e("design:type",Object)],e.WiredCard.prototype,"elevation",void 0),e.WiredCard=Re([Q("wired-card")],e.WiredCard);var Ee=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Pe=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCheckbox=class extends ae{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.text=""}static get styles(){return ne`
    :host {
      display: block;
      font-family: inherit;
      outline: none;
    }
  
    :host(.wired-disabled) {
      opacity: 0.6 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(:focus) path {
      stroke-width: 1.5;
    }
  
    #container {
      display: inline-block;
      white-space: nowrap;
    }
  
    .inline {
      display: inline-block;
      vertical-align: middle;
    }
  
    #checkPanel {
      cursor: pointer;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: var(--wired-checkbox-icon-color, currentColor);
      stroke-width: 0.7;
    }
    `}render(){return A`
    <div id="container" @click="${this.toggleCheck}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${this.text}</div>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked;const e=new CustomEvent("change",{bubbles:!0,composed:!0,detail:{checked:this.checked}});this.dispatchEvent(e)}firstUpdated(){this.setAttribute("role","checkbox"),this.addEventListener("keydown",e=>{13!==e.keyCode&&32!==e.keyCode||(e.preventDefault(),this.toggleCheck())})}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=24,s=24;t.setAttribute("width",`${i}`),t.setAttribute("height",`${s}`),we(t,0,0,i,s);const o=[];o.push(be(t,.3*i,.4*s,.5*i,.7*s)),o.push(be(t,.5*i,.7*s,i+5,-5)),o.forEach(e=>{e.style.strokeWidth="2.5"}),this.checked?o.forEach(e=>{e.style.display=""}):o.forEach(e=>{e.style.display="none"}),this.classList.remove("wired-pending")}},Ee([te({type:Boolean}),Pe("design:type",Object)],e.WiredCheckbox.prototype,"checked",void 0),Ee([te({type:Boolean,reflect:!0}),Pe("design:type",Object)],e.WiredCheckbox.prototype,"disabled",void 0),Ee([te({type:String}),Pe("design:type",Object)],e.WiredCheckbox.prototype,"text",void 0),e.WiredCheckbox=Ee([Q("wired-checkbox")],e.WiredCheckbox);var Ne=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Oe=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredItem=class extends ae{constructor(){super(...arguments),this.itemClickHandler=this.onClick.bind(this)}render(){return A`
    <style>
      :host {
        display: block;
        padding: 8px;
        font-family: inherit;
      }
    </style>
    <span>${this.text}</span>
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.itemClickHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.itemClickHandler)}onClick(){const e=new CustomEvent("item-click",{bubbles:!0,composed:!0,detail:{text:this.text,value:this.value}});this.dispatchEvent(e)}},Ne([te({type:String}),Oe("design:type",String)],e.WiredItem.prototype,"text",void 0),Ne([te({type:String}),Oe("design:type",String)],e.WiredItem.prototype,"value",void 0),e.WiredItem=Ne([Q("wired-item")],e.WiredItem);var Ae=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Te=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredCombo=class extends ae{constructor(){super(...arguments),this.disabled=!1,this.cardShowing=!1,this.itemNodes=[]}static get styles(){return ne`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      outline: none;
    }
  
    :host(.wired-disabled) {
      opacity: 0.5 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.02);
    }
  
    :host(.wired-pending) {
      opacity: 0;
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
      position: absolute;
      background: var(--wired-combo-popup-bg, white);
      z-index: 1;
      box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
    }

    ::slotted(.selected-item) {
      background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
    }
  
    ::slotted(wired-item) {
      cursor: pointer;
      white-space: nowrap;
    }
  
    ::slotted(wired-item:hover) {
      background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
    }
    `}render(){return A`
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value&&this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" role="listbox" @item-click="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){this.setAttribute("role","combobox"),this.setAttribute("aria-haspopup","listbox"),this.refreshSelection(),this.addEventListener("blur",()=>{this.cardShowing&&this.setCardShowing(!1)}),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext();break;case 27:e.preventDefault(),this.cardShowing&&this.setCardShowing(!1);break;case 13:e.preventDefault(),this.setCardShowing(!this.cardShowing);break;case 32:e.preventDefault(),this.cardShowing||this.setCardShowing(!0)}})}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=this.shadowRoot.getElementById("container").getBoundingClientRect();t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`);const s=this.shadowRoot.getElementById("textPanel").getBoundingClientRect();this.shadowRoot.getElementById("dropPanel").style.minHeight=s.height+"px",we(t,0,0,s.width,s.height);const o=s.width-4;we(t,o,0,34,s.height);const n=Math.max(0,Math.abs((s.height-24)/2)),r=ke(t,[[o+8,5+n],[o+26,5+n],[o+17,n+Math.min(s.height,18)]]);if(r.style.fill="currentColor",r.style.pointerEvents=this.disabled?"none":"auto",r.style.cursor="pointer",this.classList.remove("wired-pending"),this.setAttribute("aria-expanded",`${this.cardShowing}`),!this.itemNodes.length){this.itemNodes=[];const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e&&e.length)for(let t=0;t<e.length;t++){const i=e[t];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.classList.remove("selected-item"),this.lastSelectedItem.removeAttribute("aria-selected"));const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e){let t=null;for(let i=0;i<e.length;i++){const s=e[i];if("WIRED-ITEM"===s.tagName){const e=s.value||"";if(this.selected&&e===this.selected){t=s;break}}}this.lastSelectedItem=t||void 0,this.lastSelectedItem&&(this.lastSelectedItem.classList.add("selected-item"),this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=t?{value:t.value||"",text:t.text||""}:void 0}}setCardShowing(e){this.cardShowing=e;const t=this.shadowRoot.getElementById("card");t.style.display=e?"":"none",e&&setTimeout(()=>{t.requestUpdate()},10),this.setAttribute("aria-expanded",`${this.cardShowing}`)}onItemClick(e){e.stopPropagation(),this.setCardShowing(!1),this.selected=e.detail.value,this.refreshSelection(),this.fireSelected()}fireSelected(){const e=new CustomEvent("selected",{bubbles:!0,composed:!0,detail:{selected:this.selected}});this.dispatchEvent(e)}selectPrevious(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0?t=0:0===t?t=e.length-1:t--,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0?t=0:t>=e.length-1?t=0:t++,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}onCombo(e){e.stopPropagation(),this.setCardShowing(!this.cardShowing)}},Ae([te({type:Object}),Te("design:type",Object)],e.WiredCombo.prototype,"value",void 0),Ae([te({type:String}),Te("design:type",String)],e.WiredCombo.prototype,"selected",void 0),Ae([te({type:Boolean,reflect:!0}),Te("design:type",Object)],e.WiredCombo.prototype,"disabled",void 0),e.WiredCombo=Ae([Q("wired-combo")],e.WiredCombo),window.navigator.userAgent.match("Trident")&&(DOMTokenList.prototype.toggle=function(e,t){return void 0===t||t?this.add(e):this.remove(e),void 0===t||t});const Le=ne`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:"liga";-webkit-font-smoothing:antialiased}`,We=document.createElement("link");We.rel="stylesheet",We.href="https://fonts.googleapis.com/icon?family=Material+Icons",document.head.appendChild(We);var je=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r};let Ie=class extends ae{render(){return A`<slot></slot>`}};Ie.styles=Le,Ie=je([Q("mwc-icon")],Ie);var Me=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},$e=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredIconButton=class extends ae{constructor(){super(...arguments),this.disabled=!1}static get styles(){return ne`
    :host {
      display: -ms-inline-flexbox;
      display: -webkit-inline-flex;
      display: inline-flex;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      position: relative;
      vertical-align: middle;
      padding: 8px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      z-index: 0;
      line-height: 1;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box !important;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.45 !important;
      cursor: default;
      background: rgba(0, 0, 0, 0.07);
      border-radius: 50%;
      pointer-events: none;
    }
  
    :host(:active) path {
      transform: scale(0.96) translate(2%, 2%);
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
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: var(--wired-icon-bg-color, transparent);
      transition: transform 0.05s ease;
    }
  
    mwc-icon {
      position: relative;
      font-size: var(--wired-icon-size, 24px);
    }
    `}render(){return A`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <mwc-icon>
      <slot></slot>
    </mwc-icon>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}firstUpdated(){this.addEventListener("keydown",e=>{13!==e.keyCode&&32!==e.keyCode||(e.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=this.getBoundingClientRect(),s=Math.min(i.width,i.height);t.setAttribute("width",`${s}`),t.setAttribute("height",`${s}`),xe(t,s/2,s/2,s,s),this.classList.remove("wired-pending")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}},Me([te({type:Boolean,reflect:!0}),$e("design:type",Object)],e.WiredIconButton.prototype,"disabled",void 0),e.WiredIconButton=Me([Q("wired-icon-button")],e.WiredIconButton);var Be=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},De=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredInput=class extends ae{constructor(){super(...arguments),this.placeholder="",this.type="text",this.autocomplete="",this.autocapitalize="",this.autocorrect="",this.disabled=!1,this.required=!1,this.autofocus=!1,this.readonly=!1}static get styles(){return ne`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: sans-serif;
      width: 150px;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.6 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
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
    }
    `}render(){return A`
    <input id="txt" name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" @change="${this.onChange}">
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=this.attachShadow({mode:"open",delegatesFocus:!0});return this.classList.add("wired-pending"),e}get input(){return this.shadowRoot?this.shadowRoot.getElementById("txt"):null}get value(){const e=this.input;return e&&e.value||""}set value(e){if(this.shadowRoot){const t=this.input;t&&(t.value=e)}else this.pendingValue=e}firstUpdated(){this.value=this.value||this.getAttribute("value")||""}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i=this.getBoundingClientRect();t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`),we(t,0,0,i.width,i.height),void 0!==this.pendingValue&&(this.input.value=this.pendingValue,delete this.pendingValue),this.classList.remove("wired-pending")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled")}onChange(e){e.stopPropagation();const t=new CustomEvent(e.type,{bubbles:!0,composed:!0,cancelable:e.cancelable,detail:{sourceEvent:e}});this.dispatchEvent(t)}},Be([te({type:String}),De("design:type",Object)],e.WiredInput.prototype,"placeholder",void 0),Be([te({type:String}),De("design:type",String)],e.WiredInput.prototype,"name",void 0),Be([te({type:String}),De("design:type",String)],e.WiredInput.prototype,"min",void 0),Be([te({type:String}),De("design:type",String)],e.WiredInput.prototype,"max",void 0),Be([te({type:String}),De("design:type",String)],e.WiredInput.prototype,"step",void 0),Be([te({type:String}),De("design:type",Object)],e.WiredInput.prototype,"type",void 0),Be([te({type:String}),De("design:type",Object)],e.WiredInput.prototype,"autocomplete",void 0),Be([te({type:String}),De("design:type",Object)],e.WiredInput.prototype,"autocapitalize",void 0),Be([te({type:String}),De("design:type",Object)],e.WiredInput.prototype,"autocorrect",void 0),Be([te({type:Boolean,reflect:!0}),De("design:type",Object)],e.WiredInput.prototype,"disabled",void 0),Be([te({type:Boolean}),De("design:type",Object)],e.WiredInput.prototype,"required",void 0),Be([te({type:Boolean}),De("design:type",Object)],e.WiredInput.prototype,"autofocus",void 0),Be([te({type:Boolean}),De("design:type",Object)],e.WiredInput.prototype,"readonly",void 0),Be([te({type:Number}),De("design:type",Number)],e.WiredInput.prototype,"minlength",void 0),Be([te({type:Number}),De("design:type",Number)],e.WiredInput.prototype,"maxlength",void 0),Be([te({type:Number}),De("design:type",Number)],e.WiredInput.prototype,"size",void 0),e.WiredInput=Be([Q("wired-input")],e.WiredInput);var Ve=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},ze=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredListbox=class extends ae{constructor(){super(...arguments),this.horizontal=!1,this.itemNodes=[],this.itemClickHandler=this.onItemClick.bind(this)}static get styles(){return ne`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      padding: 5px;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
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
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }
  
    ::slotted(.selected-item) {
      background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
    }
  
    ::slotted(wired-item) {
      cursor: pointer;
      white-space: nowrap;
      display: block;
    }
  
    :host(.wired-horizontal) ::slotted(wired-item) {
      display: inline-block;
    }
  
    ::slotted(wired-item:hover) {
      background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
    }
    `}render(){return A`
    <slot id="slot" @slotchange="${()=>this.requestUpdate()}"></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}firstUpdated(){this.setAttribute("role","listbox"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.refreshSelection(),this.addEventListener("item-click",this.itemClickHandler),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext()}})}updated(){const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const t=this.getBoundingClientRect();if(e.setAttribute("width",`${t.width}`),e.setAttribute("height",`${t.height}`),we(e,0,0,t.width,t.height),this.classList.remove("wired-pending"),this.horizontal?this.classList.add("wired-horizontal"):this.classList.remove("wired-horizontal"),!this.itemNodes.length){this.itemNodes=[];const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e&&e.length)for(let t=0;t<e.length;t++){const i=e[t];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}onItemClick(e){e.stopPropagation(),this.selected=e.detail.value,this.refreshSelection(),this.fireSelected()}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.classList.remove("selected-item"),this.lastSelectedItem.removeAttribute("aria-selected"));const e=this.shadowRoot.getElementById("slot").assignedNodes();if(e){let t=null;for(let i=0;i<e.length;i++){const s=e[i];if("WIRED-ITEM"===s.tagName){const e=s.value||"";if(this.selected&&e===this.selected){t=s;break}}}this.lastSelectedItem=t||void 0,this.lastSelectedItem&&(this.lastSelectedItem.classList.add("selected-item"),this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=t?{value:t.value||"",text:t.text||""}:void 0}}fireSelected(){const e=new CustomEvent("selected",{bubbles:!0,composed:!0,detail:{selected:this.selected}});this.dispatchEvent(e)}selectPrevious(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0?t=0:0===t?t=e.length-1:t--,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const e=this.itemNodes;if(e.length){let t=-1;for(let i=0;i<e.length;i++)if(e[i]===this.lastSelectedItem){t=i;break}t<0?t=0:t>=e.length-1?t=0:t++,this.selected=e[t].value||"",this.refreshSelection(),this.fireSelected()}}},Ve([te({type:Object}),ze("design:type",Object)],e.WiredListbox.prototype,"value",void 0),Ve([te({type:String}),ze("design:type",String)],e.WiredListbox.prototype,"selected",void 0),Ve([te({type:Boolean}),ze("design:type",Object)],e.WiredListbox.prototype,"horizontal",void 0),e.WiredListbox=Ve([Q("wired-listbox")],e.WiredListbox);var He=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Ue=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredProgress=class extends ae{constructor(){super(...arguments),this.value=0,this.min=0,this.max=100,this.percentage=!1}static get styles(){return ne`
    :host {
      display: inline-block;
      position: relative;
      width: 400px;
      height: 42px;
      font-family: sans-serif;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
  
    .labelContainer {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .progressLabel {
      color: var(--wired-progress-label-color, #000);
      font-size: var(--wired-progress-font-size, 18px);
    }
  
    .progbox {
      fill: var(--wired-progress-color, rgba(0, 0, 200, 0.1));
      stroke-opacity: 0.6;
      stroke-width: 0.4;
    }
    `}render(){return A`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}getProgressLabel(){if(this.percentage){if(this.max===this.min)return"%";return Math.floor((this.value-this.min)/(this.max-this.min)*100)+"%"}return""+this.value}updated(){const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const t=this.getBoundingClientRect();e.setAttribute("width",`${t.width}`),e.setAttribute("height",`${t.height}`),we(e,0,0,t.width,t.height);let i=0;if(this.max>this.min){i=(this.value-this.min)/(this.max-this.min);const s=t.width*Math.max(0,Math.min(i,100));ke(e,[[0,0],[s,0],[s,t.height],[0,t.height]]).classList.add("progbox")}this.classList.remove("wired-pending")}},He([te({type:Number}),Ue("design:type",Object)],e.WiredProgress.prototype,"value",void 0),He([te({type:Number}),Ue("design:type",Object)],e.WiredProgress.prototype,"min",void 0),He([te({type:Number}),Ue("design:type",Object)],e.WiredProgress.prototype,"max",void 0),He([te({type:Boolean}),Ue("design:type",Object)],e.WiredProgress.prototype,"percentage",void 0),e.WiredProgress=He([Q("wired-progress")],e.WiredProgress);var qe=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Fe=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredRadio=class extends ae{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.text="",this.iconsize=24}static get styles(){return ne`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: inherit;
      width: 150px;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.45 !important;
      cursor: default;
      pointer-events: none;
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }
  
    #container {
      display: inline-block;
      white-space: nowrap;
    }
  
    .inline {
      display: inline-block;
      vertical-align: middle;
    }
  
    #checkPanel {
      cursor: pointer;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: var(--wired-radio-icon-color, currentColor);
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .filledPath {
      fill: var(--wired-radio-icon-color, currentColor);
    }
    `}render(){return A`
    <div id="container" @click="${this.toggleCheck}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${this.text}</div>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked;const e=new CustomEvent("change",{bubbles:!0,composed:!0,detail:{checked:this.checked}});this.dispatchEvent(e)}firstUpdated(){this.setAttribute("role","checkbox"),this.addEventListener("keydown",e=>{13!==e.keyCode&&32!==e.keyCode||(e.preventDefault(),this.toggleCheck())})}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);this.dot=void 0;const i={width:this.iconsize||24,height:this.iconsize||24};t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`),xe(t,i.width/2,i.height/2,i.width,i.height);const s=Math.max(.6*i.width,5),o=Math.max(.6*i.height,5);this.dot=xe(t,i.width/2,i.height/2,s,o),this.dot.classList.add("filledPath"),this.dot.style.display=this.checked?"":"none",this.classList.remove("wired-pending")}},qe([te({type:Boolean}),Fe("design:type",Object)],e.WiredRadio.prototype,"checked",void 0),qe([te({type:Boolean,reflect:!0}),Fe("design:type",Object)],e.WiredRadio.prototype,"disabled",void 0),qe([te({type:String}),Fe("design:type",Object)],e.WiredRadio.prototype,"text",void 0),qe([te({type:String}),Fe("design:type",String)],e.WiredRadio.prototype,"name",void 0),qe([te({type:Number}),Fe("design:type",Object)],e.WiredRadio.prototype,"iconsize",void 0),e.WiredRadio=qe([Q("wired-radio")],e.WiredRadio);var Xe=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Ye=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredRadioGroup=class extends ae{constructor(){super(...arguments),this.radioNodes=[],this.checkListener=this.handleChecked.bind(this)}static get styles(){return ne`
    :host {
      display: inline-block;
    }
  
    :host ::slotted(*) {
      padding: var(--wired-radio-group-item-padding, 5px);
    }
    `}render(){return A`
    <slot id="slot" @slotchange="${this.slotChange}"></slot>
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("change",this.checkListener)}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.removeEventListener("checked",this.checkListener)}handleChecked(e){const t=e.detail.checked,i=e.target,s=i.name||"";t?(this.selected=t&&s||"",this.fireSelected()):i.checked=!0}fireSelected(){const e=new CustomEvent("selected",{bubbles:!0,composed:!0,detail:{selected:this.selected}});this.dispatchEvent(e)}slotChange(){this.requestUpdate()}firstUpdated(){this.setAttribute("role","radiogroup"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",e=>{switch(e.keyCode){case 37:case 38:e.preventDefault(),this.selectPrevious();break;case 39:case 40:e.preventDefault(),this.selectNext()}})}updated(){const e=this.shadowRoot.getElementById("slot").assignedNodes();if(this.radioNodes=[],e&&e.length)for(let t=0;t<e.length;t++){const i=e[t];if("WIRED-RADIO"===i.tagName){this.radioNodes.push(i);const e=i.name||"";this.selected&&e===this.selected?i.checked=!0:i.checked=!1}}}selectPrevious(){const e=this.radioNodes;if(e.length){let t=null,i=-1;if(this.selected){for(let t=0;t<e.length;t++){if(e[t].name===this.selected){i=t;break}}i<0?t=e[0]:(--i<0&&(i=e.length-1),t=e[i])}else t=e[0];t&&(t.focus(),this.selected=t.name,this.fireSelected())}}selectNext(){const e=this.radioNodes;if(e.length){let t=null,i=-1;if(this.selected){for(let t=0;t<e.length;t++){if(e[t].name===this.selected){i=t;break}}i<0?t=e[0]:(++i>=e.length&&(i=0),t=e[i])}else t=e[0];t&&(t.focus(),this.selected=t.name,this.fireSelected())}}},Xe([te({type:String}),Ye("design:type",String)],e.WiredRadioGroup.prototype,"selected",void 0),e.WiredRadioGroup=Xe([Q("wired-radio-group")],e.WiredRadioGroup),window.JSCompiler_renameProperty=function(e,t){return e};let Ge=0,Je=0,Ke=[],Qe=0,Ze=document.createTextNode("");new window.MutationObserver(function(){const e=Ke.length;for(let t=0;t<e;t++){let e=Ke[t];if(e)try{e()}catch(e){setTimeout(()=>{throw e})}}Ke.splice(0,e),Je+=e}).observe(Ze,{characterData:!0});const et={after:e=>({run:t=>window.setTimeout(t,e),cancel(e){window.clearTimeout(e)}}),run:(e,t)=>window.setTimeout(e,t),cancel(e){window.clearTimeout(e)}},tt={run:e=>(Ze.textContent=Qe++,Ke.push(e),Ge++),cancel(e){const t=e-Je;if(t>=0){if(!Ke[t])throw new Error("invalid async handle: "+e);Ke[t]=null}}};class it{constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(e,t){this._asyncModule=e,this._callback=t,this._timer=this._asyncModule.run(()=>{this._timer=null,this._callback()})}cancel(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}static debounce(e,t,i){return e instanceof it?e.cancel():e=new it,e.setConfig(t,i),e}}window.ShadyDOM,Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss),window.customElements.polyfillWrapFlushCallback;(st=document.baseURI||window.location.href).substring(0,st.lastIndexOf("/")+1);var st;window.Polymer&&window.Polymer.sanitizeDOMValue;let ot=!1,nt="string"==typeof document.head.style.touchAction,rt="__polymerGestures",at="__polymerGesturesHandled",dt="__polymerGesturesTouchAction",lt=25,ht=5,ct=2500,pt=["mousedown","mousemove","mouseup","click"],ut=[0,1,4,2],ft=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(e){return!1}}();function gt(e){return pt.indexOf(e)>-1}let mt=!1;function vt(e){if(!gt(e)&&"touchend"!==e)return nt&&mt&&ot?{passive:!0}:void 0}!function(){try{let e=Object.defineProperty({},"passive",{get(){mt=!0}});window.addEventListener("test",null,e),window.removeEventListener("test",null,e)}catch(e){}}();let yt=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);const bt=[],wt={button:!0,input:!0,keygen:!0,meter:!0,output:!0,textarea:!0,progress:!0,select:!0},kt={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function xt(e){let t=Array.prototype.slice.call(e.labels||[]);if(!t.length){t=[];let i=e.getRootNode();if(e.id){let s=i.querySelectorAll(`label[for = ${e.id}]`);for(let e=0;e<s.length;e++)t.push(s[e])}}return t}let St=function(e){let t=e.sourceCapabilities;var i;if((!t||t.firesTouchEvents)&&(e[at]={skip:!0},"click"===e.type)){let t=!1,s=e.composedPath&&e.composedPath();if(s)for(let e=0;e<s.length;e++){if(s[e].nodeType===Node.ELEMENT_NODE)if("label"===s[e].localName)bt.push(s[e]);else if(i=s[e],wt[i.localName]){let i=xt(s[e]);for(let e=0;e<i.length;e++)t=t||bt.indexOf(i[e])>-1}if(s[e]===_t.mouse.target)return}if(t)return;e.preventDefault(),e.stopPropagation()}};function Ct(e){let t=yt?["click"]:pt;for(let i,s=0;s<t.length;s++)i=t[s],e?(bt.length=0,document.addEventListener(i,St,!0)):document.removeEventListener(i,St,!0)}function Rt(e){let t=e.type;if(!gt(t))return!1;if("mousemove"===t){let t=void 0===e.buttons?1:e.buttons;return e instanceof window.MouseEvent&&!ft&&(t=ut[e.which]||0),Boolean(1&t)}return 0===(void 0===e.button?0:e.button)}let _t={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function Et(e,t,i){e.movefn=t,e.upfn=i,document.addEventListener("mousemove",t),document.addEventListener("mouseup",i)}function Pt(e){document.removeEventListener("mousemove",e.movefn),document.removeEventListener("mouseup",e.upfn),e.movefn=null,e.upfn=null}document.addEventListener("touchend",function(e){_t.mouse.mouseIgnoreJob||Ct(!0),_t.mouse.target=e.composedPath()[0],_t.mouse.mouseIgnoreJob=it.debounce(_t.mouse.mouseIgnoreJob,et.after(ct),function(){Ct(),_t.mouse.target=null,_t.mouse.mouseIgnoreJob=null})},!!mt&&{passive:!0});const Nt={},Ot=[];function At(e){if(e.composedPath){const t=e.composedPath();return t.length>0?t[0]:e.target}return e.target}function Tt(e){let t,i=e.type,s=e.currentTarget[rt];if(!s)return;let o=s[i];if(o){if(!e[at]&&(e[at]={},"touch"===i.slice(0,5))){let t=(e=e).changedTouches[0];if("touchstart"===i&&1===e.touches.length&&(_t.touch.id=t.identifier),_t.touch.id!==t.identifier)return;nt||"touchstart"!==i&&"touchmove"!==i||function(e){let t=e.changedTouches[0],i=e.type;if("touchstart"===i)_t.touch.x=t.clientX,_t.touch.y=t.clientY,_t.touch.scrollDecided=!1;else if("touchmove"===i){if(_t.touch.scrollDecided)return;_t.touch.scrollDecided=!0;let i=function(e){let t="auto",i=e.composedPath&&e.composedPath();if(i)for(let e,s=0;s<i.length;s++)if((e=i[s])[dt]){t=e[dt];break}return t}(e),s=!1,o=Math.abs(_t.touch.x-t.clientX),n=Math.abs(_t.touch.y-t.clientY);e.cancelable&&("none"===i?s=!0:"pan-x"===i?s=n>o:"pan-y"===i&&(s=o>n)),s?e.preventDefault():It("track")}}(e)}if(!(t=e[at]).skip){for(let i,s=0;s<Ot.length;s++)o[(i=Ot[s]).name]&&!t[i.name]&&i.flow&&i.flow.start.indexOf(e.type)>-1&&i.reset&&i.reset();for(let s,n=0;n<Ot.length;n++)o[(s=Ot[n]).name]&&!t[s.name]&&(t[s.name]=!0,s[i](e))}}}function Lt(e,t,i){return!!Nt[t]&&(function(e,t,i){let s=Nt[t],o=s.deps,n=s.name,r=e[rt];r||(e[rt]=r={});for(let t,i,s=0;s<o.length;s++)t=o[s],yt&&gt(t)&&"click"!==t||((i=r[t])||(r[t]=i={_count:0}),0===i._count&&e.addEventListener(t,Tt,vt(t)),i[n]=(i[n]||0)+1,i._count=(i._count||0)+1);e.addEventListener(t,i),s.touchAction&&function(e,t){nt&&e instanceof HTMLElement&&tt.run(()=>{e.style.touchAction=t});e[dt]=t}(e,s.touchAction)}(e,t,i),!0)}function Wt(e){Ot.push(e);for(let t=0;t<e.emits.length;t++)Nt[e.emits[t]]=e}function jt(e,t,i){let s=new Event(t,{bubbles:!0,cancelable:!0,composed:!0});if(s.detail=i,e.dispatchEvent(s),s.defaultPrevented){let e=i.preventer||i.sourceEvent;e&&e.preventDefault&&e.preventDefault()}}function It(e){let t=function(e){for(let t,i=0;i<Ot.length;i++){t=Ot[i];for(let i,s=0;s<t.emits.length;s++)if((i=t.emits[s])===e)return t}return null}(e);t.info&&(t.info.prevent=!0)}function Mt(e,t,i,s){t&&jt(t,e,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:s,prevent:function(e){return It(e)}})}function $t(e,t,i){if(e.prevent)return!1;if(e.started)return!0;let s=Math.abs(e.x-t),o=Math.abs(e.y-i);return s>=ht||o>=ht}function Bt(e,t,i){if(!t)return;let s,o=e.moves[e.moves.length-2],n=e.moves[e.moves.length-1],r=n.x-e.x,a=n.y-e.y,d=0;o&&(s=n.x-o.x,d=n.y-o.y),jt(t,"track",{state:e.state,x:i.clientX,y:i.clientY,dx:r,dy:a,ddx:s,ddy:d,sourceEvent:i,hover:function(){return function(e,t){let i=document.elementFromPoint(e,t),s=i;for(;s&&s.shadowRoot&&!window.ShadyDOM&&s!==(s=s.shadowRoot.elementFromPoint(e,t));)s&&(i=s);return i}(i.clientX,i.clientY)}})}function Dt(e,t,i){let s=Math.abs(t.clientX-e.x),o=Math.abs(t.clientY-e.y),n=At(i||t);!n||kt[n.localName]&&n.hasAttribute("disabled")||(isNaN(s)||isNaN(o)||s<=lt&&o<=lt||function(e){if("click"===e.type){if(0===e.detail)return!0;let t=At(e);if(!t.nodeType||t.nodeType!==Node.ELEMENT_NODE)return!0;let i=t.getBoundingClientRect(),s=e.pageX,o=e.pageY;return!(s>=i.left&&s<=i.right&&o>=i.top&&o<=i.bottom)}return!1}(t))&&(e.prevent||jt(n,"tap",{x:t.clientX,y:t.clientY,sourceEvent:t,preventer:i}))}Wt({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset:function(){Pt(this.info)},mousedown:function(e){if(!Rt(e))return;let t=At(e),i=this;Et(this.info,function(e){Rt(e)||(Mt("up",t,e),Pt(i.info))},function(e){Rt(e)&&Mt("up",t,e),Pt(i.info)}),Mt("down",t,e)},touchstart:function(e){Mt("down",At(e),e.changedTouches[0],e)},touchend:function(e){Mt("up",At(e),e.changedTouches[0],e)}}),Wt({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove:function(e){this.moves.length>2&&this.moves.shift(),this.moves.push(e)},movefn:null,upfn:null,prevent:!1},reset:function(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,Pt(this.info)},mousedown:function(e){if(!Rt(e))return;let t=At(e),i=this,s=function(e){let s=e.clientX,o=e.clientY;$t(i.info,s,o)&&(i.info.state=i.info.started?"mouseup"===e.type?"end":"track":"start","start"===i.info.state&&It("tap"),i.info.addMove({x:s,y:o}),Rt(e)||(i.info.state="end",Pt(i.info)),t&&Bt(i.info,t,e),i.info.started=!0)};Et(this.info,s,function(e){i.info.started&&s(e),Pt(i.info)}),this.info.x=e.clientX,this.info.y=e.clientY},touchstart:function(e){let t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchmove:function(e){let t=At(e),i=e.changedTouches[0],s=i.clientX,o=i.clientY;$t(this.info,s,o)&&("start"===this.info.state&&It("tap"),this.info.addMove({x:s,y:o}),Bt(this.info,t,i),this.info.state="track",this.info.started=!0)},touchend:function(e){let t=At(e),i=e.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),Bt(this.info,t,i))}}),Wt({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset:function(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown:function(e){Rt(e)&&(this.info.x=e.clientX,this.info.y=e.clientY)},click:function(e){Rt(e)&&Dt(this.info,e)},touchstart:function(e){const t=e.changedTouches[0];this.info.x=t.clientX,this.info.y=t.clientY},touchend:function(e){Dt(this.info,e.changedTouches[0],e)}});var Vt=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},zt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredSlider=class extends ae{constructor(){super(...arguments),this._value=0,this.min=0,this.max=100,this.knobradius=10,this.disabled=!1,this.step=1,this.barWidth=0,this.intermediateValue=this.min,this.pct=0,this.startx=0,this.dragging=!1}static get styles(){return ne`
    :host {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 40px;
      outline: none;
      box-sizing: border-box;
    }
  
    :host(.wired-disabled) {
      opacity: 0.45 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.07);
      border-radius: 5px;
    }
  
    :host(.wired-disabled) .knob {
      pointer-events: none !important;
    }
  
    :host(:focus) .knob {
      cursor: move;
      stroke: var(--wired-slider-knob-outline-color, #000);
      fill-opacity: 0.8;
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
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .knob {
      pointer-events: auto;
      fill: var(--wired-slider-knob-zero-color, gray);
      stroke: var(--wired-slider-knob-zero-color, gray);
      transition: transform 0.15s ease;
      cursor: pointer;
    }
  
    .hasValue {
      fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
      stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
    }
  
    .bar {
      stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
    `}render(){return A`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}get value(){return this._value}set value(e){this.setValue(e,!0)}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const t=this.getBoundingClientRect();e.setAttribute("width",`${t.width}`),e.setAttribute("height",`${t.height}`);const i=this.knobradius||10;this.barWidth=t.width-2*i,this.bar=be(e,i,t.height/2,t.width-i,t.height/2),this.bar.classList.add("bar"),this.knobGroup=fe("g"),e.appendChild(this.knobGroup),this.knob=xe(this.knobGroup,i,t.height/2,2*i,2*i),this.knob.classList.add("knob"),this.onValueChange(),this.classList.remove("wired-pending"),this.setAttribute("role","slider"),this.setAttribute("aria-valuemax",`${this.max}`),this.setAttribute("aria-valuemin",`${this.min}`),this.setAriaValue(),Lt(this.knob,"down",e=>{this.disabled||this.knobdown(e)}),Lt(this.knob,"up",()=>{this.disabled||this.resetKnob()}),Lt(this.knob,"track",e=>{this.disabled||this.onTrack(e)}),this.addEventListener("keydown",e=>{switch(e.keyCode){case 38:case 39:this.incremenent();break;case 37:case 40:this.decrement();break;case 36:this.setValue(this.min);break;case 35:this.setValue(this.max)}})}updated(e){e.has("disabled")&&this.refreshDisabledState()}setAriaValue(){this.setAttribute("aria-valuenow",`${this.value}`)}setValue(e,t=!1){if(this._value=e,this.setAriaValue(),this.onValueChange(),!t){const e=new CustomEvent("change",{bubbles:!0,composed:!0,detail:{value:this.intermediateValue}});this.dispatchEvent(e)}}incremenent(){const e=Math.min(this.max,Math.round(this.value+this.step));e!==this.value&&this.setValue(e)}decrement(){const e=Math.max(this.min,Math.round(this.value-this.step));e!==this.value&&this.setValue(e)}onValueChange(){if(!this.knob)return;let e=0;this.max>this.min&&(e=Math.min(1,Math.max((this.value-this.min)/(this.max-this.min),0))),this.pct=e,e?this.knob.classList.add("hasValue"):this.knob.classList.remove("hasValue");const t=e*this.barWidth;this.knobGroup.style.transform=`translateX(${Math.round(t)}px)`}knobdown(e){this.knobExpand(!0),e.preventDefault(),this.focus()}resetKnob(){this.knobExpand(!1)}knobExpand(e){this.knob&&(e?this.knob.classList.add("expanded"):this.knob.classList.remove("expanded"))}onTrack(e){switch(e.stopPropagation(),e.detail.state){case"start":this.trackStart();break;case"track":this.trackX(e);break;case"end":this.trackEnd()}}trackStart(){this.intermediateValue=this.value,this.startx=this.pct*this.barWidth,this.dragging=!0}trackX(e){this.dragging||this.trackStart();const t=e.detail.dx||0,i=Math.max(Math.min(this.startx+t,this.barWidth),0);this.knobGroup.style.transform=`translateX(${Math.round(i)}px)`;const s=i/this.barWidth;this.intermediateValue=this.min+s*(this.max-this.min)}trackEnd(){this.dragging=!1,this.resetKnob(),this.setValue(this.intermediateValue),this.pct=(this.value-this.min)/(this.max-this.min)}},Vt([te({type:Number}),zt("design:type",Object)],e.WiredSlider.prototype,"_value",void 0),Vt([te({type:Number}),zt("design:type",Object)],e.WiredSlider.prototype,"min",void 0),Vt([te({type:Number}),zt("design:type",Object)],e.WiredSlider.prototype,"max",void 0),Vt([te({type:Number}),zt("design:type",Object)],e.WiredSlider.prototype,"knobradius",void 0),Vt([te({type:Boolean,reflect:!0}),zt("design:type",Object)],e.WiredSlider.prototype,"disabled",void 0),e.WiredSlider=Vt([Q("wired-slider")],e.WiredSlider);var Ht=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Ut=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredTextarea=class extends ae{constructor(){super(...arguments),this.rows=1,this.maxrows=0,this.autocomplete="",this.autofocus=!1,this.disabled=!1,this.inputmode="",this.placeholder="",this.required=!1,this.readonly=!1,this.tokens=[],this.prevHeight=0}static get styles(){return ne`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: sans-serif;
      width: 400px;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.6 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
    }
  
    .fit {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  
    .overlay {
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
  
    .mirror-text {
      visibility: hidden;
      word-wrap: break-word;
    }
  
    textarea {
      position: relative;
      outline: none;
      border: none;
      resize: none;
      background: inherit;
      color: inherit;
      width: 100%;
      height: 100%;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
      text-align: inherit;
      padding: 5px;
      box-sizing: border-box;
    }
    `}render(){return A`
    <div id="mirror" class="mirror-text">&#160;</div>
    <div class="fit">
      <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}"
        placeholder="${this.placeholder}" ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}"
        rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}" @input="${this.onInput}"></textarea>
    </div>
    <div class="fit overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=this.attachShadow({mode:"open",delegatesFocus:!0});return this.classList.add("wired-pending"),e}get textarea(){return this.shadowRoot?this.shadowRoot.getElementById("textarea"):null}get mirror(){return this.shadowRoot.getElementById("mirror")}get value(){const e=this.textarea;return e&&e.value||""}set value(e){const t=this.textarea;t&&(t.value!==e&&(t.value=e||""),this.mirror.innerHTML=this.valueForMirror(),this.requestUpdate())}valueForMirror(){const e=this.textarea;return e?(this.tokens=e&&e.value?e.value.replace(/&/gm,"&amp;").replace(/"/gm,"&quot;").replace(/'/gm,"&#39;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").split("\n"):[""],this.constrain(this.tokens)):""}constrain(e){let t;for(e=e||[""],t=this.maxrows>0&&e.length>this.maxrows?e.slice(0,this.maxrows):e.slice(0);this.rows>0&&t.length<this.rows;)t.push("");return t.join("<br/>")+"&#160;"}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled")}firstUpdated(){this.value=this.value||this.getAttribute("value")||""}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg"),i=this.getBoundingClientRect();if(this.prevHeight!==i.height){for(;t.hasChildNodes();)t.removeChild(t.lastChild);t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`),we(t,2,2,i.width-2,i.height-2),this.prevHeight=i.height,this.classList.remove("wired-pending"),this.updateCached()}}updateCached(){this.mirror.innerHTML=this.constrain(this.tokens)}onInput(){this.value=this.textarea.value}},Ht([te({type:Number}),Ut("design:type",Object)],e.WiredTextarea.prototype,"rows",void 0),Ht([te({type:Number}),Ut("design:type",Object)],e.WiredTextarea.prototype,"maxrows",void 0),Ht([te({type:String}),Ut("design:type",Object)],e.WiredTextarea.prototype,"autocomplete",void 0),Ht([te({type:Boolean}),Ut("design:type",Object)],e.WiredTextarea.prototype,"autofocus",void 0),Ht([te({type:Boolean,reflect:!0}),Ut("design:type",Object)],e.WiredTextarea.prototype,"disabled",void 0),Ht([te({type:String}),Ut("design:type",Object)],e.WiredTextarea.prototype,"inputmode",void 0),Ht([te({type:String}),Ut("design:type",Object)],e.WiredTextarea.prototype,"placeholder",void 0),Ht([te({type:Boolean}),Ut("design:type",Object)],e.WiredTextarea.prototype,"required",void 0),Ht([te({type:Boolean}),Ut("design:type",Object)],e.WiredTextarea.prototype,"readonly",void 0),Ht([te({type:Number}),Ut("design:type",Number)],e.WiredTextarea.prototype,"minlength",void 0),Ht([te({type:Number}),Ut("design:type",Number)],e.WiredTextarea.prototype,"maxlength",void 0),e.WiredTextarea=Ht([Q("wired-textarea")],e.WiredTextarea);var qt=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Ft=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};e.WiredToggle=class extends ae{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.height=0}static get styles(){return ne`
    :host {
      display: inline-block;
      cursor: pointer;
      position: relative;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.4 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .unchecked {
      fill: var(--wired-toggle-off-color, gray);
    }
  
    .checked {
      fill: var(--wired-toggle-on-color, rgb(63, 81, 181));
    }
    `}render(){return A`
    <div @click="${this.toggleCheck}">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){const e=super.createRenderRoot();return this.classList.add("wired-pending"),e}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked;const e=new CustomEvent("change",{bubbles:!0,composed:!0,detail:{checked:this.checked}});this.dispatchEvent(e)}firstUpdated(){this.setAttribute("role","switch"),this.addEventListener("keydown",e=>{13!==e.keyCode&&32!==e.keyCode||(e.preventDefault(),this.toggleCheck())})}updated(e){e.has("disabled")&&this.refreshDisabledState();const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const i={width:2.5*(this.height||32),height:this.height||32};t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`),we(t,0,0,i.width,i.height);const s=xe(t,i.height/2,i.height/2,i.height,i.height),o=i.width-i.height;s.style.transition="all 0.3s ease",s.style.transform=this.checked?"translateX("+o+"px)":"";const n=s.classList;this.checked?(n.remove("unchecked"),n.add("checked")):(n.remove("checked"),n.add("unchecked")),this.setAttribute("aria-checked",`${this.checked}`),this.classList.remove("wired-pending")}},qt([te({type:Boolean}),Ft("design:type",Object)],e.WiredToggle.prototype,"checked",void 0),qt([te({type:Boolean,reflect:!0}),Ft("design:type",Object)],e.WiredToggle.prototype,"disabled",void 0),e.WiredToggle=qt([Q("wired-toggle")],e.WiredToggle);var Xt=function(e,t,i,s){var o,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(r=(n<3?o(r):n>3?o(t,i,r):o(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r},Yt=function(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)};return e.WiredTooltip=class extends ae{constructor(){super(...arguments),this.offset=14,this.position="bottom",this.dirty=!1,this.showing=!1,this._target=null,this.showHandler=this.show.bind(this),this.hideHandler=this.hide.bind(this)}static get styles(){return ne`
    :host {
      display: block;
      position: absolute;
      outline: none;
      z-index: 1002;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: default;
      font-family: inherit;
      font-size: 9pt;
      line-height: 1;
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
      stroke-width: 0.7;
      stroke: var(--wired-tooltip-border-color, currentColor);
      fill: var(--wired-tooltip-background, rgba(255, 255, 255, 0.9));
    }
  
    #container {
      position: relative;
      padding: 8px;
    }
    `}render(){return A`
    <div id="container" style="display: none;">
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
      <span style="position: relative;">${this.text}</span>
    </div>
    `}get target(){if(this._target)return this._target;const e=this.parentNode,t=(this.getRootNode?this.getRootNode():null)||document;let i=null;return this.for?i=t.querySelector("#"+this.for):e&&(i=e.nodeType===Node.DOCUMENT_FRAGMENT_NODE?t.host:e),i}detachListeners(){this._target&&(this._target.removeEventListener("mouseenter",this.showHandler),this._target.removeEventListener("focus",this.showHandler),this._target.removeEventListener("mouseleave",this.hideHandler),this._target.removeEventListener("blur",this.hideHandler),this._target.removeEventListener("click",this.hideHandler)),this.removeEventListener("mouseenter",this.hideHandler)}attachListeners(){this._target&&(this._target.addEventListener("mouseenter",this.showHandler),this._target.addEventListener("focus",this.showHandler),this._target.addEventListener("mouseleave",this.hideHandler),this._target.addEventListener("blur",this.hideHandler),this._target.addEventListener("click",this.hideHandler)),this.addEventListener("mouseenter",this.hideHandler)}refreshTarget(){this.detachListeners(),this._target=null,this._target=this.target,this.attachListeners(),this.dirty=!0}layout(){const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const t=this.getBoundingClientRect();let i=t.width,s=t.height;switch(this.position){case"left":case"right":i+=this.offset;break;default:s+=this.offset}e.setAttribute("width",`${i}`),e.setAttribute("height",`${s}`);let o=[];switch(this.position){case"top":o=[[2,2],[i-2,2],[i-2,s-this.offset],[i/2+8,s-this.offset],[i/2,s-this.offset+8],[i/2-8,s-this.offset],[0,s-this.offset]];break;case"left":o=[[2,2],[i-this.offset,2],[i-this.offset,s/2-8],[i-this.offset+8,s/2],[i-this.offset,s/2+8],[i-this.offset,s],[2,s-2]];break;case"right":o=[[this.offset,2],[i-2,2],[i-2,s-2],[this.offset,s-2],[this.offset,s/2+8],[this.offset-8,s/2],[this.offset,s/2-8]],e.style.transform=`translateX(${-this.offset}px)`;break;default:o=[[2,this.offset],[0,s-2],[i-2,s-2],[i-2,this.offset],[i/2+8,this.offset],[i/2,this.offset-8],[i/2-8,this.offset]],e.style.transform=`translateY(${-this.offset}px)`}ke(e,o),this.dirty=!1}firstUpdated(){this.layout()}updated(e){(e.has("position")||e.has("text"))&&(this.dirty=!0),this._target&&!e.has("for")||this.refreshTarget(),this.dirty&&this.layout()}show(){this.showing||(this.showing=!0,this.shadowRoot.getElementById("container").style.display="",this.updatePosition(),setTimeout(()=>{this.layout()},1))}hide(){this.showing&&(this.showing=!1,this.shadowRoot.getElementById("container").style.display="none")}updatePosition(){if(!this._target||!this.offsetParent)return;const e=this.offset,t=this.offsetParent.getBoundingClientRect(),i=this._target.getBoundingClientRect(),s=this.getBoundingClientRect(),o=(i.width-s.width)/2,n=(i.height-s.height)/2,r=i.left-t.left,a=i.top-t.top;let d,l;switch(this.position){case"top":d=r+o,l=a-s.height-e;break;case"bottom":d=r+o,l=a+i.height+e;break;case"left":d=r-s.width-e,l=a+n;break;case"right":d=r+i.width+e,l=a+n}this.style.left=d+"px",this.style.top=l+"px"}},Xt([te({type:String}),Yt("design:type",String)],e.WiredTooltip.prototype,"for",void 0),Xt([te({type:String}),Yt("design:type",String)],e.WiredTooltip.prototype,"text",void 0),Xt([te({type:Number}),Yt("design:type",Object)],e.WiredTooltip.prototype,"offset",void 0),Xt([te({type:String}),Yt("design:type",String)],e.WiredTooltip.prototype,"position",void 0),e.WiredTooltip=Xt([Q("wired-tooltip")],e.WiredTooltip),e}({});

const t=new WeakMap,e=e=>(...i)=>{const s=e(...i);return t.set(s,!0),s},i=e=>"function"==typeof e&&t.has(e),s=void 0!==window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,o=(t,e,i=null)=>{for(;e!==i;){const i=e.nextSibling;t.removeChild(e),e=i}},n={},r={},a=`{{lit-${String(Math.random()).slice(2)}}}`,l=`\x3c!--${a}--\x3e`,d=new RegExp(`${a}|${l}`),h="$lit$";class c{constructor(t,e){this.parts=[],this.element=e;const i=[],s=[],o=document.createTreeWalker(e.content,133,null,!1);let n=0,r=-1,l=0;const{strings:c,values:{length:u}}=t;for(;l<u;){const t=o.nextNode();if(null!==t){if(r++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:i}=e;let s=0;for(let t=0;t<i;t++)p(e[t].name,h)&&s++;for(;s-- >0;){const e=c[l],i=g.exec(e)[2],s=i.toLowerCase()+h,o=t.getAttribute(s);t.removeAttribute(s);const n=o.split(d);this.parts.push({type:"attribute",index:r,name:i,strings:n}),l+=n.length-1}}"TEMPLATE"===t.tagName&&(s.push(t),o.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(a)>=0){const s=t.parentNode,o=e.split(d),n=o.length-1;for(let e=0;e<n;e++){let i,n=o[e];if(""===n)i=f();else{const t=g.exec(n);null!==t&&p(t[2],h)&&(n=n.slice(0,t.index)+t[1]+t[2].slice(0,-h.length)+t[3]),i=document.createTextNode(n)}s.insertBefore(i,t),this.parts.push({type:"node",index:++r})}""===o[n]?(s.insertBefore(f(),t),i.push(t)):t.data=o[n],l+=n}}else if(8===t.nodeType)if(t.data===a){const e=t.parentNode;null!==t.previousSibling&&r!==n||(r++,e.insertBefore(f(),t)),n=r,this.parts.push({type:"node",index:r}),null===t.nextSibling?t.data="":(i.push(t),r--),l++}else{let e=-1;for(;-1!==(e=t.data.indexOf(a,e+1));)this.parts.push({type:"node",index:-1}),l++}}else o.currentNode=s.pop()}for(const t of i)t.parentNode.removeChild(t)}}const p=(t,e)=>{const i=t.length-e.length;return i>=0&&t.slice(i)===e},u=t=>-1!==t.index,f=()=>document.createComment(""),g=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;class y{constructor(t,e,i){this.__parts=[],this.template=t,this.processor=e,this.options=i}update(t){let e=0;for(const i of this.__parts)void 0!==i&&i.setValue(t[e]),e++;for(const t of this.__parts)void 0!==t&&t.commit()}_clone(){const t=s?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),e=[],i=this.template.parts,o=document.createTreeWalker(t,133,null,!1);let n,r=0,a=0,l=o.nextNode();for(;r<i.length;)if(n=i[r],u(n)){for(;a<n.index;)a++,"TEMPLATE"===l.nodeName&&(e.push(l),o.currentNode=l.content),null===(l=o.nextNode())&&(o.currentNode=e.pop(),l=o.nextNode());if("node"===n.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(l.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(l,n.name,n.strings,this.options));r++}else this.__parts.push(void 0),r++;return s&&(document.adoptNode(t),customElements.upgrade(t)),t}}class m{constructor(t,e,i,s){this.strings=t,this.values=e,this.type=i,this.processor=s}getHTML(){const t=this.strings.length-1;let e="",i=!1;for(let s=0;s<t;s++){const t=this.strings[s],o=t.lastIndexOf("\x3c!--");i=(o>-1||i)&&-1===t.indexOf("--\x3e",o+1);const n=g.exec(t);e+=null===n?t+(i?a:l):t.substr(0,n.index)+n[1]+n[2]+h+n[3]+a}return e+=this.strings[t]}getTemplateElement(){const t=document.createElement("template");return t.innerHTML=this.getHTML(),t}}const b=t=>null===t||!("object"==typeof t||"function"==typeof t),v=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class w{constructor(t,e,i){this.dirty=!0,this.element=t,this.name=e,this.strings=i,this.parts=[];for(let t=0;t<i.length-1;t++)this.parts[t]=this._createPart()}_createPart(){return new x(this)}_getValue(){const t=this.strings,e=t.length-1;let i="";for(let s=0;s<e;s++){i+=t[s];const e=this.parts[s];if(void 0!==e){const t=e.value;if(b(t)||!v(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e]}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class x{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===n||b(t)&&t===this.value||(this.value=t,i(t)||(this.committer.dirty=!0))}commit(){for(;i(this.value);){const t=this.value;this.value=n,t(this)}this.value!==n&&this.committer.commit()}}class k{constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(f()),this.endNode=t.appendChild(f())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=f()),t.__insert(this.endNode=f())}insertAfterPart(t){t.__insert(this.startNode=f()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){for(;i(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=n,t(this)}const t=this.__pendingValue;t!==n&&(b(t)?t!==this.value&&this.__commitText(t):t instanceof m?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):v(t)?this.__commitIterable(t):t===r?(this.value=r,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling;t=null==t?"":t,e===this.endNode.previousSibling&&3===e.nodeType?e.data=t:this.__commitNode(document.createTextNode("string"==typeof t?t:String(t))),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof y&&this.value.template===e)this.value.update(t.values);else{const i=new y(e,t.processor,this.options),s=i._clone();i.update(t.values),this.__commitNode(s),this.value=i}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let i,s=0;for(const o of t)void 0===(i=e[s])&&(i=new k(this.options),e.push(i),0===s?i.appendIntoPart(this):i.insertAfterPart(e[s-1])),i.setValue(o),i.commit(),s++;s<e.length&&(e.length=s,this.clear(i&&i.endNode))}clear(t=this.startNode){o(this.startNode.parentNode,t.nextSibling,this.endNode)}}class S{constructor(t,e,i){if(this.value=void 0,this.__pendingValue=void 0,2!==i.length||""!==i[0]||""!==i[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=i}setValue(t){this.__pendingValue=t}commit(){for(;i(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=n,t(this)}if(this.__pendingValue===n)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=n}}class _ extends w{constructor(t,e,i){super(t,e,i),this.single=2===i.length&&""===i[0]&&""===i[1]}_createPart(){return new C(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class C extends x{}let R=!1;try{const t={get capture(){return R=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}class E{constructor(t,e,i){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=i,this.__boundHandleEvent=(t=>this.handleEvent(t))}setValue(t){this.__pendingValue=t}commit(){for(;i(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=n,t(this)}if(this.__pendingValue===n)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),o=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),o&&(this.__options=N(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=n}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const N=t=>t&&(R?{capture:t.capture,passive:t.passive,once:t.once}:t.capture);const O=new class{handleAttributeExpressions(t,e,i,s){const o=e[0];return"."===o?new _(t,e.slice(1),i).parts:"@"===o?[new E(t,e.slice(1),s.eventContext)]:"?"===o?[new S(t,e.slice(1),i)]:new w(t,e,i).parts}handleTextExpression(t){return new k(t)}};function j(t){let e=P.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},P.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const s=t.strings.join(a);return void 0===(i=e.keyString.get(s))&&(i=new c(t,t.getTemplateElement()),e.keyString.set(s,i)),e.stringsArray.set(t.strings,i),i}const P=new Map,M=new WeakMap;(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.0.0");const A=(t,...e)=>new m(t,e,"html",O),L=133;function $(t,e){const{element:{content:i},parts:s}=t,o=document.createTreeWalker(i,L,null,!1);let n=I(s),r=s[n],a=-1,l=0;const d=[];let h=null;for(;o.nextNode();){a++;const t=o.currentNode;for(t.previousSibling===h&&(h=null),e.has(t)&&(d.push(t),null===h&&(h=t)),null!==h&&l++;void 0!==r&&r.index===a;)r.index=null!==h?-1:r.index-l,r=s[n=I(s,n)]}d.forEach(t=>t.parentNode.removeChild(t))}const T=t=>{let e=11===t.nodeType?0:1;const i=document.createTreeWalker(t,L,null,!1);for(;i.nextNode();)e++;return e},I=(t,e=-1)=>{for(let i=e+1;i<t.length;i++){const e=t[i];if(u(e))return i}return-1};const D=(t,e)=>`${t}--${e}`;let B=!0;void 0===window.ShadyCSS?B=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),B=!1);const z=t=>e=>{const i=D(e.type,t);let s=P.get(i);void 0===s&&(s={stringsArray:new WeakMap,keyString:new Map},P.set(i,s));let o=s.stringsArray.get(e.strings);if(void 0!==o)return o;const n=e.strings.join(a);if(void 0===(o=s.keyString.get(n))){const i=e.getTemplateElement();B&&window.ShadyCSS.prepareTemplateDom(i,t),o=new c(e,i),s.keyString.set(n,o)}return s.stringsArray.set(e.strings,o),o},V=["html","svg"],U=new Set,q=(t,e,i)=>{U.add(i);const s=t.querySelectorAll("style"),{length:o}=s;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(e.element,i);const n=document.createElement("style");for(let t=0;t<o;t++){const e=s[t];e.parentNode.removeChild(e),n.textContent+=e.textContent}(t=>{V.forEach(e=>{const i=P.get(D(e,t));void 0!==i&&i.keyString.forEach(t=>{const{element:{content:e}}=t,i=new Set;Array.from(e.querySelectorAll("style")).forEach(t=>{i.add(t)}),$(t,i)})})})(i);const r=e.element.content;!function(t,e,i=null){const{element:{content:s},parts:o}=t;if(null==i)return void s.appendChild(e);const n=document.createTreeWalker(s,L,null,!1);let r=I(o),a=0,l=-1;for(;n.nextNode();)for(l++,n.currentNode===i&&(a=T(e),i.parentNode.insertBefore(e,i));-1!==r&&o[r].index===l;){if(a>0){for(;-1!==r;)o[r].index+=a,r=I(o,r);return}r=I(o,r)}}(e,n,r.firstChild),window.ShadyCSS.prepareTemplateStyles(e.element,i);const a=r.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==a)t.insertBefore(a.cloneNode(!0),t.firstChild);else{r.insertBefore(n,r.firstChild);const t=new Set;t.add(n),$(e,t)}};window.JSCompiler_renameProperty=((t,e)=>t);const H={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},X=(t,e)=>e!==t&&(e==e||t==t),W={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:X},F=Promise.resolve(!0),G=1,Y=4,J=8,K=16,Z=32;class Q extends HTMLElement{constructor(){super(),this._updateState=0,this._instanceProperties=void 0,this._updatePromise=F,this._hasConnectedResolver=void 0,this._changedProperties=new Map,this._reflectingProperties=void 0,this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach((e,i)=>{const s=this._attributeNameForProperty(i,e);void 0!==s&&(this._attributeToPropertyMap.set(s,i),t.push(s))}),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach((t,e)=>this._classProperties.set(e,t))}}static createProperty(t,e=W){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const i="symbol"==typeof t?Symbol():`__${t}`;Object.defineProperty(this.prototype,t,{get(){return this[i]},set(e){const s=this[t];this[i]=e,this._requestUpdate(t,s)},configurable:!0,enumerable:!0})}static finalize(){if(this.hasOwnProperty(JSCompiler_renameProperty("finalized",this))&&this.finalized)return;const t=Object.getPrototypeOf(this);if("function"==typeof t.finalize&&t.finalize(),this.finalized=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const i of e)this.createProperty(i,t[i])}}static _attributeNameForProperty(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,i=X){return i(t,e)}static _propertyValueFromAttribute(t,e){const i=e.type,s=e.converter||H,o="function"==typeof s?s:s.fromAttribute;return o?o(t,i):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const i=e.type,s=e.converter;return(s&&s.toAttribute||H.toAttribute)(t,i)}initialize(){this._saveInstanceProperties(),this._requestUpdate()}_saveInstanceProperties(){this.constructor._classProperties.forEach((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}})}_applyInstanceProperties(){this._instanceProperties.forEach((t,e)=>this[e]=t),this._instanceProperties=void 0}connectedCallback(){this._updateState=this._updateState|Z,this._hasConnectedResolver&&(this._hasConnectedResolver(),this._hasConnectedResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,i){e!==i&&this._attributeToProperty(t,i)}_propertyToAttribute(t,e,i=W){const s=this.constructor,o=s._attributeNameForProperty(t,i);if(void 0!==o){const t=s._propertyValueToAttribute(e,i);if(void 0===t)return;this._updateState=this._updateState|J,null==t?this.removeAttribute(o):this.setAttribute(o,t),this._updateState=this._updateState&~J}}_attributeToProperty(t,e){if(this._updateState&J)return;const i=this.constructor,s=i._attributeToPropertyMap.get(t);if(void 0!==s){const t=i._classProperties.get(s)||W;this._updateState=this._updateState|K,this[s]=i._propertyValueFromAttribute(e,t),this._updateState=this._updateState&~K}}_requestUpdate(t,e){let i=!0;if(void 0!==t){const s=this.constructor,o=s._classProperties.get(t)||W;s._valueHasChanged(this[t],e,o.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==o.reflect||this._updateState&K||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,o))):i=!1}!this._hasRequestedUpdate&&i&&this._enqueueUpdate()}requestUpdate(t,e){return this._requestUpdate(t,e),this.updateComplete}async _enqueueUpdate(){let t,e;this._updateState=this._updateState|Y;const i=this._updatePromise;this._updatePromise=new Promise((i,s)=>{t=i,e=s});try{await i}catch(t){}this._hasConnected||await new Promise(t=>this._hasConnectedResolver=t);try{const t=this.performUpdate();null!=t&&await t}catch(t){e(t)}t(!this._hasRequestedUpdate)}get _hasConnected(){return this._updateState&Z}get _hasRequestedUpdate(){return this._updateState&Y}get hasUpdated(){return this._updateState&G}performUpdate(){this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{(t=this.shouldUpdate(e))&&this.update(e)}catch(e){throw t=!1,e}finally{this._markUpdated()}t&&(this._updateState&G||(this._updateState=this._updateState|G,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=this._updateState&~Y}get updateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach((t,e)=>this._propertyToAttribute(e,this[e],t)),this._reflectingProperties=void 0)}updated(t){}firstUpdated(t){}}Q.finalized=!0;const tt=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){window.customElements.define(t,e)}}})(t,e),et=(t,e)=>"method"!==e.kind||!e.descriptor||"value"in e.descriptor?{kind:"field",key:Symbol(),placement:"own",descriptor:{},initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}}:Object.assign({},e,{finisher(i){i.createProperty(e.key,t)}}),it=(t,e,i)=>{e.constructor.createProperty(i,t)};function st(t){return(e,i)=>void 0!==i?it(t,e,i):et(t,e)}function ot(t){return(e,i)=>{const s={get(){return this.renderRoot.querySelector(t)},enumerable:!0,configurable:!0};return void 0!==i?nt(s,e,i):rt(s,e)}}const nt=(t,e,i)=>{Object.defineProperty(e,i,t)},rt=(t,e)=>({kind:"method",placement:"prototype",key:e.key,descriptor:t}),at="adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,lt=Symbol();class dt{constructor(t,e){if(e!==lt)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(at?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const ht=(t,...e)=>{const i=e.reduce((e,i,s)=>e+(t=>{if(t instanceof dt)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[s+1],t[0]);return new dt(i,lt)};(window.litElementVersions||(window.litElementVersions=[])).push("2.2.0");const ct=t=>t.flat?t.flat(1/0):function t(e,i=[]){for(let s=0,o=e.length;s<o;s++){const o=e[s];Array.isArray(o)?t(o,i):i.push(o)}return i}(t);class pt extends Q{static finalize(){super.finalize(),this._styles=this.hasOwnProperty(JSCompiler_renameProperty("styles",this))?this._getUniqueStyles():this._styles||[]}static _getUniqueStyles(){const t=this.styles,e=[];if(Array.isArray(t)){ct(t).reduceRight((t,e)=>(t.add(e),t),new Set).forEach(t=>e.unshift(t))}else t&&e.push(t);return e}initialize(){super.initialize(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow({mode:"open"})}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?at?this.renderRoot.adoptedStyleSheets=t.map(t=>t.styleSheet):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t=>t.cssText),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){super.update(t);const e=this.render();e instanceof m&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach(t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)}))}render(){}}pt.finalized=!0,pt.render=((t,e,i)=>{const s=i.scopeName,n=M.has(e),r=B&&11===e.nodeType&&!!e.host&&t instanceof m,a=r&&!U.has(s),l=a?document.createDocumentFragment():e;if(((t,e,i)=>{let s=M.get(e);void 0===s&&(o(e,e.firstChild),M.set(e,s=new k(Object.assign({templateFactory:j},i))),s.appendInto(e)),s.setValue(t),s.commit()})(t,l,Object.assign({templateFactory:z(s)},i)),a){const t=M.get(l);M.delete(l),t.value instanceof y&&q(l,t.value.template,s),o(e,e.firstChild),e.appendChild(l),M.set(e,t)}!n&&r&&window.ShadyCSS.styleElement(e.host)});class ut extends pt{fireEvent(t,e,i=!0,s=!0){if(t){const o={bubbles:"boolean"!=typeof i||i,composed:"boolean"!=typeof s||s};e&&(o.detail=e);const n=window.SlickCustomEvent||CustomEvent;this.dispatchEvent(new n(t,o))}}}class ft{constructor(t,e){this.xi=Number.MAX_VALUE,this.yi=Number.MAX_VALUE,this.px1=t[0],this.py1=t[1],this.px2=e[0],this.py2=e[1],this.a=this.py2-this.py1,this.b=this.px1-this.px2,this.c=this.px2*this.py1-this.px1*this.py2,this._undefined=0===this.a&&0===this.b&&0===this.c}isUndefined(){return this._undefined}intersects(t){if(this.isUndefined()||t.isUndefined())return!1;let e=Number.MAX_VALUE,i=Number.MAX_VALUE,s=0,o=0;const n=this.a,r=this.b,a=this.c;return Math.abs(r)>1e-5&&(e=-n/r,s=-a/r),Math.abs(t.b)>1e-5&&(i=-t.a/t.b,o=-t.c/t.b),e===Number.MAX_VALUE?i===Number.MAX_VALUE?-a/n==-t.c/t.a&&(this.py1>=Math.min(t.py1,t.py2)&&this.py1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.py2>=Math.min(t.py1,t.py2)&&this.py2<=Math.max(t.py1,t.py2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=this.px1,this.yi=i*this.xi+o,!((this.py1-this.yi)*(this.yi-this.py2)<-1e-5||(t.py1-this.yi)*(this.yi-t.py2)<-1e-5)&&(!(Math.abs(t.a)<1e-5)||!((t.px1-this.xi)*(this.xi-t.px2)<-1e-5))):i===Number.MAX_VALUE?(this.xi=t.px1,this.yi=e*this.xi+s,!((t.py1-this.yi)*(this.yi-t.py2)<-1e-5||(this.py1-this.yi)*(this.yi-this.py2)<-1e-5)&&(!(Math.abs(n)<1e-5)||!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5))):e===i?s===o&&(this.px1>=Math.min(t.px1,t.px2)&&this.px1<=Math.max(t.py1,t.py2)?(this.xi=this.px1,this.yi=this.py1,!0):this.px2>=Math.min(t.px1,t.px2)&&this.px2<=Math.max(t.px1,t.px2)&&(this.xi=this.px2,this.yi=this.py2,!0)):(this.xi=(o-s)/(e-i),this.yi=e*this.xi+s,!((this.px1-this.xi)*(this.xi-this.px2)<-1e-5||(t.px1-this.xi)*(this.xi-t.px2)<-1e-5))}}class gt{constructor(t,e,i,s,o,n,r,a){this.deltaX=0,this.hGap=0,this.top=t,this.bottom=e,this.left=i,this.right=s,this.gap=o,this.sinAngle=n,this.tanAngle=a,Math.abs(n)<1e-4?this.pos=i+o:Math.abs(n)>.9999?this.pos=t+o:(this.deltaX=(e-t)*Math.abs(a),this.pos=i-Math.abs(this.deltaX),this.hGap=Math.abs(o/r),this.sLeft=new ft([i,e],[i,t]),this.sRight=new ft([s,e],[s,t]))}nextLine(){if(Math.abs(this.sinAngle)<1e-4){if(this.pos<this.right){const t=[this.pos,this.top,this.pos,this.bottom];return this.pos+=this.gap,t}}else if(Math.abs(this.sinAngle)>.9999){if(this.pos<this.bottom){const t=[this.left,this.pos,this.right,this.pos];return this.pos+=this.gap,t}}else{let t=this.pos-this.deltaX/2,e=this.pos+this.deltaX/2,i=this.bottom,s=this.top;if(this.pos<this.right+this.deltaX){for(;t<this.left&&e<this.left||t>this.right&&e>this.right;)if(this.pos+=this.hGap,t=this.pos-this.deltaX/2,e=this.pos+this.deltaX/2,this.pos>this.right+this.deltaX)return null;const o=new ft([t,i],[e,s]);this.sLeft&&o.intersects(this.sLeft)&&(t=o.xi,i=o.yi),this.sRight&&o.intersects(this.sRight)&&(e=o.xi,s=o.yi),this.tanAngle>0&&(t=this.right-(t-this.left),e=this.right-(e-this.left));const n=[t,i,e,s];return this.pos+=this.hGap,n}}return null}}function yt(t,e){const i=[],s=new ft([t[0],t[1]],[t[2],t[3]]);for(let t=0;t<e.length;t++){const o=new ft(e[t],e[(t+1)%e.length]);s.intersects(o)&&i.push([s.xi,s.yi])}return i}function mt(t,e,i,s,o,n,r){return[-i*n-s*o+i+n*t+o*e,r*(i*o-s*n)+s+-r*o*t+r*n*e]}const bt=2,vt=1,wt=.85,xt=0,kt=9;class St{constructor(){this.p=""}get value(){return this.p.trim()}moveTo(t,e){this.p=`${this.p}M ${t} ${e} `}bcurveTo(t,e,i,s,o,n){this.p=`${this.p}C ${t} ${e}, ${i} ${s}, ${o} ${n} `}}function _t(t,e){const i=document.createElementNS("http://www.w3.org/2000/svg",t);if(e)for(const t in e)i.setAttributeNS(null,t,e[t]);return i}function Ct(t,e){return vt*(Math.random()*(e-t)+t)}function Rt(t,e,i,s,o){const n=Math.pow(t-i,2)+Math.pow(e-s,2);let r=bt;r*r*100>n&&(r=Math.sqrt(n)/10);const a=r/2,l=.2+.2*Math.random();let d=wt*bt*(s-e)/200,h=wt*bt*(t-i)/200;d=Ct(-d,d),h=Ct(-h,h);const c=o||new St;return c.moveTo(t+Ct(-r,r),e+Ct(-r,r)),c.bcurveTo(d+t+(i-t)*l+Ct(-r,r),h+e+(s-e)*l+Ct(-r,r),d+t+2*(i-t)*l+Ct(-r,r),h+e+2*(s-e)*l+Ct(-r,r),i+Ct(-r,r),s+Ct(-r,r)),c.moveTo(t+Ct(-a,a),e+Ct(-a,a)),c.bcurveTo(d+t+(i-t)*l+Ct(-a,a),h+e+(s-e)*l+Ct(-a,a),d+t+2*(i-t)*l+Ct(-a,a),h+e+2*(s-e)*l+Ct(-a,a),i+Ct(-a,a),s+Ct(-a,a)),c}function Et(t,e,i,s,o=!1,n=!1,r){r=r||new St;const a=Math.pow(t-i,2)+Math.pow(e-s,2);let l=bt;l*l*100>a&&(l=Math.sqrt(a)/10);const d=l/2,h=.2+.2*Math.random();let c=wt*bt*(s-e)/200,p=wt*bt*(t-i)/200;return c=Ct(-c,c),p=Ct(-p,p),o&&r.moveTo(t+Ct(-l,l),e+Ct(-l,l)),n?r.bcurveTo(c+t+(i-t)*h+Ct(-d,d),p+e+(s-e)*h+Ct(-d,d),c+t+2*(i-t)*h+Ct(-d,d),p+e+2*(s-e)*h+Ct(-d,d),i+Ct(-d,d),s+Ct(-d,d)):r.bcurveTo(c+t+(i-t)*h+Ct(-l,l),p+e+(s-e)*h+Ct(-l,l),c+t+2*(i-t)*h+Ct(-l,l),p+e+2*(s-e)*h+Ct(-l,l),i+Ct(-l,l),s+Ct(-l,l)),r}function Nt(t,e,i,s,o,n,r,a){const l=Ct(-.5,.5)-Math.PI/2,d=[];d.push([Ct(-n,n)+e+.9*s*Math.cos(l-t),Ct(-n,n)+i+.9*o*Math.sin(l-t)]);for(let r=l;r<2*Math.PI+l-.01;r+=t)d.push([Ct(-n,n)+e+s*Math.cos(r),Ct(-n,n)+i+o*Math.sin(r)]);return d.push([Ct(-n,n)+e+s*Math.cos(l+2*Math.PI+.5*r),Ct(-n,n)+i+o*Math.sin(l+2*Math.PI+.5*r)]),d.push([Ct(-n,n)+e+.98*s*Math.cos(l+r),Ct(-n,n)+i+.98*o*Math.sin(l+r)]),d.push([Ct(-n,n)+e+.9*s*Math.cos(l+.5*r),Ct(-n,n)+i+.9*o*Math.sin(l+.5*r)]),function(t,e){const i=t.length;let s=e||new St;if(i>3){const e=[],o=1-xt;s.moveTo(t[1][0],t[1][1]);for(let n=1;n+2<i;n++){const i=t[n];e[0]=[i[0],i[1]],e[1]=[i[0]+(o*t[n+1][0]-o*t[n-1][0])/6,i[1]+(o*t[n+1][1]-o*t[n-1][1])/6],e[2]=[t[n+1][0]+(o*t[n][0]-o*t[n+2][0])/6,t[n+1][1]+(o*t[n][1]-o*t[n+2][1])/6],e[3]=[t[n+1][0],t[n+1][1]],s.bcurveTo(e[1][0],e[1][1],e[2][0],e[2][1],e[3][0],e[3][1])}}else 3===i?(s.moveTo(t[0][0],t[0][1]),s.bcurveTo(t[1][0],t[1][1],t[2][0],t[2][1],t[2][0],t[2][1])):2===i&&(s=Rt(t[0][0],t[0][1],t[1][0],t[1][1],s));return s}(d,a)}function Ot(t,e,i,s,o){const n=_t("path",{d:Rt(e,i,s,o).value});return t.appendChild(n),n}function jt(t,e,i,s,o){o-=4;let n=Rt(e+=2,i+=2,e+(s-=4),i);n=Rt(e+s,i,e+s,i+o,n),n=Rt(e+s,i+o,e,i+o,n);const r=_t("path",{d:(n=Rt(e,i+o,e,i,n)).value});return t.appendChild(r),r}function Pt(t,e){let i;const s=e.length;if(s>2)for(let t=0;t<2;t++){let o=!0;for(let t=1;t<s;t++)i=Et(e[t-1][0],e[t-1][1],e[t][0],e[t][1],o,t>0,i),o=!1;i=Et(e[s-1][0],e[s-1][1],e[0][0],e[0][1],o,t>0,i)}else i=2===s?Rt(e[0][0],e[0][1],e[1][0],e[1][1]):new St;const o=_t("path",{d:i.value});return t.appendChild(o),o}function Mt(t,e,i,s,o){s=Math.max(s>10?s-4:s-1,1),o=Math.max(o>10?o-4:o-1,1);const n=2*Math.PI/kt;let r=Math.abs(s/2),a=Math.abs(o/2),l=Nt(n,e,i,r+=Ct(.05*-r,.05*r),a+=Ct(.05*-a,.05*a),1,n*Ct(.1,Ct(.4,1)));const d=_t("path",{d:(l=Nt(n,e,i,r,a,1.5,0,l)).value});return t.appendChild(d),d}function At(t){const e=_t("g");let i=null;return t.forEach(t=>{Ot(e,t[0][0],t[0][1],t[1][0],t[1][1]),i&&Ot(e,i[0],i[1],t[0][0],t[0][1]),i=t[1]}),e}const Lt={bowing:wt,curveStepCount:kt,curveTightness:xt,dashGap:0,dashOffset:0,fill:"#000",fillStyle:"hachure",fillWeight:1,hachureAngle:-41,hachureGap:5,maxRandomnessOffset:bt,roughness:vt,simplification:1,stroke:"#000",strokeWidth:2,zigzagOffset:0};function $t(t){return At(function(t,e){const i=[];if(t&&t.length){let s=t[0][0],o=t[0][0],n=t[0][1],r=t[0][1];for(let e=1;e<t.length;e++)s=Math.min(s,t[e][0]),o=Math.max(o,t[e][0]),n=Math.min(n,t[e][1]),r=Math.max(r,t[e][1]);const a=e.hachureAngle;let l=e.hachureGap;l<0&&(l=4*e.strokeWidth),l=Math.max(l,.1);const d=a%180*(Math.PI/180),h=Math.cos(d),c=Math.sin(d),p=Math.tan(d),u=new gt(n-1,r+1,s-1,o+1,l,c,h,p);let f;for(;null!=(f=u.nextLine());){const e=yt(f,t);for(let t=0;t<e.length;t++)if(t<e.length-1){const s=e[t],o=e[t+1];i.push([s,o])}}}return i}(t,Lt))}function Tt(t,e,i,s){return At(function(t,e,i,s,o,n){const r=[];let a=Math.abs(s/2),l=Math.abs(o/2);a+=t.randOffset(.05*a,n),l+=t.randOffset(.05*l,n);const d=n.hachureAngle;let h=n.hachureGap;h<=0&&(h=4*n.strokeWidth);let c=n.fillWeight;c<0&&(c=n.strokeWidth/2);const p=d%180*(Math.PI/180),u=Math.tan(p),f=l/a,g=Math.sqrt(f*u*f*u+1),y=f*u/g,m=1/g,b=h/(a*l/Math.sqrt(l*m*(l*m)+a*y*(a*y))/a);let v=Math.sqrt(a*a-(e-a+b)*(e-a+b));for(let t=e-a+b;t<e+a;t+=b){const s=mt(t,i-(v=Math.sqrt(a*a-(e-t)*(e-t))),e,i,y,m,f),o=mt(t,i+v,e,i,y,m,f);r.push([s,o])}return r}({randOffset:(t,e)=>Ct(-t,t)},t,e,i,s,Lt))}var It=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Dt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Bt=class extends ut{constructor(){super(...arguments),this.elevation=1,this.disabled=!1}static get styles(){return ht`
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
      letter-spacing: 1.25px;
      font-size: 14px;
      text-transform: uppercase;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
    `}firstUpdated(){this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect(),s=Math.min(Math.max(1,this.elevation),5),o=i.width+2*(s-1),n=i.height+2*(s-1);e.setAttribute("width",`${o}`),e.setAttribute("height",`${n}`),jt(e,0,0,i.width,i.height);for(let t=1;t<s;t++)Ot(e,2*t,i.height+2*t,i.width+2*t,i.height+2*t).style.opacity=`${(75-10*t)/100}`,Ot(e,i.width+2*t,i.height+2*t,i.width+2*t,2*t).style.opacity=`${(75-10*t)/100}`,Ot(e,2*t,i.height+2*t,i.width+2*t,i.height+2*t).style.opacity=`${(75-10*t)/100}`,Ot(e,i.width+2*t,i.height+2*t,i.width+2*t,2*t).style.opacity=`${(75-10*t)/100}`;this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}};It([st({type:Number}),Dt("design:type",Object)],Bt.prototype,"elevation",void 0),It([st({type:Boolean,reflect:!0}),Dt("design:type",Object)],Bt.prototype,"disabled",void 0),Bt=It([tt("wired-button")],Bt);var zt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Vt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Ut=class extends ut{constructor(){super(...arguments),this.elevation=1}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      padding: 10px;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
    `}connectedCallback(){super.connectedCallback(),this.resizeHandler||(this.resizeHandler=this.debounce(this.updated.bind(this),200,!1,this),window.addEventListener("resize",this.resizeHandler)),setTimeout(()=>this.updated())}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.resizeHandler&&(window.removeEventListener("resize",this.resizeHandler),delete this.resizeHandler)}debounce(t,e,i,s){let o=0;return()=>{const n=arguments,r=i&&!o;clearTimeout(o),o=window.setTimeout(()=>{o=0,i||t.apply(s,n)},e),r&&t.apply(s,n)}}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect(),i=Math.min(Math.max(1,this.elevation),5),s=e.width+2*(i-1),o=e.height+2*(i-1);t.setAttribute("width",`${s}`),t.setAttribute("height",`${o}`),jt(t,2,2,e.width-4,e.height-4);for(let s=1;s<i;s++)Ot(t,2*s,e.height-4+2*s,e.width-4+2*s,e.height-4+2*s).style.opacity=`${(85-10*s)/100}`,Ot(t,e.width-4+2*s,e.height-4+2*s,e.width-4+2*s,2*s).style.opacity=`${(85-10*s)/100}`,Ot(t,2*s,e.height-4+2*s,e.width-4+2*s,e.height-4+2*s).style.opacity=`${(85-10*s)/100}`,Ot(t,e.width-4+2*s,e.height-4+2*s,e.width-4+2*s,2*s).style.opacity=`${(85-10*s)/100}`;this.classList.add("wired-rendered")}};zt([st({type:Number}),Vt("design:type",Object)],Ut.prototype,"elevation",void 0),Ut=zt([tt("wired-card")],Ut);var qt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Ht=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Xt=class extends ut{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}static get styles(){return ht`
    :host {
      display: block;
      font-family: inherit;
      outline: none;
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

    :host(.wired-rendered) {
      opacity: 1;
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
      -moz-user-select: none;
      user-select: none;
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
      <div class="inline">
        <slot></slot>
      </div>
    </div>
    `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked,this.fireEvent("change",{checked:this.checked})}firstUpdated(){this.setAttribute("role","checkbox"),this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.toggleCheck())})}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=24,s=24;e.setAttribute("width",`${i}`),e.setAttribute("height",`${s}`),jt(e,0,0,i,s);const o=[];o.push(Ot(e,.3*i,.4*s,.5*i,.7*s)),o.push(Ot(e,.5*i,.7*s,i+5,-5)),o.forEach(t=>{t.style.strokeWidth="2.5"}),this.checked?o.forEach(t=>{t.style.display=""}):o.forEach(t=>{t.style.display="none"}),this.classList.add("wired-rendered")}};qt([st({type:Boolean}),Ht("design:type",Object)],Xt.prototype,"checked",void 0),qt([st({type:Boolean,reflect:!0}),Ht("design:type",Object)],Xt.prototype,"disabled",void 0),Xt=qt([tt("wired-checkbox")],Xt);var Wt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Ft=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Gt=class extends ut{constructor(){super(...arguments),this.value="",this.name="",this.selected=!1}static get styles(){return ht`
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
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      display: none;
    }
    button.selected .overlay {
      display: block;
    }
    svg {
      display: block;
    }
    path {
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
    `}render(){return A`
    <button class="${this.selected?"selected":""}">
      <div class="overlay">
        <svg></svg>
      </div>
      <span>
        <slot></slot>
      </span>
    </button>`}firstUpdated(){this.selected&&setTimeout(()=>this.requestUpdate())}updated(){if(this.svg){for(;this.svg.hasChildNodes();)this.svg.removeChild(this.svg.lastChild);const t=this.getBoundingClientRect();this.svg.setAttribute("width",`${t.width}`),this.svg.setAttribute("height",`${t.height}`);const e=$t([[0,0],[t.width,0],[t.width,t.height],[0,t.height]]);this.svg.appendChild(e)}}};Wt([st(),Ft("design:type",Object)],Gt.prototype,"value",void 0),Wt([st(),Ft("design:type",Object)],Gt.prototype,"name",void 0),Wt([st({type:Boolean}),Ft("design:type",Object)],Gt.prototype,"selected",void 0),Wt([ot("svg"),Ft("design:type",SVGSVGElement)],Gt.prototype,"svg",void 0),Gt=Wt([tt("wired-item")],Gt);var Yt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Jt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Kt=class extends ut{constructor(){super(...arguments),this.disabled=!1,this.cardShowing=!1,this.itemNodes=[]}static get styles(){return ht`
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
      position: absolute;
      background: var(--wired-combo-popup-bg, white);
      z-index: 1;
      box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
    }

    ::slotted(wired-item) {
      display: block;
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
    <wired-card id="card" tabindex="-1" role="listbox" @mousedown="${this.onItemClick}" @touchstart="${this.onItemClick}"
      style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){this.setAttribute("role","combobox"),this.setAttribute("aria-haspopup","listbox"),this.refreshSelection(),this.addEventListener("blur",()=>{this.cardShowing&&this.setCardShowing(!1)}),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext();break;case 27:t.preventDefault(),this.cardShowing&&this.setCardShowing(!1);break;case 13:t.preventDefault(),this.setCardShowing(!this.cardShowing);break;case 32:t.preventDefault(),this.cardShowing||this.setCardShowing(!0)}})}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.shadowRoot.getElementById("container").getBoundingClientRect();e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`);const s=this.shadowRoot.getElementById("textPanel").getBoundingClientRect();this.shadowRoot.getElementById("dropPanel").style.minHeight=s.height+"px",jt(e,0,0,s.width,s.height);const o=s.width-4;jt(e,o,0,34,s.height);const n=Math.max(0,Math.abs((s.height-24)/2)),r=Pt(e,[[o+8,5+n],[o+26,5+n],[o+17,n+Math.min(s.height,18)]]);if(r.style.fill="currentColor",r.style.pointerEvents=this.disabled?"none":"auto",r.style.cursor="pointer",this.classList.add("wired-rendered"),this.setAttribute("aria-expanded",`${this.cardShowing}`),!this.itemNodes.length){this.itemNodes=[];const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t&&t.length)for(let e=0;e<t.length;e++){const i=t[e];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.selected=!1,this.lastSelectedItem.removeAttribute("aria-selected"));const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t){let e=null;for(let i=0;i<t.length;i++){const s=t[i];if("WIRED-ITEM"===s.tagName){const t=s.value||"";if(this.selected&&t===this.selected){e=s;break}}}this.lastSelectedItem=e||void 0,this.lastSelectedItem&&(this.lastSelectedItem.selected=!0,this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=e?{value:e.value||"",text:e.textContent||""}:void 0}}setCardShowing(t){this.cardShowing=t;const e=this.shadowRoot.getElementById("card");e.style.display=t?"":"none",t&&setTimeout(()=>{e.requestUpdate(),this.shadowRoot.getElementById("slot").assignedNodes().filter(t=>t.nodeType===Node.ELEMENT_NODE).forEach(t=>{const e=t;e.requestUpdate&&e.requestUpdate()})},10),this.setAttribute("aria-expanded",`${this.cardShowing}`)}onItemClick(t){t.stopPropagation(),this.selected=t.target.value,this.refreshSelection(),this.fireSelected(),setTimeout(()=>{this.setCardShowing(!1)})}fireSelected(){this.fireEvent("selected",{selected:this.selected})}selectPrevious(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:0===e?e=t.length-1:e--,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:e>=t.length-1?e=0:e++,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}onCombo(t){t.stopPropagation(),this.setCardShowing(!this.cardShowing)}};Yt([st({type:Object}),Jt("design:type",Object)],Kt.prototype,"value",void 0),Yt([st({type:String}),Jt("design:type",String)],Kt.prototype,"selected",void 0),Yt([st({type:Boolean,reflect:!0}),Jt("design:type",Object)],Kt.prototype,"disabled",void 0),Kt=Yt([tt("wired-combo")],Kt);var Zt=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Qt=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let te=class extends ut{constructor(){super(...arguments),this.name="",this.open=!1}static get styles(){return ht`
      .wrapper {
        opacity: 0;
        transition: visibility 0s, opacity 0.25s ease-in;
      }
      .wrapper:not(.open) {
        visibility: hidden;
      }
      .wrapper.open {
        align-items: center;
        display: flex;
        justify-content: center;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 1;
        visibility: visible;
      }
      .overlay {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
      }

      .buttons {
        display: flex;
        flex-direction: row;
      }
      .accept {
        justify-content: space-around;
        align-content: space-around;
      }
      .cancel {
        justify-content: space-around;
        align-content: space-around;
      }
      wired-card {
        background: #fff;
        display: block;
        max-width: 600px;
        padding: 1rem;
        position: fixed;
      }
    `}render(){return A`
      <div class="wrapper ${this.open?"open":""}" aria-hidden="${!this.open}">
        <div class="overlay" @click="${this.close}"></div>
          <wired-card>
            <slot></slot>
            <div class="buttons">
              <wired-button
                class="accept"
                @click="${this.close}"
              >
                Ok
              </wired-button>
              <wired-button
                class="cancel"
                @click="${this.close}"
              >
                Cancel
              </wired-button>
            </div>
          </wired-card>
        </div>
      </div>
    `}show(){this.open=!0,document.addEventListener("keydown",this._watchEscape)}close(){this.open=!1,document.removeEventListener("keydown",this._watchEscape),this.fireEvent("dialog-closed")}_watchEscape(t){"Escape"===t.key&&this.close()}};function ee(t){const e=document.querySelector(`wired-dialog[name=${t}]`);e&&e.show()}Zt([st({type:String}),Qt("design:type",Object)],te.prototype,"name",void 0),Zt([st({type:Boolean,reflect:!0}),Qt("design:type",Object)],te.prototype,"open",void 0),te=Zt([tt("wired-dialog")],te);const ie=ht`:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:"liga";-webkit-font-smoothing:antialiased}`,se=document.createElement("link");se.rel="stylesheet",se.href="https://fonts.googleapis.com/icon?family=Material+Icons",document.head.appendChild(se);var oe=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r};let ne=class extends pt{render(){return A`<slot></slot>`}};ne.styles=ie,ne=oe([tt("mwc-icon")],ne);var re=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ae=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let le=class extends ut{constructor(){super(...arguments),this.disabled=!1}static get styles(){return ht`
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
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
    `}firstUpdated(){this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect(),s=Math.min(i.width,i.height);e.setAttribute("width",`${s}`),e.setAttribute("height",`${s}`),Mt(e,s/2,s/2,s,s),this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}};re([st({type:Boolean,reflect:!0}),ae("design:type",Object)],le.prototype,"disabled",void 0),le=re([tt("wired-icon-button")],le);var de=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},he=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let ce=class extends ut{constructor(){super(...arguments),this.placeholder="",this.type="text",this.autocomplete="",this.autocapitalize="",this.autocorrect="",this.disabled=!1,this.required=!1,this.autofocus=!1,this.readonly=!1}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: sans-serif;
      width: 150px;
      outline: none;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
      padding: 6px;
    }
    `}render(){return A`
    <input id="txt" name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" @change="${this.onChange}">
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}createRenderRoot(){return this.attachShadow({mode:"open",delegatesFocus:!0})}get input(){return this.shadowRoot?this.shadowRoot.getElementById("txt"):null}get value(){const t=this.input;return t&&t.value||""}set value(t){if(this.shadowRoot){const e=this.input;e&&(e.value=t)}else this.pendingValue=t}firstUpdated(){this.value=this.value||this.getAttribute("value")||""}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect();e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`),jt(e,0,0,i.width,i.height),void 0!==this.pendingValue&&(this.input.value=this.pendingValue,delete this.pendingValue),this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled")}onChange(t){t.stopPropagation(),this.fireEvent(t.type,{sourceEvent:t})}};de([st({type:String}),he("design:type",Object)],ce.prototype,"placeholder",void 0),de([st({type:String}),he("design:type",String)],ce.prototype,"name",void 0),de([st({type:String}),he("design:type",String)],ce.prototype,"min",void 0),de([st({type:String}),he("design:type",String)],ce.prototype,"max",void 0),de([st({type:String}),he("design:type",String)],ce.prototype,"step",void 0),de([st({type:String}),he("design:type",Object)],ce.prototype,"type",void 0),de([st({type:String}),he("design:type",Object)],ce.prototype,"autocomplete",void 0),de([st({type:String}),he("design:type",Object)],ce.prototype,"autocapitalize",void 0),de([st({type:String}),he("design:type",Object)],ce.prototype,"autocorrect",void 0),de([st({type:Boolean,reflect:!0}),he("design:type",Object)],ce.prototype,"disabled",void 0),de([st({type:Boolean}),he("design:type",Object)],ce.prototype,"required",void 0),de([st({type:Boolean}),he("design:type",Object)],ce.prototype,"autofocus",void 0),de([st({type:Boolean}),he("design:type",Object)],ce.prototype,"readonly",void 0),de([st({type:Number}),he("design:type",Number)],ce.prototype,"minlength",void 0),de([st({type:Number}),he("design:type",Number)],ce.prototype,"maxlength",void 0),de([st({type:Number}),he("design:type",Number)],ce.prototype,"size",void 0),ce=de([tt("wired-input")],ce);var pe=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ue=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let fe=class extends ut{constructor(){super(...arguments),this.horizontal=!1,this.itemNodes=[],this.itemClickHandler=this.onItemClick.bind(this)}static get styles(){return ht`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      padding: 5px;
      outline: none;
      opacity: 0;
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
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }

    ::slotted(wired-item) {
      display: block;
    }

    :host(.wired-horizontal) ::slotted(wired-item) {
      display: inline-block;
    }
    `}render(){return A`
    <slot id="slot" @slotchange="${()=>this.requestUpdate()}"></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}firstUpdated(){this.setAttribute("role","listbox"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.refreshSelection(),this.addEventListener("click",this.itemClickHandler),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext()}})}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();if(t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`),jt(t,0,0,e.width,e.height),this.classList.add("wired-rendered"),this.horizontal?this.classList.add("wired-horizontal"):this.classList.remove("wired-horizontal"),!this.itemNodes.length){this.itemNodes=[];const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t&&t.length)for(let e=0;e<t.length;e++){const i=t[e];"WIRED-ITEM"===i.tagName&&(i.setAttribute("role","option"),this.itemNodes.push(i))}}}onItemClick(t){t.stopPropagation(),this.selected=t.target.value,this.refreshSelection(),this.fireSelected()}refreshSelection(){this.lastSelectedItem&&(this.lastSelectedItem.selected=!1,this.lastSelectedItem.removeAttribute("aria-selected"));const t=this.shadowRoot.getElementById("slot").assignedNodes();if(t){let e=null;for(let i=0;i<t.length;i++){const s=t[i];if("WIRED-ITEM"===s.tagName){const t=s.value||"";if(this.selected&&t===this.selected){e=s;break}}}this.lastSelectedItem=e||void 0,this.lastSelectedItem&&(this.lastSelectedItem.selected=!0,this.lastSelectedItem.setAttribute("aria-selected","true")),this.value=e?{value:e.value||"",text:e.textContent||""}:void 0}}fireSelected(){this.fireEvent("selected",{selected:this.selected})}selectPrevious(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:0===e?e=t.length-1:e--,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}selectNext(){const t=this.itemNodes;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.lastSelectedItem){e=i;break}e<0?e=0:e>=t.length-1?e=0:e++,this.selected=t[e].value||"",this.refreshSelection(),this.fireSelected()}}};pe([st({type:Object}),ue("design:type",Object)],fe.prototype,"value",void 0),pe([st({type:String}),ue("design:type",String)],fe.prototype,"selected",void 0),pe([st({type:Boolean}),ue("design:type",Object)],fe.prototype,"horizontal",void 0),fe=pe([tt("wired-listbox")],fe);var ge=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ye=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let me=class extends ut{constructor(){super(...arguments),this.value=0,this.min=0,this.max=100,this.percentage=!1}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      width: 400px;
      height: 42px;
      font-family: sans-serif;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
    `}render(){return A`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `}getProgressLabel(){if(this.percentage){if(this.max===this.min)return"%";return Math.floor((this.value-this.min)/(this.max-this.min)*100)+"%"}return""+this.value}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`),this.box?t.appendChild(this.box):this.box=jt(t,0,0,e.width,e.height);let i=0;if(this.max>this.min){i=(this.value-this.min)/(this.max-this.min);const s=e.width*Math.max(0,Math.min(i,100)),o=$t([[0,0],[s,0],[s,e.height],[0,e.height]]);t.appendChild(o),o.classList.add("progbox")}this.classList.add("wired-rendered")}};ge([st({type:Number}),ye("design:type",Object)],me.prototype,"value",void 0),ge([st({type:Number}),ye("design:type",Object)],me.prototype,"min",void 0),ge([st({type:Number}),ye("design:type",Object)],me.prototype,"max",void 0),ge([st({type:Boolean}),ye("design:type",Object)],me.prototype,"percentage",void 0),me=ge([tt("wired-progress")],me);var be=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ve=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let we=class extends ut{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.iconsize=24}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: inherit;
      width: 150px;
      outline: none;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
      -moz-user-select: none;
      user-select: none;
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
      <div class="inline">
        <slot></slot>
      </div>
    </div>
    `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked,this.fireEvent("change",{checked:this.checked})}firstUpdated(){this.setAttribute("role","checkbox"),this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.toggleCheck())})}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);this.dot=void 0;const i={width:this.iconsize||24,height:this.iconsize||24};e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`),Mt(e,i.width/2,i.height/2,i.width,i.height);const s=Math.max(.6*i.width,5),o=Math.max(.6*i.height,5);this.dot=Mt(e,i.width/2,i.height/2,s,o),this.dot.classList.add("filledPath"),this.dot.style.display=this.checked?"":"none",this.classList.add("wired-rendered")}};be([st({type:Boolean}),ve("design:type",Object)],we.prototype,"checked",void 0),be([st({type:Boolean,reflect:!0}),ve("design:type",Object)],we.prototype,"disabled",void 0),be([st({type:String}),ve("design:type",String)],we.prototype,"name",void 0),be([st({type:Number}),ve("design:type",Object)],we.prototype,"iconsize",void 0),we=be([tt("wired-radio")],we);var xe=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ke=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Se=class extends ut{constructor(){super(...arguments),this.radioNodes=[],this.checkListener=this.handleChecked.bind(this)}static get styles(){return ht`
    :host {
      display: inline-block;
    }
  
    :host ::slotted(*) {
      padding: var(--wired-radio-group-item-padding, 5px);
    }
    `}render(){return A`
    <slot id="slot" @slotchange="${this.slotChange}"></slot>
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("change",this.checkListener)}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.removeEventListener("checked",this.checkListener)}handleChecked(t){const e=t.detail.checked,i=t.target,s=i.name||"";e?(this.selected=e&&s||"",this.fireSelected()):i.checked=!0}fireSelected(){this.fireEvent("selected",{selected:this.selected})}slotChange(){this.requestUpdate()}firstUpdated(){this.setAttribute("role","radiogroup"),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext()}})}updated(){const t=this.shadowRoot.getElementById("slot").assignedNodes();if(this.radioNodes=[],t&&t.length)for(let e=0;e<t.length;e++){const i=t[e];if("WIRED-RADIO"===i.tagName){this.radioNodes.push(i);const t=i.name||"";this.selected&&t===this.selected?i.checked=!0:i.checked=!1}}}selectPrevious(){const t=this.radioNodes;if(t.length){let e=null,i=-1;if(this.selected){for(let e=0;e<t.length;e++){if(t[e].name===this.selected){i=e;break}}i<0?e=t[0]:(--i<0&&(i=t.length-1),e=t[i])}else e=t[0];e&&(e.focus(),this.selected=e.name,this.fireSelected())}}selectNext(){const t=this.radioNodes;if(t.length){let e=null,i=-1;if(this.selected){for(let e=0;e<t.length;e++){if(t[e].name===this.selected){i=e;break}}i<0?e=t[0]:(++i>=t.length&&(i=0),e=t[i])}else e=t[0];e&&(e.focus(),this.selected=e.name,this.fireSelected())}}};xe([st({type:String}),ke("design:type",String)],Se.prototype,"selected",void 0),Se=xe([tt("wired-radio-group")],Se),window.JSCompiler_renameProperty=function(t,e){return t};let _e=0,Ce=0,Re=[],Ee=0,Ne=document.createTextNode("");new window.MutationObserver(function(){const t=Re.length;for(let e=0;e<t;e++){let t=Re[e];if(t)try{t()}catch(t){setTimeout(()=>{throw t})}}Re.splice(0,t),Ce+=t}).observe(Ne,{characterData:!0});const Oe={after:t=>({run:e=>window.setTimeout(e,t),cancel(t){window.clearTimeout(t)}}),run:(t,e)=>window.setTimeout(t,e),cancel(t){window.clearTimeout(t)}},je={run:t=>(Ne.textContent=Ee++,Re.push(t),_e++),cancel(t){const e=t-Ce;if(e>=0){if(!Re[e])throw new Error("invalid async handle: "+t);Re[e]=null}}};class Pe{constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(t,e){this._asyncModule=t,this._callback=e,this._timer=this._asyncModule.run(()=>{this._timer=null,Me.delete(this),this._callback()})}cancel(){this.isActive()&&(this._cancelAsync(),Me.delete(this))}_cancelAsync(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}static debounce(t,e,i){return t instanceof Pe?t._cancelAsync():t=new Pe,t.setConfig(e,i),t}}let Me=new Set;window.ShadyDOM,Boolean(!window.ShadyCSS||window.ShadyCSS.nativeCss),window.customElements.polyfillWrapFlushCallback;(Ae=document.baseURI||window.location.href).substring(0,Ae.lastIndexOf("/")+1);var Ae;window.Polymer&&window.Polymer.sanitizeDOMValue;let Le=!1,$e=!0;const Te=window.ShadyDOM&&window.ShadyDOM.noPatch&&window.ShadyDOM.wrap?window.ShadyDOM.wrap:window.ShadyDOM?t=>ShadyDOM.patch(t):t=>t;let Ie="string"==typeof document.head.style.touchAction,De="__polymerGestures",Be="__polymerGesturesHandled",ze="__polymerGesturesTouchAction",Ve=25,Ue=5,qe=2500,He=["mousedown","mousemove","mouseup","click"],Xe=[0,1,4,2],We=function(){try{return 1===new MouseEvent("test",{buttons:1}).buttons}catch(t){return!1}}();function Fe(t){return He.indexOf(t)>-1}let Ge=!1;function Ye(t){if(!Fe(t)&&"touchend"!==t)return Ie&&Ge&&Le?{passive:!0}:void 0}!function(){try{let t=Object.defineProperty({},"passive",{get(){Ge=!0}});window.addEventListener("test",null,t),window.removeEventListener("test",null,t)}catch(t){}}();let Je=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);const Ke=[],Ze={button:!0,input:!0,keygen:!0,meter:!0,output:!0,textarea:!0,progress:!0,select:!0},Qe={button:!0,command:!0,fieldset:!0,input:!0,keygen:!0,optgroup:!0,option:!0,select:!0,textarea:!0};function ti(t){let e=Array.prototype.slice.call(t.labels||[]);if(!e.length){e=[];let i=t.getRootNode();if(t.id){let s=i.querySelectorAll(`label[for = ${t.id}]`);for(let t=0;t<s.length;t++)e.push(s[t])}}return e}let ei=function(t){let e=t.sourceCapabilities;var i;if((!e||e.firesTouchEvents)&&(t[Be]={skip:!0},"click"===t.type)){let e=!1,s=ai(t);for(let t=0;t<s.length;t++){if(s[t].nodeType===Node.ELEMENT_NODE)if("label"===s[t].localName)Ke.push(s[t]);else if(i=s[t],Ze[i.localName]){let i=ti(s[t]);for(let t=0;t<i.length;t++)e=e||Ke.indexOf(i[t])>-1}if(s[t]===oi.mouse.target)return}if(e)return;t.preventDefault(),t.stopPropagation()}};function ii(t){let e=Je?["click"]:He;for(let i,s=0;s<e.length;s++)i=e[s],t?(Ke.length=0,document.addEventListener(i,ei,!0)):document.removeEventListener(i,ei,!0)}function si(t){let e=t.type;if(!Fe(e))return!1;if("mousemove"===e){let e=void 0===t.buttons?1:t.buttons;return t instanceof window.MouseEvent&&!We&&(e=Xe[t.which]||0),Boolean(1&e)}return 0===(void 0===t.button?0:t.button)}let oi={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};function ni(t,e,i){t.movefn=e,t.upfn=i,document.addEventListener("mousemove",e),document.addEventListener("mouseup",i)}function ri(t){document.removeEventListener("mousemove",t.movefn),document.removeEventListener("mouseup",t.upfn),t.movefn=null,t.upfn=null}$e&&document.addEventListener("touchend",function(t){if(!$e)return;oi.mouse.mouseIgnoreJob||ii(!0),oi.mouse.target=ai(t)[0],oi.mouse.mouseIgnoreJob=Pe.debounce(oi.mouse.mouseIgnoreJob,Oe.after(qe),function(){ii(),oi.mouse.target=null,oi.mouse.mouseIgnoreJob=null})},!!Ge&&{passive:!0});const ai=window.ShadyDOM&&window.ShadyDOM.noPatch?window.ShadyDOM.composedPath:t=>t.composedPath&&t.composedPath()||[],li={},di=[];function hi(t){const e=ai(t);return e.length>0?e[0]:t.target}function ci(t){let e,i=t.type,s=t.currentTarget[De];if(!s)return;let o=s[i];if(o){if(!t[Be]&&(t[Be]={},"touch"===i.slice(0,5))){let e=(t=t).changedTouches[0];if("touchstart"===i&&1===t.touches.length&&(oi.touch.id=e.identifier),oi.touch.id!==e.identifier)return;Ie||"touchstart"!==i&&"touchmove"!==i||function(t){let e=t.changedTouches[0],i=t.type;if("touchstart"===i)oi.touch.x=e.clientX,oi.touch.y=e.clientY,oi.touch.scrollDecided=!1;else if("touchmove"===i){if(oi.touch.scrollDecided)return;oi.touch.scrollDecided=!0;let i=function(t){let e="auto",i=ai(t);for(let t,s=0;s<i.length;s++)if((t=i[s])[ze]){e=t[ze];break}return e}(t),s=!1,o=Math.abs(oi.touch.x-e.clientX),n=Math.abs(oi.touch.y-e.clientY);t.cancelable&&("none"===i?s=!0:"pan-x"===i?s=n>o:"pan-y"===i&&(s=o>n)),s?t.preventDefault():gi("track")}}(t)}if(!(e=t[Be]).skip){for(let i,s=0;s<di.length;s++)o[(i=di[s]).name]&&!e[i.name]&&i.flow&&i.flow.start.indexOf(t.type)>-1&&i.reset&&i.reset();for(let s,n=0;n<di.length;n++)o[(s=di[n]).name]&&!e[s.name]&&(e[s.name]=!0,s[i](t))}}}function pi(t,e,i){return!!li[e]&&(function(t,e,i){let s=li[e],o=s.deps,n=s.name,r=t[De];r||(t[De]=r={});for(let e,i,s=0;s<o.length;s++)e=o[s],Je&&Fe(e)&&"click"!==e||((i=r[e])||(r[e]=i={_count:0}),0===i._count&&t.addEventListener(e,ci,Ye(e)),i[n]=(i[n]||0)+1,i._count=(i._count||0)+1);t.addEventListener(e,i),s.touchAction&&function(t,e){Ie&&t instanceof HTMLElement&&je.run(()=>{t.style.touchAction=e});t[ze]=e}(t,s.touchAction)}(t,e,i),!0)}function ui(t){di.push(t);for(let e=0;e<t.emits.length;e++)li[t.emits[e]]=t}function fi(t,e,i){let s=new Event(e,{bubbles:!0,cancelable:!0,composed:!0});if(s.detail=i,Te(t).dispatchEvent(s),s.defaultPrevented){let t=i.preventer||i.sourceEvent;t&&t.preventDefault&&t.preventDefault()}}function gi(t){let e=function(t){for(let e,i=0;i<di.length;i++){e=di[i];for(let i,s=0;s<e.emits.length;s++)if((i=e.emits[s])===t)return e}return null}(t);e.info&&(e.info.prevent=!0)}function yi(t,e,i,s){e&&fi(e,t,{x:i.clientX,y:i.clientY,sourceEvent:i,preventer:s,prevent:function(t){return gi(t)}})}function mi(t,e,i){if(t.prevent)return!1;if(t.started)return!0;let s=Math.abs(t.x-e),o=Math.abs(t.y-i);return s>=Ue||o>=Ue}function bi(t,e,i){if(!e)return;let s,o=t.moves[t.moves.length-2],n=t.moves[t.moves.length-1],r=n.x-t.x,a=n.y-t.y,l=0;o&&(s=n.x-o.x,l=n.y-o.y),fi(e,"track",{state:t.state,x:i.clientX,y:i.clientY,dx:r,dy:a,ddx:s,ddy:l,sourceEvent:i,hover:function(){return function(t,e){let i=document.elementFromPoint(t,e),s=i;for(;s&&s.shadowRoot&&!window.ShadyDOM&&s!==(s=s.shadowRoot.elementFromPoint(t,e));)s&&(i=s);return i}(i.clientX,i.clientY)}})}function vi(t,e,i){let s=Math.abs(e.clientX-t.x),o=Math.abs(e.clientY-t.y),n=hi(i||e);!n||Qe[n.localName]&&n.hasAttribute("disabled")||(isNaN(s)||isNaN(o)||s<=Ve&&o<=Ve||function(t){if("click"===t.type){if(0===t.detail)return!0;let e=hi(t);if(!e.nodeType||e.nodeType!==Node.ELEMENT_NODE)return!0;let i=e.getBoundingClientRect(),s=t.pageX,o=t.pageY;return!(s>=i.left&&s<=i.right&&o>=i.top&&o<=i.bottom)}return!1}(e))&&(t.prevent||fi(n,"tap",{x:e.clientX,y:e.clientY,sourceEvent:e,preventer:i}))}ui({name:"downup",deps:["mousedown","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["down","up"],info:{movefn:null,upfn:null},reset:function(){ri(this.info)},mousedown:function(t){if(!si(t))return;let e=hi(t),i=this;ni(this.info,function(t){si(t)||(yi("up",e,t),ri(i.info))},function(t){si(t)&&yi("up",e,t),ri(i.info)}),yi("down",e,t)},touchstart:function(t){yi("down",hi(t),t.changedTouches[0],t)},touchend:function(t){yi("up",hi(t),t.changedTouches[0],t)}}),ui({name:"track",touchAction:"none",deps:["mousedown","touchstart","touchmove","touchend"],flow:{start:["mousedown","touchstart"],end:["mouseup","touchend"]},emits:["track"],info:{x:0,y:0,state:"start",started:!1,moves:[],addMove:function(t){this.moves.length>2&&this.moves.shift(),this.moves.push(t)},movefn:null,upfn:null,prevent:!1},reset:function(){this.info.state="start",this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,ri(this.info)},mousedown:function(t){if(!si(t))return;let e=hi(t),i=this,s=function(t){let s=t.clientX,o=t.clientY;mi(i.info,s,o)&&(i.info.state=i.info.started?"mouseup"===t.type?"end":"track":"start","start"===i.info.state&&gi("tap"),i.info.addMove({x:s,y:o}),si(t)||(i.info.state="end",ri(i.info)),e&&bi(i.info,e,t),i.info.started=!0)};ni(this.info,s,function(t){i.info.started&&s(t),ri(i.info)}),this.info.x=t.clientX,this.info.y=t.clientY},touchstart:function(t){let e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove:function(t){let e=hi(t),i=t.changedTouches[0],s=i.clientX,o=i.clientY;mi(this.info,s,o)&&("start"===this.info.state&&gi("tap"),this.info.addMove({x:s,y:o}),bi(this.info,e,i),this.info.state="track",this.info.started=!0)},touchend:function(t){let e=hi(t),i=t.changedTouches[0];this.info.started&&(this.info.state="end",this.info.addMove({x:i.clientX,y:i.clientY}),bi(this.info,e,i))}}),ui({name:"tap",deps:["mousedown","click","touchstart","touchend"],flow:{start:["mousedown","touchstart"],end:["click","touchend"]},emits:["tap"],info:{x:NaN,y:NaN,prevent:!1},reset:function(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},mousedown:function(t){si(t)&&(this.info.x=t.clientX,this.info.y=t.clientY)},click:function(t){si(t)&&vi(this.info,t)},touchstart:function(t){const e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchend:function(t){vi(this.info,t.changedTouches[0],t)}});var wi=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},xi=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let ki=class extends ut{constructor(){super(...arguments),this._value=0,this.min=0,this.max=100,this.knobradius=10,this.disabled=!1,this.step=1,this.barWidth=0,this.intermediateValue=this.min,this.pct=0,this.startx=0,this.dragging=!1}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 40px;
      outline: none;
      box-sizing: border-box;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
    `}render(){return A`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}get value(){return this._value}set value(t){this.setValue(t,!0)}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}firstUpdated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`);const i=this.knobradius||10;this.barWidth=e.width-2*i,this.bar=Ot(t,i,e.height/2,e.width-i,e.height/2),this.bar.classList.add("bar"),this.knobGroup=_t("g"),t.appendChild(this.knobGroup),this.knob=Mt(this.knobGroup,i,e.height/2,2*i,2*i),this.knob.classList.add("knob"),this.onValueChange(),this.classList.add("wired-rendered"),this.setAttribute("role","slider"),this.setAttribute("aria-valuemax",`${this.max}`),this.setAttribute("aria-valuemin",`${this.min}`),this.setAriaValue(),pi(this.knob,"down",t=>{this.disabled||this.knobdown(t)}),pi(this.knob,"up",()=>{this.disabled||this.resetKnob()}),pi(this.knob,"track",t=>{this.disabled||this.onTrack(t)}),this.addEventListener("keydown",t=>{switch(t.keyCode){case 38:case 39:this.incremenent();break;case 37:case 40:this.decrement();break;case 36:this.setValue(this.min);break;case 35:this.setValue(this.max)}})}updated(t){t.has("disabled")&&this.refreshDisabledState()}setAriaValue(){this.setAttribute("aria-valuenow",`${this.value}`)}setValue(t,e=!1){this._value=t,this.setAriaValue(),this.onValueChange(),e||this.fireEvent("change",{value:this.intermediateValue})}incremenent(){const t=Math.min(this.max,Math.round(this.value+this.step));t!==this.value&&this.setValue(t)}decrement(){const t=Math.max(this.min,Math.round(this.value-this.step));t!==this.value&&this.setValue(t)}onValueChange(){if(!this.knob)return;let t=0;this.max>this.min&&(t=Math.min(1,Math.max((this.value-this.min)/(this.max-this.min),0))),this.pct=t,t?this.knob.classList.add("hasValue"):this.knob.classList.remove("hasValue");const e=t*this.barWidth;this.knobGroup.style.transform=`translateX(${Math.round(e)}px)`}knobdown(t){this.knobExpand(!0),t.preventDefault(),this.focus()}resetKnob(){this.knobExpand(!1)}knobExpand(t){this.knob&&(t?this.knob.classList.add("expanded"):this.knob.classList.remove("expanded"))}onTrack(t){switch(t.stopPropagation(),t.detail.state){case"start":this.trackStart();break;case"track":this.trackX(t);break;case"end":this.trackEnd()}}trackStart(){this.intermediateValue=this.value,this.startx=this.pct*this.barWidth,this.dragging=!0}trackX(t){this.dragging||this.trackStart();const e=t.detail.dx||0,i=Math.max(Math.min(this.startx+e,this.barWidth),0);this.knobGroup.style.transform=`translateX(${Math.round(i)}px)`;const s=i/this.barWidth;this.intermediateValue=this.min+s*(this.max-this.min)}trackEnd(){this.dragging=!1,this.resetKnob(),this.setValue(this.intermediateValue),this.pct=(this.value-this.min)/(this.max-this.min)}};wi([st({type:Number}),xi("design:type",Object)],ki.prototype,"_value",void 0),wi([st({type:Number}),xi("design:type",Object)],ki.prototype,"min",void 0),wi([st({type:Number}),xi("design:type",Object)],ki.prototype,"max",void 0),wi([st({type:Number}),xi("design:type",Object)],ki.prototype,"knobradius",void 0),wi([st({type:Boolean,reflect:!0}),xi("design:type",Object)],ki.prototype,"disabled",void 0),ki=wi([tt("wired-slider")],ki);var Si=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},_i=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Ci=class extends ut{constructor(){super(...arguments),this.rows=1,this.maxrows=0,this.autocomplete="",this.autofocus=!1,this.disabled=!1,this.inputmode="",this.placeholder="",this.required=!1,this.readonly=!1,this.tokens=[],this.prevHeight=0}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      font-family: sans-serif;
      width: 400px;
      outline: none;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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

    #mirror {
      padding: 10px;
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
      padding: 10px;
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
    `}createRenderRoot(){return this.attachShadow({mode:"open",delegatesFocus:!0})}get textarea(){return this.shadowRoot?this.shadowRoot.getElementById("textarea"):null}get mirror(){return this.shadowRoot.getElementById("mirror")}get value(){const t=this.textarea;return t&&t.value||""}set value(t){const e=this.textarea;e&&(e.value!==t&&(e.value=t||""),this.mirror.innerHTML=this.valueForMirror(),this.requestUpdate())}valueForMirror(){const t=this.textarea;return t?(this.tokens=t&&t.value?t.value.replace(/&/gm,"&amp;").replace(/"/gm,"&quot;").replace(/'/gm,"&#39;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").split("\n"):[""],this.constrain(this.tokens)):""}constrain(t){let e;for(t=t||[""],e=this.maxrows>0&&t.length>this.maxrows?t.slice(0,this.maxrows):t.slice(0);this.rows>0&&e.length<this.rows;)e.push("");return e.join("<br/>")+"&#160;"}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled")}firstUpdated(){this.value=this.value||this.getAttribute("value")||""}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg"),i=this.getBoundingClientRect();if(this.prevHeight!==i.height){for(;e.hasChildNodes();)e.removeChild(e.lastChild);e.setAttribute("width",`${i.width}`),e.setAttribute("height",`${i.height}`),jt(e,2,2,i.width-2,i.height-2),this.prevHeight=i.height,this.classList.add("wired-rendered"),this.updateCached()}}updateCached(){this.mirror.innerHTML=this.constrain(this.tokens)}onInput(){this.value=this.textarea.value}};Si([st({type:Number}),_i("design:type",Object)],Ci.prototype,"rows",void 0),Si([st({type:Number}),_i("design:type",Object)],Ci.prototype,"maxrows",void 0),Si([st({type:String}),_i("design:type",Object)],Ci.prototype,"autocomplete",void 0),Si([st({type:Boolean}),_i("design:type",Object)],Ci.prototype,"autofocus",void 0),Si([st({type:Boolean,reflect:!0}),_i("design:type",Object)],Ci.prototype,"disabled",void 0),Si([st({type:String}),_i("design:type",Object)],Ci.prototype,"inputmode",void 0),Si([st({type:String}),_i("design:type",Object)],Ci.prototype,"placeholder",void 0),Si([st({type:Boolean}),_i("design:type",Object)],Ci.prototype,"required",void 0),Si([st({type:Boolean}),_i("design:type",Object)],Ci.prototype,"readonly",void 0),Si([st({type:Number}),_i("design:type",Number)],Ci.prototype,"minlength",void 0),Si([st({type:Number}),_i("design:type",Number)],Ci.prototype,"maxlength",void 0),Ci=Si([tt("wired-textarea")],Ci);const Ri=new WeakMap,Ei=e(t=>e=>{if(!(e instanceof x)||e instanceof C||"style"!==e.committer.name||e.committer.parts.length>1)throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const{committer:i}=e,{style:s}=i.element;Ri.has(e)||(s.cssText=i.strings.join(" "));const o=Ri.get(e);for(const e in o)e in t||(-1===e.indexOf("-")?s[e]=null:s.removeProperty(e));for(const e in t)-1===e.indexOf("-")?s[e]=t[e]:s.setProperty(e,t[e]);Ri.set(e,t)});var Ni=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Oi=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};const ji={bottom:{alignItems:"center",justifyContent:"flex-end"},"bottom-left":{alignItems:"flex-start",justifyContent:"flex-end"},"bottom-right":{alignItems:"flex-end",justifyContent:"flex-end"},top:{alignItems:"center",justifyContent:null},"top-left":{alignItems:"flex-start",justifyContent:null},"top-right":{alignItems:"flex-end",justifyContent:null}},Pi={bottom:"translateY(100%)","bottom-left":"translateX(-100%)","bottom-right":"translateX(100%)",top:"translateY(-100%)","top-left":"translateX(-100%)","top-right":"translateX(100%)"},Mi={bottom:"translateY(0)","bottom-left":"translateX(0)","bottom-right":"translateX(0)",top:"translateY(0)","top-left":"translateX(0)","top-right":"translateX(0)"};let Ai=class extends ut{constructor(){super(...arguments),this.showing=!1,this.location="bottom"}static get styles(){return ht`
      :host {
        align-items: initial;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: initial;
        left: 0;
        outline: none;
        pointer-events: none;
        position: fixed;
        top: 0;
        -webkit-tap-highlight-color: transparent;
        width: 100%;
      }
      wired-card {
        display: inline-flex;
        width: fit-content;
        background: var(--wired-toast-bg, #fff);
        pointer-events: initial;
        position: relative;
        transition-duration: 0.25s;
        transition-property: opacity, transform;
        will-change: opacity, transform;
      }
    `}render(){const t=this.showing?"1":"0",e=this.showing?Mi[this.location]:Pi[this.location],i=Object.assign({},{opacity:t,transform:e});return Object.assign(this.style,ji[this.location]),A`
      <wired-card elevation="3" style=${Ei(i)}>
        <slot></slot>
      </wired-card>
    `}async wait(t=0){return new Promise(e=>{setTimeout(e,t)})}async show(t=3e3){this.showing=!0,await this.wait(500),t>0&&(await this.wait(t),this.showing=!1,await this.wait(500),this.close())}close(){this.fireEvent("toast-closed")}};function Li(t,e=3e3,i="bottom"){const s=function(t){const e=document.createElement("template");return t=t.trim(),e.innerHTML=t,e.content.firstChild}(`<wired-toast location="${i}">${t}</wired-toast>`);document.body.appendChild(s),s.addEventListener("toast-closed",()=>{document.body.removeChild(s)}),setTimeout(()=>s.show(e))}Ni([st({type:Boolean,reflect:!0}),Oi("design:type",Object)],Ai.prototype,"showing",void 0),Ni([st({type:String,reflect:!0}),Oi("design:type",Object)],Ai.prototype,"location",void 0),Ai=Ni([tt("wired-toast")],Ai);var $i=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Ti=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let Ii=class extends ut{constructor(){super(...arguments),this.checked=!1,this.disabled=!1}static get styles(){return ht`
    :host {
      display: inline-block;
      cursor: pointer;
      position: relative;
      outline: none;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
      stroke-width: 1.2;
    }

    svg {
      display: block;
    }
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
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
    `}render(){return A`
    <div @click="${this.toggleCheck}">
      <svg id="svg"></svg>
    </div>
    `}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}toggleCheck(){this.checked=!this.checked,this.fireEvent("change",{checked:this.checked})}firstUpdated(){this.setAttribute("role","switch"),this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.toggleCheck())});const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=80,i=34;t.setAttribute("width",`${e}`),t.setAttribute("height",`${i}`),jt(t,16,8,e-32,18),this.knob=_t("g"),this.knob.classList.add("knob"),t.appendChild(this.knob);const s=Tt(16,16,32,32);s.classList.add("knobfill"),this.knob.appendChild(s),Mt(this.knob,16,16,32,32),this.classList.add("wired-rendered")}updated(t){if(t.has("disabled")&&this.refreshDisabledState(),this.knob){const t=this.knob.classList;this.checked?(t.remove("unchecked"),t.add("checked")):(t.remove("checked"),t.add("unchecked"))}this.setAttribute("aria-checked",`${this.checked}`)}};$i([st({type:Boolean}),Ti("design:type",Object)],Ii.prototype,"checked",void 0),$i([st({type:Boolean,reflect:!0}),Ti("design:type",Object)],Ii.prototype,"disabled",void 0),Ii=$i([tt("wired-toggle")],Ii);var Di=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Bi=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let zi=class extends ut{constructor(){super(...arguments),this.offset=14,this.position="bottom",this.dirty=!1,this.showing=!1,this._target=null,this.showHandler=this.show.bind(this),this.hideHandler=this.hide.bind(this)}static get styles(){return ht`
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
    `}get target(){if(this._target)return this._target;const t=this.parentNode,e=(this.getRootNode?this.getRootNode():null)||document;let i=null;return this.for?i=e.querySelector("#"+this.for):t&&(i=t.nodeType===Node.DOCUMENT_FRAGMENT_NODE?e.host:t),i}detachListeners(){this._target&&(this._target.removeEventListener("mouseenter",this.showHandler),this._target.removeEventListener("focus",this.showHandler),this._target.removeEventListener("mouseleave",this.hideHandler),this._target.removeEventListener("blur",this.hideHandler),this._target.removeEventListener("click",this.hideHandler)),this.removeEventListener("mouseenter",this.hideHandler)}attachListeners(){this._target&&(this._target.addEventListener("mouseenter",this.showHandler),this._target.addEventListener("focus",this.showHandler),this._target.addEventListener("mouseleave",this.hideHandler),this._target.addEventListener("blur",this.hideHandler),this._target.addEventListener("click",this.hideHandler)),this.addEventListener("mouseenter",this.hideHandler)}refreshTarget(){this.detachListeners(),this._target=null,this._target=this.target,this.attachListeners(),this.dirty=!0}layout(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();let i=e.width,s=e.height;switch(this.position){case"left":case"right":i+=this.offset;break;default:s+=this.offset}t.setAttribute("width",`${i}`),t.setAttribute("height",`${s}`);let o=[];switch(this.position){case"top":o=[[2,2],[i-2,2],[i-2,s-this.offset],[i/2+8,s-this.offset],[i/2,s-this.offset+8],[i/2-8,s-this.offset],[0,s-this.offset]];break;case"left":o=[[2,2],[i-this.offset,2],[i-this.offset,s/2-8],[i-this.offset+8,s/2],[i-this.offset,s/2+8],[i-this.offset,s],[2,s-2]];break;case"right":o=[[this.offset,2],[i-2,2],[i-2,s-2],[this.offset,s-2],[this.offset,s/2+8],[this.offset-8,s/2],[this.offset,s/2-8]],t.style.transform=`translateX(${-this.offset}px)`;break;default:o=[[2,this.offset],[0,s-2],[i-2,s-2],[i-2,this.offset],[i/2+8,this.offset],[i/2,this.offset-8],[i/2-8,this.offset]],t.style.transform=`translateY(${-this.offset}px)`}Pt(t,o),this.dirty=!1}firstUpdated(){this.layout()}updated(t){(t.has("position")||t.has("text"))&&(this.dirty=!0),this._target&&!t.has("for")||this.refreshTarget(),this.dirty&&this.layout()}show(){this.showing||(this.showing=!0,this.shadowRoot.getElementById("container").style.display="",this.updatePosition(),setTimeout(()=>{this.layout()},1))}hide(){this.showing&&(this.showing=!1,this.shadowRoot.getElementById("container").style.display="none")}updatePosition(){if(!this._target||!this.offsetParent)return;const t=this.offset,e=this.offsetParent.getBoundingClientRect(),i=this._target.getBoundingClientRect(),s=this.getBoundingClientRect(),o=(i.width-s.width)/2,n=(i.height-s.height)/2,r=i.left-e.left,a=i.top-e.top;let l,d;switch(this.position){case"top":l=r+o,d=a-s.height-t;break;case"bottom":l=r+o,d=a+i.height+t;break;case"left":l=r-s.width-t,d=a+n;break;case"right":l=r+i.width+t,d=a+n}this.style.left=l+"px",this.style.top=d+"px"}};Di([st({type:String}),Bi("design:type",String)],zi.prototype,"for",void 0),Di([st({type:String}),Bi("design:type",String)],zi.prototype,"text",void 0),Di([st({type:Number}),Bi("design:type",Object)],zi.prototype,"offset",void 0),Di([st({type:String}),Bi("design:type",String)],zi.prototype,"position",void 0),zi=Di([tt("wired-tooltip")],zi);var Vi=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},Ui=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let qi=class extends ut{constructor(){super(...arguments),this.name="",this.label=""}static get styles(){return ht`
      :host {
        display: block;
        display: table-cell;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.4rem;
      }

      @media screen and (max-width: 580px) {
        :host {
          display: block;
          font-size: 0.8em;
          text-align: right;
        }
        :host::before {
          content: attr(data-label);
          float: left;
          font-weight: bold;
          text-transform: uppercase;
        }
      }
    `}render(){return A`
      <slot></slot>
    `}};Vi([st({type:String}),Ui("design:type",Object)],qi.prototype,"name",void 0),Vi([st({type:String}),Ui("design:type",Object)],qi.prototype,"label",void 0),qi=Vi([tt("wired-cell")],qi);let Hi=class extends ut{constructor(){super(...arguments),this.name="",this.label=""}static get styles(){return ht`
      :host {
        display: contents;
      }
    `}render(){return A`
      <slot></slot>
    `}};Vi([st({type:String}),Ui("design:type",Object)],Hi.prototype,"name",void 0),Vi([st({type:String}),Ui("design:type",Object)],Hi.prototype,"label",void 0),Hi=Vi([tt("wired-row")],Hi);let Xi=class extends ut{constructor(){super(...arguments),this.name="",this.label=""}static get styles(){return ht`
      :host {
        display: block;
        display: table-cell;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.4rem;
      }
    `}render(){return A`
      <slot></slot>
    `}};Vi([st({type:String}),Ui("design:type",Object)],Xi.prototype,"name",void 0),Vi([st({type:String}),Ui("design:type",Object)],Xi.prototype,"label",void 0),Xi=Vi([tt("wired-column")],Xi);let Wi=class extends ut{constructor(){super(...arguments),this.name="",this.label=""}static get styles(){return ht`
      :host {
        display: contents;
      }
      @media screen and (max-width: 580px) {
        :host {
          display: none;
        }
      }
    `}render(){return A`
      <slot></slot>
    `}};Vi([st({type:String}),Ui("design:type",Object)],Wi.prototype,"name",void 0),Vi([st({type:String}),Ui("design:type",Object)],Wi.prototype,"label",void 0),Wi=Vi([tt("wired-columns")],Wi);let Fi=class extends ut{static get styles(){return ht`
      :host {
        flex: 1;
        display: block;
        padding-bottom: 2em;
        position: relative;
      }

      :host(.wired-rendered) {
        opacity: 1;
      }

      .table-container {
        display: grid;
        border-collapse: collapse;
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

      @media screen and (max-width: 580px) {
        .table-container {
          grid-template-columns: minmax(300px, auto) !important;
        }
      }
    `}render(){const t={"grid-template-columns":`repeat(${this.querySelectorAll("wired-column").length}, 150px)`};return A`
      <div class="table-container" style=${Ei(t)}>
        <slot @slotchange="${()=>this.requestUpdate()}"></slot>
      </div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    `}connectedCallback(){super.connectedCallback(),this.resizeHandler||(this.resizeHandler=function(t,e,i,s){let o=0;return()=>{const n=arguments,r=i&&!o;clearTimeout(o),o=window.setTimeout(()=>{o=0,i||t.apply(s,n)},e),r&&t.apply(s,n)}}(this.updated.bind(this),200,!1,this),window.addEventListener("resize",this.resizeHandler)),setTimeout(()=>this.updated())}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this.resizeHandler&&(window.removeEventListener("resize",this.resizeHandler),delete this.resizeHandler)}firstUpdated(){this.querySelectorAll("wired-column").forEach((t,e)=>{const i=t;this.querySelectorAll(`wired-cell:nth-child(${e+1})`).forEach(t=>{t.setAttribute("data-label",i.innerText)})})}updated(){const t=this.shadowRoot.getElementById("svg");for(;t.hasChildNodes();)t.removeChild(t.lastChild);const e=this.getBoundingClientRect();if(t.setAttribute("width",`${e.width}`),t.setAttribute("height",`${e.height}`),e.width>580){Ot(t,4,4,4,e.height-12),this.querySelectorAll("wired-column").forEach((i,s)=>{const o=i.getBoundingClientRect().width*(s+1);Ot(t,o,4,o,e.height-12)}),Ot(t,4,2,e.width-12,2);const i=this.querySelectorAll("wired-columns, wired-row"),s=this.querySelector("wired-cell"),o=s?s.getBoundingClientRect():{width:0,height:0};i.forEach((i,s)=>{const n=o.height*(s+1);Ot(t,4,n,e.width-4,n)})}else{Ot(t,4,2,e.width-12,2),this.querySelectorAll("wired-cell").forEach((i,s)=>{const o=i.getBoundingClientRect().height*(s+1);Ot(t,4,o,e.width-4,o)})}this.classList.add("wired-rendered")}};Fi=Vi([tt("wired-table")],Fi);const Gi=(t,e)=>{const i=t.startNode.parentNode,s=void 0===e?t.endNode:e.startNode,o=i.insertBefore(f(),s);i.insertBefore(f(),s);const n=new k(t.options);return n.insertAfterNode(o),n},Yi=(t,e)=>(t.setValue(e),t.commit(),t),Ji=(t,e,i)=>{const s=t.startNode.parentNode,o=i?i.startNode:t.endNode,n=e.endNode.nextSibling;n!==o&&((t,e,i=null,s=null)=>{for(;e!==i;){const i=e.nextSibling;t.insertBefore(e,s),e=i}})(s,e.startNode,n,o)},Ki=t=>{o(t.startNode.parentNode,t.startNode,t.endNode.nextSibling)},Zi=(t,e,i)=>{const s=new Map;for(let o=e;o<=i;o++)s.set(t[o],o);return s},Qi=new WeakMap,ts=new WeakMap,es=e((t,e,i)=>{let s;return void 0===i?i=e:void 0!==e&&(s=e),e=>{if(!(e instanceof k))throw new Error("repeat can only be used in text bindings");const o=Qi.get(e)||[],n=ts.get(e)||[],r=[],a=[],l=[];let d,h,c=0;for(const e of t)l[c]=s?s(e,c):c,a[c]=i(e,c),c++;let p=0,u=o.length-1,f=0,g=a.length-1;for(;p<=u&&f<=g;)if(null===o[p])p++;else if(null===o[u])u--;else if(n[p]===l[f])r[f]=Yi(o[p],a[f]),p++,f++;else if(n[u]===l[g])r[g]=Yi(o[u],a[g]),u--,g--;else if(n[p]===l[g])r[g]=Yi(o[p],a[g]),Ji(e,o[p],r[g+1]),p++,g--;else if(n[u]===l[f])r[f]=Yi(o[u],a[f]),Ji(e,o[u],o[p]),u--,f++;else if(void 0===d&&(d=Zi(l,f,g),h=Zi(n,p,u)),d.has(n[p]))if(d.has(n[u])){const t=h.get(l[f]),i=void 0!==t?o[t]:null;if(null===i){const t=Gi(e,o[p]);Yi(t,a[f]),r[f]=t}else r[f]=Yi(i,a[f]),Ji(e,i,o[p]),o[t]=null;f++}else Ki(o[u]),u--;else Ki(o[p]),p++;for(;f<=g;){const t=Gi(e,r[g+1]);Yi(t,a[f]),r[f++]=t}for(;p<=u;){const t=o[p++];null!==t&&Ki(t)}Qi.set(e,r),ts.set(e,l)}});var is=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},ss=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let os=class extends ut{constructor(){super(...arguments),this.name="",this.label=""}static get styles(){return ht`
    :host {
      display: block;
    }
    wired-card {
      display: block;
    }
    `}render(){return A`
    <wired-card>
      <slot></slot>
    </wired-card>
    `}relayout(){setTimeout(()=>{this.card&&this.card.requestUpdate()})}};is([st({type:String}),ss("design:type",Object)],os.prototype,"name",void 0),is([st({type:String}),ss("design:type",Object)],os.prototype,"label",void 0),is([ot("wired-card"),ss("design:type",Ut)],os.prototype,"card",void 0),os=is([tt("wired-tab")],os);let ns=class extends ut{constructor(){super(...arguments),this.pages=[],this.pageMap=new Map}static get styles(){return ht`
    :host {
      display: block;
    }

    .hidden {
      display: none !important;
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
    `}render(){return A`
    <div id="bar">
      ${es(this.pages,t=>t.name,t=>A`
      <wired-item role="tab" .value="${t.name}" .selected="${t.name===this.selected}" ?aria-selected="${t.name===this.selected}"
        @click="${()=>this.selected=t.name}">${t.label||t.name}</wired-item>
      `)}
    </div>
    <div>
      <slot id="slot" @slotchange="${this.mapPages}"></slot>
    </div>
    `}mapPages(){if(this.pages=[],this.pageMap.clear(),this.slotElement){const t=this.slotElement.assignedNodes();if(t&&t.length){for(let e=0;e<t.length;e++){const i=t[e];if(i.nodeType===Node.ELEMENT_NODE&&"wired-tab"===i.tagName.toLowerCase()){const t=i;this.pages.push(t);const e=t.getAttribute("name")||"";e&&e.trim().split(" ").forEach(e=>{e&&this.pageMap.set(e,t)})}}this.selected||this.pages.length&&(this.selected=this.pages[0].name),this.requestUpdate()}}}firstUpdated(){this.mapPages(),this.tabIndex=+(this.getAttribute("tabindex")||0),this.addEventListener("keydown",t=>{switch(t.keyCode){case 37:case 38:t.preventDefault(),this.selectPrevious();break;case 39:case 40:t.preventDefault(),this.selectNext()}})}updated(){const t=this.getElement();for(let e=0;e<this.pages.length;e++){const i=this.pages[e];i===t?i.classList.remove("hidden"):i.classList.add("hidden")}this.current=t||void 0,this.current&&this.current.relayout()}getElement(){let t=void 0;return this.selected&&(t=this.pageMap.get(this.selected)),t||(t=this.pages[0]),t||null}selectPrevious(){const t=this.pages;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.current){e=i;break}e<0?e=0:0===e?e=t.length-1:e--,this.selected=t[e].name||""}}selectNext(){const t=this.pages;if(t.length){let e=-1;for(let i=0;i<t.length;i++)if(t[i]===this.current){e=i;break}e<0?e=0:e>=t.length-1?e=0:e++,this.selected=t[e].name||""}}};is([st({type:String}),ss("design:type",String)],ns.prototype,"selected",void 0),is([ot("slot"),ss("design:type",HTMLSlotElement)],ns.prototype,"slotElement",void 0),ns=is([tt("wired-tabs")],ns);var rs=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},as=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let ls=class extends ut{constructor(){super(...arguments),this.disabled=!1}static get styles(){return ht`
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
      padding: 16px;
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
      color: #fff;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
    }
  
    :host(.wired-disabled) {
      opacity: 0.45 !important;
      cursor: default;
      background: rgba(0, 0, 0, 0.07);
      border-radius: 50%;
      pointer-events: none;
    }
  
    :host(:active) mwc-icon {
      opacity: 1;
      transform: scale(1.15);
    }

    :host(:focus) mwc-icon {
      opacity: 1;
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
      stroke: var(--wired-fab-bg-color, #018786);
      stroke-width: 3;
      fill: transparent;
    }
  
    mwc-icon {
      position: relative;
      font-size: var(--wired-icon-size, 24px);
      transition: transform 0.2s ease, opacity 0.2s ease;
      opacity: 0.85;
    }
    `}render(){return A`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <mwc-icon>
      <slot></slot>
    </mwc-icon>
    `}firstUpdated(){this.addEventListener("keydown",t=>{13!==t.keyCode&&32!==t.keyCode||(t.preventDefault(),this.click())}),this.setAttribute("role","button"),this.setAttribute("aria-label",this.textContent||this.innerText),setTimeout(()=>this.requestUpdate())}updated(t){t.has("disabled")&&this.refreshDisabledState();const e=this.shadowRoot.getElementById("svg");for(;e.hasChildNodes();)e.removeChild(e.lastChild);const i=this.getBoundingClientRect(),s=Math.min(i.width,i.height);e.setAttribute("width",`${s}`),e.setAttribute("height",`${s}`);const o=Tt(s/2,s/2,s,s);e.appendChild(o),this.classList.add("wired-rendered")}refreshDisabledState(){this.disabled?this.classList.add("wired-disabled"):this.classList.remove("wired-disabled"),this.tabIndex=this.disabled?-1:+(this.getAttribute("tabindex")||0)}};rs([st({type:Boolean,reflect:!0}),as("design:type",Object)],ls.prototype,"disabled",void 0),ls=rs([tt("wired-fab")],ls);var ds=function(t,e,i,s){var o,n=arguments.length,r=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,i,r):o(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r},hs=function(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)};let cs=class extends ut{constructor(){super(...arguments),this.spinning=!1,this.duration=1500,this.value=0,this.timerstart=0,this.frame=0}static get styles(){return ht`
    :host {
      display: inline-block;
      position: relative;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
    }

    #svg {
      display: block;
      width: 76px;
      height: 76px;
    }

    path {
      stroke: currentColor;
      stroke-opacity: 0.5;
      stroke-width: 1.5;
      fill: none;
    }
    .knob path {
      stroke-width: 2.8 !important;
      stroke-opacity: 1;
    }
    `}render(){return A`
    <svg id="svg"></svg>
    `}firstUpdated(){this.svg&&(Mt(this.svg,38,38,60,60),this.knob=Tt(0,0,20,20),this.knob.classList.add("knob"),this.svg.appendChild(this.knob)),this.updateCursor(),this.classList.add("wired-rendered")}updated(){this.spinning?this.startSpinner():this.stopSpinner()}startSpinner(){this.stopSpinner(),this.value=0,this.timerstart=0,this.nextTick()}stopSpinner(){this.frame&&(window.cancelAnimationFrame(this.frame),this.frame=0)}nextTick(){this.frame=window.requestAnimationFrame(t=>this.tick(t))}tick(t){this.spinning?(this.timerstart||(this.timerstart=t),this.value=Math.min(1,(t-this.timerstart)/this.duration),this.updateCursor(),this.value>=1&&(this.value=0,this.timerstart=0),this.nextTick()):this.frame=0}updateCursor(){if(this.knob){const t=[Math.round(38+25*Math.cos(this.value*Math.PI*2)),Math.round(38+25*Math.sin(this.value*Math.PI*2))];this.knob.style.transform=`translate3d(${t[0]}px, ${t[1]}px, 0) rotateZ(${Math.round(360*this.value*2)}deg)`}}};ds([st({type:Boolean}),hs("design:type",Object)],cs.prototype,"spinning",void 0),ds([st({type:Number}),hs("design:type",Object)],cs.prototype,"duration",void 0),ds([ot("svg"),hs("design:type",SVGSVGElement)],cs.prototype,"svg",void 0),cs=ds([tt("wired-spinner")],cs);export{Bt as WiredButton,Ut as WiredCard,Xt as WiredCheckbox,Kt as WiredCombo,te as WiredDialog,ee as openDialog,le as WiredIconButton,ce as WiredInput,Gt as WiredItem,fe as WiredListbox,me as WiredProgress,we as WiredRadio,Se as WiredRadioGroup,ki as WiredSlider,Ci as WiredTextarea,Ai as WiredToast,Li as showToast,Ii as WiredToggle,zi as WiredTooltip,Fi as WiredTable,Wi as WiredColumns,Xi as WiredColumn,Hi as WiredRow,qi as WiredCell,os as WiredTab,ns as WizardTabs,ls as WiredFab,cs as WiredSpinner};

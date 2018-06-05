var WiredElements=function(e){'use strict';function t(e){const t={};for(let n in e){const i=e[n];t[n]='function'==typeof i?{type:i}:i}return t}function n(e){let t=U.get(e.type);void 0===t&&(t=new Map,U.set(e.type,t));let n=t.get(e.strings);return void 0===n&&(n=new ne(e,e.getTemplateElement()),t.set(e.strings,n)),n}function i(e,t,i=n){const d=i(e);let a=t.__templateInstance;if(void 0!==a&&a.template===d&&a._partCallback===e.partCallback)return void a.update(e.values);a=new ce(d,e.partCallback,i),t.__templateInstance=a;const s=a._clone();a.update(e.values),he(t,t.firstChild),t.appendChild(s)}function d(e){const t=e.lastIndexOf('>'),n=e.indexOf('<',t+1);return-1<n?e.length:t}function a(e,t,n){return i(e,t,ue(n))}function s(e){let t=Le.get(e.type);void 0===t&&(t=new Map,Le.set(e.type,t));let n=t.get(e.strings);return void 0===n&&(n=new Ve(e,e.getTemplateElement()),t.set(e.strings,n)),n}function o(e,t,n=s){const i=n(e);let d=t.__templateInstance;if(void 0!==d&&d.template===i&&d._partCallback===e.partCallback)return void d.update(e.values);d=new Fe(i,e.partCallback,n),t.__templateInstance=d;const a=d._clone();d.update(e.values),qe(t,t.firstChild),t.appendChild(a)}function r(e){const t=e.lastIndexOf('>'),n=e.indexOf('<',t+1);return-1<n?e.length:t}function l(e,t,n){return o(e,t,Ge(n))}function c(e){return-1<ut.indexOf(e)}function h(e){return c(e)||'touchend'===e,void 0}function u(e){return vt[e.localName]||!1}function _(e){let t=Array.prototype.slice.call(e.labels||[]);if(!t.length){t=[];let n=e.getRootNode();if(e.id){let d=n.querySelectorAll(`label[for = ${e.id}]`);for(let e=0;e<d.length;e++)t.push(d[e])}}return t}function p(e){let t=mt?['click']:ut;for(let n,d=0;d<t.length;d++)n=t[d],e?(ft.length=0,document.addEventListener(n,bt,!0)):document.removeEventListener(n,bt,!0)}function g(e){let t=e.type;if(!c(t))return!1;if('mousemove'===t){let t=void 0===e.buttons?1:e.buttons;return e instanceof window.MouseEvent&&!pt&&(t=_t[e.which]||0),!!(1&t)}else{let t=void 0===e.button?0:e.button;return 0===t}}function m(e){if('click'===e.type){if(0===e.detail)return!0;let n=C(e);if(!n.nodeType||n.nodeType!==Node.ELEMENT_NODE)return!0;let t=n.getBoundingClientRect(),i=e.pageX,d=e.pageY;return!(i>=t.left&&i<=t.right&&d>=t.top&&d<=t.bottom)}return!1}function f(e){let t='auto',d=e.composedPath&&e.composedPath();if(d)for(let e,n=0;n<d.length;n++)if(e=d[n],e.__polymerGesturesTouchAction){t=e.__polymerGesturesTouchAction;break}return t}function v(e,t,n){e.movefn=t,e.upfn=n,document.addEventListener('mousemove',t),document.addEventListener('mouseup',n)}function b(e){document.removeEventListener('mousemove',e.movefn),document.removeEventListener('mouseup',e.upfn),e.movefn=null,e.upfn=null}function y(e,t){let n=document.elementFromPoint(e,t),i=n;for(;i&&i.shadowRoot&&!window.ShadyDOM;){let d=i;if(i=i.shadowRoot.elementFromPoint(e,t),d===i)break;i&&(n=i)}return n}function C(e){if(e.composedPath){const t=e.composedPath();return 0<t.length?t[0]:e.target}return e.target}function w(e){let t,n=e.type,i=e.currentTarget,d=i.__polymerGestures;if(d){let a=d[n];if(a){if(!e.__polymerGesturesHandled&&(e.__polymerGesturesHandled={},'touch'===n.slice(0,5))){e=e;let i=e.changedTouches[0];if('touchstart'===n&&1===e.touches.length&&(yt.touch.id=i.identifier),yt.touch.id!==i.identifier)return;ht||'touchstart'!==n&&'touchmove'!==n||x(e)}if(t=e.__polymerGesturesHandled,!t.skip){for(let n,d=0;d<wt.length;d++)n=wt[d],a[n.name]&&!t[n.name]&&n.flow&&-1<n.flow.start.indexOf(e.type)&&n.reset&&n.reset();for(let d,s=0;s<wt.length;s++)d=wt[s],a[d.name]&&!t[d.name]&&(t[d.name]=!0,d[n](e))}}}}function x(e){let n=e.changedTouches[0],t=e.type;if('touchstart'===t)yt.touch.x=n.clientX,yt.touch.y=n.clientY,yt.touch.scrollDecided=!1;else if('touchmove'===t){if(yt.touch.scrollDecided)return;yt.touch.scrollDecided=!0;let t=f(e),i=!1,d=V(yt.touch.x-n.clientX),a=V(yt.touch.y-n.clientY);if(!e.cancelable);else'none'===t?i=!0:'pan-x'===t?i=a>d:'pan-y'===t&&(i=d>a);i?e.preventDefault():i('track')}}function k(e,t,n){return!!Ct[t]&&(N(e,t,n),!0)}function N(e,t,n){let i=Ct[t],d=i.deps,a=i.name,s=e.__polymerGestures;s||(e.__polymerGestures=s={});for(let o,r,l=0;l<d.length;l++)(o=d[l],!(mt&&c(o)&&'click'!==o))&&(r=s[o],r||(s[o]=r={_count:0}),0===r._count&&e.addEventListener(o,w,h(o)),r[a]=(r[a]||0)+1,r._count=(r._count||0)+1);e.addEventListener(t,n),i.touchAction&&L(e,i.touchAction)}function E(e){wt.push(e);for(let t=0;t<e.emits.length;t++)Ct[e.emits[t]]=e}function T(e){for(let t,n=0;n<wt.length;n++){t=wt[n];for(let i,n=0;n<t.emits.length;n++)if(i=t.emits[n],i===e)return t}return null}function L(e,t){ht&&Y.run(()=>{e.style.touchAction=t}),e.__polymerGesturesTouchAction=t}function R(e,t,n){let i=new Event(t,{bubbles:!0,cancelable:!0,composed:!0});if(i.detail=n,e.dispatchEvent(i),i.defaultPrevented){let e=n.preventer||n.sourceEvent;e&&e.preventDefault&&e.preventDefault()}}function I(e){let t=T(e);t.info&&(t.info.prevent=!0)}var O=Math.round,P=Math.min,A=Math.sqrt,S=Math.pow,V=Math.abs,B=Math.PI,H=Math.max;window.JSCompiler_renameProperty=function(e){return e};let D=0;const z=function(e){function t(t){let d=t.__mixinSet;if(d&&d[i])return t;let a=n,s=a.get(t);s||(s=e(t),a.set(t,s));let o=Object.create(s.__mixinSet||d||null);return o[i]=!0,s.__mixinSet=o,s}let n=e.__mixinApplications;n||(n=new WeakMap,e.__mixinApplications=n);let i=D++;return t};let W=0,M=0,X=[],F=0,q=document.createTextNode('');new window.MutationObserver(function(){const e=X.length;for(let t,n=0;n<e;n++)if(t=X[n],t)try{t()}catch(t){setTimeout(()=>{throw t})}X.splice(0,e),M+=e}).observe(q,{characterData:!0});const G={after(e){return{run(t){return window.setTimeout(t,e)},cancel(e){window.clearTimeout(e)}}},run(e,t){return window.setTimeout(e,t)},cancel(e){window.clearTimeout(e)}},Y={run(e){return q.textContent=F++,X.push(e),W++},cancel(e){const t=e-M;if(0<=t){if(!X[t])throw new Error('invalid async handle: '+e);X[t]=null}}},j=z(e=>{return class extends e{static createProperties(e){const t=this.prototype;for(let n in e)n in t||t._createPropertyAccessor(n)}static attributeNameForProperty(e){return e.toLowerCase()}static typeForProperty(){}_createPropertyAccessor(e,t){this._addPropertyToAttributeMap(e),this.hasOwnProperty('__dataHasAccessor')||(this.__dataHasAccessor=Object.assign({},this.__dataHasAccessor)),this.__dataHasAccessor[e]||(this.__dataHasAccessor[e]=!0,this._definePropertyAccessor(e,t))}_addPropertyToAttributeMap(e){if(this.hasOwnProperty('__dataAttributes')||(this.__dataAttributes=Object.assign({},this.__dataAttributes)),!this.__dataAttributes[e]){const t=this.constructor.attributeNameForProperty(e);this.__dataAttributes[t]=e}}_definePropertyAccessor(e,t){Object.defineProperty(this,e,{get(){return this._getProperty(e)},set:t?function(){}:function(t){this._setProperty(e,t)}})}constructor(){super(),this.__dataEnabled=!1,this.__dataReady=!1,this.__dataInvalid=!1,this.__data={},this.__dataPending=null,this.__dataOld=null,this.__dataInstanceProps=null,this.__serializing=!1,this._initializeProperties()}ready(){this.__dataReady=!0,this._flushProperties()}_initializeProperties(){for(let e in this.__dataHasAccessor)this.hasOwnProperty(e)&&(this.__dataInstanceProps=this.__dataInstanceProps||{},this.__dataInstanceProps[e]=this[e],delete this[e])}_initializeInstanceProperties(e){Object.assign(this,e)}_setProperty(e,t){this._setPendingProperty(e,t)&&this._invalidateProperties()}_getProperty(e){return this.__data[e]}_setPendingProperty(e,t){let n=this.__data[e],i=this._shouldPropertyChange(e,t,n);return i&&(!this.__dataPending&&(this.__dataPending={},this.__dataOld={}),this.__dataOld&&!(e in this.__dataOld)&&(this.__dataOld[e]=n),this.__data[e]=t,this.__dataPending[e]=t),i}_invalidateProperties(){!this.__dataInvalid&&this.__dataReady&&(this.__dataInvalid=!0,Y.run(()=>{this.__dataInvalid&&(this.__dataInvalid=!1,this._flushProperties())}))}_enableProperties(){this.__dataEnabled||(this.__dataEnabled=!0,this.__dataInstanceProps&&(this._initializeInstanceProperties(this.__dataInstanceProps),this.__dataInstanceProps=null),this.ready())}_flushProperties(){const e=this.__data,t=this.__dataPending,n=this.__dataOld;this._shouldPropertiesChange(e,t,n)&&(this.__dataPending=null,this.__dataOld=null,this._propertiesChanged(e,t,n))}_shouldPropertiesChange(e,t){return!!t}_propertiesChanged(){}_shouldPropertyChange(e,t,n){return n!==t&&(n===n||t===t)}attributeChangedCallback(e,t,n,i){t!==n&&this._attributeToProperty(e,n),super.attributeChangedCallback&&super.attributeChangedCallback(e,t,n,i)}_attributeToProperty(e,t,n){if(!this.__serializing){const i=this.__dataAttributes,d=i&&i[e]||e;this[d]=this._deserializeValue(t,n||this.constructor.typeForProperty(d))}}_propertyToAttribute(e,t,n){this.__serializing=!0,n=3>arguments.length?this[e]:n,this._valueToNodeAttribute(this,n,t||this.constructor.attributeNameForProperty(e)),this.__serializing=!1}_valueToNodeAttribute(e,t,n){const i=this._serializeValue(t);void 0===i?e.removeAttribute(n):e.setAttribute(n,i)}_serializeValue(e){switch(typeof e){case'boolean':return e?'':void 0;default:return null==e?void 0:e.toString();}}_deserializeValue(e,t){return t===Boolean?null!==e:t===Number?+e:e}}}),J=z(e=>{function n(e){const t=Object.getPrototypeOf(e);return t.prototype instanceof a?t:null}function i(e){if(!e.hasOwnProperty(JSCompiler_renameProperty('__ownProperties',e))){let n=null;e.hasOwnProperty(JSCompiler_renameProperty('properties',e))&&e.properties&&(n=t(e.properties)),e.__ownProperties=n}return e.__ownProperties}const d=j(e);class a extends d{static get observedAttributes(){const e=this._properties;return e?Object.keys(e).map(e=>this.attributeNameForProperty(e)):[]}static finalize(){if(!this.hasOwnProperty(JSCompiler_renameProperty('__finalized',this))){const e=n(this);e&&e.finalize(),this.__finalized=!0,this._finalizeClass()}}static _finalizeClass(){const e=i(this);e&&this.createProperties(e)}static get _properties(){if(!this.hasOwnProperty(JSCompiler_renameProperty('__properties',this))){const e=n(this);this.__properties=Object.assign({},e&&e._properties,i(this))}return this.__properties}static typeForProperty(e){const t=this._properties[e];return t&&t.type}_initializeProperties(){this.constructor.finalize(),super._initializeProperties()}connectedCallback(){super.connectedCallback&&super.connectedCallback(),this._enableProperties()}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback()}}return a}),U=new Map;class K{constructor(e,t,n,i=le){this.strings=e,this.values=t,this.type=n,this.partCallback=i}getHTML(){const e=this.strings.length-1;let t='',n=!0;for(let a=0;a<e;a++){const e=this.strings[a];t+=e;const i=d(e);n=-1<i?i<e.length:n,t+=n?Z:$}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement('template');return e.innerHTML=this.getHTML(),e}}const $=`{{lit-${(Math.random()+'').slice(2)}}}`,Z=`<!--${$}-->`,Q=new RegExp(`${$}|${Z}`),ee=/[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;class te{constructor(e,t,n,i,d){this.type=e,this.index=t,this.name=n,this.rawName=i,this.strings=d}}class ne{constructor(e,t){this.parts=[],this.element=t;const n=this.element.content,i=document.createTreeWalker(n,133,null,!1);let d=-1,a=0;const s=[];for(let n,o;i.nextNode();){d++,n=o;const t=o=i.currentNode;if(1===t.nodeType){if(!t.hasAttributes())continue;const n=t.attributes;let s=0;for(let e=0;e<n.length;e++)0<=n[e].value.indexOf($)&&s++;for(;0<s--;){const i=e.strings[a],s=ee.exec(i)[1],o=n.getNamedItem(s),r=o.value.split(Q);this.parts.push(new te('attribute',d,o.name,s,r)),t.removeAttribute(o.name),a+=r.length-1}}else if(3===t.nodeType){const e=t.nodeValue;if(0>e.indexOf($))continue;const n=t.parentNode,o=e.split(Q),r=o.length-1;a+=r;for(let e=0;e<r;e++)n.insertBefore(''===o[e]?document.createComment(''):document.createTextNode(o[e]),t),this.parts.push(new te('node',d++));n.insertBefore(''===o[r]?document.createComment(''):document.createTextNode(o[r]),t),s.push(t)}else if(8===t.nodeType&&t.nodeValue===$){const e=t.parentNode,i=t.previousSibling;null===i||i!==n||i.nodeType!==Node.TEXT_NODE?e.insertBefore(document.createComment(''),t):d--,this.parts.push(new te('node',d++)),s.push(t),null===t.nextSibling?e.insertBefore(document.createComment(''),t):d--,o=n,a++}}for(const i of s)i.parentNode.removeChild(i)}}const ie=(e,t)=>de(t)?(t=t(e),ae):null===t?void 0:t,de=e=>'function'==typeof e&&!0===e.__litDirective,ae={},se=e=>null===e||'object'!=typeof e&&'function'!=typeof e;class oe{constructor(e,t,n,i){this.instance=e,this.element=t,this.name=n,this.strings=i,this.size=i.length-1,this._previousValues=[]}_interpolate(e,t){const n=this.strings,d=n.length-1;let a='';for(let s=0;s<d;s++){a+=n[s];const i=ie(this,e[t+s]);if(i&&i!==ae&&(Array.isArray(i)||'string'!=typeof i&&i[Symbol.iterator]))for(const e of i)a+=e;else a+=i}return a+n[d]}_equalToPreviousValues(e,t){for(let n=t;n<t+this.size;n++)if(this._previousValues[n]!==e[n]||!se(e[n]))return!1;return!0}setValue(e,t){if(this._equalToPreviousValues(e,t))return;const n=this.strings;let i;2===n.length&&''===n[0]&&''===n[1]?(i=ie(this,e[t]),Array.isArray(i)&&(i=i.join(''))):i=this._interpolate(e,t),i!==ae&&this.element.setAttribute(this.name,i),this._previousValues=e}}class re{constructor(e,t,n){this.instance=e,this.startNode=t,this.endNode=n,this._previousValue=void 0}setValue(e){if(e=ie(this,e),e!==ae)if(se(e)){if(e===this._previousValue)return;this._setText(e)}else e instanceof K?this._setTemplateResult(e):Array.isArray(e)||e[Symbol.iterator]?this._setIterable(e):e instanceof Node?this._setNode(e):void 0===e.then?this._setText(e):this._setPromise(e)}_insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}_setNode(e){this._previousValue===e||(this.clear(),this._insert(e),this._previousValue=e)}_setText(e){const t=this.startNode.nextSibling;e=void 0===e?'':e,t===this.endNode.previousSibling&&t.nodeType===Node.TEXT_NODE?t.textContent=e:this._setNode(document.createTextNode(e)),this._previousValue=e}_setTemplateResult(e){const t=this.instance._getTemplate(e);let n;this._previousValue&&this._previousValue.template===t?n=this._previousValue:(n=new ce(t,this.instance._partCallback,this.instance._getTemplate),this._setNode(n._clone()),this._previousValue=n),n.update(e.values)}_setIterable(e){Array.isArray(this._previousValue)||(this.clear(),this._previousValue=[]);const t=this._previousValue;let n=0;for(const i of e){let e=t[n];if(void 0===e){let i=this.startNode;if(0<n){const e=t[n-1];i=e.endNode=document.createTextNode(''),this._insert(i)}e=new re(this.instance,i,this.endNode),t.push(e)}e.setValue(i),n++}if(0==n)this.clear(),this._previousValue=void 0;else if(n<t.length){const e=t[n-1];t.length=n,this.clear(e.endNode.previousSibling),e.endNode=this.endNode}}_setPromise(e){this._previousValue=e,e.then(t=>{this._previousValue===e&&this.setValue(t)})}clear(e=this.startNode){he(this.startNode.parentNode,e.nextSibling,this.endNode)}}const le=(e,t,n)=>{if('attribute'===t.type)return new oe(e,n,t.name,t.strings);if('node'===t.type)return new re(e,n,n.nextSibling);throw new Error(`Unknown part type ${t.type}`)};class ce{constructor(e,t,n){this._parts=[],this.template=e,this._partCallback=t,this._getTemplate=n}update(e){let t=0;for(const n of this._parts)void 0===n.size?(n.setValue(e[t]),t++):(n.setValue(e,t),t+=n.size)}_clone(){const e=document.importNode(this.template.element.content,!0),t=this.template.parts;if(0<t.length){const n=document.createTreeWalker(e,133,null,!1);let i=-1;for(let e=0;e<t.length;e++){const d=t[e];for(;i<d.index;)i++,n.nextNode();this._parts.push(this._partCallback(this,d,n.currentNode))}}return e}}const he=(e,t,n=null)=>{for(let i=t;i!==n;){const t=i.nextSibling;e.removeChild(i),i=t}},ue=e=>t=>{const n=`${t.type}--${e}`;let i=U.get(n);void 0===i&&(i=new Map,U.set(n,i));let d=i.get(t.strings);if(void 0===d){const n=t.getTemplateElement();'object'==typeof window.ShadyCSS&&window.ShadyCSS.prepareTemplate(n,e),d=new ne(t,n),i.set(t.strings,d)}return d},_e=(e,...t)=>new K(e,t,'html',pe),pe=(e,t,n)=>{if('attribute'===t.type){if('on-'===t.rawName.substr(0,3)){const i=t.rawName.slice(3);return new fe(e,n,i)}const i=t.name.substr(t.name.length-1);if('$'===i){const i=t.name.slice(0,-1);return new oe(e,n,i,t.strings)}if('?'===i){const i=t.name.slice(0,-1);return new ge(e,n,i,t.strings)}return new me(e,n,t.rawName,t.strings)}return le(e,t,n)};class ge extends oe{setValue(e,t){const n=this.strings;if(2===n.length&&''===n[0]&&''===n[1]){const n=ie(this,e[t]);if(n===ae)return;n?this.element.setAttribute(this.name,''):this.element.removeAttribute(this.name)}else throw new Error('boolean attributes can only contain a single expression')}}class me extends oe{setValue(e,t){const n=this.strings;let i;this._equalToPreviousValues(e,t)||(i=2===n.length&&''===n[0]&&''===n[1]?ie(this,e[t]):this._interpolate(e,t),i!==ae&&(this.element[this.name]=i),this._previousValues=e)}}class fe{constructor(e,t,n){this.instance=e,this.element=t,this.eventName=n}setValue(e){const t=ie(this,e);t===this._listener||(null==t?this.element.removeEventListener(this.eventName,this):null==this._listener&&this.element.addEventListener(this.eventName,this),this._listener=t)}handleEvent(e){'function'==typeof this._listener?this._listener.call(this.element,e):'function'==typeof this._listener.handleEvent&&this._listener.handleEvent(e)}}class ve extends J(HTMLElement){constructor(){super(...arguments),this.__renderComplete=null,this.__resolveRenderComplete=null,this.__isInvalid=!1,this.__isChanging=!1}ready(){this._root=this._createRoot(),super.ready(),this._firstRendered()}_firstRendered(){}_createRoot(){return this.attachShadow({mode:'open'})}_shouldPropertiesChange(e,t,n){const i=this._shouldRender(e,t,n);return!i&&this.__resolveRenderComplete&&this.__resolveRenderComplete(!1),i}_shouldRender(){return!0}_propertiesChanged(e,t,n){super._propertiesChanged(e,t,n);const i=this._render(e);i&&void 0!==this._root&&this._applyRender(i,this._root),this._didRender(e,t,n),this.__resolveRenderComplete&&this.__resolveRenderComplete(!0)}_flushProperties(){this.__isChanging=!0,this.__isInvalid=!1,super._flushProperties(),this.__isChanging=!1}_shouldPropertyChange(e,t,n){const i=super._shouldPropertyChange(e,t,n);return i&&this.__isChanging&&console.trace(`Setting properties in response to other properties changing `+`considered harmful. Setting '${e}' from `+`'${this._getProperty(e)}' to '${t}'.`),i}_render(){throw new Error('_render() not implemented')}_applyRender(e,t){a(e,t,this.localName)}_didRender(){}_requestRender(){this._invalidateProperties()}_invalidateProperties(){this.__isInvalid=!0,super._invalidateProperties()}get renderComplete(){return this.__renderComplete||(this.__renderComplete=new Promise(e=>{this.__resolveRenderComplete=t=>{this.__resolveRenderComplete=this.__renderComplete=null,e(t)}}),!this.__isInvalid&&this.__resolveRenderComplete&&Promise.resolve().then(()=>this.__resolveRenderComplete(!1))),this.__renderComplete}}const be=2,ye=.85;class Ce{constructor(){this.p=''}get value(){return this.p.trim()}moveTo(e,t){this.p+='M '+e+' '+t+' '}bcurveTo(e,t,n,i,d,a){this.p+='C '+e+' '+t+', '+n+' '+i+', '+d+' '+a+' '}}const we=new class{_svgNode(e,t){const i=document.createElementNS('http://www.w3.org/2000/svg',e);if(t)for(const e in t)t.hasOwnProperty(e)&&i.setAttributeNS(null,e,t[e]);return i}line(e,t,n,i,d){const a=this._line(t,n,i,d),s=this._svgNode('path',{d:a.value});return e.appendChild(s),s}rectangle(e,t,n,i,d){t+=2,n+=2,i-=4,d-=4;let a=this._line(t,n,t+i,n);a=this._line(t+i,n,t+i,n+d,a),a=this._line(t+i,n+d,t,n+d,a),a=this._line(t,n+d,t,n,a);const s=this._svgNode('path',{d:a.value});return e.appendChild(s),s}polygon(e,t){let n=null;const d=t.length;if(2<d)for(let e,a=0;2>a;a++){e=!0;for(let a=1;a<d;a++)n=this._continuousLine(t[a-1][0],t[a-1][1],t[a][0],t[a][1],e,0<a,n),e=!1;n=this._continuousLine(t[d-1][0],t[d-1][1],t[0][0],t[0][1],e,0<a,n)}else n=2==d?this._line(t[0][0],t[0][1],t[1][0],t[1][1]):new Ce;const i=this._svgNode('path',{d:n.value});return e.appendChild(i),i}ellipse(e,t,n,i,d){i=H(10<i?i-4:i-1,1),d=H(10<d?d-4:d-1,1);const a=2*B/9;let s=V(i/2),o=V(d/2);s+=this._getOffset(.05*-s,.05*s),o+=this._getOffset(.05*-o,.05*o);let r=this._ellipse(a,t,n,s,o,1,a*this._getOffset(.1,this._getOffset(.4,1)));r=this._ellipse(a,t,n,s,o,1.5,0,r);const l=this._svgNode('path',{d:r.value});return e.appendChild(l),l}_ellipse(e,t,n,i,d,a,s,o){var r=Math.sin,l=Math.cos;const c=this._getOffset(-.5,.5)-B/2,h=[];h.push([this._getOffset(-a,a)+t+.9*i*l(c-e),this._getOffset(-a,a)+n+.9*d*r(c-e)]);for(let u=c;u<2*B+c-.01;u+=e)h.push([this._getOffset(-a,a)+t+i*l(u),this._getOffset(-a,a)+n+d*r(u)]);return h.push([this._getOffset(-a,a)+t+i*l(c+2*B+.5*s),this._getOffset(-a,a)+n+d*r(c+2*B+.5*s)]),h.push([this._getOffset(-a,a)+t+.98*i*l(c+s),this._getOffset(-a,a)+n+.98*d*r(c+s)]),h.push([this._getOffset(-a,a)+t+.9*i*l(c+.5*s),this._getOffset(-a,a)+n+.9*d*r(c+.5*s)]),this._curve(h,o)}_getOffset(e,t){return 1*(Math.random()*(t-e)+e)}_line(e,t,n,i,d){const a=S(e-n,2)+S(t-i,2);let s=be;100*(s*s)>a&&(s=A(a)/10);const o=s/2,r=.2+.2*Math.random();let l=ye*be*(i-t)/200,c=ye*be*(e-n)/200;l=this._getOffset(-l,l),c=this._getOffset(-c,c);let h=d||new Ce;return h.moveTo(e+this._getOffset(-s,s),t+this._getOffset(-s,s)),h.bcurveTo(l+e+(n-e)*r+this._getOffset(-s,s),c+t+(i-t)*r+this._getOffset(-s,s),l+e+2*(n-e)*r+this._getOffset(-s,s),c+t+2*(i-t)*r+this._getOffset(-s,s),n+this._getOffset(-s,s),i+this._getOffset(-s,s)),h.moveTo(e+this._getOffset(-o,o),t+this._getOffset(-o,o)),h.bcurveTo(l+e+(n-e)*r+this._getOffset(-o,o),c+t+(i-t)*r+this._getOffset(-o,o),l+e+2*(n-e)*r+this._getOffset(-o,o),c+t+2*(i-t)*r+this._getOffset(-o,o),n+this._getOffset(-o,o),i+this._getOffset(-o,o)),h}_continuousLine(e,t,n,i,d,a,s){s=s||new Ce;const o=S(e-n,2)+S(t-i,2);let r=be;100*(r*r)>o&&(r=A(o)/10);const l=r/2,c=.2+.2*Math.random();let h=ye*be*(i-t)/200,u=ye*be*n/200;return h=this._getOffset(-h,h),u=this._getOffset(-u,u),d&&s.moveTo(e+this._getOffset(-r,r),t+this._getOffset(-r,r)),a?s.bcurveTo(h+e+(n-e)*c+this._getOffset(-l,l),u+t+(i-t)*c+this._getOffset(-l,l),h+e+2*(n-e)*c+this._getOffset(-l,l),u+t+2*(i-t)*c+this._getOffset(-l,l),n+this._getOffset(-l,l),i+this._getOffset(-l,l)):s.bcurveTo(h+e+(n-e)*c+this._getOffset(-r,r),u+t+(i-t)*c+this._getOffset(-r,r),h+e+2*(n-e)*c+this._getOffset(-r,r),u+t+2*(i-t)*c+this._getOffset(-r,r),n+this._getOffset(-r,r),i+this._getOffset(-r,r)),s}_curve(e,t){const n=e.length;let d=t||new Ce;if(3<n){const t=[];d.moveTo(e[1][0],e[1][1]);for(let a=1;a+2<n;a++){const n=e[a];t[0]=[n[0],n[1]],t[1]=[n[0]+(1*e[a+1][0]-1*e[a-1][0])/6,n[1]+(1*e[a+1][1]-1*e[a-1][1])/6],t[2]=[e[a+1][0]+(1*e[a][0]-1*e[a+2][0])/6,e[a+1][1]+(1*e[a][1]-1*e[a+2][1])/6],t[3]=[e[a+1][0],e[a+1][1]],d.bcurveTo(t[1][0],t[1][1],t[2][0],t[2][1],t[3][0],t[3][1])}}else 3===n?(d.moveTo(e[0][0],e[0][1]),d.bcurveTo(e[1][0],e[1][1],e[2][0],e[2][1],e[2][0],e[2][1])):2==n&&(d=this._line(e[0][0],e[0][1],e[1][0],e[1][1],d));return d}};class xe extends ve{static get properties(){return{elevation:Number,disabled:Boolean}}constructor(){super(),this.elevation=1,this.disabled=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({text:e,elevation:t,disabled:n}){return this._onDisableChange(),_e`
    <style>
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
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(:active) path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        background: rgba(0, 0, 0, 0.07);
        cursor: default;
        pointer-events: none;
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
    </style>
    <slot></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}connectedCallback(){super.connectedCallback(),setTimeout(()=>this._didRender())}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t=this.getBoundingClientRect(),n=P(H(1,this.elevation),5),d=t.width+2*(n-1),a=t.height+2*(n-1);e.setAttribute('width',d),e.setAttribute('height',a),we.rectangle(e,0,0,t.width,t.height);for(var s=1;s<n;s++)we.line(e,2*s,t.height+2*s,t.width+2*s,t.height+2*s).style.opacity=(75-10*s)/100,we.line(e,t.width+2*s,t.height+2*s,t.width+2*s,2*s).style.opacity=(75-10*s)/100,we.line(e,2*s,t.height+2*s,t.width+2*s,t.height+2*s).style.opacity=(75-10*s)/100,we.line(e,t.width+2*s,t.height+2*s,t.width+2*s,2*s).style.opacity=(75-10*s)/100;this.classList.remove('pending')}}customElements.define('wired-button',xe);class ke extends ve{static get properties(){return{elevation:Number}}constructor(){super(),this.elevation=1}_createRoot(){const e=this.attachShadow({mode:'open'});return this.classList.add('pending'),e}_render(){return _e`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
      }
    
      :host(.pending) {
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
    </style>
    <div>
      <slot on-slotchange="${()=>this._requestRender()}"></slot>
    </div>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}connectedCallback(){super.connectedCallback(),setTimeout(()=>this._didRender())}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);var t=this.getBoundingClientRect(),n=P(H(1,this.elevation),5),d=t.width+2*(n-1),a=t.height+2*(n-1);e.setAttribute('width',d),e.setAttribute('height',a),we.rectangle(e,0,0,t.width,t.height);for(var s=1;s<n;s++)we.line(e,2*s,t.height+2*s,t.width+2*s,t.height+2*s).style.opacity=(85-10*s)/100,we.line(e,t.width+2*s,t.height+2*s,t.width+2*s,2*s).style.opacity=(85-10*s)/100,we.line(e,2*s,t.height+2*s,t.width+2*s,t.height+2*s).style.opacity=(85-10*s)/100,we.line(e,t.width+2*s,t.height+2*s,t.width+2*s,2*s).style.opacity=(85-10*s)/100;this.classList.remove('pending')}}customElements.define('wired-card',ke);class Ne extends ve{static get properties(){return{checked:Boolean,text:String,disabled:Boolean}}constructor(){super(),this.disabled=!1,this.checked=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({text:e,iconsize:t}){return this._onDisableChange(),_e`
    <style>
      :host {
        display: block;
        font-family: inherit;
        outline: none;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
      }
    
      :host(.pending) {
        opacity: 0;
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
    </style>
    <div id="container" on-click="${()=>this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${e}</div>
    </div>
    `}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_toggleCheck(){this.checked=!this.checked&&1;const e=new CustomEvent('change',{bubbles:!0,composed:!0,checked:this.checked,detail:{checked:this.checked}});this.dispatchEvent(e)}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t={width:24,height:24};e.setAttribute('width',t.width),e.setAttribute('height',t.height),we.rectangle(e,0,0,t.width,t.height);const n=[];n.push(we.line(e,.3*t.width,.4*t.height,.5*t.width,.7*t.height)),n.push(we.line(e,.5*t.width,.7*t.height,t.width+5,-5)),n.forEach(e=>{e.style.strokeWidth=2.5}),this.checked?n.forEach(e=>{e.style.display=''}):n.forEach(e=>{e.style.display='none'}),this.classList.remove('pending')}}customElements.define('wired-checkbox',Ne);class Ee extends ve{static get properties(){return{text:String,value:String}}_render({text:e}){return _e`
    <style>
      :host {
        display: block;
        padding: 8px;
        font-family: inherit;
      }
    </style>
    <span>${e}</span>
    `}connectedCallback(){super.connectedCallback(),this._itemClickHandler=e=>{this._onClick(e)},this.addEventListener('click',this._itemClickHandler)}disconnectedCallback(){super.disconnectedCallback(),this._itemClickHandler&&(this.removeEventListener('click',this._itemClickHandler),this._itemClickHandler=null)}_onClick(){const e=new CustomEvent('item-click',{bubbles:!0,composed:!0,detail:{text:this.text,value:this.value}});this.dispatchEvent(e)}}customElements.define('wired-item',Ee);class Te extends ve{static get properties(){return{value:Object,selected:String,disabled:Boolean}}constructor(){super(),this.disabled=!1,this._cardShowing=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({value:e}){return this._onDisableChange(),_e`
    <style>
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
      }
    
      :host(.disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
    
      :host(.pending) {
        opacity: 0;
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
        cursor: pointer;
        white-space: nowrap;
      }
    
      ::slotted(wired-item:hover) {
        background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
      }
    </style>
    <div id="container" on-click="${t=>this._onCombo(t)}">
      <div id="textPanel" class="inline">
        <span>${e&&e.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" on-item-click="${t=>this._onItemClick(t)}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_firstRendered(){this._refreshSelection()}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t=this.shadowRoot.getElementById('container').getBoundingClientRect();e.setAttribute('width',t.width),e.setAttribute('height',t.height);const n=this.shadowRoot.getElementById('textPanel').getBoundingClientRect();this.shadowRoot.getElementById('dropPanel').style.minHeight=n.height+'px',we.rectangle(e,0,0,n.width,n.height);const i=n.width-4;we.rectangle(e,i,0,34,n.height);const d=H(0,V((n.height-24)/2)),a=we.polygon(e,[[i+8,5+d],[i+26,5+d],[i+17,d+P(n.height,18)]]);a.style.fill='currentColor',a.style.pointerEvents=this.disabled?'none':'auto',a.style.cursor='pointer',this.classList.remove('pending')}_refreshSelection(){const e=this.shadowRoot.getElementById('slot'),t=e.assignedNodes();if(t){let e=null;for(let n=0;n<t.length;n++)if('WIRED-ITEM'===t[n].tagName){const i=t[n].value||'';if(this.selected&&i===this.selected){e=t[n];break}}this.value=e?{value:e.value,text:e.text}:null}}_onCombo(e){e.stopPropagation(),this._setCardShowing(!this._cardShowing)}_setCardShowing(e){this._cardShowing=e;const t=this.shadowRoot.getElementById('card');t.style.display=e?'':'none',e&&setTimeout(()=>{t._requestRender()},10)}_onItemClick(e){e.stopPropagation(),this._setCardShowing(!1),this.selected=e.detail.value,this._refreshSelection();const t=new CustomEvent('selected',{bubbles:!0,composed:!0,checked:this.checked,detail:{selected:this.selected}});this.dispatchEvent(t)}}customElements.define('wired-combo',Te);const Le=new Map;class Re{constructor(e,t,n,i=Xe){this.strings=e,this.values=t,this.type=n,this.partCallback=i}getHTML(){const e=this.strings.length-1;let t='',n=!0;for(let d=0;d<e;d++){const e=this.strings[d];t+=e;const i=r(e);n=-1<i?i<e.length:n,t+=n?Oe:Ie}return t+=this.strings[e],t}getTemplateElement(){const e=document.createElement('template');return e.innerHTML=this.getHTML(),e}}const Ie=`{{lit-${(Math.random()+'').slice(2)}}}`,Oe=`<!--${Ie}-->`,Pe=new RegExp(`${Ie}|${Oe}`),Ae=/[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;class Se{constructor(e,t,n,i,d){this.type=e,this.index=t,this.name=n,this.rawName=i,this.strings=d}}class Ve{constructor(e,t){this.parts=[],this.element=t;const n=this.element.content,i=document.createTreeWalker(n,133,null,!1);let d=-1,a=0;const s=[];for(let n,o;i.nextNode();){d++,n=o;const t=o=i.currentNode;if(1===t.nodeType){if(!t.hasAttributes())continue;const n=t.attributes;let s=0;for(let e=0;e<n.length;e++)0<=n[e].value.indexOf(Ie)&&s++;for(;0<s--;){const i=e.strings[a],s=Ae.exec(i)[1],o=n.getNamedItem(s),r=o.value.split(Pe);this.parts.push(new Se('attribute',d,o.name,s,r)),t.removeAttribute(o.name),a+=r.length-1}}else if(3===t.nodeType){const e=t.nodeValue;if(0>e.indexOf(Ie))continue;const n=t.parentNode,s=e.split(Pe),o=s.length-1;a+=o,t.textContent=s[o];for(let e=0;e<o;e++)n.insertBefore(document.createTextNode(s[e]),t),this.parts.push(new Se('node',d++))}else if(8===t.nodeType&&t.nodeValue===Ie){const e=t.parentNode,i=t.previousSibling;null===i||i!==n||i.nodeType!==Node.TEXT_NODE?e.insertBefore(document.createTextNode(''),t):d--,this.parts.push(new Se('node',d++)),s.push(t),null===t.nextSibling?e.insertBefore(document.createTextNode(''),t):d--,o=n,a++}}for(const i of s)i.parentNode.removeChild(i)}}const Be=(e,t)=>He(t)?(t=t(e),De):null===t?void 0:t,He=e=>'function'==typeof e&&!0===e.__litDirective,De={},ze=e=>null===e||'object'!=typeof e&&'function'!=typeof e;class We{constructor(e,t,n,i){this.instance=e,this.element=t,this.name=n,this.strings=i,this.size=i.length-1,this._previousValues=[]}_interpolate(e,t){const n=this.strings,d=n.length-1;let a='';for(let s=0;s<d;s++){a+=n[s];const i=Be(this,e[t+s]);if(i&&i!==De&&(Array.isArray(i)||'string'!=typeof i&&i[Symbol.iterator]))for(const e of i)a+=e;else a+=i}return a+n[d]}_equalToPreviousValues(e,t){for(let n=t;n<t+this.size;n++)if(this._previousValues[n]!==e[n]||!ze(e[n]))return!1;return!0}setValue(e,t){if(this._equalToPreviousValues(e,t))return;const n=this.strings;let i;2===n.length&&''===n[0]&&''===n[1]?(i=Be(this,e[t]),Array.isArray(i)&&(i=i.join(''))):i=this._interpolate(e,t),i!==De&&this.element.setAttribute(this.name,i),this._previousValues=e}}class Me{constructor(e,t,n){this.instance=e,this.startNode=t,this.endNode=n,this._previousValue=void 0}setValue(e){if(e=Be(this,e),e!==De)if(ze(e)){if(e===this._previousValue)return;this._setText(e)}else e instanceof Re?this._setTemplateResult(e):Array.isArray(e)||e[Symbol.iterator]?this._setIterable(e):e instanceof Node?this._setNode(e):void 0===e.then?this._setText(e):this._setPromise(e)}_insert(e){this.endNode.parentNode.insertBefore(e,this.endNode)}_setNode(e){this._previousValue===e||(this.clear(),this._insert(e),this._previousValue=e)}_setText(e){const t=this.startNode.nextSibling;e=void 0===e?'':e,t===this.endNode.previousSibling&&t.nodeType===Node.TEXT_NODE?t.textContent=e:this._setNode(document.createTextNode(e)),this._previousValue=e}_setTemplateResult(e){const t=this.instance._getTemplate(e);let n;this._previousValue&&this._previousValue.template===t?n=this._previousValue:(n=new Fe(t,this.instance._partCallback,this.instance._getTemplate),this._setNode(n._clone()),this._previousValue=n),n.update(e.values)}_setIterable(e){Array.isArray(this._previousValue)||(this.clear(),this._previousValue=[]);const t=this._previousValue;let n=0;for(const i of e){let e=t[n];if(void 0===e){let i=this.startNode;if(0<n){const e=t[n-1];i=e.endNode=document.createTextNode(''),this._insert(i)}e=new Me(this.instance,i,this.endNode),t.push(e)}e.setValue(i),n++}if(0==n)this.clear(),this._previousValue=void 0;else if(n<t.length){const e=t[n-1];t.length=n,this.clear(e.endNode.previousSibling),e.endNode=this.endNode}}_setPromise(e){this._previousValue=e,e.then(t=>{this._previousValue===e&&this.setValue(t)})}clear(e=this.startNode){qe(this.startNode.parentNode,e.nextSibling,this.endNode)}}const Xe=(e,t,n)=>{if('attribute'===t.type)return new We(e,n,t.name,t.strings);if('node'===t.type)return new Me(e,n,n.nextSibling);throw new Error(`Unknown part type ${t.type}`)};class Fe{constructor(e,t,n){this._parts=[],this.template=e,this._partCallback=t,this._getTemplate=n}update(e){let t=0;for(const n of this._parts)void 0===n.size?(n.setValue(e[t]),t++):(n.setValue(e,t),t+=n.size)}_clone(){const e=document.importNode(this.template.element.content,!0),t=this.template.parts;if(0<t.length){const n=document.createTreeWalker(e,133,null,!1);let i=-1;for(let e=0;e<t.length;e++){const d=t[e];for(;i<d.index;)i++,n.nextNode();this._parts.push(this._partCallback(this,d,n.currentNode))}}return e}}const qe=(e,t,n=null)=>{for(let i=t;i!==n;){const t=i.nextSibling;e.removeChild(i),i=t}},Ge=e=>t=>{const n=`${t.type}--${e}`;let i=Le.get(n);void 0===i&&(i=new Map,Le.set(n,i));let d=i.get(t.strings);if(void 0===d){const n=t.getTemplateElement();'object'==typeof window.ShadyCSS&&window.ShadyCSS.prepareTemplate(n,e),d=new Ve(t,n),i.set(t.strings,d)}return d},Ye=(e,...t)=>new Re(e,t,'html',je),je=(e,t,n)=>{if('attribute'===t.type){if(t.rawName.startsWith('on-')){const i=t.rawName.slice(3);return new Ke(e,n,i)}if(t.name.endsWith('$')){const i=t.name.slice(0,-1);return new We(e,n,i,t.strings)}if(t.name.endsWith('?')){const i=t.name.slice(0,-1);return new Je(e,n,i,t.strings)}return new Ue(e,n,t.rawName,t.strings)}return Xe(e,t,n)};class Je extends We{setValue(e,t){const n=this.strings;if(2===n.length&&''===n[0]&&''===n[1]){const n=Be(this,e[t]);if(n===De)return;n?this.element.setAttribute(this.name,''):this.element.removeAttribute(this.name)}else throw new Error('boolean attributes can only contain a single expression')}}class Ue extends We{setValue(e,t){const n=this.strings;let i;this._equalToPreviousValues(e,t)||(i=2===n.length&&''===n[0]&&''===n[1]?Be(this,e[t]):this._interpolate(e,t),i!==De&&(this.element[this.name]=i),this._previousValues=e)}}class Ke{constructor(e,t,n){this.instance=e,this.element=t,this.eventName=n}setValue(e){const t=Be(this,e),n=this._listener;t===n||(this._listener=t,null!=n&&this.element.removeEventListener(this.eventName,n),null!=t&&this.element.addEventListener(this.eventName,t))}}class $e extends J(HTMLElement){constructor(){super(...arguments),this.__renderComplete=null,this.__resolveRenderComplete=null,this.__isInvalid=!1,this.__isChanging=!1}ready(){this._root=this._createRoot(),super.ready(),this._firstRendered()}_firstRendered(){}_createRoot(){return this.attachShadow({mode:'open'})}_shouldPropertiesChange(e,t,n){const i=this._shouldRender(e,t,n);return!i&&this.__resolveRenderComplete&&this.__resolveRenderComplete(!1),i}_shouldRender(){return!0}_propertiesChanged(e,t,n){super._propertiesChanged(e,t,n);const i=this._render(e);i&&void 0!==this._root&&this._applyRender(i,this._root),this._didRender(e,t,n),this.__resolveRenderComplete&&this.__resolveRenderComplete(!0)}_flushProperties(){this.__isChanging=!0,this.__isInvalid=!1,super._flushProperties(),this.__isChanging=!1}_shouldPropertyChange(e,t,n){const i=super._shouldPropertyChange(e,t,n);return i&&this.__isChanging&&console.trace(`Setting properties in response to other properties changing `+`considered harmful. Setting '${e}' from `+`'${this._getProperty(e)}' to '${t}'.`),i}_render(){throw new Error('render() not implemented')}_applyRender(e,t){l(e,t,this.localName)}_didRender(){}_requestRender(){this._invalidateProperties()}_invalidateProperties(){this.__isInvalid=!0,super._invalidateProperties()}get renderComplete(){return this.__renderComplete||(this.__renderComplete=new Promise(e=>{this.__resolveRenderComplete=t=>{this.__resolveRenderComplete=this.__renderComplete=null,e(t)}}),!this.__isInvalid&&this.__resolveRenderComplete&&Promise.resolve().then(()=>this.__resolveRenderComplete(!1))),this.__renderComplete}}const Ze=Ye`<style>:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga';-webkit-font-smoothing:antialiased}
</style>`,Qe=document.createElement('link');Qe.rel='stylesheet',Qe.href='https://fonts.googleapis.com/icon?family=Material+Icons',document.head.appendChild(Qe);customElements.define('mwc-icon',class extends $e{_renderStyle(){return Ze}_render(){return Ye`${this._renderStyle()}<slot></slot>`}});class et extends ve{static get properties(){return{disabled:Boolean}}constructor(){super(),this.disabled=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render(){return this._onDisableChange(),_e`
    <style>
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
        outline: none;
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
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 50%;
        pointer-events: none;
      }
    
      :host(:active) path {
        transform: scale(0.96) translate(2%, 2%);
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
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <mwc-icon>
      <slot></slot>
    </mwc-icon>
    `}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t=this.getBoundingClientRect(),n=P(t.width,t.height);e.setAttribute('width',n),e.setAttribute('height',n),we.ellipse(e,n/2,n/2,n,n),this.classList.remove('pending')}connectedCallback(){super.connectedCallback(),setTimeout(()=>this._didRender())}}customElements.define('wired-icon-button',et);class tt extends ve{static get properties(){return{placeholder:String,disabled:Boolean,type:String,required:Boolean,autocomplete:String,autofocus:Boolean,minlength:Number,maxlength:Number,min:String,max:String,step:String,readonly:Boolean,size:Number,autocapitalize:String,autocorrect:String,value:String}}constructor(){super(),this.disabled=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({type:e,placeholder:t,disabled:n,required:i,autocomplete:d,autofocus:a,minlength:s,maxlength:o,min:r,max:l,step:c,readonly:h,size:u,autocapitalize:_,autocorrect:p}){return this._onDisableChange(),_e`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: sans-serif;
        width: 150px;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
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
    </style>
    <input id="txt" type$="${e}" placeholder$="${t}" disabled?="${n}" required?="${i}" autocomplete$="${d}"
      autofocus?="${a}" minlength$="${s}" maxlength$="${o}" min$="${r}" max$="${l}" step$="${c}"
      readonly?="${h}" size$="${u}" autocapitalize$="${_}" autocorrect$="${p}" on-change="${t=>this._onChange(t)}">
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}get input(){return this.shadowRoot.getElementById('txt')}get value(){const e=this.input;return e&&e.value||''}set value(e){if(this.shadowRoot){const t=this.input;t&&(t.value=e)}else this._value=e}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_onChange(e){e.stopPropagation();const t=new CustomEvent(e.type,{bubbles:!0,composed:!0,cancelable:e.cancelable,detail:{sourceEvent:e}});this.dispatchEvent(t)}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t=this.getBoundingClientRect();e.setAttribute('width',t.width),e.setAttribute('height',t.height),we.rectangle(e,0,0,t.width,t.height),this.classList.remove('pending'),'undefined'!=typeof this._value&&(this.input.value=this._value,delete this._value)}}customElements.define('wired-input',tt);class nt extends ve{static get properties(){return{value:Object,selected:String,horizontal:Boolean}}constructor(){super(),this.horizontal=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({horizontal:e}){return e?this.classList.add('horizontal'):this.classList.remove('horizontal'),this._onDisableChange(),_e`
      <style>
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          padding: 5px;
          outline: none;
        }
      
        :host(.pending) {
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
      
        ::slotted(.selected-item) {
          background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
        }
      
        ::slotted(wired-item) {
          cursor: pointer;
          white-space: nowrap;
          display: block;
        }
      
        :host(.horizontal) ::slotted(wired-item) {
          display: inline-block;
        }
      
        ::slotted(wired-item:hover) {
          background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
        }
      </style>
      <slot id="slot"></slot>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>`}connectedCallback(){super.connectedCallback(),this._itemClickHandler=e=>{this._onItemClick(e)},this.addEventListener('item-click',this._itemClickHandler)}disconnectedCallback(){super.disconnectedCallback(),this._itemClickHandler&&(this.removeEventListener('item-click',this._itemClickHandler),this._itemClickHandler=null)}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_firstRendered(){this._refreshSelection()}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t=this.getBoundingClientRect();e.setAttribute('width',t.width),e.setAttribute('height',t.height),we.rectangle(e,0,0,t.width,t.height),this.classList.remove('pending')}_refreshSelection(){this.lastSelectedItem&&this.lastSelectedItem.classList.remove('selected-item');const e=this.shadowRoot.getElementById('slot').assignedNodes();if(e){let t=null;for(let n=0;n<e.length;n++)if('WIRED-ITEM'===e[n].tagName){const i=e[n].value||'';if(this.selected&&i===this.selected){t=e[n];break}}this.lastSelectedItem=t,t?(this.lastSelectedItem.classList.add('selected-item'),this.value={value:t.value,text:t.text}):this.value=null}}_onItemClick(e){e.stopPropagation(),this.selected=e.detail.value,this._refreshSelection();const t=new CustomEvent('selected',{bubbles:!0,composed:!0,checked:this.checked,detail:{selected:this.selected}});this.dispatchEvent(t)}}customElements.define('wired-listbox',nt);class it extends ve{static get properties(){return{value:Number,min:Number,max:Number,percentage:Boolean}}constructor(){super(),this.percentage=!1,this.max=100,this.min=0,this.value=0}_createRoot(){const e=this.attachShadow({mode:'open'});return this.classList.add('pending'),e}_render(){return _e`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 400px;
        height: 42px;
        font-family: sans-serif;
      }
    
      :host(.pending) {
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
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this._getProgressLabel()}</div>
    </div>
    `}_getProgressLabel(){if(this.percentage){if(this.max==this.min)return'%';var e=Math.floor(100*((this.value-this.min)/(this.max-this.min)));return e+'%'}return''+this.value}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);var t=this.getBoundingClientRect();e.setAttribute('width',t.width),e.setAttribute('height',t.height),we.rectangle(e,0,0,t.width,t.height);let n=0;if(this.max>this.min){n=(this.value-this.min)/(this.max-this.min);const i=t.width*H(0,P(n,100)),d=we.polygon(e,[[0,0],[i,0],[i,t.height],[0,t.height]]);d.classList.add('progbox')}this.classList.remove('pending')}}customElements.define('wired-progress',it);class dt extends ve{static get properties(){return{checked:Boolean,name:String,text:String,iconsize:Number,disabled:Boolean}}constructor(){super(),this.disabled=!1,this.checked=!1,this.iconsize=24}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({text:e,iconsize:t}){return this._onDisableChange(),_e`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: inherit;
        width: 150px;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
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
    </style>
    <div id="container" on-click="${()=>this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${e}</div>
    </div>
    `}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_toggleCheck(){this.checked=!this.checked&&1;const e=new CustomEvent('change',{bubbles:!0,composed:!0,checked:this.checked,detail:{checked:this.checked}});this.dispatchEvent(e)}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e),this._dot=null;const t={width:this.iconsize||24,height:this.iconsize||24};e.setAttribute('width',t.width),e.setAttribute('height',t.height),we.ellipse(e,t.width/2,t.height/2,t.width,t.height);const n=H(.6*t.width,5),i=H(.6*t.height,5);this._dot=we.ellipse(e,t.width/2,t.height/2,n,i),this._dot.classList.add('filledPath'),this._dot.style.display=this.checked?'':'none',this.classList.remove('pending')}}customElements.define('wired-radio',dt);class at extends ve{static get properties(){return{selected:String}}_render({selected:e}){return _e`
    <style>
      :host {
        display: inline-block;
      }
    
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    </style>
    <slot id="slot" on-slotchange="${()=>this.slotChange()}"></slot>
    `}constructor(){super(),this._checkListener=this._handleChecked.bind(this)}connectedCallback(){super.connectedCallback(),this.addEventListener('change',this._checkListener)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener('checked',this._checkListener)}_handleChecked(e){const t=e.detail.checked,n=e.target.name;if(!t)e.target.checked=!0;else{this.selected=t&&n||'';const e=new CustomEvent('selected',{bubbles:!0,composed:!0,checked:this.checked,detail:{selected:this.selected}});this.dispatchEvent(e)}}slotChange(){this._requestRender()}_didRender(){const e=this.shadowRoot.getElementById('slot'),t=e.assignedNodes();if(t&&t.length)for(let e=0;e<t.length;e++)if('WIRED-RADIO'===t[e].tagName){const n=t[e].name||'';t[e].checked=!!(this.selected&&n===this.selected)}}}customElements.define('wired-radio-group',at);const st=class e{constructor(){this._asyncModule=null,this._callback=null,this._timer=null}setConfig(e,t){this._asyncModule=e,this._callback=t,this._timer=this._asyncModule.run(()=>{this._timer=null,this._callback()})}cancel(){this.isActive()&&(this._asyncModule.cancel(this._timer),this._timer=null)}flush(){this.isActive()&&(this.cancel(),this._callback())}isActive(){return null!=this._timer}static debounce(t,n,i){return t instanceof e?t.cancel():t=new e,t.setConfig(n,i),t}},ot=!window.ShadyDOM,rt=!window.ShadyCSS||window.ShadyCSS.nativeCss,lt=!window.customElements.polyfillWrapFlushCallback;let ct=function(e){return e.substring(0,e.lastIndexOf('/')+1)}(document.baseURI||window.location.href),ht='string'==typeof document.head.style.touchAction,ut=['mousedown','mousemove','mouseup','click'],_t=[0,1,4,2],pt=function(){try{return 1===new MouseEvent('test',{buttons:1}).buttons}catch(t){return!1}}(),gt=!1;(function(){try{let e=Object.defineProperty({},'passive',{get(){gt=!0}});window.addEventListener('test',null,e),window.removeEventListener('test',null,e)}catch(t){}})();let mt=navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);const ft=[],vt={button:!0,input:!0,keygen:!0,meter:!0,output:!0,textarea:!0,progress:!0,select:!0};let bt=function(e){let t=e.sourceCapabilities;if((!t||t.firesTouchEvents)&&(e.__polymerGesturesHandled={skip:!0},'click'===e.type)){let t=!1,n=e.composedPath&&e.composedPath();if(n)for(let e=0;e<n.length;e++){if(n[e].nodeType===Node.ELEMENT_NODE)if('label'===n[e].localName)ft.push(n[e]);else if(u(n[e])){let i=_(n[e]);for(let e=0;e<i.length;e++)t=t||-1<ft.indexOf(i[e])}if(n[e]===yt.mouse.target)return}if(t)return;e.preventDefault(),e.stopPropagation()}},yt={mouse:{target:null,mouseIgnoreJob:null},touch:{x:0,y:0,id:-1,scrollDecided:!1}};document.addEventListener('touchend',function(t){yt.mouse.mouseIgnoreJob||p(!0);yt.mouse.target=t.composedPath()[0],yt.mouse.mouseIgnoreJob=st.debounce(yt.mouse.mouseIgnoreJob,G.after(2500),function(){p(),yt.mouse.target=null,yt.mouse.mouseIgnoreJob=null})},!!gt&&{passive:!0});const Ct={},wt=[];E({name:'downup',deps:['mousedown','touchstart','touchend'],flow:{start:['mousedown','touchstart'],end:['mouseup','touchend']},emits:['down','up'],info:{movefn:null,upfn:null},reset:function(){b(this.info)},mousedown:function(n){if(!g(n))return;let i=C(n),t=this;v(this.info,function(n){g(n)||(t._fire('up',i,n),b(t.info))},function(n){g(n)&&t._fire('up',i,n),b(t.info)}),this._fire('down',i,n)},touchstart:function(t){this._fire('down',C(t),t.changedTouches[0],t)},touchend:function(t){this._fire('up',C(t),t.changedTouches[0],t)},_fire:function(e,t,n,i){R(t,e,{x:n.clientX,y:n.clientY,sourceEvent:n,preventer:i,prevent:function(t){return I(t)}})}}),E({name:'track',touchAction:'none',deps:['mousedown','touchstart','touchmove','touchend'],flow:{start:['mousedown','touchstart'],end:['mouseup','touchend']},emits:['track'],info:{x:0,y:0,state:'start',started:!1,moves:[],addMove:function(e){2<this.moves.length&&this.moves.shift(),this.moves.push(e)},movefn:null,upfn:null,prevent:!1},reset:function(){this.info.state='start',this.info.started=!1,this.info.moves=[],this.info.x=0,this.info.y=0,this.info.prevent=!1,b(this.info)},hasMovedEnough:function(e,t){if(this.info.prevent)return!1;if(this.info.started)return!0;let n=V(this.info.x-e),i=V(this.info.y-t);return 5<=n||5<=i},mousedown:function(n){if(!g(n))return;let i=C(n),t=this,d=function(n){let e=n.clientX,d=n.clientY;t.hasMovedEnough(e,d)&&(t.info.state=t.info.started?'mouseup'===n.type?'end':'track':'start','start'===t.info.state&&I('tap'),t.info.addMove({x:e,y:d}),!g(n)&&(t.info.state='end',b(t.info)),t._fire(i,n),t.info.started=!0)};v(this.info,d,function(n){t.info.started&&d(n),b(t.info)}),this.info.x=n.clientX,this.info.y=n.clientY},touchstart:function(t){let e=t.changedTouches[0];this.info.x=e.clientX,this.info.y=e.clientY},touchmove:function(n){let e=C(n),t=n.changedTouches[0],i=t.clientX,d=t.clientY;this.hasMovedEnough(i,d)&&('start'===this.info.state&&I('tap'),this.info.addMove({x:i,y:d}),this._fire(e,t),this.info.state='track',this.info.started=!0)},touchend:function(n){let e=C(n),t=n.changedTouches[0];this.info.started&&(this.info.state='end',this.info.addMove({x:t.clientX,y:t.clientY}),this._fire(e,t,n))},_fire:function(e,t){let n,i=this.info.moves[this.info.moves.length-2],d=this.info.moves[this.info.moves.length-1],a=d.x-this.info.x,s=d.y-this.info.y,o=0;i&&(n=d.x-i.x,o=d.y-i.y),R(e,'track',{state:this.info.state,x:t.clientX,y:t.clientY,dx:a,dy:s,ddx:n,ddy:o,sourceEvent:t,hover:function(){return y(t.clientX,t.clientY)}})}}),E({name:'tap',deps:['mousedown','click','touchstart','touchend'],flow:{start:['mousedown','touchstart'],end:['click','touchend']},emits:['tap'],info:{x:NaN,y:NaN,prevent:!1},reset:function(){this.info.x=NaN,this.info.y=NaN,this.info.prevent=!1},save:function(t){this.info.x=t.clientX,this.info.y=t.clientY},mousedown:function(t){g(t)&&this.save(t)},click:function(t){g(t)&&this.forward(t)},touchstart:function(t){this.save(t.changedTouches[0],t)},touchend:function(t){this.forward(t.changedTouches[0],t)},forward:function(n,e){let i=V(n.clientX-this.info.x),d=V(n.clientY-this.info.y),a=C(e||n);!a||a.disabled||(isNaN(i)||isNaN(d)||25>=i&&25>=d||m(n))&&!this.info.prevent&&R(a,'tap',{x:n.clientX,y:n.clientY,sourceEvent:n,preventer:e})}});class xt extends ve{static get properties(){return{value:Number,min:Number,max:Number,knobradius:Number,disabled:Boolean}}constructor(){super(),this.disabled=!1,this.value=0,this.min=0,this.max=100,this.knobradius=10}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render(){return this._onDisableChange(),_e`
    <style>
      :host {
        display: inline-block;
        position: relative;
        width: 300px;
        height: 40px;
        outline: none;
        box-sizing: border-box;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 5px;
      }
    
      :host(.disabled) .knob {
        pointer-events: none !important;
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
    
      :host(.pending) {
        opacity: 0;
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}connectedCallback(){super.connectedCallback(),setTimeout(()=>this._firstRendered(),100)}_firstRendered(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t=this.getBoundingClientRect();e.setAttribute('width',t.width),e.setAttribute('height',t.height);let n=this.knobradius||10;this._barWidth=t.width-2*n,this._bar=we.line(e,n,t.height/2,t.width-n,t.height/2),this._bar.classList.add('bar'),this._knobGroup=we._svgNode('g'),e.appendChild(this._knobGroup),this._knob=we.ellipse(this._knobGroup,n,t.height/2,2*n,2*n),this._knob.classList.add('knob'),this._onValueChange(),this.classList.remove('pending'),k(this._knob,'down',e=>{this.disabled||this._knobdown(e)}),k(this._knob,'up',e=>{this.disabled||this._resetKnob(e)}),k(this._knob,'track',e=>{this.disabled||this._onTrack(e)})}_onValueChange(){if(!this._knob)return;let e=0;this.max>this.min&&(e=P(1,H((this.value-this.min)/(this.max-this.min),0))),this._pct=e,e?this._knob.classList.add('hasValue'):this._knob.classList.remove('hasValue');let t=e*this._barWidth;this._knobGroup.style.transform='translateX('+O(t)+'px)'}_knobdown(e){this._knobExpand(!0),e.preventDefault(),this.focus()}_resetKnob(){this._knobExpand(!1)}_knobExpand(e){this._knob&&(e?this._knob.classList.add('expanded'):this._knob.classList.remove('expanded'))}_onTrack(e){switch(e.stopPropagation(),e.detail.state){case'start':this._trackStart(e);break;case'track':this._trackX(e);break;case'end':this._trackEnd();}}_trackStart(){this._intermediateValue=this.value,this._startx=this._pct*this._barWidth,this._knobstartx=this._startx,this._minx=-this._startx,this._maxx=this._barWidth-this._startx,this._dragging=!0}_trackX(e){this._dragging||this._trackStart(e);var t=e.detail.dx||0,n=H(P(this._startx+t,this._barWidth),0);this._knobGroup.style.transform='translateX('+O(n)+'px)';var i=n/this._barWidth;this._intermediateValue=this.min+i*(this.max-this.min)}_trackEnd(){this._dragging=!1,this._resetKnob(),this.value=this._intermediateValue,this._pct=(this.value-this.min)/(this.max-this.min);const e=new CustomEvent('change',{bubbles:!0,composed:!0,detail:{value:this._intermediateValue}});this.dispatchEvent(e)}}customElements.define('wired-slider',xt);class kt extends ve{static get properties(){return{rows:Number,maxrows:Number,autocomplete:String,autofocus:Boolean,inputmode:String,placeholder:String,readonly:Boolean,required:Boolean,minlength:Number,maxlength:Number,disabled:Boolean}}constructor(){super(),this.disabled=!1,this.rows=1,this.maxrows=0}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render({rows:e,maxrows:t,autocomplete:n,autofocus:i,inputmode:d,placeholder:a,readonly:s,required:o,minlength:r,maxlength:l,disabled:c}){return this._onDisableChange(),_e`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: sans-serif;
        width: 400px;
        -moz-appearance: textarea;
        -webkit-appearance: textarea;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
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
    </style>
    <div id="mirror" class="mirror-text">&#160;</div>
    <div class="fit">
      <textarea id="textarea" autocomplete$="${n}" autofocus?="${i}" inputmode$="${d}" placeholder$="${a}"
        readonly?="${s}" required?="${o}" disabled?="${c}" rows$="${e}" minlength$="${r}" maxlength$="${l}"
        on-input="${()=>this._onInput()}"></textarea>
    </div>
    <div class="fit overlay">
      <svg id="svg"></svg>
    </div>
    `}connectedCallback(){super.connectedCallback(),this.value=this.value||''}get textarea(){return this.shadowRoot.getElementById('textarea')}get mirror(){return this.shadowRoot.getElementById('mirror')}get value(){const e=this.textarea;return e&&e.value||''}set value(e){const t=this.textarea;t&&(t.value!==e&&(t.value=e||0===e?e:''),this.mirror.innerHTML=this._valueForMirror(),this._requestRender())}_constrain(e){var t;for(e=e||[''],t=0<this.maxRows&&e.length>this.maxRows?e.slice(0,this.maxRows):e.slice(0);0<this.rows&&t.length<this.rows;)t.push('');return t.join('<br/>')+'&#160;'}_valueForMirror(){var e=this.textarea;if(e)return this.tokens=e&&e.value?e.value.replace(/&/gm,'&amp;').replace(/"/gm,'&quot;').replace(/'/gm,'&#39;').replace(/</gm,'&lt;').replace(/>/gm,'&gt;').split('\n'):[''],this._constrain(this.tokens)}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_updateCached(){this.mirror.innerHTML=this._constrain(this.tokens)}_onInput(){this.value=this.textarea.value}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_needsLayout(){var e=this.getBoundingClientRect();e.height!=this._prevHeight&&this._requestRender()}_didRender(){const e=this.getBoundingClientRect(),t=this.shadowRoot.getElementById('svg');this._prevHeight!==e.height&&(this._clearNode(t),t.setAttribute('width',e.width),t.setAttribute('height',e.height),we.rectangle(t,2,2,e.width-2,e.height-2),this._prevHeight=e.height),this.classList.remove('pending'),this._updateCached()}}customElements.define('wired-textarea',kt);class Nt extends ve{static get properties(){return{checked:Boolean,disabled:Boolean}}constructor(){super(),this.disabled=!1,this.checked=!1}_createRoot(){const e=this.attachShadow({mode:'open',delegatesFocus:!0});return this.classList.add('pending'),e}_render(){return this._onDisableChange(),_e`
    <style>
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.4 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
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
    </style>
    <div on-click="${()=>this._toggleCheck()}">
      <svg id="svg"></svg>
    </div>
    `}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_toggleCheck(){this.checked=!this.checked&&1;const e=new CustomEvent('change',{bubbles:!0,composed:!0,checked:this.checked,detail:{checked:this.checked}});this.dispatchEvent(e)}_onDisableChange(){this.disabled?this.classList.add('disabled'):this.classList.remove('disabled')}_didRender(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);const t={width:2.5*(this.height||32),height:this.height||32};e.setAttribute('width',t.width),e.setAttribute('height',t.height),we.rectangle(e,0,0,t.width,t.height),this.knob=we.ellipse(e,t.height/2,t.height/2,t.height,t.height),this.knobOffset=t.width-t.height,this.knob.style.transition='all 0.3s ease',this.knob.style.transform=this.checked?'translateX('+this.knobOffset+'px)':'';const n=this.knob.classList;this.checked?(n.remove('unchecked'),n.add('checked')):(n.remove('checked'),n.add('unchecked')),this.classList.remove('pending')}}customElements.define('wired-toggle',Nt);class Et extends ve{static get properties(){return{for:String,position:String,text:String,offset:Number}}constructor(){super(),this._dirty=!1,this._showing=!1,this._target=null,this.offset=14,this.position='bottom'}_render({text:e},t){return t&&(t.position||t.text)&&(this._dirty=!0),(!this._target||t&&t.for)&&this._refreshTarget(),_e`
    <style>
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
    </style>
    <div id="container" style="display: none;">
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
      <span style="position: relative;">${e}</span>
    </div>
    `}get target(){if(this._target)return this._target;var e,n=this.parentNode,i=(this.getRootNode?this.getRootNode():null)||this.getOwnerDocument();return e=this.for?i.querySelector('#'+this.for):n.nodeType==Node.DOCUMENT_FRAGMENT_NODE?i.host:n,e}_detachListeners(){this._showHandler&&this._hideHandler&&(this._target&&(this._target.removeEventListener('mouseenter',this._showHandler),this._target.removeEventListener('focus',this._showHandler),this._target.removeEventListener('mouseleave',this._hideHandler),this._target.removeEventListener('blur',this._hideHandler),this._target.removeEventListener('click',this._hideHandler)),this.removeEventListener('mouseenter',this._hideHandler))}_attachListeners(){this._showHandler=()=>{this.show()},this._hideHandler=()=>{this.hide()},this._target&&(this._target.addEventListener('mouseenter',this._showHandler),this._target.addEventListener('focus',this._showHandler),this._target.addEventListener('mouseleave',this._hideHandler),this._target.addEventListener('blur',this._hideHandler),this._target.addEventListener('click',this._hideHandler)),this.addEventListener('mouseenter',this._hideHandler)}_refreshTarget(){this._detachListeners(),this._target=null,this._target=this.target,this._attachListeners(),this._dirty=!0}_clearNode(e){for(;e.hasChildNodes();)e.removeChild(e.lastChild)}_layout(){const e=this.shadowRoot.getElementById('svg');this._clearNode(e);var t=this.getBoundingClientRect(),n=t.width,i=t.height;switch(this.position){case'left':case'right':n+=this.offset;break;default:i+=this.offset;}e.setAttribute('width',n),e.setAttribute('height',i);var d=[];switch(this.position){case'top':d=[[2,2],[n-2,2],[n-2,i-this.offset],[n/2+8,i-this.offset],[n/2,i-this.offset+8],[n/2-8,i-this.offset],[0,i-this.offset]];break;case'left':d=[[2,2],[n-this.offset,2],[n-this.offset,i/2-8],[n-this.offset+8,i/2],[n-this.offset,i/2+8],[n-this.offset,i],[2,i-2]];break;case'right':d=[[this.offset,2],[n-2,2],[n-2,i-2],[this.offset,i-2],[this.offset,i/2+8],[this.offset-8,i/2],[this.offset,i/2-8]],e.style.transform='translateX('+-this.offset+'px)';break;default:d=[[2,this.offset],[0,i-2],[n-2,i-2],[n-2,this.offset],[n/2+8,this.offset],[n/2,this.offset-8],[n/2-8,this.offset]],e.style.transform='translateY('+-this.offset+'px)';}we.polygon(e,d),this._dirty=!1}_firstRendered(){this._layout()}_didRender(){this._dirty&&this._layout()}show(){this._showing||(this._showing=!0,this.shadowRoot.getElementById('container').style.display='',this.updatePosition(),setTimeout(()=>{this._layout()},1))}hide(){this._showing&&(this._showing=!1,this.shadowRoot.getElementById('container').style.display='none')}updatePosition(){if(this._target&&this.offsetParent){var e,t,n=this.offset,i=this.offsetParent.getBoundingClientRect(),d=this._target.getBoundingClientRect(),a=this.getBoundingClientRect(),s=(d.width-a.width)/2,o=(d.height-a.height)/2,r=d.left-i.left,l=d.top-i.top;switch(this.position){case'top':e=r+s,t=l-a.height-n;break;case'bottom':e=r+s,t=l+d.height+n;break;case'left':e=r-a.width-n,t=l+o;break;case'right':e=r+d.width+n,t=l+o;}this.style.left=e+'px',this.style.top=t+'px'}}}return customElements.define('wired-tooltip',Et),e.WiredButton=xe,e.WiredCard=ke,e.WiredCheckbox=Ne,e.WiredCombo=Te,e.WiredIconButton=et,e.WiredInput=tt,e.WiredItem=Ee,e.WiredListbox=nt,e.WiredProgress=it,e.WiredRadio=dt,e.WiredRadioGroup=at,e.WiredSlider=xt,e.WiredTextarea=kt,e.WiredToggle=Nt,e.WiredTooltip=Et,e}({});

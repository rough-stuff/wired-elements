var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, css } from 'lit';
export { html, css } from 'lit';
export { property, query, state, customElement as ce } from 'lit/decorators.js';
import { query } from 'lit/decorators/query.js';
import { Randomizer } from './random';
import { property } from 'lit/decorators.js';
import { createGroup, fillSvgPath, renderSvgPath } from './svg-render';
export class UIEvent extends Event {
    constructor(name, detail) {
        super(name, { bubbles: true, composed: true });
        this._detail = detail;
    }
    get detail() {
        return this._detail;
    }
}
export class WiredBase extends LitElement {
    constructor() {
        super(...arguments);
        this.renderer = 'inherit';
        this._lastSize = [0, 0];
        this._roAttached = false;
        this._seed = Math.floor(Math.random() * 2 ** 31);
    }
    connectedCallback() {
        super.connectedCallback();
        if ('ResizeObserver' in window) {
            this._ro = new ResizeObserver(() => {
                if (this.svg) {
                    this._wiredRender();
                }
            });
        }
    }
    _fire(name, detail) {
        this.dispatchEvent(new UIEvent(name, detail));
    }
    get renderStyle() {
        if ((!this.renderer) || (this.renderer === 'inherit')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return window._wired_renderer || 'classic';
        }
        return this.renderer;
    }
    _resetSvg(size, svg) {
        if (!svg) {
            svg = this.svg;
        }
        if (!svg) {
            return;
        }
        while (svg.hasChildNodes() && svg.lastChild) {
            svg.removeChild(svg.lastChild);
        }
        svg.setAttribute('width', `${size[0]}`);
        svg.setAttribute('height', `${size[1]}`);
        if (this.renderStyle === 'pencil') {
            svg.innerHTML = `<defs>
        <filter x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" id="wiredTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="5" stitchTiles="stitch" result="f1">
          </feTurbulence>
          <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" result="f2">
          </feColorMatrix>
          <feComposite operator="in" in2="f2b" in="SourceGraphic" result="f3">
          </feComposite>
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise">
          </feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2" in="f3" result="f4">
          </feDisplacementMap>
        </filter>
      </defs>`;
        }
        return svg;
    }
    _setRendered() {
        this.classList.add('wired-rendered');
    }
    _wiredRender(force = false) {
        if (this.svg) {
            const size = this._canvasSize();
            if ((!force) && (size[0] === this._lastSize[0]) && (size[1] === this._lastSize[1])) {
                return;
            }
            this._resetSvg(size, this.svg);
            this.draw(this.svg, size);
            this._lastSize = size;
            this._setRendered();
        }
    }
    updated(changed) {
        this._wiredRender(this._forceRenderOnChange(changed) || changed.has('renderer'));
        this._attachResizeListener();
    }
    disconnectedCallback() {
        this.detachResizeListener();
    }
    _attachResizeListener() {
        if (this._roAttached) {
            return;
        }
        const node = this._sizedNode();
        if (node && this._ro) {
            this._ro.observe(node);
            this._roAttached = true;
        }
    }
    detachResizeListener() {
        const node = this._sizedNode();
        if (node && this._ro) {
            this._ro.unobserve(node);
        }
        this._roAttached = false;
    }
    _randomizer() {
        return new Randomizer(this._seed);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _forceRenderOnChange(_changed) {
        return false;
    }
    _renderPath(svg, ops, overrideStyle) {
        if ((overrideStyle || this.renderStyle) !== 'classic') {
            const g = createGroup(svg);
            g.classList.add('wired-fill-shape-as-stroke-group');
            for (const mops of (ops.textured || [])) {
                fillSvgPath(g, mops, true);
            }
            return g;
        }
        else {
            return renderSvgPath(svg, ops);
        }
    }
}
WiredBase.styles = css `
    * {box-sizing: border-box;}
    [hidden] {display: none !important;}
    .horiz {display: flex; flex-direction: row;}
    .vert {display: flex; flex-direction: column;}
    .center {align-items: center;}
    .center2 {justify-content: center; align-items: center;}
    .flex {flex: 1;}
    .wrap {flex-wrap: wrap;}
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
      stroke: var(--wired-stroke-color, #000);
      stroke-width: 0.7;
      fill: transparent;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .wired-fill-shape path {
      stroke: none;
      fill: var(--wired-fill-color, #64B5F6);
    }
    .wired-fill-shape-as-stroke path {
      stroke: none;
      fill: var(--wired-stroke-color, #000);
    }
    .wired-fill-shape-as-stroke-group {
      transform: scale(0.99);
      transform-origin: center center;
    }
  `;
__decorate([
    property(),
    __metadata("design:type", String)
], WiredBase.prototype, "renderer", void 0);
__decorate([
    query('svg'),
    __metadata("design:type", SVGSVGElement)
], WiredBase.prototype, "svg", void 0);

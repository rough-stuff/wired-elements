var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property, query } from './core/base-element.js';
import { arc } from './core/graphics.js';
import { classMap } from 'lit/directives/class-map.js';
import { ellipse } from './core/renderer.js';
let WiredProgressRing = class WiredProgressRing extends WiredBase {
    constructor() {
        super(...arguments);
        this.indeterminate = false;
        this.value = 0;
        this.indicatorWidth = 6;
    }
    _forceRenderOnChange(changed) {
        return (changed.has('indeterminate') || changed.has('value'));
    }
    render() {
        const cc = {
            indeterminate: this.indeterminate
        };
        return html `
    <div id="container" class="${classMap(cc)}" style="--wired-progress-value-width: ${this.indicatorWidth};">
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    
    `;
    }
    _sizedNode() {
        return this._container || null;
    }
    _canvasSize() {
        if (this._container) {
            const { width, height } = this._container.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    draw(svg, size) {
        const [width, height] = size;
        const diameter = Math.min(width, height);
        const randomizer = this._randomizer();
        const shapeWidth = diameter - this.indicatorWidth - 4;
        const track = ellipse([width / 2, height / 2], shapeWidth, shapeWidth, randomizer, this.renderStyle);
        this._renderPath(svg, track);
        if (this.value && (!this.indeterminate)) {
            const value = Math.max(0, Math.min(this.value || 0, 1));
            const valueArc = arc([width / 2, height / 2], shapeWidth / 2, -(Math.PI / 2), value * 2 * Math.PI - (Math.PI / 2), randomizer);
            const node = this._renderPath(svg, valueArc, 'classic');
            node.setAttribute('id', 'progressValueArc');
            node.removeAttribute('filter');
        }
        if (this.indeterminate) {
            const v = 0.2;
            const valueArc = arc([width / 2, height / 2], shapeWidth / 2, -(Math.PI / 2), v * 2 * Math.PI - (Math.PI / 2), randomizer);
            const g = this._renderPath(svg, valueArc, 'classic');
            g.setAttribute('id', 'progressValueArc');
            g.removeAttribute('filter');
            g.classList.add('indeterminate');
        }
    }
};
WiredProgressRing.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-block;
        width: 140px;
        height: 140px;
      }
      #container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #progressValueArc {
        --wired-stroke-color: var(--wired-primary, #0D47A1);
      }
      #progressValueArc path {
        stroke-width: var(--wired-progress-value-width, 6);
      }
      #progressValueArc.indeterminate path {
        transform-origin: center center;
        animation: progress-indeterminate-translate var(--wired-progress-ring-animation-duration, 1s) infinite linear;
      }
      @keyframes progress-indeterminate-translate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredProgressRing.prototype, "indeterminate", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredProgressRing.prototype, "value", void 0);
__decorate([
    property({ type: Number, attribute: 'indicator-width' }),
    __metadata("design:type", Object)
], WiredProgressRing.prototype, "indicatorWidth", void 0);
__decorate([
    query('#container'),
    __metadata("design:type", HTMLElement)
], WiredProgressRing.prototype, "_container", void 0);
WiredProgressRing = __decorate([
    ce('wired-progress-ring')
], WiredProgressRing);
export { WiredProgressRing };

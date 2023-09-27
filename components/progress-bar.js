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
import { mergedShape } from './core/graphics.js';
import { fillSvgPath, createGroup } from './core/svg-render.js';
import { classMap } from 'lit/directives/class-map.js';
import { rectangle, line } from './core/renderer.js';
let WiredProgressBar = class WiredProgressBar extends WiredBase {
    constructor() {
        super(...arguments);
        this.indeterminate = false;
        this.value = 0;
    }
    _forceRenderOnChange(changed) {
        return (changed.has('indeterminate') || changed.has('value'));
    }
    render() {
        const cc = {
            indeterminate: this.indeterminate
        };
        return html `
    <div id="container" class="${classMap(cc)}">
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
        const randomizer = this._randomizer();
        const outerRect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
        if (this.value && (!this.indeterminate)) {
            const value = Math.max(0, Math.min(this.value || 0, 1));
            const valueFill = rectangle([2, 2], value * (width - 4), height - 4, randomizer, this.renderStyle);
            fillSvgPath(svg, mergedShape(valueFill));
            const valueMarker = line([value * (width - 2), 2], [value * (width - 2), height - 2], randomizer, this.renderStyle);
            this._renderPath(svg, valueMarker);
        }
        if (this.indeterminate) {
            const v = 0.333;
            const g = createGroup(svg, 'progressBarMarker');
            const valueFill = rectangle([2, 2], v * (width - 4), height - 4, randomizer, this.renderStyle);
            fillSvgPath(g, mergedShape(valueFill));
            this._renderPath(g, line([2, 2], [2, height - 2], randomizer, this.renderStyle));
            this._renderPath(g, line([v * (width - 2), 2], [v * (width - 2), height - 2], randomizer, this.renderStyle));
        }
        this._renderPath(svg, outerRect);
    }
};
WiredProgressBar.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-block;
        width: 200px;
        height: 20px;
      }
      #container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #progressBarMarker {
        animation: progress-indeterminate-translate var(--wired-progress-bar-animation-duration, 2s) infinite linear;
      }
      @keyframes progress-indeterminate-translate {
        from {
          transform: translateX(-35%);
        }
        to {
          transform: translateX(100%);
        }
      }
      `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredProgressBar.prototype, "indeterminate", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredProgressBar.prototype, "value", void 0);
__decorate([
    query('#container'),
    __metadata("design:type", HTMLElement)
], WiredProgressBar.prototype, "_container", void 0);
WiredProgressBar = __decorate([
    ce('wired-progress-bar')
], WiredProgressBar);
export { WiredProgressBar };

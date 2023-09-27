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
import { styleMap } from 'lit/directives/style-map.js';
import { mergedShape } from './core/graphics.js';
import { fillSvgPath } from './core/svg-render.js';
import { rectangle, line } from './core/renderer.js';
let WiredCard = class WiredCard extends WiredBase {
    constructor() {
        super(...arguments);
        this.elevation = 1;
    }
    render() {
        const padding = Math.max(0, (this.elevation - 1) * 3);
        const containerStyles = {
            padding: padding ? `0 ${padding}px ${padding}px 0` : undefined
        };
        return html `
    <div id="outer" style="${styleMap(containerStyles)}">
      <div id="overlay">
        <svg></svg>
      </div>
      <div id="inner">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </div>
    `;
    }
    _sizedNode() {
        return this._outer || null;
    }
    _canvasSize() {
        if (this._outer) {
            const { width, height } = this._outer.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    draw(svg) {
        if (this._inner) {
            const { width, height } = this._inner.getBoundingClientRect();
            const elev = Math.min(Math.max(1, this.elevation), 5);
            const elevOffset = 2 * (this.renderStyle !== 'classic' ? 10 : 1);
            const randomizer = this._randomizer();
            const rect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
            fillSvgPath(svg, mergedShape(rect));
            this._renderPath(svg, rect);
            for (let i = 1; i < elev; i++) {
                [
                    line([i * elevOffset, height + (i * 2)], [width + (i * 2), height + (i * 2)], randomizer, this.renderStyle, 0.5),
                    line([width + (i * 2), height + (i * 2)], [width + (i * 2), i * elevOffset], randomizer, this.renderStyle, 0.5)
                ].forEach((ops) => {
                    this._renderPath(svg, ops).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
                });
            }
        }
    }
};
WiredCard.styles = [
    WiredBase.styles,
    css `
    :host {
      display: inline-block;
    }
    #outer {
      position: relative;
    }
    #inner {
      padding: var(--wired-card-padding, 16px);
      position: relative;
    }
    .wired-fill-shape path {
      stroke: none;
      fill: var(--wired-fill-color, none);
    }
    `
];
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredCard.prototype, "elevation", void 0);
__decorate([
    query('#outer'),
    __metadata("design:type", HTMLElement)
], WiredCard.prototype, "_outer", void 0);
__decorate([
    query('#inner'),
    __metadata("design:type", HTMLElement)
], WiredCard.prototype, "_inner", void 0);
WiredCard = __decorate([
    ce('wired-card')
], WiredCard);
export { WiredCard };

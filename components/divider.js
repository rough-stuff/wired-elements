var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property } from './core/base-element.js';
import { line } from './core/renderer.js';
let WiredDivider = class WiredDivider extends WiredBase {
    constructor() {
        super(...arguments);
        this.vertical = false;
    }
    _forceRenderOnChange(changed) {
        return changed.has('vertical');
    }
    render() {
        return html `
    <div id="overlay">
      <svg></svg>
    </div>
    `;
    }
    _sizedNode() {
        return this;
    }
    _canvasSize() {
        const { width, height } = this.getBoundingClientRect();
        return [width, height];
    }
    draw(svg) {
        const { width, height } = this.getBoundingClientRect();
        const randomizer = this._randomizer();
        if (this.vertical) {
            this._renderPath(svg, line([width / 2, 0], [width / 2, height], randomizer, this.renderStyle));
        }
        else {
            this._renderPath(svg, line([0, height / 2], [width, height / 2], randomizer, this.renderStyle));
        }
    }
};
WiredDivider.styles = [
    WiredBase.styles,
    css `
    :host {
      display: block;
      width: 100%;
      height: 4px;
      position: relative;
    }
    :host([vertical]) {
      width: 4px;
      height: auto;
    }
    path {
      stroke-width: var(--wired-divider-width, 1);
    }
    `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredDivider.prototype, "vertical", void 0);
WiredDivider = __decorate([
    ce('wired-divider')
], WiredDivider);
export { WiredDivider };

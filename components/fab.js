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
import { fillSvgPath } from './core/svg-render.js';
import { ellipse } from './core/renderer.js';
let WiredFab = class WiredFab extends WiredBase {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
    render() {
        return html `
    <button ?disabled="${this.disabled}">
      <div id="overlay">
        <svg></svg>
      </div>
      <div id="content">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </button>
    `;
    }
    focus() {
        var _a;
        (_a = this._button) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._button) === null || _a === void 0 ? void 0 : _a.blur();
    }
    _sizedNode() {
        return this._button || null;
    }
    _canvasSize() {
        if (this._button) {
            const { width, height } = this._button.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    draw(svg, size) {
        if (this._button) {
            const [width, height] = size;
            const randomizer = this._randomizer();
            const shape = ellipse([width / 2, height / 2], width - 4, height - 4, randomizer, 'classic');
            fillSvgPath(svg, shape.overlay);
            this._renderPath(svg, ellipse([width / 2, height / 2], width - 4, height - 4, randomizer, this.renderStyle));
        }
    }
};
WiredFab.styles = [
    WiredBase.styles,
    css `
    :host {
      display: inline-block;
      font-size: 14px;
    }
    path {
      stroke: var(--wired-stroke-color, currentColor);
      transition: transform 0.05s ease;
      stroke-width: 1;
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
      padding: var(--wired-button-padding, 16px);
      color: inherit;
      outline: none;
      border-radius: 50%;
      box-shadow: var(--wired-fab-shadow, 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%));
    }
    button[disabled] {
      opacity: 0.6 !important;
      --wired-stroke-color: rgba(0, 0, 0, 0.35);
      --wired-fill-color: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
      background: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
      cursor: initial;
      pointer-events: none;
      box-shadow: none;
    }
    button[disabled] #overlay {
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
    #content {
      position: relative;
    }
    @media (hover: hover) {
      button:hover path {
        stroke-width: 1.25;
      }
    }
    `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredFab.prototype, "disabled", void 0);
__decorate([
    query('button'),
    __metadata("design:type", HTMLButtonElement)
], WiredFab.prototype, "_button", void 0);
WiredFab = __decorate([
    ce('wired-fab')
], WiredFab);
export { WiredFab };

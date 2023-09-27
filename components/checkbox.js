var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property, query, state } from './core/base-element.js';
import { mergedShape } from './core/graphics.js';
import { fillSvgPath } from './core/svg-render.js';
import { rectangle, linearPath } from './core/renderer.js';
let WiredCheckbox = class WiredCheckbox extends WiredBase {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.checked = false;
        this._focused = false;
    }
    _forceRenderOnChange(changed) {
        return changed.has('checked');
    }
    render() {
        return html `
    <label class="horiz center ${this._focused ? 'focused' : ''}">
      <input type="checkbox" 
        .checked="${this.checked}" 
        ?disabled="${this.disabled}" 
        @change="${this._onChange}"
        @focus="${() => this._focused = true}"
        @blur="${() => this._focused = false}">
      <span class="label"><slot></slot></span>
      <div id="overlay">
        <svg></svg>
      </div>
    </label>
    `;
    }
    _onChange(event) {
        var _a;
        this.checked = ((_a = this._input) === null || _a === void 0 ? void 0 : _a.checked) || false;
        event.stopPropagation();
        this._fire(event.type);
    }
    focus() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.blur();
    }
    _sizedNode() {
        return this._label || null;
    }
    _canvasSize() {
        return [28, 28];
    }
    draw(svg, size) {
        const [width, height] = size;
        const randomizer = this._randomizer();
        const rect = rectangle([2, 5], width - 7, height - 7, randomizer, this.renderStyle);
        if (this.checked) {
            fillSvgPath(svg, mergedShape(rect)).classList.add('backdrop');
        }
        this._renderPath(svg, rect);
        if (this.checked) {
            for (let i = 0; i < 2; i++) {
                this._renderPath(svg, linearPath([
                    [width * 0.3, height * 0.5],
                    [width * 0.5, height * 0.7],
                    [width, 0]
                ], false, randomizer, this.renderStyle));
            }
        }
    }
};
WiredCheckbox.styles = [
    WiredBase.styles,
    css `
    :host {
      display: inline-block;
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    input {
      margin: 0;
      padding: 0;
      width: 28px;
      height: 28px;
      opacity: 0;
      outline: none;
      cursor: pointer;
    }
    label {
      gap: 12px;
      position: relative;
    }
    label.focused path {
      stroke-width: 1.35;
    }
    :host([checked]) label path {
      --wired-stroke-color: var(--wired-primary, #0D47A1);
      stroke-width: 2;
    }
    .backdrop {
      opacity: 0.1;
    }
    label.focused .backdrop {
      opacity: 0.5;
    }

    @media (hover: hover) {
      label:hover path {
        stroke-width: 1;
      }
      label:hover .backdrop {
        opacity: 0.3;
      }
    }
    `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredCheckbox.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredCheckbox.prototype, "checked", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredCheckbox.prototype, "_focused", void 0);
__decorate([
    query('input'),
    __metadata("design:type", HTMLInputElement)
], WiredCheckbox.prototype, "_input", void 0);
__decorate([
    query('label'),
    __metadata("design:type", HTMLInputElement)
], WiredCheckbox.prototype, "_label", void 0);
WiredCheckbox = __decorate([
    ce('wired-checkbox')
], WiredCheckbox);
export { WiredCheckbox };

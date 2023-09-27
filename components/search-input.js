var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property, state, query } from './core/base-element.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { line, roundedRectangle, ellipse } from './core/renderer.js';
let WiredSearchInput = class WiredSearchInput extends WiredBase {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.icon = 'search';
        this.placeholder = '';
        this.autocomplete = '';
        this._focused = false;
    }
    _forceRenderOnChange(changed) {
        return changed.has('icon');
    }
    get value() {
        if (this._input) {
            return this._input.value;
        }
        else if (this._pendingValue !== undefined) {
            return this._pendingValue;
        }
        return '';
    }
    set value(v) {
        if (this._input) {
            this._input.value = v;
        }
        else {
            this._pendingValue = v;
        }
    }
    render() {
        const cc = {
            focused: this._focused
        };
        return html `
    <label class="horiz center ${classMap(cc)}">
      <div class="flex">
        <input 
          name="${ifDefined(this.name)}"
          type="search"
          ?disabled="${this.disabled}"
          autocomplete="${this.autocomplete}"
          placeholder="${this.placeholder}"
          aria-labelledby="label"
          @change=${this._onChange}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @blur=${this._onBlur}>
      </div>
      <div id="iconPanel" @click="${this._onIconClick}"></div>
      
      <div id="overlay">
        <svg></svg>
      </div>
    </label>
    `;
    }
    firstUpdated() {
        if (this._pendingValue) {
            this._input.value = this._pendingValue;
            this._pendingValue = undefined;
        }
    }
    focus() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.blur();
    }
    _onFocus() {
        this._focused = true;
    }
    _onBlur() {
        this._focused = false;
    }
    _onChange(event) {
        event.stopPropagation();
        this._fire('change');
    }
    _onInput(event) {
        if (event) {
            event.stopPropagation();
        }
        this._fire('input');
    }
    _sizedNode() {
        return this._label || null;
    }
    _canvasSize() {
        if (this._label) {
            const { width, height } = this._label.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    draw(svg, size) {
        const [width, height] = size;
        const randomizer = this._randomizer();
        const rect = roundedRectangle([2, 2], width - 4, height - 4, height / 2, randomizer, this.renderStyle);
        this._renderPath(svg, rect);
        const yo = (height - 30) / 2;
        if (this.icon === 'clear') {
            this._renderPath(svg, line([width - 44, yo], [width - 20, yo + 24], randomizer, this.renderStyle));
            this._renderPath(svg, line([width - 20, yo], [width - 44, yo + 24], randomizer, this.renderStyle));
        }
        else {
            this._renderPath(svg, ellipse([width - 36, height - 34], 16, 16, randomizer, this.renderStyle));
            this._renderPath(svg, line([width - 32, height - 28], [width - 20, height - 16], randomizer, this.renderStyle));
        }
    }
    _onIconClick(e) {
        e.stopPropagation();
        this._fire('icon-click');
    }
};
WiredSearchInput.styles = [
    WiredBase.styles,
    css `
    :host {
      display: inline-flex;
      vertical-align: top;
      flex-direction: column;
      width: 300px;
      font-size: 1rem;
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    label {
      display: block;
      width: 100%;
      padding: 0 0 0 24px;
      height: 56px;
      position: relative;
    }
    input::placeholder {
      opacity: 0.7;
    }
    input {
      color: inherit;
      border: none;
      display: block;
      width: 100%;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      margin: 0;
      padding: 0;
      appearance: none;
      background-color: transparent;
      caret-color: var(--wired-primary, #0D47A1);
      border-radius: 0;
      outline: none;
      height: 100%;
    }
    input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
    input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
      display: none;
    }
    input:disabled {
      background: inherit;
    }
    label.focused path {
      stroke-width: 1.35;
      --wired-stroke-color: var(--wired-primary, #0D47A1);
    }
    #iconPanel {
      height: 100%;
      width: 56px;
      border-radius: 0 50% 50% 0;
      cursor: pointer;
    }

    @media (hover: hover) {
      label:hover path {
        stroke-width: 1;
      }
    }
    `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredSearchInput.prototype, "disabled", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredSearchInput.prototype, "icon", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredSearchInput.prototype, "placeholder", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredSearchInput.prototype, "name", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredSearchInput.prototype, "autocomplete", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSearchInput.prototype, "_focused", void 0);
__decorate([
    query('input'),
    __metadata("design:type", HTMLInputElement)
], WiredSearchInput.prototype, "_input", void 0);
__decorate([
    query('label'),
    __metadata("design:type", HTMLInputElement)
], WiredSearchInput.prototype, "_label", void 0);
__decorate([
    property(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], WiredSearchInput.prototype, "value", null);
WiredSearchInput = __decorate([
    ce('wired-search-input')
], WiredSearchInput);
export { WiredSearchInput };

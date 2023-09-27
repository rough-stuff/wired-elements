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
import { rectangle, linearPath } from './core/renderer.js';
let WiredTextfield = class WiredTextfield extends WiredBase {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.type = 'text';
        this.label = '';
        this.placeholder = '';
        this.autocomplete = '';
        this.endAlign = false;
        this._focused = false;
        this._hasText = false;
    }
    _forceRenderOnChange(changed) {
        return changed.has('label') || changed.has('_focused') || changed.has('_hasText');
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
            this._updateHasText();
        }
        else {
            this._pendingValue = v;
        }
    }
    render() {
        const cc = {
            focused: this._focused,
            nolabel: !this.label,
            notched: !!(this.label && (this._focused || this._hasText)),
            hastext: this._hasText
        };
        const inputCC = {
            endalign: this.endAlign
        };
        return html `
    <label class="horiz center ${classMap(cc)}">
      ${this.label ? html `<span id="label" class="textlabel">${this.label}</span>` : null}

      <input 
        class="${classMap(inputCC)}"
        name="${ifDefined(this.name)}"
        type="${this.type}"
        ?disabled="${this.disabled}"
        autocomplete="${this.autocomplete}"
        placeholder="${this.placeholder}"
        aria-labelledby="label"
        @change=${this._onChange}
        @input=${this._onInput}
        @focus=${this._onFocus}
        @blur=${this._onBlur}>

      <div id="outlineBorder" class="horiz">
        <span id="obleft"></span>
        ${this.label ? html `
        <div id="obcenter">
          <span id="oblabel" class="textlabel">${this.label}</span>
        </div>
        ` : null}
        <span id="obright" class="flex"></span>
      </div>

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
            this._updateHasText();
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
    _updateHasText() {
        this._hasText = !!(this._input.value);
    }
    _onInput(event) {
        this._updateHasText();
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
        const notched = !!(this.label && (this._focused || this._hasText));
        const randomizer = this._randomizer();
        if (notched) {
            const labelWidth = this._obcenter.getBoundingClientRect().width;
            const path = linearPath([
                [12, 2],
                [2, 2],
                [2, height - 2],
                [width - 2, height - 2],
                [width - 2, 2],
                [labelWidth + 14, 2]
            ], false, randomizer, this.renderStyle);
            this._renderPath(svg, path);
        }
        else {
            const rect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
            this._renderPath(svg, rect);
        }
    }
};
WiredTextfield.styles = [
    WiredBase.styles,
    css `
    :host {
      display: inline-flex;
      vertical-align: top;
      flex-direction: column;
      width: 280px;
      font-size: 1rem;
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    label {
      display: block;
      width: 100%;
      padding: 0 16px 0;
      height: 56px;
      position: relative;
    }
    label.nolabel {
      padding-top: 0;
      padding-bottom: 0;
    }
    label.nolabel input {
      height: 100%;
    }
    label.nolabel input::placeholder {
      opacity: 0.7;
    }
    label.focused input::placeholder {
      opacity: 0.7;
    }
    label.focused #label {
      color: var(--wired-primary, #0D47A1);
      opacity: 1;
    }
    label.notched #label {
      transform: translateY(-37.25px) scale(0.75);
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
      height: 28px;
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input:disabled {
      background: inherit;
    }
    input::placeholder {
      transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      opacity: 0;
    }
    input.endalign {
      text-align: right;
    }
    .textlabel {
      font-family: var(--wired-label-font-family, inherit);
      font-size: var(--wired-label-font-size, inherit);
      font-weight: var(--wired-label-font-weight, inherit);
      letter-spacing: var(--wired-label-letter-spacing, inherit);
      text-transform: var(--wired-label-text-transform, inherit);
      white-space: nowrap;
      line-height: var(--wired-label-text-line-height, 1.15);
      text-align: left;
    }
    #label {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translateY(-50%);
      pointer-events: none;
      color: inherit;
      opacity: 0.6;
      text-overflow: ellipsis;
      cursor: text;
      overflow: hidden;
      will-change: transform;
      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
      text-overflow: clip;
      transform-origin: left center;
    }
    #outlineBorder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    #obleft {
      width: 12px;
      border-radius: 4px 0 0 4px;
      border-left: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: transparent;
    }
    #obright {
      border-radius: 0 4px 4px 0;
      border-right: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: transparent;
    }
    #obcenter {
      padding: 0 4px;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: transparent;
    }
    #oblabel {
      font-size: 0.75em;
      transform: translateY(-50%);
      display: block;
      opacity: 0;
    }
    label.notched #obcenter {
      border-top: none;
    }
    label.focused path {
      stroke-width: 1.35;
      --wired-stroke-color: var(--wired-primary, #0D47A1);
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
], WiredTextfield.prototype, "disabled", void 0);
__decorate([
    property({ type: String, reflect: true }),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "type", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "label", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "placeholder", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredTextfield.prototype, "name", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "autocomplete", void 0);
__decorate([
    property({ type: Boolean, attribute: 'end-align' }),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "endAlign", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "_focused", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredTextfield.prototype, "_hasText", void 0);
__decorate([
    query('input'),
    __metadata("design:type", HTMLInputElement)
], WiredTextfield.prototype, "_input", void 0);
__decorate([
    query('label'),
    __metadata("design:type", HTMLLabelElement)
], WiredTextfield.prototype, "_label", void 0);
__decorate([
    query('#obcenter'),
    __metadata("design:type", HTMLElement)
], WiredTextfield.prototype, "_obcenter", void 0);
__decorate([
    property(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], WiredTextfield.prototype, "value", null);
WiredTextfield = __decorate([
    ce('wired-textfield')
], WiredTextfield);
export { WiredTextfield };

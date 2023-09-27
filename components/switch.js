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
import { fillSvgPath, createGroup } from './core/svg-render.js';
import { classMap } from 'lit/directives/class-map.js';
import { rectangle, ellipse } from './core/renderer.js';
let WiredSwitch = class WiredSwitch extends WiredBase {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.checked = false;
        this._focused = false;
    }
    render() {
        const cc = {
            focused: this._focused,
            checked: this.checked
        };
        return html `
    <div id="container" class="horiz center ${classMap(cc)}">
      <input 
        type="checkbox"
        ?disabled="${this.disabled}"
        ?checked="${this.checked}" 
        @change=${this._onChecked}
        @focus=${this._onFocus}
        @blur=${this._onBlur}>
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
    }
    updated(changed) {
        if (changed.has('checked')) {
            if (this._i) {
                this._i.checked = this.checked;
            }
        }
        super.updated(changed);
    }
    _onFocus() {
        this._focused = true;
    }
    _onBlur() {
        this._focused = false;
    }
    _onChecked(event) {
        const input = event.target;
        this.checked = input.checked;
        this._fire(event.type);
    }
    focus() {
        var _a;
        (_a = this._i) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._i) === null || _a === void 0 ? void 0 : _a.blur();
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
        const rect = rectangle([14, (height / 2) - 6], width - 28, 12, randomizer, this.renderStyle);
        this._renderPath(svg, rect);
        const knob = createGroup(svg, 'switchKnob');
        fillSvgPath(knob, ellipse([14, height / 2], 24, 24, randomizer, 'classic').shape);
        this._renderPath(knob, ellipse([14, height / 2], 24, 24, randomizer, this.renderStyle));
    }
};
WiredSwitch.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      #container {
        padding: var(--wired-switch-padding, 17px 14px);
        user-select: none;
        position: relative;
        width: 64px;
        height: 40px;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        margin: 0;
        cursor: pointer;
      }
      :host([disabled]) #container {
        opacity: 0.5;
        pointer-events: none;
      }
      #switchKnob {
        transform: translateX(0px);
        transition: transform 0.3s ease;
        --wired-fill-color: var(--wired-switch-off-color, gray);
      }
      #container.checked #switchKnob {
        transform: translateX(36px);
        --wired-fill-color: var(--wired-switch-on-color);
      }
      #container.focused path {
        stroke-width: 1.35;
      }

      @media (hover: hover) {
        #container:hover path {
          stroke-width: 1;
        }
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredSwitch.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredSwitch.prototype, "checked", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSwitch.prototype, "_focused", void 0);
__decorate([
    query('input'),
    __metadata("design:type", HTMLInputElement)
], WiredSwitch.prototype, "_i", void 0);
__decorate([
    query('#container'),
    __metadata("design:type", HTMLDivElement)
], WiredSwitch.prototype, "_container", void 0);
WiredSwitch = __decorate([
    ce('wired-switch')
], WiredSwitch);
export { WiredSwitch };

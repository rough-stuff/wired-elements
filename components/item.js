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
import { rectangle } from './core/renderer.js';
let WiredItem = class WiredItem extends WiredBase {
    constructor() {
        super(...arguments);
        this.value = '';
        this.name = '';
        this.selected = false;
        this.disabled = false;
        this._focusable = true;
    }
    _forceRenderOnChange(changed) {
        return changed.has('selected');
    }
    render() {
        return html `
    <button 
      ?disabled="${this.disabled}" 
      tabindex="${this._focusable ? 0 : -1}"
      @click="${this._onItemClick}">
      <div id="overlay"><svg></svg></div>
      <div id="content">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </button>
    `;
    }
    focus() {
        if (this._button) {
            this._button.focus();
        }
        else {
            super.focus();
        }
    }
    blur() {
        if (this._button) {
            this._button.blur();
        }
        else {
            super.blur();
        }
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
        if (this.selected) {
            const [width, height] = size;
            const randomizer = this._randomizer();
            const rect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
            fillSvgPath(svg, mergedShape(rect));
        }
    }
    _onItemClick() {
        if (!this.disabled) {
            this._fire('item-click');
        }
    }
};
WiredItem.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-block;
        font-size: 14px;
        text-align: left;
      }
      #overlay {
        pointer-events: initial;
      }
      #content {
        position: relative;
      }
      path {
        transition: transform 0.05s ease;
      }
      #container {
        width: 100%;
        position: relative;
      }
      button {
        text-align: inherit;
        position: relative;
        display: block;
        cursor: pointer;
        outline: none;
        overflow: hidden;
        color: inherit;
        user-select: none;
        font-family: inherit;
        font-size: inherit;
        letter-spacing: 1.25px;
        line-height: 1;
        padding: var(--wired-button-padding, 12px);
        text-transform: inherit;
        width: 100%;
        background: none;
        border: none;
      }
      button[disabled] {
        cursor: initial;
        pointer-events: none;
        opacity: 0.6 !important;
        --wired-fill-color: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
        background: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
        pointer-events: none;
      }
      button[disabled] #overlay {
        pointer-events: none;
      }
      button::-moz-focus-inner {
        border: 0;
      }
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        opacity: 0;
      }
      button::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--wired-fill-color, #64B5F6);
        opacity: 0;
      }
      button:focus::after {
        opacity: 0.2;
      }
      button:active::after {
        opacity: 0.3;
      }
      @media (hover: hover) {
        button:hover::before {
          opacity: 0.05;
        }
      }
      `
];
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredItem.prototype, "value", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredItem.prototype, "name", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], WiredItem.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredItem.prototype, "disabled", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredItem.prototype, "_focusable", void 0);
__decorate([
    query('button'),
    __metadata("design:type", HTMLButtonElement)
], WiredItem.prototype, "_button", void 0);
WiredItem = __decorate([
    ce('wired-item')
], WiredItem);
export { WiredItem };

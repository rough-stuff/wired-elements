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
import { polygon, mergedShape } from './core/graphics.js';
import { fillSvgPath } from './core/svg-render.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { WiredMenu } from './menu.js';
import { queryAll } from 'lit/decorators/query-all.js';
import { queryAssignedNodes } from 'lit/decorators/query-assigned-nodes.js';
import { rectangle, linearPath } from './core/renderer.js';
import './menu.js';
import './list.js';
import './item.js';
let WiredSelect = class WiredSelect extends WiredBase {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.label = '';
        this.direction = 'down';
        this._menuShowing = false;
        this._focused = false;
        this._selectedText = '';
        this._options = [];
        this._selectedItem = null;
    }
    _forceRenderOnChange(changed) {
        return changed.has('label') || changed.has('_focused') || changed.has('_selectedText') || changed.has('_menuShowing');
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
        const items = this._listItems;
        if (items && items.length) {
            this._pendingValue = undefined;
            for (let i = 0; i < items.length; i++) {
                if (items[i].name === v) {
                    this.setSelected(items[i], false);
                    return;
                }
            }
        }
        else {
            this._pendingValue = v;
        }
    }
    render() {
        const cc = {
            focused: this._focused || this._menuShowing,
            nolabel: !this.label,
            notched: !!(this.label && (this._focused || this._selectedText)),
            hastext: !!this._selectedText,
            menushowing: this._menuShowing
        };
        return html `
    <label class="horiz center ${classMap(cc)}">
      ${this.label ? html `<span id="label" class="textlabel">${this.label}</span>` : null}

      <div id="selectedText">${this._selectedText}</div>

      <input 
        readonly
        name="${ifDefined(this.name)}"
        ?disabled="${this.disabled}"
        aria-labelledby="label"
        @click="${this._onInputClick}"
        @focus=${this._onFocus}
        @blur=${this._onBlur}
        @keydown="${this._onKeydown}">

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
    <wired-menu
      pin="bottom-start"
      .maxHeight="${this.maxPopoverHeight}"
      .direction="${this.direction}"
      .renderer="${this.renderStyle}"
      @popover-open="${this._popOpen}"
      @popover-close="${this._popClose}"
      @item-click="${this._onSelect}"
      @key-escape="${this._onEscKey}">
      <wired-list tabindex="-1" .renderer="${this.renderStyle}">
        ${this._options.map((o) => html `<wired-item name="${o.value || ''}">${(o.textContent || '').trim()}</wired-item>`)}
      </wired-list>
    </wired-menu>
    <div style="display: none;"><slot @slotchange="${this._onSlotChange}"></slot></div>
    `;
    }
    _onSlotChange() {
        this._options = (this._slotted.filter((d) => (d instanceof HTMLOptionElement)));
    }
    updated(changed) {
        if (this._pendingValue) {
            this.value = this._pendingValue;
        }
        super.updated(changed);
    }
    _popClose() {
        this._menuShowing = false;
    }
    _popOpen() {
        this._menuShowing = true;
        setTimeout(() => {
            if (this._menuShowing) {
                if (this._selectedItem) {
                    this._selectedItem.focus();
                }
                else if (this._listItems) {
                    const first = this._listItems[0];
                    if (first) {
                        first.focus();
                    }
                }
            }
        });
    }
    focus() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.focus();
    }
    _onFocus() {
        this._focused = true;
    }
    _onBlur() {
        this._focused = false;
    }
    _onInputClick(event) {
        event.stopPropagation();
    }
    _onSelect(event) {
        this.setSelected(event.target, true);
        event.stopPropagation();
        this.focus();
    }
    setSelected(item, fireChange) {
        var _a, _b;
        this._selectedItem = item;
        this._selectedText = ((_a = this._selectedItem.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        if (this._input) {
            this._input.value = this._selectedItem.name || ((_b = this._selectedItem.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
        }
        if (fireChange) {
            this._fire('change');
        }
    }
    _onKeydown(event) {
        switch (event.code) {
            case ' ':
            case 'Space':
            case 'Spacebar':
            case 'Enter':
                this._menu.open = !this._menu.open;
                event.preventDefault();
                event.stopPropagation();
                return false;
            case 'ArrowUp':
            case 'ArrowLeft':
                this._menu.open = false;
                event.preventDefault();
                event.stopPropagation();
                return false;
            case 'ArrowRight':
            case 'ArrowDown':
                this._menu.open = true;
                event.preventDefault();
                event.stopPropagation();
                return false;
            case 'Escape':
            case 'Backspace':
            case 'Delete':
                this._onEscKey();
                event.preventDefault();
                event.stopPropagation();
                return false;
        }
        return true;
    }
    _onEscKey() {
        this._menu.open = false;
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
        const notched = !!(this.label && (this._focused || this._selectedText));
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
        if (this._menuShowing) {
            const icon = polygon([
                [width - 36, 40],
                [width - 12, 40],
                [width - 24, 16]
            ], randomizer);
            const arrow = fillSvgPath(svg, mergedShape(icon));
            arrow.setAttribute('id', 'drop-arrow');
            arrow.setAttribute('filter', 'url(#wiredTexture)');
        }
        else {
            const icon = polygon([
                [width - 36, 16],
                [width - 12, 16],
                [width - 24, 40]
            ], randomizer);
            const arrow = fillSvgPath(svg, mergedShape(icon));
            arrow.setAttribute('id', 'drop-arrow');
            arrow.setAttribute('filter', 'url(#wiredTexture)');
        }
    }
};
WiredSelect.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-flex;
        vertical-align: top;
        flex-direction: column;
        width: 280px;
        font-size: 1rem;
        position: relative;
      }
      :host([disabled]) label {
        pointer-events: none;
        opacity: 0.38;
      }

      label {
        display: block;
        width: 100%;
        padding: 0 44px 0 16px;
        height: 56px;
        position: relative;
      }
      label.nolabel {
        padding-top: 0;
        padding-bottom: 0;
      }
      label.focused #label {
        color: var(--wired-primary, #0D47A1);
        opacity: 1;
      }
      
      label.notched #label {
        transform: translateY(-37.25px) scale(0.75);
      }

      #selectedText {
        color: inherit;
        display: block;
        width: 100%;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
        margin: 0;
        padding: 0;
        height: 28px;
        line-height: 28px;
        pointer-events: none;
      }

      input {
        width: 0;
        height: 0;
        position: absolute;
        opacity: 0;
        pointer-events: none;
        overflow: hidden;
        margin: 0;
        padding: 0;
        appearance: none;
        outline: none;
        border: 0;
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
        transform-origin: left center;
        text-overflow: clip;
        cursor: text;
        overflow: hidden;
        will-change: transform;
        transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
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
      label.focused #obleft,
      label.focused #obcenter,
      label.focused #obright {
        border-color: transparent;
        border-width: 2px;
      }
      label.notched #obcenter {
        border-top: none;
      }
      label.focused path {
        stroke-width: 1.35;
        --wired-stroke-color: var(--wired-primary, #0D47A1);
      }
      #drop-arrow {
        --wired-fill-color: var(--wired-stroke-color, #000);
      }
      label.focused #drop-arrow {
        --wired-fill-color: var(--wired-primary, #0D47A1);
      }
      wired-menu {
        --wired-surface-min-width: 100%;
      }
      wired-menu > wired-list {
        width: 100%;
        display: block;
      }
  
      @media (hover: hover) {
        label:hover path {
          stroke-width: 1;
        }
      }
    `,
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredSelect.prototype, "disabled", void 0);
__decorate([
    property(),
    __metadata("design:type", Object)
], WiredSelect.prototype, "label", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredSelect.prototype, "name", void 0);
__decorate([
    property({ type: Number, attribute: 'max-popover-height' }),
    __metadata("design:type", Number)
], WiredSelect.prototype, "maxPopoverHeight", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredSelect.prototype, "direction", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSelect.prototype, "_menuShowing", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSelect.prototype, "_focused", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSelect.prototype, "_selectedText", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], WiredSelect.prototype, "_options", void 0);
__decorate([
    query('input'),
    __metadata("design:type", HTMLInputElement)
], WiredSelect.prototype, "_input", void 0);
__decorate([
    query('label'),
    __metadata("design:type", HTMLLabelElement)
], WiredSelect.prototype, "_label", void 0);
__decorate([
    query('wired-menu'),
    __metadata("design:type", WiredMenu)
], WiredSelect.prototype, "_menu", void 0);
__decorate([
    queryAll('wired-item'),
    __metadata("design:type", Object)
], WiredSelect.prototype, "_listItems", void 0);
__decorate([
    query('#obcenter'),
    __metadata("design:type", HTMLElement)
], WiredSelect.prototype, "_obcenter", void 0);
__decorate([
    queryAssignedNodes(),
    __metadata("design:type", Array)
], WiredSelect.prototype, "_slotted", void 0);
__decorate([
    property(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], WiredSelect.prototype, "value", null);
WiredSelect = __decorate([
    ce('wired-select')
], WiredSelect);
export { WiredSelect };

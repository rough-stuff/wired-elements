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
import { queryAssignedNodes } from 'lit/decorators.js';
import { WiredItem } from './item.js';
import './item.js';
import './card.js';
let WiredList = class WiredList extends WiredBase {
    constructor() {
        super(...arguments);
        this.horizontal = false;
        this.selectable = false;
        this._focusIn = false;
        this._handleFocusin = () => {
            if (!this._focusIn) {
                this._focusIn = true;
                this.addEventListener('focusout', this._handleFocusout);
                this.addEventListener('keydown', this._handleKeydown);
            }
        };
        this._handleFocusout = (event) => {
            const related = event.relatedTarget;
            if (related && this.contains(related)) {
                return;
            }
            this._focusIn = false;
            this.removeEventListener('keydown', this._handleKeydown);
            this.removeEventListener('focusout', this._handleFocusout);
        };
        this._handleKeydown = (event) => {
            let activeElement = this.getRootNode().activeElement;
            if (!activeElement) {
                activeElement = this._lastActiveItem || this._selectedItem || this._items[0];
            }
            if (!activeElement) {
                return;
            }
            const index = this._items.indexOf(activeElement);
            if (index < 0) {
                return;
            }
            const focusIndex = (n, forward, iteration) => {
                const count = this._items.length;
                if (iteration > count) {
                    return;
                }
                if (count) {
                    const i = n < 0 ? (count - 1) : (n % count);
                    const btn = this._items[i];
                    if (btn.disabled) {
                        if (forward) {
                            focusIndex(i + 1, forward, iteration + 1);
                        }
                        else {
                            focusIndex(i - 1, forward, iteration + 1);
                        }
                        return;
                    }
                    this._focusItem(btn);
                    this._lastActiveItem = btn;
                }
            };
            switch (event.code) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    focusIndex(index - 1, false, 0);
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    focusIndex(index + 1, true, 1);
                    event.preventDefault();
                    break;
                case 'End':
                    focusIndex(this._items.length - 1, false, 0);
                    event.preventDefault();
                    break;
                case 'Home':
                    focusIndex(0, true, 0);
                    event.preventDefault();
                    break;
                case 'Escape':
                case 'Backspace':
                    this._fire('key-escape');
                    event.preventDefault();
                    break;
            }
        };
    }
    _forceRenderOnChange(changed) {
        return changed.has('horizontal');
    }
    render() {
        return html `
    <wired-card elevation="1" id="surface" .renderer="${this.renderStyle}">
      <div id="container" class="${this.horizontal ? 'horiz' : 'vert'}" @item-click="${this._onItemClick}">
        <slot></slot>
      </div>
    </wired-card>`;
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('focusin', this._handleFocusin);
    }
    _sizedNode() {
        return null;
    }
    _canvasSize() {
        return [0, 0];
    }
    draw() {
        // do nothing
    }
    get _items() {
        return (this._slotted.filter((d) => (d instanceof WiredItem)));
    }
    get _selectedItem() {
        return this._items.find((item) => item.selected) || null;
    }
    _onItemClick(event) {
        if (this.selectable) {
            const current = this._selectedItem;
            const selected = event.target;
            if (current === selected) {
                return;
            }
            this._items.forEach((item) => {
                item.selected = (item === selected);
            });
            this._fire('change');
        }
    }
    get selected() {
        const item = this._selectedItem;
        if (item) {
            return item.value || item.name || this.textContent;
        }
        return null;
    }
    set selected(value) {
        if (this.selectable) {
            const current = this._selectedItem;
            const selected = this._items.find((item) => {
                return (item.value === value) || (item.name === value);
            });
            if (current === selected) {
                return;
            }
            this._items.forEach((item) => {
                item.selected = (item === selected);
            });
            this._fire('change');
        }
    }
    focus() {
        for (let i = 0; i < this._items.length; i++) {
            const item = this._items[i];
            if (item._focusable) {
                item.focus();
                this._lastActiveItem = item;
                return;
            }
        }
    }
    _focusItem(item) {
        if (item) {
            for (const r of this._items) {
                if (r === item) {
                    r._focusable = true;
                }
                else {
                    r._focusable = false;
                }
            }
            item.focus();
        }
        else {
            for (let i = 0; i < this._items.length; i++) {
                const r = this._items[i];
                if (i === 0) {
                    r._focusable = true;
                }
                else {
                    r._focusable = false;
                }
            }
        }
    }
};
WiredList.styles = [
    WiredBase.styles,
    css `
    :host {
      display: inline-block;
      opacity: 1;
      --wired-card-padding: 6px;
    }
    #container {
      gap: 2px;
    }
    #surface {
      display: block;
    }
    `
];
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], WiredList.prototype, "horizontal", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], WiredList.prototype, "selectable", void 0);
__decorate([
    queryAssignedNodes({ flatten: true }),
    __metadata("design:type", Array)
], WiredList.prototype, "_slotted", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], WiredList.prototype, "selected", null);
WiredList = __decorate([
    ce('wired-list')
], WiredList);
export { WiredList };

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
export let WiredTabBar = class WiredTabBar extends WiredBase {
    constructor() {
        super(...arguments);
        this.horizontal = false;
        this.selectable = false;
    }
    _forceRenderOnChange(changed) {
        return changed.has('horizontal');
    }
    render() {
        return html `
    <wired-card elevation="1" id="surface">
      <div id="container" class="${this.horizontal ? 'horiz' : 'vert'}" @item-click="${this._onItemClick}">
        <slot></slot>
      </div>
    </wired-card>`;
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
};
WiredTabBar.styles = [
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
    `
];
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], WiredTabBar.prototype, "horizontal", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], WiredTabBar.prototype, "selectable", void 0);
__decorate([
    queryAssignedNodes(),
    __metadata("design:type", Array)
], WiredTabBar.prototype, "_slotted", void 0);
WiredTabBar = __decorate([
    ce('wired-tab-bar')
], WiredTabBar);

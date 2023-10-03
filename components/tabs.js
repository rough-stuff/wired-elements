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
import { WiredList } from './list.js';
import './list.js';
import './card.js';
import './core/node-selector.js';
let WiredTabs = class WiredTabs extends WiredBase {
    constructor() {
        super(...arguments);
        this._selectedName = '';
    }
    get selected() {
        return this._list.selected;
    }
    set selected(value) {
        this._list.selected = value;
    }
    render() {
        return html `
    <div id="container" class="vert">
      <wired-list .renderer="${this.renderStyle}" horizontal selectable @change="${this._handleTabChange}">
        <slot name="tab"></slot>
      </wired-list>
      <wired-card id="surface" .renderer="${this.renderStyle}">
        <wired-node-selector selected="${this._selectedName}">
          <slot></slot>
        </wired-node-selector>
      </wired-card>
    </div>
    `;
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
    updated() {
        setTimeout(() => {
            this._selectedName = this._list.selected || '';
        }, 0);
    }
    _handleTabChange(event) {
        event.stopPropagation();
        this._selectedName = this._list.selected || '';
        this._fire('change');
    }
};
WiredTabs.styles = [
    WiredBase.styles,
    css `
    :host {
      display: block;
      opacity: 1;
    }
    #surface {
      margin-top: -2px;
    }
    wired-list {
      --wired-stroke-color: transparent;
    }
    `
];
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredTabs.prototype, "_selectedName", void 0);
__decorate([
    query('wired-list'),
    __metadata("design:type", WiredList)
], WiredTabs.prototype, "_list", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], WiredTabs.prototype, "selected", null);
WiredTabs = __decorate([
    ce('wired-tabs')
], WiredTabs);
export { WiredTabs };

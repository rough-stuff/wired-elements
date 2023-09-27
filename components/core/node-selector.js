var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, css, html } from 'lit';
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js';
import { property } from 'lit/decorators/property.js';
import { customElement } from 'lit/decorators/custom-element.js';
let WiredNodeSelector = class WiredNodeSelector extends LitElement {
    constructor() {
        super(...arguments);
        this._pageMap = new Map();
    }
    get _slottedItems() {
        return this._slotted || [];
    }
    render() {
        return html `<slot></slot>`;
    }
    firstUpdated() {
        this._pageMap.clear();
        const pages = this._slottedItems;
        for (const page of pages) {
            const name = page.getAttribute('name') || '';
            if (name) {
                name.trim().split(' ').forEach((nameSegment) => {
                    if (nameSegment) {
                        this._pageMap.set(nameSegment, page);
                    }
                });
            }
        }
    }
    getElement() {
        let e = undefined;
        if (this.selected) {
            e = this._pageMap.get(this.selected);
        }
        if (e) {
            return e;
        }
        return null;
    }
    updated() {
        const newPage = this.getElement();
        const samePage = newPage === this._current;
        if (this._current && (!samePage) && this._current.onDeactivate) {
            try {
                this._current.onDeactivate();
            }
            catch (err) {
                console.error(err);
            }
        }
        for (const p of this._slottedItems) {
            if (p === newPage) {
                p.style.display = '';
            }
            else {
                p.style.display = 'none';
            }
        }
        this._current = newPage || undefined;
        if (this._current && this._current.onActivate) {
            try {
                this._current.onActivate(this.selected || '');
            }
            catch (err) {
                console.error(err);
            }
        }
    }
};
WiredNodeSelector.styles = [
    css `
      :host {
        display: contents;
      }
    `
];
__decorate([
    property({ reflect: true }),
    __metadata("design:type", String)
], WiredNodeSelector.prototype, "selected", void 0);
__decorate([
    queryAssignedElements({ flatten: true }),
    __metadata("design:type", Array)
], WiredNodeSelector.prototype, "_slotted", void 0);
WiredNodeSelector = __decorate([
    customElement('wired-node-selector')
], WiredNodeSelector);
export { WiredNodeSelector };

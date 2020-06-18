var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { Options, wiredSvg } from 'wired-lib/lib/wired-lib';
import { LitElement, css, property } from 'lit-element';
const DEFAULT_CONFIG = {
    roughness: 0.1,
};
export class WiredIcon extends LitElement {
    constructor() {
        super(...arguments);
        this.config = DEFAULT_CONFIG;
    }
    static get styles() {
        return css `
          :host {
              display: block;
          }
        `;
    }
    connectedCallback() {
        super.connectedCallback();
        const svg = this.querySelector('svg');
        if (svg) {
            wiredSvg(svg, Object.assign(Object.assign({}, DEFAULT_CONFIG), this.config));
        }
    }
    createRenderRoot() {
        // No use for shadow DOM
        return this;
    }
}
__decorate([
    property({ type: Object, reflect: true }),
    __metadata("design:type", typeof (_a = typeof Options !== "undefined" && Options) === "function" ? _a : Object)
], WiredIcon.prototype, "config", void 0);

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { property, LitElement, html, css } from 'lit-element';
import 'wired-icon';
import { iconsetLoader } from './iconset';
import { ICON_SET } from './iconset/iconset-full';
const findSvgPath = iconsetLoader(ICON_SET);
export class WiredMatIcon extends LitElement {
    constructor() {
        super(...arguments);
        this._icon = '';
        this._path = '';
        this.config = {};
    }
    static get styles() {
        return css `
    :host {
      display: block;
    }
  `;
    }
    get icon() {
        return this._icon;
    }
    set icon(value) {
        this._icon = value;
        this._path = findSvgPath(this.icon);
    }
    render() {
        return html `
      <wired-icon .config=${this.config}>
        <svg viewbox="-1 -1 24 26" aria-labelledby="title">
          <title id="title">${this.icon}</title>
          <path d="${this._path}"/>
        </svg>
      </wired-icon>
    `;
    }
}
__decorate([
    property({ type: Object, reflect: true }),
    __metadata("design:type", Object)
], WiredMatIcon.prototype, "config", void 0);
__decorate([
    property({ type: String, reflect: true }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], WiredMatIcon.prototype, "icon", null);

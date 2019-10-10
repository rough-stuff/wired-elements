var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBaseElement, BaseCSS } from './wired-base-element';
import { customElement, property, query, css, html } from 'lit-element';
import { rectangle, line } from './core';
let WiredButton = class WiredButton extends WiredBaseElement {
    constructor() {
        super(...arguments);
        this.elevation = 1;
        this.disabled = false;
    }
    static get styles() {
        return [
            BaseCSS,
            css `
        :host {
          display: inline-block;
          font-size: 14px;
        }
        path {
          transition: transform 0.05s ease;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px;
          color: inherit;
          outline: none;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button:active path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        button:focus path {
          stroke-width: 1.5;
        }
        button::-moz-focus-inner {
          border: 0;
        }
      `
        ];
    }
    render() {
        return html `
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
    }
    canvasSize() {
        if (this.button) {
            const size = this.button.getBoundingClientRect();
            const elev = Math.min(Math.max(1, this.elevation), 5);
            const w = size.width + ((elev - 1) * 2);
            const h = size.height + ((elev - 1) * 2);
            return [w, h];
        }
        return this.lastSize;
    }
    draw(svg, size) {
        const elev = Math.min(Math.max(1, this.elevation), 5);
        const s = {
            width: size[0] - ((elev - 1) * 2),
            height: size[1] - ((elev - 1) * 2)
        };
        rectangle(svg, 0, 0, s.width, s.height);
        for (let i = 1; i < elev; i++) {
            (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(75 - (i * 10)) / 100}`;
            (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(75 - (i * 10)) / 100}`;
            (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(75 - (i * 10)) / 100}`;
            (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(75 - (i * 10)) / 100}`;
        }
    }
};
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredButton.prototype, "elevation", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredButton.prototype, "disabled", void 0);
__decorate([
    query('button'),
    __metadata("design:type", HTMLButtonElement)
], WiredButton.prototype, "button", void 0);
WiredButton = __decorate([
    customElement('wired-button')
], WiredButton);
export { WiredButton };

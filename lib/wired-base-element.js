var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, query, css } from 'lit-element';
export const BaseCSS = css `
:host {
  opacity: 0;
}
:host(.wired-rendered) {
  opacity: 1;
}
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
svg {
  display: block;
}
path {
  stroke: currentColor;
  stroke-width: 0.7;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;
export class WiredBaseElement extends LitElement {
    constructor() {
        super(...arguments);
        this.lastSize = [0, 0];
    }
    updated() {
        this.wiredRender();
    }
    wiredRender(force = false) {
        if (this.svg) {
            const size = this.canvasSize();
            if ((!force) && (size[0] === this.lastSize[0]) && (size[1] === this.lastSize[1])) {
                return;
            }
            while (this.svg.hasChildNodes()) {
                this.svg.removeChild(this.svg.lastChild);
            }
            this.svg.setAttribute('width', `${size[0]}`);
            this.svg.setAttribute('height', `${size[1]}`);
            this.draw(this.svg, size);
            this.lastSize = size;
            this.classList.add('wired-rendered');
        }
    }
}
__decorate([
    query('svg'),
    __metadata("design:type", SVGSVGElement)
], WiredBaseElement.prototype, "svg", void 0);

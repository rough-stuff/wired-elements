var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property, query } from './core/base-element.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { line } from './core/renderer.js';
let WiredLink = class WiredLink extends WiredBase {
    constructor() {
        super(...arguments);
        this.elevation = 1;
    }
    _forceRenderOnChange(changed) {
        return changed.has('elevation');
    }
    render() {
        return html `
    <a href="${ifDefined(this.href)}" target="${ifDefined(this.target)}">
      <div id="overlay">
        <svg></svg>
      </div>
      <div id="content">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </a>
    
    `;
    }
    focus() {
        var _a;
        (_a = this._anchor) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._anchor) === null || _a === void 0 ? void 0 : _a.blur();
    }
    _sizedNode() {
        return this._anchor || null;
    }
    _canvasSize() {
        if (this._anchor) {
            const { width, height } = this._anchor.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    draw(svg, size) {
        const [width, height] = size;
        const elev = Math.min(Math.max(1, this.elevation), 5);
        const randomizer = this._randomizer();
        for (let i = 0; i < elev; i++) {
            this._renderPath(svg, line([0, height - ((i + 1) * 2)], [width, height - ((i + 1) * 2)], randomizer, this.renderStyle, 0.5))
                .style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
        }
    }
};
WiredLink.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-block;
      }
      #overlay {
        pointer-events: initial;
      }
      #content {
        position: relative;
      }
      path {
        transition: transform 0.05s ease;
        --wired-stroke-color: var(--wired-primary, #0D47A1);
        stroke-width: 1;
      }
      a {
        display: inline-block;
      }
      a, a:hover, a:visited {
        color: inherit;
        outline: none;
        display: inline-block;
        white-space: nowrap;
        text-decoration: none;
        border: none;
        position: relative;
      }
      a:active path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }
      a:focus path {
        stroke-width: 1.5;
      }
      @media (hover: hover) {
        a:hover path {
          stroke-width: 1.3;
        }
      }
      `
];
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredLink.prototype, "elevation", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredLink.prototype, "href", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredLink.prototype, "target", void 0);
__decorate([
    query('a'),
    __metadata("design:type", HTMLAnchorElement)
], WiredLink.prototype, "_anchor", void 0);
WiredLink = __decorate([
    ce('wired-link')
], WiredLink);
export { WiredLink };

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
import { styleMap } from 'lit/directives/style-map.js';
import { rectangle, line, roundedRectangle } from './core/graphics.js';
import { renderSvgPath, fillSvgPath } from './core/svg-render.js';
export let WiredButton = class WiredButton extends WiredBase {
    constructor() {
        super(...arguments);
        this.elevation = 1;
        this.disabled = false;
        this.rounded = false;
        this.type = 'outlined';
    }
    render() {
        const padding = Math.max(0, (this.elevation - 1) * 3);
        const containerStyles = {
            padding: padding ? `0 ${this.rounded ? 0 : padding}px ${padding}px 0` : undefined
        };
        return html `
    <div id="container" style="${styleMap(containerStyles)}">
      <button ?disabled="${this.disabled}">
        <div id="overlay">
          <svg></svg>
        </div>
        <div id="content">
          <slot @slotchange="${() => this._wiredRender()}"></slot>
        </div>
      </button>
      
    </div>
    
    `;
    }
    focus() {
        if (this._button) {
            this._button.focus();
        }
        else {
            super.focus();
        }
    }
    blur() {
        if (this._button) {
            this._button.blur();
        }
        else {
            super.blur();
        }
    }
    _sizedNode() {
        return this._container || null;
    }
    _canvasSize() {
        if (this._container) {
            const { width, height } = this._container.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    _mergedShape(rect) {
        return (rect.overlay.length ? rect.overlay : rect.shape).filter((d, i) => {
            if (i === 0) {
                return true;
            }
            if (d.op === 'move') {
                return false;
            }
            return true;
        });
    }
    draw(svg) {
        if (this._button) {
            const { width, height } = this._button.getBoundingClientRect();
            const elev = Math.min(Math.max(1, this.elevation), 5);
            const elevOffset = 2;
            if (this.rounded) {
                const radius = (height / 2);
                const radiusOffset = radius - 10;
                const rect = roundedRectangle([2, 2], width - 4, height - 4, radius, this._randomizer);
                if (this.type === 'solid') {
                    fillSvgPath(svg, rect.overlay.length ? rect.overlay : rect.shape);
                }
                renderSvgPath(svg, rect);
                for (let i = 1; i < elev; i++) {
                    renderSvgPath(svg, line([radiusOffset + (i * elevOffset), height + (i * 2)], [width - radiusOffset - (i * elevOffset), height + (i * 2)], this._randomizer, true, 0.5))
                        .style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
                }
            }
            else {
                const rect = rectangle([2, 2], width - 4, height - 4, this._randomizer);
                if (this.type === 'solid') {
                    fillSvgPath(svg, this._mergedShape(rect));
                }
                renderSvgPath(svg, rect);
                for (let i = 1; i < elev; i++) {
                    [
                        line([i * elevOffset, height + (i * 2)], [width + (i * 2), height + (i * 2)], this._randomizer, true, 0.5),
                        line([width + (i * 2), height + (i * 2)], [width + (i * 2), i * elevOffset], this._randomizer, true, 0.5)
                    ].forEach((ops) => {
                        renderSvgPath(svg, ops).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
                    });
                }
            }
        }
    }
};
WiredButton.styles = [
    WiredBase.styles,
    css `
      :host {
        display: inline-block;
        font-size: 14px;
        min-width: 64px;
        text-transform: uppercase;
      }
      #overlay {
        pointer-events: initial;
      }
      #content {
        position: relative;
      }
      path {
        transition: transform 0.05s ease;
      }
      #container {
        width: 100%;
        position: relative;
      }
      button {
        display: block;
        cursor: pointer;
        outline: none;
        border-radius: 4px;
        overflow: hidden;
        color: inherit;
        user-select: none;
        font-family: inherit;
        text-align: center;
        font-size: inherit;
        letter-spacing: 1.25px;
        line-height: 1;
        padding: var(--wired-button-padding, 12px);
        text-transform: inherit;
        width: 100%;
        background: none;
        border: none;
      }
      button[disabled] {
        cursor: initial;
        pointer-events: none;
        opacity: 0.6 !important;
        --wired-fill-color: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
        background: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
        pointer-events: none;
      }
      button[disabled] #overlay {
        pointer-events: none;
      }
      button:active path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }
      button:focus path {
        stroke-width: 1.35;
      }
      button::-moz-focus-inner {
        border: 0;
      }
      @media (hover: hover) {
        button:hover path {
          stroke-width: 1;
        }
      }
      `
];
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredButton.prototype, "elevation", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredButton.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredButton.prototype, "rounded", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredButton.prototype, "type", void 0);
__decorate([
    query('button'),
    __metadata("design:type", HTMLButtonElement)
], WiredButton.prototype, "_button", void 0);
__decorate([
    query('#container'),
    __metadata("design:type", HTMLElement)
], WiredButton.prototype, "_container", void 0);
WiredButton = __decorate([
    ce('wired-button')
], WiredButton);

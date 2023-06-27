import { WiredBase, ce, html, TemplateResult, css, property, query, Point } from './core/base-element.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import { rectangle, line, roundedRectangle } from './core/graphics.js';
import { renderSvgPath } from './core/svg-render.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-button': WiredButton;
  }
}

@ce('wired-button')
export class WiredButton extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) rounded = false;
  @property() type: 'outlined' | 'filled' | 'solid' = 'outlined';

  @query('button') private _button?: HTMLButtonElement;
  @query('#container') private _container?: HTMLElement;

  static styles = [
    WiredBase.styles,
    css`
      :host {
        display: inline-block;
        font-size: 14px;
        min-width: 64px;
        text-transform: uppercase;
      }
      #overlay {
        pointer-events: initial;
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

  render(): TemplateResult {
    const padding = Math.max(0, (this.elevation - 1) * 3);
    const containerStyles: StyleInfo = {
      padding: padding ? `0 ${this.rounded ? 0 : padding}px ${padding}px 0` : undefined
    };

    return html`
    <div id="container" style="${styleMap(containerStyles)}">
      <button ?disabled="${this.disabled}">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
        <div id="overlay">
          <svg></svg>
        </div>
      </button>
      
    </div>
    
    `;
  }

  focus() {
    if (this._button) {
      this._button.focus();
    } else {
      super.focus();
    }
  }

  blur() {
    if (this._button) {
      this._button.blur();
    } else {
      super.blur();
    }
  }

  protected _sizedNode(): HTMLElement | null {
    return this._container || null;
  }

  protected _canvasSize(): Point {
    if (this._container) {
      const { width, height } = this._container.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement): void {
    if (this._button) {
      const { width, height } = this._button.getBoundingClientRect();
      const elev = Math.min(Math.max(1, this.elevation), 5);
      const elevOffset = 2;

      if (this.rounded) {
        const radius = (height / 2);
        const radiusOffset = radius - 10;
        // renderSvgPath(svg, line([radiusOffset, 2], [width - radiusOffset, 2], this._randomizer));
        // renderSvgPath(svg, line([radiusOffset, height - 2], [width - radiusOffset, height - 2], this._randomizer));
        // renderSvgPath(svg, arc([radiusOffset, height / 2], radius - 2, Math.PI / 2, Math.PI * 1.5, this._randomizer));

        renderSvgPath(svg, roundedRectangle([2, 2], width - 4, height - 4, radius, this._randomizer));
        for (let i = 1; i < elev; i++) {
          renderSvgPath(svg, line([radiusOffset + (i * elevOffset), height + (i * 2)], [width - radiusOffset - (i * elevOffset), height + (i * 2)], this._randomizer, true, 0.5))
            .style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
        }

      } else {
        renderSvgPath(svg, rectangle([2, 2], width - 4, height - 4, this._randomizer));
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
}
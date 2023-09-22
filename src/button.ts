import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues } from './core/base-element.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import { roundedRectangle, mergedShape } from './core/graphics.js';
import { fillSvgPath } from './core/svg-render.js';
import { rectangle, line } from './core/renderer.js';

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
  @property() type: 'outlined' | 'solid' = 'outlined';

  @query('button') private _button?: HTMLButtonElement;
  @query('#container') private _container?: HTMLElement;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return (changed.has('rounded') || changed.has('type'));
  }

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

  render(): TemplateResult {
    const padding = Math.max(0, (this.elevation - 1) * 3);
    const containerStyles: StyleInfo = {
      padding: padding ? `0 ${this.rounded ? 0 : padding}px ${padding}px 0` : undefined
    };

    return html`
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
      const elevOffset = 2 * (this.renderStyle !== 'classic' ? 2 : 1);
      const randomizer = this._randomizer();

      if (this.rounded) {
        const radius = (height / 2);
        const radiusOffset = radius - 10;
        const rect = roundedRectangle([2, 2], width - 4, height - 4, radius, randomizer);
        if (this.type === 'solid') {
          fillSvgPath(svg, rect.overlay.length ? rect.overlay : rect.shape);
        }
        this._renderPath(svg, rect);
        for (let i = 1; i < elev; i++) {
          const l = line([radiusOffset + (i * elevOffset), height + (i * 2)], [width - radiusOffset - (i * elevOffset), height + (i * 2)], randomizer, this.renderStyle, 0.5);
          this._renderPath(svg, l).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
        }

      } else {
        const rect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
        if (this.type === 'solid') {
          fillSvgPath(svg, mergedShape(rect));
        }
        this._renderPath(svg, rect);
        for (let i = 1; i < elev; i++) {
          [
            line([i * elevOffset, height + (i * 2)], [width + (i * 2), height + (i * 2)], randomizer, this.renderStyle, 0.5),
            line([width + (i * 2), height + (i * 2)], [width + (i * 2), i * elevOffset], randomizer, this.renderStyle, 0.5)
          ].forEach((ops) => {
            this._renderPath(svg, ops).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
          });
        }
      }

    }
  }
}
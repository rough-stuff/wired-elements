import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues } from './core/base-element.js';
import { rectangle, mergedShape } from './core/graphics.js';
import { fillSvgPath } from './core/svg-render.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-item': WiredItem;
  }
}

@ce('wired-item')
export class WiredItem extends WiredBase {
  @property() value = '';
  @property() name = '';
  @property({ type: Boolean }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('selected');
  }

  @query('button') private _button?: HTMLButtonElement;

  static styles = [
    WiredBase.styles,
    css`
      :host {
        display: inline-block;
        font-size: 14px;
        text-align: left;
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
        text-align: inherit;
        position: relative;
        display: block;
        cursor: pointer;
        outline: none;
        overflow: hidden;
        color: inherit;
        user-select: none;
        font-family: inherit;
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
      button::-moz-focus-inner {
        border: 0;
      }
      button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: currentColor;
        opacity: 0;
      }
      button::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--wired-fill-color, #64B5F6);
        opacity: 0;
      }
      button:focus::after {
        opacity: 0.1;
      }
      button:active::after {
        opacity: 0.2;
      }
      @media (hover: hover) {
        button:hover::before {
          opacity: 0.05;
        }
      }
      `
  ];

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}" @click="${this._onItemClick}">
      <div id="overlay"><svg></svg></div>
      <div id="content">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </button>
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
    return this._button || null;
  }

  protected _canvasSize(): Point {
    if (this._button) {
      const { width, height } = this._button.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    if (this.selected) {
      const [width, height] = size;
      const randomizer = this._randomizer();
      const rect = rectangle([2, 2], width - 4, height - 4, randomizer);
      fillSvgPath(svg, mergedShape(rect));
    }
  }

  private _onItemClick() {
    if (!this.disabled) {
      this._fire('item-click');
    }
  }
}
import { WiredBase, ce, html, TemplateResult, css, property, query, Point } from './core/base-element.js';
import { ellipse } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-icon-button': WiredIconButton;
  }
}

@ce('wired-icon-button')
export class WiredIconButton extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('button') private _button?: HTMLButtonElement;

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: inline-block;
      font-size: 14px;
    }
    path {
      stroke: var(--wired-stroke-color, currentColor);
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
      padding: var(--wired-button-padding, 12px);
      color: inherit;
      outline: none;
      border-radius: 50%;
    }
    button[disabled] {
      opacity: 0.6 !important;
      --wired-stroke-color: rgba(0, 0, 0, 0.35);
      --wired-fill-color: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
      background: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
      cursor: initial;
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
    return html`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${() => this._wiredRender()}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
  }

  focus() {
    this._button?.focus();
  }

  blur() {
    this._button?.blur();
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
    if (this._button) {
      const [width, height] = size;
      const randomizer = this._randomizer();
      this._renderPath(svg, ellipse([width / 2, height / 2], width - 4, height - 4, randomizer, this.renderStyle));
    }
  }
}
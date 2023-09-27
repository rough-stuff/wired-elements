import { WiredBase, ce, html, TemplateResult, css, property, query, Point } from './core/base-element.js';
import { fillSvgPath } from './core/svg-render.js';
import { ellipse } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-fab': WiredFab;
  }
}

@ce('wired-fab')
export class WiredFab extends WiredBase {
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
      stroke-width: 1;
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
      padding: var(--wired-button-padding, 16px);
      color: inherit;
      outline: none;
      border-radius: 50%;
      box-shadow: var(--wired-fab-shadow, 0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%));
    }
    button[disabled] {
      opacity: 0.6 !important;
      --wired-stroke-color: rgba(0, 0, 0, 0.35);
      --wired-fill-color: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
      background: var(--wired-button-disabled-bg, rgba(0, 0, 0, 0.07));
      cursor: initial;
      pointer-events: none;
      box-shadow: none;
    }
    button[disabled] #overlay {
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
    #content {
      position: relative;
    }
    @media (hover: hover) {
      button:hover path {
        stroke-width: 1.25;
      }
    }
    `
  ];

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}">
      <div id="overlay">
        <svg></svg>
      </div>
      <div id="content">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
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
      const shape = ellipse([width / 2, height / 2], width - 4, height - 4, randomizer, 'classic');
      fillSvgPath(svg, shape.overlay);
      this._renderPath(svg, ellipse([width / 2, height / 2], width - 4, height - 4, randomizer, this.renderStyle));
    }
  }
}
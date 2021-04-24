import { WiredBase, BaseCSS, Point } from './wired-base';
import { ellipse } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-icon-button')
export class WiredIconButton extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @query('button') private button?: HTMLButtonElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
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
          border-radius: 50%;
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
        button ::slotted(*) {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
  }

  protected canvasSize(): Point {
    if (this.button) {
      const size = this.button.getBoundingClientRect();
      return [size.width, size.height];
    }
    return this.lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const min = Math.min(size[0], size[1]);
    svg.setAttribute('width', `${min}`);
    svg.setAttribute('height', `${min}`);
    ellipse(svg, min / 2, min / 2, min, min, this.seed);
  }
}
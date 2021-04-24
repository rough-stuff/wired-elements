import { WiredBase, BaseCSS, Point } from './wired-base';
import { hachureEllipseFill } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-fab')
export class WiredFab extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @query('button') private button?: HTMLButtonElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          font-size: 14px;
          color: #fff;
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
          padding: 16px;
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
        button::-moz-focus-inner {
          border: 0;
        }
        button ::slotted(*) {
          position: relative;
          font-size: var(--wired-icon-size, 24px);
          transition: transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.85;
        }
        path {
          stroke: var(--wired-fab-bg-color, #018786);
          stroke-width: 3;
          fill: transparent;
        }

        button:focus ::slotted(*) {
          opacity: 1;
        }
        button:active ::slotted(*) {
          opacity: 1;
          transform: scale(1.15);
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}">
      <div id="overlay">
        <svg></svg>
      </div>
      <slot @slotchange="${this.wiredRender}"></slot>
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
    const g = hachureEllipseFill(min / 2, min / 2, min, min, this.seed);
    svg.appendChild(g);
  }
}
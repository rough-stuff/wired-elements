import { LitElement, customElement, property, query, css, CSSResult, TemplateResult, html } from 'lit-element';
import { rectangle, line } from './core';

@customElement('wired-button')
export class WiredButton extends LitElement {
  @property({ type: Number }) elevation = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @query('svg') private svg?: SVGSVGElement;
  @query('button') private button?: HTMLButtonElement;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      opacity: 0;
      font-size: 14px;
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
    `;
  }

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.drawShape}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
  }

  updated() {
    this.drawShape();
  }

  private drawShape() {
    if (this.svg && this.button) {
      const svg = this.svg;
      while (svg.hasChildNodes()) {
        svg.removeChild(svg.lastChild!);
      }
      const s = this.button.getBoundingClientRect();
      const elev = Math.min(Math.max(1, this.elevation), 5);
      const w = s.width + ((elev - 1) * 2);
      const h = s.height + ((elev - 1) * 2);
      svg.setAttribute('width', `${w}`);
      svg.setAttribute('height', `${h}`);
      rectangle(svg, 0, 0, s.width, s.height);
      for (let i = 1; i < elev; i++) {
        (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(75 - (i * 10)) / 100}`;
        (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(75 - (i * 10)) / 100}`;
        (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(75 - (i * 10)) / 100}`;
        (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(75 - (i * 10)) / 100}`;
      }
      this.classList.add('wired-rendered');
    }
  }
}
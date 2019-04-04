import { WiredBase, customElement, property, TemplateResult, html, css, CSSResult, query } from 'wired-lib/lib/wired-base';
import { rectangle, line } from 'wired-lib';

@customElement('wired-button')
export class WiredButton extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('svg')
  private svg?: SVGSVGElement;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      font-size: 14px;
      text-transform: uppercase;
      outline: none;
    }
    :host(.wired-pending) {
      opacity: 0;
    }
    button {
      cursor: pointer;
      outline: none;
      border-radius: 4px;
      color: inherit;
      user-select: none;
      position: relative;
      font-family: inherit;
      text-align: center;
      font-size: inherit;
      letter-spacing: 1.25px;
      padding: 10px;
      text-transform: inherit;
      background: none;
      border: none;
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
    button:hover::before {
      opacity: 0.05;
    }
    button:focus::before {
      opacity: 0.08;
    }
    button:disabled {
      opacity: 0.8;
      color: var(--soso-disabled-color, #808080);
      cursor: initial;
      pointer-events: none;
    }
    button:disabled::before {
      opacity: 0.2;
    }
    #overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      will-change: transform;
      transition: transform 0.2s ease;
    }
    svg {
      display: block;
    }
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }
    button:active #overlay {
      transform: scale(0.97);
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}">
      <span>
        <slot></slot>
      </span>
      <div id="overlay">
        <svg id="svg"></svg>
      </div>
    </button>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
  }

  firstUpdated() {
    setTimeout(() => this.requestUpdate());
  }

  updated() {
    const svg = this.svg!;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
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
    this.classList.remove('wired-pending');
  }
}
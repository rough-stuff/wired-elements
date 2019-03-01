import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { rectangle, line } from 'wired-lib';

@customElement('wired-button')
export class WiredButton extends LitElement {
  @property({ type: Number }) elevation = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      font-family: inherit;
      cursor: pointer;
      padding: 8px 10px;
      position: relative;
      text-align: center;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      display: inline-flex;
      outline: none;
    }

    :host(.wired-pending) {
      opacity: 0;
    }

    :host(:active) path {
      transform: scale(0.97) translate(1.5%, 1.5%);
    }

    :host(.wired-disabled) {
      opacity: 0.6 !important;
      background: rgba(0, 0, 0, 0.07);
      cursor: default;
      pointer-events: none;
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }

    .overlay {
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
    `;
  }

  render(): TemplateResult {
    return html`
    <slot></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
  }

  firstUpdated() {
    this.addEventListener('keydown', (event) => {
      if ((event.keyCode === 13) || (event.keyCode === 32)) {
        event.preventDefault();
        this.click();
      }
    });
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', this.textContent || this.innerText);
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
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

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }
}
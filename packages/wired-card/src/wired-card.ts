import { LitElement, customElement, property, TemplateResult, html, css, CSSResult } from 'lit-element';
import { rectangle, line } from 'wired-lib';

@customElement('wired-card')
export class WiredCard extends LitElement {
  @property({ type: Number }) elevation = 1;

  private resizeHandler?: EventListenerOrEventListenerObject;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
    }
  
    :host(.wired-pending) {
      opacity: 0;
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
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div>
      <slot @slotchange="${() => this.requestUpdate()}"></slot>
    </div>
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

  connectedCallback() {
    super.connectedCallback();
    if (!this.resizeHandler) {
      this.resizeHandler = this.debounce(this.updated.bind(this), 200, false, this);
      window.addEventListener('resize', this.resizeHandler);
    }
    setTimeout(() => this.updated());
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      delete this.resizeHandler;
    }
  }

  private debounce(func: Function, wait: number, immediate: boolean, context: HTMLElement): EventListenerOrEventListenerObject {
    let timeout = 0;
    return () => {
      const args = arguments;
      const later = () => {
        timeout = 0;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  updated() {
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
      (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }
    this.classList.remove('wired-pending');
  }
}
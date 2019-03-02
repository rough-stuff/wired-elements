import { LitElement, customElement, property, TemplateResult, html, css, CSSResult } from 'lit-element';
import { rectangle, polygon } from 'wired-lib';

@customElement('wired-progress')
export class WiredProgress extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) percentage = false;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      width: 400px;
      height: 42px;
      font-family: sans-serif;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
  
    .labelContainer {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .progressLabel {
      color: var(--wired-progress-label-color, #000);
      font-size: var(--wired-progress-font-size, 18px);
    }
  
    .progbox {
      fill: var(--wired-progress-color, rgba(0, 0, 200, 0.1));
      stroke-opacity: 0.6;
      stroke-width: 0.4;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this.getProgressLabel()}</div>
    </div>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
  }

  private getProgressLabel(): string {
    if (this.percentage) {
      if (this.max === this.min) {
        return '%';
      } else {
        const pct = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100);
        return (pct + '%');
      }
    } else {
      return ('' + this.value);
    }
  }

  updated() {
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    rectangle(svg, 0, 0, s.width, s.height);

    let pct = 0;
    if (this.max > this.min) {
      pct = (this.value - this.min) / (this.max - this.min);
      const progWidth = s.width * Math.max(0, Math.min(pct, 100));
      const progBox = polygon(svg, [
        [0, 0],
        [progWidth, 0],
        [progWidth, s.height],
        [0, s.height]
      ]);
      progBox.classList.add('progbox');
    }
    this.classList.remove('wired-pending');
  }
}
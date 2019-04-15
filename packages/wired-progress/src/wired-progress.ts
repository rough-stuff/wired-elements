import { WiredBase, customElement, property, TemplateResult, html, css, CSSResult } from 'wired-lib/lib/wired-base';
import { rectangle, hachureFill } from 'wired-lib';

@customElement('wired-progress')
export class WiredProgress extends WiredBase {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) percentage = false;

  private box?: SVGElement;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      width: 400px;
      height: 42px;
      font-family: sans-serif;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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
      font-size: var(--wired-progress-font-size, 14px);
      background: var(--wired-progress-label-background, rgba(255,255,255,0.9));
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 1.25px;
    }
  
    .progbox path {
      stroke: var(--wired-progress-color, rgba(0, 0, 200, 0.8));
      stroke-width: 2.75;
      fill: none;
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
    if (!this.box) {
      this.box = rectangle(svg, 0, 0, s.width, s.height);
    } else {
      svg.appendChild(this.box);
    }

    let pct = 0;
    if (this.max > this.min) {
      pct = (this.value - this.min) / (this.max - this.min);
      const progWidth = s.width * Math.max(0, Math.min(pct, 100));
      const progBox = hachureFill([
        [0, 0],
        [progWidth, 0],
        [progWidth, s.height],
        [0, s.height]
      ]);
      svg.appendChild(progBox);
      progBox.classList.add('progbox');
    }
    this.classList.add('wired-rendered');
  }
}
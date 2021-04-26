import { WiredBase, BaseCSS, Point } from './wired-base';
import { ellipse, arc } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-progress-ring')
export class WiredProgressRing extends WiredBase {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean }) hideLabel = false;
  @property({ type: Boolean }) showLabelAsPercent = false;
  @property({ type: Number }) precision = 0;

  private progArc?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        position: relative;
        width: 200px;
        font-family: sans-serif;
      }
      #overlay {
        position: relative;
      }
      path.progressArc {
        stroke-width: 10px;
        stroke: var(--wired-progress-color, blue);
      }
      #labelPanel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        align-content: center;
        align-items: center;
        justify-content: center;
        justify-items: center;
      }
      `
    ];
  }

  render(): TemplateResult {
    let label = `${this.value}`;
    if (this.showLabelAsPercent) {
      const pct = 100 * Math.min(1, Math.max(0, (this.value - this.min) / (this.max - this.min)));
      if (this.precision) {
        label = `${pct.toPrecision(this.precision)}%`;
      } else {
        label = `${Math.round(pct)}%`;
      }
    }
    return html`
    <div id="overlay" class="overlay">
      <svg></svg>
    </div>
    
    ${this.hideLabel ? '' : html`
    <div id="labelPanel">
      <div>${label}</div>
    </div>
    `}

    `;
  }

  wiredRender(force = false) {
    super.wiredRender(force);
    this.refreshProgressFill();
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.width];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const [x, y, w, h] = [size[0] / 2, size[1] / 2, size[0] - 10, size[1] - 10];
    ellipse(svg, x, y, w, h, this.seed);

  }

  private refreshProgressFill() {
    if (this.progArc) {
      if (this.progArc.parentElement) {
        this.progArc.parentElement.removeChild(this.progArc);
      }
      this.progArc = undefined;
    }
    if (this.svg) {
      const size = this.canvasSize();
      const [x, y, w, h] = [size[0] / 2, size[1] / 2, size[0] - 10, size[1] - 10];
      const pct = Math.min(1, Math.max(0, (this.value - this.min) / (this.max - this.min)));
      if (pct) {
        this.progArc = arc(this.svg, x, y, w, h, -Math.PI / 2, 2 * Math.PI * pct - Math.PI / 2, this.seed);
        this.progArc.classList.add('progressArc');
      }
    }
  }
}
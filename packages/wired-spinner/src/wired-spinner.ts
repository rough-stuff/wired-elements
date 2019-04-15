import { WiredBase, customElement, property, TemplateResult, html, css, CSSResult, query } from 'wired-lib/lib/wired-base';
import { ellipse, hachureEllipseFill, Point } from 'wired-lib';

@customElement('wired-spinner')
export class WiredSpinner extends WiredBase {
  @property({ type: Boolean }) spinning = false;
  @property({ type: Number }) duration = 1500;

  @query('svg')
  private svg?: SVGSVGElement;
  private knob?: SVGElement;

  private value = 0;
  private timerstart = 0;
  private frame = 0;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
    }

    #svg {
      display: block;
      width: 76px;
      height: 76px;
    }

    path {
      stroke: currentColor;
      stroke-opacity: 0.5;
      stroke-width: 1.5;
      fill: none;
    }
    .knob path {
      stroke-width: 2.8 !important;
      stroke-opacity: 1;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <svg id="svg"></svg>
    `;
  }

  firstUpdated() {
    if (this.svg) {
      ellipse(this.svg, 38, 38, 60, 60);
      this.knob = hachureEllipseFill(0, 0, 20, 20);
      this.knob.classList.add('knob');
      this.svg.appendChild(this.knob);
    }
    this.updateCursor();
    this.classList.add('wired-rendered');
  }

  updated() {
    if (this.spinning) {
      this.startSpinner();
    } else {
      this.stopSpinner();
    }
  }

  private startSpinner() {
    this.stopSpinner();
    this.value = 0;
    this.timerstart = 0;
    this.nextTick();
  }

  private stopSpinner() {
    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  private nextTick() {
    this.frame = window.requestAnimationFrame((t) => this.tick(t));
  }

  private tick(t: number) {
    if (this.spinning) {
      if (!this.timerstart) {
        this.timerstart = t;
      }
      this.value = Math.min(1, (t - this.timerstart) / this.duration);
      this.updateCursor();
      if (this.value >= 1) {
        this.value = 0;
        this.timerstart = 0;
      }
      this.nextTick();
    } else {
      this.frame = 0;
    }
  }

  private updateCursor() {
    if (this.knob) {
      const position: Point = [
        Math.round(38 + 25 * Math.cos(this.value * Math.PI * 2)),
        Math.round(38 + 25 * Math.sin(this.value * Math.PI * 2))
      ];
      this.knob.style.transform = `translate3d(${position[0]}px, ${position[1]}px, 0) rotateZ(${Math.round(this.value * 360 * 2)}deg)`;
    }
  }
}
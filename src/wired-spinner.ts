import { WiredBase, BaseCSS, Point } from './wired-base';
import { ellipse, hachureEllipseFill } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-spinner')
export class WiredSpinner extends WiredBase {
  @property({ type: Boolean }) spinning = false;
  @property({ type: Number }) duration = 1500;

  private knob?: SVGElement;
  private value = 0;
  private timerstart = 0;
  private frame = 0;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
        }
        path {
          stroke: currentColor;
          stroke-opacity: 0.65;
          stroke-width: 1.5;
          fill: none;
        }
        .knob {
          stroke-width: 2.8 !important;
          stroke-opacity: 1;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`<svg></svg>`;
  }

  protected canvasSize(): Point {
    return [76, 76];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    ellipse(svg, size[0] / 2, size[1] / 2, Math.floor(size[0] * 0.8), Math.floor(0.8 * size[1]), this.seed);
    this.knob = hachureEllipseFill(0, 0, 20, 20, this.seed);
    this.knob.classList.add('knob');
    svg.appendChild(this.knob);
    this.updateCursor();
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

  updated() {
    super.updated();
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
}
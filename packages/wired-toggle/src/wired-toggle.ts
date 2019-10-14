import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';
import { customElement, property, css, TemplateResult, html, CSSResultArray, query } from 'lit-element';
import { rectangle, hachureEllipseFill, ellipse, Point, svgNode, fire } from 'wired-lib';

@customElement('wired-toggle')
export class WiredToggle extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('input') private input?: HTMLInputElement;

  private knob?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
      }
      :host([disabled]) {
        opacity: 0.4 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        opacity: 0;
      }
      .knob {
        transition: transform 0.3s ease;
      }
      .knob path {
        stroke-width: 0.7;
      }
      .knob.checked {
        transform: translateX(48px);
      }
      .knobfill path {
        stroke-width: 3 !important;
        fill: transparent;
      }
      .knob.unchecked .knobfill path {
        stroke: var(--wired-toggle-off-color, gray);
      }
      .knob.checked .knobfill path {
        stroke: var(--wired-toggle-on-color, rgb(63, 81, 181));
      }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div style="position: relative;">
      <svg></svg>
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}"  @change="${this.onChange}">
    </div>
    `;
  }

  focus() {
    if (this.input) {
      this.input.focus();
    } else {
      super.focus();
    }
  }

  wiredRender(force = false) {
    super.wiredRender(force);
    this.refreshKnob();
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshKnob();
    fire(this, 'change', { checked: this.checked });
  }

  protected canvasSize(): Point {
    return [80, 34];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 16, 8, size[0] - 32, 18);
    this.knob = svgNode('g');
    this.knob.classList.add('knob');
    svg.appendChild(this.knob);
    const knobFill = hachureEllipseFill(16, 16, 32, 32);
    knobFill.classList.add('knobfill');
    this.knob.appendChild(knobFill);
    ellipse(this.knob, 16, 16, 32, 32);
  }

  private refreshKnob() {
    if (this.knob) {
      const cl = this.knob.classList;
      if (this.checked) {
        cl.remove('unchecked');
        cl.add('checked');
      } else {
        cl.remove('checked');
        cl.add('unchecked');
      }
    }
  }
}
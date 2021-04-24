import { WiredBase, BaseCSS, Point } from './wired-base';
import { ellipse, svgNode } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-radio')
export class WiredRadio extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name?: string;
  @property() private focused = false;

  @query('input') private input?: HTMLInputElement;

  private svgCheck?: SVGElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
      :host {
        display: inline-block;
        font-family: inherit;
      }
      :host([disabled]) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
      :host([disabled]) svg {
        background: rgba(0, 0, 0, 0.07);
      }

      #container {
        display: flex;
        flex-direction: row;
        position: relative;
        user-select: none;
        min-height: 24px;
        cursor: pointer;
      }
      span {
        margin-left: 1.5ex;
        line-height: 24px;
      }
      input {
        opacity: 0;
      }
      path {
        stroke: var(--wired-radio-icon-color, currentColor);
        stroke-width: var(--wired-radio-default-swidth, 0.7);
      }
      g path {
        stroke-width: 0;
        fill: var(--wired-radio-icon-color, currentColor);
      }
      #container.focused {
        --wired-radio-default-swidth: 1.5;
      }
      `
    ];
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
    this.refreshCheckVisibility();
  }

  render(): TemplateResult {
    return html`
    <label id="container" class="${this.focused ? 'focused' : ''}">
      <input type="checkbox" .checked="${this.checked}" ?disabled="${this.disabled}" 
        @change="${this.onChange}"
        @focus="${() => this.focused = true}"
        @blur="${() => this.focused = false}">
      <span><slot></slot></span>
      <div id="overlay"><svg></svg></div>
    </label>
    `;
  }

  private onChange() {
    this.checked = this.input!.checked;
    this.refreshCheckVisibility();
    this.fire('change', { checked: this.checked });
  }

  protected canvasSize(): Point {
    return [24, 24];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    ellipse(svg, size[0] / 2, size[1] / 2, size[0], size[1], this.seed);
    this.svgCheck = svgNode('g');
    svg.appendChild(this.svgCheck);
    const iw = Math.max(size[0] * 0.6, 5);
    const ih = Math.max(size[1] * 0.6, 5);
    ellipse(this.svgCheck, size[0] / 2, size[1] / 2, iw, ih, this.seed);
  }

  private refreshCheckVisibility() {
    if (this.svgCheck) {
      this.svgCheck.style.display = this.checked ? '' : 'none';
    }
  }
}
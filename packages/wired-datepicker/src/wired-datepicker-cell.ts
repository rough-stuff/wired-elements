import { ellipse, Point } from 'wired-lib';
import { customElement, css, TemplateResult, CSSResultArray, property, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';

@customElement('wired-datepicker-cell')
export class WiredDatePickerCell extends WiredBase {
    @property({ type: Number }) index = 0;
    @property({ type: Boolean, reflect: true }) selected: boolean = false;
    @property({ type: Boolean, reflect: true }) disabled: boolean = false;
    @property({ type: Boolean, reflect: true }) hasFocus: boolean = false;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        #overlay {
          top: -3;
          left: -3;
        }
        :host {
            display: inline-block;
            position: relative;
        }
        :host(:focus) {
          outline: none;
        }
        .wrapper:not(.selected):not(.focus) path {
          stroke: transparent;
        }
        .wrapper.selected.focus path {
          stroke: var(--wired-datepicker-selected-color, red);
          stroke-width: 2.5;
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: dash 0.8s ease-in forwards;
        }
        @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
        }
        .wrapper.selected path {
          stroke: var(--wired-datepicker-selected-color, red);
          stroke-width: 1.5;
        }
        .wrapper.disabled {
          color: var(--wired-datepicker-cell-disabled, lightgray);
          cursor: not-allowed;
        }
        .wrapper:not(.selected):not(.disabled):hover {
          cursor: pointer;
          background-color: var(--wired-datepicker-cell-bg-hover-color, lightgray);
        }
        `
      ];
    }

  constructor() {
    super();
    // We allow focus on cell programmatically
    this.tabIndex = -1;
    this.addEventListener('focus', this.toggleFocus.bind(this));
    this.addEventListener('blur', this.toggleFocus.bind(this));
  }

  render(): TemplateResult {
    const classes = {
      "wrapper": true,
      "selected": this.selected,
      "disabled": this.disabled,
      "focus": this.hasFocus,
    };
    return html`
      <div class=${classMap(classes)}>
          <slot @slotchange="${this.wiredRender}"></slot>
          <div id="overlay">
              <svg></svg>
          </div>
      </div>
    `;
  }

  disconnectedCallback() {
    this.removeEventListener('focus', this.toggleFocus.bind(this));
    this.removeEventListener('blur', this.toggleFocus.bind(this));
  }

  /**
   * Compute the available size for the selection ellipse
   */
  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  /**
   * Draw the selection ellipse if selected
   * @param svg the svg node in the template
   * @param size computed size of the canvas
   */
  protected draw(svg: SVGSVGElement, size: Point) {
    const width = size[0]*1.1;
    const height = size[1]*1.1;
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    const c = ellipse(svg, width / 2, height / 2, width*0.9, height);
    svg.appendChild(c);
  }

  private toggleFocus(e: Event) {
    if (e.type === 'focus') {
      this.hasFocus = true;
    } else {
      this.hasFocus = false;
    }
  }
}

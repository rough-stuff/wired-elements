import { ellipse, Point } from 'wired-lib';
import { customElement, css, TemplateResult, CSSResultArray, property, html } from 'lit-element';
import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';

@customElement('wired-datepicker-cell')
export class WiredDatePickerCell extends WiredBase {
    @property({ type: Number }) index = 0;
    @property({ type: Boolean, reflect: true }) 
    get selected() {
        return this.classList.contains('selected');
    };

    set selected(value: boolean) {
        this.classList.toggle('selected', value);
        if (this.svg) this.draw(this.svg, this.canvasSize());
    }

    @property({ type: Boolean, reflect: true }) 
    get disabled() {
        return this.classList.contains('disabled');
    };

    set disabled(value: boolean) {
        this.classList.toggle('disabled', value);
    }

    private _hasFocus: boolean = false;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
            display: inline-block;
            position: relative;
        }
        :host path {
            color: transparent;
        }
        :host(.selected), :host(.selected:hover) {
            cursor: default;
        }
        :host(:not(.selected):not(.disabled):hover) {
            cursor: pointer;
            background-color: var(--wired-datepicker-cell-bg-hover-color, lightgray);
        }
        :host(:focus) path {
            stroke: gray;
            stroke-width: 1.5;
            stroke-dasharray: 4;
        }
        :host(:focus) {
            outline: none;
        }
        :host(.selected) path {
            stroke: var(--wired-datepicker-selected-color, red);
            stroke-width: 2.5;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: dash 0.8s ease-in forwards;
        }
        :host(.selected:focus) path {
            stroke: var(--wired-datepicker-selected-color, red);
            stroke-width: 2.5;
        }
        :host(.disabled), :host(.selected.disabled:hover) {
            color: var(--wired-datepicker-cell-disabled, lightgray);
            cursor: not-allowed;
        }
        @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
        }
        #overlay {
            top: -3;
            left: -3;
        }
      `
    ];
  }

  constructor() {
    super();
    // We allow focus on cell programmatically
    this.tabIndex = -1;
    this.addEventListener('focus', () => {this._hasFocus = true; this.wiredRender(true)});
    this.addEventListener('blur', () => this._hasFocus = false);
  }

  render(): TemplateResult {
    return html`
        <slot @slotchange="${this.wiredRender}"></slot>
        <div id="overlay">
            <svg></svg>
        </div>
    `;
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
    if (!this.selected && !this._hasFocus) {
      while (svg.hasChildNodes()) {
        svg.removeChild(svg.lastChild!);
      }
      return;
    }
    const width = size[0]*1.1;
    const height = size[1]*1.1;
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    const c = ellipse(svg, width / 2, height / 2, width*0.9, height);
    svg.appendChild(c);
  }

}

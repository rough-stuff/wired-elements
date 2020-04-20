import { ellipse, Point } from 'wired-lib';
import { customElement, css, TemplateResult, CSSResultArray, property, html } from 'lit-element';
import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';

@customElement('wired-datepicker-cell')
export class WiredDatePickerCell extends WiredBase {
    @property({ type: Number }) content = 0;
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

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
            display: inline-block;
        }
        :host(.selected), :host(.selected:hover) {
            cursor: default;
        }
        :host(:not(.selected):not(.disabled):hover) {
            cursor: pointer;
            background-color: var(--wired-datepicker-cell-bg-hover-color, lightgray);
        }
        :host(.selected) path {
            stroke: var(--wired-datepicker-selected-color, red);
            stroke-width: 2.5;
        }
        :host(.disabled), :host(.selected.disabled:hover) {
            color: var(--wired-datepicker-cell-disabled, lightgray);
            cursor: not-allowed;
        }
        #overlay {
            top: -3;
            left: -3;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div style="position: relative;">
        <slot @slotchange="${this.wiredRender}"></slot>
        <div id="overlay">
            <svg></svg>
        </div>
    </div>
    `;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    if (!this.selected) {
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

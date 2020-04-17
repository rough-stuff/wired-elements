import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';
import { ellipse, Point } from 'wired-lib';
import { customElement, css, TemplateResult, html, CSSResultArray, property } from 'lit-element';

@customElement('wired-calendar-cell')
export class WiredCalendarCell extends WiredBase {
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
        :host(.disabled) {
            color: var(--wired-calendar-cell-disabled, lightgray);
            cursor: not-allowed;
        }
        :host(.selected), :host(.selected:hover) {
            cursor: default;
        }
        :host(:not(.selected):not(.disabled):hover) {
            cursor: pointer;
            background-color: var(--wired-calendar-cell-hover-color, lightgray);
        }
        :host(.selected) path {
            stroke: var(--wired-calendar-cell-selected, red);
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
    svg.appendChild(c);height
  }
}

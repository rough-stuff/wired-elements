import {
  WiredBase,
  customElement,
  property,
  TemplateResult,
  html,
  css,
  CSSResult
} from 'wired-lib/lib/wired-base';
import { styleMap } from 'lit-html/directives/style-map';
import { line } from 'wired-lib';
// import { repeat } from 'lit-html/directives/repeat';
import 'wired-item';

function debounce(
  func: Function,
  wait: number,
  immediate: boolean,
  context: HTMLElement
): EventListenerOrEventListenerObject {
  let timeout = 0;
  return () => {
    const args = arguments;
    const later = () => {
      timeout = 0;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

@customElement('wired-cell')
export class WiredCell extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        display: table-cell;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.4rem;
      }

      @media screen and (max-width: 580px) {
        :host {
          display: block;
          font-size: 0.8em;
          text-align: right;
        }
        :host::before {
          content: attr(data-label);
          float: left;
          font-weight: bold;
          text-transform: uppercase;
        }
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}

@customElement('wired-row')
export class WiredRow extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  static get styles(): CSSResult {
    return css`
      :host {
        display: contents;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}

@customElement('wired-column')
export class WiredColumn extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        display: table-cell;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0.4rem;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}

@customElement('wired-columns')
export class WiredColumns extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';

  static get styles(): CSSResult {
    return css`
      :host {
        display: contents;
      }
      @media screen and (max-width: 580px) {
        :host {
          display: none;
        }
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
    `;
  }
}

@customElement('wired-table')
export class WiredTable extends WiredBase {
  private resizeHandler?: EventListenerOrEventListenerObject;

  static get styles(): CSSResult {
    return css`
      :host {
        flex: 1;
        display: block;
        padding-bottom: 2em;
        position: relative;
      }

      :host(.wired-rendered) {
        opacity: 1;
      }

      .table-container {
        display: grid;
        border-collapse: collapse;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      svg {
        display: block;
      }

      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }

      @media screen and (max-width: 580px) {
        .table-container {
          grid-template-columns: minmax(300px, auto) !important;
        }
      }
    `;
  }

  render(): TemplateResult {
    const columns: NodeList = this.querySelectorAll('wired-column');
    const columnWidths = {
      'grid-template-columns': `repeat(${columns.length}, 150px)`
    };

    return html`
      <div class="table-container" style=${styleMap(columnWidths)}>
        <slot @slotchange="${() => this.requestUpdate()}"></slot>
      </div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.resizeHandler) {
      this.resizeHandler = debounce(this.updated.bind(this), 200, false, this);
      window.addEventListener('resize', this.resizeHandler);
    }
    setTimeout(() => this.updated());
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      delete this.resizeHandler;
    }
  }

  firstUpdated() {
    const columns: NodeList = this.querySelectorAll('wired-column');
    columns.forEach((col, i) => {
      const column = col as HTMLElement;
      const cells: NodeList = this.querySelectorAll<HTMLElement>(
        `wired-cell:nth-child(${i + 1})`
      );
      cells.forEach((c) => {
        const cell = c as HTMLElement;
        cell.setAttribute('data-label', column.innerText);
      });
    });
  }

  updated() {
    const svg = (this.shadowRoot!.getElementById(
      'svg'
    ) as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    // Draw Border
    // rectangle(svg, 2, 2, s.width - 4, s.height - 4);
    if (s.width > 580) {
      // Draw Column Lines
      line(svg, 4, 4, 4, s.height - 12);
      const columns: NodeList = this.querySelectorAll('wired-column');
      columns.forEach((c, i) => {
        const column: HTMLElement = c as HTMLElement;
        const colsize = column.getBoundingClientRect();
        const offset = colsize.width * (i + 1);
        line(svg, offset, 4, offset, s.height - 12);
      });

      // Draw Row Lines
      line(svg, 4, 2, s.width - 12, 2);
      const rows: NodeList = this.querySelectorAll('wired-columns, wired-row');
      const cell: HTMLElement | null = this.querySelector('wired-cell');
      const cellsize: any = cell
        ? cell.getBoundingClientRect()
        : { width: 0, height: 0 };
      rows.forEach((_r, j) => {
        const offset = cellsize.height * (j + 1);
        line(svg, 4, offset, s.width - 4, offset);
      });
    } else {
      line(svg, 4, 2, s.width - 12, 2);
      const cells: NodeList = this.querySelectorAll('wired-cell');
      cells.forEach((c, j) => {
        const cell: HTMLElement = c as HTMLElement;
        const cellsize = cell.getBoundingClientRect();
        const offset = cellsize.height * (j + 1);
        line(svg, 4, offset, s.width - 4, offset);
      });
    }

    this.classList.add('wired-rendered');
  }
}

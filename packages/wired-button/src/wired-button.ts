import { WiredBase, BaseCSS, ResizeObserver } from 'wired-lib/lib/wired-base';
import { rectangle, line, Point } from 'wired-lib';
import { customElement, property, query, css, TemplateResult, html, CSSResultArray } from 'lit-element';

@customElement('wired-button')
export class WiredButton extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('button') private button?: HTMLButtonElement;

  private resizeObserver?: ResizeObserver;

  constructor() {
    super();
    if ((window as any).ResizeObserver) {
      this.resizeObserver = new (window as any).ResizeObserver(() => {
        if (this.svg) {
          this.wiredRender(true);
        }
      });
    }
  }

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          font-size: 14px;
        }
        path {
          transition: transform 0.05s ease;
        }
        button {
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          letter-spacing: 1.25px;
          text-transform: uppercase;
          text-align: center;
          padding: 10px;
          color: inherit;
          outline: none;
        }
        button[disabled] {
          opacity: 0.6 !important;
          background: rgba(0, 0, 0, 0.07);
          cursor: default;
          pointer-events: none;
        }
        button:active path {
          transform: scale(0.97) translate(1.5%, 1.5%);
        }
        button:focus path {
          stroke-width: 1.5;
        }
        button::-moz-focus-inner {
          border: 0;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <button ?disabled="${this.disabled}">
      <slot @slotchange="${this.wiredRender}"></slot>
      <div id="overlay">
        <svg></svg>
      </div>
    </button>
    `;
  }

  focus() {
    if (this.button) {
      this.button.focus();
    } else {
      super.focus();
    }
  }

  protected canvasSize(): Point {
    if (this.button) {
      const size = this.button.getBoundingClientRect();
      const elev = Math.min(Math.max(1, this.elevation), 5);
      const w = size.width + ((elev - 1) * 2);
      const h = size.height + ((elev - 1) * 2);
      return [w, h];
    }
    return this.lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const s = {
      width: size[0] - ((elev - 1) * 2),
      height: size[1] - ((elev - 1) * 2)
    };
    rectangle(svg, 0, 0, s.width, s.height);
    for (let i = 1; i < elev; i++) {
      (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(75 - (i * 10)) / 100}`;
      (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(75 - (i * 10)) / 100}`;
      (line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = `${(75 - (i * 10)) / 100}`;
      (line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = `${(75 - (i * 10)) / 100}`;
    }
  }

  updated() {
    super.updated();
    this.attachResizeListener();
  }

  disconnectedCallback() {
    this.detachResizeListener();
  }

  private attachResizeListener() {
    if (this.button && this.resizeObserver && this.resizeObserver.observe) {
      this.resizeObserver.observe(this.button);
    }
  }

  private detachResizeListener() {
    if (this.button && this.resizeObserver && this.resizeObserver.unobserve) {
      this.resizeObserver.unobserve(this.button);
    }
  }
}
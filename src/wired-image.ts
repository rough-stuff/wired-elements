import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle, line } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const EMPTY_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

@customElement('wired-image')
export class WiredImage extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) src: string = EMPTY_IMAGE;
  private resizeObserver?: ResizeObserver;
  private windowResizeHandler?: EventListenerOrEventListenerObject;
  private roAttached = false;

  constructor() {
    super();
    if ((window as any).ResizeObserver) {
      this.resizeObserver = new (window as any).ResizeObserver(() => {
        if (this.svg) {
          this.wiredRender();
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
          position: relative;
          line-height: 1;
          padding: 3px;
        }
        img {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <img src="${this.src}">
    <div id="overlay"><svg></svg></div>
    `;
  }

  updated() {
    super.updated();
    this.attachResizeListener();
  }

  disconnectedCallback() {
    this.detachResizeListener();
  }

  private attachResizeListener() {
    if (!this.roAttached) {
      if (this.resizeObserver && this.resizeObserver.observe) {
        this.resizeObserver.observe(this);
      } else if (!this.windowResizeHandler) {
        this.windowResizeHandler = () => this.wiredRender();
        window.addEventListener('resize', this.windowResizeHandler, { passive: true });
      }
      this.roAttached = true;
    }
  }

  private detachResizeListener() {
    if (this.resizeObserver && this.resizeObserver.unobserve) {
      this.resizeObserver.unobserve(this);
    }
    if (this.windowResizeHandler) {
      window.removeEventListener('resize', this.windowResizeHandler);
    }
    this.roAttached = false;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const w = s.width + ((elev - 1) * 2);
    const h = s.height + ((elev - 1) * 2);
    return [w, h];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const s = {
      width: size[0] - ((elev - 1) * 2),
      height: size[1] - ((elev - 1) * 2)
    };
    rectangle(svg, 2, 2, s.width - 4, s.height - 4, this.seed);
    for (let i = 1; i < elev; i++) {
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }
  }
}
import { WiredBase, BaseCSS, Point } from './wired-base';
import { line } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-divider')
export class WiredDivider extends WiredBase {
  @property({ type: Number }) elevation = 1;

  private resizeObserver?: ResizeObserver;
  private windowResizeHandler?: EventListenerOrEventListenerObject;
  private roAttached = false;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: block;
          position: relative;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`<svg></svg>`;
  }

  protected canvasSize(): Point {
    const size = this.getBoundingClientRect();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    return [size.width, elev * 6];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    for (let i = 0; i < elev; i++) {
      line(svg, 0, (i * 6) + 3, size[0], (i * 6) + 3, this.seed);
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
    if (!this.roAttached) {
      if (this.resizeObserver) {
        this.resizeObserver.observe(this);
      } else if (!this.windowResizeHandler) {
        this.windowResizeHandler = () => this.wiredRender();
        window.addEventListener('resize', this.windowResizeHandler, { passive: true });
      }
      this.roAttached = true;
    }
  }

  private detachResizeListener() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this);
    }
    if (this.windowResizeHandler) {
      window.removeEventListener('resize', this.windowResizeHandler);
    }
    this.roAttached = false;
  }
}
import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle, line, hachureFill, } from './wired-lib';
import { css, TemplateResult, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('wired-card')
export class WiredCard extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) fill?: string;
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

  static get styles() {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 10px;
        }
        path.cardFill {
          stroke-width: 3.5;
          stroke: var(--wired-card-background-fill);
        }
        path {
          stroke: var(--wired-card-background-fill, currentColor);
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div id="overlay"><svg></svg></div>
    <div style="position: relative;">
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
    `;
  }

  updated(changed: PropertyValues) {
    const force = changed.has('fill');
    this.wiredRender(force);
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
    if (this.fill && this.fill.trim()) {
      const fillNode = hachureFill([
        [2, 2],
        [s.width - 4, 2],
        [s.width - 2, s.height - 4],
        [2, s.height - 4]
      ], this.seed);
      fillNode.classList.add('cardFill');
      svg.style.setProperty('--wired-card-background-fill', this.fill.trim());
      svg.appendChild(fillNode);
    }
    rectangle(svg, 2, 2, s.width - 4, s.height - 4, this.seed);
    for (let i = 1; i < elev; i++) {
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }
  }
}
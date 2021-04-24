import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import './wired-item.js';

@customElement('wired-tab')
export class WiredTab extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: String }) label = '';
  private resizeObserver?: ResizeObserver;
  private windowResizeHandler?: EventListenerOrEventListenerObject;

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
          padding: 10px;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <div>
      <slot @slotchange="${this.wiredRender}"></slot>
    </div>
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
    if (this.resizeObserver && this.resizeObserver.observe) {
      this.resizeObserver.observe(this);
    } else if (!this.windowResizeHandler) {
      this.windowResizeHandler = () => this.wiredRender();
      window.addEventListener('resize', this.windowResizeHandler, { passive: true });
    }
  }

  private detachResizeListener() {
    if (this.resizeObserver && this.resizeObserver.unobserve) {
      this.resizeObserver.unobserve(this);
    }
    if (this.windowResizeHandler) {
      window.removeEventListener('resize', this.windowResizeHandler);
    }
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, s: Point) {
    rectangle(svg, 2, 2, s[0] - 4, s[1] - 4, this.seed);
  }
}
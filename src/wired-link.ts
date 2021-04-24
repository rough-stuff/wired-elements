import { WiredBase, BaseCSS, Point } from './wired-base';
import { line } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-link')
export class WiredLink extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property({ type: String }) href?: string;
  @property({ type: String }) target?: string;
  @query('a') private anchor?: HTMLAnchorElement;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
        }
        a, a:hover, a:visited {
          color: inherit;
          outline: none;
          display: inline-block;
          white-space: nowrap;
          text-decoration: none;
          border: none;
        }
        path {
          stroke: var(--wired-link-decoration-color, blue);
          stroke-opacity: 0.45;
        }
        a:focus path {
          stroke-opacity: 1;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <a href="${this.href}" target="${this.target || ''}">
      <slot></slot>
      <div id="overlay"><svg></svg></div>
    </a>
    `;
  }

  focus() {
    if (this.anchor) {
      this.anchor.focus();
    } else {
      super.focus();
    }
  }

  protected canvasSize(): Point {
    if (this.anchor) {
      const size = this.anchor.getBoundingClientRect();
      const elev = Math.min(Math.max(1, this.elevation), 5);
      const w = size.width;
      const h = size.height + ((elev - 1) * 2);
      return [w, h];
    }
    return this.lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const s = {
      width: size[0],
      height: size[1] - ((elev - 1) * 2)
    };
    for (let i = 0; i < elev; i++) {
      line(svg, 0, s.height + (i * 2) - 2, s.width, s.height + (i * 2) - 2, this.seed);
      line(svg, 0, s.height + (i * 2) - 2, s.width, s.height + (i * 2) - 2, this.seed);
    }
  }
}
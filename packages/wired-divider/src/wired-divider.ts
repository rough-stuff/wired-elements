import { customElement, property, css, TemplateResult, html, CSSResultArray } from 'lit-element';
import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';
import { line, Point } from 'wired-lib';

@customElement('wired-divider')
export class WiredDivider extends WiredBase {
  @property({ type: Number }) elevation = 1;

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
      line(svg, 0, (i * 6) + 3, size[0], (i * 6) + 3);
    }
  }
}
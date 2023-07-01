import { WiredBase, ce, html, TemplateResult, css, property, Point, PropertyValues } from './core/base-element.js';
import { line } from './core/graphics.js';
import { renderSvgPath } from './core/svg-render.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-divider': WiredDivider;
  }
}

@ce('wired-divider')
export class WiredDivider extends WiredBase {
  @property({ type: Boolean, reflect: true }) vertical = false;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('vertical');
  }

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: block;
      width: 100%;
      height: 4px;
      position: relative;
    }
    :host([vertical]) {
      width: 4px;
      height: auto;
    }
    path {
      stroke-width: var(--wired-divider-width, 1);
    }
    `
  ];

  render(): TemplateResult {
    return html`
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  protected _sizedNode(): HTMLElement | null {
    return this;
  }

  protected _canvasSize(): Point {
    const { width, height } = this.getBoundingClientRect();
    return [width, height];
  }

  protected draw(svg: SVGSVGElement): void {
    const { width, height } = this.getBoundingClientRect();
    const randomizer = this._randomizer();
    if (this.vertical) {
      renderSvgPath(svg, line([width / 2, 0], [width / 2, height], randomizer));
    } else {
      renderSvgPath(svg, line([0, height / 2], [width, height / 2], randomizer));
    }
  }
}
import { WiredBase, ce, html, TemplateResult, css, property, Point, query } from './core/base-element.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import { mergedShape } from './core/graphics.js';
import { fillSvgPath } from './core/svg-render.js';
import { rectangle, line } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-card': WiredCard;
  }
}

@ce('wired-card')
export class WiredCard extends WiredBase {
  @property({ type: Number }) elevation = 1;

  @query('#outer') private _outer?: HTMLElement;
  @query('#inner') private _inner?: HTMLElement;

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: inline-block;
    }
    #outer {
      position: relative;
    }
    #inner {
      padding: var(--wired-card-padding, 16px);
      position: relative;
    }
    .wired-fill-shape path {
      stroke: none;
      fill: var(--wired-fill-color, none);
    }
    `
  ];

  render(): TemplateResult {
    const padding = Math.max(0, (this.elevation - 1) * 3);
    const containerStyles: StyleInfo = {
      padding: padding ? `0 ${padding}px ${padding}px 0` : undefined
    };

    return html`
    <div id="outer" style="${styleMap(containerStyles)}">
      <div id="overlay">
        <svg></svg>
      </div>
      <div id="inner">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </div>
    `;
  }

  protected _sizedNode(): HTMLElement | null {
    return this._outer || null;
  }

  protected _canvasSize(): Point {
    if (this._outer) {
      const { width, height } = this._outer.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement): void {
    if (this._inner) {
      const { width, height } = this._inner.getBoundingClientRect();
      const elev = Math.min(Math.max(1, this.elevation), 5);
      const elevOffset = 2 * (this.renderStyle !== 'classic' ? 10 : 1);
      const randomizer = this._randomizer();
      const rect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
      fillSvgPath(svg, mergedShape(rect));
      this._renderPath(svg, rect);
      for (let i = 1; i < elev; i++) {
        [
          line([i * elevOffset, height + (i * 2)], [width + (i * 2), height + (i * 2)], randomizer, this.renderStyle, 0.5),
          line([width + (i * 2), height + (i * 2)], [width + (i * 2), i * elevOffset], randomizer, this.renderStyle, 0.5)
        ].forEach((ops) => {
          this._renderPath(svg, ops).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
        });
      }
    }
  }
}
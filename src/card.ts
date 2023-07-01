import { WiredBase, ce, html, TemplateResult, css, property, Point, query } from './core/base-element.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import { rectangle, line, mergedShape } from './core/graphics.js';
import { renderSvgPath, fillSvgPath } from './core/svg-render.js';

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
      const elevOffset = 2;
      const randomizer = this._randomizer();
      const rect = rectangle([2, 2], width - 4, height - 4, randomizer);
      fillSvgPath(svg, mergedShape(rect));
      renderSvgPath(svg, rect);
      for (let i = 1; i < elev; i++) {
        [
          line([i * elevOffset, height + (i * 2)], [width + (i * 2), height + (i * 2)], randomizer, true, 0.5),
          line([width + (i * 2), height + (i * 2)], [width + (i * 2), i * elevOffset], randomizer, true, 0.5)
        ].forEach((ops) => {
          renderSvgPath(svg, ops).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
        });
      }
    }
  }
}
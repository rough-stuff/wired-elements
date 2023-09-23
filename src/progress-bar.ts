import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues } from './core/base-element.js';
import { mergedShape } from './core/graphics.js';
import { fillSvgPath, createGroup } from './core/svg-render.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { rectangle, line } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-progress-bar': WiredProgressBar;
  }
}

@ce('wired-progress-bar')
export class WiredProgressBar extends WiredBase {
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Number }) value = 0;

  @query('#container') private _container?: HTMLElement;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return (changed.has('indeterminate') || changed.has('value'));
  }

  static styles = [
    WiredBase.styles,
    css`
      :host {
        display: inline-block;
        width: 200px;
        height: 20px;
      }
      #container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #progressBarMarker {
        animation: progress-indeterminate-translate var(--wired-progress-bar-animation-duration, 2s) infinite linear;
      }
      @keyframes progress-indeterminate-translate {
        from {
          transform: translateX(-35%);
        }
        to {
          transform: translateX(100%);
        }
      }
      `
  ];

  render(): TemplateResult {
    const cc: ClassInfo = {
      indeterminate: this.indeterminate
    };
    return html`
    <div id="container" class="${classMap(cc)}">
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    
    `;
  }

  protected _sizedNode(): HTMLElement | null {
    return this._container || null;
  }

  protected _canvasSize(): Point {
    if (this._container) {
      const { width, height } = this._container.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    const [width, height] = size;
    const randomizer = this._randomizer();
    const outerRect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
    if (this.value && (!this.indeterminate)) {
      const value = Math.max(0, Math.min(this.value || 0, 1));
      const valueFill = rectangle([2, 2], value * (width - 4), height - 4, randomizer, this.renderStyle);
      fillSvgPath(svg, mergedShape(valueFill));
      const valueMarker = line([value * (width - 2), 2], [value * (width - 2), height - 2], randomizer, this.renderStyle);
      this._renderPath(svg, valueMarker);
    }
    if (this.indeterminate) {
      const v = 0.333;
      const g = createGroup(svg, 'progressBarMarker');
      const valueFill = rectangle([2, 2], v * (width - 4), height - 4, randomizer, this.renderStyle);
      fillSvgPath(g, mergedShape(valueFill));
      this._renderPath(g, line([2, 2], [2, height - 2], randomizer, this.renderStyle));
      this._renderPath(g, line([v * (width - 2), 2], [v * (width - 2), height - 2], randomizer, this.renderStyle));
    }
    this._renderPath(svg, outerRect);
  }
}
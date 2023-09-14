import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues } from './core/base-element.js';
import { rectangle, line, mergedShape, ellipse } from './core/graphics.js';
import { renderSvgPath, fillSvgPath, createGroup } from './core/svg-render.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-progress-ring': WiredProgressRing;
  }
}

@ce('wired-progress-ring')
export class WiredProgressRing extends WiredBase {
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
        width: 140px;
        height: 140px;
      }
      #container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      #progressBarMarker {
        animation: progress-indeterminate-translate var(--wired-progress-ring-animation-duration, 2s) infinite linear;
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
    const diameter = Math.min(width, height);
    const randomizer = this._randomizer();
    const track = ellipse([width / 2, height / 2], diameter - 4, diameter - 4, randomizer);
    renderSvgPath(svg, track);

    // if (this.value && (!this.indeterminate)) {
    //   const value = Math.max(0, Math.min(this.value || 0, 1));
    //   const valueFill = rectangle([2, 2], value * (width - 4), height - 4, randomizer);
    //   fillSvgPath(svg, mergedShape(valueFill));
    //   const valueMarker = line([value * (width - 2), 2], [value * (width - 2), height - 2], randomizer);
    //   renderSvgPath(svg, valueMarker);
    // }
    // if (this.indeterminate) {
    //   const v = 0.333;
    //   const g = createGroup(svg, 'progressBarMarker');
    //   const valueFill = rectangle([2, 2], v * (width - 4), height - 4, randomizer);
    //   fillSvgPath(g, mergedShape(valueFill));
    //   renderSvgPath(g, line([2, 2], [2, height - 2], randomizer));
    //   renderSvgPath(g, line([v * (width - 2), 2], [v * (width - 2), height - 2], randomizer));
    // }
  }
}
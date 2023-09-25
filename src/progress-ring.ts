import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues } from './core/base-element.js';
import { arc } from './core/graphics.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { ellipse } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-progress-ring': WiredProgressRing;
  }
}

@ce('wired-progress-ring')
export class WiredProgressRing extends WiredBase {
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Number }) value = 0;
  @property({ type: Number, attribute: 'indicator-width' }) indicatorWidth = 6;

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
      #progressValueArc {
        --wired-stroke-color: var(--wired-primary, #0D47A1);
      }
      #progressValueArc path {
        stroke-width: var(--wired-progress-value-width, 6);
      }
      #progressValueArc.indeterminate path {
        transform-origin: center center;
        animation: progress-indeterminate-translate var(--wired-progress-ring-animation-duration, 1s) infinite linear;
      }
      @keyframes progress-indeterminate-translate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      `
  ];

  render(): TemplateResult {
    const cc: ClassInfo = {
      indeterminate: this.indeterminate
    };
    return html`
    <div id="container" class="${classMap(cc)}" style="--wired-progress-value-width: ${this.indicatorWidth};">
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
    const shapeWidth = diameter - this.indicatorWidth - 4;
    const track = ellipse([width / 2, height / 2], shapeWidth, shapeWidth, randomizer, this.renderStyle);
    this._renderPath(svg, track);
    if (this.value && (!this.indeterminate)) {
      const value = Math.max(0, Math.min(this.value || 0, 1));
      const valueArc = arc([width / 2, height / 2], shapeWidth / 2, -(Math.PI / 2), value * 2 * Math.PI - (Math.PI / 2), randomizer);
      const node = this._renderPath(svg, valueArc, 'classic');
      node.setAttribute('id', 'progressValueArc');
      node.removeAttribute('filter');
    }
    if (this.indeterminate) {
      const v = 0.2;
      const valueArc = arc([width / 2, height / 2], shapeWidth / 2, -(Math.PI / 2), v * 2 * Math.PI - (Math.PI / 2), randomizer);
      const g = this._renderPath(svg, valueArc, 'classic');
      g.setAttribute('id', 'progressValueArc');
      g.removeAttribute('filter');
      g.classList.add('indeterminate');
    }
  }
}
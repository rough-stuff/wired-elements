import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues } from './core/base-element.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { line } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-link': WiredLink;
  }
}

@ce('wired-link')
export class WiredLink extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property() href?: string;
  @property() target?: string;

  @query('a') private _anchor?: HTMLAnchorElement;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('elevation');
  }

  static styles = [
    WiredBase.styles,
    css`
      :host {
        display: inline-block;
      }
      #overlay {
        pointer-events: initial;
      }
      #content {
        position: relative;
      }
      path {
        transition: transform 0.05s ease;
        --wired-stroke-color: var(--wired-primary, #0D47A1);
        stroke-width: 1;
      }
      a {
        display: inline-block;
      }
      a, a:hover, a:visited {
        color: inherit;
        outline: none;
        display: inline-block;
        white-space: nowrap;
        text-decoration: none;
        border: none;
        position: relative;
      }
      a:active path {
        transform: scale(0.97) translate(1.5%, 1.5%);
      }
      a:focus path {
        stroke-width: 1.5;
      }
      @media (hover: hover) {
        a:hover path {
          stroke-width: 1.3;
        }
      }
      `
  ];

  render(): TemplateResult {
    return html`
    <a href="${ifDefined(this.href)}" target="${ifDefined(this.target)}">
      <div id="overlay">
        <svg></svg>
      </div>
      <div id="content">
        <slot @slotchange="${() => this._wiredRender()}"></slot>
      </div>
    </a>
    
    `;
  }

  focus() {
    this._anchor?.focus();
  }

  blur() {
    this._anchor?.blur();
  }

  protected _sizedNode(): HTMLElement | null {
    return this._anchor || null;
  }

  protected _canvasSize(): Point {
    if (this._anchor) {
      const { width, height } = this._anchor.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    const [width, height] = size;
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const randomizer = this._randomizer();
    for (let i = 0; i < elev; i++) {
      this._renderPath(svg, line([0, height - ((i + 1) * 2)], [width, height - ((i + 1) * 2)], randomizer, this.renderStyle, 0.5))
        .style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
    }
  }
}
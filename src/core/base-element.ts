import { LitElement, css, CSSResultGroup, PropertyValues } from 'lit';
export { html, css, TemplateResult, PropertyValues } from 'lit';
export { property, query, state, customElement as ce } from 'lit/decorators.js';
import { query } from 'lit/decorators/query.js';
import { Randomizer } from './random';
import { property } from 'lit/decorators.js';
import { RenderOps, RenderStyle, ResolvedRenderStyle } from './graphics';
import { createGroup, fillSvgPath, renderSvgPath } from './svg-render';

export type Point = [number, number];

export class UIEvent<T> extends Event {
  private _detail?: T;
  constructor(name: string, detail?: T) {
    super(name, { bubbles: true, composed: true });
    this._detail = detail;
  }
  get detail(): T | undefined {
    return this._detail;
  }
}

export abstract class WiredBase extends LitElement {
  @property() renderer: RenderStyle = 'inherit';
  @query('svg') protected svg?: SVGSVGElement;

  protected _lastSize: Point = [0, 0];
  protected _ro?: ResizeObserver;
  protected _roAttached = false;
  private _seed = Math.floor(Math.random() * 2 ** 31);

  static styles: CSSResultGroup = css`
    * {box-sizing: border-box;}
    [hidden] {display: none !important;}
    .horiz {display: flex; flex-direction: row;}
    .vert {display: flex; flex-direction: column;}
    .center {align-items: center;}
    .center2 {justify-content: center; align-items: center;}
    .flex {flex: 1;}
    .wrap {flex-wrap: wrap;}
    :host {
      opacity: 0;
    }
    :host(.wired-rendered) {
      opacity: 1;
    }
    #overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
    svg {
      display: block;
    }
    path {
      stroke: var(--wired-stroke-color, #000);
      stroke-width: 0.7;
      fill: transparent;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .wired-fill-shape path {
      stroke: none;
      fill: var(--wired-fill-color, #64B5F6);
    }
    .wired-fill-shape-as-stroke path {
      stroke: none;
      fill: var(--wired-stroke-color, #000);
    }
    .wired-fill-shape-as-stroke-group {
      transform: scale(0.99);
      transform-origin: center center;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => {
        if (this.svg) {
          this._wiredRender();
        }
      });
    }
  }

  protected _fire(name: string, detail?: unknown): void {
    this.dispatchEvent(new UIEvent(name, detail));
  }

  protected get renderStyle(): ResolvedRenderStyle {
    if ((!this.renderer) || (this.renderer === 'inherit')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (window as any)._wired_renderer || 'classic';
    }
    return this.renderer;
  }

  protected _resetSvg(size: Point, svg?: SVGSVGElement) {
    if (!svg) {
      svg = this.svg;
    }
    if (!svg) {
      return;
    }
    while (svg.hasChildNodes() && svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    svg.setAttribute('width', `${size[0]}`);
    svg.setAttribute('height', `${size[1]}`);

    if (this.renderStyle === 'pencil') {
      svg.innerHTML = `<defs>
        <filter x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" id="wiredTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="5" stitchTiles="stitch" result="f1">
          </feTurbulence>
          <feColorMatrix type="matrix" values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5" result="f2">
          </feColorMatrix>
          <feComposite operator="in" in2="f2b" in="SourceGraphic" result="f3">
          </feComposite>
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" result="noise">
          </feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2" in="f3" result="f4">
          </feDisplacementMap>
        </filter>
      </defs>`;
    }
    return svg;
  }

  protected _setRendered() {
    this.classList.add('wired-rendered');
  }

  protected _wiredRender(force = false) {
    if (this.svg) {
      const size = this._canvasSize();
      if ((!force) && (size[0] === this._lastSize[0]) && (size[1] === this._lastSize[1])) {
        return;
      }
      this._resetSvg(size, this.svg);
      this.draw(this.svg, size);
      this._lastSize = size;
      this._setRendered();
    }
  }

  updated(changed: PropertyValues) {
    this._wiredRender(this._forceRenderOnChange(changed) || changed.has('renderer'));
    this._attachResizeListener();
  }

  disconnectedCallback() {
    this.detachResizeListener();
  }

  private _attachResizeListener() {
    if (this._roAttached) {
      return;
    }
    const node = this._sizedNode();
    if (node && this._ro) {
      this._ro.observe(node);
      this._roAttached = true;
    }
  }

  private detachResizeListener() {
    const node = this._sizedNode();
    if (node && this._ro) {
      this._ro.unobserve(node);
    }
    this._roAttached = false;
  }

  protected _randomizer() {
    return new Randomizer(this._seed);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _forceRenderOnChange(_changed: PropertyValues): boolean {
    return false;
  }

  protected _renderPath(svg: SVGElement, ops: RenderOps, overrideStyle?: ResolvedRenderStyle) {
    if ((overrideStyle || this.renderStyle) !== 'classic') {
      const g = createGroup(svg);
      g.classList.add('wired-fill-shape-as-stroke-group');
      for (const mops of (ops.textured || [])) {
        fillSvgPath(g, mops, true);
      }
      return g;
    } else {
      return renderSvgPath(svg, ops);
    }
  }


  protected abstract _sizedNode(): HTMLElement | null;

  protected abstract _canvasSize(): Point;

  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}
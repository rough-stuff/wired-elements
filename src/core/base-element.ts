import { LitElement, css, CSSResultGroup } from 'lit';
export { html, css, TemplateResult } from 'lit';
export { property, query, state, customElement as ce } from 'lit/decorators.js';
import { query } from 'lit/decorators/query.js';
import { Randomizer } from './random';

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
  @query('svg') protected svg?: SVGSVGElement;

  protected _lastSize: Point = [0, 0];
  protected _ro?: ResizeObserver;
  protected _roAttached = false;
  protected _randomizer = new Randomizer(Math.floor(Math.random() * 2 ** 31));

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
      stroke: var(--wired-stroke-color, currentColor);
      stroke-width: 0.7;
      fill: transparent;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    .wired-fill-shape path {
      stroke: none;
      fill: var(--wired-fill-color, #64B5F6);
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => {
        if (this.svg) {
          this._wiredRender(false);
        }
      });
    }
  }

  protected _fire(name: string, detail?: unknown): void {
    this.dispatchEvent(new UIEvent(name, detail));
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

  updated() {
    this._wiredRender();
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

  protected abstract _sizedNode(): HTMLElement | null;

  protected abstract _canvasSize(): Point;

  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}
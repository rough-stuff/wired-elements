import { LitElement, css, PropertyValues } from 'lit';
import { query } from 'lit/decorators.js';

export type Point = [number, number];

export const BaseCSS = css`
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
  stroke: currentColor;
  stroke-width: 0.7;
  fill: transparent;
}
.hidden {
  display: none !important;
}
`;

export abstract class WiredBase extends LitElement {
  @query('svg') protected svg?: SVGSVGElement;

  protected lastSize: Point = [0, 0];
  protected seed = Math.floor(Math.random() * 2 ** 31);

  updated(_changed?: PropertyValues) {
    this.wiredRender();
  }

  wiredRender(force = false) {
    if (this.svg) {
      const size = this.canvasSize();
      if ((!force) && (size[0] === this.lastSize[0]) && (size[1] === this.lastSize[1])) {
        return;
      }
      while (this.svg.hasChildNodes()) {
        this.svg.removeChild(this.svg.lastChild!);
      }
      this.svg.setAttribute('width', `${size[0]}`);
      this.svg.setAttribute('height', `${size[1]}`);
      this.draw(this.svg, size);
      this.lastSize = size;
      this.classList.add('wired-rendered');
    }
  }

  fire(name: string, detail?: any) {
    fireEvent(this, name, detail);
  }

  protected abstract canvasSize(): Point;
  protected abstract draw(svg: SVGSVGElement, size: Point): void;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

export function fireEvent(e: HTMLElement, name: string, detail?: any) {
  e.dispatchEvent(new CustomEvent(name, {
    composed: true,
    bubbles: true,
    detail
  }));
}
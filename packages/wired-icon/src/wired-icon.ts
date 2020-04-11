import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';
import { Point, Options, path } from '../../wired-lib/lib/wired-lib';
import { customElement, css, TemplateResult, html, CSSResultArray, property } from 'lit-element';

import { ICON_SET } from './icon-set';

@customElement('wired-icon')
export class WiredIcon extends WiredBase {
    @property() icon = 'build';
    @property({type: Object }) config: Options = { 
      roughness: 0.1,
      fill: 'black',
    };

    static get styles(): CSSResultArray {
        return [
          BaseCSS,
          css`
            :host {
              width: 100%;
            }`
        ];
    }

  render(): TemplateResult {
    return html`<svg></svg>`;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
      const { p, x, y } = ICON_SET[this.icon];
      const min = Math.min(size[0], size[1]);
      svg.setAttribute('width', `${min}`);
      svg.setAttribute('height', `${min}`);
      svg.setAttribute('viewBox', '-1 0 26 24');
      svg.setAttribute('x', x);
      svg.setAttribute('y', y);
      path(p, svg, this.config);
    }
}

import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';
import { Point, Options, path } from '../../wired-lib/lib/wired-lib';
import { customElement, TemplateResult, html, css, CSSResultArray, property } from 'lit-element';

import { ICON_SET } from './icon-set-action';

const DEFAULT_CONFIG = { 
  roughness: 0.1,
};

@customElement('wired-icon')
export class WiredIcon extends WiredBase {
    @property() icon = '';
    @property({type: Object }) config: Options = DEFAULT_CONFIG;

    static get styles(): CSSResultArray {
        return [
          BaseCSS,
          css`
              :host {
                  display: block;
              }
          `
        ];
    }

  render(): TemplateResult {
    return html`<svg viewBox="-1 0 26 24"></svg>`;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
      if (!this.icon) return;
      const svgPath = ICON_SET[this.icon];
      if (!path) return;
      const min = Math.min(size[0], size[1]);
      svg.setAttribute('width', `${min}`);
      svg.setAttribute('height', `${min}`);
      try {
        path(svgPath, svg, {...DEFAULT_CONFIG, ...this.config});
      } catch (e) {
        // Die in silence in case of failure
      }
    }
}

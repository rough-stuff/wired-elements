import { WiredBase, BaseCSS } from 'wired-lib/lib/wired-base';
import { Point, Options, path, svgNode } from 'wired-lib/lib/wired-lib';
import { customElement, TemplateResult, html, css, CSSResultArray, property } from 'lit-element';

const DEFAULT_CONFIG: Options = { 
  roughness: 0.1,
};

@customElement('wired-icon')
export class WiredIcon extends WiredBase {
    @property({ type: Object, reflect: true }) config: Options = DEFAULT_CONFIG;
    @property({ type: String, reflect: true }) path = '';
    @property({ type: String, reflect: true }) aria = '';

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
    if (!this.path) return;
    const min = Math.min(size[0], size[1]);
    svg.setAttribute('width', `${min}`);
    svg.setAttribute('height', `${min}`);
    this.addAriaLabel(svg, this.aria);
    try {
      path(this.path, svg, {...DEFAULT_CONFIG, ...this.config});
    } catch (e) {
      // Die in silence in case of failure
    }
  }

  private addAriaLabel(svg: SVGSVGElement, iconName: string) {
    svg.setAttribute('aria-labelledby', 'title');
    const titleNode = svgNode('title', {id : 'title'});
    titleNode.innerHTML = `${iconName} icon`;
    svg.appendChild(titleNode);

  }
}

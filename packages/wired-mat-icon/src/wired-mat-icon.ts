import { customElement, property, LitElement, html, TemplateResult, css } from 'lit-element';
import 'wired-icon';
import { iconsetLoader } from './iconset';
import { ICON_SET } from './iconset/iconset-full';

const findSvgPath = iconsetLoader(ICON_SET);

@customElement('wired-mat-icon')
export class WiredMatIcon extends LitElement {
static get styles() {
  return css`
    :host {
      display: block;
    }
  `;
}

  private _icon: string = '';
  private _path: string = '';

  @property({ type: Object, reflect: true }) config: Object = {};

  @property({ type: String, reflect: true })
  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
    this._path = findSvgPath(this.icon);
  }

  render(): TemplateResult {
    return html`
      <wired-icon .config=${this.config}>
        <svg viewbox="-1 -1 24 26" aria-labelledby="title">
          <title id="title">${this.icon}</title>
          <path d="${this._path}"/>
        </svg>
      </wired-icon>
    `;
  }
}

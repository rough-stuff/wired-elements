import { Options, wiredSvg } from 'wired-lib/lib/wired-lib';
import { LitElement, css, CSSResultArray, property } from 'lit-element';

const DEFAULT_CONFIG: Options = { 
  roughness: 0.1,
};

export class WiredIcon extends LitElement {
  @property({ type: Object, reflect: true }) config: Options = DEFAULT_CONFIG;

  static get styles(): CSSResultArray {
      return [
        css`
          :host {
              display: block;
          }
        `
      ];
  }

  connectedCallback() {
    super.connectedCallback();
    const svg = this.querySelector('svg');
    if (svg) {
      wiredSvg(svg, {...DEFAULT_CONFIG, ...this.config});
    }
  }

  createRenderRoot() {
    // No use for shadow DOM
    return this;
  }
}

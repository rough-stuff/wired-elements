import {
  WiredBase,
  customElement,
  property,
  TemplateResult,
  html,
  css
} from 'wired-lib/lib/wired-base';
import { styleMap } from 'lit-html/directives/style-map';

const hostEdgeStyles: any = {
  bottom: {
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  'bottom-left': {
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  'bottom-right': {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  top: {
    alignItems: 'center',
    justifyContent: null
  },
  'top-left': {
    alignItems: 'flex-start',
    justifyContent: null
  },
  'top-right': {
    alignItems: 'flex-end',
    justifyContent: null
  }
};

const closeEdgeTransforms: any = {
  bottom: 'translateY(100%)',
  'bottom-left': 'translateX(-100%)',
  'bottom-right': 'translateX(100%)',
  top: 'translateY(-100%)',
  'top-left': 'translateX(-100%)',
  'top-right': 'translateX(100%)'
};

const openEdgeTransforms: any = {
  bottom: 'translateY(0)',
  'bottom-left': 'translateX(0)',
  'bottom-right': 'translateX(0)',
  top: 'translateY(0)',
  'top-left': 'translateX(0)',
  'top-right': 'translateX(0)'
};

@customElement('wired-toast')
export class WiredToast extends WiredBase {
  @property({ type: Boolean, reflect: true }) showing = false;
  @property({ type: String, reflect: true }) location = 'bottom';

  static get styles() {
    return css`
      :host {
        align-items: initial;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: initial;
        left: 0;
        outline: none;
        pointer-events: none;
        position: fixed;
        top: 0;
        -webkit-tap-highlight-color: transparent;
        width: 100%;
      }
      wired-card {
        display: inline-flex;
        width: fit-content;
        background: var(--wired-toast-bg, #fff);
        pointer-events: initial;
        position: relative;
        transition-duration: 0.25s;
        transition-property: opacity, transform;
        will-change: opacity, transform;
      }
    `;
  }

  render(): TemplateResult {
    const opacity = this.showing ? '1' : '0';
    const transform = this.showing
      ? openEdgeTransforms[this.location]
      : closeEdgeTransforms[this.location];
    const position = Object.assign({}, { opacity, transform });
    Object.assign(this.style, hostEdgeStyles[this.location]);
    return html`
      <wired-card elevation="3" style=${styleMap(position)}>
        <slot></slot>
      </wired-card>
    `;
  }

  async wait(duration: number = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }
  async show(duration: number = 3000) {
    // Enter
    this.showing = true;
    await this.wait(500);

    if (duration > 0) {
      // Showing
      await this.wait(duration);
      // Exit
      this.showing = false;
      await this.wait(500);
      this.close();
    }
  }

  close() {
    this.fireEvent('toast-closed');
  }
}

function htmlToElement(html: string): WiredToast {
  const template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  const child: any = template.content.firstChild;
  return child as WiredToast;
}

export function showToast(
  text: string,
  duration: number = 3000,
  location: string = 'bottom'
) {
  const toast: WiredToast = htmlToElement(
    `<wired-toast location="${location}">${text}</wired-toast>`
  );
  document.body.appendChild(toast);
  toast.addEventListener('toast-closed', () => {
    document.body.removeChild(toast);
  });
  setTimeout(() => toast.show(duration));
}

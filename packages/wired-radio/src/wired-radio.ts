import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { ellipse } from 'wired-lib';

@customElement('wired-radio')
export class WiredRadio extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) text = '';
  @property({ type: String }) name?: string;
  @property({ type: Number }) iconsize = 24;

  private dot?: SVGElement;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: inherit;
      width: 150px;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.45 !important;
      cursor: default;
      pointer-events: none;
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }
  
    #container {
      display: inline-block;
      white-space: nowrap;
    }
  
    .inline {
      display: inline-block;
      vertical-align: middle;
    }
  
    #checkPanel {
      cursor: pointer;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: var(--wired-radio-icon-color, currentColor);
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .filledPath {
      fill: var(--wired-radio-icon-color, currentColor);
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div id="container" @click="${this.toggleCheck}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${this.text}</div>
    </div>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  toggleCheck() {
    this.checked = !(this.checked || false);
    const event = new CustomEvent('change', { bubbles: true, composed: true, detail: { checked: this.checked } });
    this.dispatchEvent(event);
  }

  firstUpdated() {
    this.setAttribute('role', 'checkbox');
    this.addEventListener('keydown', (event) => {
      if ((event.keyCode === 13) || (event.keyCode === 32)) {
        event.preventDefault();
        this.toggleCheck();
      }
    });
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    this.dot = undefined;
    const s = { width: this.iconsize || 24, height: this.iconsize || 24 };
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    ellipse(svg, s.width / 2, s.height / 2, s.width, s.height);

    const iw = Math.max(s.width * 0.6, 5);
    const ih = Math.max(s.height * 0.6, 5);
    this.dot = ellipse(svg, s.width / 2, s.height / 2, iw, ih);
    this.dot.classList.add('filledPath');
    this.dot.style.display = this.checked ? '' : 'none';
    this.classList.remove('wired-pending');
  }
}
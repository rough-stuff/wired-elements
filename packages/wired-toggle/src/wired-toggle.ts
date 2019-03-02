import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { rectangle, ellipse } from 'wired-lib';

@customElement('wired-toggle')
export class WiredToggle extends LitElement {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private height = 0;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      cursor: pointer;
      position: relative;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.4 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .unchecked {
      fill: var(--wired-toggle-off-color, gray);
    }
  
    .checked {
      fill: var(--wired-toggle-on-color, rgb(63, 81, 181));
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div @click="${this.toggleCheck}">
      <svg id="svg"></svg>
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

  private toggleCheck() {
    this.checked = !(this.checked || false);
    const event = new CustomEvent('change', { bubbles: true, composed: true, detail: { checked: this.checked } });
    this.dispatchEvent(event);
  }

  firstUpdated() {
    this.setAttribute('role', 'switch');
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
    const s = { width: (this.height || 32) * 2.5, height: this.height || 32 };
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    rectangle(svg, 0, 0, s.width, s.height);
    const knob = ellipse(svg, s.height / 2, s.height / 2, s.height, s.height);
    const knobOffset = s.width - s.height;
    knob.style.transition = 'all 0.3s ease';
    knob.style.transform = this.checked ? ('translateX(' + knobOffset + 'px)') : '';
    const cl = knob.classList;
    if (this.checked) {
      cl.remove('unchecked');
      cl.add('checked');
    } else {
      cl.remove('checked');
      cl.add('unchecked');
    }
    this.setAttribute('aria-checked', `${this.checked}`);
    this.classList.remove('wired-pending');
  }
}
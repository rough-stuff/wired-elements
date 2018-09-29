import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredToggle extends LitElement {
  static get properties() {
    return {
      checked: { type: Boolean },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.checked = false;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('pending');
    return root;
  }

  render() {
    this._onDisableChange();
    return html`
    <style>
      :host {
        display: inline-block;
        cursor: pointer;
        position: relative;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.4 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
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
    </style>
    <div @click="${() => this._toggleCheck()}">
      <svg id="svg"></svg>
    </div>
    `;
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  _toggleCheck() {
    this.checked = !(this.checked || false);
    const event = new CustomEvent('change', { bubbles: true, composed: true, checked: this.checked, detail: { checked: this.checked } });
    this.dispatchEvent(event);
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
    this._refreshTabIndex();
  }

  _refreshTabIndex() {
    this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
  }

  _setAria() {
    this.setAttribute('role', 'switch');
    this.setAttribute('aria-checked', this.checked);
  }

  updated() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const s = { width: (this.height || 32) * 2.5, height: this.height || 32 };
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.rectangle(svg, 0, 0, s.width, s.height);
    this.knob = wired.ellipse(svg, s.height / 2, s.height / 2, s.height, s.height);
    this.knobOffset = s.width - s.height;
    this.knob.style.transition = "all 0.3s ease";
    this.knob.style.transform = this.checked ? ("translateX(" + this.knobOffset + "px)") : "";
    const cl = this.knob.classList;
    if (this.checked) {
      cl.remove("unchecked");
      cl.add("checked");
    } else {
      cl.remove("checked");
      cl.add("unchecked");
    }
    this.classList.remove('pending');
    this._setAria();
    this._attachEvents();
  }

  _attachEvents() {
    if (!this._keyboardAttached) {
      this.addEventListener('keydown', (event) => {
        if ((event.keyCode === 13) || (event.keyCode === 32)) {
          event.preventDefault();
          this._toggleCheck();
        }
      });
      this._keyboardAttached = true;
    }
  }
}
customElements.define('wired-toggle', WiredToggle);
import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredCheckbox extends LitElement {
  static get properties() {
    return {
      checked: { type: Boolean },
      text: { type: String },
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
        display: block;
        font-family: inherit;
        outline: none;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
      }
    
      :host(.pending) {
        opacity: 0;
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
        stroke: var(--wired-checkbox-icon-color, currentColor);
        stroke-width: 0.7;
      }
    </style>
    <div id="container" @click="${() => this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${this.text}</div>
    </div>
    `;
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
    this.setAttribute('role', 'checkbox');
    this.setAttribute('aria-checked', this.checked);
    this.setAttribute('aria-label', this.text);
  }

  _toggleCheck() {
    this.checked = !(this.checked || false);
    const event = new CustomEvent('change', { bubbles: true, composed: true, checked: this.checked, detail: { checked: this.checked } });
    this.dispatchEvent(event);
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  updated() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const s = { width: 24, height: 24 };
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.rectangle(svg, 0, 0, s.width, s.height);
    const checkpaths = [];
    checkpaths.push(wired.line(svg, s.width * 0.3, s.height * 0.4, s.width * 0.5, s.height * 0.7));
    checkpaths.push(wired.line(svg, s.width * 0.5, s.height * 0.7, s.width + 5, -5));
    checkpaths.forEach((d) => {
      d.style.strokeWidth = 2.5;
    });
    if (this.checked) {
      checkpaths.forEach((d) => {
        d.style.display = "";
      });
    } else {
      checkpaths.forEach((d) => {
        d.style.display = "none";
      });
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
customElements.define('wired-checkbox', WiredCheckbox);
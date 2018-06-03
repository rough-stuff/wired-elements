import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredCheckbox extends LitElement {
  static get properties() {
    return {
      checked: Boolean,
      text: String,
      disabled: Boolean
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.checked = false;
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.classList.add('pending');
    return root;
  }

  _render({ text, iconsize }) {
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
    <div id="container" on-click="${() => this._toggleCheck()}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">${text}</div>
    </div>
    `;
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
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

  _didRender() {
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
  }

}
customElements.define('wired-checkbox', WiredCheckbox);
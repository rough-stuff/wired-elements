import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredRadio extends LitElement {
  static get properties() {
    return {
      checked: Boolean,
      name: String,
      text: String,
      iconsize: Number,
      disabled: Boolean
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.checked = false;
    this.iconsize = 24;
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
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: inherit;
        width: 150px;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
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
    this._dot = null;
    const s = { width: this.iconsize || 24, height: this.iconsize || 24 };
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.ellipse(svg, s.width / 2, s.height / 2, s.width, s.height);

    const iw = Math.max(s.width * 0.6, 5);
    const ih = Math.max(s.height * 0.6, 5);
    this._dot = wired.ellipse(svg, s.width / 2, s.height / 2, iw, ih);
    this._dot.classList.add("filledPath");
    this._dot.style.display = this.checked ? "" : "none";
    this.classList.remove('pending');
  }
}
customElements.define('wired-radio', WiredRadio);
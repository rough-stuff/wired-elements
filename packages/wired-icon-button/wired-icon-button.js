import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';
import '@material/mwc-icon';

export class WiredIconButton extends LitElement {
  static get properties() {
    return {
      disabled: Boolean
    };
  }

  constructor() {
    super();
    this.disabled = false;
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.classList.add('pending');
    return root;
  }

  _render() {
    this._onDisableChange();
    return html`
    <style>
      :host {
        display: -ms-inline-flexbox;
        display: -webkit-inline-flex;
        display: inline-flex;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        position: relative;
        vertical-align: middle;
        padding: 8px;
        outline: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: pointer;
        z-index: 0;
        line-height: 1;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
        box-sizing: border-box !important;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 50%;
        pointer-events: none;
      }
    
      :host(:active) path {
        transform: scale(0.96) translate(2%, 2%);
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: var(--wired-icon-bg-color, transparent);
        transition: transform 0.05s ease;
      }
    
      mwc-icon {
        position: relative;
        font-size: var(--wired-icon-size, 24px);
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <mwc-icon>
      <slot></slot>
    </mwc-icon>
    `;
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  _didRender() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const s = this.getBoundingClientRect();
    const min = Math.min(s.width, s.height);
    svg.setAttribute("width", min);
    svg.setAttribute("height", min);
    wired.ellipse(svg, min / 2, min / 2, min, min);
    this.classList.remove('pending');
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this._didRender());
  }
}
customElements.define('wired-icon-button', WiredIconButton);
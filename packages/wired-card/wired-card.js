import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredCard extends LitElement {
  static get properties() {
    return {
      elevation: Number
    };
  }

  constructor() {
    super();
    this.elevation = 1;
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open' });
    this.classList.add('pending');
    return root;
  }

  _render() {
    return html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
      }
    
      :host(.pending) {
        opacity: 0;
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
        fill: transparent;
      }
    </style>
    <div>
      <slot on-slotchange="${() => this._requestRender()}"></slot>
    </div>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this._didRender());
  }

  _didRender() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    var s = this.getBoundingClientRect();
    var elev = Math.min(Math.max(1, this.elevation), 5);
    var w = s.width + ((elev - 1) * 2);
    var h = s.height + ((elev - 1) * 2);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    wired.rectangle(svg, 0, 0, s.width, s.height);
    for (var i = 1; i < elev; i++) {
      (wired.line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (85 - (i * 10)) / 100;
      (wired.line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (85 - (i * 10)) / 100;
      (wired.line(svg, (i * 2), s.height + (i * 2), s.width + (i * 2), s.height + (i * 2))).style.opacity = (85 - (i * 10)) / 100;
      (wired.line(svg, s.width + (i * 2), s.height + (i * 2), s.width + (i * 2), i * 2)).style.opacity = (85 - (i * 10)) / 100;
    }
    this.classList.remove('pending');
  }
}
customElements.define('wired-card', WiredCard);
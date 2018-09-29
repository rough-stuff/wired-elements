import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredCard extends LitElement {
  static get properties() {
    return {
      elevation: { type: Number }
    };
  }

  constructor() {
    super();
    this.elevation = 1;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('pending');
    return root;
  }

  render() {
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
      <slot @slotchange="${() => this.requestUpdate()}"></slot>
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
    if (!this.resizeHandler) {
      this.resizeHandler = this._debounce(this.updated.bind(this), 200, false, this);
      window.addEventListener('resize', this.resizeHandler);
    }
    setTimeout(() => this.updated());
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      delete this.resizeHandler;
    }
  }

  updated() {
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

  _debounce(func, wait, immediate, context) {
    let timeout = 0;
    return () => {
      const args = arguments;
      const later = () => {
        timeout = 0;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}
customElements.define('wired-card', WiredCard);
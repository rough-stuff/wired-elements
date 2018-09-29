import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredProgress extends LitElement {
  static get properties() {
    return {
      value: { type: Number },
      min: { type: Number },
      max: { type: Number },
      percentage: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.percentage = false;
    this.max = 100;
    this.min = 0;
    this.value = 0;
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
        width: 400px;
        height: 42px;
        font-family: sans-serif;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      svg {
        display: block;
      }
    
      path {
        stroke: currentColor;
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }
    
      .labelContainer {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    
      .progressLabel {
        color: var(--wired-progress-label-color, #000);
        font-size: var(--wired-progress-font-size, 18px);
      }
    
      .progbox {
        fill: var(--wired-progress-color, rgba(0, 0, 200, 0.1));
        stroke-opacity: 0.6;
        stroke-width: 0.4;
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    <div class="overlay labelContainer">
      <div class="progressLabel">${this._getProgressLabel()}</div>
    </div>
    `;
  }

  _getProgressLabel() {
    if (this.percentage) {
      if (this.max == this.min) {
        return '%';
      } else {
        var pct = Math.floor(((this.value - this.min) / (this.max - this.min)) * 100);
        return (pct + "%");
      }
    } else {
      return ("" + this.value);
    }
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  updated() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    var s = this.getBoundingClientRect();
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.rectangle(svg, 0, 0, s.width, s.height);

    let pct = 0;
    if (this.max > this.min) {
      pct = (this.value - this.min) / (this.max - this.min);
      const progWidth = s.width * Math.max(0, Math.min(pct, 100));
      const progBox = wired.polygon(svg, [
        [0, 0],
        [progWidth, 0],
        [progWidth, s.height],
        [0, s.height]
      ]);
      progBox.classList.add("progbox");
    }
    this.classList.remove('pending');
  }
}
customElements.define('wired-progress', WiredProgress);
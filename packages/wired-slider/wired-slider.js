import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';
import { addListener, removeListener } from '@polymer/polymer/lib/utils/gestures.js';

export class WiredSlider extends LitElement {
  static get properties() {
    return {
      _value: { type: Number },
      min: { type: Number },
      max: { type: Number },
      knobradius: { type: Number },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this._value = 0;
    this.min = 0;
    this.max = 100;
    this.knobradius = 10;
    this.step = 1;
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
        position: relative;
        width: 300px;
        height: 40px;
        outline: none;
        box-sizing: border-box;
      }
    
      :host(.disabled) {
        opacity: 0.45 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.07);
        border-radius: 5px;
      }
    
      :host(.disabled) .knob {
        pointer-events: none !important;
      }
    
      :host(:focus) .knob {
        cursor: move;
        stroke: var(--wired-slider-knob-outline-color, #000);
        fill-opacity: 0.8;
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
        stroke-width: 0.7;
        fill: transparent;
      }
    
      .knob {
        pointer-events: auto;
        fill: var(--wired-slider-knob-zero-color, gray);
        stroke: var(--wired-slider-knob-zero-color, gray);
        transition: transform 0.15s ease;
        cursor: pointer;
      }
    
      .hasValue {
        fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
        stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
      }
    
      .bar {
        stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
      }
    
      :host(.pending) {
        opacity: 0;
      }
    </style>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._setValue(v, true);
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
    this._refreshTabIndex();
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => this.firstUpdated(), 100);
  }

  firstUpdated() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const s = this.getBoundingClientRect();
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    let radius = this.knobradius || 10;
    this._barWidth = s.width - (2 * radius);
    this._bar = wired.line(svg, radius, s.height / 2, s.width - radius, s.height / 2);
    this._bar.classList.add("bar");
    this._knobGroup = wired._svgNode("g");
    svg.appendChild(this._knobGroup);
    this._knob = wired.ellipse(this._knobGroup, radius, s.height / 2, radius * 2, radius * 2);
    this._knob.classList.add("knob");
    this._onValueChange();
    this.classList.remove('pending');
    this._knobAttached = false;

    this._setAria();
    this._attachEvents();
  }

  _setAria() {
    this.setAttribute('role', 'slider');
    this.setAttribute('aria-valuemax', this.max);
    this.setAttribute('aria-valuemin', this.min);
    this._setAriaValue();
    this._refreshTabIndex();
  }

  _refreshTabIndex() {
    this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
  }

  _setAriaValue() {
    this.setAttribute('aria-valuenow', this.value);
  }

  _setValue(v, skipEvent) {
    this._value = v;
    this._setAriaValue();
    this._onValueChange();
    if (!skipEvent) {
      const event = new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this._intermediateValue } });
      this.dispatchEvent(event);
    }
  }

  _incremenent() {
    const newValue = Math.min(this.max, Math.round(this.value + this.step));
    if (newValue != this.value) {
      this._setValue(newValue);
    }
  }

  _decrement() {
    const newValue = Math.max(this.min, Math.round(this.value - this.step));
    if (newValue != this.value) {
      this._setValue(newValue);
    }
  }

  _attachEvents() {
    if (!this._knobAttached) {
      addListener(this._knob, 'down', (event) => {
        if (!this.disabled) {
          this._knobdown(event);
        }
      });
      addListener(this._knob, 'up', (event) => {
        if (!this.disabled) {
          this._resetKnob(event);
        }
      });
      addListener(this._knob, 'track', (event) => {
        if (!this.disabled) {
          this._onTrack(event);
        }
      });
      this._knobAttached = true;
    }
    if (!this._keyboardAttached) {
      this.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
          case 38:
          case 39:
            this._incremenent();
            break;
          case 37:
          case 40:
            this._decrement();
            break;
          case 36:
            this._setValue(this.min);
            break;
          case 35:
            this._setValue(this.max);
            break;
        }
      });
      this._keyboardAttached = true;
    }
  }

  _onValueChange() {
    if (!this._knob) {
      return;
    }
    let pct = 0;
    if (this.max > this.min) {
      pct = Math.min(1, Math.max((this.value - this.min) / (this.max - this.min), 0));
    }
    this._pct = pct;
    if (pct) {
      this._knob.classList.add("hasValue");
    } else {
      this._knob.classList.remove("hasValue")
    }
    let knobOffset = pct * this._barWidth;
    this._knobGroup.style.transform = "translateX(" + Math.round(knobOffset) + "px)";
  }

  _knobdown(event) {
    this._knobExpand(true);
    event.preventDefault();
    this.focus();
  }

  _resetKnob(event) {
    this._knobExpand(false);
  }

  _knobExpand(value) {
    if (this._knob) {
      if (value) {
        this._knob.classList.add("expanded");
      } else {
        this._knob.classList.remove("expanded");
      }
    }
  }

  _onTrack(event) {
    event.stopPropagation();
    switch (event.detail.state) {
      case 'start':
        this._trackStart(event);
        break;
      case 'track':
        this._trackX(event);
        break;
      case 'end':
        this._trackEnd();
        break;
    }
  }

  _trackStart(event) {
    this._intermediateValue = this.value;
    this._startx = this._pct * this._barWidth;
    this._knobstartx = this._startx;
    this._minx = -this._startx;
    this._maxx = this._barWidth - this._startx;
    this._dragging = true;
  }

  _trackX(event) {
    if (!this._dragging) {
      this._trackStart(event);
    }
    var dx = event.detail.dx || 0;
    var newX = Math.max(Math.min(this._startx + dx, this._barWidth), 0);
    this._knobGroup.style.transform = "translateX(" + Math.round(newX) + "px)";
    var newPct = newX / this._barWidth;
    this._intermediateValue = this.min + newPct * (this.max - this.min);
  }

  _trackEnd() {
    this._dragging = false;
    this._resetKnob();
    this._setValue(this._intermediateValue);
    this._pct = (this.value - this.min) / (this.max - this.min);
  }
}
customElements.define('wired-slider', WiredSlider);
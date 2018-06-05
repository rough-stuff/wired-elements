import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredInput extends LitElement {
  static get properties() {
    return {
      placeholder: String,
      disabled: Boolean,
      type: String,
      required: Boolean,
      autocomplete: String,
      autofocus: Boolean,
      minlength: Number,
      maxlength: Number,
      min: String,
      max: String,
      step: String,
      readonly: Boolean,
      size: Number,
      autocapitalize: String,
      autocorrect: String,
      value: String
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

  _render({ type, placeholder, disabled, required, autocomplete, autofocus, minlength, maxlength, min, max, step, readonly, size, autocapitalize, autocorrect }) {
    this._onDisableChange();
    return html`
    <style>
      :host {
        display: inline-block;
        position: relative;
        padding: 5px;
        font-family: sans-serif;
        width: 150px;
        outline: none;
      }
    
      :host(.pending) {
        opacity: 0;
      }
    
      :host(.disabled) {
        opacity: 0.6 !important;
        cursor: default;
        pointer-events: none;
      }
    
      :host(.disabled) svg {
        background: rgba(0, 0, 0, 0.07);
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
    
      input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        outline: none;
        border: none;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
      }
    </style>
    <input id="txt" type$="${type}" placeholder$="${placeholder}" disabled?="${disabled}" required?="${required}" autocomplete$="${autocomplete}"
      autofocus?="${autofocus}" minlength$="${minlength}" maxlength$="${maxlength}" min$="${min}" max$="${max}" step$="${step}"
      readonly?="${readonly}" size$="${size}" autocapitalize$="${autocapitalize}" autocorrect$="${autocorrect}" on-change="${(e) => this._onChange(e)}">
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  get input() {
    return this.shadowRoot.getElementById('txt');
  }

  get value() {
    const input = this.input;
    return (input && input.value) || '';
  }

  set value(v) {
    if (this.shadowRoot) {
      const input = this.input;
      if (input) {
        input.value = v;
      }
    } else {
      this._value = v;
    }
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
  }

  _onChange(event) {
    event.stopPropagation();
    const newEvent = new CustomEvent(event.type, { bubbles: true, composed: true, cancelable: event.cancelable, detail: { sourceEvent: event } });
    this.dispatchEvent(newEvent);
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
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.rectangle(svg, 0, 0, s.width, s.height);
    this.classList.remove('pending');
    if (typeof this._value !== 'undefined') {
      this.input.value = this._value;
      delete this._value;
    }
  }
}
customElements.define('wired-input', WiredInput);
import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredTextarea extends LitElement {
  static get properties() {
    return {
      rows: { type: Number },
      maxrows: { type: Number },
      autocomplete: { type: String },
      autofocus: { type: Boolean },
      inputmode: { type: String },
      placeholder: { type: String },
      readonly: { type: Boolean },
      required: { type: Boolean },
      minlength: { type: Number },
      maxlength: { type: Number },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.rows = 1;
    this.maxrows = 0;
  }

  createRenderRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
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
        padding: 5px;
        font-family: sans-serif;
        width: 400px;
        -moz-appearance: textarea;
        -webkit-appearance: textarea;
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
    
      .fit {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    
      .overlay {
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
    
      .mirror-text {
        visibility: hidden;
        word-wrap: break-word;
      }
    
      textarea {
        position: relative;
        outline: none;
        border: none;
        resize: none;
        background: inherit;
        color: inherit;
        width: 100%;
        height: 100%;
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
        text-align: inherit;
        padding: 5px;
        box-sizing: border-box;
      }
    </style>
    <div id="mirror" class="mirror-text">&#160;</div>
    <div class="fit">
      <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}" placeholder="${this.placeholder}"
        ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}" rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}"
        @input="${() => this._onInput()}"></textarea>
    </div>
    <div class="fit overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.value = this.value || '';
  }

  get textarea() {
    return this.shadowRoot.getElementById('textarea');
  }

  get mirror() {
    return this.shadowRoot.getElementById('mirror');
  }

  get value() {
    const input = this.textarea;
    return (input && input.value) || '';
  }

  set value(v) {
    const textarea = this.textarea;
    if (!textarea) {
      return;
    }
    if (textarea.value !== v) {
      textarea.value = !(v || v === 0) ? '' : v;
    }
    this.mirror.innerHTML = this._valueForMirror();
    this.requestUpdate();
  }

  _constrain(tokens) {
    var _tokens;
    tokens = tokens || [''];
    if (this.maxRows > 0 && tokens.length > this.maxRows) {
      _tokens = tokens.slice(0, this.maxRows);
    } else {
      _tokens = tokens.slice(0);
    }
    while (this.rows > 0 && _tokens.length < this.rows) {
      _tokens.push('');
    }
    return _tokens.join('<br/>') + '&#160;';
  }

  _valueForMirror() {
    var input = this.textarea;
    if (!input) {
      return;
    }
    this.tokens = (input && input.value) ? input.value.replace(/&/gm, '&amp;').replace(/"/gm, '&quot;').replace(/'/gm, '&#39;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').split('\n') : [''];
    return this._constrain(this.tokens);
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
  }

  _updateCached() {
    this.mirror.innerHTML = this._constrain(this.tokens);
  }

  _onInput(event) {
    this.value = this.textarea.value;
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  _needsLayout() {
    var s = this.getBoundingClientRect();
    if (s.height != this._prevHeight) {
      this.requestUpdate();
    }
  }

  updated() {
    const s = this.getBoundingClientRect();
    const svg = this.shadowRoot.getElementById('svg');

    if (this._prevHeight !== s.height) {
      this._clearNode(svg);
      svg.setAttribute('width', s.width);
      svg.setAttribute('height', s.height);
      wired.rectangle(svg, 2, 2, s.width - 2, s.height - 2);

      this._prevHeight = s.height;
    }

    this.classList.remove('pending');
    this._updateCached();
  }
}
customElements.define('wired-textarea', WiredTextarea);
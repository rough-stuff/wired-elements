import { LitElement, html } from '@polymer/lit-element/lit-element.js';

export class WiredItem extends LitElement {
  static get properties() {
    return {
      text: String,
      value: String
    };
  }

  _render({ text }) {
    return html`
    <style>
      :host {
        display: block;
        padding: 8px;
        font-family: inherit;
      }
    </style>
    <span>${text}</span>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._itemClickHandler = (event) => {
      this._onClick(event)
    };
    this.addEventListener("click", this._itemClickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._itemClickHandler) {
      this.removeEventListener("click", this._itemClickHandler);
      this._itemClickHandler = null;
    }
  }

  _onClick(e) {
    const event = new CustomEvent('item-click', { bubbles: true, composed: true, detail: { text: this.text, value: this.value } });
    this.dispatchEvent(event);
  }
}
customElements.define('wired-item', WiredItem);
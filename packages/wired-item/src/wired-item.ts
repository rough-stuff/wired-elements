import { LitElement, customElement, property, TemplateResult, html } from 'lit-element';

@customElement('wired-item')
export class WiredItem extends LitElement {
  @property({ type: String }) text?: string;
  @property({ type: String }) value?: string;

  private itemClickHandler = this.onClick.bind(this);

  render(): TemplateResult {
    return html`
    <style>
      :host {
        display: block;
        padding: 8px;
        font-family: inherit;
      }
    </style>
    <span>${this.text}</span>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.itemClickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.itemClickHandler);
  }

  private onClick() {
    const event = new CustomEvent('item-click', { bubbles: true, composed: true, detail: { text: this.text, value: this.value } });
    this.dispatchEvent(event);
  }
}
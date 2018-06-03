import { LitElement, html } from '@polymer/lit-element/lit-element.js';

export class WiredRadioGroup extends LitElement {
  static get properties() {
    return {
      selected: String
    };
  }

  _render({ selected }) {
    return html`
    <style>
      :host {
        display: inline-block;
      }
    
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    </style>
    <slot id="slot" on-slotchange="${() => this.slotChange()}"></slot>
    `;
  }

  constructor() {
    super();
    this._checkListener = this._handleChecked.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._checkListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('checked', this._checkListener);
  }

  _handleChecked(event) {
    const checked = event.detail.checked;
    const name = event.target.name;
    this.selected = (checked && name) || '';
    const ce = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
    this.dispatchEvent(ce);
  }

  slotChange() {
    this._requestRender();
  }

  _didRender() {
    const slot = this.shadowRoot.getElementById('slot');
    const nodes = slot.assignedNodes();
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === "WIRED-RADIO") {
          const name = nodes[i].name || '';
          if (this.selected && (name === this.selected)) {
            nodes[i].checked = true;
          } else {
            nodes[i].checked = false;
          }
        }
      }
    }
  }
}
customElements.define('wired-radio-group', WiredRadioGroup);
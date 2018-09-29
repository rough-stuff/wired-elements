import { LitElement, html } from '@polymer/lit-element/lit-element.js';

export class WiredRadioGroup extends LitElement {
  static get properties() {
    return {
      selected: { type: String }
    };
  }

  render() {
    return html`
    <style>
      :host {
        display: inline-block;
      }
    
      :host ::slotted(*) {
        padding: var(--wired-radio-group-item-padding, 5px);
      }
    </style>
    <slot id="slot" @slotchange="${() => this.slotChange()}"></slot>
    `;
  }

  constructor() {
    super();
    this._radioNodes = [];
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
    if (!checked) {
      event.target.checked = true;
    } else {
      this.selected = (checked && name) || '';
      this._fireSelected();
    }
  }

  _fireSelected() {
    const ce = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
    this.dispatchEvent(ce);
  }

  slotChange() {
    this.requestUpdate();
  }

  updated() {
    const slot = this.shadowRoot.getElementById('slot');
    const nodes = slot.assignedNodes();
    this._radioNodes = [];
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === "WIRED-RADIO") {
          this._radioNodes.push(nodes[i]);
          const name = nodes[i].name || '';
          if (this.selected && (name === this.selected)) {
            nodes[i].checked = true;
          } else {
            nodes[i].checked = false;
          }
        }
      }
    }
    this.setAttribute('role', 'radiogroup');
    this.tabIndex = this.getAttribute('tabindex') || 0;
    this._attachEvents();
  }

  _attachEvents() {
    if (!this._keyboardAttached) {
      this.addEventListener('keydown', (event) => {
        switch (event.keyCode) {
          case 37:
          case 38:
            event.preventDefault();
            this._selectPrevious();
            break;
          case 39:
          case 40:
            event.preventDefault();
            this._selectNext();
            break;
        }
      });
      this._keyboardAttached = true;
    }
  }

  _selectPrevious() {
    const list = this._radioNodes;
    if (list.length) {
      let radio = null;
      let index = -1;
      if (this.selected) {
        for (let i = 0; i < list.length; i++) {
          const n = list[i];
          if (n.name === this.selected) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          radio = list[0];
        } else {
          index--;
          if (index < 0) {
            index = list.length - 1;
          }
          radio = list[index];
        }
      } else {
        radio = list[0];
      }
      if (radio) {
        radio.focus();
        this.selected = radio.name;
        this._fireSelected();
      }
    }
  }

  _selectNext() {
    const list = this._radioNodes;
    if (list.length) {
      let radio = null;
      let index = -1;
      if (this.selected) {
        for (let i = 0; i < list.length; i++) {
          const n = list[i];
          if (n.name === this.selected) {
            index = i;
            break;
          }
        }
        if (index < 0) {
          radio = list[0];
        } else {
          index++;
          if (index >= list.length) {
            index = 0;
          }
          radio = list[index];
        }
      } else {
        radio = list[0];
      }
      if (radio) {
        radio.focus();
        this.selected = radio.name;
        this._fireSelected();
      }
    }
  }
}
customElements.define('wired-radio-group', WiredRadioGroup);
import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';
import 'wired-item';

export class WiredListbox extends LitElement {
  static get properties() {
    return {
      value: { type: Object },
      selected: { type: String },
      horizontal: { type: Boolean }
    }
  }

  constructor() {
    super();
    this.horizontal = false;
    this._itemNodes = [];
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('pending');
    return root;
  }

  render() {
    if (this.horizontal) {
      this.classList.add('horizontal');
    } else {
      this.classList.remove('horizontal');
    }
    this.tabIndex = (this.getAttribute('tabindex') || 0);
    return html`
      <style>
        :host {
          display: inline-block;
          font-family: inherit;
          position: relative;
          padding: 5px;
          outline: none;
        }
      
        :host(.pending) {
          opacity: 0;
        }

        :host(:focus) path {
          stroke-width: 1.5;
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
      
        ::slotted(.selected-item) {
          background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
        }
      
        ::slotted(wired-item) {
          cursor: pointer;
          white-space: nowrap;
          display: block;
        }
      
        :host(.horizontal) ::slotted(wired-item) {
          display: inline-block;
        }
      
        ::slotted(wired-item:hover) {
          background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
        }
      </style>
      <slot id="slot" @slotchange="${() => this.requestUpdate()}"></slot>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this._itemClickHandler = (event) => {
      this._onItemClick(event)
    };
    this.addEventListener("item-click", this._itemClickHandler);
    setTimeout(() => this.updated());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._itemClickHandler) {
      this.removeEventListener("item-click", this._itemClickHandler);
      this._itemClickHandler = null;
    }
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  firstUpdated() {
    this._refreshSelection();
  }

  updated() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const s = this.getBoundingClientRect();
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.rectangle(svg, 0, 0, s.width, s.height);
    this.classList.remove('pending');
    this._setAria();
    this._attachEvents();
  }

  _setAria() {
    this.setAttribute('role', 'listbox');
    if (!this._itemNodes.length) {
      this._itemNodes = [];
      const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
      if (nodes && nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === "WIRED-ITEM") {
            nodes[i].setAttribute('role', 'option');
            this._itemNodes.push(nodes[i]);
          }
        }
      }
    }
  }

  _refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.classList.remove("selected-item");
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    const nodes = this.shadowRoot.getElementById('slot').assignedNodes();
    if (nodes) {
      let selectedItem = null;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === "WIRED-ITEM") {
          const value = nodes[i].value || "";
          if (this.selected && (value === this.selected)) {
            selectedItem = nodes[i];
            break;
          }
        }
      }
      this.lastSelectedItem = selectedItem;
      if (this.lastSelectedItem) {
        this.lastSelectedItem.setAttribute('aria-selected', 'true');
      }
      if (selectedItem) {
        this.lastSelectedItem.classList.add("selected-item");
        this.value = {
          value: selectedItem.value,
          text: selectedItem.text
        };
      } else {
        this.value = null;
      }
    }
  }

  _onItemClick(event) {
    event.stopPropagation();
    this.selected = event.detail.value;
    this._refreshSelection();
    this._fireSelected();
  }

  _fireSelected() {
    const selectedEvent = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
    this.dispatchEvent(selectedEvent);
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
    const list = this._itemNodes;
    if (list.length) {
      let index = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === this.lastSelectedItem) {
          index = i;
          break;
        }
      }
      if (index < 0) {
        index = 0
      } else if (index === 0) {
        index = list.length - 1;
      } else {
        index--;
      }
      this.selected = list[index].value || '';
      this._refreshSelection();
      this._fireSelected();
    }
  }

  _selectNext() {
    const list = this._itemNodes;
    if (list.length) {
      let index = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === this.lastSelectedItem) {
          index = i;
          break;
        }
      }
      if (index < 0) {
        index = 0
      } else if (index >= (list.length - 1)) {
        index = 0;
      } else {
        index++;
      }
      this.selected = list[index].value || '';
      this._refreshSelection();
      this._fireSelected();
    }
  }
}

customElements.define('wired-listbox', WiredListbox);
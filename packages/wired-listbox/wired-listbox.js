import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';
import 'wired-item';

export class WiredListbox extends LitElement {
  static get properties() {
    return {
      value: Object,
      selected: String,
      horizontal: Boolean
    }
  }

  constructor() {
    super();
    this.horizontal = false;
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.classList.add('pending');
    return root;
  }

  _render({ horizontal }) {
    if (horizontal) {
      this.classList.add('horizontal');
    } else {
      this.classList.remove('horizontal');
    }
    this._onDisableChange();
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
      <slot id="slot"></slot>
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._itemClickHandler) {
      this.removeEventListener("item-click", this._itemClickHandler);
      this._itemClickHandler = null;
    }
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  _firstRendered() {
    this._refreshSelection();
  }

  _didRender() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    const s = this.getBoundingClientRect();
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    wired.rectangle(svg, 0, 0, s.width, s.height);
    this.classList.remove('pending');
  }

  _refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.classList.remove("selected-item");
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
    const selectedEvent = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
    this.dispatchEvent(selectedEvent);
  }
}

customElements.define('wired-listbox', WiredListbox);
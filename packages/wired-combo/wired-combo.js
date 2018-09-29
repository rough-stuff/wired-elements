import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';
import 'wired-card';
import 'wired-item';

export class WiredCombo extends LitElement {
  static get properties() {
    return {
      value: { type: Object },
      selected: { type: String },
      disabled: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this._cardShowing = false;
    this._itemNodes = [];
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
        font-family: inherit;
        position: relative;
        outline: none;
      }
    
      :host(.disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
    
      :host(.pending) {
        opacity: 0;
      }

      :host(:focus) path {
        stroke-width: 1.5;
      }
    
      #container {
        white-space: nowrap;
        position: relative;
      }
    
      .inline {
        display: inline-block;
        vertical-align: top
      }
    
      #textPanel {
        min-width: 90px;
        min-height: 18px;
        padding: 8px;
      }
    
      #dropPanel {
        width: 34px;
        cursor: pointer;
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
    
      #card {
        position: absolute;
        background: var(--wired-combo-popup-bg, white);
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
      }

      ::slotted(.selected-item) {
        background: var(--wired-combo-item-selected-bg, rgba(0, 0, 200, 0.1));
      }
    
      ::slotted(wired-item) {
        cursor: pointer;
        white-space: nowrap;
      }
    
      ::slotted(wired-item:hover) {
        background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
      }
    </style>
    <div id="container" @click="${(e) => this._onCombo(e)}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" role="listbox" @item-click="${(e) => this._onItemClick(e)}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `;
  }

  _onDisableChange() {
    if (this.disabled) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }
    this._refreshTabIndex();
  }

  _refreshTabIndex() {
    this.tabIndex = this.disabled ? -1 : (this.getAttribute('tabindex') || 0);
  }

  _setAria() {
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', this._cardShowing);
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
    const s = this.shadowRoot.getElementById('container').getBoundingClientRect();
    svg.setAttribute("width", s.width);
    svg.setAttribute("height", s.height);
    const textBounds = this.shadowRoot.getElementById('textPanel').getBoundingClientRect();
    this.shadowRoot.getElementById('dropPanel').style.minHeight = textBounds.height + "px";
    wired.rectangle(svg, 0, 0, textBounds.width, textBounds.height);
    const dropx = textBounds.width - 4;
    wired.rectangle(svg, dropx, 0, 34, textBounds.height);
    const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
    const poly = wired.polygon(svg, [
      [dropx + 8, 5 + dropOffset],
      [dropx + 26, 5 + dropOffset],
      [dropx + 17, dropOffset + Math.min(textBounds.height, 18)]
    ]);
    poly.style.fill = "currentColor";
    poly.style.pointerEvents = this.disabled ? 'none' : 'auto';
    poly.style.cursor = "pointer";
    this.classList.remove('pending');
    this._setAria();
    this._attachEvents();
  }

  _refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.classList.remove("selected-item");
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    const slot = this.shadowRoot.getElementById('slot');
    const nodes = slot.assignedNodes();
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
        this.lastSelectedItem.classList.add("selected-item");
        this.lastSelectedItem.setAttribute('aria-selected', 'true');
      }
      if (selectedItem) {
        this.value = {
          value: selectedItem.value,
          text: selectedItem.text
        };
      } else {
        this.value = null;
      }
    }
  }

  _onCombo(event) {
    event.stopPropagation();
    this._setCardShowing(!this._cardShowing);
  }

  _setCardShowing(showing) {
    this._cardShowing = showing;
    const card = this.shadowRoot.getElementById('card');
    card.style.display = showing ? "" : "none";
    if (showing) {
      setTimeout(() => {
        card.requestUpdate();
      }, 10);
    }
    this.setAttribute('aria-expanded', this._cardShowing);
  }

  _onItemClick(event) {
    event.stopPropagation();
    this._setCardShowing(false);
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
      this.addEventListener('blur', () => {
        if (this._cardShowing) {
          this._setCardShowing(false);
        }
      });
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
          case 27:
            event.preventDefault();
            if (this._cardShowing) {
              this._setCardShowing(false);
            }
            break;
          case 13:
            event.preventDefault();
            this._setCardShowing(!this._cardShowing);
            break;
          case 32:
            event.preventDefault();
            if (!this._cardShowing) {
              this._setCardShowing(true);
            }
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
customElements.define('wired-combo', WiredCombo);
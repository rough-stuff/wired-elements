import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';
import 'wired-card';
import 'wired-item';

export class WiredCombo extends LitElement {
  static get properties() {
    return {
      value: Object,
      selected: String,
      disabled: Boolean
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this._cardShowing = false;
  }

  _createRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.classList.add('pending');
    return root;
  }

  _render({ value }) {
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
    
      ::slotted(wired-item) {
        cursor: pointer;
        white-space: nowrap;
      }
    
      ::slotted(wired-item:hover) {
        background: var(--wired-combo-item-hover-bg, rgba(0, 0, 0, 0.1));
      }
    </style>
    <div id="container" on-click="${(e) => this._onCombo(e)}">
      <div id="textPanel" class="inline">
        <span>${value && value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" on-item-click="${(e) => this._onItemClick(e)}" style="display: none;">
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
  }

  _refreshSelection() {
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
        card._requestRender();
      }, 10);
    }
  }

  _onItemClick(event) {
    event.stopPropagation();
    this._setCardShowing(false);
    this.selected = event.detail.value;
    this._refreshSelection();
    const selectedEvent = new CustomEvent('selected', { bubbles: true, composed: true, checked: this.checked, detail: { selected: this.selected } });
    this.dispatchEvent(selectedEvent);
  }

}
customElements.define('wired-combo', WiredCombo);
import { css, TemplateResult, html, PropertyValues, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { rectangle, polygon } from './wired-lib';
import { randomSeed, fireEvent } from './wired-base';

import './wired-card';
import './wired-item';

interface WiredComboItem extends HTMLElement {
  value: string;
  selected: boolean;
}

interface ComboValue {
  value: string;
  text: string;
}

@customElement('wired-combo')
export class WiredCombo extends LitElement {
  @property({ type: Object }) value?: ComboValue;
  @property({ type: String, reflect: true }) selected?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query('svg') private svg?: SVGSVGElement;
  @query('#card') private card?: HTMLDivElement;

  private seed = randomSeed();
  private cardShowing = false;
  private itemNodes: WiredComboItem[] = [];
  private lastSelectedItem?: WiredComboItem;

  static get styles() {
    return css`
      :host {
        display: inline-block;
        font-family: inherit;
        position: relative;
        outline: none;
        opacity: 0;
      }
    
      :host(.wired-disabled) {
        opacity: 0.5 !important;
        cursor: default;
        pointer-events: none;
        background: rgba(0, 0, 0, 0.02);
      }
      
      :host(.wired-rendered) {
        opacity: 1;
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
        display: block;
        position: absolute;
        background: var(--wired-combo-popup-bg, white);
        z-index: 1;
        box-shadow: 1px 5px 15px -6px rgba(0, 0, 0, 0.8);
        padding: 8px;
      }
  
      ::slotted(wired-item) {
        display: block;
      }
    `;
  }

  render(): TemplateResult {
    return html`
    <div id="container" @click="${this.onCombo}">
      <div id="textPanel" class="inline">
        <span>${this.value && this.value.text}</span>
      </div>
      <div id="dropPanel" class="inline"></div>
      <div class="overlay">
        <svg></svg>
      </div>
    </div>
    <wired-card id="card" tabindex="-1" role="listbox" @mousedown="${this.onItemClick}" @touchstart="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `;
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  firstUpdated() {
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'listbox');
    this.refreshSelection();

    this.addEventListener('blur', () => {
      if (this.cardShowing) {
        this.setCardShowing(false);
      }
    });
    this.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
        case 38:
          event.preventDefault();
          this.selectPrevious();
          break;
        case 39:
        case 40:
          event.preventDefault();
          this.selectNext();
          break;
        case 27:
          event.preventDefault();
          if (this.cardShowing) {
            this.setCardShowing(false);
          }
          break;
        case 13:
          event.preventDefault();
          this.setCardShowing(!this.cardShowing);
          break;
        case 32:
          event.preventDefault();
          if (!this.cardShowing) {
            this.setCardShowing(true);
          }
          break;
      }
    });
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
    const svg = this.svg!;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.shadowRoot!.getElementById('container')!.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    const textBounds = this.shadowRoot!.getElementById('textPanel')!.getBoundingClientRect();
    this.shadowRoot!.getElementById('dropPanel')!.style.minHeight = textBounds.height + 'px';
    rectangle(svg, 0, 0, textBounds.width, textBounds.height, this.seed);
    const dropx = textBounds.width - 4;
    rectangle(svg, dropx, 0, 34, textBounds.height, this.seed);
    const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
    const poly = polygon(svg, [
      [dropx + 8, 5 + dropOffset],
      [dropx + 26, 5 + dropOffset],
      [dropx + 17, dropOffset + Math.min(textBounds.height, 18)]
    ], this.seed);
    poly.style.fill = 'currentColor';
    poly.style.pointerEvents = this.disabled ? 'none' : 'auto';
    poly.style.cursor = 'pointer';
    this.classList.add('wired-rendered');

    // aria
    this.setAttribute('aria-expanded', `${this.cardShowing}`);
    if (!this.itemNodes.length) {
      this.itemNodes = [];
      const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes();
      if (nodes && nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const element = nodes[i] as WiredComboItem;
          if (element.tagName === 'WIRED-ITEM') {
            element.setAttribute('role', 'option');
            this.itemNodes.push(element);
          }
        }
      }
    }
  }

  private refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.selected = false;
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    if (nodes) {
      let selectedItem: WiredComboItem | null = null;
      for (let i = 0; i < nodes.length; i++) {
        const element = nodes[i] as WiredComboItem;
        if (element.tagName === 'WIRED-ITEM') {
          const value = element.value || element.getAttribute('value') || '';
          if (this.selected && (value === this.selected)) {
            selectedItem = element;
            break;
          }
        }
      }
      this.lastSelectedItem = selectedItem || undefined;
      if (this.lastSelectedItem) {
        this.lastSelectedItem.selected = true;
        this.lastSelectedItem.setAttribute('aria-selected', 'true');
      }
      if (selectedItem) {
        this.value = {
          value: selectedItem.value || '',
          text: selectedItem.textContent || ''
        };
      } else {
        this.value = undefined;
      }
    }
  }

  private setCardShowing(showing: boolean) {
    if (this.card) {
      this.cardShowing = showing;
      this.card.style.display = showing ? '' : 'none';
      if (showing) {
        setTimeout(() => {
          // TODO: relayout card?
          const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes().filter((d) => {
            return d.nodeType === Node.ELEMENT_NODE;
          });
          nodes.forEach((n) => {
            const e = n as LitElement;
            if (e.requestUpdate) {
              e.requestUpdate();
            }
          });
        }, 10);
      }
      this.setAttribute('aria-expanded', `${this.cardShowing}`);
    }
  }

  private onItemClick(event: CustomEvent) {
    event.stopPropagation();
    this.selected = (event.target as WiredComboItem).value;
    this.refreshSelection();
    this.fireSelected();
    setTimeout(() => {
      this.setCardShowing(false);
    });
  }

  private fireSelected() {
    fireEvent(this, 'selected', { selected: this.selected });
  }

  private selectPrevious() {
    const list = this.itemNodes;
    if (list.length) {
      let index = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === this.lastSelectedItem) {
          index = i;
          break;
        }
      }
      if (index < 0) {
        index = 0;
      } else if (index === 0) {
        index = list.length - 1;
      } else {
        index--;
      }
      this.selected = list[index].value || '';
      this.refreshSelection();
      this.fireSelected();
    }
  }

  private selectNext() {
    const list = this.itemNodes;
    if (list.length) {
      let index = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i] === this.lastSelectedItem) {
          index = i;
          break;
        }
      }
      if (index < 0) {
        index = 0;
      } else if (index >= (list.length - 1)) {
        index = 0;
      } else {
        index++;
      }
      this.selected = list[index].value || '';
      this.refreshSelection();
      this.fireSelected();
    }
  }

  private onCombo(event: Event) {
    event.stopPropagation();
    this.setCardShowing(!this.cardShowing);
  }

}
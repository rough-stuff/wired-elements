import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { rectangle, polygon } from 'wired-lib';
import { WiredItem } from 'wired-item';
import { WiredCard } from 'wired-card';
import 'wired-card';
import 'wired-item';

interface ComboValue {
  value: string;
  text: string;
}

@customElement('wired-combo')
export class WiredCombo extends LitElement {
  @property({ type: Object }) value?: ComboValue;
  @property({ type: String }) selected?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private cardShowing = false;
  private itemNodes: WiredItem[] = [];
  private lastSelectedItem?: WiredItem;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      outline: none;
    }
  
    :host(.wired-disabled) {
      opacity: 0.5 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.02);
    }
  
    :host(.wired-pending) {
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
        <svg id="svg"></svg>
      </div>
    </div>
    <wired-card id="card" role="listbox" @item-click="${this.onItemClick}" style="display: none;">
      <slot id="slot"></slot>
    </wired-card>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
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
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.shadowRoot!.getElementById('container')!.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    const textBounds = this.shadowRoot!.getElementById('textPanel')!.getBoundingClientRect();
    this.shadowRoot!.getElementById('dropPanel')!.style.minHeight = textBounds.height + 'px';
    rectangle(svg, 0, 0, textBounds.width, textBounds.height);
    const dropx = textBounds.width - 4;
    rectangle(svg, dropx, 0, 34, textBounds.height);
    const dropOffset = Math.max(0, Math.abs((textBounds.height - 24) / 2));
    const poly = polygon(svg, [
      [dropx + 8, 5 + dropOffset],
      [dropx + 26, 5 + dropOffset],
      [dropx + 17, dropOffset + Math.min(textBounds.height, 18)]
    ]);
    poly.style.fill = 'currentColor';
    poly.style.pointerEvents = this.disabled ? 'none' : 'auto';
    poly.style.cursor = 'pointer';
    this.classList.remove('wired-pending');

    // aria
    this.setAttribute('aria-expanded', `${this.cardShowing}`);
    if (!this.itemNodes.length) {
      this.itemNodes = [];
      const nodes = (this.shadowRoot!.getElementById('slot') as HTMLSlotElement).assignedNodes();
      if (nodes && nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const element = nodes[i] as WiredItem;
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
      this.lastSelectedItem.classList.remove('selected-item');
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    if (nodes) {
      let selectedItem: WiredItem | null = null;
      for (let i = 0; i < nodes.length; i++) {
        const element = nodes[i] as WiredItem;
        if (element.tagName === 'WIRED-ITEM') {
          const value = element.value || '';
          if (this.selected && (value === this.selected)) {
            selectedItem = element;
            break;
          }
        }
      }
      this.lastSelectedItem = selectedItem || undefined;
      if (this.lastSelectedItem) {
        this.lastSelectedItem.classList.add('selected-item');
        this.lastSelectedItem.setAttribute('aria-selected', 'true');
      }
      if (selectedItem) {
        this.value = {
          value: selectedItem.value || '',
          text: selectedItem.text || ''
        };
      } else {
        this.value = undefined;
      }
    }
  }

  private setCardShowing(showing: boolean) {
    this.cardShowing = showing;
    const card = this.shadowRoot!.getElementById('card') as WiredCard;
    card.style.display = showing ? '' : 'none';
    if (showing) {
      setTimeout(() => {
        card.requestUpdate();
      }, 10);
    }
    this.setAttribute('aria-expanded', `${this.cardShowing}`);
  }

  private onItemClick(event: CustomEvent) {
    event.stopPropagation();
    this.setCardShowing(false);
    this.selected = event.detail.value;
    this.refreshSelection();
    this.fireSelected();
  }

  private fireSelected() {
    const selectedEvent = new CustomEvent('selected', { bubbles: true, composed: true, detail: { selected: this.selected } });
    this.dispatchEvent(selectedEvent);
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
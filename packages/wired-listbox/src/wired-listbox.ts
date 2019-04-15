import { WiredBase, customElement, property, TemplateResult, html, css, CSSResult } from 'wired-lib/lib/wired-base';
import { rectangle } from 'wired-lib';
import { WiredItem } from 'wired-item';
import 'wired-item';

interface ListboxValue {
  value: string;
  text: string;
}

@customElement('wired-listbox')
export class WiredListbox extends WiredBase {
  @property({ type: Object }) value?: ListboxValue;
  @property({ type: String }) selected?: string;
  @property({ type: Boolean }) horizontal = false;

  private itemNodes: WiredItem[] = [];
  private lastSelectedItem?: WiredItem;
  private itemClickHandler = this.onItemClick.bind(this);

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      padding: 5px;
      outline: none;
      opacity: 0;
    }

    :host(.wired-rendered) {
      opacity: 1;
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

    ::slotted(wired-item) {
      display: block;
    }

    :host(.wired-horizontal) ::slotted(wired-item) {
      display: inline-block;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <slot id="slot" @slotchange="${() => this.requestUpdate()}"></slot>
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'listbox');
    this.tabIndex = +((this.getAttribute('tabindex') || 0));
    this.refreshSelection();
    this.addEventListener('click', this.itemClickHandler);
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
      }
    });
  }

  updated() {
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    rectangle(svg, 0, 0, s.width, s.height);
    this.classList.add('wired-rendered');

    if (this.horizontal) {
      this.classList.add('wired-horizontal');
    } else {
      this.classList.remove('wired-horizontal');
    }

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

  private onItemClick(event: Event) {
    event.stopPropagation();
    this.selected = (event.target as WiredItem).value;
    this.refreshSelection();
    this.fireSelected();
  }

  private refreshSelection() {
    if (this.lastSelectedItem) {
      this.lastSelectedItem.selected = false;
      this.lastSelectedItem.removeAttribute('aria-selected');
    }
    const slot = this.shadowRoot!.getElementById('slot') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    if (nodes) {
      let selectedItem = null;
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

  private fireSelected() {
    this.fireEvent('selected', { selected: this.selected });
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
}
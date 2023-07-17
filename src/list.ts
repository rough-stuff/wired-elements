import { WiredBase, ce, html, TemplateResult, css, property, Point, PropertyValues } from './core/base-element.js';
import { queryAssignedNodes } from 'lit/decorators.js';
import { WiredItem } from './item.js';
import './item.js';
import './card.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-list': WiredList;
  }
}

@ce('wired-list')
export class WiredList extends WiredBase {
  @property({ type: Boolean }) horizontal = false;
  @property({ type: Boolean }) selectable = false;

  @queryAssignedNodes() private _slotted!: Node[];

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('horizontal');
  }

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: inline-block;
      opacity: 1;
      --wired-card-padding: 6px;
    }
    #container {
      gap: 2px;
    }
    `
  ];

  render(): TemplateResult {
    return html`
    <wired-card elevation="1" id="surface">
      <div id="container" class="${this.horizontal ? 'horiz' : 'vert'}" @item-click="${this._onItemClick}">
        <slot></slot>
      </div>
    </wired-card>`;
  }
  protected _sizedNode(): HTMLElement | null {
    return null;
  }

  protected _canvasSize(): Point {
    return [0, 0];
  }

  protected draw() {
    // do nothing
  }

  private get _items(): WiredItem[] {
    return (this._slotted.filter((d) => (d instanceof WiredItem))) as WiredItem[];
  }

  private get _selectedItem(): WiredItem | null {
    return this._items.find((item) => item.selected) || null;
  }

  private _onItemClick(event: Event) {
    if (this.selectable) {
      const current = this._selectedItem;
      const selected = event.target as WiredItem;
      if (current === selected) {
        return;
      }
      this._items.forEach((item) => {
        item.selected = (item === selected);
      });
      this._fire('change');
    }
  }

  get selected(): string | null {
    const item = this._selectedItem;
    if (item) {
      return item.value || item.name || '';
    }
    return null;
  }
}
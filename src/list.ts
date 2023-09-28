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

  @queryAssignedNodes({ flatten: true }) private _slotted!: Node[];

  private _focusIn = false;
  private _lastActiveItem?: WiredItem;

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
    #surface {
      display: block;
    }
    `
  ];

  render(): TemplateResult {
    return html`
    <wired-card elevation="1" id="surface" .renderer="${this.renderStyle}">
      <div id="container" class="${this.horizontal ? 'horiz' : 'vert'}" @item-click="${this._onItemClick}">
        <slot></slot>
      </div>
    </wired-card>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('focusin', this._handleFocusin);
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

  @property({ type: String })
  get selected(): string | null {
    const item = this._selectedItem;
    if (item) {
      return item.value || item.name || this.textContent;
    }
    return null;
  }

  set selected(value: string) {
    if (this.selectable) {
      const current = this._selectedItem;
      const selected = this._items.find((item) => {
        return (item.value === value) || (item.name === value);
      });
      if (current === selected) {
        return;
      }
      this._items.forEach((item) => {
        item.selected = (item === selected);
      });
      this._fire('change');
    }
  }

  private _handleFocusin = (): void => {
    if (!this._focusIn) {
      this._focusIn = true;
      this.addEventListener('focusout', this._handleFocusout);
      this.addEventListener('keydown', this._handleKeydown);
    }
  };

  private _handleFocusout = (event: FocusEvent): void => {
    const related = event.relatedTarget as Node;
    if (related && this.contains(related)) {
      return;
    }
    this._focusIn = false;
    this.removeEventListener('keydown', this._handleKeydown);
    this.removeEventListener('focusout', this._handleFocusout);
  };

  private _handleKeydown = (event: KeyboardEvent): void => {
    let activeElement = (this.getRootNode() as Document).activeElement as WiredItem;
    if (!activeElement) {
      activeElement = this._lastActiveItem || this._selectedItem || this._items[0];
    }
    if (!activeElement) {
      return;
    }
    const index = this._items.indexOf(activeElement);
    if (index < 0) {
      return;
    }
    const focusIndex = (n: number, forward: boolean, iteration: number): void => {
      const count = this._items.length;
      if (iteration > count) {
        return;
      }
      if (count) {
        const i = n < 0 ? (count - 1) : (n % count);
        const btn = this._items[i];
        if (btn.disabled) {
          if (forward) {
            focusIndex(i + 1, forward, iteration + 1);
          } else {
            focusIndex(i - 1, forward, iteration + 1);
          }
          return;
        }
        this._focusItem(btn);
        this._lastActiveItem = btn;
      }
    };

    switch (event.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        focusIndex(index - 1, false, 0);
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        focusIndex(index + 1, true, 1);
        event.preventDefault();
        break;
      case 'End':
        focusIndex(this._items.length - 1, false, 0);
        event.preventDefault();
        break;
      case 'Home':
        focusIndex(0, true, 0);
        event.preventDefault();
        break;
      case 'Escape':
      case 'Backspace':
        this._fire('key-escape');
        event.preventDefault();
        break;
    }
  };

  focus(): void {
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      if (item._focusable) {
        item.focus();
        this._lastActiveItem = item;
        return;
      }
    }
  }

  private _focusItem(item: WiredItem | null) {
    if (item) {
      for (const r of this._items) {
        if (r === item) {
          r._focusable = true;
        } else {
          r._focusable = false;
        }
      }
      item.focus();
    } else {
      for (let i = 0; i < this._items.length; i++) {
        const r = this._items[i];
        if (i === 0) {
          r._focusable = true;
        } else {
          r._focusable = false;
        }
      }
    }
  }
}
import { WiredBase, ce, html, TemplateResult, css, property, Point, query, state } from './core/base-element.js';
import { WiredList } from './list.js';
import './list.js';
import './card.js';
import './core/node-selector.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-tabs': WiredTabs;
  }
}

@ce('wired-tabs')
export class WiredTabs extends WiredBase {
  @state() private _selectedName = '';
  @query('wired-list') private _list!: WiredList;

  @property({ type: String })
  get selected(): string | null {
    return this._list.selected;
  }

  set selected(value: string) {
    this._list.selected = value;
  }

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: block;
      opacity: 1;
    }
    #surface {
      margin-top: -2px;
    }
    wired-list {
      --wired-stroke-color: transparent;
    }
    `
  ];

  render(): TemplateResult {
    return html`
    <div id="container" class="vert">
      <wired-list horizontal selectable @change="${this._handleTabChange}">
        <slot name="tab"></slot>
      </wired-list>
      <wired-card id="surface">
        <wired-node-selector selected="${this._selectedName}">
          <slot></slot>
        </wired-node-selector>
      </wired-card>
    </div>
    `;
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

  updated() {
    setTimeout(() => {
      this._selectedName = this._list.selected || '';
    }, 0);
  }

  private _handleTabChange(event: Event) {
    event.stopPropagation();
    this._selectedName = this._list.selected || '';
    this._fire('change');
  }
}
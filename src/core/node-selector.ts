import { LitElement, css, CSSResultGroup, TemplateResult, html } from 'lit';
import { queryAssignedElements } from 'lit/decorators/query-assigned-elements.js';
import { property } from 'lit/decorators/property.js';
import { customElement } from 'lit/decorators/custom-element.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-node-selector': WiredNodeSelector;
  }
}

export interface WiredSelectorItem extends HTMLElement {
  onActivate?: (name: string) => void;
  onDeactivate?: () => void;
}

@customElement('wired-node-selector')
export class WiredNodeSelector extends LitElement {
  @property({ reflect: true }) selected?: string;
  @queryAssignedElements({ flatten: true }) private _slotted!: Array<WiredSelectorItem>;

  private _pageMap = new Map<string, HTMLElement>();
  private _current?: WiredSelectorItem;

  private get _slottedItems(): WiredSelectorItem[] {
    return this._slotted || [];
  }

  static styles: CSSResultGroup = [
    css`
      :host {
        display: contents;
      }
    `
  ];

  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  firstUpdated(): void {
    this._pageMap.clear();
    const pages = this._slottedItems;
    for (const page of pages) {
      const name = page.getAttribute('name') || '';
      if (name) {
        name.trim().split(' ').forEach((nameSegment) => {
          if (nameSegment) {
            this._pageMap.set(nameSegment, page);
          }
        });
      }
    }
  }

  private getElement(): WiredSelectorItem | null {
    let e: HTMLElement | undefined = undefined;
    if (this.selected) {
      e = this._pageMap.get(this.selected);
    }
    if (e) {
      return e as WiredSelectorItem;
    }
    return null;
  }

  updated(): void {
    const newPage = this.getElement();
    const samePage = newPage === this._current;
    if (this._current && (!samePage) && this._current.onDeactivate) {
      try {
        this._current.onDeactivate();
      } catch (err) { console.error(err); }
    }
    for (const p of this._slottedItems) {
      if (p === newPage) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    }
    this._current = newPage || undefined;
    if (this._current && this._current.onActivate) {
      try {
        this._current.onActivate(this.selected || '');
      } catch (err) { console.error(err); }
    }
  }
}
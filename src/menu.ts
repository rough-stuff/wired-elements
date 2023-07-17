import { ce, property } from './core/base-element.js';
import { WiredPopover } from './popover.js';
import { queryAssignedNodes } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-menu': WiredPopover;
  }
}

@ce('wired-menu')
export class WiredMenu extends WiredPopover {
  @property({ type: Boolean }) autofocus = false;

  private _connected = false;
  private _node?: HTMLElement;
  @queryAssignedNodes() private _slotted!: Node[];

  private get _slottedList(): HTMLElement | null {
    const found = this._slotted.find((d) => {
      if (d.nodeType === Node.ELEMENT_NODE) {
        const tag = (d as HTMLElement).tagName.toLowerCase();
        return tag === 'wired-list';
      }
      return false;
    });
    return found ? (found as HTMLElement) : null;
  }

  set acnchor(node: HTMLElement) {
    super.anchor = node;
    this._attachToNode(node);
  }

  private _clickListener = () => {
    this.open = !this.open;
    if (this.open && this.autofocus) {
      const list = this._slottedList;
      if (list) {
        setTimeout(() => {
          if (this.open) {
            list.focus();
          }
        });
      }
    }
  };


  private _detachNode() {
    if (this._node) {
      this._node.removeEventListener('click', this._clickListener);
      this._node = undefined;
    }
  }

  private _attachToNode(node: HTMLElement) {
    if (this._connected && (node !== this._node)) {
      this._detachNode();
      node.addEventListener('click', this._clickListener);
      this._node = node;
    }
  }

  private _selectListener = () => {
    if (!this.manualClose) {
      this.open = false;
    }
  };

  connectedCallback(): void {
    this._connected = true;
    super.connectedCallback();
    let relatedNode = super.anchor;
    if (!relatedNode) {
      relatedNode = ((this.previousElementSibling || this.nextElementSibling || this.parentElement) as HTMLElement) || undefined;
    }
    if (relatedNode) {
      this._attachToNode(relatedNode);
    }
    this.addEventListener('item-click', this._selectListener);
    this.style.setProperty('--wired-card-padding', '0');
  }

  disconnectedCallback(): void {
    this._connected = false;
    this._detachNode();
    this.removeEventListener('item-click', this._selectListener);
    super.disconnectedCallback();
  }
}
import { WiredBase, ce, html, TemplateResult, css, property, Point } from './core/base-element.js';
import { queryAssignedNodes } from 'lit/decorators.js';
import { WiredRadio } from './radio';

declare global {
  interface HTMLElementTagNameMap {
    'wired-radio-group': WiredRadioGroup;
  }
}

@ce('wired-radio-group')
export class WiredRadioGroup extends WiredBase {
  @property({ type: Boolean, reflect: true }) vertical = false;
  @queryAssignedNodes() private _slotted!: Node[];

  private _selectedRadio?: WiredRadio;
  private _focusIn = false;

  get selected(): string | null {
    for (const r of this._buttons) {
      if (r.checked) {
        return r.value || null;
      }
    }
    return this._selectedRadio?.value || null;
  }

  private get _buttons(): WiredRadio[] {
    return (this._slotted.filter((d) => (d instanceof WiredRadio))) as WiredRadio[];
  }

  constructor() {
    super();
    this.addEventListener('focusin', this.handleFocusin);
  }

  static styles = [
    WiredBase.styles,
    css`
    :host {
      opacity: 1;
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }
    :host([vertical]) {
      flex-direction: column;
    }
    `
  ];

  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  firstUpdated(): void {
    this.addEventListener('change', (event) => {
      if (event.target === this) {
        return;
      }
      event.stopPropagation();
      const radio = event.target as WiredRadio;
      if (radio.checked) {
        this.selectRadio(radio);
      }
      this._fire('change');
    });
    for (const btn of this._buttons) {
      if (btn.checked) {
        this.selectRadio(btn);
      }
    }
  }

  private selectRadio(item: WiredRadio | null) {
    this._selectedRadio = item || undefined;
    for (const r of this._buttons) {
      if (r === item) {
        if (!item.checked) {
          item.checked = true;
        }
      } else {
        r.checked = false;
      }
    }
    if (item) {
      item.focus();
    }
    const selected = item && item.value;
    if (selected) {
      this.setAttribute('selected', selected);
    } else {
      this.removeAttribute('selected');
    }
  }

  private handleFocusin = (event: FocusEvent): void => {
    if (!this._focusIn) {
      this._focusIn = true;
      this.addEventListener('focusout', this.handleFocusout);
      this.addEventListener('keydown', this.handleKeydown);
      if (this._selectedRadio) {
        if (this._selectedRadio !== event.target) {
          this._selectedRadio.focus();
        }
      } else {
        const first = this._buttons.find((d) => !d.disabled);
        if (first && (first !== event.target)) {
          first.focus();
        }
      }
    }
  };

  private handleFocusout = (event: FocusEvent): void => {
    const related = event.relatedTarget as Node;
    if (related && this.contains(related)) {
      return;
    }
    this._focusIn = false;
    this.removeEventListener('keydown', this.handleKeydown);
    this.removeEventListener('focusout', this.handleFocusout);
  };

  private handleKeydown = (event: KeyboardEvent): void => {
    const activeElement = (this.getRootNode() as Document).activeElement as WiredRadio;
    if (!activeElement) {
      return;
    }
    const index = this._buttons.indexOf(activeElement);
    if (index < 0) {
      return;
    }
    const selectIndex = (n: number, forward: boolean, iteration: number): void => {
      const count = this._buttons.length;
      if (iteration > count) {
        return;
      }
      if (count) {
        const i = n < 0 ? (count - 1) : (n % count);
        const btn = this._buttons[i];
        if (btn.disabled) {
          if (forward) {
            selectIndex(i + 1, forward, iteration + 1);
          } else {
            selectIndex(i - 1, forward, iteration + 1);
          }
          return;
        }
        this.selectRadio(btn);
      }
    };

    switch (event.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        selectIndex(index - 1, false, 0);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        selectIndex(index + 1, true, 1);
        break;
      case 'End':
        selectIndex(this._buttons.length - 1, false, 0);
        break;
      case 'Home':
        selectIndex(0, true, 0);
        break;
    }
  };

  protected _sizedNode(): HTMLElement | null {
    return null;
  }

  protected _canvasSize(): Point {
    return [0, 0];
  }

  protected draw(): void {
    // do nothing
  }
}

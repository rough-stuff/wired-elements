import { WiredBase, ce, html, TemplateResult, css, property, state, query, Point, PropertyValues } from './core/base-element.js';
import { ellipse } from './core/graphics.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { line, roundedRectangle } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-search-input': WiredSearchInput;
  }
}

@ce('wired-search-input')
export class WiredSearchInput extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() icon: 'search' | 'clear' = 'search';
  @property() placeholder = '';
  @property() name?: string;
  @property() autocomplete = '';

  @state() private _focused = false;

  @query('input') private _input!: HTMLInputElement;
  @query('label') private _label!: HTMLInputElement;

  private _pendingValue?: string;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('icon');
  }

  @property()
  get value(): string {
    if (this._input) {
      return this._input.value;
    } else if (this._pendingValue !== undefined) {
      return this._pendingValue;
    }
    return '';
  }

  set value(v: string) {
    if (this._input) {
      this._input.value = v;
    } else {
      this._pendingValue = v;
    }
  }

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: inline-flex;
      vertical-align: top;
      flex-direction: column;
      width: 300px;
      font-size: 1rem;
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    label {
      display: block;
      width: 100%;
      padding: 0 0 0 24px;
      height: 56px;
      position: relative;
    }
    input::placeholder {
      opacity: 0.7;
    }
    input {
      color: inherit;
      border: none;
      display: block;
      width: 100%;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      margin: 0;
      padding: 0;
      appearance: none;
      background-color: transparent;
      caret-color: var(--wired-primary, #0D47A1);
      border-radius: 0;
      outline: none;
      height: 100%;
    }
    input[type=search]::-ms-clear {  display: none; width : 0; height: 0; }
    input[type=search]::-ms-reveal {  display: none; width : 0; height: 0; }
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
      display: none;
    }
    input:disabled {
      background: inherit;
    }
    label.focused path {
      stroke-width: 1.35;
      --wired-stroke-color: var(--wired-primary, #0D47A1);
    }
    #iconPanel {
      height: 100%;
      width: 56px;
      border-radius: 0 50% 50% 0;
      cursor: pointer;
    }

    @media (hover: hover) {
      label:hover path {
        stroke-width: 1;
      }
    }
    `
  ];

  render(): TemplateResult {
    const cc: ClassInfo = {
      focused: this._focused
    };
    return html`
    <label class="horiz center ${classMap(cc)}">
      <div class="flex">
        <input 
          name="${ifDefined(this.name)}"
          type="search"
          ?disabled="${this.disabled}"
          autocomplete="${this.autocomplete}"
          placeholder="${this.placeholder}"
          aria-labelledby="label"
          @change=${this._onChange}
          @input=${this._onInput}
          @focus=${this._onFocus}
          @blur=${this._onBlur}>
      </div>
      <div id="iconPanel" @click="${this._onIconClick}"></div>
      
      <div id="overlay">
        <svg></svg>
      </div>
    </label>
    `;
  }

  firstUpdated(): void {
    if (this._pendingValue) {
      this._input.value = this._pendingValue;
      this._pendingValue = undefined;
    }
  }

  focus(): void {
    this._input?.focus();
  }

  blur(): void {
    this._input?.blur();
  }

  private _onFocus() {
    this._focused = true;
  }

  private _onBlur() {
    this._focused = false;
  }

  private _onChange(event: Event) {
    event.stopPropagation();
    this._fire('change');
  }

  private _onInput(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this._fire('input');
  }

  protected _sizedNode(): HTMLElement | null {
    return this._label || null;
  }

  protected _canvasSize(): Point {
    if (this._label) {
      const { width, height } = this._label.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    const [width, height] = size;
    const randomizer = this._randomizer();
    const rect = roundedRectangle([2, 2], width - 4, height - 4, height / 2, randomizer, this.renderStyle);
    this._renderPath(svg, rect);
    const yo = (height - 30) / 2;
    if (this.icon === 'clear') {
      this._renderPath(svg, line([width - 44, yo], [width - 20, yo + 24], randomizer, this.renderStyle));
      this._renderPath(svg, line([width - 20, yo], [width - 44, yo + 24], randomizer, this.renderStyle));
    } else {
      this._renderPath(svg, ellipse([width - 36, height - 34], 16, 16, randomizer));
      this._renderPath(svg, line([width - 32, height - 28], [width - 20, height - 16], randomizer, this.renderStyle));
    }
  }

  private _onIconClick(e: Event) {
    e.stopPropagation();
    this._fire('icon-click');
  }
}
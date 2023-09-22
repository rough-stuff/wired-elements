import { WiredBase, ce, html, TemplateResult, css, property, state, query, Point, PropertyValues } from './core/base-element.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { rectangle, linearPath } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-textarea': WiredTextarea;
  }
}

@ce('wired-textarea')
export class WiredTextarea extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) resizable = false;
  @property({ type: Number }) rows = 2;
  @property() label = '';
  @property() placeholder = '';
  @property() name?: string;
  @property() autocomplete = '';

  @state() private _focused = false;
  @state() private _hasText = false;

  @query('textarea') private _input!: HTMLTextAreaElement;
  @query('label') private _label!: HTMLInputElement;
  @query('#obcenter') private _obcenter!: HTMLElement;

  private _pendingValue?: string;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('label') || changed.has('_focused') || changed.has('_hasText');
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
      this._updateHasText();
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
      width: 280px;
      font-size: 1rem;
      line-height: 1.5;
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    label {
      display: block;
      width: 100%;
      padding: 16px;
      min-height: 56px;
      position: relative;
      border-radius: 0;
      text-overflow: clip;
      transform-origin: left center;
    }
    label.nolabel textarea::placeholder {
      opacity: 0.7;
    }
    label.focused textarea::placeholder {
      opacity: 0.7;
    }
    label.focused #label {
      color: var(--wired-primary, #0D47A1);
      opacity: 1;
    }
    label.notched #label {
      transform: translateY(-28.25px) scale(0.75);
    }
    textarea {
      color: inherit;
        border: none;
        display: block;
        width: 100% !important;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
        line-height: inherit;
        margin: 0;
        padding: 0;
        appearance: none;
        caret-color: var(--wired-primary, #0D47A1);
        border-radius: 0;
        outline: none;
        resize: none;
        background: transparent;
    }
    textarea:disabled {
      background: inherit;
    }
    textarea::placeholder {
      transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      opacity: 0;
    }
    textarea.resizable {
      resize: vertical;
    }
    .textlabel {
      font-family: var(--wired-label-font-family, inherit);
      font-size: var(--wired-label-font-size, inherit);
      font-weight: var(--wired-label-font-weight, inherit);
      letter-spacing: var(--wired-label-letter-spacing, inherit);
      text-transform: var(--wired-label-text-transform, inherit);
      white-space: nowrap;
      line-height: var(--wired-label-text-line-height, 1.15);
      text-align: left;
    }
    #label {
      position: absolute;
      top: 19px;
      left: 16px;
      pointer-events: none;
      color: inherit;
      opacity: 0.6;
      transform-origin: left top;
      text-overflow: ellipsis;
      cursor: text;
      overflow: hidden;
      will-change: transform;
      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
    }
    #outlineBorder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    #obleft {
      width: 12px;
      border-radius: 4px 0 0 4px;
      border-left: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: transparent;
    }
    #obright {
      border-radius: 0 4px 4px 0;
      border-right: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: transparent;
    }
    #obcenter {
      padding: 0 4px;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: transparent;
    }
    #oblabel {
      font-size: 0.75em;
      transform: translateY(-50%);
      display: block;
      opacity: 0;
    }
    label.notched #obcenter {
      border-top: none;
    }
    label.focused path {
      stroke-width: 1.35;
      --wired-stroke-color: var(--wired-primary, #0D47A1);
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
      focused: this._focused,
      nolabel: !this.label,
      notched: !!(this.label && (this._focused || this._hasText)),
      hastext: this._hasText
    };
    const inputCC: ClassInfo = {
      resizable: this.resizable
    };
    return html`
    <label class="horiz center ${classMap(cc)}">
      ${this.label ? html`<span id="label" class="textlabel">${this.label}</span>` : null}

      <textarea 
        class="${classMap(inputCC)}"
        name="${ifDefined(this.name)}"
        ?disabled="${this.disabled}"
        rows="${ifDefined(this.rows)}"
        autocomplete="${this.autocomplete}"
        placeholder="${this.placeholder}"
        aria-labelledby="label"
        @change=${this._onChange}
        @input=${this._onInput}
        @focus=${this._onFocus}
        @blur=${this._onBlur}></textarea>

      <div id="outlineBorder" class="horiz">
        <span id="obleft"></span>
        ${this.label ? html`
        <div id="obcenter">
          <span id="oblabel" class="textlabel">${this.label}</span>
        </div>
        ` : null}
        <span id="obright" class="flex"></span>
      </div>

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
      this._updateHasText();
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

  private _updateHasText() {
    this._hasText = !!(this._input.value);
  }

  private _onInput(event?: Event) {
    this._updateHasText();
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
    const notched = !!(this.label && (this._focused || this._hasText));
    const randomizer = this._randomizer();
    if (notched) {
      const labelWidth = this._obcenter.getBoundingClientRect().width;
      const path = linearPath([
        [12, 2],
        [2, 2],
        [2, height - 2],
        [width - 2, height - 2],
        [width - 2, 2],
        [labelWidth + 14, 2]
      ], false, randomizer, this.renderStyle);
      this._renderPath(svg, path);
    } else {
      const rect = rectangle([2, 2], width - 4, height - 4, randomizer, this.renderStyle);
      this._renderPath(svg, rect);
    }
  }
}
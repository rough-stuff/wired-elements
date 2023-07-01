import { WiredBase, ce, html, TemplateResult, css, property, state, query, Point } from './core/base-element.js';
// import { rectangle, line, roundedRectangle, RenderOps, Op } from './core/graphics.js';
// import { renderSvgPath, fillSvgPath } from './core/svg-render.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-textfield': WiredTextfield;
  }
}

@ce('wired-textfield')
export class WiredTextfield extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) type = 'text';
  @property() label = '';
  @property() placeholder = '';
  @property() name?: string;
  @property() autocomplete = '';
  @property({ type: Boolean, attribute: 'end-align' }) endAlign = false;

  @state() private _focused = false;
  @state() private _hasText = false;

  @query('input') private _input!: HTMLInputElement;
  @query('label') private _label!: HTMLInputElement;

  private _pendingValue?: string;

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
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    label {
      display: block;
      width: 100%;
      padding: 0 16px 0;
      height: 56px;
      position: relative;
      border-top-left-radius: var(--nv-textfield-border-radius, 4px);
      border-top-right-radius: var(--nv-textfield-border-radius, 4px);
      border-radius: var(--nv-textfield-border-radius, 4px);
    }
    label.nolabel {
      padding-top: 0;
      padding-bottom: 0;
    }
    label.nolabel input {
      height: 100%;
    }
    label.nolabel input::placeholder {
      opacity: 0.7;
    }
    label.focused #border::after {
      opacity: 1;
      transform: scaleX(1);
    }
    label.focused input::placeholder {
      opacity: 0.7;
    }
    label.focused #label {
      color: var(--nv-primary, #6200ee);
      opacity: 1;
    }
    label.notched #label {
      transform: translateY(-37.25px) scale(0.75);
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
      caret-color: var(--nv-primary, #6200ee);
      border-radius: 0;
      outline: none;
      height: 28px;
    }
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
    input:disabled {
      background: inherit;
    }
    input::placeholder {
      transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      opacity: 0;
    }
    input.endalign {
      text-align: right;
    }
    .textlabel {
      font-family: var(--nv-label-font-family, inherit);
      font-size: var(--nv-label-font-size, inherit);
      font-weight: var(--nv-label-font-weight, inherit);
      letter-spacing: var(--nv-label-letter-spacing, inherit);
      text-transform: var(--nv-label-text-transform, inherit);
      white-space: nowrap;
      line-height: var(--nv-label-text-line-height, 1.15);
      text-align: left;
    }
    #label {
      position: absolute;
      top: 50%;
      left: 16px;
      transform: translateY(-50%);
      pointer-events: none;
      color: inherit;
      opacity: 0.6;
      text-overflow: ellipsis;
      cursor: text;
      overflow: hidden;
      will-change: transform;
      transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s, color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
      text-overflow: clip;
      transform-origin: left center;
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
      border-radius: var(--nv-textfield-border-radius, 4px) 0 0 var(--nv-textfield-border-radius, 4px);
      border-left: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: var(--nv-textfield-line-color, rgba(0, 0, 0, 0.42));
    }
    #obright {
      border-radius: 0 var(--nv-textfield-border-radius, 4px) var(--nv-textfield-border-radius, 4px) 0;
      border-right: 1px solid;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: var(--nv-textfield-line-color, rgba(0, 0, 0, 0.42));
    }
    #obcenter {
      padding: 0 4px;
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-color: var(--nv-textfield-line-color, rgba(0, 0, 0, 0.42));
    }
    #oblabel {
      font-size: 0.75em;
      transform: translateY(-50%);
      display: block;
      opacity: 0;
    }
    label.focused #obleft,
    label.focused #obcenter,
    label.focused #obright {
      border-color: var(--nv-primary, #6200ee);
      border-width: 2px;
    }
    label.notched #obcenter {
      border-top: none;
    }

    @media (hover: hover) {
      label:hover #obright,
      label:hover #obcenter,
      label:hover #obleft {
        border-color: var(--nv-textfield-line-color, rgba(0, 0, 0, 0.6));
      }
      label.focused:hover #obright,
      label.focused:hover #obcenter,
      label.focused:hover #obleft {
        border-color: var(--nv-primary, #6200ee);
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
      endalign: this.endAlign
    };
    return html`
    <label class="horiz center ${classMap(cc)}">
      ${this.label ? html`<span id="label" class="textlabel">${this.label}</span>` : null}

      <input 
        class="${classMap(inputCC)}"
        name="${ifDefined(this.name)}"
        type="${this.type}"
        ?disabled="${this.disabled}"
        autocomplete="${this.autocomplete}"
        placeholder="${this.placeholder}"
        aria-labelledby="label"
        @change=${this._onChange}
        @input=${this._onInput}
        @focus=${this._onFocus}
        @blur=${this._onBlur}>

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

  protected draw(svg: SVGSVGElement): void {
    // if (this._button) {
    //   const { width, height } = this._button.getBoundingClientRect();
    //   const elev = Math.min(Math.max(1, this.elevation), 5);
    //   const elevOffset = 2;

    //   if (this.rounded) {
    //     const radius = (height / 2);
    //     const radiusOffset = radius - 10;
    //     const rect = roundedRectangle([2, 2], width - 4, height - 4, radius, this._randomizer);
    //     if (this.type === 'solid') {
    //       fillSvgPath(svg, rect.overlay.length ? rect.overlay : rect.shape);
    //     }
    //     renderSvgPath(svg, rect);
    //     for (let i = 1; i < elev; i++) {
    //       renderSvgPath(svg, line([radiusOffset + (i * elevOffset), height + (i * 2)], [width - radiusOffset - (i * elevOffset), height + (i * 2)], this._randomizer, true, 0.5))
    //         .style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
    //     }

    //   } else {
    //     const rect = rectangle([2, 2], width - 4, height - 4, this._randomizer);
    //     if (this.type === 'solid') {
    //       fillSvgPath(svg, this._mergedShape(rect));
    //     }
    //     renderSvgPath(svg, rect);
    //     for (let i = 1; i < elev; i++) {
    //       [
    //         line([i * elevOffset, height + (i * 2)], [width + (i * 2), height + (i * 2)], this._randomizer, true, 0.5),
    //         line([width + (i * 2), height + (i * 2)], [width + (i * 2), i * elevOffset], this._randomizer, true, 0.5)
    //       ].forEach((ops) => {
    //         renderSvgPath(svg, ops).style.strokeOpacity = `${(100 - (i * 10)) / 100}`;
    //       });
    //     }
    //   }

    // }
  }
}
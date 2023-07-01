import { WiredBase, ce, html, TemplateResult, css, property, query, Point, PropertyValues, state } from './core/base-element.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ellipse } from './core/graphics.js';
import { renderSvgPath, fillSvgPath } from './core/svg-render.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-radio': WiredRadio;
  }
}

@ce('wired-radio')
export class WiredRadio extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property() value?: string;

  @state() private _focused = false;

  @query('input') private _input?: HTMLInputElement;
  @query('label') private _label?: HTMLInputElement;

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return changed.has('checked');
  }

  static styles = [
    WiredBase.styles,
    css`
    :host {
      display: inline-block;
    }
    :host([disabled]) label {
      pointer-events: none;
      opacity: 0.38;
    }
    input {
      margin: 0;
      padding: 0;
      width: 28px;
      height: 28px;
      opacity: 0;
      cursor: pointer;
      outline: none;
    }
    label {
      gap: 12px;
      position: relative;
    }
    label.focused path {
      stroke-width: 1.35;
    }
    :host([checked]) label path {
      --wired-stroke-color: var(--wired-primary, #0D47A1);
      stroke-width: 2;
    }
    .backdrop {
      opacity: 0.1;
    }
    label.focused .backdrop {
      opacity: 0.5;
    }

    @media (hover: hover) {
      label:hover path {
        stroke-width: 1;
      }
      label:hover .backdrop {
        opacity: 0.3;
      }
    }
    `
  ];

  render(): TemplateResult {
    return html`
    <label class="horiz center ${this._focused ? 'focused' : ''}">
      <input type="radio" 
        .checked="${this.checked}"
        value="${ifDefined(this.value)}"
        ?disabled="${this.disabled}" 
        @change="${this._onChange}"
        @focus="${() => this._focused = true}"
        @blur="${() => this._focused = false}">
      <span class="label"><slot></slot></span>
      <div id="overlay">
        <svg></svg>
      </div>
    </label>
    `;
  }

  private _onChange(event: Event) {
    this.checked = this._input?.checked || false;
    event.stopPropagation();
    this._fire(event.type);
  }

  focus() {
    this._input?.focus();
  }

  blur() {
    this._input?.blur();
  }

  protected _sizedNode(): HTMLElement | null {
    return this._label || null;
  }

  protected _canvasSize(): Point {
    return [28, 28];
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    const [width, height] = size;
    const randomizer = this._randomizer();
    renderSvgPath(svg, ellipse([width / 2, height / 2], width - 4, height - 4, randomizer));
    if (this.checked) {
      const infill = ellipse([width / 2, height / 2], width * 0.6, height * 0.6, randomizer);
      fillSvgPath(svg, infill.shape);
    }

  }
}
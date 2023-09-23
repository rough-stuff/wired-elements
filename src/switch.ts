import { WiredBase, ce, html, TemplateResult, css, property, state, query, Point, PropertyValues } from './core/base-element.js';
import { ellipse } from './core/graphics.js';
import { fillSvgPath, createGroup } from './core/svg-render.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { rectangle } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-switch': WiredSwitch;
  }
}

@ce('wired-switch')
export class WiredSwitch extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) checked = false;

  @state() private _focused = false;

  @query('input') private _i?: HTMLInputElement;
  @query('#container') private _container!: HTMLDivElement;

  static styles = [
    WiredBase.styles,
    css`
      :host {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      #container {
        padding: var(--wired-switch-padding, 17px 14px);
        user-select: none;
        position: relative;
        width: 64px;
        height: 40px;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        margin: 0;
        cursor: pointer;
      }
      :host([disabled]) #container {
        opacity: 0.5;
        pointer-events: none;
      }
      #switchKnob {
        transform: translateX(0px);
        transition: transform 0.3s ease;
        --wired-fill-color: var(--wired-switch-off-color, gray);
      }
      #container.checked #switchKnob {
        transform: translateX(36px);
        --wired-fill-color: var(--wired-switch-on-color);
      }
      #container.focused path {
        stroke-width: 1.35;
      }

      @media (hover: hover) {
        #container:hover path {
          stroke-width: 1;
        }
      }
    `,
  ];

  render(): TemplateResult {
    const cc: ClassInfo = {
      focused: this._focused,
      checked: this.checked
    };
    return html`
    <div id="container" class="horiz center ${classMap(cc)}">
      <input 
        type="checkbox"
        ?disabled="${this.disabled}"
        ?checked="${this.checked}" 
        @change=${this._onChecked}
        @focus=${this._onFocus}
        @blur=${this._onBlur}>
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
  }

  updated(changed: PropertyValues<WiredSwitch>) {
    if (changed.has('checked')) {
      if (this._i) {
        this._i.checked = this.checked;
      }
    }
    super.updated(changed);
  }

  private _onFocus() {
    this._focused = true;
  }

  private _onBlur() {
    this._focused = false;
  }

  private _onChecked(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this._fire(event.type);
  }

  focus(): void {
    this._i?.focus();
  }

  blur(): void {
    this._i?.blur();
  }

  protected _sizedNode(): HTMLElement | null {
    return this._container || null;
  }

  protected _canvasSize(): Point {
    if (this._container) {
      const { width, height } = this._container.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    const [width, height] = size;
    const randomizer = this._randomizer();
    const rect = rectangle([14, (height / 2) - 6], width - 28, 12, randomizer, this.renderStyle);
    this._renderPath(svg, rect);
    const circle = ellipse([14, height / 2], 24, 24, randomizer);
    const knob = createGroup(svg, 'switchKnob');
    fillSvgPath(knob, circle.shape);
    this._renderPath(knob, circle);
  }
}
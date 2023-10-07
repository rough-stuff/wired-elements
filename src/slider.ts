import { WiredBase, ce, html, TemplateResult, css, property, state, query, Point, PropertyValues } from './core/base-element.js';
import { mergedShape } from './core/graphics.js';
import { fillSvgPath, createGroup } from './core/svg-render.js';
import { PointerTrackerHandler, Pointer, InputEvent, PointerTracker } from './core/pointers.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import { rectangle, ellipse } from './core/renderer.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-slider': WiredSlider;
  }
}

@ce('wired-slider')
export class WiredSlider extends WiredBase implements PointerTrackerHandler {
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 0;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) markers = false;

  @query('#container') private _container!: HTMLDivElement;
  @query('#outerContainer') private _outerContainer!: HTMLDivElement;
  @query('input') private _input!: HTMLInputElement;

  @state() private _pct = 0;
  @state() private _tracking = false;
  @state() private _focussed = false;
  @state() private _marks: number[] = [];
  private _currentValue = 0;
  private _value = 0;

  @property({ type: Number })
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v;
    this.setCurrentValue(v, false);
  }

  get currentValue(): number {
    return this._currentValue;
  }

  private setCurrentValue(value: number, fire: boolean, force = false) {
    if (force || (value !== this._currentValue)) {
      this._currentValue = value;
      this._pct = (this.max === this.min) ? 0 : ((value - this.min) / (this.max - this.min)) * 100;
      this._pct = Math.max(0, Math.min(100, this._pct));
      if (fire) {
        this._fire('input');
      }
    }
  }

  protected _forceRenderOnChange(changed: PropertyValues): boolean {
    return (changed.has('_pct'));
  }

  static styles = [
    WiredBase.styles,
    css`
      :host {
        display: block;
        min-width: 120px;
        cursor: pointer;
      }
      #outerContainer {
        position: relative;
        padding: 0 12px;
      }
      #container {
        height: 48px;
        position: relative;
        touch-action: none;
      }
      #sliderBaseTrack {
        --wired-stroke-color: var(--wired-primary, #0D47A1);
        opacity: 0.35;
      }
      #sliderActiveTrack {
        --wired-fill-color: var(--wired-primary, #0D47A1);
        opacity: 0.85;
      }
      #sliderKnob {
        --wired-fill-color: var(--wired-primary, #0D47A1);
        --wired-stroke-color: #fff;
      }
      #thumb {
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 0;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        background-color: var(--wired-primary, #0D47A1);
        border-radius: 10px;
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
      }
      input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        pointer-events: none;
        opacity: 0;
      }
      .marker {
        position: absolute;
        top: 50%;
        width: 4px;
        height: 4px;
        border-radius: 4px;
        transform: translate3d(-50%, -50%, 0);
        background-color: var(--wired-primary, #0D47A1);
      }
      #valueLabel {
        background-color: var(--wired-primary, #0D47A1);
        color: var(--wired-on-primary, #fff);
        padding: 6px 8px;
        position: absolute;
        top: 50%;
        font-size: 14px;
        line-height: 1;
        border-radius: 4px;
        transform:  translate3d(0, 0, 0) translate3d(-50%, -50%, 0px) scale(0);
        transition: transform 0.28s cubic-bezier(0.4, 0.0, 0.2, 1);
        pointer-events: none;
      }
      #valueLabel::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 50%;
        width: 0px;
        margin-left: -6px;
        height: 0px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid var(--wired-primary, #0D47A1);
      }
      
      #container.focussed #valueLabel {
        transform: translate3d(1px, -16px, 0px) translate3d(-50%, -100%, 0px) scale(1);
      }

      :host([disabled]) {
        cursor: initial;
        pointer-events: none;
      }
      :host([disabled]) #sliderBaseTrack {
        --wired-stroke-color: var(--wired-disabled-color, rgb(154, 154, 154));
      }
      :host([disabled]) #sliderActiveTrack {
        --wired-fill-color: var(--wired-disabled-color, rgb(154, 154, 154));
        opacity: 0.35;
      }
      :host([disabled]) #sliderKnob {
        --wired-fill-color: var(--wired-disabled-color, rgb(154, 154, 154));
        opacity: 0.85;
      }

      @media (hover: hover) {
        #container:hover #valueLabel,
        #container.focussed:hover #valueLabel {
          transform: translate3d(1px, -16px, 0px) translate3d(-50%, -100%, 0px) scale(1);
        }
      }
    `
  ];

  render(): TemplateResult {
    const cc: ClassInfo = {
      tracking: this._tracking,
      focussed: this._focussed
    };
    const pct = `${this._pct}%`;
    const thumbStyles: StyleInfo = {
      left: pct,
      bottom: null
    };
    return html`
    <div id="outerContainer">
      <div id="container" class="${classMap(cc)}">
        ${this._marks.map((n) => html`<div class="marker" style="left: ${n}%;"></div>`)}
        <div id="thumb" style=${styleMap(thumbStyles)}>
          <input 
            type="range"
            aria-valuemin="${this.min}"
            aria-valuemax="${this.max}"
            aria-valuenow="${this._currentValue}" 
            .min="${`${this.min}`}" 
            .max="${`${this.max}`}" 
            .value="${`${this._currentValue}`}"
            ?disabled="${this.disabled}"
            @focus=${this.onInputFocus}
            @blur=${this.onInputBlur}
            @input=${(e: Event) => e.stopPropagation()}
            @change=${(e: Event) => e.stopPropagation()}>
        </div>
        ${this.step ? html`
          <div id="valueLabel" style=${styleMap(thumbStyles)}>${this._currentValue}</div>
        ` : null}
      </div>
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
  }

  firstUpdated(): void {
    new PointerTracker(this._container, this);
    const newValue = Math.max(this.min, Math.min(this.max, this._currentValue));
    if (newValue !== this.value) {
      this.value = newValue;
      this.requestUpdate();
    }
  }

  updated(changed: PropertyValues<WiredSlider>): void {
    if (changed.has('min') || changed.has('max')) {
      this.setCurrentValue(this._currentValue, false, true);
    }
    if (changed.has('min') || changed.has('max') || changed.has('step') || changed.has('markers')) {
      this.recomputeMarkers();
    }
    super.updated(changed);
  }

  private onInputFocus() {
    this._focussed = true;
    this.addEventListener('keydown', this.handleKeydown);
  }

  private onInputBlur() {
    this._focussed = false;
    this.removeEventListener('keydown', this.handleKeydown);
  }

  private recomputeMarkers() {
    this._marks = [];
    if (this.step && this.markers && (this.max > this.min)) {
      let current = this.min;
      while (current < this.max) {
        const mv = ((current - this.min) / (this.max - this.min)) * 100;
        if (mv > 0 && mv < 100) {
          this._marks.push(mv);
        }
        current = Math.min(this.max, current + this.step);
      }
    }
  }

  private setValueFromPointer(pointer: Pointer) {
    const { left, width } = this._container.getBoundingClientRect();
    let pct = width ? ((pointer.clientX - left) / width) : 0;
    pct = Math.max(0, Math.min(1, pct));
    let value = ((this.max - this.min) * pct) + this.min;
    if (this.step) {
      const n = Math.round((value - this.min) / this.step);
      value = Math.min(this.max, (n * this.step) + this.min);
    }
    this.setCurrentValue(value, true);
  }

  onTrackStart(pointer: Pointer, event: InputEvent): boolean {
    if (this._tracking) {
      return false;
    }
    event.preventDefault();
    this._tracking = true;
    this._input.focus();
    this.setValueFromPointer(pointer);
    return true;
  }

  onTrackMove(changedPointers: Pointer[]): void {
    if (this._tracking) {
      this.setValueFromPointer(changedPointers[0]);
    }
  }

  onTrackEnd(): void {
    if (this._tracking) {
      this._tracking = false;
      this.updateConfirmedValue();
    }
  }

  private updateConfirmedValue() {
    if (this._value !== this._currentValue) {
      this.value = this._currentValue;
      this._fire('change');
    }
  }

  private _increment(d: number) {
    let newValue = this._currentValue;
    if (this.step) {
      const n = Math.floor((this._currentValue - this.min) / this.step) + d;
      newValue = Math.min(this.max, (n * this.step) + this.min);
    } else {
      newValue = Math.min(this.max, this._currentValue + ((d / 20) * (this.max - this.min)));
    }
    if (newValue !== this._currentValue) {
      this.setCurrentValue(newValue, true);
      this.updateConfirmedValue();
    }
  }

  private _decrement(d: number) {
    let newValue = this._currentValue;
    if (this.step) {
      const n = Math.ceil((this._currentValue - this.min) / this.step) - d;
      newValue = Math.max(this.min, (n * this.step) + this.min);
    } else {
      newValue = Math.max(this.min, this._currentValue - ((d / 20) * (this.max - this.min)));
    }
    if (newValue !== this._currentValue) {
      this.setCurrentValue(newValue, true);
      this.updateConfirmedValue();
    }
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    switch (event.code) {
      case 'ArrowUp':
      case 'ArrowRight':
        this._increment(1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        this._decrement(1);
        break;
      case 'PageUp':
        this._increment(3);
        break;
      case 'PageDown':
        this._decrement(3);
        break;
      case 'End': {
        const newValue = this.max;
        if (newValue !== this._currentValue) {
          this.setCurrentValue(newValue, true);
          this.updateConfirmedValue();
        }
        break;
      }
      case 'Home': {
        const newValue = this.min;
        if (newValue !== this._currentValue) {
          this.setCurrentValue(newValue, true);
          this.updateConfirmedValue();
        }
        break;
      }
    }
  };

  focus(): void {
    this._input?.focus();
  }

  blur(): void {
    this._input?.blur();
  }

  protected _sizedNode(): HTMLElement | null {
    return this._outerContainer || null;
  }

  protected _canvasSize(): Point {
    if (this._outerContainer) {
      const { width, height } = this._outerContainer.getBoundingClientRect();
      return [width, height];
    }
    return this._lastSize;
  }

  protected draw(svg: SVGSVGElement, size: Point): void {
    const [width, height] = size;
    const randomizer = this._randomizer();

    const baseTrackRect = rectangle([12, (height / 2) - 2], width - 24, 4, randomizer, this.renderStyle);
    this._renderPath(svg, baseTrackRect).setAttribute('id', 'sliderBaseTrack');

    if (this._pct > 0) {
      const activeTrackRect = rectangle([12, (height / 2) - 3], (width - 24) * (this._pct / 100), 6, randomizer, this.renderStyle);
      const fillShape = fillSvgPath(svg, mergedShape(activeTrackRect));
      fillShape.setAttribute('id', 'sliderActiveTrack');
      fillShape.setAttribute('filter', 'url(#wiredTexture)');
    }

    const knob = createGroup(svg, 'sliderKnob');
    fillSvgPath(knob, ellipse([12 + ((width - 24) * (this._pct / 100)), height / 2], 18, 18, randomizer, 'classic').shape);
    this._renderPath(knob, ellipse([12 + ((width - 24) * (this._pct / 100)), height / 2], 18, 18, randomizer, this.renderStyle));
  }
}
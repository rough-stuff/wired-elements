var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property, state, query } from './core/base-element.js';
import { mergedShape } from './core/graphics.js';
import { fillSvgPath, createGroup } from './core/svg-render.js';
import { PointerTracker } from './core/pointers.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { rectangle, ellipse } from './core/renderer.js';
let WiredSlider = class WiredSlider extends WiredBase {
    constructor() {
        super(...arguments);
        this.min = 0;
        this.max = 100;
        this.step = 0;
        this.disabled = false;
        this.markers = false;
        this._pct = 0;
        this._tracking = false;
        this._focussed = false;
        this._marks = [];
        this._currentValue = 0;
        this._value = 0;
        this.handleKeydown = (event) => {
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
    }
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
        this.setCurrentValue(v, false);
    }
    setCurrentValue(value, fire, force = false) {
        if (force || (value !== this._currentValue)) {
            this._currentValue = value;
            this._pct = (this.max === this.min) ? 0 : ((value - this.min) / (this.max - this.min)) * 100;
            this._pct = Math.max(0, Math.min(100, this._pct));
            if (fire) {
                this._fire('input');
            }
        }
    }
    _forceRenderOnChange(changed) {
        return (changed.has('_pct'));
    }
    render() {
        const cc = {
            tracking: this._tracking,
            focussed: this._focussed
        };
        const pct = `${this._pct}%`;
        const thumbStyles = {
            left: pct,
            bottom: null
        };
        return html `
    <div id="outerContainer">
      <div id="container" class="${classMap(cc)}">
        ${this._marks.map((n) => html `<div class="marker" style="left: ${n}%;"></div>`)}
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
            @input=${(e) => e.stopPropagation()}
            @change=${(e) => e.stopPropagation()}>
        </div>
        ${this.step ? html `
          <div id="valueLabel" style=${styleMap(thumbStyles)}>${this._currentValue}</div>
        ` : null}
      </div>
      <div id="overlay">
        <svg></svg>
      </div>
    </div>
    `;
    }
    firstUpdated() {
        new PointerTracker(this._container, this);
        const newValue = Math.max(this.min, Math.min(this.max, this._currentValue));
        if (newValue !== this.value) {
            this.value = newValue;
            this.requestUpdate();
        }
    }
    updated(changed) {
        if (changed.has('min') || changed.has('max')) {
            this.setCurrentValue(this._currentValue, false, true);
        }
        if (changed.has('min') || changed.has('max') || changed.has('step') || changed.has('markers')) {
            this.recomputeMarkers();
        }
        super.updated(changed);
    }
    onInputFocus() {
        this._focussed = true;
        this.addEventListener('keydown', this.handleKeydown);
    }
    onInputBlur() {
        this._focussed = false;
        this.removeEventListener('keydown', this.handleKeydown);
    }
    recomputeMarkers() {
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
    setValueFromPointer(pointer) {
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
    onTrackStart(pointer, event) {
        if (this._tracking) {
            return false;
        }
        event.preventDefault();
        this._tracking = true;
        this._input.focus();
        this.setValueFromPointer(pointer);
        return true;
    }
    onTrackMove(changedPointers) {
        if (this._tracking) {
            this.setValueFromPointer(changedPointers[0]);
        }
    }
    onTrackEnd() {
        if (this._tracking) {
            this._tracking = false;
            this.updateConfirmedValue();
        }
    }
    updateConfirmedValue() {
        if (this._value !== this._currentValue) {
            this.value = this._currentValue;
            this._fire('change');
        }
    }
    _increment(d) {
        let newValue = this._currentValue;
        if (this.step) {
            const n = Math.floor((this._currentValue - this.min) / this.step) + d;
            newValue = Math.min(this.max, (n * this.step) + this.min);
        }
        else {
            newValue = Math.min(this.max, this._currentValue + ((d / 20) * (this.max - this.min)));
        }
        if (newValue !== this._currentValue) {
            this.setCurrentValue(newValue, true);
            this.updateConfirmedValue();
        }
    }
    _decrement(d) {
        let newValue = this._currentValue;
        if (this.step) {
            const n = Math.ceil((this._currentValue - this.min) / this.step) - d;
            newValue = Math.max(this.min, (n * this.step) + this.min);
        }
        else {
            newValue = Math.max(this.min, this._currentValue - ((d / 20) * (this.max - this.min)));
        }
        if (newValue !== this._currentValue) {
            this.setCurrentValue(newValue, true);
            this.updateConfirmedValue();
        }
    }
    focus() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.focus();
    }
    blur() {
        var _a;
        (_a = this._input) === null || _a === void 0 ? void 0 : _a.blur();
    }
    _sizedNode() {
        return this._outerContainer || null;
    }
    _canvasSize() {
        if (this._outerContainer) {
            const { width, height } = this._outerContainer.getBoundingClientRect();
            return [width, height];
        }
        return this._lastSize;
    }
    draw(svg, size) {
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
};
WiredSlider.styles = [
    WiredBase.styles,
    css `
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
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredSlider.prototype, "min", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredSlider.prototype, "max", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredSlider.prototype, "step", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredSlider.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredSlider.prototype, "markers", void 0);
__decorate([
    query('#container'),
    __metadata("design:type", HTMLDivElement)
], WiredSlider.prototype, "_container", void 0);
__decorate([
    query('#outerContainer'),
    __metadata("design:type", HTMLDivElement)
], WiredSlider.prototype, "_outerContainer", void 0);
__decorate([
    query('input'),
    __metadata("design:type", HTMLInputElement)
], WiredSlider.prototype, "_input", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSlider.prototype, "_pct", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSlider.prototype, "_tracking", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredSlider.prototype, "_focussed", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], WiredSlider.prototype, "_marks", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], WiredSlider.prototype, "value", null);
WiredSlider = __decorate([
    ce('wired-slider')
], WiredSlider);
export { WiredSlider };

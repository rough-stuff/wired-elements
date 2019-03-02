import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { line, svgNode, ellipse } from 'wired-lib';
import { addListener } from '@polymer/polymer/lib/utils/gestures.js';

@customElement('wired-slider')
export class WiredSlider extends LitElement {
  @property({ type: Number }) _value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) knobradius = 10;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private step = 1;
  private barWidth = 0;
  private bar?: SVGElement;
  private knobGroup?: SVGElement;
  private knob?: SVGElement;
  private intermediateValue = this.min;
  private pct = 0;
  private startx = 0;
  private dragging = false;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      width: 300px;
      height: 40px;
      outline: none;
      box-sizing: border-box;
    }
  
    :host(.wired-disabled) {
      opacity: 0.45 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.07);
      border-radius: 5px;
    }
  
    :host(.wired-disabled) .knob {
      pointer-events: none !important;
    }
  
    :host(:focus) .knob {
      cursor: move;
      stroke: var(--wired-slider-knob-outline-color, #000);
      fill-opacity: 0.8;
    }
  
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke-width: 0.7;
      fill: transparent;
    }
  
    .knob {
      pointer-events: auto;
      fill: var(--wired-slider-knob-zero-color, gray);
      stroke: var(--wired-slider-knob-zero-color, gray);
      transition: transform 0.15s ease;
      cursor: pointer;
    }
  
    .hasValue {
      fill: var(--wired-slider-knob-color, rgb(51, 103, 214));
      stroke: var(--wired-slider-knob-color, rgb(51, 103, 214));
    }
  
    .bar {
      stroke: var(--wired-slider-bar-color, rgb(0, 0, 0));
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  createRenderRoot() {
    const root = super.createRenderRoot();
    this.classList.add('wired-pending');
    return root;
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this.setValue(v, true);
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  firstUpdated() {
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    const radius = this.knobradius || 10;
    this.barWidth = s.width - (2 * radius);
    this.bar = line(svg, radius, s.height / 2, s.width - radius, s.height / 2);
    this.bar.classList.add('bar');
    this.knobGroup = svgNode('g');
    svg.appendChild(this.knobGroup);
    this.knob = ellipse(this.knobGroup, radius, s.height / 2, radius * 2, radius * 2);
    this.knob.classList.add('knob');
    this.onValueChange();
    this.classList.remove('wired-pending');

    // aria
    this.setAttribute('role', 'slider');
    this.setAttribute('aria-valuemax', `${this.max}`);
    this.setAttribute('aria-valuemin', `${this.min}`);
    this.setAriaValue();

    // attach events
    addListener(this.knob, 'down', (event) => {
      if (!this.disabled) {
        this.knobdown(event);
      }
    });
    addListener(this.knob, 'up', () => {
      if (!this.disabled) {
        this.resetKnob();
      }
    });
    addListener(this.knob, 'track', (event) => {
      if (!this.disabled) {
        this.onTrack(event);
      }
    });
    this.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 38:
        case 39:
          this.incremenent();
          break;
        case 37:
        case 40:
          this.decrement();
          break;
        case 36:
          this.setValue(this.min);
          break;
        case 35:
          this.setValue(this.max);
          break;
      }
    });
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
  }

  private setAriaValue() {
    this.setAttribute('aria-valuenow', `${this.value}`);
  }

  private setValue(v: number, skipEvent: boolean = false) {
    this._value = v;
    this.setAriaValue();
    this.onValueChange();
    if (!skipEvent) {
      const event = new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.intermediateValue } });
      this.dispatchEvent(event);
    }
  }

  private incremenent() {
    const newValue = Math.min(this.max, Math.round(this.value + this.step));
    if (newValue !== this.value) {
      this.setValue(newValue);
    }
  }

  private decrement() {
    const newValue = Math.max(this.min, Math.round(this.value - this.step));
    if (newValue !== this.value) {
      this.setValue(newValue);
    }
  }

  private onValueChange() {
    if (!this.knob) {
      return;
    }
    let pct = 0;
    if (this.max > this.min) {
      pct = Math.min(1, Math.max((this.value - this.min) / (this.max - this.min), 0));
    }
    this.pct = pct;
    if (pct) {
      this.knob.classList.add('hasValue');
    } else {
      this.knob.classList.remove('hasValue');
    }
    const knobOffset = pct * this.barWidth;
    this.knobGroup!.style.transform = `translateX(${Math.round(knobOffset)}px)`;
  }

  private knobdown(event: Event) {
    this.knobExpand(true);
    event.preventDefault();
    this.focus();
  }

  private resetKnob() {
    this.knobExpand(false);
  }

  private knobExpand(value: boolean) {
    if (this.knob) {
      if (value) {
        this.knob.classList.add('expanded');
      } else {
        this.knob.classList.remove('expanded');
      }
    }
  }

  private onTrack(event: Event) {
    event.stopPropagation();
    switch ((event as CustomEvent).detail.state) {
      case 'start':
        this.trackStart();
        break;
      case 'track':
        this.trackX(event);
        break;
      case 'end':
        this.trackEnd();
        break;
    }
  }

  private trackStart() {
    this.intermediateValue = this.value;
    this.startx = this.pct * this.barWidth;
    this.dragging = true;
  }

  private trackX(event: Event) {
    if (!this.dragging) {
      this.trackStart();
    }
    const dx: number = (event as CustomEvent).detail.dx || 0;
    const newX = Math.max(Math.min(this.startx + dx, this.barWidth), 0);
    this.knobGroup!.style.transform = `translateX(${Math.round(newX)}px)`;
    const newPct = newX / this.barWidth;
    this.intermediateValue = this.min + newPct * (this.max - this.min);
  }

  private trackEnd() {
    this.dragging = false;
    this.resetKnob();
    this.setValue(this.intermediateValue);
    this.pct = (this.value - this.min) / (this.max - this.min);
  }
}
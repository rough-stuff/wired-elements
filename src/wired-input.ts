import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-input')
export class WiredInput extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) placeholder = '';
  @property({ type: String }) name?: string;
  @property({ type: String }) min?: string;
  @property({ type: String }) max?: string;
  @property({ type: String }) step?: string;
  @property({ type: String }) type = 'text';
  @property({ type: String }) autocomplete = '';
  @property({ type: String }) autocapitalize = '';
  @property({ type: String }) autocorrect = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) autofocus = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Number }) size?: number;

  @query('input') private textInput?: HTMLInputElement;
  private pendingValue?: string;
  private resizeObserver?: ResizeObserver;
  private roAttached = false;

  constructor() {
    super();
    if ((window as any).ResizeObserver) {
      this.resizeObserver = new (window as any).ResizeObserver(() => {
        if (this.svg) {
          this.wiredRender(true);
        }
      });
    }
  }

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          padding: 5px;
          font-family: sans-serif;
          width: 150px;
          outline: none;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          outline: none;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          padding: 6px;
        }
        input:focus + div path {
          stroke-width: 1.5;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <input name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" 
      @change="${this.refire}" @input="${this.refire}">
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  get input(): HTMLInputElement | undefined {
    return this.textInput;
  }

  get value(): string {
    const input = this.input;
    return (input && input.value) || '';
  }

  set value(v: string) {
    if (this.shadowRoot) {
      const input = this.input;
      if (input) {
        input.value = v;
        return;
      }
    }
    this.pendingValue = v;
  }

  firstUpdated() {
    this.value = this.pendingValue || this.value || this.getAttribute('value') || '';
    delete this.pendingValue;
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 2, 2, size[0] - 2, size[1] - 2, this.seed);
  }

  private refire(event: Event) {
    event.stopPropagation();
    this.fire(event.type, { sourceEvent: event });
  }

  focus() {
    if (this.textInput) {
      this.textInput.focus();
    } else {
      super.focus();
    }
  }

  updated() {
    super.updated();
    this.attachResizeListener();
  }

  disconnectedCallback() {
    this.detachResizeListener();
  }

  private attachResizeListener() {
    if (!this.roAttached) {
      if (this.textInput && this.resizeObserver) {
        this.resizeObserver.observe(this.textInput);
      }
      this.roAttached = true;
    }
  }

  private detachResizeListener() {
    if (this.textInput && this.resizeObserver) {
      this.resizeObserver.unobserve(this.textInput);
    }
    this.roAttached = false;
  }
}
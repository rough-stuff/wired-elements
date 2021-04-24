import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

@customElement('wired-textarea')
export class WiredTextarea extends WiredBase {
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) rows = 2;
  @property({ type: Number }) maxrows = 0;
  @property({ type: String }) autocomplete = '';
  @property({ type: Boolean }) autofocus = false;
  @property({ type: String }) inputmode = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;

  @query('textarea') private textareaInput?: HTMLTextAreaElement;
  private pendingValue?: string;

  static get styles(): CSSResultArray {
    return [
      BaseCSS,
      css`
        :host {
          display: inline-block;
          position: relative;
          font-family: sans-serif;
          width: 400px;
          outline: none;
          padding: 4px;
        }
        :host([disabled]) {
          opacity: 0.6 !important;
          cursor: default;
          pointer-events: none;
        }
        :host([disabled]) svg {
          background: rgba(0, 0, 0, 0.07);
        }
        textarea {
          position: relative;
          outline: none;
          border: none;
          resize: none;
          background: inherit;
          color: inherit;
          width: 100%;
          font-size: inherit;
          font-family: inherit;
          line-height: inherit;
          text-align: inherit;
          padding: 10px;
          box-sizing: border-box;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}"
      placeholder="${this.placeholder}" ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}"
      rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}"
      @change="${this.refire}" @input="${this.refire}"></textarea>
    <div id="overlay">
      <svg></svg>
    </div>
    `;
  }

  get textarea(): HTMLTextAreaElement | undefined {
    return this.textareaInput;
  }

  get value(): string {
    const input = this.textarea;
    return (input && input.value) || '';
  }

  set value(v: string) {
    if (this.shadowRoot) {
      const input = this.textarea;
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
    rectangle(svg, 4, 4, size[0] - 4, size[1] - 4, this.seed);
  }

  private refire(event: Event) {
    event.stopPropagation();
    this.fire(event.type, { sourceEvent: event });
  }
}
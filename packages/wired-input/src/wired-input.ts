import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { rectangle } from 'wired-lib';

@customElement('wired-input')
export class WiredInput extends LitElement {
  @property({ type: String }) placeholder = '';
  @property({ type: String }) name?: string;
  @property({ type: String }) min?: string;
  @property({ type: String }) max?: string;
  @property({ type: String }) step?: string;
  @property({ type: String }) type = 'text';
  @property({ type: String }) autocomplete = '';
  @property({ type: String }) autocapitalize = '';
  @property({ type: String }) autocorrect = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) autofocus = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property({ type: Number }) size?: number;

  private pendingValue?: string;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: sans-serif;
      width: 150px;
      outline: none;
    }
  
    :host(.wired-pending) {
      opacity: 0;
    }
  
    :host(.wired-disabled) {
      opacity: 0.6 !important;
      cursor: default;
      pointer-events: none;
    }
  
    :host(.wired-disabled) svg {
      background: rgba(0, 0, 0, 0.07);
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
      stroke: currentColor;
      stroke-width: 0.7;
      fill: transparent;
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
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <input id="txt" name="${this.name}" type="${this.type}" placeholder="${this.placeholder}" ?disabled="${this.disabled}"
      ?required="${this.required}" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" minlength="${this.minlength}"
      maxlength="${this.maxlength}" min="${this.min}" max="${this.max}" step="${this.step}" ?readonly="${this.readonly}"
      size="${this.size}" autocapitalize="${this.autocapitalize}" autocorrect="${this.autocorrect}" @change="${this.onChange}">
    <div class="overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  createRenderRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.classList.add('wired-pending');
    return root;
  }

  get input(): HTMLInputElement | null {
    if (this.shadowRoot) {
      return this.shadowRoot.getElementById('txt') as HTMLInputElement;
    }
    return null;
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
      }
    } else {
      this.pendingValue = v;
    }
  }

  firstUpdated() {
    this.value = this.value || this.getAttribute('value') || '';
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    rectangle(svg, 0, 0, s.width, s.height);
    if (typeof this.pendingValue !== 'undefined') {
      this.input!.value = this.pendingValue;
      delete this.pendingValue;
    }
    this.classList.remove('wired-pending');
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
  }

  private onChange(event: Event) {
    event.stopPropagation();
    const newEvent = new CustomEvent(event.type, { bubbles: true, composed: true, cancelable: event.cancelable, detail: { sourceEvent: event } });
    this.dispatchEvent(newEvent);
  }
}
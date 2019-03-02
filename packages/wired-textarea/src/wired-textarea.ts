import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { rectangle } from 'wired-lib';

@customElement('wired-textarea')
export class WiredTextarea extends LitElement {
  @property({ type: Number }) rows = 1;
  @property({ type: Number }) maxrows = 0;
  @property({ type: String }) autocomplete = '';
  @property({ type: Boolean }) autofocus = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) inputmode = '';
  @property({ type: String }) placeholder = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;

  private tokens: string[] = [];
  private prevHeight = 0;

  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      padding: 5px;
      font-family: sans-serif;
      width: 400px;
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
  
    .fit {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  
    .overlay {
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
  
    .mirror-text {
      visibility: hidden;
      word-wrap: break-word;
    }
  
    textarea {
      position: relative;
      outline: none;
      border: none;
      resize: none;
      background: inherit;
      color: inherit;
      width: 100%;
      height: 100%;
      font-size: inherit;
      font-family: inherit;
      line-height: inherit;
      text-align: inherit;
      padding: 5px;
      box-sizing: border-box;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div id="mirror" class="mirror-text">&#160;</div>
    <div class="fit">
      <textarea id="textarea" autocomplete="${this.autocomplete}" ?autofocus="${this.autofocus}" inputmode="${this.inputmode}"
        placeholder="${this.placeholder}" ?readonly="${this.readonly}" ?required="${this.required}" ?disabled="${this.disabled}"
        rows="${this.rows}" minlength="${this.minlength}" maxlength="${this.maxlength}" @input="${this.onInput}"></textarea>
    </div>
    <div class="fit overlay">
      <svg id="svg"></svg>
    </div>
    `;
  }

  createRenderRoot() {
    const root = this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.classList.add('wired-pending');
    return root;
  }

  get textarea(): HTMLTextAreaElement | null {
    if (this.shadowRoot) {
      return this.shadowRoot.getElementById('textarea') as HTMLTextAreaElement;
    }
    return null;
  }

  private get mirror(): HTMLDivElement {
    return this.shadowRoot!.getElementById('mirror') as HTMLDivElement;
  }

  get value(): string {
    const input = this.textarea;
    return (input && input.value) || '';
  }

  set value(v: string) {
    const textarea = this.textarea;
    if (!textarea) {
      return;
    }
    if (textarea.value !== v) {
      textarea.value = v || '';
    }
    this.mirror.innerHTML = this.valueForMirror();
    this.requestUpdate();
  }

  private valueForMirror(): string {
    const input = this.textarea;
    if (!input) {
      return '';
    }
    this.tokens = (input && input.value) ? input.value.replace(/&/gm, '&amp;').replace(/"/gm, '&quot;').replace(/'/gm, '&#39;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;').split('\n') : [''];
    return this.constrain(this.tokens);
  }

  private constrain(tokens: string[]) {
    let _tokens: string[];
    tokens = tokens || [''];
    if (this.maxrows > 0 && tokens.length > this.maxrows) {
      _tokens = tokens.slice(0, this.maxrows);
    } else {
      _tokens = tokens.slice(0);
    }
    while (this.rows > 0 && _tokens.length < this.rows) {
      _tokens.push('');
    }
    return _tokens.join('<br/>') + '&#160;';
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
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
    const s = this.getBoundingClientRect();

    if (this.prevHeight !== s.height) {
      while (svg.hasChildNodes()) {
        svg.removeChild(svg.lastChild!);
      }
      svg.setAttribute('width', `${s.width}`);
      svg.setAttribute('height', `${s.height}`);
      rectangle(svg, 2, 2, s.width - 2, s.height - 2);
      this.prevHeight = s.height;
      this.classList.remove('wired-pending');
      this.updateCached();
    }
  }

  private updateCached() {
    this.mirror.innerHTML = this.constrain(this.tokens);
  }

  private onInput() {
    this.value = this.textarea!.value;
  }
}
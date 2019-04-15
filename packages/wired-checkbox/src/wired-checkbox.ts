import { WiredBase, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'wired-lib/lib/wired-base';
import { rectangle, line } from 'wired-lib';

@customElement('wired-checkbox')
export class WiredCheckbox extends WiredBase {
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      font-family: inherit;
      outline: none;
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

    :host(.wired-rendered) {
      opacity: 1;
    }
  
    :host(:focus) path {
      stroke-width: 1.5;
    }
  
    #container {
      display: inline-block;
      white-space: nowrap;
    }
  
    .inline {
      display: inline-block;
      vertical-align: middle;
      -moz-user-select: none;
      user-select: none;
    }
  
    #checkPanel {
      cursor: pointer;
    }
  
    svg {
      display: block;
    }
  
    path {
      stroke: var(--wired-checkbox-icon-color, currentColor);
      stroke-width: 0.7;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div id="container" @click="${this.toggleCheck}">
      <div id="checkPanel" class="inline">
        <svg id="svg" width="0" height="0"></svg>
      </div>
      <div class="inline">
        <slot></slot>
      </div>
    </div>
    `;
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  private toggleCheck() {
    this.checked = !(this.checked || false);
    this.fireEvent('change', { checked: this.checked });
  }

  firstUpdated() {
    this.setAttribute('role', 'checkbox');
    this.addEventListener('keydown', (event) => {
      if ((event.keyCode === 13) || (event.keyCode === 32)) {
        event.preventDefault();
        this.toggleCheck();
      }
    });
  }

  updated(changed: PropertyValues) {
    if (changed.has('disabled')) {
      this.refreshDisabledState();
    }
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = { width: 24, height: 24 };
    svg.setAttribute('width', `${s.width}`);
    svg.setAttribute('height', `${s.height}`);
    rectangle(svg, 0, 0, s.width, s.height);
    const checkpaths = [];
    checkpaths.push(line(svg, s.width * 0.3, s.height * 0.4, s.width * 0.5, s.height * 0.7));
    checkpaths.push(line(svg, s.width * 0.5, s.height * 0.7, s.width + 5, -5));
    checkpaths.forEach((d) => {
      d.style.strokeWidth = `${2.5}`;
    });
    if (this.checked) {
      checkpaths.forEach((d) => {
        d.style.display = '';
      });
    } else {
      checkpaths.forEach((d) => {
        d.style.display = 'none';
      });
    }
    this.classList.add('wired-rendered');
  }
}
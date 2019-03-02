import { LitElement, customElement, property, TemplateResult, html, css, CSSResult, PropertyValues } from 'lit-element';
import { polygon, Point } from 'wired-lib';

export type WiredTooltipPosition = 'bottom' | 'top' | 'left' | 'right';

@customElement('wired-tooltip')
export class WiredTooltip extends LitElement {
  @property({ type: String }) for?: string;
  @property({ type: String }) text?: string;
  @property({ type: Number }) offset = 14;
  @property({ type: String }) position: WiredTooltipPosition = 'bottom';

  private dirty = false;
  private showing = false;
  private _target: HTMLElement | null = null;
  private showHandler = this.show.bind(this);
  private hideHandler = this.hide.bind(this);

  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      position: absolute;
      outline: none;
      z-index: 1002;
      -moz-user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: default;
      font-family: inherit;
      font-size: 9pt;
      line-height: 1;
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
      stroke: var(--wired-tooltip-border-color, currentColor);
      fill: var(--wired-tooltip-background, rgba(255, 255, 255, 0.9));
    }
  
    #container {
      position: relative;
      padding: 8px;
    }
    `;
  }

  render(): TemplateResult {
    return html`
    <div id="container" style="display: none;">
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
      <span style="position: relative;">${this.text}</span>
    </div>
    `;
  }

  private get target(): HTMLElement | null {
    if (this._target) {
      return this._target;
    }
    const parent = this.parentNode;
    const owner = ((this.getRootNode ? this.getRootNode() : null) || document) as HTMLElement;
    let t: HTMLElement | null = null;
    if (this.for) {
      t = owner.querySelector('#' + this.for);
    } else if (parent) {
      t = parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? (owner as any).host : parent;
    }
    return t;
  }

  private detachListeners() {
    if (this._target) {
      this._target.removeEventListener('mouseenter', this.showHandler);
      this._target.removeEventListener('focus', this.showHandler);
      this._target.removeEventListener('mouseleave', this.hideHandler);
      this._target.removeEventListener('blur', this.hideHandler);
      this._target.removeEventListener('click', this.hideHandler);
    }
    this.removeEventListener('mouseenter', this.hideHandler);
  }

  private attachListeners() {
    if (this._target) {
      this._target.addEventListener('mouseenter', this.showHandler);
      this._target.addEventListener('focus', this.showHandler);
      this._target.addEventListener('mouseleave', this.hideHandler);
      this._target.addEventListener('blur', this.hideHandler);
      this._target.addEventListener('click', this.hideHandler);
    }
    this.addEventListener('mouseenter', this.hideHandler);
  }

  private refreshTarget() {
    this.detachListeners();
    this._target = null;
    this._target = this.target;
    this.attachListeners();
    this.dirty = true;
  }

  private layout() {
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s = this.getBoundingClientRect();
    let w = s.width;
    let h = s.height;
    switch (this.position) {
      case 'left':
      case 'right':
        w = w + this.offset;
        break;
      default:
        h = h + this.offset;
        break;
    }
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);
    let points: Point[] = [];
    switch (this.position) {
      case 'top':
        points = [
          [2, 2], [w - 2, 2], [w - 2, h - this.offset],
          [w / 2 + 8, h - this.offset], [w / 2, h - this.offset + 8], [w / 2 - 8, h - this.offset],
          [0, h - this.offset]
        ];
        break;
      case 'left':
        points = [
          [2, 2], [w - this.offset, 2],
          [w - this.offset, h / 2 - 8], [w - this.offset + 8, h / 2], [w - this.offset, h / 2 + 8],
          [w - this.offset, h], [2, h - 2]
        ];
        break;
      case 'right':
        points = [
          [this.offset, 2], [w - 2, 2], [w - 2, h - 2], [this.offset, h - 2],
          [this.offset, h / 2 + 8], [this.offset - 8, h / 2], [this.offset, h / 2 - 8]
        ];
        svg.style.transform = `translateX(${-this.offset}px)`;
        break;
      default:
        points = [
          [2, this.offset], [0, h - 2], [w - 2, h - 2], [w - 2, this.offset],
          [w / 2 + 8, this.offset], [w / 2, this.offset - 8], [w / 2 - 8, this.offset]
        ];
        svg.style.transform = `translateY(${-this.offset}px)`;
        break;
    }
    polygon(svg, points);
    this.dirty = false;
  }

  firstUpdated() {
    this.layout();
  }

  updated(changedProps: PropertyValues) {
    if (changedProps.has('position') || changedProps.has('text')) {
      this.dirty = true;
    }
    if ((!this._target) || changedProps.has('for')) {
      this.refreshTarget();
    }
    if (this.dirty) {
      this.layout();
    }
  }

  show() {
    if (this.showing) {
      return;
    }
    this.showing = true;
    this.shadowRoot!.getElementById('container')!.style.display = '';
    this.updatePosition();
    setTimeout(() => {
      this.layout();
    }, 1);
  }

  hide() {
    if (!this.showing) {
      return;
    }
    this.showing = false;
    this.shadowRoot!.getElementById('container')!.style.display = 'none';
  }

  updatePosition() {
    if (!this._target || !this.offsetParent) {
      return;
    }
    const offset = this.offset;
    const parentRect = this.offsetParent.getBoundingClientRect();
    const targetRect = this._target.getBoundingClientRect();
    const tipRect = this.getBoundingClientRect();
    const horizontalCenterOffset = (targetRect.width - tipRect.width) / 2;
    const verticalCenterOffset = (targetRect.height - tipRect.height) / 2;
    const targetLeft = targetRect.left - parentRect.left;
    const targetTop = targetRect.top - parentRect.top;

    let tooltipLeft, tooltipTop;
    switch (this.position) {
      case 'top':
        tooltipLeft = targetLeft + horizontalCenterOffset;
        tooltipTop = targetTop - tipRect.height - offset;
        break;
      case 'bottom':
        tooltipLeft = targetLeft + horizontalCenterOffset;
        tooltipTop = targetTop + targetRect.height + offset;
        break;
      case 'left':
        tooltipLeft = targetLeft - tipRect.width - offset;
        tooltipTop = targetTop + verticalCenterOffset;
        break;
      case 'right':
        tooltipLeft = targetLeft + targetRect.width + offset;
        tooltipTop = targetTop + verticalCenterOffset;
        break;
    }

    this.style.left = tooltipLeft + 'px';
    this.style.top = tooltipTop + 'px';
  }
}
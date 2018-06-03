import { LitElement, html } from '@polymer/lit-element/lit-element.js';
import { wired } from 'wired-lib/wired-lib.js';

export class WiredTooltip extends LitElement {
  static get properties() {
    return {
      for: String,
      position: String,
      text: String,
      offset: Number
    };
  }

  constructor() {
    super();
    this._dirty = false;
    this._showing = false;
    this._target = null;
    this.offset = 14;
    this.position = 'bottom';
  }

  _render({ text }, changedProps) {
    if (changedProps && (changedProps.position || changedProps.text)) {
      this._dirty = true;
    }
    if ((!this._target) || (changedProps && changedProps.for)) {
      this._refreshTarget();
    }
    return html`
    <style>
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
    </style>
    <div id="container" style="display: none;">
      <div class="overlay">
        <svg id="svg"></svg>
      </div>
      <span style="position: relative;">${text}</span>
    </div>
    `;
  }

  get target() {
    if (this._target) {
      return this._target;
    }
    var parent = this.parentNode;
    var owner = (this.getRootNode ? this.getRootNode() : null) || this.getOwnerDocument();
    var t;
    if (this.for) {
      t = owner.querySelector('#' + this.for);
    } else {
      t = parent.nodeType == Node.DOCUMENT_FRAGMENT_NODE ? owner.host : parent;
    }
    return t;
  }

  _detachListeners() {
    if (this._showHandler && this._hideHandler) {
      if (this._target) {
        this._target.removeEventListener('mouseenter', this._showHandler);
        this._target.removeEventListener('focus', this._showHandler);
        this._target.removeEventListener('mouseleave', this._hideHandler);
        this._target.removeEventListener('blur', this._hideHandler);
        this._target.removeEventListener('click', this._hideHandler);
      }
      this.removeEventListener('mouseenter', this._hideHandler);
    }
  }

  _attachListeners() {
    this._showHandler = () => {
      this.show()
    };
    this._hideHandler = () => {
      this.hide()
    };
    if (this._target) {
      this._target.addEventListener('mouseenter', this._showHandler);
      this._target.addEventListener('focus', this._showHandler);
      this._target.addEventListener('mouseleave', this._hideHandler);
      this._target.addEventListener('blur', this._hideHandler);
      this._target.addEventListener('click', this._hideHandler);
    }
    this.addEventListener('mouseenter', this._hideHandler);
  }

  _refreshTarget() {
    this._detachListeners();
    this._target = null;
    this._target = this.target;
    this._attachListeners();
    this._dirty = true;
  }

  _clearNode(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  _layout() {
    const svg = this.shadowRoot.getElementById('svg');
    this._clearNode(svg);
    var s = this.getBoundingClientRect();
    var w = s.width;
    var h = s.height;
    switch (this.position) {
      case "left":
      case "right":
        w = w + this.offset;
        break;
      default:
        h = h + this.offset;
        break;
    }
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    var points = [];
    switch (this.position) {
      case "top":
        points = [
          [2, 2], [w - 2, 2], [w - 2, h - this.offset],
          [w / 2 + 8, h - this.offset], [w / 2, h - this.offset + 8], [w / 2 - 8, h - this.offset],
          [0, h - this.offset]
        ];
        break;
      case "left":
        points = [
          [2, 2], [w - this.offset, 2],
          [w - this.offset, h / 2 - 8], [w - this.offset + 8, h / 2], [w - this.offset, h / 2 + 8],
          [w - this.offset, h], [2, h - 2]
        ];
        break;
      case "right":
        points = [
          [this.offset, 2], [w - 2, 2], [w - 2, h - 2], [this.offset, h - 2],
          [this.offset, h / 2 + 8], [this.offset - 8, h / 2], [this.offset, h / 2 - 8]
        ];
        svg.style.transform = "translateX(" + (-this.offset) + "px)";
        break;
      default:
        points = [
          [2, this.offset], [0, h - 2], [w - 2, h - 2], [w - 2, this.offset],
          [w / 2 + 8, this.offset], [w / 2, this.offset - 8], [w / 2 - 8, this.offset]
        ];
        svg.style.transform = "translateY(" + (-this.offset) + "px)";
        break;
    }
    wired.polygon(svg, points);
    this._dirty = false;
  }

  _firstRendered() {
    this._layout();
  }

  _didRender() {
    if (this._dirty) {
      this._layout();
    }
  }

  show() {
    if (this._showing) {
      return;
    }
    this._showing = true;
    this.shadowRoot.getElementById('container').style.display = "";
    this.updatePosition();
    setTimeout(() => {
      this._layout();
    }, 1);
  }

  hide() {
    if (!this._showing) {
      return;
    }
    this._showing = false;
    this.shadowRoot.getElementById('container').style.display = "none";
  }

  updatePosition() {
    if (!this._target || !this.offsetParent) {
      return;
    }
    var offset = this.offset;
    var parentRect = this.offsetParent.getBoundingClientRect();
    var targetRect = this._target.getBoundingClientRect();
    var tipRect = this.getBoundingClientRect();
    var horizontalCenterOffset = (targetRect.width - tipRect.width) / 2;
    var verticalCenterOffset = (targetRect.height - tipRect.height) / 2;
    var targetLeft = targetRect.left - parentRect.left;
    var targetTop = targetRect.top - parentRect.top;

    var tooltipLeft, tooltipTop;
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
customElements.define('wired-tooltip', WiredTooltip);
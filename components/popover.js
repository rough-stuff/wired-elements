var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property, query, state } from './core/base-element.js';
import { styleMap } from 'lit/directives/style-map.js';
import './card.js';
let WiredPopover = class WiredPopover extends WiredBase {
    constructor() {
        super(...arguments);
        this.elevation = 1;
        this.pin = 'top-start';
        this.direction = 'down';
        this.manualClose = false;
        this.x = 0;
        this.y = 0;
        this._open = false;
        this._closeListener = () => {
            if (this._open) {
                this.open = false;
            }
        };
    }
    render() {
        const surfaceClasses = [this.direction, ...this.pin.split('-')];
        if (this._open) {
            surfaceClasses.push('open');
        }
        let centerTransform = '';
        const center = surfaceClasses.indexOf('center') >= 0;
        const centered = surfaceClasses.indexOf('centered') >= 0;
        if (center && centered) {
            centerTransform = ' translate3d(-50%, -50%, 0)';
        }
        else if (center) {
            centerTransform = ' translateX(-50%)';
        }
        else if (centered) {
            centerTransform = ' translateY(-50%)';
        }
        // offset
        let leftStyle = null;
        let rightStyle = null;
        let topStyle = null;
        let bottomStyle = null;
        if (this.anchor) {
            switch (this.pin) {
                case 'top-start':
                    leftStyle = `${this.anchor.offsetLeft}px`;
                    topStyle = `${this.anchor.offsetTop}px`;
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translateY(-100%)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            break;
                    }
                    break;
                case 'top-end':
                    topStyle = `${this.anchor.offsetTop}px`;
                    rightStyle = 'initial';
                    leftStyle = `${this.anchor.offsetLeft + this.anchor.offsetWidth}px`;
                    centerTransform = ' translateX(-100%)';
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translate3d(-100%, -100%, 0)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            centerTransform = ' translate3d(-100%, -50%, 0)';
                            break;
                    }
                    break;
                case 'top-afterend':
                    topStyle = `${this.anchor.offsetTop}px`;
                    leftStyle = `${this.anchor.offsetLeft + this.anchor.offsetWidth}px`;
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translateY(-100%)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            break;
                    }
                    break;
                case 'top-beforestart':
                    topStyle = `${this.anchor.offsetTop}px`;
                    rightStyle = 'initial';
                    leftStyle = `${this.anchor.offsetLeft}px`;
                    centerTransform = ' translateX(-100%)';
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translate3d(-100%, -100%, 0)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            centerTransform = ' translate3d(-100%, -50%, 0)';
                            break;
                    }
                    break;
                case 'top-center':
                    topStyle = `${this.anchor.offsetTop}px`;
                    rightStyle = 'initial';
                    leftStyle = `${this.anchor.offsetLeft + (this.anchor.offsetWidth / 2)}px`;
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translate3d(-50%, -100%, 0)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            break;
                    }
                    break;
                case 'bottom-start':
                    leftStyle = `${this.anchor.offsetLeft}px`;
                    topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight}px`;
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translateY(-100%)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            break;
                    }
                    break;
                case 'bottom-end':
                    topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight}px`;
                    rightStyle = 'initial';
                    leftStyle = `${this.anchor.offsetLeft + this.anchor.offsetWidth}px`;
                    centerTransform = ' translateX(-100%)';
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translate3d(-100%, -100%, 0)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            centerTransform = ' translate3d(-100%, -50%, 0)';
                            break;
                    }
                    break;
                case 'bottom-beforestart':
                    topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight}px`;
                    rightStyle = 'initial';
                    leftStyle = `${this.anchor.offsetLeft}px`;
                    centerTransform = ' translateX(-100%)';
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translate3d(-100%, -100%, 0)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            centerTransform = ' translate3d(-100%, -50%, 0)';
                            break;
                    }
                    break;
                case 'bottom-afterend':
                    topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight}px`;
                    leftStyle = `${this.anchor.offsetLeft + this.anchor.offsetWidth}px`;
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = ' translateY(-100%)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            break;
                    }
                    break;
                case 'bottom-center':
                    topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight}px`;
                    rightStyle = 'initial';
                    leftStyle = `${this.anchor.offsetLeft + (this.anchor.offsetWidth / 2)}px`;
                    switch (this.direction) {
                        case 'up':
                            bottomStyle = 'initial';
                            centerTransform = '  translate3d(-50%, -100%, 0)';
                            break;
                        case 'centered':
                            topStyle = `${this.anchor.offsetTop + this.anchor.offsetHeight / 2}px`;
                            break;
                    }
                    break;
            }
        }
        const surfaceStyles = {
            '--wired-popver-surface-translate': `translate3d(${this.x}px, ${this.y}px, 0)${centerTransform}`,
            left: leftStyle,
            top: topStyle,
            right: rightStyle,
            bottom: bottomStyle,
            '--wired-popover-content-max-height': this.maxHeight ? `${this.maxHeight}px` : null
        };
        return html `
    <wired-card elevation="1" id="surface" class="${surfaceClasses.join(' ')}" style="${styleMap(surfaceStyles)}">
      <div id="container" class="${this.maxHeight ? 'maxxed' : ''}" @click="${this._containerClick}">
          <slot></slot>
        </div>
    </wired-card>`;
    }
    get open() {
        return this._open;
    }
    set open(value) {
        if (this._open !== value) {
            if (this._surface) {
                if (value) {
                    this._surface.style.display = 'block';
                    this._surface.getBoundingClientRect();
                }
                else {
                    this._surface.style.display = '';
                }
            }
            this._open = value;
            if (value) {
                setTimeout(() => {
                    if (this._open) {
                        this._attachCloseListenr();
                    }
                });
            }
            else {
                this._detachCloseListenr();
            }
            if (value) {
                this._fire('popover-open');
            }
            else {
                this._fire('popover-close');
            }
        }
    }
    _containerClick(event) {
        event.stopPropagation();
    }
    _attachCloseListenr() {
        if (!this.manualClose) {
            document.addEventListener('click', this._closeListener);
        }
    }
    _detachCloseListenr() {
        document.removeEventListener('click', this._closeListener);
    }
    _sizedNode() {
        return null;
    }
    _canvasSize() {
        return [0, 0];
    }
    draw() {
        // do nothing
    }
};
WiredPopover.styles = [
    WiredBase.styles,
    css `
    :host {
      opacity: 1;
    }
    #surface {
      position: absolute;
      transform: var(--wired-popver-surface-translate, translate3d(0,0,0)) scale(1);
      opacity: 0;
      pointer-events: none;
      display: none;
      z-index: var(--wired-popover-z-index, 8);
      background: var(--wired-surface, #fff);
      color: var(--wired-on-surface, #000);
      box-shadow: var(--wired-popover-shadow, 0 3px 3px -2px rgb(0 0 0 / 20%), 0 3px 4px 0 rgb(0 0 0 / 14%), 0 1px 8px 0 rgb(0 0 0 / 12%));
      min-width: var(--wired-surface-min-width);
    }
    #container {
      position: relative;
      overflow: var(--wired-popover-overflow, hidden);
    }
    #container.maxxed {
      overflow-x: hidden;
      overflow-y: auto;
      max-height: var(--wired-popover-content-max-height);
    }
  
    #surface.top.down {
      top: 0;
    }
    #surface.top.up {
      bottom: 100%;
    }
    #surface.top.centered {
      top: 50%;
    }
    
    
    #surface.bottom.down {
      top: 100%;
    }
    #surface.bottom.up {
      bottom: 0;
    }
    #surface.bottom.centered {
      top: 50%;
    }

    #surface.start {
      left: 0;
    }
    #surface.end {
      right: 0;
    }
    #surface.center {
      left: 50%;
    }
    #surface.beforestart {
      right: 100%;
    }
    #surface.afterend {
      left: 100%;
    }

    #surface.start.down {
      transform-origin: top left;
    }
    #surface.beforestart.down {
      transform-origin: top right;
    }
    #surface.center.down {
      transform-origin: center top;
    }
    #surface.end.down {
      transform-origin: top right;
    }
    #surface.afterend.down {
      transform-origin: top left;
    }
    #surface.start.up {
      transform-origin: bottom left;
    }
    #surface.beforestart.up {
      transform-origin: bottom right;
    }
    #surface.center.up {
      transform-origin: bottom center;
    }
    #surface.end.up {
      transform-origin: bottom right;
    }
    #surface.afterend.up {
      transform-origin: bottom left;
    }
    #surface.start.centered {
      transform-origin: left center;
    }
    #surface.beforestart.centered {
      transform-origin: right center;
    }
    #surface.center.centered {
      transform-origin: center center;
    }
    #surface.end.centered {
      transform-origin: right center;
    }
    #surface.afterend.centered {
      transform-origin: left center;
    }

    #surface.open {
      transform: var(--wired-popver-surface-translate, translate3d(0,0,0)) scale(1);
      opacity: 1;
      display: block;
    }
    #surface.open #container {
      pointer-events: auto;
    }
    `
];
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredPopover.prototype, "elevation", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredPopover.prototype, "pin", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], WiredPopover.prototype, "direction", void 0);
__decorate([
    property({ type: Boolean, attribute: 'manual-close' }),
    __metadata("design:type", Object)
], WiredPopover.prototype, "manualClose", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredPopover.prototype, "x", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Object)
], WiredPopover.prototype, "y", void 0);
__decorate([
    property({ type: Number, attribute: 'max-height' }),
    __metadata("design:type", Number)
], WiredPopover.prototype, "maxHeight", void 0);
__decorate([
    state(),
    __metadata("design:type", HTMLElement)
], WiredPopover.prototype, "anchor", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], WiredPopover.prototype, "_open", void 0);
__decorate([
    query('#surface'),
    __metadata("design:type", HTMLElement)
], WiredPopover.prototype, "_surface", void 0);
WiredPopover = __decorate([
    ce('wired-popover')
], WiredPopover);
export { WiredPopover };

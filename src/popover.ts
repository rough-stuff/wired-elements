import { WiredBase, ce, html, TemplateResult, css, property, query, state, Point } from './core/base-element.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';
import './card.js';

declare global {
  interface HTMLElementTagNameMap {
    'wired-popover': WiredPopover;
  }
}

export type WiredPopoverPin = 'top-start' | 'top-end' | 'top-center' | 'top-beforestart' | 'top-afterend' | 'bottom-start' | 'bottom-end' | 'bottom-center' | 'bottom-beforestart' | 'bottom-afterend';
export type WiredPopoverDirection = 'down' | 'up' | 'centered';

@ce('wired-popover')
export class WiredPopover extends WiredBase {
  @property({ type: Number }) elevation = 1;
  @property() pin: WiredPopoverPin = 'top-start';
  @property() direction: WiredPopoverDirection = 'down';
  @property({ type: Boolean, attribute: 'manual-close' }) manualClose = false;
  @property({ type: Number }) x = 0;
  @property({ type: Number }) y = 0;
  @property({ type: Number, attribute: 'max-height' }) maxHeight?: number;

  @state() anchor?: HTMLElement;
  @state() private _open = false;

  @query('#surface') private _surface?: HTMLElement;

  static styles = [
    WiredBase.styles,
    css`
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

  render(): TemplateResult {
    const surfaceClasses: string[] = [this.direction, ...this.pin.split('-')];
    if (this._open) {
      surfaceClasses.push('open');
    }

    let centerTransform = '';
    const center = surfaceClasses.indexOf('center') >= 0;
    const centered = surfaceClasses.indexOf('centered') >= 0;
    if (center && centered) {
      centerTransform = ' translate3d(-50%, -50%, 0)';
    } else if (center) {
      centerTransform = ' translateX(-50%)';
    } else if (centered) {
      centerTransform = ' translateY(-50%)';
    }

    // offset
    let leftStyle: string | null = null;
    let rightStyle: string | null = null;
    let topStyle: string | null = null;
    let bottomStyle: string | null = null;
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

    const surfaceStyles: StyleInfo = {
      '--wired-popver-surface-translate': `translate3d(${this.x}px, ${this.y}px, 0)${centerTransform}`,
      left: leftStyle,
      top: topStyle,
      right: rightStyle,
      bottom: bottomStyle,
      '--wired-popover-content-max-height': this.maxHeight ? `${this.maxHeight}px` : null
    };

    return html`
    <wired-card elevation="1" id="surface" class="${surfaceClasses.join(' ')}" style="${styleMap(surfaceStyles)}">
      <div id="container" class="${this.maxHeight ? 'maxxed' : ''}" @click="${this._containerClick}">
          <slot></slot>
        </div>
    </wired-card>`;
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    if (this._open !== value) {
      if (this._surface) {
        if (value) {
          this._surface.style.display = 'block';
          this._surface.getBoundingClientRect();
        } else {
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
      } else {
        this._detachCloseListenr();
      }
      if (value) {
        this._fire('popover-open');
      } else {
        this._fire('popover-close');
      }
    }
  }

  private _containerClick(event: Event) {
    event.stopPropagation();
  }

  private _closeListener = () => {
    if (this._open) {
      this.open = false;
    }
  };

  private _attachCloseListenr() {
    if (!this.manualClose) {
      document.addEventListener('click', this._closeListener);
    }
  }
  private _detachCloseListenr() {
    document.removeEventListener('click', this._closeListener);
  }

  protected _sizedNode(): HTMLElement | null {
    return null;
  }

  protected _canvasSize(): Point {
    return [0, 0];
  }

  protected draw() {
    // do nothing
  }
}
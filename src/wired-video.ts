import { WiredBase, BaseCSS, Point } from './wired-base';
import { rectangle } from './wired-lib';
import { css, TemplateResult, html, CSSResultArray } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { WiredProgress } from './wired-progress.js';
import { WiredSlider } from './wired-slider';
import './wired-icon-button.js';

@customElement('wired-video')
export class WiredVideo extends WiredBase {
  @property({ type: String }) src = '';
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean }) loop = false;
  @property({ type: Boolean }) muted = false;
  @property({ type: Boolean }) playsinline = false;
  @property() private playing = false;
  @property() private timeDisplay = '';

  @query('wired-progress') private progressBar?: WiredProgress;
  @query('wired-slider') private slider?: WiredSlider;
  @query('video') private video?: HTMLVideoElement;

  private resizeObserver?: ResizeObserver;
  private windowResizeHandler?: EventListenerOrEventListenerObject;

  constructor() {
    super();
    if ((window as any).ResizeObserver) {
      this.resizeObserver = new (window as any).ResizeObserver(() => {
        if (this.svg) {
          this.wiredRender();
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
          line-height: 1;
          padding: 3px 3px 68px;
          --wired-progress-color: var(--wired-video-highlight-color, rgb(51, 103, 214));
          --wired-slider-knob-color: var(--wired-video-highlight-color, rgb(51, 103, 214));
        }
        video {
          display: block;
          box-sizing: border-box;
          max-width: 100%;
          max-height: 100%;
        }
        path {
          stroke-width: 1;
        }
        #controls {
          position: absolute;
          pointer-events: auto;
          left: 0;
          bottom: 0;
          width: 100%;
          box-sizing: border-box;
          height: 70px;
        }
        .layout.horizontal {
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          -ms-flex-align: center;
          -webkit-align-items: center;
          align-items: center;
          padding: 5px 10px;
        }
        .flex {
          -ms-flex: 1 1 0.000000001px;
          -webkit-flex: 1;
          flex: 1;
          -webkit-flex-basis: 0.000000001px;
          flex-basis: 0.000000001px;
        }
        wired-progress {
          display: block;
          width: 100%;
          box-sizing: border-box;
          height: 20px;
          --wired-progress-label-color: transparent;
          --wired-progress-label-background: transparent;
        }
        wired-icon-button span {
          font-size: 16px;
          line-height: 16px;
          width: 16px;
          height: 16px;
          padding: 0px;
          font-family: sans-serif;
          display: inline-block;
        }
        #timeDisplay {
          padding: 0 20px 0 8px;
          font-size: 13px;
        }
        wired-slider {
          display: block;
          max-width: 200px;
          margin: 0 6px 0 auto;
        }
      `
    ];
  }

  render(): TemplateResult {
    return html`
    <video 
      .autoplay="${this.autoplay}"
      .loop="${this.loop}"
      .muted="${this.muted}"
      .playsinline="${this.playsinline}"
      src="${this.src}"
      @play="${() => this.playing = true}"
      @pause="${() => this.playing = false}"
      @canplay="${this.canPlay}"
      @timeupdate="${this.updateTime}">
    </video>
    <div id="overlay">
      <svg></svg>
    </div>
    <div id="controls">
      <wired-progress></wired-progress>
      <div class="horizontal layout center">
        <wired-icon-button @click="${this.togglePause}">
          <span>${this.playing ? '||' : '▶'}</span>
        </wired-icon-button>
        <div id="timeDisplay">${this.timeDisplay}</div>
        <div class="flex">
          <wired-slider @change="${this.volumeChange}"></wired-slider>
        </div>
        <div style="width: 24px; height: 24px;">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path style="stroke: none; fill: currentColor;" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></g></svg>
        </div>
      </div>
    </div>
    `;
  }

  updated() {
    super.updated();
    this.attachResizeListener();
  }

  disconnectedCallback() {
    this.detachResizeListener();
  }

  private attachResizeListener() {
    if (this.resizeObserver && this.resizeObserver.observe) {
      this.resizeObserver.observe(this);
    } else if (!this.windowResizeHandler) {
      this.windowResizeHandler = () => this.wiredRender();
      window.addEventListener('resize', this.windowResizeHandler, { passive: true });
    }
  }

  private detachResizeListener() {
    if (this.resizeObserver && this.resizeObserver.unobserve) {
      this.resizeObserver.unobserve(this);
    }
    if (this.windowResizeHandler) {
      window.removeEventListener('resize', this.windowResizeHandler);
    }
  }

  wiredRender() {
    super.wiredRender();
    if (this.progressBar) {
      this.progressBar.wiredRender(true);
    }
  }

  protected canvasSize(): Point {
    const s = this.getBoundingClientRect();
    return [s.width, s.height];
  }

  protected draw(svg: SVGSVGElement, size: Point) {
    rectangle(svg, 2, 2, size[0] - 4, size[1] - 4, this.seed);
  }

  private updateTime() {
    if (this.video && this.progressBar) {
      this.progressBar.value = this.video.duration ? Math.round((this.video.currentTime / this.video.duration) * 100) : 0;
      this.timeDisplay = `${this.getTimeDisplay(this.video.currentTime)} / ${this.getTimeDisplay(this.video.duration)}`;
    }
  }

  private getTimeDisplay(time: number) {
    const mins = Math.floor(time / 60);
    const secs = Math.round(time - (mins * 60));
    return `${mins}:${secs}`;
  }

  private togglePause() {
    if (this.video) {
      if (this.playing) {
        this.video.pause();
      } else {
        this.video.play();
      }
    }
  }

  private volumeChange() {
    if (this.video && this.slider) {
      this.video.volume = this.slider.value / 100;
    }
  }

  private canPlay() {
    if (this.slider && this.video) {
      this.slider.value = this.video!.volume * 100;
    }
  }
}
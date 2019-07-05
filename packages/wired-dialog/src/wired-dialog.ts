import {
  WiredBase,
  customElement,
  property,
  TemplateResult,
  html,
  css,
  CSSResult
} from 'wired-lib/lib/wired-base';
import 'wired-card';
import 'wired-button';

@customElement('wired-dialog')
export class WiredDialog extends WiredBase {
  @property({ type: String }) name = '';
  @property({ type: Boolean, reflect: true }) open = false;

  static get styles(): CSSResult {
    return css`
      .wrapper {
        opacity: 0;
        transition: visibility 0s, opacity 0.25s ease-in;
      }
      .wrapper:not(.open) {
        visibility: hidden;
      }
      .wrapper.open {
        align-items: center;
        display: flex;
        justify-content: center;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 1;
        visibility: visible;
      }
      .overlay {
        background: rgba(0, 0, 0, 0.8);
        height: 100%;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
      }

      .buttons {
        display: flex;
        flex-direction: row;
      }
      .accept {
        justify-content: space-around;
        align-content: space-around;
      }
      .cancel {
        justify-content: space-around;
        align-content: space-around;
      }
      wired-card {
        background: #fff;
        display: block;
        max-width: 600px;
        padding: 1rem;
        position: fixed;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="wrapper ${this.open ? 'open' : ''}" aria-hidden="${!this
      .open}">
        <div class="overlay" @click="${this.close}"></div>
          <wired-card>
            <slot></slot>
            <div class="buttons">
              <wired-button
                class="accept"
                @click="${this.close}"
              >
                Ok
              </wired-button>
              <wired-button
                class="cancel"
                @click="${this.close}"
              >
                Cancel
              </wired-button>
            </div>
          </wired-card>
        </div>
      </div>
    `;
  }

  show() {
    this.open = true;
    document.addEventListener('keydown', this._watchEscape);
  }

  close() {
    this.open = false;
    document.removeEventListener('keydown', this._watchEscape);
    this.fireEvent('dialog-closed');
  }

  _watchEscape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}

export function openDialog(name: string) {
  const dialog: WiredDialog | null = document.querySelector(
    `wired-dialog[name=${name}]`
  );
  if (dialog) dialog.show();
}

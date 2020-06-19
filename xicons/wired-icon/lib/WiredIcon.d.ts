import { Options } from 'wired-lib/lib/wired-lib';
import { LitElement, CSSResult } from 'lit-element';
export declare class WiredIcon extends LitElement {
    config: Options;
    static get styles(): CSSResult;
    connectedCallback(): void;
    createRenderRoot(): this;
}

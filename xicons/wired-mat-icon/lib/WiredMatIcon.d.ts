import { LitElement, TemplateResult } from 'lit-element';
import 'wired-icon';
export declare class WiredMatIcon extends LitElement {
    static get styles(): import("lit-element").CSSResult;
    private _icon;
    private _path;
    config: Object;
    get icon(): string;
    set icon(value: string);
    render(): TemplateResult;
}

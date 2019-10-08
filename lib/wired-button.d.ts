import { LitElement, CSSResult, TemplateResult } from 'lit-element';
export declare class WiredButton extends LitElement {
    elevation: number;
    disabled: boolean;
    private svg?;
    private button?;
    static readonly styles: CSSResult;
    render(): TemplateResult;
    updated(): void;
    private drawShape;
}

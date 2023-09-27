import { LitElement, CSSResultGroup, TemplateResult } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'wired-node-selector': WiredNodeSelector;
    }
}
export interface WiredSelectorItem extends HTMLElement {
    onActivate?: (name: string) => void;
    onDeactivate?: () => void;
}
export declare class WiredNodeSelector extends LitElement {
    selected?: string;
    private _slotted;
    private _pageMap;
    private _current?;
    private get _slottedItems();
    static styles: CSSResultGroup;
    render(): TemplateResult;
    firstUpdated(): void;
    private getElement;
    updated(): void;
}

import { WiredBase, TemplateResult, Point } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-radio-group': WiredRadioGroup;
    }
}
export declare class WiredRadioGroup extends WiredBase {
    vertical: boolean;
    private _slotted;
    private _selectedRadio?;
    private _focusIn;
    get selected(): string | null;
    private get _buttons();
    constructor();
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    firstUpdated(): void;
    private selectRadio;
    private handleFocusin;
    private handleFocusout;
    private handleKeydown;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(): void;
}

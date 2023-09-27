import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-textfield': WiredTextfield;
    }
}
export declare class WiredTextfield extends WiredBase {
    disabled: boolean;
    type: string;
    label: string;
    placeholder: string;
    name?: string;
    autocomplete: string;
    endAlign: boolean;
    private _focused;
    private _hasText;
    private _input;
    private _label;
    private _obcenter;
    private _pendingValue?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    get value(): string;
    set value(v: string);
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    firstUpdated(): void;
    focus(): void;
    blur(): void;
    private _onFocus;
    private _onBlur;
    private _onChange;
    private _updateHasText;
    private _onInput;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

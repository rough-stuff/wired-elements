import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-search-input': WiredSearchInput;
    }
}
export declare class WiredSearchInput extends WiredBase {
    disabled: boolean;
    icon: 'search' | 'clear';
    placeholder: string;
    name?: string;
    autocomplete: string;
    private _focused;
    private _input;
    private _label;
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
    private _onInput;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
    private _onIconClick;
}

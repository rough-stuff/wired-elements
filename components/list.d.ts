import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
import './item.js';
import './card.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-list': WiredList;
    }
}
export declare class WiredList extends WiredBase {
    horizontal: boolean;
    selectable: boolean;
    private _slotted;
    private _focusIn;
    private _lastActiveItem?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    connectedCallback(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(): void;
    private get _items();
    private get _selectedItem();
    private _onItemClick;
    get selected(): string | null;
    set selected(value: string);
    private _handleFocusin;
    private _handleFocusout;
    private _handleKeydown;
    focus(): void;
    private _focusItem;
}

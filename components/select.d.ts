import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
import { WiredPopoverDirection } from './popover.js';
import './menu.js';
import './list.js';
import './item.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-select': WiredSelect;
    }
}
export declare class WiredSelect extends WiredBase {
    disabled: boolean;
    label: string;
    name?: string;
    maxPopoverHeight?: number;
    direction: WiredPopoverDirection;
    private _menuShowing;
    private _focused;
    private _selectedText;
    private _options;
    private _input;
    private _label;
    private _menu;
    private _listItems?;
    private _obcenter;
    private _slotted;
    private _selectedItem;
    private _pendingValue?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    get value(): string;
    set value(v: string);
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    private _onSlotChange;
    updated(changed: PropertyValues): void;
    private _popClose;
    private _popOpen;
    focus(): void;
    blur(): void;
    private _onFocus;
    private _onBlur;
    private _onInputClick;
    private _onSelect;
    private setSelected;
    private _onKeydown;
    private _onEscKey;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

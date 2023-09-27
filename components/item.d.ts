import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-item': WiredItem;
    }
}
export declare class WiredItem extends WiredBase {
    value: string;
    name: string;
    selected: boolean;
    disabled: boolean;
    _focusable: boolean;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    private _button?;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
    private _onItemClick;
}

import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-switch': WiredSwitch;
    }
}
export declare class WiredSwitch extends WiredBase {
    disabled: boolean;
    checked: boolean;
    private _focused;
    private _i?;
    private _container;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    updated(changed: PropertyValues<WiredSwitch>): void;
    private _onFocus;
    private _onBlur;
    private _onChecked;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-radio': WiredRadio;
    }
}
export declare class WiredRadio extends WiredBase {
    disabled: boolean;
    checked: boolean;
    value?: string;
    private _focused;
    private _input?;
    private _label?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    private _onChange;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

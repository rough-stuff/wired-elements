import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-progress-bar': WiredProgressBar;
    }
}
export declare class WiredProgressBar extends WiredBase {
    indeterminate: boolean;
    value: number;
    private _container?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

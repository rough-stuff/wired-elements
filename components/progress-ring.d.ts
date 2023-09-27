import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-progress-ring': WiredProgressRing;
    }
}
export declare class WiredProgressRing extends WiredBase {
    indeterminate: boolean;
    value: number;
    indicatorWidth: number;
    private _container?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-link': WiredLink;
    }
}
export declare class WiredLink extends WiredBase {
    elevation: number;
    href?: string;
    target?: string;
    private _anchor?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

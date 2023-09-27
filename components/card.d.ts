import { WiredBase, TemplateResult, Point } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-card': WiredCard;
    }
}
export declare class WiredCard extends WiredBase {
    elevation: number;
    private _outer?;
    private _inner?;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement): void;
}

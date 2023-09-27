import { WiredBase, TemplateResult, Point } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-icon-button': WiredIconButton;
    }
}
export declare class WiredIconButton extends WiredBase {
    disabled: boolean;
    private _button?;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

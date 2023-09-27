import { WiredBase, TemplateResult, Point } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-button': WiredButton;
    }
}
export declare class WiredButton extends WiredBase {
    elevation: number;
    disabled: boolean;
    rounded: boolean;
    type: 'outlined' | 'filled' | 'solid';
    private _button?;
    private _container?;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    private _mergedShape;
    protected draw(svg: SVGSVGElement): void;
}

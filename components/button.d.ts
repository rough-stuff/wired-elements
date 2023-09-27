import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-button': WiredButton;
    }
}
export declare class WiredButton extends WiredBase {
    elevation: number;
    disabled: boolean;
    rounded: boolean;
    type: 'outlined' | 'solid';
    private _button?;
    private _container?;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement): void;
}

import { TemplateResult, CSSResultArray } from 'lit-element';
import { WiredBaseElement } from './wired-base-element';
import { Point } from './core';
export declare class WiredCard extends WiredBaseElement {
    elevation: number;
    private resizeObserver?;
    private windowResizeHandler?;
    constructor();
    static readonly styles: CSSResultArray;
    render(): TemplateResult;
    updated(): void;
    disconnectedCallback(): void;
    private attachResizeListener;
    private detachResizeListener;
    protected canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

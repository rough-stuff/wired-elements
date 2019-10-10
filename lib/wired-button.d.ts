import { WiredBaseElement } from './wired-base-element';
import { TemplateResult, CSSResultArray } from 'lit-element';
import { Point } from './core';
export declare class WiredButton extends WiredBaseElement {
    elevation: number;
    disabled: boolean;
    private button?;
    static readonly styles: CSSResultArray;
    render(): TemplateResult;
    protected canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

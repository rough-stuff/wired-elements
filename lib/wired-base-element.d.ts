import { LitElement } from 'lit-element';
import { Point } from './core';
export declare type ResizeObserver = any;
export declare const BaseCSS: import("lit-element").CSSResult;
export declare abstract class WiredBaseElement extends LitElement {
    protected svg?: SVGSVGElement;
    protected lastSize: Point;
    updated(): void;
    protected wiredRender(force?: boolean): void;
    protected abstract canvasSize(): Point;
    protected abstract draw(svg: SVGSVGElement, size: Point): void;
}

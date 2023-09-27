import { LitElement, CSSResultGroup, PropertyValues } from 'lit';
export { html, css, TemplateResult, PropertyValues } from 'lit';
export { property, query, state, customElement as ce } from 'lit/decorators.js';
import { Randomizer } from './random';
import { RenderOps, RenderStyle, ResolvedRenderStyle } from './graphics';
export type Point = [number, number];
export declare class UIEvent<T> extends Event {
    private _detail?;
    constructor(name: string, detail?: T);
    get detail(): T | undefined;
}
export declare abstract class WiredBase extends LitElement {
    renderer: RenderStyle;
    protected svg?: SVGSVGElement;
    protected _lastSize: Point;
    protected _ro?: ResizeObserver;
    protected _roAttached: boolean;
    private _seed;
    static styles: CSSResultGroup;
    connectedCallback(): void;
    protected _fire(name: string, detail?: unknown): void;
    protected get renderStyle(): ResolvedRenderStyle;
    protected _resetSvg(size: Point, svg?: SVGSVGElement): SVGSVGElement | undefined;
    protected _setRendered(): void;
    protected _wiredRender(force?: boolean): void;
    updated(changed: PropertyValues): void;
    disconnectedCallback(): void;
    private _attachResizeListener;
    private detachResizeListener;
    protected _randomizer(): Randomizer;
    protected _forceRenderOnChange(_changed: PropertyValues): boolean;
    protected _renderPath(svg: SVGElement, ops: RenderOps, overrideStyle?: ResolvedRenderStyle): SVGElement;
    protected abstract _sizedNode(): HTMLElement | null;
    protected abstract _canvasSize(): Point;
    protected abstract draw(svg: SVGSVGElement, size: Point): void;
}

import { WiredBase, TemplateResult, Point, PropertyValues } from './core/base-element.js';
import { PointerTrackerHandler, Pointer, InputEvent } from './core/pointers.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-slider': WiredSlider;
    }
}
export declare class WiredSlider extends WiredBase implements PointerTrackerHandler {
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    markers: boolean;
    private _container;
    private _outerContainer;
    private _input;
    private _pct;
    private _tracking;
    private _focussed;
    private _marks;
    private _currentValue;
    private _value;
    get value(): number;
    set value(v: number);
    get currentValue(): number;
    private setCurrentValue;
    protected _forceRenderOnChange(changed: PropertyValues): boolean;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    firstUpdated(): void;
    updated(changed: PropertyValues<WiredSlider>): void;
    private onInputFocus;
    private onInputBlur;
    private recomputeMarkers;
    private setValueFromPointer;
    onTrackStart(pointer: Pointer, event: InputEvent): boolean;
    onTrackMove(changedPointers: Pointer[]): void;
    onTrackEnd(): void;
    private updateConfirmedValue;
    private _increment;
    private _decrement;
    private handleKeydown;
    focus(): void;
    blur(): void;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(svg: SVGSVGElement, size: Point): void;
}

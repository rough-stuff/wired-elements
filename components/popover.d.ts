import { WiredBase, TemplateResult, Point } from './core/base-element.js';
import './card.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-popover': WiredPopover;
    }
}
export type WiredPopoverPin = 'top-start' | 'top-end' | 'top-center' | 'top-beforestart' | 'top-afterend' | 'bottom-start' | 'bottom-end' | 'bottom-center' | 'bottom-beforestart' | 'bottom-afterend';
export type WiredPopoverDirection = 'down' | 'up' | 'centered';
export declare class WiredPopover extends WiredBase {
    elevation: number;
    pin: WiredPopoverPin;
    direction: WiredPopoverDirection;
    manualClose: boolean;
    x: number;
    y: number;
    maxHeight?: number;
    anchor?: HTMLElement;
    private _open;
    private _surface?;
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    get open(): boolean;
    set open(value: boolean);
    private _containerClick;
    private _closeListener;
    private _attachCloseListenr;
    private _detachCloseListenr;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(): void;
}

export type InputEvent = TouchEvent | PointerEvent | MouseEvent;
export interface Pointer {
    clientX: number;
    clientY: number;
    nativeEvent: Touch | PointerEvent | MouseEvent;
    id: number;
}
export interface PointerTrackerHandler {
    onTrackStart(pointer: Pointer, event: InputEvent): boolean;
    onTrackMove(changedPointers: Pointer[], event: InputEvent): void;
    onTrackEnd?: (pointer: Pointer, event: InputEvent, cancelled: boolean) => void;
}
export declare class PointerTracker {
    private _e;
    private _h;
    private startPointers;
    private currentPointers;
    private ael;
    private rel;
    constructor(element: HTMLElement, handler: PointerTrackerHandler);
    stop(): void;
    private triggerPointerStart;
    private pointerStart;
    private touchStart;
    private move;
    private _end;
    private pointerEnd;
    private touchEnd;
}

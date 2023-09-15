/* eslint-disable @typescript-eslint/no-explicit-any */

export type InputEvent = TouchEvent | PointerEvent | MouseEvent;

export interface Pointer {
  clientX: number;
  clientY: number;
  nativeEvent: Touch | PointerEvent | MouseEvent;
  id: number;
}

function createPointer(nativeEvent: Touch | PointerEvent | MouseEvent): Pointer {
  let id = -1;
  if (self.Touch && nativeEvent instanceof Touch) {
    id = nativeEvent.identifier;
  } else if (isPointerEvent(nativeEvent)) {
    id = nativeEvent.pointerId;
  }
  return {
    id,
    nativeEvent,
    clientX: nativeEvent.clientX,
    clientY: nativeEvent.clientY
  };
}

const isPointerEvent = (event: Touch | PointerEvent | MouseEvent): event is PointerEvent => self.PointerEvent && (event instanceof PointerEvent);

export interface PointerTrackerHandler {
  onTrackStart(pointer: Pointer, event: InputEvent): boolean;
  onTrackMove(changedPointers: Pointer[], event: InputEvent): void;
  onTrackEnd?: (pointer: Pointer, event: InputEvent, cancelled: boolean) => void;
}

export class PointerTracker {
  private _e: HTMLElement;
  private _h: PointerTrackerHandler;

  private startPointers: Pointer[] = [];
  private currentPointers: Pointer[] = [];

  private ael(name: string, listener: any) {
    this._e.addEventListener(name, listener);
  }
  private rel(name: string, listener: any) {
    this._e.removeEventListener(name, listener);
  }

  constructor(element: HTMLElement, handler: PointerTrackerHandler) {
    this._e = element;
    this._h = handler;
    if (self.PointerEvent) {
      this.ael('pointerdown', this.pointerStart);
    } else {
      this.ael('mousedown', this.pointerStart);
      this.ael('touchstart', this.touchStart);
      this.ael('touchmove', this.move);
      this.ael('touchend', this.touchEnd);
      this.ael('touchcancel', this.touchEnd);
    }
  }

  stop(): void {
    this.rel('pointerdown', this.pointerStart);
    this.rel('mousedown', this.pointerStart);
    this.rel('touchstart', this.touchStart);
    this.rel('touchmove', this.move);
    this.rel('touchend', this.touchEnd);
    this.rel('touchcancel', this.touchEnd);
    this.rel('pointermove', this.move);
    this.rel('pointerup', this.pointerEnd);
    this.rel('pointercancel', this.pointerEnd);
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('mouseup', this.pointerEnd);
  }

  private triggerPointerStart(pointer: Pointer, event: InputEvent): boolean {
    if (!this._h.onTrackStart(pointer, event)) return false;
    this.currentPointers.push(pointer);
    this.startPointers.push(pointer);
    return true;
  }

  private pointerStart = (event: PointerEvent | MouseEvent) => {
    if (event.button !== 0) return;
    if (!this.triggerPointerStart(createPointer(event), event)) return;
    if (isPointerEvent(event)) {
      const capturingElement = ((event.target && ('setPointerCapture' in event.target)) ? event.target : this._e) as HTMLElement;
      capturingElement.setPointerCapture(event.pointerId);
      this.ael('pointermove', this.move);
      this.ael('pointerup', this.pointerEnd);
      this.ael('pointercancel', this.pointerEnd);
    } else {
      window.addEventListener('mousemove', this.move);
      window.addEventListener('mouseup', this.pointerEnd);
    }
  };

  private touchStart = (event: TouchEvent) => {
    for (const touch of Array.from(event.changedTouches)) {
      this.triggerPointerStart(createPointer(touch), event);
    }
  };

  private move = (event: InputEvent) => {
    const changedPointers = ('changedTouches' in event)
      ? Array.from(event.changedTouches).map((t) => createPointer(t))
      : [createPointer(event)];
    const trackedChangedPointers = [];
    for (const pointer of changedPointers) {
      const index = this.currentPointers.findIndex((p) => p.id === pointer.id);
      if (index === -1)
        continue;
      trackedChangedPointers.push(pointer);
      this.currentPointers[index] = pointer;
    }
    if (trackedChangedPointers.length === 0) return;
    this._h.onTrackMove(trackedChangedPointers, event);
  };

  private _end = (pointer: Pointer, event: InputEvent): boolean => {
    const index = this.currentPointers.findIndex((p) => p.id === pointer.id);
    if (index === -1)
      return false;
    this.currentPointers.splice(index, 1);
    this.startPointers.splice(index, 1);

    if (this._h.onTrackEnd) {
      this._h.onTrackEnd(pointer, event, event.type === 'touchcancel' || event.type === 'pointercancel');
    }
    return true;
  };

  private pointerEnd = (event: PointerEvent | MouseEvent) => {
    if (!this._end(createPointer(event), event)) return;
    if (isPointerEvent(event)) {
      if (this.currentPointers.length) return;
      this.rel('pointermove', this.move);
      this.rel('pointerup', this.pointerEnd);
      this.rel('pointercancel', this.pointerEnd);
    } else {
      window.removeEventListener('mousemove', this.move);
      window.removeEventListener('mouseup', this.pointerEnd);
    }
  };

  private touchEnd = (event: TouchEvent) => {
    for (const touch of Array.from(event.changedTouches)) {
      this._end(createPointer(touch), event);
    }
  };
}
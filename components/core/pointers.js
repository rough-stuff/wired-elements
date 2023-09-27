/* eslint-disable @typescript-eslint/no-explicit-any */
function createPointer(nativeEvent) {
    let id = -1;
    if (self.Touch && nativeEvent instanceof Touch) {
        id = nativeEvent.identifier;
    }
    else if (isPointerEvent(nativeEvent)) {
        id = nativeEvent.pointerId;
    }
    return {
        id,
        nativeEvent,
        clientX: nativeEvent.clientX,
        clientY: nativeEvent.clientY
    };
}
const isPointerEvent = (event) => self.PointerEvent && (event instanceof PointerEvent);
export class PointerTracker {
    ael(name, listener) {
        this._e.addEventListener(name, listener);
    }
    rel(name, listener) {
        this._e.removeEventListener(name, listener);
    }
    constructor(element, handler) {
        this.startPointers = [];
        this.currentPointers = [];
        this.pointerStart = (event) => {
            if (event.button !== 0)
                return;
            if (!this.triggerPointerStart(createPointer(event), event))
                return;
            if (isPointerEvent(event)) {
                const capturingElement = ((event.target && ('setPointerCapture' in event.target)) ? event.target : this._e);
                capturingElement.setPointerCapture(event.pointerId);
                this.ael('pointermove', this.move);
                this.ael('pointerup', this.pointerEnd);
                this.ael('pointercancel', this.pointerEnd);
            }
            else {
                window.addEventListener('mousemove', this.move);
                window.addEventListener('mouseup', this.pointerEnd);
            }
        };
        this.touchStart = (event) => {
            for (const touch of Array.from(event.changedTouches)) {
                this.triggerPointerStart(createPointer(touch), event);
            }
        };
        this.move = (event) => {
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
            if (trackedChangedPointers.length === 0)
                return;
            this._h.onTrackMove(trackedChangedPointers, event);
        };
        this._end = (pointer, event) => {
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
        this.pointerEnd = (event) => {
            if (!this._end(createPointer(event), event))
                return;
            if (isPointerEvent(event)) {
                if (this.currentPointers.length)
                    return;
                this.rel('pointermove', this.move);
                this.rel('pointerup', this.pointerEnd);
                this.rel('pointercancel', this.pointerEnd);
            }
            else {
                window.removeEventListener('mousemove', this.move);
                window.removeEventListener('mouseup', this.pointerEnd);
            }
        };
        this.touchEnd = (event) => {
            for (const touch of Array.from(event.changedTouches)) {
                this._end(createPointer(touch), event);
            }
        };
        this._e = element;
        this._h = handler;
        if (self.PointerEvent) {
            this.ael('pointerdown', this.pointerStart);
        }
        else {
            this.ael('mousedown', this.pointerStart);
            this.ael('touchstart', this.touchStart);
            this.ael('touchmove', this.move);
            this.ael('touchend', this.touchEnd);
            this.ael('touchcancel', this.touchEnd);
        }
    }
    stop() {
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
    triggerPointerStart(pointer, event) {
        if (!this._h.onTrackStart(pointer, event))
            return false;
        this.currentPointers.push(pointer);
        this.startPointers.push(pointer);
        return true;
    }
}

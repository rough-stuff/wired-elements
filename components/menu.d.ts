import { WiredPopover } from './popover.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-menu': WiredPopover;
    }
}
export declare class WiredMenu extends WiredPopover {
    autofocus: boolean;
    private _connected;
    private _node?;
    private _slotted;
    private get _slottedList();
    set acnchor(node: HTMLElement);
    private _clickListener;
    private _detachNode;
    private _attachToNode;
    private _selectListener;
    connectedCallback(): void;
    disconnectedCallback(): void;
}

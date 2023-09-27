import { WiredBase, TemplateResult, Point } from './core/base-element.js';
import './list.js';
import './card.js';
import './core/node-selector.js';
declare global {
    interface HTMLElementTagNameMap {
        'wired-tabs': WiredTabs;
    }
}
export declare class WiredTabs extends WiredBase {
    private _selectedName;
    private _list;
    get selected(): string | null;
    set selected(value: string);
    static styles: import("lit").CSSResultGroup[];
    render(): TemplateResult;
    protected _sizedNode(): HTMLElement | null;
    protected _canvasSize(): Point;
    protected draw(): void;
    updated(): void;
    private _handleTabChange;
}

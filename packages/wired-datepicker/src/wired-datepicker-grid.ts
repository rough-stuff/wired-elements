import { LitElement, customElement, property, TemplateResult, html, css, CSSResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { fire } from 'wired-lib';
import './wired-datepicker-cell';
import { WiredDatePickerCell } from './wired-datepicker-cell';

/**
 * Calendar Cell Template
 * @param index the cell index, used to display the day
 * @param selected if the cell is selected
 * @param disabled if the cell is disabled
 * @param hasFocus if the cell is currently focused
 * @param handleSelect callback function when the cell is selected. Sends the index
 */
const Cell = (index: number, selected: boolean = false, disabled: boolean = false, tabindex: number = -1, handleSelect?: Function) => html`
    <wired-datepicker-cell
        role="gridcell"
        tabindex="${tabindex}"
        index=${index}
        class=${classMap({"cell": true, "selected": selected, "disabled": disabled})}
        .selected=${selected}
        .disabled=${disabled}
        @click=${() => handleSelect && handleSelect(index)}
        >
        ${index+1}
    </wired-datepicker-cell>
`;

/**
 * Additionnal style to offset the first day of the grid.
 * For performance reasons, it is not directly included in the grid template
 * as it is dynamic. See "styling" in LitElement
 * @param offset number of column to offset between 1 and 7
 */
const gridOffset = (offset: number) => html`
    <style>
        #grid .cell:first-child {
            grid-column: ${offset};
        }
    </style>
`;

/**
 * Displays days in a grid and support tab navigation
 */
@customElement('wired-datepicker-grid')
export class WiredDatePickerGrid extends LitElement {

    /**
     * Index of selected day if it exists
     */
    @property({ type: Number }) 
    get selectedDayIndex(): number {
        return this._selectedDayIndex;
    }
    set selectedDayIndex(value: number) {
        const oldValue = this._selectedDayIndex;
        this._selectedDayIndex = value;
        this._focusIndex = value;
        if (this._focusIndex < this.minEnabledIndex 
            || this._focusIndex > this.maxEnabledIndex) {
            this._focusIndex = this.minEnabledIndex;
        }
        this.requestUpdate('selectedDayIndex', oldValue);
    }
    /**
     * Index after which days are enabled
     */
    @property({ type: Number }) 
    get minEnabledIndex(): number {
        return this._minEnabledIndex;
    }
    set minEnabledIndex(value: number) {
        this._minEnabledIndex = value;
        this._focusIndex = Math.max(this._minEnabledIndex, this._focusIndex);
    }
    /**
     * Index before which days are enabled
     */
    @property({ type: Number })
    get maxEnabledIndex(): number {
        return this._maxEnabledIndex;
    }
    set maxEnabledIndex(value: number) {
        this._maxEnabledIndex = value;
        if (this._focusIndex >= this._maxEnabledIndex) {
            this._focusIndex = this._minEnabledIndex;
        }
    }
    /**
     * Number of day to display
     */
    @property({ type: Number }) dayCount: number = 0;
    /**
     * Offset for the first element of the grid
     */
    @property({ type: Number }) gridOffset: number = 0;

    /**
     * Keep track of the focused cell
     */
    private _focusIndex: number = 0;

    private _selectedDayIndex: number = -1;
    private _minEnabledIndex: number = 0;
    private _maxEnabledIndex: number = 32;

    static get styles(): CSSResult {
        return css`
            #grid {
                text-align: center;
                display: grid;
                grid-template-columns: repeat(7, 1fr);
            }
        `;
    }

    constructor() {
        super();
        // Add ARIA role of grid
        this.setAttribute('role', 'grid');
    }

    render(): TemplateResult {
        const additionnalStyle = gridOffset(this.gridOffset);

        const isEnabled = (i: number) => i < this.maxEnabledIndex && i >= this.minEnabledIndex;
        const tabindex = (i: number) => i === this._focusIndex ? 0: -1;
        const isSelected = (i: number) => this.selectedDayIndex < 0 ? false: this.selectedDayIndex === i;
        const cells = [...Array(this.dayCount).keys()].map(i => {
            const enabled =  isEnabled(i);
            const selected = isSelected(i);
            const onSelectCell = enabled && !selected ? this.onCellSelected.bind(this) : undefined;
            return Cell(i, selected, !enabled, tabindex(i), onSelectCell);
        });
        
        return html`
            ${additionnalStyle}
            <div id="grid">
                ${[...cells]}
            </div>
        `;
    }

    /**
     * Add support for navigation in the grid with keyboard
     */
    firstUpdated() {
        this.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    /**
     * Allows navigation with keyboard when focus in the grid
     * @param e Keyboard event detected
     */
    private handleKeyboardNavigation(e: KeyboardEvent) {
        const VK_ENTER = 13;
        const VK_SPACE = 32;
        const VK_END   = 35;
        const VK_HOME  = 36;
        const VK_LEFT  = 37;
        const VK_RIGHT = 39;
        const VK_UP    = 38;
        const VK_DOWN  = 40;

        const cells = this.shadowRoot?.querySelectorAll<WiredDatePickerCell>('wired-datepicker-cell');
        const focusableCells = this.shadowRoot?.querySelectorAll<WiredDatePickerCell>('wired-datepicker-cell[tabindex="0"]');
        if (!cells) return;
        if (focusableCells?.length && focusableCells.length > 1) {
            // We are in a rare situation where several cells have tabindex = 0
            // When user press tab / shift + tab... we just clean it
            focusableCells.forEach(cell => {
                if (cell.index !== this._focusIndex) {
                    cell.tabIndex = -1;
                }
            });
        }
        let newFocusIndex = this._focusIndex;
        switch(e.keyCode) {
            case VK_LEFT:
                e.preventDefault();
                newFocusIndex = this.jumpBackward(1);
                break;
            case VK_RIGHT:
                e.preventDefault();
                newFocusIndex = this.jumpForward(1, cells.length);
                break;
            case VK_DOWN:
                e.preventDefault();
                newFocusIndex = this.jumpForward(7, cells.length);
                break;
            case VK_UP:
                e.preventDefault();    
                newFocusIndex = this.jumpBackward(7);
                break;
            case VK_END:
                e.preventDefault();
                newFocusIndex = Math.min(cells.length, this.maxEnabledIndex)-1;
                break;
            case VK_HOME:
                e.preventDefault();
                newFocusIndex = Math.max(0, this.minEnabledIndex);
                break;
            case VK_SPACE:
            case VK_ENTER:
                e.preventDefault();
                this.onCellSelected(this._focusIndex);
                break;
            default:
                break;
        }
        if (newFocusIndex !== this._focusIndex) {
            cells[this._focusIndex].blur();
            cells[this._focusIndex].tabIndex = -1;
            this._focusIndex = newFocusIndex;
            cells[this._focusIndex].focus();
            cells[this._focusIndex].tabIndex = 0;
        }
    };
    
    /**
     * Notifies that a cell has been selected
     * @fires cell-selected - { day: dayNumber }
     * @param cellIndex Index of the selected cell
     */
    private onCellSelected(cellIndex: number) {
        fire(this, 'cell-selected', { day: cellIndex+1 });
    }

    /**
     * Check if a forward jump of n step is possible
     * Returns the new value if the jump is possible
     * Otherwise return the initial value
     * @param step the number of step we want to jump 
     * @param gridLength the grid length
     */
    private jumpForward(step: number, gridLength: number): number {
        if (this._focusIndex+step < Math.min(gridLength, this.maxEnabledIndex)) {
            return this._focusIndex+step;
        }
        return this._focusIndex;
    }

    /**
     * Check if a backward jump of n step is possible
     * Returns the new value if the jump is possible
     * Otherwise return the initial value
     * @param step the number of step we want to jump 
     */
    private jumpBackward(step: number): number {
        if (this._focusIndex-step >= Math.max(0, this.minEnabledIndex)) {
            return this._focusIndex-step;
        }
        return this._focusIndex;
    }
}

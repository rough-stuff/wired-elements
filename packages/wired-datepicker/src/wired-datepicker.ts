import { customElement, property, TemplateResult, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { fire } from 'wired-lib';
import { WiredCard } from 'wired-card';
import './wired-datepicker-cell';
import { WiredDatePickerCell } from './wired-datepicker-cell';
import { getLocaleFromNavigator, localizedDays, localizedMonths } from './locale.utils';
import { daysInMonth, isDateInMonth } from './date.utils';

/**
 * Handy representation of a date, with both Date and String
 */
type WiredDate = { date?: Date, text: string };

/**
 * Calendar Cell Template
 * @param index the cell index, used to display the day
 * @param selected if the cell is selected
 * @param disabled if the cell is disabled
 * @param hasFocus if the cell is currently focused
 * @param handleSelect callback function when the cell is selected
 */
const Cell = (index: number, selected: boolean = false, disabled: boolean = false, hasFocus: boolean = false, handleSelect?: Function) => html`
    <wired-datepicker-cell
        index=${index}
        tabindex=${hasFocus ? "0" : "-1"}
        class=${classMap({"cell": true, "selected": selected, "disabled": disabled})}
        ?selected=${selected}
        ?disabled=${disabled}
        @click=${() => handleSelect && handleSelect(index+1)}
        >
        ${index+1}
    </wired-datepicker-cell>
`;

/**
 * Additionnal style to offset the first day of the grid.
 * For performance reasons, it is not included in the calendar as it is dynamic
 * @param offset number of column to offset between 1 and 7
 */
const gridOffset = (offset: number) => html`
    <style>
        .date-grid .cell:first-child {
            grid-column: ${offset};
        }
    </style>
`;

/**
 * Month Selector Template
 * @param active if the selector can be activated
 * @param onChangeMonth callback function whe the selector is clicked
 * @param selector an html template to use to represent the selector
 */
const MonthSelector = (active: boolean, onChangeMonth: Function, selector: TemplateResult) => html` 
    <span 
        class=${classMap({"month-selector-active": active, "month-selector-disabled": !active})}
        @click=${() => active ? onChangeMonth() : null}>
        ${selector}
    </span>
`;

const giveFocus = (el: HTMLElement) => {
    el.tabIndex = 0;
    el.focus();
    el.setAttribute('aria-checked', 'true');
};

const removeFocus = (el: HTMLElement) => {
    el.tabIndex = -1;
    el.removeAttribute('aria-checked');
}

/**
 * Calendar Template, based on CSS grid with 4 main parts:
 * - month-indicators: displays the month and the selectors
 * - day-of-week: days name, from sunday to saturday
 * - date-grid: container for the calendar days
 * - overlay: allow to display a neat wired frame around
 * @param header the text to display in month-indicators
 * @param days the days name
 * @param cells the cells to display
 * @param style additionnal style (allows to offset the grid)
 * @param prevMonthSelector custom selector for previous month
 * @param nextMonthSelector custom selector for next month
 */
const Calendar = (header: string, days: string[], cells: TemplateResult[], style: TemplateResult, prevMonthSelector: TemplateResult, nextMonthSelector: TemplateResult) => html`
    ${style}
    <style>
        :host {
            display: inline-block;
            position: relative;
            --wired-datepicker-color: black;
            --wired-datepicker-focus-color: var(--wired-datepicker-color);
        }
        :host path {
            stroke: var(--wired-datepicker-color);
            stroke-width: 0.7;
        }
        :host(:focus) path {
            stroke: var(--wired-datepicker-focus-color);
            stroke-width: 1.5;
        }
        .month-indicator {
            display:flex;
            justify-content: space-between;
            padding-left: 1em;
            padding-right: 1em;
            font-weight: bold;
        }
        .day-of-week,
        .date-grid {
            text-align: center;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
        }
        .day-of-week {
            font-weight: bold;
        }
        .month-selector-active::selection,
        .month-selector-disabled::selection {
            background: transparent;
        }
        .month-selector-active {
            cursor: pointer;
        }
        .month-selector-disabled {
            cursor: not-allowed;
            color: lightgray;
        }
    </style>
    <div class="calendar">
        <div class="month-indicator" tabindex="0">
            ${prevMonthSelector}
            <span>${header}</span>
            ${nextMonthSelector}
        </div>
        <div class="day-of-week">
            ${days.map(d => html`<div>${d}</div>`)}
        </div>
        <div class="date-grid">
            ${[...cells]}
        </div>
    </div>
    <div id="overlay"><svg></svg></div>
`;

/**
 * Calendar WebComponent.
 * 
 * @example
 * <wired-datepicker
 *   locale="fr-FR"
 *   selected="Apr 29 2020">
 * <wired-datepicker>
 * 
 * @attribute elevation - elevation between 1 and 5
 * @attribute locale - BCP 47 language tag string like `es-MX`
 * @attribute disabled - disables the whole calendar if set
 * @attribute initials - displays minimalistic version of week day names if set
 * @attribute selected - string of the selected day wanted
 * @attribute firstdate - string of the min selectable date of the calendar
 * @attribute lastdate - string of the max selectable date of the calendar
 * @property value - current selected date {date:Date, text:String}
 * @fires selected - when a date is selected
 * @fires attr-error - for debug purpose if an attribute is not validated
 * @extends WiredCard to display a wired outline with elevation
 */
@customElement('wired-datepicker')
export class WiredDatePicker extends WiredCard {
    @property({ type: String, reflect: true }) locale?: string;
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) initials = false;
    
    @property({ type: String, reflect: true })
    get selected(): string {
        return this.value.text;
    }

    /**
     * Format must follow the ecma-international norm
     * https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
     */
    set selected(value: string) {
        const oldVal = this.selected;
        let selectedDate;
        // we validate the input
        if (!isNaN(Date.parse(value))) {
            selectedDate = new Date(value);
        } else {
            selectedDate = undefined;
            fire(this, 'attr-error', { msg: `Invalid 'selected' value '${value}'`});
        }
        this._value = {
            date: selectedDate,
            text: value,
        }
        // Whenever selected is valid or not, we fire the event
        fire(this, 'selected', { selected: this.value });
        // We need to request update if property is defined programmatically
        this.requestUpdate('selected', oldVal);
    }

    @property({ type: String, reflect: true }) 
    get firstdate(): string {
        return this._firstdate.text;
    }
    set firstdate(value: string) {
        const oldVal = this.firstdate;
        if (value && !isNaN(Date.parse(value))) {
            this._firstdate.date = new Date(value);
            this._firstdate.text = value;
        } else {
            this._firstdate.text = '';
            this._firstdate.date = undefined;
            fire(this, 'attr-error', { msg: `Invalid 'firstdate' value '${value}'`});
        }
        // We need to request update if property is defined programmatically
        this.requestUpdate('firstdate', oldVal);
    }

    @property({ type: String, reflect: true }) 
    get lastdate(): string {
        return this._lastdate.text;
    }
    set lastdate(value: string) {
        const oldVal = this.lastdate;
        if (value && !isNaN(Date.parse(value))) {
            this._lastdate.date = new Date(value);
            this._lastdate.text = value;
        } else {
            this._lastdate.text = '';
            this._lastdate.date = undefined;
            fire(this, 'attr-error', { msg: `Invalid 'lastdate' value '${value}'`});
        }
        // We need to request update if property is defined programmatically
        this.requestUpdate('lastdate', oldVal);
    }

    /**
     * We expose the selected date as a readonly property
     * It is not reflected as an attribute as it is a complex type,
     * and must only be used internally to store the selected date.
     */
    get value() : WiredDate {
        return {...this._value};
    }

    /**
     * Reference Date is used internally to represent currently displayed month.
     * It is in local time and correspond to 1st day of the displayed month.
     */
    private refDate: Date;

    private _firstdate: WiredDate = { text: '' };
    private _lastdate: WiredDate = { text: '' };
    private _value: WiredDate = { text: '' };
    /**
     * Represents the  cell currently having focus
     */
    private _highlightedIndex: number = 0;

    /**
     * Positions the calendar at the current month for the user (local time),
     * or selected month if provided with the "selected" attributes.
     * Retrieves the locale from navigator, it will be override by locale
     * attribute later if it has been provided.
     */
    constructor() {
        super();
        // If the selected attribute is given, we want to display the right month
        const selectedDate = this.getAttribute('selected');
        // refDate is in local time, represents the current month for the user
        this.refDate = new Date();
        if (selectedDate) {
            // initialize 'this.value' by setting selected
            this.selected = selectedDate;
            if (this.value.date) {
                // if selected date is valid, position calendar on this month
                this.refDate = new Date(this.value.date);
            }
        }
        this.refDate.setDate(1);
        
        // We start with the locale from navigator
        this.locale = getLocaleFromNavigator(navigator);

        // Enable focus on the element
        if (!this.hasAttribute('tabindex') && !this.disabled) { 
            this.setAttribute('tabindex', '0');
            this.tabIndex = 0;
        }
    }

    /**
     * Enable keyboard navigation in the calendar
     */
    firstUpdated() {
        const VK_SPACE = 32
        const VK_LEFT  = 37;
        const VK_RIGHT = 39;
        const VK_UP    = 38;
        const VK_DOWN  = 40;
        
        this.addEventListener('keydown', (e: KeyboardEvent) => {
            const activeElement = this.shadowRoot?.activeElement;
            const monthHeader = this.shadowRoot?.querySelector('.month-indicator');
            if (activeElement === monthHeader) {
                switch(e.keyCode) {
                    case VK_LEFT:
                        e.preventDefault();
                        if (this.canGoPrev()) {
                            this.loadPrevMonth();
                        }
                        break;
                    case VK_RIGHT:
                        e.preventDefault();
                        if (this.canGoNext()) {
                            this.loadNextMonth();
                        }
                        break;
                    default:
                        break;
                }
            } else {
                const cells = this.shadowRoot?.querySelectorAll<WiredDatePickerCell>('wired-datepicker-cell');
                switch(e.keyCode) {
                    case VK_LEFT:
                        e.preventDefault();
                        if (cells && this._highlightedIndex > 0) {
                            const oldCell = cells[this._highlightedIndex];
                            const newCell = cells[--this._highlightedIndex];
                            this.changeCellFocus(oldCell, newCell);
                        }
                        break;
                    case VK_RIGHT:
                        e.preventDefault();
                        if (cells && this._highlightedIndex < cells.length-1) {
                            const oldCell = cells[this._highlightedIndex];
                            const newCell = cells[++this._highlightedIndex];
                            this.changeCellFocus(oldCell, newCell);
                        }
                        break;
                    case VK_DOWN:
                        e.preventDefault();
                        if (cells && this._highlightedIndex < cells.length-7) {
                            const oldCell = cells[this._highlightedIndex];
                            const newCell = cells[this._highlightedIndex+=7];
                            this.changeCellFocus(oldCell, newCell);
                        }
                        break;
                    case VK_UP:
                        e.preventDefault();
                        if (cells && this._highlightedIndex >= 7) {
                            const oldCell = cells[this._highlightedIndex];
                            const newCell = cells[this._highlightedIndex-=7];
                            this.changeCellFocus(oldCell, newCell);
                        }
                        break;
                    case VK_SPACE:
                        e.preventDefault();
                        this.setSelectedDate(this._highlightedIndex+1);
                        break;
                    default:
                        break;
                }
            }
        })
    }

    /**
     * Renders the web component calendar for the selected/current month
     */
    render(): TemplateResult {
        const days = localizedDays(this.locale, this.initials ? 'narrow': 'short');
        const month = this.refDate.getMonth();
        const year = this.refDate.getFullYear();
        // refDate represents the first day of the current month
        // getDay returns the index of the day in the week, 0 being sunday
        const firstDayOfMonthIndex = this.refDate.getDay();
        const style = gridOffset(firstDayOfMonthIndex+1);
        const monthName = localizedMonths(this.locale)[month];
        const cells = this.buildCells(year, month);
        const prevMonthSelector = MonthSelector(this.canGoPrev(), () => this.loadPrevMonth(), html`&lt;&lt;`);
        const nextMonthSelector = MonthSelector(this.canGoNext(), () => this.loadNextMonth(), html`&gt;&gt;`);

        return Calendar(`${monthName} ${year}`, days, cells, style, prevMonthSelector, nextMonthSelector);
    }

    /**
     * Creates the HTML templates for all the days in the wanted month.
     * @param year year of the calendar
     * @param month month of the calendar
     */
    private buildCells(year: number, month: number): TemplateResult[] {
        const dayCount = daysInMonth(month, year);
        let enabledMinIndex = -1;
        let enabledMaxIndex = 32;
        const minDate = this._firstdate.date
        const maxDate = this._lastdate.date;
        if (minDate && isDateInMonth(month, year, minDate)) {
            enabledMinIndex = minDate.getDate();
        }
        if (maxDate && isDateInMonth(month, year, maxDate)) {
            enabledMaxIndex = maxDate.getDate();
        }
        const cells = [...Array(dayCount).keys()].map(i => {
            const enabled = !this.disabled && i<enabledMaxIndex && i>=enabledMinIndex;
            const onSelectDay = enabled ? this.setSelectedDate.bind(this) : undefined;
            const isHighlighted = this._highlightedIndex === i;
            return Cell(i, false, !enabled, isHighlighted, onSelectDay);
        });
        
        // Display a selected cell if in the current month
        if (this.value.date && this.value.date.getMonth() === month) {
            const selectedDayIndex = this.value.date.getDate() -1;
            cells[selectedDayIndex] = Cell(selectedDayIndex, true, this.disabled);
        }
        return cells;
    }

    /**
     * Updates selected date with the provided day.
     * @param day index of the day selected in the displayed month
     */
    private setSelectedDate(day: number) {
        // the selected day is obviously the same month as our refDate
        // so we use refDate to build the selected date
        const tmp = new Date(this.refDate);
        tmp.setDate(day);
        this.selected = tmp.toDateString();
    }

    /**
     * Checks if the calendar allows to go to previous month
     * @returns true if firstdate is at most previous month or undefined
     */
    private canGoPrev(): boolean {
        const minDate = this._firstdate.date;
        if (!minDate) return true;
        const prevDate = new Date(this.refDate); 
        prevDate.setMonth(prevDate.getMonth() -1);

        return prevDate.getFullYear() >= minDate.getFullYear()
            && prevDate.getMonth() >= minDate.getMonth();
    }

    /**
     * Checks if the calendar allows to go to next month
     * @returns true if lastdate is at least next month or undefined
     */
    private canGoNext(): boolean {
        const maxDate = this._lastdate.date;
        if (!maxDate) return true;
        const nextDate = new Date(this.refDate); 
        nextDate.setMonth(nextDate.getMonth() +1);
        
        return nextDate.getFullYear() <= maxDate.getFullYear()
            && nextDate.getMonth() <= maxDate.getMonth();
    }

    /**
     * Changes the reference date to the first day of the next month
     */
    private loadNextMonth() {
        this.refDate.setMonth(this.refDate.getMonth() +1);
        this.performUpdate();
    }

    /**
     * * Changes the reference date the first day of the previous month
     */
    private loadPrevMonth() {
        this.refDate.setMonth(this.refDate.getMonth() -1);
        this.performUpdate();
    }

    /**
     * Given 2 cells, removes cell focus on the old and gives focus to the new one
     * @param oldCell Cell that loses focus
     * @param newCell Cell that gain focus
     */
    private changeCellFocus(oldCell: WiredDatePickerCell, newCell: WiredDatePickerCell) {
        removeFocus(oldCell);
        giveFocus(newCell);
    }
}

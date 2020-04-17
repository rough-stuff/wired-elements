import { customElement, property, TemplateResult, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { fire } from 'wired-lib';
import { WiredCard } from 'wired-card';
import './wired-calendar-cell';
import { getLocaleFromNavigator, localizedDays, localizedMonths } from './locale-utils';
import { daysInMonth, isDateInMonth } from './date-utils';

const Cell = (number: number, selected: boolean = false, disabled: boolean = false, handleSelect?: Function) => html`
    <wired-calendar-cell
        class="cell"
        ?selected=${selected}
        ?disabled=${disabled}
        @click=${() => handleSelect && handleSelect(number)}
        >
        ${number}
    </wired-calendar-cell>
`;

/**
 * Offset the first day of the grid
 * @param offset number of column to offset between 1 and 7
 */
const gridOffset = (offset: number) => html`
    <style>
        .date-grid .cell:first-child {
            grid-column: ${offset};
        }
    </style>
`;

const monthSelector = (canGo: boolean, onChangeMonth: Function, selector: TemplateResult) => html` 
    <span 
        class=${classMap({"month-selector-active": canGo, "month-selector-disabled": !canGo})}
        @click=${() => canGo ? onChangeMonth() : null}>
        ${selector}
    </span>
`;

const Calendar = (header: string, days: string[], cells: TemplateResult[], style: TemplateResult, prevMonthSelector: TemplateResult, nextMonthSelector: TemplateResult) => html`
    ${style}
    <style>
        :host(:focus) path {
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
        .month-selector-active {
            cursor: pointer;
        }
        .month-selector-disabled {
            cursor: not-allowed;
            color: lightgray;
        }
    </style>
    <div class="calendar">
        <div class="month-indicator">
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
 * We inherit the overlay from WiredCard.
 * Elevation property comes for free!
 */
@customElement('wired-calendar-grid')
export class WiredCalendarGrid extends WiredCard {
    @property({ type: String, reflect: true }) locale?: string; // BCP 47 language tag like `es-MX`
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) initials = false; // days of week
    
    @property({ type: String, reflect: true })
    get selected(): string {
        return this.value.text;
    }

    set selected(value: string) {
        let selectedDate;
        // we validate the input
        if (!isNaN(Date.parse(value))) {
            selectedDate = new Date(value);
        } else {
            selectedDate = undefined;
            fire(this, 'error', { msg: `Invalid 'selected' value '${value}'`});
        }
        this._value = {
            date: selectedDate,
            text: value,
        }
        // Whenever selected is valid or not, we fire the event
        fire(this, 'selected', { selected: this.selected });
    }

    @property({ type: String, reflect: true }) 
    get firstdate(): string {
        return this._firstdate.text;
    }
    set firstdate(value: string) {
        if (value && !isNaN(Date.parse(value))) {
            this._firstdate.date = new Date(value);
            this._firstdate.text = value;
        } else {
            this._firstdate.text = '';
            this._firstdate.date = undefined;
            fire(this, 'error', { msg: `Invalid 'lastdate' value '${value}'`});
        }
    }

    @property({ type: String, reflect: true }) 
    get lastdate(): string {
        return this._lastdate.text;
    }
    set lastdate(value: string) {
        if (value && !isNaN(Date.parse(value))) {
            this._lastdate.date = new Date(value);
            this._lastdate.text = value;
        } else {
            this._lastdate.text = '';
            this._lastdate.date = undefined;
            fire(this, 'error', { msg: `Invalid 'lastdate' value '${value}'`});
        }
    }

    /**
     * We expose the selected date as a readonly property
     */
    get value() : { date?: Date, text: string } {
        return {...this._value};
    }

    /**
     * Reference Date is used internally to represent currently displayed month.
     * It is in local time and correspond to 1st day of the displayed month.
     */
    private refDate: Date;

    private _firstdate: { date? :Date, text :string } = { date: undefined, text: '' };
    private _lastdate: { date? :Date, text :string } = { date: undefined, text: '' };
    private _value: { date? :Date, text :string } = { date: undefined, text: '' };

    constructor() {
        super();
        // If the selected attribute is given, we want to display the right month
        const selectedDate = this.getAttribute('selected');
        // refDate is in local time
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
    }

    render(): TemplateResult {
        const days = localizedDays(this.locale, this.initials ? 'narrow': 'short');
        const month = this.refDate.getMonth();
        const year = this.refDate.getFullYear();
        const firstDayUtc = this.refDate.getDay();
        const style = gridOffset(firstDayUtc+1);
        const monthName = localizedMonths(this.locale)[month];
        const cells = this.buildCells(year, month);
        const prevMonthSelector = monthSelector(this.canGoPrev(), () => this.loadPrevMonth(), html`&lt;&lt;`);
        const nextMonthSelector = monthSelector(this.canGoNext(), () => this.loadNextMonth(), html`&gt;&gt;`);

        return Calendar(`${monthName} ${year}`, days, cells, style, prevMonthSelector, nextMonthSelector);
    }

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
            const onClick = enabled ? this.onSelectDate.bind(this) : undefined;
            return Cell(i+1, false, !enabled, onClick);
        });
        
        // Display a selected cell if in the current month
        if (this.value.date && this.value.date.getMonth() === month) {
            const selectedDay = this.value.date.getDate();
            cells[selectedDay-1] = Cell(selectedDay, true, this.disabled);
        }
        return cells;
    }

    private onSelectDate(day: number) {
        const tmp = new Date(this.refDate);
        tmp.setDate(day);
        this.selected = tmp.toDateString();
    }

    private canGoPrev(): boolean {
        const minDate = this._firstdate.date;
        const prevDate = new Date(this.refDate); 
        prevDate.setMonth(prevDate.getMonth() -1);

        return !!minDate
            && prevDate.getFullYear() >= minDate.getFullYear()
            && prevDate.getMonth() >= minDate.getMonth();
    }

    private canGoNext(): boolean {
        const maxDate = this._lastdate.date;
        const nextDate = new Date(this.refDate); 
        nextDate.setMonth(nextDate.getMonth() +1);
        
        return !!maxDate
            && nextDate.getFullYear() <= maxDate.getFullYear()
            && nextDate.getMonth() <= maxDate.getMonth();
    }

    private loadNextMonth() {
        this.refDate.setMonth(this.refDate.getMonth() +1);
        this.performUpdate();
    }

    private loadPrevMonth() {
        this.refDate.setMonth(this.refDate.getMonth() -1);
        this.performUpdate();
    }
}

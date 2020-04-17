import { customElement, property, TemplateResult, html } from 'lit-element';
// import { Point, ellipse, line, rectangle, fire } from 'wired-lib';
import { WiredCard } from '../../wired-card/lib/wired-card';
import './wired-calendar-cell';
import { getLocaleFromNavigator, localizedDays, localizedMonths } from './locale-utils';

/**
 * Number of days in a particular month
 * @param month month between 0 and 11
 * @param year full year (1991, 2000)
 */
const daysInMonth = function (month: number, year: number) {
    return new Date(year, month+1, 0).getDate();
}

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

const Calendar = (header: string, days: string[], cells: TemplateResult[], style: TemplateResult, onChangeMonth: Function):TemplateResult => html`
    ${style}
    <style>
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
        .month-selector {
            cursor: pointer;
        }
    </style>
    <div class="calendar">
        <div class="month-indicator">
            <span class="month-selector" @click=${() => onChangeMonth('prev')}>&lt;&lt;</span>  
            <span>${header}</span>
            <span class="month-selector" @click=${() => onChangeMonth('next')}>&gt;&gt;</span>
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

@customElement('wired-calendar-grid')
export class WiredCalendarGrid extends WiredCard {
    @property({ type: String }) firstdate?: string; // date range lower limit
    @property({ type: String }) lastdate?: string; // date range higher limit
    @property({ type: String }) locale?: string; // BCP 47 language tag like `es-MX`
    @property({ type: Boolean, reflect: true }) disabled = false;
    @property({ type: Boolean, reflect: true }) initials = false; // days of week
    @property({ type: Object }) value: { date?: Date, text: string } = {text: ''};
    
    @property({ type: String })
    get selected():string {
        return this.value.text;
    }

    set selected(value: string) {
        let selectedDate = undefined;
        // we validate the input
        if (!isNaN(Date.parse(value))) {
            selectedDate = new Date(value);
        }
        this.value = {
            date: selectedDate,
            text: value,
        }
    }

    /**
     * Reference Date is used internally to represent currently displayed month.
     * It is in local time.
     */
    private refDate: Date;

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
        const dayCount = daysInMonth(month, year);
        const monthName = localizedMonths(this.locale)[month];
        
        const cells = [...Array(dayCount).keys()].map(i => Cell(i+1, false, this.disabled, this.onSelectDate.bind(this)));
        
        // Display a selected cell if in the current month
        if (this.value.date && this.value.date.getMonth() === month) {
            const selectedDay = this.value.date.getDate();
            cells[selectedDay-1] = Cell(selectedDay, true, this.disabled);
        }

        return Calendar(`${monthName} ${year}`, days, cells, style, this.onChangeMonth.bind(this));
    }

    private onSelectDate(day:number) {
        this.value.date = new Date(this.refDate);
        this.value.date.setDate(day);
        this.performUpdate();
    }

    private onChangeMonth(month: string) {
        if (month === 'prev') {
            this.refDate.setMonth(this.refDate.getMonth() -1)
        } else {
            this.refDate.setMonth(this.refDate.getMonth() +1)
        }
        this.performUpdate();
    }
}

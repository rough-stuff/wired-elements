// TODO: great CSS API
// TODO: datepicker.html + README
// TODO: test full bundle impact
import { customElement, property, TemplateResult, html } from 'lit-element';
import { fire } from 'wired-lib';
import { WiredCard } from 'wired-card';
import './wired-datepicker-grid';
import { WiredDatePickerGrid } from './wired-datepicker-grid';
import './wired-datepicker-indicator';
import { WiredDatePickerIndicator } from './wired-datepicker-indicator';
import { getLocaleFromNavigator, localizedDays, localizedMonths } from './locale.utils';
import { daysInMonth, isDateInMonth } from './date.utils';

/**
 * Handy representation of a date, with both Date and String
 */
type WiredDate = { date?: Date, text: string };

/**
 * Calendar Template, based on CSS grid with 4 main parts:
 * - month-indicators: displays the month and the selectors
 * - day-of-week: days name, from sunday to saturday
 * - date-grid: container for the calendar days
 * - overlay: allow to display a neat wired frame around
 * @param indicator the header and months selectors
 * @param days the days name
 * @param cells the cells to display
 */
const Calendar = (indicator: TemplateResult, days: TemplateResult, grid: TemplateResult) => html`
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
    </style>
    ${indicator}
    ${days}
    ${grid}
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
    }

    /**
     * Attach event listeners to cell selection in the grid.
     * Attach event listeners to month selection in the indicator
     */
    firstUpdated() {
        const grid = this.shadowRoot!.querySelector<WiredDatePickerGrid>('wired-datepicker-grid');
        grid?.addEventListener('cell-selected', ((e: CustomEvent) => {
            this.setSelectedDate(e.detail.day)
        }) as EventListener);

        const indicator = this.shadowRoot!.querySelector<WiredDatePickerIndicator>('wired-datepicker-indicator');
        indicator?.addEventListener('month-selected', ((e: CustomEvent) => {
            if (e.detail.selector === 'prev') {
                this.loadPrevMonth()
            } else {
                this.loadNextMonth();
            }
        }) as EventListener);
    }

    /**
     * Renders the web component calendar for the selected/current month
     */
    render(): TemplateResult {
        const days = this.buildDays();
        const month = this.refDate.getMonth();
        const year = this.refDate.getFullYear();
        const indicator = this.buildIndicator(year, month);
        const grid = this.buildGrid(year, month);
        return Calendar(indicator, days, grid);
    }

    /**
     * Creates the HTML templates for the indicator with month selectors
     * @param year year of the calendar
     * @param month month of the calendar
     */
    private buildIndicator(year: number, month: number): TemplateResult {
        const monthName = localizedMonths(this.locale)[month];
        const header = `${monthName} ${year}`;
        return html`
            <wired-datepicker-indicator
                .header=${header}
                .canGoPrev=${this.canGoPrev()}
                .canGoNext=${this.canGoNext()}
            >
            </wired-datepicker-indicator>
        `;
    }

    /**
     * Creates the HTML Template for the days' names, based on locale
     */
    private buildDays(): TemplateResult {
        const days = localizedDays(this.locale, this.initials ? 'narrow': 'short');
        return html `
            <style>
                .day-of-week {
                    font-weight: bold;
                    text-align: center;
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                }
            </style>
            <div class="day-of-week">
                ${days.map(d => html`<div>${d}</div>`)}
            </div>
        `;
    }

    /**
     * Creates the HTML templates for all the days in the wanted month.
     * @param year year of the calendar
     * @param month month of the calendar
     */
    private buildGrid(year: number, month: number): TemplateResult {
        const dayCount = daysInMonth(month, year);
        const firstDayOfMonthIndex = this.refDate.getDay();
        let minEnabledIndex = 0; // inclusive index
        let maxEnabledIndex = 32; // exclusive index
        let selectedDayIndex = -1;
        const minDate = this._firstdate.date
        const maxDate = this._lastdate.date;
        if (minDate && isDateInMonth(month, year, minDate)) {
            minEnabledIndex = minDate.getDate();
        }
        if (maxDate && isDateInMonth(month, year, maxDate)) {
            maxEnabledIndex = maxDate.getDate();
        }
        if (this.value.date && this.value.date.getMonth() === month) {
            selectedDayIndex = this.value.date.getDate() -1;
        }
        if (this.disabled) {
            // We can disable all grid this way
            minEnabledIndex = dayCount;
        }

        return html`
            <wired-datepicker-grid
                .dayCount=${dayCount}
                .minEnabledIndex=${minEnabledIndex}
                .maxEnabledIndex=${maxEnabledIndex}
                .selectedDayIndex=${selectedDayIndex}
                .gridOffset=${firstDayOfMonthIndex+1}
            ></wired-datepicker-grid>
        `;
    }

    /**
     * Updates selected date with the provided day.
     * @param day day selected in the displayed month
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
}

import { rectangle, line, ellipse } from './wired-lib';
import { randomSeed, fireEvent } from './wired-base';
import { css, TemplateResult, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

interface AreaSize {
  width: number;
  height: number;
}

interface CalendarCell {
  value: string;
  text: string;
  selected: boolean;
  dimmed: boolean;
  disabled?: boolean;
}

// GLOBAL CONSTANTS
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const TABLE_PADDING = 8; // pixels

@customElement('wired-calendar')
export class WiredCalendar extends LitElement {
  @property({ type: Number }) elevation = 3;
  @property({ type: String }) selected?: string; // pre-selected date
  @property({ type: String }) firstdate?: string; // date range lower limit
  @property({ type: String }) lastdate?: string; // date range higher limit
  @property({ type: String }) locale?: string; // BCP 47 language tag like `es-MX`
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) initials = false; // days of week
  @property({ type: Object }) value?: { date: Date, text: string };
  @property({ type: Function }) format: Function = (d: Date) => this.months_short[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();

  // Initial calendar headers (will be replaced if different locale than `en` or `en-US`)
  private weekdays_short: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Fix month shorts for internal value comparations (not changed by locale)
  private months_short: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private resizeHandler?: EventListenerOrEventListenerObject;

  private localeWeekdayOffset: number = 0;     // Days distance from Sunday (when locale first day of week is Monday, offset will change to 1)
  private firstOfMonthDate: Date = new Date(); // Only month and year relevant
  private fDate: Date | undefined = undefined; // Date obj for firstdate string
  private lDate: Date | undefined = undefined; // Date obj for lastdate string

  private calendarRefSize: AreaSize = { width: 0, height: 0 };
  private tblColWidth: number = 0;
  private tblRowHeight: number = 0;
  private tblHeadHeight: number = 0;

  private monthYear: string = '';
  private weeks: CalendarCell[][] = [[]];

  private seed = randomSeed();

  connectedCallback() {
    super.connectedCallback();
    if (!this.resizeHandler) {
      this.resizeHandler = this.debounce(this.resized.bind(this), 200, false, this);
      window.addEventListener('resize', this.resizeHandler, { passive: true });
    }

    // Initial setup (now that `wired-calendar` element is ready in DOM)
    this.localizeCalendarHeaders();
    this.setInitialConditions();
    this.computeCalendar();
    this.refreshSelection();

    setTimeout(() => this.updated());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      delete this.resizeHandler;
    }
  }

  static get styles() {
    return css`
    :host {
      display: inline-block;
      font-family: inherit;
      position: relative;
      outline: none;
      opacity: 0;
    }

    :host(.wired-disabled) {
      opacity: 0.5 !important;
      cursor: default;
      pointer-events: none;
      background: rgba(0, 0, 0, 0.02);
    }

    :host(.wired-rendered) {
      opacity: 1;
    }

    :host(:focus) path {
      stroke-width: 1.5;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    svg {
      display: block;
    }

    .calendar path {
      stroke: var(--wired-calendar-color, black);
      stroke-width: 0.7;
      fill: transparent;
    }

    .selected path {
      stroke: var(--wired-calendar-selected-color, red);
      stroke-width: 2.5;
      fill: transparent;
      transition: transform 0.05s ease;
    }

    table {
      position: relative;
      background: var(--wired-calendar-bg, white);
      border-collapse: collapse;
      font-size: inherit;
      text-transform: capitalize;
      line-height: unset;
      cursor: default;
      overflow: hidden;
    }

    table:focus {
      outline: none !important;
    }

    td,
    th {
      border-radius: 4px;
      text-align: center;
    }

    td.disabled {
      color: var(--wired-calendar-disabled-color, lightgray);
      cursor: not-allowed;
    }

    td.dimmed {
      color: var(--wired-calendar-dimmed-color, gray);
    }

    td.selected {
      position: absolute;
    }

    td:not(.disabled):not(.selected):hover {
      background-color: #d0d0d0;
      cursor: pointer;
    }

    .pointer {
      cursor: pointer;
    }

    `;
  }

  render(): TemplateResult {
    /*
    * Template to render a one month calendar
    *
    * The template consists of one `table` and one overlay `div`.
    * The `table` consiste of two header rows plus one row for each week of the month.
    * The underlaying data is an array of weeks. Each week consist of an array of days.
    * The days are objects with `CalendarCell` interface. Each one is rendered ...
    * ... according with the boolean conditions `disabled` and `selected`.
    * Particulary, a `selected` day is rendered with its own extra overlay ...
    * ... (and svg tag) to draw over it.
    */
    return html`
    <table style="width:${this.calendarRefSize.width}px;height:${this.calendarRefSize.height}px;border:${TABLE_PADDING}px solid transparent"
            @mousedown="${this.onItemClick}"
            @touchstart="${this.onItemClick}">
      ${ /* 1st header row with calendar title and prev/next controls */ ''}
      <tr class="top-header" style="height:${this.tblHeadHeight}px;">
        <th id="prevCal" class="pointer" @click="${this.onPrevClick}">&lt;&lt;</th>
        <th colSpan="5">${this.monthYear}</th>
        <th id="nextCal" class="pointer" @click="${this.onNextClick}">&gt;&gt;</th>
      </tr>
      ${ /* 2nd header row with the seven weekdays names (short or initials) */ ''}
      <tr class="header" style="height:${this.tblHeadHeight}px;">
        ${this.weekdays_short
        .map((d) =>
          html`<th style="width: ${this.tblColWidth};">${this.initials ? d[0] : d}</th>
            `
        )
      }
      </tr>
      ${ /* Loop thru weeks building one row `<tr>` for each week */ ''}
      ${this.weeks
        .map((weekDays: CalendarCell[]) =>
          html`<tr style="height:${this.tblRowHeight}px;">
              ${ /* Loop thru weeekdays in each week building one data cell `<td>` for each day */ ''}
              ${weekDays
              .map((d: CalendarCell) =>

                // This blank space left on purpose for clarity

                html`${d.selected ?
                  // Render "selected" cell
                  html`
                            <td class="selected" value="${d.value}">
                            <div style="width: ${this.tblColWidth}px; line-height:${this.tblRowHeight}px;">${d.text}</div>
                            <div class="overlay">
                              <svg id="svgTD" class="selected"></svg>
                            </div></td>
                        ` :
                  // Render "not selected" cell
                  html`
                            <td .className="${d.disabled ? 'disabled' : (d.dimmed ? 'dimmed' : '')}"
                                value="${d.disabled ? '' : d.value}">${d.text}</td>
                        `}
                    `

                // This blank space left on purpose for clarity

              )
            }${ /* End `weekDays` map loop */ ''}
            </tr>`
        )
      }${ /* End `weeks` map loop */ ''}
    </table>
    <div class="overlay">
      <svg id="svg" class="calendar"></svg>
    </div>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'dialog');
  }

  updated(changed?: PropertyValues) {
    if (changed && changed instanceof Map) {
      if (changed.has('disabled')) this.refreshDisabledState();
      if (changed.has('selected')) this.refreshSelection();
    }

    // Redraw calendar sketchy bounding box
    const svg = (this.shadowRoot!.getElementById('svg') as any) as SVGSVGElement;
    while (svg.hasChildNodes()) {
      svg.removeChild(svg.lastChild!);
    }
    const s: AreaSize = this.getCalendarSize();
    const elev = Math.min(Math.max(1, this.elevation), 5);
    const w = s.width + ((elev - 1) * 2);
    const h = s.height + ((elev - 1) * 2);
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);
    rectangle(svg, 2, 2, s.width - 4, s.height - 4, this.seed);
    for (let i = 1; i < elev; i++) {
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), s.height - 4 + (i * 2), this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
      (line(svg, s.width - 4 + (i * 2), s.height - 4 + (i * 2), s.width - 4 + (i * 2), i * 2, this.seed)).style.opacity = `${(85 - (i * 10)) / 100}`;
    }

    // Redraw sketchy red circle `selected` cell
    const svgTD = (this.shadowRoot!.getElementById('svgTD') as any) as SVGSVGElement;
    if (svgTD) {
      while (svgTD.hasChildNodes()) {
        svgTD.removeChild(svgTD.lastChild!);
      }
      const iw = Math.max(this.tblColWidth * 1.0, 20);
      const ih = Math.max(this.tblRowHeight * 0.9, 18);
      const c = ellipse(svgTD, this.tblColWidth / 2, this.tblRowHeight / 2, iw, ih, this.seed);
      svgTD.appendChild(c);
    }

    this.classList.add('wired-rendered');
  }

  setSelectedDate(formatedDate: string): void {
    // TODO: Validate `formatedDate`
    this.selected = formatedDate;
    if (this.selected) {
      const d = new Date(this.selected);
      this.firstOfMonthDate = new Date(d.getFullYear(), d.getMonth(), 1);
      this.computeCalendar();
      this.requestUpdate();
      this.fireSelected();
    }
  }

  /* private methods */

  /*
  * Change calendar headers according to locale parameter or browser locale
  * Notes:
  *   This only change the rendered text in the calendar
  *   All the internal parsing of string dates do not use locale
  */
  private localizeCalendarHeaders() {
    // Find locale preference when parameter not set
    if (!this.locale) {
      // Guess from different browser possibilities
      const n: any = navigator;
      if (n.hasOwnProperty('systemLanguage')) this.locale = n['systemLanguage'];
      else if (n.hasOwnProperty('browserLanguage')) this.locale = n['browserLanguage'];
      else this.locale = (navigator.languages || ['en'])[0];
    }

    // Replace localized calendar texts when not `en-US` or not `en`
    const l = (this.locale || '').toLowerCase();
    if (l !== 'en-us' && l !== 'en') {
      // Get locale first day of the week (Sunday for most America but Monday for most Europe)
      //
      // Option #1 using Intl.Locale (not supported by all modern browser yet on Feb, 2023)
      // const il = new Intl.Locale(this.locale as string) as any;
      // const localeFirstWeekday = (il.weekInfo?.firstDay || 0) % 7; // default to Sunday
      // End-of-option-#1
      //
      // Option #2 (workaround) using regex and hardcoded data (use this option until Intl.Locale is fully supported)
      const re = /^(?:(en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))$|^((?:[a-z]{2,3}(?:(?:-[a-z]{3}){1,3})?)|[a-z]{4}|[a-z]{5,8})(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[\da-z]{5,8}|\d[\da-z]{3}))*)?((?:-[\da-wy-z](?:-[\da-z]{2,8})+)*)?(-x(?:-[\da-z]{1,8})+)?$|^(x(?:-[\da-z]{1,8})+)$/i;
      const matches = re.exec(this.locale as string) || [,,,,"US"]; // [,,,,"US"] hack to avoid undefined
      const region = matches[5] as string; // element #5 is always the locale region like 'GB', 'CN', 'FR', even 'US'
      const wsr = { // weekday start by region (Sunday = 0, Monday = 1, ...)
        "001":1,"AD":1,"AE":6,"AF":6,"AG":0,"AI":1,"AL":1,"AM":1,"AN":1,"AR":1,"AS":0,"AT":1,"AU":0,"AX":1,"AZ":1,"BA":1,"BD":0,
        "BE":1,"BG":1,"BH":6,"BM":1,"BN":1,"BR":0,"BS":0,"BT":0,"BW":0,"BY":1,"BZ":0,"CA":0,"CH":1,"CL":1,"CM":1,"CN":0,"CO":0,
        "CR":1,"CY":1,"CZ":1,"DE":1,"DJ":6,"DK":1,"DM":0,"DO":0,"DZ":6,"EC":1,"EE":1,"EG":6,"ES":1,"ET":0,"FI":1,"FJ":1,"FO":1,
        "FR":1,"GB":1,"GE":1,"GF":1,"GP":1,"GR":1,"GT":0,"GU":0,"HK":0,"HN":0,"HR":1,"HU":1,"ID":0,"IE":1,"IL":0,"IN":0,"IQ":6,
        "IR":6,"IS":1,"IT":1,"JM":0,"JO":6,"JP":0,"KE":0,"KG":1,"KH":0,"KR":0,"KW":6,"KZ":1,"LA":0,"LB":1,"LI":1,"LK":1,"LT":1,
        "LU":1,"LV":1,"LY":6,"MC":1,"MD":1,"ME":1,"MH":0,"MK":1,"MM":0,"MN":1,"MO":0,"MQ":1,"MT":0,"MV":5,"MX":0,"MY":1,"MZ":0,
        "NI":0,"NL":1,"NO":1,"NP":0,"NZ":1,"OM":6,"PA":0,"PE":0,"PH":0,"PK":0,"PL":1,"PR":0,"PT":0,"PY":0,"QA":6,"RE":1,"RO":1,
        "RS":1,"RU":1,"SA":0,"SD":6,"SE":1,"SG":0,"SI":1,"SK":1,"SM":1,"SV":0,"SY":6,"TH":0,"TJ":1,"TM":1,"TR":1,"TT":0,"TW":0,
        "UA":1,"UM":0,"US":0,"UY":1,"UZ":1,"VA":1,"VE":0,"VI":0,"VN":1,"WS":0,"XK":1,"YE":0,"ZA":0,"ZW":0
      };
      const localeFirstWeekday = wsr[region as keyof typeof wsr];
      // End-of-option-#2

      // Set offset distance from Sunday (Saturday as -1 day and Monday as +1 day)
       if (localeFirstWeekday != 0) {
        const distanceToRight = localeFirstWeekday;
        const distanceTooLeft = (7 - localeFirstWeekday) % 7;
        this.localeWeekdayOffset = distanceTooLeft < distanceToRight ? -1 : +1;
      }
      
      const d = new Date();

      // Compute weekday header texts (like "Sun", "Mon", "Tue", ...)
      const weekDayOffset = d.getUTCDay();
      const daySunday = new Date(d.getTime() - DAY * (weekDayOffset - this.localeWeekdayOffset));
      for (let i = 0; i < 7; i++) {
        const weekdayDate = new Date(daySunday);
        weekdayDate.setDate(daySunday.getDate() + i);
        this.weekdays_short[i] = weekdayDate.toLocaleString(this.locale, { weekday: 'short' });
      }

      // Compute month header texts (like "January", "February", ...)
      d.setDate(1); // Set to first of the month to avoid cases like "February 30"
      for (let m = 0; m < 12; m++) {
        d.setMonth(m);
        this.months[m] = d.toLocaleString(this.locale, { month: 'long' });
        // Beware: month shorts are used in `en-US` internally. Do not change.
        // this.months_short[m] = d.toLocaleString(this.locale, {month: 'short'});
      }
    }
  }

  private setInitialConditions() {
    // Initialize calendar element size
    this.calendarRefSize = this.getCalendarSize();

    // Define an initial reference date either from a paramenter or new today date
    let d: Date;
    // TODO: Validate `this.selected`
    if (this.selected) {
      // TODO: Validate `this.selected`
      d = new Date(this.selected);
      this.value = { date: new Date(this.selected), text: this.selected };
    } else {
      d = new Date();
    }
    // Define a reference date used to build one month calendar
    this.firstOfMonthDate = new Date(d.getFullYear(), d.getMonth(), 1);

    // Convert string paramenters (when present) to Date objects
    // TODO: Validate `this.firstdate`
    if (this.firstdate) this.fDate = new Date(this.firstdate);
    // TODO: Validate `this.lastdate`
    if (this.lastdate) this.lDate = new Date(this.lastdate);
  }

  private refreshSelection() {
    // Loop thru all weeks and thru all day in each week
    this.weeks.forEach((week: CalendarCell[]) =>
      week.forEach((day: CalendarCell) => {
        // Set calendar day `selected` according to user's `this.selected`
        day.selected = this.selected && (day.value === this.selected) || false;
      })
    );
    this.requestUpdate();
  }

  private resized(): void {
    // Reinitialize calendar element size
    this.calendarRefSize = this.getCalendarSize();
    this.computeCalendar();
    this.refreshSelection();
  }

  private getCalendarSize(): AreaSize {
    const limits = this.getBoundingClientRect();
    return {
      width: limits.width > 180 ? limits.width : 320,
      height: limits.height > 180 ? limits.height : 320
    };
  }

  private computeCellsizes(size: AreaSize, rows: number): void {
    const numerOfHeaderRows = 2;
    const headerRealStateProportion = 0.25; // 1 equals 100%
    const borderSpacing = 2; // See browser's table {border-spacing: 2px;}
    this.tblColWidth = (size.width / 7) - borderSpacing; // A week has 7 days
    this.tblHeadHeight =
      (size.height * headerRealStateProportion / numerOfHeaderRows) - borderSpacing;
    this.tblRowHeight =
      (size.height * (1 - headerRealStateProportion) / rows) - borderSpacing;
  }

  private refreshDisabledState() {
    if (this.disabled) {
      this.classList.add('wired-disabled');
    } else {
      this.classList.remove('wired-disabled');
    }
    this.tabIndex = this.disabled ? -1 : +(this.getAttribute('tabindex') || 0);
  }

  private onItemClick(event: CustomEvent) {
    event.stopPropagation();
    const sel = event.target as HTMLElement;
    // Attribute 'value' empty means: is a disabled date (should not be 'selected')
    if (sel && sel.hasAttribute('value') && sel.getAttribute('value') !== '') {
      this.selected = sel.getAttribute('value') || undefined;
      this.refreshSelection();
      this.fireSelected();
    }
  }

  private fireSelected() {
    if (this.selected) {
      this.value = { date: new Date(this.selected), text: this.selected };
      fireEvent(this, 'selected', { selected: this.selected });
    }
  }

  private computeCalendar(): void {
    // Compute month and year for table header
    this.monthYear = this.months[this.firstOfMonthDate.getMonth()] + ' ' + this.firstOfMonthDate.getFullYear();

    // Compute all month dates (one per day, 7 days per week, all weeks of the month)
    const first_day_in_month = new Date(this.firstOfMonthDate.getFullYear(), this.firstOfMonthDate.getMonth(), 1);
    // Initialize offset (negative because calendar commonly starts few days before the first of the month)
    let dayInMonthOffset = 0 - first_day_in_month.getDay();
    const amountOfWeeks = Math.ceil((new Date(this.firstOfMonthDate.getFullYear(), this.firstOfMonthDate.getMonth() + 1, 0).getDate() - dayInMonthOffset) / 7);
    this.weeks = []; // Clear previous weeks
    for (let weekIndex = 0; weekIndex < amountOfWeeks; weekIndex++) {
      this.weeks[weekIndex] = [];
      for (let dayOfWeekIndex = 0; dayOfWeekIndex < 7; dayOfWeekIndex++) {
        // Compute day date (using an incrementing offset)
        const day = new Date(first_day_in_month.getTime() + DAY * (dayInMonthOffset + this.localeWeekdayOffset));

        const formatedDate: string = this.format(day);

        this.weeks[weekIndex][dayOfWeekIndex] = {
          value: formatedDate,
          text: day.getDate().toString(),
          selected: formatedDate === this.selected,
          dimmed: day.getMonth() !== first_day_in_month.getMonth(),
          disabled: this.isDateOutOfRange(day)
        };
        // Increment offset (advance one day in calendar)
        dayInMonthOffset++;
      }
    }

    // Compute row and column sizes
    this.computeCellsizes(this.calendarRefSize, amountOfWeeks);
  }

  private onPrevClick(): void {
    // Is there a preious month limit due to `firstdate`?
    if (this.fDate === undefined ||
      new Date(this.fDate.getFullYear(), this.fDate.getMonth() - 1, 1).getMonth() !==
      new Date(this.firstOfMonthDate.getFullYear(), this.firstOfMonthDate.getMonth() - 1, 1).getMonth()) {
      // No limit found, so update `firstOfMonthDate` to first of the previous month
      this.firstOfMonthDate = new Date(this.firstOfMonthDate.getFullYear(), this.firstOfMonthDate.getMonth() - 1, 1);
      this.computeCalendar();
      this.refreshSelection();
    }
  }

  private onNextClick(): void {
    // Is there a next month limit due to `lastdate`?
    if (this.lDate === undefined ||
      new Date(this.lDate.getFullYear(), this.lDate.getMonth() + 1, 1).getMonth() !==
      new Date(this.firstOfMonthDate.getFullYear(), this.firstOfMonthDate.getMonth() + 1, 1).getMonth()) {
      // No limit found, so update `firstOfMonthDate` to first of the next month
      this.firstOfMonthDate = new Date(this.firstOfMonthDate.getFullYear(), this.firstOfMonthDate.getMonth() + 1, 1);
      this.computeCalendar();
      this.refreshSelection();
    }
  }

  private isDateOutOfRange(day: Date): boolean {
    if (this.fDate && this.lDate) {
      return day < this.fDate || this.lDate < day;
    } else if (this.fDate) {
      return day < this.fDate;
    } else if (this.lDate) {
      return this.lDate < day;
    }
    return false;
  }

  /* Util */

  private debounce(func: Function, wait: number, immediate: boolean, context: HTMLElement): EventListenerOrEventListenerObject {
    let timeout = 0;
    return () => {
      const args = arguments;
      const later = () => {
        timeout = 0;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

}

import { html, fixture, expect, oneEvent, elementUpdated, assert } from '@open-wc/testing';
import { WiredDatePicker } from '../lib/wired-datepicker';

/**
 * @typedef {import('../lib/wired-datepicker.js').WiredDatePicker} WiredDatePicker
 */

describe('WiredDatePicker - disabled', () => {
    it('should reflect disabled attribute to property', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker disabled></wired-datepicker>
        `);

        expect(el.disabled).to.be.true;
    });

    it('should reflect disabled property to attribute', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker></wired-datepicker>
        `);

        el.disabled = true;
        await elementUpdated(el);

        expect(el).to.have.attribute("disabled");
    });

    it('should disable all cells if disabled attribute is given', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker disabled></wired-datepicker>
        `);
        const days = el.shadowRoot.querySelectorAll('wired-datepicker-cell');

        for (let i = 0; i < days.length; i++) {
            expect(days[i].disabled).to.be.true;
        }
    });
});

describe('WiredDatePicker - locale / render', () => {
    it('should reflect locale property to attribute', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Apr 15 2020"></wired-datepicker>
        `);
        el.locale = 'fr-FR';

        await elementUpdated(el);

        expect(el).to.have.attribute("locale", "fr-FR");
    });

    it('should render month of selected date in fr-FR', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Jan 15 2020" locale="fr-FR"></wired-datepicker>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator" tabindex="0">
                    <span class="month-selector-active">
                    <<
                    </span>
                    <span>janvier 2020</span>
                    <span class="month-selector-active">
                    >>
                    </span>
                </div>
                <div class="day-of-week">
                    <div>dim.</div>
                    <div>lun.</div>
                    <div>mar.</div>
                    <div>mer.</div>
                    <div>jeu.</div>
                    <div>ven.</div>
                    <div>sam.</div>
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-datepicker-grid']});
    });

    it('should render month of selected date in en-US', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Feb 29 2020" locale="en-US"></wired-datepicker>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator" tabindex="0">
                    <span class="month-selector-active">
                    <<
                    </span>
                    <span>February 2020</span>
                    <span class="month-selector-active">
                    >>
                    </span>
                </div>
                <div class="day-of-week">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-datepicker-grid']});
    });

    it('should display short week day name if initials attribute is set', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker initials selected="May 4 2020" locale="en-US"></wired-datepicker>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator" tabindex="0">
                    <span class="month-selector-active">
                    <<
                    </span>
                    <span>May 2020</span>
                    <span class="month-selector-active">
                    >>
                    </span>
                </div>
                <div class="day-of-week">
                    <div>S</div>
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-datepicker-grid']});
    });

    it('should update calendar when locale property is set', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Apr 15 2020" locale="en-US"></wired-datepicker>
        `);

        let header = el.shadowRoot.querySelectorAll('.month-indicator > span');
        expect(header[1]).dom.to.equal(`<span>April 2020</span>`);

        el.locale = 'fr-FR';
        await elementUpdated(el);
        header = el.shadowRoot.querySelectorAll('.month-indicator > span');
        expect(header[1]).dom.to.equal(`<span>avril 2020</span>`);
    });

    it('should expose value as a readonly property', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker></wired-datepicker>
            `);
        try {
            el.value = 'toto';
            assert.fail();
        } catch(e) {
            assert.isTrue(true);
        }
    });
});

describe('WiredDatePicker - selected date', () => {
    it('should update selected date when set programmatically', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Jan 1 2020" locale="en-US"></wired-datepicker>
            `);
        let grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        expect(grid.selectedDayIndex).to.equal(0);
        
        el.selected = "Jan 31 2020";
        await elementUpdated(el);
        
        grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        expect(grid.selectedDayIndex).to.equal(30);
    });

    it('should accept YYYY-MM-DD date format', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="2020-01-28" locale="en-US"></wired-datepicker>
            `);
        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        expect(grid.selectedDayIndex).to.equal(27);
    });

    it('should accept YYYY-MM date format', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="2020-12" locale="en-US"></wired-datepicker>
            `);
        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        const header = el.shadowRoot.querySelectorAll('.month-indicator > span');
        expect(header[1]).dom.to.equal(`<span>December 2020</span>`);
        expect(grid.selectedDayIndex).to.equal(0);
    });

    it('should accept YYYY date format', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="2020" locale="en-US"></wired-datepicker>
            `);
        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        const header = el.shadowRoot.querySelectorAll('.month-indicator > span');
        expect(header[1]).dom.to.equal(`<span>January 2020</span>`);
        expect(grid.selectedDayIndex).to.equal(0);
    });

});

describe('WiredDatePicker - first date', () => {
    it('should update first date when set programmatically', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Jan 15 2020" locale="en-US"></wired-datepicker>
            `);
        el.firstdate = "Jan 3 2020";
        
        await elementUpdated(el);
        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        expect(grid.minEnabledIndex).to.equal(3);
    });

    it('should disable previous month selector when set programmatically', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Jan 15 2020" locale="en-US"></wired-datepicker>
            `);
        el.firstdate = "Jan 3 2020";
        
        await elementUpdated(el);
        const prevMonthSelector = el.shadowRoot.querySelector('.month-indicator > span');
        expect(prevMonthSelector).to.have.class('month-selector-disabled');
    });
});

describe('WiredDatePicker - last date', () => {
    it('should update last date when set programmatically', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Jan 15 2020" locale="en-US"></wired-datepicker>
            `);
        el.lastdate = "Jan 20 2020";
        
        await elementUpdated(el);

        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');
        expect(grid.maxEnabledIndex).to.equal(20);
    });

    it('should disable next month selector when set programmatically', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Jan 15 2020" locale="en-US"></wired-datepicker>
            `);
        el.lastdate = "Jan 20 2020";
        
        await elementUpdated(el);
        const nextMonthSelector = el.shadowRoot.querySelectorAll('.month-indicator > span')[2];
        expect(nextMonthSelector).to.have.class('month-selector-disabled');
    });
});

describe('WiredDatePicker - events', () => {
    it('should dispatch selected event when property selected is set', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`<wired-datepicker></wired-datepicker>`);
        setTimeout(() => el.selected = 'Apr 15 2020');
        const ev = await oneEvent(el, 'selected');

        expect(ev).to.exist;
        expect(ev.detail.selected.text).to.eql('Apr 15 2020');
        const expectedDate = new Date('Apr 15 2020');
        expect(ev.detail.selected.date).to.eql(expectedDate);
    });

    it('should dispatch attr-error event when incorrect selected property is set', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`<wired-datepicker></wired-datepicker>`);
        setTimeout(() => el.selected = 'yolo');
        const ev = await oneEvent(el, 'attr-error');
        expect(ev.detail.msg).to.eql(`Invalid 'selected' value 'yolo'`);
    });

    it('should dispatch attr-error event when incorrect firstdate property is set', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`<wired-datepicker></wired-datepicker>`);
        setTimeout(() => el.firstdate = 'yolo');
        const ev = await oneEvent(el, 'attr-error');
        expect(ev.detail.msg).to.eql(`Invalid 'firstdate' value 'yolo'`);
    });

    it('should dispatch attr-error event when incorrect lastdate property is set', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`<wired-datepicker></wired-datepicker>`);
        setTimeout(() => el.lastdate = 'yolo');
        const ev = await oneEvent(el, 'attr-error');
        expect(ev.detail.msg).to.eql(`Invalid 'lastdate' value 'yolo'`);
    });
});

describe('WiredDatePicker - Month selector', () => {
    it('should disable next month selector  if lastDate is current month', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Mar 1 2020" lastdate="Mar 31 2020" locale="de-DE"></wired-datepicker>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator" tabindex="0">
                    <span class="month-selector-active">
                    <<
                    </span>
                    <span>März 2020</span>
                    <span class="month-selector-disabled">
                    >>
                    </span>
                </div>
                <div class="day-of-week">
                    <div>So</div>
                    <div>Mo</div>
                    <div>Di</div>
                    <div>Mi</div>
                    <div>Do</div>
                    <div>Fr</div>
                    <div>Sa</div>
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-datepicker-grid']});
    });

    it('should disable last month selector if firstDate is in current month', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="Apr 4 2020" firstdate="Apr 1 2020" locale="en-US"></wired-datepicker>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator" tabindex="0">
                    <span class="month-selector-disabled">
                    <<
                    </span>
                    <span>April 2020</span>
                    <span class="month-selector-active">
                    >>
                    </span>
                </div>
                <div class="day-of-week">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-datepicker-grid']});
    });

    it('should display previous month if previous month selector is clicked', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="July 18 2020" initials locale="en-US"></wired-datepicker>
        `);
        const sel = el.shadowRoot.querySelector('.month-selector-active');
        sel.click();
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(`
        <div class="calendar">
            <div class="month-indicator" tabindex="0">
                <span class="month-selector-active">
                <<
                </span>
                <span>June 2020</span>
                <span class="month-selector-active">
                >>
                </span>
            </div>
            <div class="day-of-week">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
            </div>
        </div>
        <div id="overlay"></div>
    `, {ignoreTags: ['wired-datepicker-grid']});
    });

    it('should display next month if next month selector is clicked', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="July 18 2020" initials locale="en-US"></wired-datepicker>
        `);
        const sel = el.shadowRoot.querySelectorAll('.month-selector-active');
        sel[1].click();
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(`
        <div class="calendar">
            <div class="month-indicator" tabindex="0">
                <span class="month-selector-active">
                <<
                </span>
                <span>August 2020</span>
                <span class="month-selector-active">
                >>
                </span>
            </div>
            <div class="day-of-week">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
            </div>
        </div>
        <div id="overlay"></div>
    `, {ignoreTags: ['wired-datepicker-grid']});
    });
});

describe('WiredDatePicker - Cells', () => {
    it('should display correct number of days of the month', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="September 18 2020"></wired-datepicker>
        `);
        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');

        expect(grid.dayCount).to.equal(30);
    });

    it('should display the correct selected cell if selected attribute is given', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="October 24 2020"></wired-datepicker>
        `);
        const grid = el.shadowRoot.querySelector('wired-datepicker-grid');

        expect(grid.selectedDayIndex).to.equal(23);
    });

    it('should change value when cell is selected', async () => {
        const el = /** @type {WiredDatePicker} */ await fixture(html`
            <wired-datepicker selected="November 12 2020"></wired-datepicker>
        `);
        let grid = el.shadowRoot.querySelector('wired-datepicker-grid');

        expect(grid.selectedDayIndex).to.equal(11);
        grid.dispatchEvent(new CustomEvent('cell-selected', {
            bubbles: true,
            composed: true,
            detail: {day: 29},
          }));
        await elementUpdated(el);
        grid = el.shadowRoot.querySelector('wired-datepicker-grid');

        expect(grid.selectedDayIndex).to.equal(28);
    });

});

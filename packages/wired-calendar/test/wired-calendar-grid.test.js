import { html, fixture, expect, oneEvent, elementUpdated, assert } from '@open-wc/testing';
import { WiredCalendarGrid } from '../lib/wired-calendar-grid';

/**
 * @typedef {import('../lib/wired-calendar-grid.js').WiredCalendarGrid} WiredCalendarGrid
 */

describe('WiredCalendarGrid', () => {
    it('should reflect disabled attribute to property', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid disabled></wired-calendar-grid>
        `);

        expect(el.disabled).to.be.true;
    });

    it('should reflect local property to attribute', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="Apr 15 2020"></wired-calendar-grid>
        `);
        el.locale = 'fr-FR';

        await elementUpdated(el);

        expect(el).to.have.attribute("locale", "fr-FR");
    });

    it('should reflect disabled property to attribute', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid></wired-calendar-grid>
        `);

        el.disabled = true;
        await elementUpdated(el);

        expect(el).to.have.attribute("disabled");
    });

    it('should dispatch selected event when property selected is set', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`<wired-calendar-grid></wired-calendar-grid>`);
        setTimeout(() => el.selected = 'Apr 15 2020');
        const ev = await oneEvent(el, 'selected');

        expect(ev).to.exist;
        expect(ev.detail.selected.text).to.eql('Apr 15 2020');
        const expectedDate = new Date('Apr 15 2020');
        expect(ev.detail.selected.date).to.eql(expectedDate);
    });

    it('should dispatch attr-error event when incorrect selected property is set', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`<wired-calendar-grid></wired-calendar-grid>`);
        setTimeout(() => el.selected = 'yolo');
        const ev = await oneEvent(el, 'attr-error');
        expect(ev.detail.msg).to.eql(`Invalid 'selected' value 'yolo'`);
    });

    it('should dispatch attr-error event when incorrect firstdate property is set', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`<wired-calendar-grid></wired-calendar-grid>`);
        setTimeout(() => el.firstdate = 'yolo');
        const ev = await oneEvent(el, 'attr-error');
        expect(ev.detail.msg).to.eql(`Invalid 'firstdate' value 'yolo'`);
    });

    it('should dispatch attr-error event when incorrect lastdate property is set', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`<wired-calendar-grid></wired-calendar-grid>`);
        setTimeout(() => el.lastdate = 'yolo');
        const ev = await oneEvent(el, 'attr-error');
        expect(ev.detail.msg).to.eql(`Invalid 'lastdate' value 'yolo'`);
    });

    it('should render month of selected date in fr-FR', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="Jan 15 2020" locale="fr-FR"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
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
                <div class="date-grid">
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should render month of selected date in en-US', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="Feb 29 2020" locale="en-US"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
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
                <div class="date-grid">
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should disable next month selector  if lastDate is current month', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="Mar 1 2020" lastdate="Mar 31 2020" locale="de-DE"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
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
                <div class="date-grid">
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should disable last month selector if firstDate is in current month', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="Apr 4 2020" firstdate="Apr 1 2020" locale="en-US"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
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
                <div class="date-grid">
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should display short week day name if initials attribute is set', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid initials selected="May 4 2020" locale="en-US"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
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
                <div class="date-grid">
                </div>
            </div>
            <div id="overlay"></div>
        `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should expose value as a readonly property', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid></wired-calendar-grid>
            `);
        try {
            el.value = 'toto';
            assert.fail();
        } catch(e) {
            assert.isTrue(true);
        }
    });

    it('should display previous month if previous month selector is clicked', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="July 18 2020" initials locale="en-US"></wired-calendar-grid>
        `);
        const sel = el.shadowRoot.querySelector('.month-selector-active');
        sel.click();
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(`
        <div class="calendar">
            <div class="month-indicator">
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
            <div class="date-grid">
            </div>
        </div>
        <div id="overlay"></div>
    `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should display next month if next month selector is clicked', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="July 18 2020" initials locale="en-US"></wired-calendar-grid>
        `);
        const sel = el.shadowRoot.querySelectorAll('.month-selector-active');
        sel[1].click();
        await elementUpdated(el);
        expect(el).shadowDom.to.equal(`
        <div class="calendar">
            <div class="month-indicator">
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
            <div class="date-grid">
            </div>
        </div>
        <div id="overlay"></div>
    `, {ignoreTags: ['wired-calendar-cell']});
    });

    it('should display all days of the month', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="September 18 2020"></wired-calendar-grid>
        `);
        const days = el.shadowRoot.querySelectorAll('wired-calendar-cell');

        expect(days.length).to.equal(30);

        for (let i = 0; i < days.length; i++) {
            expect(days[i]).lightDom.to.equal(`${i+1}`);
        }
    });

    it('should display the correct selected cell if selected attribute is given', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="October 24 2020"></wired-calendar-grid>
        `);
        const days = el.shadowRoot.querySelectorAll('wired-calendar-cell');

        expect(days[23].selected).to.be.true;
    });

});

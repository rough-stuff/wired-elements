import { html, fixture, expect, oneEvent, elementUpdated } from '@open-wc/testing';
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

    it('should render month of selected date in fr-FR', async () => {
        const el = /** @type {WiredCalendarGrid} */ await fixture(html`
            <wired-calendar-grid selected="Apr 15 2020" locale="fr-FR"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
                    <span class="month-selector-disabled">
                    <<
                    </span>
                    <span>avril 2020</span>
                    <span class="month-selector-disabled">
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
            <wired-calendar-grid selected="Mar 1 2020" locale="en-US"></wired-calendar-grid>
            `);
        expect(el).shadowDom.to.equal(`
            <div class="calendar">
                <div class="month-indicator">
                    <span class="month-selector-disabled">
                    <<
                    </span>
                    <span>March 2020</span>
                    <span class="month-selector-disabled">
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

});

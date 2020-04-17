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
        console.log(el);
        setTimeout(() => el.selected = 'Apr 15 2020');
        const ev = await oneEvent(el, 'selected');

        expect(ev).to.exist;
        expect(ev.detail.selected.text).to.eql('Apr 15 2020');
        const expectedDate = new Date('Apr 15 2020');
        expect(ev.detail.selected.date).to.eql(expectedDate);
    });

});

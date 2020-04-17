import { html, fixture, expect } from '@open-wc/testing';

import '../lib/wired-calendar-cell';

/**
 * @typedef {import('../lib/wired-calendar-cell.js').WiredCalendarCell} WiredCalendarCell
 */

describe('WiredCalendarCell', () => {
  it('has attributes selected and disabled reflected by property', async () => {
    const el = /** @type {WiredCalendarCell} */ await fixture(html`
      <wired-calendar-cell
        selected
        disabled
        >
    </wired-calendar-cell>
    `);

    expect(el.selected).to.be.true;
    expect(el.disabled).to.be.true;
  });

  it('has the provided number as light-dom', async () => {
    const el = /** @type {WiredCalendarCell} */ await fixture(html`
      <wired-calendar-cell>7</wired-calendar-cell>
    `);

    expect(el).lightDom.to.equal(`7`);
  });

  it('has to add selected class when selected property is set to true', async () => {
    const el = /** @type {WiredCalendarCell} */ await fixture(html`
      <wired-calendar-cell></wired-calendar-cell>
    `);
    el.selected = true;

    expect(el).to.have.class("selected");
  });

  it('has to add disabled class when disabled property is set to true', async () => {
    const el = /** @type {WiredCalendarCell} */ await fixture(html`
      <wired-calendar-cell></wired-calendar-cell>
    `);
    el.disabled = true;

    expect(el).to.have.class("disabled");
  });

  it('has to remove disabled class when disabled property is set to false', async () => {
    const el = /** @type {WiredCalendarCell} */ await fixture(html`
      <wired-calendar-cell class="disabled"></wired-calendar-cell>
    `);
    el.disabled = false;

    expect(el).to.not.have.class("disabled");
  });

  it('has to remove disabled class when disabled property is set to false', async () => {
    const el = /** @type {WiredCalendarCell} */ await fixture(html`
      <wired-calendar-cell class="selected"></wired-calendar-cell>
    `);
    el.selected = false;

    expect(el).to.not.have.class("selected");
  });
});

import { html, fixture, expect } from '@open-wc/testing';

import '../lib/wired-datepicker-cell';

/**
 * @typedef {import('../lib/wired-datepicker-cell.js').WiredDatePickerCell} WiredDatePickerCell
 */

describe('WiredDatePickerCell', () => {
  it('has attributes selected and disabled reflected by property', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell
        selected
        disabled
        >
    </wired-datepicker-cell>
    `);

    expect(el.selected).to.be.true;
    expect(el.disabled).to.be.true;
  });

  it('has the provided number as light-dom', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell>7</wired-datepicker-cell>
    `);

    expect(el).lightDom.to.equal(`7`);
  });

  it('has to add selected class when selected property is set to true', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell></wired-datepicker-cell>
    `);
    el.selected = true;

    expect(el).to.have.class("selected");
  });

  it('has to add disabled class when disabled property is set to true', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell></wired-datepicker-cell>
    `);
    el.disabled = true;

    expect(el).to.have.class("disabled");
  });

  it('has to remove disabled class when disabled property is set to false', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell class="disabled"></wired-datepicker-cell>
    `);
    el.disabled = false;

    expect(el).to.not.have.class("disabled");
  });

  it('has to remove selected class when selected property is set to false', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell class="selected"></wired-datepicker-cell>
    `);
    el.selected = false;

    expect(el).to.not.have.class("selected");
  });
});

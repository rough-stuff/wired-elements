import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

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
    await elementUpdated(el);
    const root = el.shadowRoot.querySelector('div');
    expect(root).to.have.class("selected");
  });

  it('has to add disabled class when disabled property is set to true', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell></wired-datepicker-cell>
    `);
    el.disabled = true;
    await elementUpdated(el);
    const root = el.shadowRoot.querySelector('div');
    expect(root).to.have.class("disabled");
  });

  it('has to remove disabled class when disabled property is set to false', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell
        .disabled=${true}
      ></wired-datepicker-cell>
    `);
    let root = el.shadowRoot.querySelector('div');
    expect(root).to.have.class("disabled");
    el.disabled = false;
    await elementUpdated(el);
    root = el.shadowRoot.querySelector('div');
    expect(root).to.not.have.class("disabled");
  });

  it('has to remove selected class when selected property is set to false', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell
        .selected=${true}
      ></wired-datepicker-cell>
    `);
    let root = el.shadowRoot.querySelector('div');
    expect(root).to.have.class("selected");
    el.selected = false;
    await elementUpdated(el);
    root = el.shadowRoot.querySelector('div');
    expect(root).to.not.have.class("selected");
  });

  it('should not toggle focus when disabled', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell
        .disabled=${true}
      ></wired-datepicker-cell>
    `);
    el.focus();
    expect(el.hasFocus).to.be.false;
  });

  it('should toggle focus to true on focus if not disabled', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell></wired-datepicker-cell>
    `);
    el.focus();
    await elementUpdated(el);
    expect(el.hasFocus).to.be.true;
  });

  it('should toggle focus to false on blur if not disabled', async () => {
    const el = /** @type {WiredDatePickerCell} */ await fixture(html`
      <wired-datepicker-cell
      ></wired-datepicker-cell>
    `);
    el.focus();
    await elementUpdated(el);
    expect(el.hasFocus).to.be.true;
    el.blur();
    await elementUpdated(el);
    expect(el.hasFocus).to.be.false;
  });
});

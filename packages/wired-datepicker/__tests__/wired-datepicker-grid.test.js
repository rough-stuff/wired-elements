import { html, fixture, expect, elementUpdated, oneEvent } from '@open-wc/testing';

import '../lib/wired-datepicker-grid';

/**
 * @typedef {import('../lib/wired-datepicker-grid.js').WiredDatePickerGrid} WiredDatePickerGrid
 */

describe('WiredDatePickerGrid', () => {
  it('should display a grid', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid></wired-datepicker-grid>
    `);
    expect(el).shadowDom.to.equal(`<div id="grid"></div>`)
  });

  it('should display the right number of cells', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="3"
      >
      </wired-datepicker-grid>
    `);
    const cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells.length).to.equal(3);
  });

  it('should update the number of cells when dayCount changes', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
      >
      </wired-datepicker-grid>
    `);
    let cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells.length).to.equal(0);

    el.dayCount = 4;
    await elementUpdated(el);

    cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells.length).to.equal(4);
  });

  it('should dispatch cell-selected event when cell is clicked', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="2"
      >
      </wired-datepicker-grid>
    `);
    const cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    
    setTimeout(() => cells[0].click());
    let ev = await oneEvent(el, 'cell-selected');
    expect(ev).to.exist;
    expect(ev.detail.day).to.equal(1);

    setTimeout(() => cells[1].click());
    let ev2 = await oneEvent(el, 'cell-selected');
    expect(ev2).to.exist;
    expect(ev2.detail.day).to.equal(2);
  });

  it('should disable some cells if minEnabledIndex is > 0', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="3"
        minEnabledIndex="2"
      >
      </wired-datepicker-grid>
    `);
    let cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells[0].disabled).to.be.true;
    expect(cells[1].disabled).to.be.true;
    expect(cells[2].disabled).to.be.false;
  });

  it('should disable some cells if maxEnabledIndex is < daycount', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="3"
        maxEnabledIndex="2"
      >
      </wired-datepicker-grid>
    `);
    let cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells[0].disabled).to.be.false;
    expect(cells[1].disabled).to.be.false;
    expect(cells[2].disabled).to.be.true;
  });

  it('should disable no cells if maxEnabledIndex is >= daycount', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="3"
        maxEnabledIndex="3"
      >
      </wired-datepicker-grid>
    `);
    let cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells[0].disabled).to.be.false;
    expect(cells[1].disabled).to.be.false;
    expect(cells[2].disabled).to.be.false;
  });

  it('should disable all cells if maxEnabledIndex is = -1', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="3"
        maxEnabledIndex="-1"
      >
      </wired-datepicker-grid>
    `);
    let cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells[0].disabled).to.be.true;
    expect(cells[1].disabled).to.be.true;
    expect(cells[2].disabled).to.be.true;
  });

  it('should disable all cells if minEnabledIndex is >= dayCount', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="3"
        minEnabledIndex="3"
      >
      </wired-datepicker-grid>
    `);
    let cells = el.shadowRoot.querySelectorAll('wired-datepicker-cell');
    expect(cells[0].disabled).to.be.true;
    expect(cells[1].disabled).to.be.true;
    expect(cells[2].disabled).to.be.true;
  });
});

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

describe('WiredDatePickerGrid - Keyboard', () => {
  const VK_ENTER = 13;
  const VK_SPACE = 32;
  const VK_END   = 35;
  const VK_HOME  = 36;
  const VK_LEFT  = 37;
  const VK_RIGHT = 39;
  const VK_UP    = 38;
  const VK_DOWN  = 40;
  const leftEvent = new KeyboardEvent('keydown', { keyCode: VK_LEFT });
  const rightEvent = new KeyboardEvent('keydown', { keyCode: VK_RIGHT });
  const upEvent = new KeyboardEvent('keydown', { keyCode: VK_UP });
  const downEvent = new KeyboardEvent('keydown', { keyCode: VK_DOWN });
  const enterEvent = new KeyboardEvent('keydown', { keyCode: VK_ENTER });
  const spaceEvent = new KeyboardEvent('keydown', { keyCode: VK_SPACE });

  it('should respond to right arrow and space keyboard event', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="10"
      ></wired-datepicker-grid>
    `);

    el.focus();
    el.dispatchEvent(rightEvent);
    setTimeout(() => el.dispatchEvent(spaceEvent));

    const ev = await oneEvent(el, 'cell-selected');

    expect(ev).to.exist;
    expect(ev.detail.day).to.equal(2);
  });

  it('should respect Konami', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="10"
      ></wired-datepicker-grid>
    `);

    el.focus();
    el.dispatchEvent(upEvent);
    el.dispatchEvent(upEvent);
    el.dispatchEvent(downEvent);
    el.dispatchEvent(downEvent);
    el.dispatchEvent(leftEvent);
    el.dispatchEvent(rightEvent);
    el.dispatchEvent(leftEvent);
    el.dispatchEvent(rightEvent);
    el.dispatchEvent(new KeyboardEvent('keydown', {keyCode:65}))
    el.dispatchEvent(new KeyboardEvent('keydown', {keyCode:66}))
    setTimeout(() => el.dispatchEvent(enterEvent));

    const ev = await oneEvent(el, 'cell-selected');

    expect(ev).to.exist;
    expect(ev.detail.day).to.equal(8);
  });

  it('should respond to left arrow and enter keyboard event', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="10"
      ></wired-datepicker-grid>
    `);

    el.focus();
    el.dispatchEvent(rightEvent);
    el.dispatchEvent(rightEvent);
    el.dispatchEvent(rightEvent);
    el.dispatchEvent(rightEvent);
    el.dispatchEvent(leftEvent);
    setTimeout(() => el.dispatchEvent(enterEvent));

    const ev = await oneEvent(el, 'cell-selected');

    expect(ev).to.exist;
    expect(ev.detail.day).to.equal(4);
  });

  it('should respond to down and up arrow keyboard event', async () => {
    const el = /** @type {WiredDatePickerGrid} */ await fixture(html`
      <wired-datepicker-grid
        dayCount="10"
      ></wired-datepicker-grid>
    `);

    el.focus();
    el.dispatchEvent(downEvent);
    setTimeout(() => el.dispatchEvent(enterEvent));
    const ev = await oneEvent(el, 'cell-selected');
    expect(ev).to.exist;
    expect(ev.detail.day).to.equal(8);

    el.dispatchEvent(upEvent);
    setTimeout(() => el.dispatchEvent(enterEvent));
    const ev2 = await oneEvent(el, 'cell-selected');
    expect(ev2).to.exist;
    expect(ev2.detail.day).to.equal(1);
  });
});

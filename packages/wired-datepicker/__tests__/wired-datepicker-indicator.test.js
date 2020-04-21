import { html, fixture, expect, elementUpdated, oneEvent } from '@open-wc/testing';

import '../lib/wired-datepicker-indicator';

/**
 * @typedef {import('../lib/wired-datepicker-indicator.js').WiredDatePickerIndicator} WiredDatePickerIndicator
 */

describe('WiredDatePickerIndicator - Properties', () => {
  it('should display three spans', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator></wired-datepicker-indicator>
    `);
    expect(el).shadowDom.to.equal(`
     <span class="month-selector-active">
        <<
      </span>
      <span>
      </span>
      <span class="month-selector-active">
        >>
      </span>
    `);
  });

  it('should display header', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator
        header="yolo"
      >
      </wired-datepicker-indicator>
    `);
    expect(el).shadowDom.to.equal(`
      <span class="month-selector-active">
        <<
      </span>
      <span>yolo</span>
      <span class="month-selector-active">
        >>
      </span>
   `);
  });

  it('should dispatch month-selected event on selector click', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator></wired-datepicker-indicator>
    `);
    const selectors = el.shadowRoot.querySelectorAll('.month-selector-active');
    
    setTimeout(() => selectors[0].click());
    const ev = await oneEvent(el, 'month-selected');
    expect(ev).to.exist;
    expect(ev.detail.selector).to.equal('prev');

    setTimeout(() => selectors[1].click());
    const ev2 = await oneEvent(el, 'month-selected');
    expect(ev2).to.exist;
    expect(ev2.detail.selector).to.equal('next');
  });

  it('should disable prev selector if .canGoPrev=false', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator
        .canGoPrev=${false}
      ></wired-datepicker-indicator>
    `);
    const selectors = el.shadowRoot.querySelectorAll('.month-selector-disabled');
    expect(selectors.length).to.equal(1);
  });

  it('should disable next selector if .canGoNext=false', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator
        .canGoNext=${false}
      ></wired-datepicker-indicator>
    `);
    const selectors = el.shadowRoot.querySelectorAll('.month-selector-disabled');
    expect(selectors.length).to.equal(1);
  });

  it('should disable both selector if .canGoNext & .canGoPrev =false', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator
        .canGoNext=${false}
        .canGoPrev=${false}
      ></wired-datepicker-indicator>
    `);
    const selectors = el.shadowRoot.querySelectorAll('.month-selector-disabled');
    expect(selectors.length).to.equal(2);
  });

  it('should disable selectors if set programmatically', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator></wired-datepicker-indicator>
    `);

    let selectors = el.shadowRoot.querySelectorAll('.month-selector-disabled');
    expect(selectors.length).to.equal(0);

    el.canGoPrev = false;
    el.canGoNext = false;
    await elementUpdated(el);
    selectors = el.shadowRoot.querySelectorAll('.month-selector-disabled');
    expect(selectors.length).to.equal(2);

  });
});

describe('WiredDatePickerIndicator - Keyboard', () => {
  it('should respond to right arrow keyboard event', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator></wired-datepicker-indicator>
    `);

    const VK_RIGHT = 39; // keycode for right arrow
    el.focus();
    const event = new KeyboardEvent('keydown', { keyCode: VK_RIGHT });
    
    setTimeout(() => el.dispatchEvent(event));

    const ev = await oneEvent(el, 'month-selected');

    expect(ev).to.exist;
    expect(ev.detail.selector).to.equal('next');
  });

  it('should respond to left arrow keyboard event', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator></wired-datepicker-indicator>
    `);

    const VK_LEFT  = 37; // keycode for left arrow
    el.focus();
    const event = new KeyboardEvent('keydown', { keyCode: VK_LEFT });
    
    setTimeout(() => el.dispatchEvent(event));

    const ev = await oneEvent(el, 'month-selected');

    expect(ev).to.exist;
    expect(ev.detail.selector).to.equal('prev');
  });
});

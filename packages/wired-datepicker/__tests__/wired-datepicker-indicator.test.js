import { html, fixture, expect, elementUpdated, oneEvent, aTimeout } from '@open-wc/testing';

import '../lib/wired-datepicker-indicator';

/**
 * @typedef {import('../lib/wired-datepicker-indicator.js').WiredDatePickerIndicator} WiredDatePickerIndicator
 */

describe('WiredDatePickerIndicator - Properties', () => {
  it('should display three elements', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator></wired-datepicker-indicator>
    `);
    expect(el).shadowDom.to.equal(`
     <button class="month-selector-active"
      aria-label="Show previous month"
     >
        <<
      </button>
      <span>
      </span>
      <button class="month-selector-active"
        aria-label="Show next month"
      >
        >>
      </button>
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
      <button class="month-selector-active"
        aria-label="Show previous month"
      >
        <<
      </button>
      <span>yolo</span>
      <button class="month-selector-active"
        aria-label="Show next month"
      >
        >>
      </button>
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
    selectors[0].click();
    // if aTimeout comes first, then ev was not triggered
    const ev = await Promise.race([oneEvent(el, 'month-selected'), aTimeout('500')]);
    expect(ev).to.be.undefined;
  });

  it('should disable next selector if .canGoNext=false', async () => {
    const el = /** @type {WiredDatePickerIndicator} */ await fixture(html`
      <wired-datepicker-indicator
        .canGoNext=${false}
      ></wired-datepicker-indicator>
    `);
    const selectors = el.shadowRoot.querySelectorAll('.month-selector-disabled');
    expect(selectors.length).to.equal(1);
    selectors[0].click();
    // if aTimeout comes first, then ev was not triggered
    const ev = await Promise.race([oneEvent(el, 'month-selected'), aTimeout('500')]);
    expect(ev).to.be.undefined;
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

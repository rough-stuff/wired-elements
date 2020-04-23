import { LitElement, customElement, property, TemplateResult, html, css, CSSResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { fire } from 'wired-lib';

/**
 * Month Selector Template
 * @param active if the selector can be activated
 * @param onChangeMonth callback function whe the selector is clicked
 * @param selector an html template to use to represent the selector
 * @param label aria label for the button
 */
const MonthSelector = (active: boolean, onChangeMonth: Function, selector: TemplateResult, label: string) => html` 
    <button
        aria-label="${label}"
        class=${classMap({"month-selector-active": active, "month-selector-disabled": !active})}
        ?disabled=${!active}
        @click=${() => active ? onChangeMonth() : null}>
        ${selector}
    </button>
`;

/**
 * Displays days in a grid
 */
@customElement('wired-datepicker-indicator')
export class WiredDatePickerIndicator extends LitElement {

    /**
     * Header to put in the 
     */
    @property({ type: String }) header: string = '';
    /**
     * Index after which days are enabled
     */
    @property({ type: Boolean }) canGoNext: boolean = true;
    /**
     * Index before which days are enabled
     */
    @property({ type: Boolean }) canGoPrev: boolean = true;
    
    static get styles(): CSSResult {
        return css`
            :host {
                --wired-datepicker-indicator-color: var(--wired-datepicker-primary-color, black);
                --wired-datepicker-indicator-disabled-color: var(--wired-datepicker-disabled-color, lightgray);
                --wired-datepicker-indicator-hover-bg-color: var(--wired-datepicker-primary-color, black);
                --wired-datepicker-indicator-hover-color: var(--wired-datepicker-secondary-color, white);
                display:flex;
                justify-content: space-between;
                aligh-items: center;
                width: 95%;
                margin:auto;
                font-weight: bold;
            }
            .month-selector-active::selection,
            .month-selector-disabled::selection {
                background: transparent;
            }
            .month-selector-active {
                cursor: pointer;
                color: var(--wired-datepicker-indicator-color);
            }
            .month-selector-disabled {
                cursor: not-allowed;
                color: var(--wired-datepicker-indicator-disabled-color);
            }
            :host button {
                padding: 0 5 0 5;
                border: none;
                background: none;
                font-family: inherit;
                font-size: inherit;
            }
            :host button:active {
                cursor: default;
                transform: translateY(1px);
            }
            .month-selector-active:focus,
            .month-selector-active:hover {
                outline: none;
                color: var(--wired-datepicker-indicator-hover-color);
                background-color: var(--wired-datepicker-indicator-hover-bg-color);
            }
        `;
    }

    render(): TemplateResult {
        const prevMonthSelector = MonthSelector(
            this.canGoPrev,
            () => this.onMonthSelected('prev'),
            html`&lt;&lt;`,
            'Show previous month');
        const nextMonthSelector = MonthSelector(
            this.canGoNext,
            () => this.onMonthSelected('next'),
            html`&gt;&gt;`,
            'Show next month');
        return html`
            ${prevMonthSelector}
            <span>${this.header}</span>
            ${nextMonthSelector}
        `;
    }
    
    /**
     * Notifies that a month has been selected
     * @fires month-selected - { selector: 'prev' | 'next] }
     * @param selector Previous or Next month
     */
    private onMonthSelected(selector: string) {
        fire(this, 'month-selected', { selector });
    }
}

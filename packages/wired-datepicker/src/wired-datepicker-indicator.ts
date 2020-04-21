import { LitElement, customElement, property, TemplateResult, html, css, CSSResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { fire } from 'wired-lib';

/**
 * Month Selector Template
 * @param active if the selector can be activated
 * @param onChangeMonth callback function whe the selector is clicked
 * @param selector an html template to use to represent the selector
 */
const MonthSelector = (active: boolean, onChangeMonth: Function, selector: TemplateResult) => html` 
    <span 
        class=${classMap({"month-selector-active": active, "month-selector-disabled": !active})}
        @click=${() => active ? onChangeMonth() : null}>
        ${selector}
    </span>
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
                display:flex;
                justify-content: space-between;
                padding-left: 1em;
                padding-right: 1em;
                font-weight: bold;
            }
            .month-selector-active::selection,
            .month-selector-disabled::selection {
                background: transparent;
            }
            .month-selector-active {
                cursor: pointer;
            }
            .month-selector-disabled {
                cursor: not-allowed;
                color: lightgray;
            }
        `;
    }

    constructor() {
        super();
        // Make the element focusable
        if (!this.hasAttribute('tabindex')) { 
            this.setAttribute('tabindex', '0');
            this.tabIndex = 0;
        }
    }

    render(): TemplateResult {
        const prevMonthSelector = MonthSelector(this.canGoPrev, () => this.onMonthSelected('prev'), html`&lt;&lt;`);
        const nextMonthSelector = MonthSelector(this.canGoNext, () => this.onMonthSelected('next'), html`&gt;&gt;`);
        return html`
            ${prevMonthSelector}
            <span>${this.header}</span>
            ${nextMonthSelector}
        `;
    }

    /**
     * Add support for changing month 
     */
    firstUpdated() {
        this.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('keydown', this.handleKeyboardNavigation.bind(this));
    }

    /**
     * Allows navigation with keyboard when focus in the grid
     * @param e Keyboard event detected
     */
    private handleKeyboardNavigation(e: KeyboardEvent) {
        const VK_LEFT  = 37;
        const VK_RIGHT = 39;
        switch(e.keyCode) {
            case VK_LEFT:
                e.preventDefault();
                if (this.canGoPrev) {
                    this.onMonthSelected('prev');
                }
                break;
            case VK_RIGHT:
                e.preventDefault();
                if (this.canGoNext) {
                    this.onMonthSelected('next');
                }
                break;
            default:
                break;
        }
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

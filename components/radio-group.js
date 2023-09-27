var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { WiredBase, ce, html, css, property } from './core/base-element.js';
import { queryAssignedNodes } from 'lit/decorators.js';
import { WiredRadio } from './radio';
let WiredRadioGroup = class WiredRadioGroup extends WiredBase {
    get selected() {
        var _a;
        for (const r of this._buttons) {
            if (r.checked) {
                return r.value || null;
            }
        }
        return ((_a = this._selectedRadio) === null || _a === void 0 ? void 0 : _a.value) || null;
    }
    get _buttons() {
        return (this._slotted.filter((d) => (d instanceof WiredRadio)));
    }
    constructor() {
        super();
        this.vertical = false;
        this._focusIn = false;
        this.handleFocusin = (event) => {
            if (!this._focusIn) {
                this._focusIn = true;
                this.addEventListener('focusout', this.handleFocusout);
                this.addEventListener('keydown', this.handleKeydown);
                if (this._selectedRadio) {
                    if (this._selectedRadio !== event.target) {
                        this._selectedRadio.focus();
                    }
                }
                else {
                    const first = this._buttons.find((d) => !d.disabled);
                    if (first && (first !== event.target)) {
                        first.focus();
                    }
                }
            }
        };
        this.handleFocusout = (event) => {
            const related = event.relatedTarget;
            if (related && this.contains(related)) {
                return;
            }
            this._focusIn = false;
            this.removeEventListener('keydown', this.handleKeydown);
            this.removeEventListener('focusout', this.handleFocusout);
        };
        this.handleKeydown = (event) => {
            const activeElement = this.getRootNode().activeElement;
            if (!activeElement) {
                return;
            }
            const index = this._buttons.indexOf(activeElement);
            if (index < 0) {
                return;
            }
            const selectIndex = (n, forward, iteration) => {
                const count = this._buttons.length;
                if (iteration > count) {
                    return;
                }
                if (count) {
                    const i = n < 0 ? (count - 1) : (n % count);
                    const btn = this._buttons[i];
                    if (btn.disabled) {
                        if (forward) {
                            selectIndex(i + 1, forward, iteration + 1);
                        }
                        else {
                            selectIndex(i - 1, forward, iteration + 1);
                        }
                        return;
                    }
                    this.selectRadio(btn);
                }
            };
            switch (event.code) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    selectIndex(index - 1, false, 0);
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    selectIndex(index + 1, true, 1);
                    break;
                case 'End':
                    selectIndex(this._buttons.length - 1, false, 0);
                    break;
                case 'Home':
                    selectIndex(0, true, 0);
                    break;
            }
        };
        this.addEventListener('focusin', this.handleFocusin);
    }
    render() {
        return html `<slot></slot>`;
    }
    firstUpdated() {
        this.addEventListener('change', (event) => {
            if (event.target === this) {
                return;
            }
            event.stopPropagation();
            const radio = event.target;
            if (radio.checked) {
                this.selectRadio(radio);
            }
            this._fire('change');
        });
        for (const btn of this._buttons) {
            if (btn.checked) {
                this.selectRadio(btn);
            }
        }
    }
    selectRadio(item) {
        this._selectedRadio = item || undefined;
        for (const r of this._buttons) {
            if (r === item) {
                if (!item.checked) {
                    item.checked = true;
                }
            }
            else {
                r.checked = false;
            }
        }
        if (item) {
            item.focus();
        }
        const selected = item && item.value;
        if (selected) {
            this.setAttribute('selected', selected);
        }
        else {
            this.removeAttribute('selected');
        }
    }
    _sizedNode() {
        return null;
    }
    _canvasSize() {
        return [0, 0];
    }
    draw() {
        // do nothing
    }
};
WiredRadioGroup.styles = [
    WiredBase.styles,
    css `
    :host {
      opacity: 1;
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 16px;
    }
    :host([vertical]) {
      flex-direction: column;
    }
    `
];
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], WiredRadioGroup.prototype, "vertical", void 0);
__decorate([
    queryAssignedNodes(),
    __metadata("design:type", Array)
], WiredRadioGroup.prototype, "_slotted", void 0);
WiredRadioGroup = __decorate([
    ce('wired-radio-group'),
    __metadata("design:paramtypes", [])
], WiredRadioGroup);
export { WiredRadioGroup };

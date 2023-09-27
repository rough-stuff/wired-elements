var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ce, property } from './core/base-element.js';
import { WiredPopover } from './popover.js';
import { queryAssignedNodes } from 'lit/decorators.js';
let WiredMenu = class WiredMenu extends WiredPopover {
    constructor() {
        super(...arguments);
        this.autofocus = false;
        this._connected = false;
        this._clickListener = () => {
            this.open = !this.open;
            if (this.open && this.autofocus) {
                const list = this._slottedList;
                if (list) {
                    setTimeout(() => {
                        if (this.open) {
                            list.focus();
                        }
                    });
                }
            }
        };
        this._selectListener = () => {
            if (!this.manualClose) {
                this.open = false;
            }
        };
    }
    get _slottedList() {
        const found = this._slotted.find((d) => {
            if (d.nodeType === Node.ELEMENT_NODE) {
                const tag = d.tagName.toLowerCase();
                return tag === 'wired-list';
            }
            return false;
        });
        return found ? found : null;
    }
    set acnchor(node) {
        super.anchor = node;
        this._attachToNode(node);
    }
    _detachNode() {
        if (this._node) {
            this._node.removeEventListener('click', this._clickListener);
            this._node = undefined;
        }
    }
    _attachToNode(node) {
        if (this._connected && (node !== this._node)) {
            this._detachNode();
            node.addEventListener('click', this._clickListener);
            this._node = node;
        }
    }
    connectedCallback() {
        this._connected = true;
        super.connectedCallback();
        let relatedNode = super.anchor;
        if (!relatedNode) {
            relatedNode = (this.previousElementSibling || this.nextElementSibling || this.parentElement) || undefined;
        }
        if (relatedNode) {
            this._attachToNode(relatedNode);
        }
        this.addEventListener('item-click', this._selectListener);
        this.style.setProperty('--wired-card-padding', '0');
    }
    disconnectedCallback() {
        this._connected = false;
        this._detachNode();
        this.removeEventListener('item-click', this._selectListener);
        super.disconnectedCallback();
    }
};
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], WiredMenu.prototype, "autofocus", void 0);
__decorate([
    queryAssignedNodes(),
    __metadata("design:type", Array)
], WiredMenu.prototype, "_slotted", void 0);
WiredMenu = __decorate([
    ce('wired-menu')
], WiredMenu);
export { WiredMenu };

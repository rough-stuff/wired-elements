import { customElement } from 'lit-element';
import { WiredIcon as Base } from './WiredIcon';

// We separate the class from its registration as a custom element,
// so that WiredIcon class can be extended.
// Otherwise, CustomElementRegistry would register it twice and would throw an error.
@customElement('wired-icon')
export class WiredIcon extends Base {};

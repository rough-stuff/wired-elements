import { customElement } from 'lit-element';
import { WiredIcon as Base } from './WiredIcon';

// We separate the class from its registration as a custom element,
// so that WiredIcon class can be extended.
// Otherwise, CustomElementRegistry would register it twice and would throw an error.
const WiredIcon = customElement('wired-icon')(Base);

export { WiredIcon };

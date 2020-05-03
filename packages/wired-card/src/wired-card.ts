import { customElement } from 'lit-element';
import { WiredCard } from './WiredCard';

window.customElements.get('wired-card') || customElement('wired-card')(WiredCard);

export { WiredCard };

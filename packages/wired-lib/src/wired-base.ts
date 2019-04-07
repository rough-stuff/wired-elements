import { LitElement } from 'lit-element';
export * from 'lit-element';

export class WiredBase extends LitElement {
  fireEvent(name: string, detail?: any, bubbles: boolean = true, composed: boolean = true) {
    if (name) {
      const init: any = {
        bubbles: (typeof bubbles === 'boolean') ? bubbles : true,
        composed: (typeof composed === 'boolean') ? composed : true
      };
      if (detail) {
        init.detail = detail;
      }
      const CE = ((window as any).SlickCustomEvent || CustomEvent);
      this.dispatchEvent(new CE(name, init));
    }
  }
}
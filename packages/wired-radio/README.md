[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)(https://vaadin.com/directory/component/wiredjswired-radio)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/wiredjswired-radio.svg)](https://vaadin.com/directory/component/wiredjswired-radio)

![wired radio](https://wiredjs.github.io/wired-elements/images/radio.png)

# wired-radio
Hand-drawn sketchy radio button web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-radio to your project:
```
npm i wired-radio
```
Import wired-radio definition into your HTML page:
```html
<script type="module" src="wired-radio/wired-radio.js"></script>
```
Or into your module script:
```javascript
import { WiredRadio } from "wired-radio"
```

Use it in your web page:
```html
<wired-radio text="Radio One"></wired-radio>
<wired-radio text="Radio Two" checked></wired-radio>
<wired-radio text="Radio disabled" disabled></wired-radio>
```

### Properties

**checked** - Checked state (boolean) of the radio button. Default is false.

**disabled** - disables the radio button. Default value is false. 

**text** - Text associated with the radio button.

**name** - A name associated with the radio inside a radio-group.

### Custom CSS Variables

**--wired-radio-icon-color** Color of the radio button. Default is *currentColor*.

### Events
**change** event fired when state of the radio changes, i.e. the user checks/unchecks the radio.


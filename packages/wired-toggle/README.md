[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/wiredjswired-toggle)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/wiredjswired-toggle.svg)](https://vaadin.com/directory/component/wiredjswired-toggle)

![wired radio](https://wiredjs.github.io/wired-elements/images/toggle.png)

# wired-toggle
Hand-drawn sketchy toggle button web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-toggle to your project:
```
npm i wired-toggle
```
Import wired-toggle definition into your HTML page:
```html
<script type="module" src="wired-toggle/wired-toggle.js"></script>
```
Or into your module script:
```javascript
import { WiredToggle } from "wired-toggle"
```

Use it in your web page:
```html
<wired-toggle></wired-toggle>
<wired-toggle checked></wired-toggle>
```

### Properties

**checked** - Checked state (boolean). 

**disabled** - disables the toggle button. Default value is false. 

### Custom CSS Variables

**--wired-toggle-off-color** Color of the knob when in off (false) position.

**--wired-toggle-on-color** Color of the knob when in on (true) position.

### Events
**change** event fired when state of the toggle is changed by the user.

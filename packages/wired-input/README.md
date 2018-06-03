![wired input](https://wiredjs.github.io/wired-elements/images/input.png)

# wired-input
Hand-drawn sketchy text input web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-input to your project:
```
npm i wired-input
```
Import wired-input definition into your HTML page:
```html
<script type="module" src="wired-input/wired-input.js"></script>
```
Or into your module script:
```javascript
import { WiredInput } from "wired-input"
```

Use it in your web page:
```html
<wired-input></wired-input>
<wired-input placeholder="Enter name"></wired-input>
<wired-input placeholder="Disabled" disabled></wired-input>
```

### Properties

**placeholder** - Placeholder text for the input.

**disabled** - disables the control

**type** - Input type e.g. password

**value** - Value of the text.



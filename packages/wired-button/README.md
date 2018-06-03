![wired buttons](https://wiredjs.github.io/wired-elements/images/buttons.png)

# wired-button
Hand-drawn sketchy Button web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-button to your project:
```
npm i wired-button
```
Import wired-button definition into your HTML page:
```html
<script type="module" src="wired-button/wired-button.js"></script>
```
Or into your module script:
```javascript
import { WiredButton } from "wired-button"
```

Use it in your web page:
```html
<wired-button>Click Me</wired-button>
<wired-button disabled>Disabled</wired-button>
<wired-button elevation="3">Elevation</wired-button>
```

### Properties

**elevation** - Number between  1 and 5 (inclusive) that gives the button a sketchy height. Default value is 1.

**disabled** - disables the button. Default value is false. 

![wired checkbox](https://wiredjs.github.io/wired-elements/images/checkbox.png)

# wired-checkbox
Hand-drawn sketchy checkbox web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-checkbox to your project:
```
npm i wired-checkbox
```
Import wired-checkbox definition into your HTML page:
```html
<script type="module" src="wired-checkbox/wired-checkbox.js"></script>
```
Or into your module script:
```javascript
import { WiredCheckbox } from "wired-checkbox"
```

Use it in your web page:
```html
<wired-checkbox text="Checkbox One"></wired-checkbox>
<wired-checkbox text="Checkbox Two" checked></wired-checkbox>
<wired-checkbox text="Checkbox disabled" disabled></wired-checkbox>
```

### Properties

**checked** - Checked state (boolean). Default is false.

**disabled** - disables the checkbox. Default value is false. 

**text** - Text associated with the checkbox.

### Custom CSS Variables

**--wired-checkbox-icon-color** Color of the checkbox. Default is *currentColor*.

### Events
**change** event fired when state of the checkbox changes, i.e. the user checks/unchecks the box.

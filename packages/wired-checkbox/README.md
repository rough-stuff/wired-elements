![wired checkbox](https://wiredjs.github.io/wired-elements/images/checkbox.gif)

# wired-checkbox
Hand-drawn sketchy checkbox web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-checkbox to your project:
```
npm i wired-checkbox
```
Import wired-checkbox definition into your HTML page:
```html
<script type="module" src="wired-checkbox/lib/wired-checkbox.js"></script>
```
Or into your module script:
```javascript
import { WiredCheckbox } from "wired-checkbox"
```

Use it in your web page:
```html
<wired-checkbox>Checkbox One</wired-checkbox>
<wired-checkbox checked>Checkbox Two</wired-checkbox>
<wired-checkbox disabled>Disabled checkbox</wired-checkbox>
```

## Properties

**checked** - Checked state (boolean). Default is false.

**disabled** - Disables the checkbox. Default value is false. 

## Custom CSS Properties

**--wired-checkbox-icon-color** Color of the checkbox. Default is *currentColor*.

## Events
**change** event fired when state of the checkbox changes, i.e. the user checks/unchecks the box.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
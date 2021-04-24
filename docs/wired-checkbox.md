# wired-checkbox
Hand-drawn sketchy checkbox web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredCheckbox } from 'wired-elements';
// or
import { WiredCheckbox } from 'wired-elements/lib/wired-checkbox.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-checkbox.js"></script>
```

Use it in your HTML:
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
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

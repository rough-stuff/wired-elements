# wired-combo

Combobox control - similar to a native browser select element; with a hand-drawn, wireframe like, style.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage
Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredCombo } from 'wired-elements';
// or
import { WiredCombo } from 'wired-elements/lib/wired-combo.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-combo.js"></script>
```

Use it in your HTML:
```html
<wired-combo id="combo" selected="two">
  <wired-item value="one">Number One</wired-item>
  <wired-item value="two">Number Two</wired-item>
  <wired-item value="three">Number Three</wired-item>
</wired-combo>
```

## Properties

**disabled** - disables the combo selector. Default value is false. 

**selected** - Value of the selected wired-item. 

## Custom CSS Variables

**--wired-combo-popup-bg** Background color of the dropdown when combo selector is open.

**--wired-item-selected-bg** Background color of the selected item

## Events
**selected** event fired when an item is selected by the user. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
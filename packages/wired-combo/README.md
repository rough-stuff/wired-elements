![wired combo](https://wiredjs.github.io/wired-elements/images/combo.gif)

# wired-combo

Combobox control - similar to a native browser select element; with a hand-drawn, wireframe like, style.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-combo to your project:
```
npm i wired-combo
```
Import wired-combo definition into your HTML page:
```html
<script type="module" src="wired-combo/lib/wired-combo.js"></script>
```
Or into your module script:
```javascript
import { WiredCombo } from "wired-combo"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
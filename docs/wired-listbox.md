# wired-listbox

A listbox control with Wired hand-drawn styling. The selected item is highlighted. Can be vertical (default) or horizontal.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredListbox } from 'wired-elements';
// or
import { WiredListbox } from 'wired-elements/lib/wired-listbox.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-listbox.js"></script>
```

Use it in your HTML:
```html
 <wired-listbox id="combo" selected="two">
  <wired-item value="one">Number One</wired-item>
  <wired-item value="two">Number Two</wired-item>
  <wired-item value="three">Number Three</wired-item>
</wired-listbox>

<wired-listbox horizontal selected="two"
     style="--wired-item-selected-color: darkred; --wired-item-selected-bg: pink;">
  <wired-item value="one">Number One</wired-item>
  <wired-item value="two">Number Two</wired-item>
  <wired-item value="three">Number Three</wired-item>
</wired-listbox>
```

## Properties

**horizontal** - Boolean indicated if the items are layed out horizontally. Default is false.

**selected** - Value of the selected item. 

## Custom CSS Variables

**--wired-item-selected-bg** Background color of the selected item.

**--wired-item-selected-color** Text color of the selected item.


## Events
**selected** event fired when an item is selected by the user. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
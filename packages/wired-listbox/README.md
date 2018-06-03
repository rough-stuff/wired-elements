![wired listbox](https://wiredjs.github.io/wired-elements/images/listbox.png)

# wired-listbox

A listbox control with Wired hand-drawn styling. The selected item is highlighted. Can be vertical (default) or horizontal.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-listbox to your project:
```
npm i wired-listbox
```
Import wired-listbox definition into your HTML page:
```html
<script type="module" src="wired-listbox/wired-listbox.js"></script>
```
Or into your module script:
```javascript
import { WiredListbox } from "wired-listbox"
```

Use it in your web page:
```html
<wired-listbox>
  <wired-item value="one" text="No. one"></wired-item>
  <wired-item value="two" text="No. two"></wired-item>
</wired-listbox>

<wired-listbox horizontal selected="two">
  <wired-item value="one" text="No. one"></wired-item>
  <wired-item value="two" text="No. two"></wired-item>
  <wired-item value="three" text="No. three"></wired-item>
</wired-listbox>
```

### Properties

**horizontal** - Boolean indicated if the items are layed out horizontally. Default is false.

**selected** - Name of the selected item. 

### Custom CSS Variables

**--wired-combo-item-selected-bg** Background color of the selected item.

**--wired-combo-item-hover-bg** Color of item in the dropdown on hover. 


### Events
**selected** event fired when an item is selected by the user. 

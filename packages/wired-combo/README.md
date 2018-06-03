![wired combo](https://wiredjs.github.io/wired-elements/images/combo.png)

# wired-combo

Combobox control - similar to a native browser select element; with a hand-drawn, wireframe like, style.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-combo to your project:
```
npm i wired-combo
```
Import wired-combo definition into your HTML page:
```html
<script type="module" src="wired-combo/wired-combo.js"></script>
```
Or into your module script:
```javascript
import { WiredCombo } from "wired-combo"
```

Use it in your web page:
```html
<wired-combo selected="two">
  <wired-item value="one" text="Number one"></wired-item>
  <wired-item value="two" text="Number two"></wired-item>
  <wired-item value="three" text="Number three"></wired-item>
</wired-combo>
  
<wired-combo selected="one" disabled>
  <wired-item value="one" text="Number one"></wired-item>
  <wired-item value="two" text="Number two"></wired-item>
</wired-combo>
```

### Properties

**disabled** - disables the combo selector. Default value is false. 

**selected** - Name of the selected item. 

### Custom CSS Variables

**--wired-combo-popup-bg** Background color of the dropdown when combo selector is open.

**--wired-combo-item-hover-bg** Color of item in the dropdown on hover. 


### Events
**selected** event fired when an item is selected by the user. 

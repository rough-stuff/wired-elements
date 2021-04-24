# wired-fab
Hand-drawn sketchy Floating Action Button (FAB)

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

AAdd wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredFab } from 'wired-elements';
// or
import { WiredFab } from 'wired-elements/lib/wired-fab.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-fab.js"></script>
```

Use it in your HTML:
```html
<wired-fab id="btn1">
  <mwc-icon>favorite</mwc-icon>
</wired-fab>
<wired-fab id="btn2" class="red">
  <mwc-icon>close</mwc-icon>
</wired-fab>
```

## Properties

**disabled** - disables the button. Default value is false. 

## Custom CSS Properties

**--wired-fab-bg-color** - Background color of the fab. Default value is #018786. Foreground color is set by setting the **color** css property.

## Events

**click** - When button is clicked/submitted

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
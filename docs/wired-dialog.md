# wired-dialog
Hand-drawn sketchy Dialog web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredDialog } from 'wired-elements';
// or
import { WiredDialog } from 'wired-elements/lib/wired-dialog.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-dialog.js"></script>
```

Use it in your HTML:

```html
<wired-dialog>
  <p>
    Dialog content here
  </p>
  <div style="text-align: right; padding: 30px 16px 16px;">
    <wired-button id="closeDialog">Close dialog</wired-button>
  </div>
</wired-dialog>
```

## Properties

**elevation** - Number between  1 and 5 (inclusive) that gives the sketchy link underline a height. Default value is 1.

**open** - Boolean value telling dialog if it's showing or not.

## Custom CSS Properties

**--wired-dialog-z-index** - Sets the `z-index` of the dialog


## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
# wired-dialog
Hand-drawn sketchy Dialog web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-dialog to your project:
```
npm wired-dialog
```
Import wired-dialog definition into your HTML page:
```html
<script type="module" src="wired-dialog/lib/wired-dialog.js"></script>
```
Or into your module script:
```javascript
import { WiredDialog } from "wired-dialog"
```

Use it in your web page:

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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

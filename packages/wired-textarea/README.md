# wired-textarea
Hand-drawn sketchy multi-line text input web component. 

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-textarea to your project:
```
npm i wired-textarea
```
Import wired-textarea definition into your HTML page:
```html
<script type="module" src="wired-textarea/lib/wired-textarea.js"></script>
```
Or into your module script:
```javascript
import { WiredTextarea } from "wired-textarea"
```

Use it in your web page:
```html
<wired-textarea placeholder="Enter text" rows="6"></wired-textarea>
```

## Properties

**rows** - Initial number of rows in textarea.

**maxrows** - Max number of rows textarea grows to. Then scrollbars appear. 

**value** - Text value.

**disabled** - Disabled the control.

**placeholder** - Placeholder text for the input.

## Events

Fires all the events the native `<textarea>` element fires

![wired textarea](https://wiredjs.github.io/wired-elements/images/textarea.png)

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

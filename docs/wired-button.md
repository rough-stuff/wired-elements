# wired-button
Hand-drawn sketchy Button web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredButton } from 'wired-elements';
// or
import { WiredButton } from 'wired-elements/lib/wired-button.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-button.js"></script>
```

Use it in your HTML:
```html
<wired-button>Click Me</wired-button>
<wired-button disabled>Disabled</wired-button>
<wired-button elevation="3">Elevation</wired-button>
```

## Properties

**elevation** - Number between  1 and 5 (inclusive) that gives the button a sketchy height. Default value is 1.

**disabled** - disables the button. Default value is false. 

## Events

**click** - When button is clicked/submitted


## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

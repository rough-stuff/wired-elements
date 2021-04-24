# wired-divider
Hand-drawn sketchy line to divide sections

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

AAdd wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredDivider } from 'wired-elements';
// or
import { WiredDivider } from 'wired-elements/lib/wired-divider.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-divider.js"></script>
```

Use it in your HTML:
```html
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<wired-divider></wired-divider>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
```

## Properties

**elevation** - Number between  1 and 5 (inclusive) represents number of lines drawn. Default value is 1.


## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
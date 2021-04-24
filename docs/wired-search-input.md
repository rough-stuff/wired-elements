# wired-search-input
Hand-drawn sketchy search text input web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

AAdd wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredSearchInput } from 'wired-elements';
// or
import { WiredSearchInput } from 'wired-elements/lib/wired-search-input.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-search-input.js"></script>
```

Use it in your HTML:
```html
<wired-search-input></wired-search-input>
<wired-search-input placeholder="Search here"></wired-search-input>
```

## Properties

**placeholder** - Placeholder text for the input.

**disabled** - disables the control

**value** - Value of the text.

## Events

Fires all events a standard `<input>` element fires. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
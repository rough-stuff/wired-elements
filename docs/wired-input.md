# wired-input
Hand-drawn sketchy text input web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

AAdd wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredInput } from 'wired-elements';
// or
import { WiredInput } from 'wired-elements/lib/wired-input.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-input.js"></script>
```

Use it in your HTML:
```html
<wired-input></wired-input>
<wired-input placeholder="Enter name"></wired-input>
<wired-input type="password" placeholder="Password"></wired-input>
<wired-input placeholder="Disabled" disabled></wired-input>
```

## Properties

**placeholder** - Placeholder text for the input.

**disabled** - disables the control

**type** - Input type e.g. password

**value** - Value of the text.

## Events

Fires all events a standard `<input>` element fires. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
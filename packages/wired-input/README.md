![wired input](https://wiredjs.github.io/wired-elements/images/input.gif)

# wired-input
Hand-drawn sketchy text input web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-input to your project:
```
npm i wired-input
```
Import wired-input definition into your HTML page:
```html
<script type="module" src="wired-input/lib/wired-input.js"></script>
```
Or into your module script:
```javascript
import { WiredInput } from "wired-input"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

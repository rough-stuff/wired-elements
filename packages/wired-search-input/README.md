# wired-search-input
Hand-drawn sketchy search text input web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-search-input to your project:
```
npm i wired-search-input
```
Import wired-search-input definition into your HTML page:
```html
<script type="module" src="wired-search-input/lib/wired-search-input.js"></script>
```
Or into your module script:
```javascript
import { WiredSearchInput } from "wired-search-input"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
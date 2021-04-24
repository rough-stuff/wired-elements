# wired-toggle
Hand-drawn sketchy toggle button / switch.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredToggle } from 'wired-elements';
// or
import { WiredToggle } from 'wired-elements/lib/wired-toggle.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-toggle.js"></script>
```

Use it in your HTML:
```html
<wired-toggle></wired-toggle>
<wired-toggle checked></wired-toggle>
```

## Properties

**checked** - Checked state (boolean). 

**disabled** - disables the toggle button. Default value is false. 

## Custom CSS Variables

**--wired-toggle-off-color** Color of the knob when in off (false) position. Default value is *gray*.

**--wired-toggle-on-color** Color of the knob when in on (true) position. Default value is *rgb(63, 81, 181)*.

## Events
**change** event fired when state of the toggle is changed by the user.

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
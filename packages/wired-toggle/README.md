![wired toggle](https://wiredjs.github.io/wired-elements/images/toggle.gif)

# wired-toggle
Hand-drawn sketchy toggle button / switch.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-toggle to your project:
```
npm i wired-toggle
```
Import wired-toggle definition into your HTML page:
```html
<script type="module" src="wired-toggle/lib/wired-toggle.js"></script>
```
Or into your module script:
```javascript
import { WiredToggle } from "wired-toggle"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

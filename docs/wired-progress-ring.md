# wired-progress-ring
Hand-drawn sketchy progress-ring web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredProgressRing } from 'wired-elements';
// or
import { WiredProgressRing } from 'wired-elements/lib/wired-progress-ring.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-progress-ring.js?module"></script>
```

Use it in your HTML:
```html
<wired-progress-ring value="25"></wired-progress-ring>
<wired-progress-ring value="10" min="5" max="15"></wired-progress-ring>
```

## Properties

**value** - Numeric value of the progress.

**min** - Minimum value. Default is 0.

**max** - Maximum value. Default is 100.

**hideLabel** - Hide the label in the center of the ring. This label shows the current value. Default is `false`.

**showLabelAsPercent** - When showing the label, show the value as a percentage. Default value is `false`.

**precision** - When showing the label as a percentage, this value can be set to specify the precision to round the value to. By default, the value rounded to a whole number. 

## Custom CSS Variables

**--wired-progress-color** Color of the progress bar. Default is `blue`.

The font and color of the label can be set the by styling the `wired-progress-ring` element. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
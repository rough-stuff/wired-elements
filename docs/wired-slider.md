# wired-slider

Hand-drawn sketchy slider web component which allows user to select a value from a range by moving the slider thumb.

Range can be set using the min, max value. Default range is 0-100.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredSlider } from 'wired-elements';
// or
import { WiredSlider } from 'wired-elements/lib/wired-slider.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-slider.js"></script>
```

Use it in your HTML:
```html
<wired-slider></wired-slider>
<wired-slider disabled></wired-slider>
<wired-slider value="10" min="5" max="15"></wired-slider>
```

## Properties

**value** - Numeric value of the slider.

**min** - Minimum value of the slider. Default is 0.

**max** - Maximum value of the slider. Default ia 100.

## Custom CSS Variables

**--wired-slider-knob-zero-color** Color of the knob when the value is at minimum.

**--wired-slider-knob-color** Color of the knob when the value is NOT at minimum.

**--wired-slider-bar-color** Color of the bar on which the knob slides. 

## Events

**change** event fired when the user changes the slider value. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
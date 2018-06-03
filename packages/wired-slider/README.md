
![wired slider](https://wiredjs.github.io/wired-elements/images/slider.png)

# wired-slider

Hand-drawn sketchy slider web component which allows user to select a value from a range by moving the slider thumb.

Range can be set using the min, max value. Default range is 0-100.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-slider to your project:
```
npm i wired-slider
```
Import wired-slider definition into your HTML page:
```html
<script type="module" src="wired-slider/wired-slider.js"></script>
```
Or into your module script:
```javascript
import { WiredSlider } from "wired-slider"
```

Use it in your web page:
```html
<wired-slider></wired-slider>
<wired-slider disabled></wired-slider>
<wired-slider knobradius="15" value="10" min="5" max="15"></wired-slider>
```

### Properties

**value** - Numeric value of the slider.

**min** - Minimum value of the slider. Default is 0.

**max** - Maximum value of the slider. Default ia 100.

**knobradius** - Radius of the knob of the slider. 

### Custom CSS Variables

**--wired-slider-knob-zero-color** Color of the knob when the value is at minimum.

**--wired-slider-knob-color** Color of the knob when the value is NOT at minimum.

**--wired-slider-bar-color** Color of the bar on which the knob slides. 

### Events
**change** event fired when the user changes the slider value. 
**input** event fired when the user is changing the slider value. 

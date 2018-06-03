![wired progress](https://wiredjs.github.io/wired-elements/images/progress.png)

# wired-progress
Hand-drawn sketchy progress bar web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-progress to your project:
```
npm i wired-progress
```
Import wired-progress definition into your HTML page:
```html
<script type="module" src="wired-progress/wired-progress.js"></script>
```
Or into your module script:
```javascript
import { WiredProgress } from "wired-progress"
```

Use it in your web page:
```html
<wired-progress value="25"></wired-progress>
<wired-progress value="10" min="5" max="15"></wired-progress>
```

### Properties

**value** - Numeric value of the progress.

**min** - Minimum value. Default is 0.

**max** - Maximum value. Default is 100.

**percentage** - Boolean indicating if the label should show a % symbol.

### Custom CSS Variables

**--wired-progress-label-color** Color of the label.

**--wired-progress-font-size** Font size of the label.

**--wired-progress-color** Color of the progress bar. Default is *rgba(0, 0, 200, 0.1)*.

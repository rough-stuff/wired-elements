![wired tooltip](https://wiredjs.github.io/wired-elements/images/tooltip.png)

# wired-tooltip

Tooltip with text that appears on hover over an element. It will be centered to an anchor element specified in the 'for' attribute, or, if that doesn't exist, centered to the parent node containing it.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-tooltip to your project:
```
npm i wired-tooltip
```
Import wired-tooltip definition into your HTML page:
```html
<script type="module" src="wired-tooltip/wired-tooltip.js"></script>
```
Or into your module script:
```javascript
import { WiredTooltip } from "wired-tooltip"
```

Use it in your web page:
```html
<div>
  <div class="inline">
    <button>Click me!</button>
    <wired-tooltip text="Below"></wired-tooltip>
  </div>
  <button id="btn">Click me!</button>
  <wired-tooltip position="top" for="btn" text="Above"></wired-tooltip>
</div>
```

### Properties

**for** - Id of the element the tooltip is for. *Optional*.

**position** - String value: left/right/top/bottom. Default is bottom.

**text** - Text in the tooltip.

### Custom CSS Variables

**--wired-tooltip-border-color** Border color of the tooltip. Default is *currentColor*.

**--wired-tooltip-background** Background color of the tooltip. 

# wired-icon-button

This is a hand-drawn sketchy round button with an image placed at the center. Image could also be in icon, like [@material/mwc-icon](https://www.npmjs.com/package/@material/mwc-icon).

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredIconButton } from 'wired-elements';
// or
import { WiredIconButton } from 'wired-elements/lib/wired-icon-button.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-icon-button.js"></script>
```

Use it in your HTML:
```html
<wired-icon-button>
  <mwc-icon>favorite</mwc-icon>
</wired-icon-button>
<wired-icon-button class="red">
  <mwc-icon>favorite</mwc-icon>
</wired-icon-button>
```

## Properties

**disabled** - disables the button. Default value is false. 

## Custom CSS Variables

**--wired-icon-size** Numeric size of the icon. Default is 24 (px).

**--wired-icon-bg-color** Background color.

## Events

**click** - When button is clicked/submitted

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
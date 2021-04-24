# wired-image

wired-image displays an image and draws a sketchy border around it. 

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredImage } from 'wired-elements';
// or
import { WiredImage } from 'wired-elements/lib/wired-image.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-image.js"></script>
```

Use it in your HTML:
```html
<wired-image src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>
<wired-image elevation="4" src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>
```

## Properties

**src** - URL of the image.

**elevation** - Numerical number between 1-5 (inclusive) - sets the elevation of the card. Default is 1.

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
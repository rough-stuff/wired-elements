# wired-image

wired-image displays an image and draws a sketchy border around it. 

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-image to your project:
```
npm i wired-image
```
Import wired-image definition into your HTML page:
```html
<script type="module" src="wired-image/lib/wired-image.js"></script>
```
Or into your module script:
```javascript
import { WiredImage } from "wired-image"
```

Use it in your web page:
```html
<wired-image src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>
<wired-image elevation="4" src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-image>
```

## Properties

**src** - URL of the image.

**elevation** - Numerical number between 1-5 (inclusive) - sets the elevation of the card. Default is 1.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
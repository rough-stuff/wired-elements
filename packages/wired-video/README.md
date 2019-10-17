# wired-video

wired-video displays an image and draws a sketchy border around it. 

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-video to your project:
```
npm i wired-video
```
Import wired-video definition into your HTML page:
```html
<script type="module" src="wired-video/lib/wired-video.js"></script>
```
Or into your module script:
```javascript
import { WiredImage } from "wired-video"
```

Use it in your web page:
```html
<wired-video src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-video>
<wired-video elevation="4" src="https://www.gstatic.com/webp/gallery/1.sm.jpg"></wired-video>
```

## Properties

**src** - URL of the image.

**elevation** - Numerical number between 1-5 (inclusive) - sets the elevation of the card. Default is 1.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
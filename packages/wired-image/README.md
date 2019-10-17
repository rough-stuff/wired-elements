![wired card](https://wiredjs.github.io/wired-elements/images/card.png)

# wired-image

wired-image is s a container for other web elements - with a hand-drawn, wireframe like, look.

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
<wired-image>
  <p>Elevation: 1</p>
</wired-image>

<wired-image elevation="3">
  <p>Elevation: 3</p>
</wired-image>
```

## Properties

**elevation** - Numerical number between 1-5 (inclusive) - sets the elevation of the card. Default is 1.

**fill** - A color to fill the background of the card in a sketchy format

## Methods

**requestUpdate()** - When dynamically adding content to the card, call this method to recompute the boundaries of the card. 

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
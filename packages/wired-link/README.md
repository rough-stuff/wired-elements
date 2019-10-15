# wired-link
Hand-drawn sketchy Anchor/Link web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-link to your project:
```
npm wired-link
```
Import wired-link definition into your HTML page:
```html
<script type="module" src="wired-link/lib/wired-link.js"></script>
```
Or into your module script:
```javascript
import { WiredLink } from "wired-link"
```

Use it in your web page:
```html
<wired-link href="/more.html">Learn more</wired-link>
<wired-link elevation="3" href="/more.html" target="_blank">Elevation</wired-link>
```

## Properties

**elevation** - Number between  1 and 5 (inclusive) that gives the sketchy link underline a height. Default value is 1.

**href** - URL of the page to link to

**target** - Similar to the target property of `<a>`, the target window of this link.

## Custom CSS Properties

**--wired-link-decoration-color** - Color of the sketchy underline of the link. Default value is blue. Foreground color is set by setting the **color** css property.


## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

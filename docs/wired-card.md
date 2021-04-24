# wired-card

wired-card is a container for other web elements - with a hand-drawn, wireframe like, look.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredCard } from 'wired-elements';
// or
import { WiredCard } from 'wired-elements/lib/wired-card.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-card.js"></script>
```

Use it in your HTML:
```html
<wired-card>
  <p>Elevation: 1</p>
</wired-card>

<wired-card elevation="3">
  <p>Elevation: 3</p>
</wired-card>
```

## Properties

**elevation** - Numerical number between 1-5 (inclusive) - sets the elevation of the card. Default is 1.

**fill** - A color to fill the background of the card in a sketchy format

## Methods

**requestUpdate()** - When dynamically adding content to the card, call this method to recompute the boundaries of the card. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

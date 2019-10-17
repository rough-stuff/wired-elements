![wired card](https://wiredjs.github.io/wired-elements/images/card.png)

# wired-card

wired-card is a container for other web elements - with a hand-drawn, wireframe like, look.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-card to your project:
```
npm i wired-card
```
Import wired-card definition into your HTML page:
```html
<script type="module" src="wired-card/lib/wired-card.js"></script>
```
Or into your module script:
```javascript
import { WiredCard } from "wired-card"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
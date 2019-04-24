![wired fab](https://wiredjs.github.io/wired-elements/images/fab.gif)

# wired-fab
Hand-drawn sketchy Floating Action Button (FAB)

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-fab to your project:
```
npm i wired-fab
```
Import wired-fab definition into your HTML page:
```html
<script type="module" src="wired-fab/lib/wired-fab.js"></script>
```
Or into your module script:
```javascript
import { WiredFab } from "wired-fab"
```

Use it in your web page:
```html
<wired-fab id="btn1">favorite</wired-fab>
<wired-fab id="btn2" class="red">close</wired-fab>
```

## Properties

**disabled** - disables the button. Default value is false. 

## Custom CSS Properties

**--wired-fab-bg-color** - Background color of the fab. Default value is #018786. Foreground color is set by setting the **color** css property.

## Events

**click** - When button is clicked/submitted

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
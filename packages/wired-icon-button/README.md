![wired icon](https://wiredjs.github.io/wired-elements/images/icon-button.png)

# wired-icon-button

This is a hand-drawn sketchy round button with an image placed at the center. Image could also be in icon, more specifically an icon as as [@material/mwc-icon](https://www.npmjs.com/package/@material/mwc-icon).

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-icon-button to your project:
```
npm i wired-icon-button
```
Import wired-icon-button definition into your HTML page:
```html
<script type="module" src="wired-icon-button/wired-icon-button.js"></script>
```
Or into your module script:
```javascript
import { WiredIconButton } from "wired-icon-button"
```

Use it in your web page:
```html
<wired-icon-button>favorite</wired-icon-button>
<wired-icon-button class="red">favorite</wired-icon-button>
```

### Properties

**disabled** - disables the button. Default value is false. 

### Custom CSS Variables

**--wired-icon-size** Numeric size of the icon. Default is 24 (px).

**--wired-icon-bg-color** Background color. 

![wired radio](https://wiredjs.github.io/wired-elements/images/radio.gif)

# wired-radio
Hand-drawn sketchy radio button web component. Usually used with [wired-radio-group](https://github.com/wiredjs/wired-elements/tree/master/packages/wired-radio-group).

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-radio to your project:
```
npm i wired-radio
```
Import wired-radio definition into your HTML page:
```html
<script type="module" src="wired-radio/lib/wired-radio.js"></script>
```
Or into your module script:
```javascript
import { WiredRadio } from "wired-radio"
```

Use it in your web page:
```html
<wired-radio>Radio One</wired-radio>
<wired-radio checked>Radio Two</wired-radio>
<wired-radio disabled>Disabled Radio</wired-radio>
```

## Properties

**checked** - Checked state (boolean) of the radio button. Default is false.

**disabled** - disables the radio button. Default value is false. 

**text** - Text associated with the radio button.

**name** - A name associated with the radio inside a radio-group.

## Custom CSS Variables

**--wired-radio-icon-color** Color of the radio button. Default is *currentColor*.

## Events
**change** - event fired when state of the radio changes, i.e. the user checks/unchecks the radio.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

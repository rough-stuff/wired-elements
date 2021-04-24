# wired-radio
Hand-drawn sketchy radio button web component. Usually used with `wired-radio-group`.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

AAdd wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredRadio } from 'wired-elements';
// or
import { WiredRadio } from 'wired-elements/lib/wired-radio.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-radio.js"></script>
```

Use it in your HTML:
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
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
# wired-radio-group
Allows user to select at most one radio button from a set. Works with `wired-radio`.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredRadioGroup, WiredRadio } from 'wired-elements';
// or
import { WiredRadioGroup } from 'wired-elements/lib/wired-radio-group.js';
```

Use it in your HTML:
```html
<wired-radio-group selected="two">
  <wired-radio name="one">One</wired-radio>
  <wired-radio name="two">Two</wired-radio>
  <wired-radio name="three">Three</wired-radio>
  <wired-radio name="four">Four</wired-radio>
</wired-radio-group>
```

## Properties

**selected** - Named of the selected radio button.

## Events

**selected** Event fired when user changes selection

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
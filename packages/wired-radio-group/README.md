
![wired radio group](https://wiredjs.github.io/wired-elements/images/radio.gif)

# wired-radio-group
Allows user to select at most one radio button from a set. Works with [wired-radio](https://github.com/wiredjs/wired-elements/tree/master/packages/wired-radio).

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-radio to your project:
```
npm i wired-radio-group
```
Import wired-radio-group definition into your HTML page:
```html
<script type="module" src="wired-radio-group/lib/wired-radio-group.js"></script>
```
Or into your module script:
```javascript
import { WiredRadioGroup } from "wired-radio-group"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

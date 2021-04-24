# wired-spinner
Hand-drawn sketchy spinner to show progress or a pending task.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredSpinner } from 'wired-elements';
// or
import { WiredSpinner } from 'wired-elements/lib/wired-spinner.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-spinner.js"></script>
```

Use it in your HTML:
```html
<wired-spinner id="sp"></wired-spinner>
<wired-spinner spinning duration="1000"></wired-spinner>
```

## Properties

**spinning** - Is the spinner spinning. Default is *false*.

**duration** - Time in milliseconds to complete one complete spin. Default is *1500*

## Styling

Change the **color** style of the spinner element to change its color. 

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
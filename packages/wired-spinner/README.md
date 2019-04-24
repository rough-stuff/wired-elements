![wired spinner](https://wiredjs.github.io/wired-elements/images/spinner.gif)

# wired-spinner
Hand-drawn sketchy spinner to show progress or a pending task.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-spinner to your project:
```
npm i wired-spinner
```
Import wired-spinner definition into your HTML page:
```html
<script type="module" src="wired-spinner/lib/wired-spinner.js"></script>
```
Or into your module script:
```javascript
import { WiredSpinner } from "wired-spinner"
```

Use it in your web page:
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
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

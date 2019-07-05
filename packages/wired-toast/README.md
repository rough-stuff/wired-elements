![wired toast](https://wiredjs.github.io/wired-elements/images/toast.png)

# wired-toast

Hand-drawn sketchy toast web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-toast to your project:

```
npm i wired-toast
```

Import wired-toast definition into your HTML page:

```html
<script type="module" src="wired-toast/lib/wired-toast.js"></script>
```

Or into your module script:

```javascript
import { WiredToast, showToast } from "wired-toast";
```

Use it in your web page:

```html
<script type="module">
  import { showToast } from "wired-dialog";
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  let locations = [
    "top",
    "top-right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "top-left"
  ];
  showToast(`Showing toast`, 3000, locations[getRandomInt(6)]);
</script>
```

## showToast(label, duration, location) Paramaters

**label** - Text to display in the toast

**duration** - Time in milliseconds the toast is displayed before hiding. Excludes animation time, default 3000ms. 0 for infinite.

**location** - Text to display in the toast

## WiredToast Properties

**name** - Unique identifier for that tab. Used for selection.

## Custom CSS Variables

**--wired-toast-bg** Background color of the toast.

## License

[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

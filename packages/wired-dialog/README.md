![wired dialog](https://wiredjs.github.io/wired-elements/images/dialog.png)

# wired-dialog

Hand-drawn sketchy dialog web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-dialog to your project:

```
npm i wired-dialog
```

Import wired-dialog definition into your HTML page:

```html
<script type="module" src="wired-dialog/lib/wired-dialog.js"></script>
```

Or into your module script:

```javascript
import { openDialog } from "wired-dialog";
```

Use it in your web page:

```html
<wired-button id="opener">Click to Open</wired-button>

<wired-dialog name="my-dialog">
  <h4>Dialog Title</h4>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </p>
</wired-dialog>

<script type="module">
  import { openDialog } from "wired-dialog";
  const buttonToOpen = document.getElementById("opener");
  buttonToOpen.addEventListener("click", () => openDialog("my-dialog"));
</script>
```

## WiredDialog Properties

**name** - Unique identifier for that tab. Used for selection.

**label** - Text to show in the tab. Defaulst to the **name** property.

## Custom CSS Variables

**--wired-item-selected-bg** Background color of the selected tab.

**--wired-item-selected-color** Text color of the selected tab.

## License

[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

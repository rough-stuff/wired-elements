![wired tabs](https://wiredjs.github.io/wired-elements/images/tabs.png)

# wired-tabs
Hand-drawn sketchy Tabs web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-tabs to your project:
```
npm i wired-tabs
```
Import wired-tabs definition into your HTML page:
```html
<script type="module" src="wired-tabs/lib/wired-tabs.js"></script>
```
Or into your module script:
```javascript
import { WiredTab, WiredTabs } from "wired-tabs"
```

Use it in your web page:
```html
<wired-tabs selected="Two">
  <wired-tab name="One">
    <h4>Card 1</h4>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </wired-tab>
  <wired-tab name="Two">
    <h4>Card 2</h4>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </wired-tab>
  <wired-tab name="Three">
    <h4>Card 3</h4>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </wired-tab>
</wired-tabs>
```

## WiredTabs Properties

**selected** - Name of the currently selected tab

## WiredTab Properties

**name** - Unique identifier for that tab. Used for selection. 

**label** - Text to show in the tab. Defaulst to the **name** property.

## Custom CSS Variables

**--wired-item-selected-bg** Background color of the selected tab.

**--wired-item-selected-color** Text color of the selected tab.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

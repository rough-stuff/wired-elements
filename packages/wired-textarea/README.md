[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/wiredjswired-textarea)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/wiredjswired-textarea.svg)](https://vaadin.com/directory/component/wiredjswired-textarea)

# wired-textarea
Hand-drawn sketchy textarea web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

Learn about web components [here](https://www.webcomponents.org/introduction).

## Usage

Add wired-textarea to your project:
```
npm i wired-textarea
```
Import wired-textarea definition into your HTML page:
```html
<script type="module" src="wired-textarea/wired-textarea.js"></script>
```
Or into your module script:
```javascript
import { WiredTextarea } from "wired-textarea"
```

Use it in your web page:
```html
<wired-textarea placeholder="Enter text" rows="3"></wired-textarea>
```

### Properties

**rows** - Initial number of rows in textarea.

**maxrows** - Max number of rows textarea grows to. Then scrollbars appear. 

**value** - Text value.

**disabled** - Disabled the control.

**placeholder** - Placeholder text for the input.


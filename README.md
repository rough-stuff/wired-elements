[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/search?keyword=wiredjs)

# wired-elements 👉 [wiredjs.com](https://wiredjs.com)
Wired Elements is a series of basic UI Elements that have a hand drawn look. These can be used for wireframes, mockups, or just the fun hand-drawn look. 

![alt Preview](https://i.imgur.com/qttPllg.png)


## Try now
Play with wired-elements:

[Wired Elements](https://glitch.com/~we-vanilla)

#### Try it with a framework

[Wired Elements in React](https://codesandbox.io/s/xrll5wyl8w)

[Wired Elements in Vue](https://codesandbox.io/s/vj389y9375)

[Wired Elements in Svelte](https://codesandbox.io/s/wired-elements-svelte-4hfkb)

[Wired Elements in Angular](https://ng-run.com/edit/TRjDTfMDLaa1d7GRoXQd)


## Install

The package (wired-elements) exports all components in the **_wired_** category. List of all wired elements can be found [here](https://github.com/wiredjs/wired-elements/tree/master/packages).

Add wired-elements to your project:
```
npm i wired-elements
```
or add individual controls
```
npm i wired-button
```
```
npm i wired-input
```

Or load the ES module directly through unpkg

```html
<script type="module" src="https://unpkg.com/wired-button?module"></script>
```

To load all elements there are bundled versions available: 

ES module: https://unpkg.com/wired-elements/lib/wired-elements-esm.js

IIFE: https://unpkg.com/wired-elements/lib/wired-elements-iife.js

Common JS: https://unpkg.com/wired-elements/lib/wired-elements-cjs.js


## Usage

Import into your module script:
```javascript
import { WiredButton, WiredInput } from "wired-elements"
```

```javascript
import { WiredButton } from "https://unpkg.com/wired-button?module"
```

Alternatively, load a bundled iife version on the page and start using it in HTML

```html
<script src="https://unpkg.com/wired-elements/lib/wired-elements-iife.js"></script>
```

#### Use it in your web page:
```html
<wired-input placeholder="Enter name"></wired-input>
<wired-button>Click Me</wired-button>
```

Learn about web components [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

## Component API

To view details of each component - properties, events, css-properties, etc, are provided in their package folder. 
[List of all packages](https://github.com/wiredjs/wired-elements/tree/master/packages)

## Demo

Demo of all components is available at [wiredjs.com](https://wiredjs.com/showcase.html).

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

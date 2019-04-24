# wired-elements 👉 [wiredjs.com](https://wiredjs.com)
Wired Elements is a series of basic UI Elements that have a hand drawn look. These can be used for wireframes, mockups, or just the fun hand-drawn look. 

![alt Preview](https://i.imgur.com/qttPllg.png)

The elements are drawn with enough randomness that no two renderings will be exactly the same - just like two separate hand drawn shapes. 

## Try now
Play with wired-elements:

[Wired Elements](https://codesandbox.io/s/p77jkn13nq)

#### Try it with a framework

[Wired Elements in Vue](https://glitch.com/~wired-elements-vue)

[Wired Elements in React](https://codesandbox.io/embed/xrll5wyl8w)

[Wired Elements in Svelte](https://svelte.dev/repl?version=3.0.0&gist=abf635c032a20c3e18b510c7a15eaac5)


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


## Usage

Import into your module script:
```javascript
import { WiredButton, WiredInput } from "wired-elements"
```

Alternatively, load a bundled version from the [dist folder](https://github.com/wiredjs/wired-elements/tree/master/packages/all/dist) or from CDN:

```html
<script src="https://unpkg.com/wired-elements@latest/dist/wired-elements.bundled.js"></script>
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

## Dev Environment

View the [Dev environment page](https://github.com/wiredjs/wired-elements/wiki/Dev-Environment) for instructions.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
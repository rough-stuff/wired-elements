# wired-icon

WebComponent which allows you to easily create Hand drawn version of any SVG Icon!

![image](https://user-images.githubusercontent.com/7101875/78978100-8391f100-7b19-11ea-943f-2842e2b5ea44.png)

This library is the base for the other library **wired-mat-icon**.

For the complete set of wired-elements: [wiredjs.com](http://wiredjs.com/)

## Installation
Simply Add wired-icon to your project:
```
npm i wired-icon
```
## Wired Icon for flexibility!
Wired Icon is converting any svg into its hand drawn, sketchy version.

### Usage
Import wired-icon definition into your HTML page:
```html
<script type="module" src="wired-icon/lib/wired-icon.js"></script>
```
Or into your module script:
```javascript
import "wired-icon";
```

Use it in your web page:
```html
<wired-icon
  config='{"fillStyle": "zigzag", "fill": "#A4C639", "hachureGap": "1.5", "fillWeight": "0.9"}'>
  <svg width="70" height="70" viewBox="-1 -1 24 26">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 0 0 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
  </svg>
</wired-icon>
```

### Properties / Attributes

**config** - Optional object to configure the effect. You can refer to the complete list on [roughjs wiki](https://github.com/pshihn/rough/wiki#options). You can also see the examples for inspiration.
Default rougness is set to 0.1, which seems to be the most appropriate value most of the time for icons.

## Ligth DOM

### Supported elements
You must provide the elements you want to convert inside an svg tag, with only one level of depth.
Valid light DOM:
```html
<svg viewbox='0 0 24 24'>
  <rect x="3" y="8" width="18" height="13"></rect>
  <rect x="1" y="3" width="22" height="5"></rect>
  <line x1="10" y1="12" x2="14" y2="12"></line>
</svg>
```

Invalid light DOM n°1 (no SVG tag to wrap the element):
```html
<circle cx="16.5" cy="5.5" r="2.5"/>
```

Invalid light DOM n°2 (the <rect> elements inside the <g> element won't be transformed):
```html
<svg viewbox='0 0 24 24'>
  <g>
    <rect x="3" y="8" width="18" height="13"></rect>
    <rect x="1" y="3" width="22" height="5"></rect>
  </g>
  <line x1="10" y1="12" x2="14" y2="12"></line>
</svg>
```

Wired Icon is able to transform the following svg tags:
 - circle
 - ellipse
 - line
 - path
 - polygon
 - polyline (/!\ will be same result as polygon)
 - rect
Any other tag will be included "as is" in the converted svg.

### SVG icon sources

Here is an opinionated & non exhaustive list of high quality and free icons which are compatible with wired-icon:

**Google** - [Material Design SVG Icon Repo](https://github.com/google/material-design-icons/blob/master/sprites/svg-sprite). Also check wired-mat-icon to speed up tests!

**Vaadin** - [Vaadin Icons](https://vaadin.com/components/vaadin-icons/html-examples)

## Styling
You can define CSS width and height on the wired-icon element or on the svg tag to scale it.
To change color, prefere the config properties.


## Extra flavours

### Use inside a wired-button

Of course you can use Wired Icon inside a Wired Button!

```html
<style>
  .icon-button{
    display: block;
    width: 30px;
  }
</style>
<wired-icon-button elevation="5">
  <wired-icon
    class="icon-button"
    config='{"strokeWidth": "0.3", "fill": "blue", "fillStyle": "cross-hatch"}'
  >
    <svg viewbox="-1 -1 18 18">
      <path d="M9 11h-3c0-3 1.6-4 2.7-4.6 0.4-0.2 0.7-0.4 0.9-0.6 0.5-0.5 0.3-1.2 0.2-1.4-0.3-0.7-1-1.4-2.3-1.4-2.1 0-2.5 1.9-2.5 2.3l-3-0.4c0.2-1.7 1.7-4.9 5.5-4.9 2.3 0 4.3 1.3 5.1 3.2 0.7 1.7 0.4 3.5-0.8 4.7-0.5 0.5-1.1 0.8-1.6 1.1-0.9 0.5-1.2 1-1.2 2z"/>
      <path d="M9.5 14c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"/>
    </svg>
  </wired-icon>
</wired-icon-button>
```

## Accessibility

We recommand specifying an aria label in your svg for accessibility. Here is how to procede:

```html
<wired-icon class="icon"
    config='{"fill": "gray", "fillStyle": "cross-hatch", "hachureGap": "1.5", "fillWeight": "0.5", "roughness": "0.1"}'>
    <svg viewBox="0 0 24 24" aria-labelledby="icon-label">
      <title id="icon-label">Icon of a pet footprint</title>
      <circle cx="4.5" cy="9.5" r="2.5"/>
      <circle cx="9" cy="5.5" r="2.5"/>
      <circle cx="15" cy="5.5" r="2.5"/>
      <circle cx="19.5" cy="9.5" r="2.5"/>
      <path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"/>
    </svg>
  </wired-icon>
```

## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

#### Contributor

Adrien Pennamen

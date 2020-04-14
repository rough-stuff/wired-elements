# wired-icon

WebComponent which allows you to easily create Hand drawn version of Material Icons, and more!

![image](https://user-images.githubusercontent.com/7101875/78978100-8391f100-7b19-11ea-943f-2842e2b5ea44.png)

This library comes with two different flavors: one for the fun, and the other for perfs !

For the complete set of wired-elements: [wiredjs.com](http://wiredjs.com/)

## Installation
Add wired-icon to your project, then refer to either wired-icon (perfs) or wired-mat-icon (fun):
```
npm i wired-icon
```
## Wired Icon for perfs!
As the bundle size can be critically important, Wired Icon is flexible enough to let you define the iconset you want to use, and therefore ship just what you need.

### Usage
Import wired-icon definition into your HTML page:
```html
<script type="module" src="wired-icon/lib/wired-icon.js"></script>
```
Or into your module script:
```javascript
import { WiredIcon } from "wired-icon"
```

Use it in your web page:
```html
<wired-icon
    path="M7 2v11h3v9l7-12h-4l4-8z"
    config='{"fillStyle": "zigzag", "fill": "green", "hachureGap": "1.5", "fillWeight": "0.9"}'>
</wired-icon>
```

### Properties / Attributes

**path** - String representing the svg path of your icon. You can find SVG path on the [Material Design SVG Icon Repo](https://github.com/google/material-design-icons/blob/master/sprites/svg-sprite). 

**config** - Optional object to configure the effect. You can refer to the complete list on [roughjs wiki](https://github.com/pshihn/rough/wiki#options). You can also see the examples for inspiration.
Default rougness is set to 0.1, which seems to be the appropriate value most of the time.

**aria** - Gives a name for accessibility to your icon.


## Wired Material Icon for fun!
As you can have a hard time finding the right svg path, we bundled almost all the material icons in an iconset, that ships with the library! You can refer to the complete list on the website of [material.io](https://material.io/resources/icons/).

### Usage
Import wired-mat-icon definition into your HTML page:
```html
<script type="module" src="wired-icon/lib/wired-mat-icon.js"></script>
```
Or into your module script:
```javascript
import { WiredMatIcon } from "wired-icon/lib/wired-mat-icon"
```

Use it in your web page:
```html
<wired-mat-icon
    icon="android"
    config='{"fillStyle": "zigzag", "fill": "green", "hachureGap": "1.5", "fillWeight": "0.9"}'>
</wired-mat-icon>
```

### Properties / Attributes

**icon** - String representing a material icon. Refer to the complete list on [material.io](https://material.io/resources/icons/). It is also used for the aria label if the aria property is not defined. Note that if path is defined, this property will be ignored.

The other attributes are the same as for WiredIcon, with 

**config** - Optional object to configure the effect. You can refer to the complete list on [roughjs wiki](https://github.com/pshihn/rough/wiki#options). You can also see the examples for inspiration.
Default rougness is set to 0.1, which seems to be the appropriate value most of the time.

**path** - /!\ Shouldn't be set if icon is used. Consider using wired icon instead. If a path is set, then the icon property is ignored.

**aria** - Gives a name for accessibility to your icon. If none is provide, the **icon** property is used.


## Styling
You can define CSS width and height on the wired-mat-icon element to scale it.
To change color, use the config property.

## Advanced use
### I want to define my own iconset !
Because we know that bundle size is what matters, you can define your own iconset, which prevents you from using the WiredMatIcon. You can check the `iconset-sample` provided in the library to design your own iconset.
Here is one way to go, with the small utility `iconsetLoader` provided in the library:

```javascript
import { WiredIcon } from 'wired-icon';
import { iconsetLoader } from 'wired-icon/lib/iconset';

const ICON_SET = {
    "menu":"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    "wifi":"M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
};

const findSvgPath = iconsetLoader(ICON_SET);
```

```html
<wired-icon path=${findSvgPath('wifi')}></wired-icon>
```

You can also hardcode the path once you found it!
And if you want to create your own webcomponent to encapsulate this logic, take a look at the implementation of WiredMatIcon ! It uses inheritence, but you can reach a similar result with composition.
Finally, if you fill like creating your own svg path, please git it a try ;) 


## Extra flavours
### Material Look
You can have the material look with the following config:
```javascript
const matConfig = {stroke: "transparent", fill: "black", fillStyle: "solid"};
```
```html
<wired-mat-icon icon="laptop" config=${JSON.stringify(matConfig)}></wired-mat-icon>
```

### Use inside a wired-button
You can use Wired Icon / Wired Material Icon inside a Wired Button \o/
```html
<wired-icon-button elevation="5">
    <wired-mat-icon icon="autorenew"
        config='{"strokeWidth": "0.3", "fill": "black"}'
    ></wired-mat-icon>
</wired-icon-button>
```

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

#### Contributor

Adrien Pennamen

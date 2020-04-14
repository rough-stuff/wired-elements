# wired-icon

Hand drawn version of Material Icon, based on [Material Design SVG Icon](https://github.com/google/material-design-icons/blob/master/sprites/svg-sprite)

![image](https://user-images.githubusercontent.com/7101875/78978100-8391f100-7b19-11ea-943f-2842e2b5ea44.png)

For the complete set of wired-elements: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-icon to your project:
```
npm i wired-icon
```
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
    icon="settings"
    config='{"fillStyle": "zigzag", "fill": "green", "hachureGap": "1.5", "fillWeight": "0.9"}'>
</wired-icon>
```

## Properties

**icon** - String representing an icon. You can pick any icon available on [material icon](https://material.io/resources/icons/).

**config** - Optional object to configure the effect. You can refer to the complete list on [roughjs wiki](https://github.com/pshihn/rough/wiki#options). You can also see the examples for inspiration.


## Styling
You can define CSS width and height on the wired-icon element to scale it.
To change color, use the config property.

## Extras
### I want more icons !
Because we know that bundle size is what matters, only the most common icons are available by default (list below).
Therefore, we provide a way to had custom icons by setting the path.
And we also provide a utility function to get the path of all the material icon !



### Material Look
You can have the material look with the following config:
```javascript
{"stroke": "transparent", "fill": "black", "fillStyle": "solid"}
```
### Use inside a wired-button
You can use Wired Icon inside a Wired Button
```html
<wired-icon-button elevation="5">
    <wired-icon icon="autorenew"
        config='{"strokeWidth": "0.3", "fill": "blue", "fillStyle": "cross-hatch"}'
    ></wired-icon>
</wired-icon-button>
```

## Default Iconset included
#### A
accessibility, accessible, account_box, add, alarm, apps, audiotrack, autorenew
#### B
battery_full, block, bluetooth, build
#### C
call, clear, cloud, computer, contact_mail, contact_phone
#### D,E,F,G,I,K,L
done, edit, flash_on, folder, gps_fixed, image, keyboard, language
#### M,P
mail, map, menu, message, person, photo_camera
#### R,S
refresh, room, search, send, settings, share, smartphone, star
#### T,V,W
timer, tv, visibility, visibility_off, wifi


## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

#### Contributor

Adrien Pennamen

# wired-video

A hand-drawn sketchy looking video player component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-video to your project:
```
npm i wired-video
```
Import wired-video definition into your HTML page:
```html
<script type="module" src="wired-video/lib/wired-video.js"></script>
```
Or into your module script:
```javascript
import { WiredImage } from "wired-video"
```

Use it in your web page:
```html
<wired-video autoplay muted loop src="video.mp4"></wired-video>
```

## Properties

**src** - URL of the image.

**autoplay** - Boolean value indicating if the video should auto-play

**loop** - Loop the video (boolean value)

**muted** - Play the video muted (boolean value)

**playsinline** - Play the video inline on mobile devices (boolean value)

## Custom CSS Variables

**--wired-video-highlight-color** Color of the progress bar and the knob on the volume control.



## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
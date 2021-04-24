# wired-video

A hand-drawn sketchy looking video player component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-elements to your JavaScript project:
```
npm i wired-elements
```

Import module in your code:

```javascript
import { WiredVideo } from 'wired-elements';
// or
import { WiredVideo } from 'wired-elements/lib/wired-video.js';
```

Or load directly into your HTML page:
```html
<script type="module" src="https://unpkg.com/wired-elements/lib/wired-video.js"></script>
```

Use it in your HTML:
```html
<wired-video autoplay muted loop src="video.mp4"></wired-video>
```

## Properties

**src** - URL of the video.

**autoplay** - Boolean value indicating if the video should auto-play

**loop** - Loop the video (boolean value)

**muted** - Play the video muted (boolean value)

**playsinline** - Play the video inline on mobile devices (boolean value)

## Custom CSS Variables

**--wired-video-highlight-color** Color of the progress bar and the knob on the volume control.



## License
[MIT License](https://github.com/rough-stuff/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
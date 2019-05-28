![wired calendar](https://wiredjs.github.io/wired-elements/images/calendar.gif)

# wired-calendar

Calendar control with a hand-drawn, wireframe like, style.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-calendar to your project:
```
npm i wired-calendar
```
Import wired-calendar definition into your HTML page:
```html
<script type="module" src="wired-calendar/lib/wired-calendar.js"></script>
```
Or into your module script:
```javascript
import { WiredCalendar } from "wired-calendar"
```

Use it in your web page:
```html
<wired-calendar id="my-calendar-1" selected="Apr 18, 2019">
</wired-calendar>
```

## Properties

**disabled** - disables the calendar selector. Default value is false.

**selected** - pre selects a date highlighted in the calendar.

**firstdate** - lower limit of valid dates.

**lastdate** - higher limit of valid dates.

**initials** - set to use only the initial in the names of the week days.

**value** - javascript object that contains the selected Date object and the
corresponing formated text.

**format** - sets the javascript function to format a Date object into a
formated text.


## Custom CSS Variables

**--wired-calendar-bg** Background color of the calendar. Default white.

**--wired-calendar-color** Calendar sketch line color. Default black.

**--wired-calendar-selected-color** Selected date sketch line color. Default red.

## Events
**selected** event fired when a date is selected by the user.

## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

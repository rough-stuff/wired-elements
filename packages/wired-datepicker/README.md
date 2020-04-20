# wired-datepicker

Datepicker control with a hand-drawn, wireframe like, style.
Based on an original implementation by Eduardo Martinez: wired-calendar

The API and look is almost the same as wired-calendar, but implementation is completely different, based on CSS Grid and with inheritence from wired-card.

For demo and view the complete set of wired-elements: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-datepicker to your project:
```
npm i wired-datepicker
```
Import wired-datepicker definition into your HTML page:
```html
<script type="module" src="wired-datepicker/lib/wired-datepicker.js"></script>
```
Or into your module script:
```javascript
import { WiredDatepicker } from "wired-datepicker"
```

Use it in your web page:
```html
<wired-datepicker selected="Jul 4, 2019">
</wired-datepicker>
```

## Properties / Attributes

**elevation** - Numerical number between 1-5 (inclusive) - sets the elevation of the card. Default is 1.

**selected** - Optional string value that will be parsed as Date. Pre selects a date highlighted in the calendar.

**firstdate** - Optional string value that will be parsed as Date. Lower limit of valid dates.

**lastdate** - Optional string value that will be parsed as Date. Higher limit of valid dates.

**locale** - Optional string value to set locale used in calendar, for day names, month names and internal use. Default to browser locale. [Supported format](https://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15)

**disabled** - Boolean value that disables the calendar selector. Default value is false.

**initials** - Boolean value to use initials in weekdays names. Default value is false.

## Read only Properties

**value** - javascript object that contains the selected Date object and the
corresponing formated text.


## Custom CSS Variables

**--wired-datepicker-bg** Background color of the calendar. Default white.

**--wired-datepicker-color** Calendar sketch line color. Default black.

**--wired-datepicker-selected-color** Selected date sketch line color. Default red.

**--wired-datepicker-disabled-color** Font color days not belonging to calendar actual month. Default lightgray.

## Events
**selected** event fired when a date is selected by the user.

**attr-error** event fired if a non parseable date string is given for selected, firstdate or lastdate attribute/property.


## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

#### Contributor

Eduardo Martinez
Adrien Pennamen

# wired-datepicker
![image](https://user-images.githubusercontent.com/7101875/80147109-41ee5500-85b3-11ea-9020-9bf4fa034814.png)

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
import { WiredDatePicker } from "wired-datepicker"
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

**fill** (bonus) - Same as the fill property on wired-card. You can use rgba(x,y,z,0.1) color for example to have a nice effect on the calendar.

## Read only Properties

**value** - javascript object that contains the selected Date object and the
corresponing formated text.


## Custom CSS Variables

### Main variables
You can easily customize the whole calendar with those 4 variables
**--wired-datepicker-primary-color** - Reference for other variables like text color or stroke color. Default black.
**--wired-datepicker-secondary-color** - Reference for other variables, like calendar background. Default white.
**--wired-datepicker-contrast-color** - Reference for the selected attribute. Default red.
**--wired-datepicker-disabled-color** - Reference for disabled element. Default lightgray.

### Complementary variables for the calendar
**--wired-datepicker-text-color** - Text color to use in the calendar. Default (--wired-datepicker-primary-color).
**--wired-datepicker-stroke-color** - Color for stroke color in the calendar, like the contour. Default var(--wired-datepicker-primary-color);

### Variables for the indicators
**--wired-datepicker-indicator-color:** - Color for the selectors. Default(--wired-datepicker-primary-color, black);
**--wired-datepicker-indicator-disabled-color:** - Color for the selectors when disabled. Default(--wired-datepicker-disabled-color, lightgray);
**--wired-datepicker-indicator-hover-bg-color:** - Color for the background of the selectors on hover and focus. Default(--wired-datepicker-primary-color, black);
**--wired-datepicker-indicator-hover-color:** - Color for the selectors on hover and focus. Default(--wired-datepicker-secondary-color, white);

### Variables for the cell
**--wired-datepicker-cell-selected-stroke-color** - Color when the cell is selected (only one per datepicker). Default(--wired-datepicker-contrast-color, red);
**--wired-datepicker-cell-selected-focus-stroke-color** - Color when the selected cell has also focus. Default(--wired-datepicker-contrast-color, red);
**--wired-datepicker-cell-selected-stroke-width** - Width of the stroke when selected. Default(1.5);
**--wired-datepicker-cell-selected-focus-stroke-width** - Width of the stroke when selected and focused. Default(2.5);
**--wired-datepicker-cell-disabled-color** - Color of the text when cell is disabled. Default(--wired-datepicker-disabled-color, lightgray);
**--wired-datepicker-cell-hover-color** - Color of the text when cell has hover (and is not selected or disabled). Default(--wired-datepicker-secondary-color, white);
**--wired-datepicker-cell-hover-bg-color** - Color of the background when cell has hover. Default(--wired-datepicker-primary-color, black);

__Example__: To get the black and white calendar with yellow selected stroke, use the following:
```html
<style>
--wired-datepicker-primary-color: white;
--wired-datepicker-secondary-color: black;
--wired-datepicker-contrast-color: yellow;
--wired-datepicker-disabled-color: darkred;
</style>
```

## Events
**selected** event fired when a date is selected by the user.

**attr-error** event fired if a non parseable date string is given for selected, firstdate or lastdate attribute/property.


## License
[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

#### Contributor

Eduardo Martinez
Adrien Pennamen

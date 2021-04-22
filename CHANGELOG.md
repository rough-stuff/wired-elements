# Change Log

All notable changes to this project will be documented in this file.

## [3.0.0] - April 21, 2021
* Moved from lit-elment to lit 2.0 as the base Web Component class
* Moved multi-package monorepo to a single package that has all the elements exported

## [2.0.0] - October 19, 2019
* New component: **wired-video** Video player with the hand-drawn look
* New component: **wired-calendar** is a calendar component contributed by [@elingerojo](https://github.com/elingerojo)
* New component: **wired-dialog** emulates dialogs
* New component: **wired-divider** Draws a sketchy horizontal line between two sections
* New component: **wired-image** Image component that frames the image in a sketchy border
* New component: **wired-link** Akin to `<a>` tag, a link with href, and a sketchy underline
* New component: **wired-search-input** is a text input emulating a search input
* **wired-card** now supports a sketchy filled background
* **wired-slider** is more accessible, now built on top of input range.
* Elements are more responsive to size changes using the Resize observer
* **wired-textarea** does not auto-grow anymore. 


## [1.0.0] - April 24, 2019

* New component: **wired-fab** mimics the floating action button proposed in Material design
* New component: **wired-spinner** to show pending progress in a sketchy way
* New component: **wired-tabs** 
![wired tabs](https://wiredjs.github.io/wired-elements/images/tabs.png)
* Selection in Combo and List is now shown with a sketchy zig-zag fill in the style of [rough.js](https://roughjs.com)
![wired combo](https://wiredjs.github.io/wired-elements/images/combo.gif)
* Sketchy fill also applied to progress boxes
* Better Accessibility on all components
* Refactored code to use TypeScript and latest [Lit Element](https://lit-element.polymer-project.org/)

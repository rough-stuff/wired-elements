# wired-elements
Wired Elements is a series of basic UI Elements that have a hand drawn look. These can be used for wireframes, mockups, or just the fun hand-drawn look. 

![alt Preview](https://i.imgur.com/qttPllg.png)

The elements are drawn with enough randomness that no two renderings will be exactly the same - just like two separate hand drawn shapes. 

[Author](https://twitter.com/preetster)

[Wired components on Webcomponents.org](https://www.webcomponents.org/collection/wiredjs/wired-elements)

[wiredjs.com](http://wiredjs.com)



<!--
```
<custom-element-demo>
  <template>
    <link href="https://fonts.googleapis.com/css?family=Shadows+Into+Light" rel="stylesheet">
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="../wired-input/wired-input.html">
    <link rel="import" href="../wired-radio-group/wired-radio-group.html">
    <link rel="import" href="../wired-radio/wired-radio.html">
    <link rel="import" href="../wired-card/wired-card.html">
    <link rel="import" href="../wired-button/wired-button.html">
    <style is="custom-style">
    wired-card {
        max-width: 500px;
        padding: 10px;
        margin: 5px 0;
      }

      .form {
        font-family: 'Shadows Into Light', sans-serif;
        font-weight: 400;
      }

      wired-input {
        width: 400px;
        margin: 5px 0;
      }

      wired-radio {
        display: inline-block;
        margin: 5px;
      }
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<wired-card class="form">
  <h3>Form Title</h3>
  <div>
    <wired-input placeholder="full name"></wired-input>
  </div>
  <div>
    <wired-input placeholder="location"></wired-input>
  </div>
  <wired-radio-group>
    <wired-radio name="male" text="male"></wired-radio>
    <wired-radio name="female" text="female"></wired-radio>
  </wired-radio-group>
  <div>
    <wired-button text="Cancel"></wired-button>
    <wired-button text="Save"></wired-button>
  </div>
</wired-card>
```

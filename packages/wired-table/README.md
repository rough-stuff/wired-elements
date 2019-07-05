![wired table](https://wiredjs.github.io/wired-elements/images/table.png)

# wired-table

Hand-drawn sketchy Table web component.

For demo and view the complete set of wired-elememts: [wiredjs.com](http://wiredjs.com/)

## Usage

Add wired-table to your project:

```
npm i wired-table
```

Import wired-table definition into your HTML page:

```html
<script type="module" src="wired-table/lib/wired-table.js"></script>
```

Or into your module script:

```javascript
import { WiredTable } from "wired-table";
```

Use it in your web page:

```html
<wired-table>
  <wired-columns>
    <wired-column name="id">#</wired-column>
    <wired-column name="name">Name</wired-column>
    <wired-column name="company">Company</wired-column>
    <wired-column name="title">Title</wired-column>
    <wired-column name="email">Email</wired-column>
    <wired-column name="phone">Phone</wired-column>
  </wired-columns>

  <wired-row>
    <wired-cell column="id">100</wired-cell>
    <wired-cell column="name">Jim Halpert</wired-cell>
    <wired-cell column="company">Dunder Mifflin</wired-cell>
    <wired-cell column="title">Sales Representative</wired-cell>
    <wired-cell column="email">jhalpert@dmpaper.co</wired-cell>
    <wired-cell column="phone">900-555-8820</wired-cell>
  </wired-row>

  <wired-row>
    <wired-cell column="id">101</wired-cell>
    <wired-cell column="name">Michael Scott</wired-cell>
    <wired-cell column="company">Dunder Mifflin</wired-cell>
    <wired-cell column="title">Regional Manager</wired-cell>
    <wired-cell column="email">mscott@dmpaper.co</wired-cell>
    <wired-cell column="phone">900-555-8820</wired-cell>
  </wired-row>
</wired-table>
```

## WiredTable Properties

**name** - Unique identifier for that tab. Used for selection.

## WiredColumns Properties

**name** - Unique identifier for that tab. Used for selection.

## WiredColumn Properties

**name** - Unique identifier for that tab. Used for selection.

**label** - Text to show in the tab. Defaulst to the **name** property.

## WiredRow Properties

**name** - Unique identifier for that tab. Used for selection.

## WiredCell Properties

**column** - Used to associate the cell to any column values.

## Custom CSS Variables

**--wired-item-selected-bg** Background color of the selected tab.

**--wired-item-selected-color** Text color of the selected tab.

## License

[MIT License](https://github.com/wiredjs/wired-elements/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)

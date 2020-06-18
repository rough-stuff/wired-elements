# FAQ for maintaining wired-mat-icon
## How to generate the iconset-full.ts ?
Go to the generate folder and run:
`npm run generate`

It should launch a web server on port 5000
Go to http://localhost:5000, and you should have a textarea with the content of iconset-full.ts

## What is the file not_converted.svg ?
Some of the original SVG had more than just a simple path element.
Therefore they were not compatible with rouhjs path, or it would have been a lot more code just to support those few icons. So they lie there, waiting for someone to find a solution for them :)

Some were also having a different viewbox '0 0 26 24' instead of '0 0 24 24'.. Not worth the added code !

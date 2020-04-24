# Dev environment
The wired-datepicker comes with unit tests to assess the solidity of state handling and keyboard event handling.

This is the recommended setup to develop. Launch the following commands in 3 different shells.
## Run TypeScript compiler in watch mode
``lerna run tsc:watch --scope=wired-datepicker``

## Run Karma in watch mode
``npm run test:watch``

## Launch the example page
``npm run dev`` 
And browse to the following page:
``http://127.0.0.1:8081/examples/datepicker.html``

import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const input = 'lib/wired-lib.js';

export default [
  {
    input,
    output: {
      file: 'lib/wired-lib.esm.js',
      format: 'esm'
    },
    plugins: [resolve(), terser()]
  }
];
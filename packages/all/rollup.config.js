import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const input = 'lib/wired-elements.js';

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input,
    output: {
      file: 'lib/wired-elements-esm.js',
      format: 'esm'
    },
    onwarn,
    plugins: [
      resolve(),
      terser({
        output: {
          comments: false
        }
      })
    ]
  },
  {
    input,
    output: {
      file: 'lib/wired-elements-iife.js',
      format: 'iife',
      name: 'WiredElements'
    },
    onwarn,
    plugins: [
      resolve(),
      terser({
        output: {
          comments: false
        }
      })
    ]
  },
  {
    input,
    output: {
      file: 'lib/wired-elements-cjs.js',
      format: 'cjs'
    },
    onwarn,
    plugins: [
      resolve(),
      terser({
        output: {
          comments: false
        }
      })
    ]
  }
];
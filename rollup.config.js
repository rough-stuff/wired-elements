import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

const input = 'packages/all/lib/wired-elements.js';
const outDir = 'packages/all/lib';

function onwarn(warning) {
  if (warning.code === 'THIS_IS_UNDEFINED')
    return;
  console.error(warning.message);
}

export default [
  {
    input,
    output: {
      file: `${outDir}/wired-elements-bundled.js`,
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
      file: `${outDir}/wired-elements-bundled.cjs.js`,
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
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';
const outFolder = 'packages/all/dist';

export default [
  {
    input: 'packages/all/wired-elements.js',
    output: {
      file: `${outFolder}/wired-elements.bundled.js`,
      format: 'iife',
      name: 'WiredElements'
    },
    plugins: [resolve()]
  },
  {
    input: 'packages/all/wired-elements.js',
    output: {
      file: `${outFolder}/wired-elements.bundled.min.js`,
      format: 'iife',
      name: 'WiredElements'
    },
    plugins: [resolve(), minify({ comments: false })]
  }
];
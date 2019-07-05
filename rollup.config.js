import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const outFolder = "packages/all/dist";

function onwarn(warning) {
  if (warning.code === "THIS_IS_UNDEFINED") return;
  console.error(warning.message);
}

export default [
  {
    input: "packages/all/lib/wired-elements.js",
    output: {
      file: `${outFolder}/wired-elements.bundled.js`,
      format: "esm",
      name: "WiredElements"
    },
    onwarn,
    plugins: [resolve(), terser()]
  }
];
